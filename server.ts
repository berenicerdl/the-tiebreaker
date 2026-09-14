import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import { GoogleGenAI, Type } from "@google/genai";
import dotenv from "dotenv";

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = 3000;

app.use(express.json({ limit: "5mb" }));

// Lazy initialize Gemini client
function getGenAIClient(): GoogleGenAI {
  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error("GEMINI_API_KEY is not set in the environment variables.");
  }
  return new GoogleGenAI({
    apiKey,
    httpOptions: {
      headers: {
        "User-Agent": "aistudio-build",
      },
    },
  });
}

// Helper for resilient generation with fallback models
async function generateContentWithRetry(ai: GoogleGenAI, params: any) {
  const models = ["gemini-3.8-flash", "gemini-flash-latest", "gemini-3.1-flash-lite"];
  let lastError: any = null;

  for (const model of models) {
    for (let attempt = 1; attempt <= 2; attempt++) {
      try {
        const response = await ai.models.generateContent({
          ...params,
          model,
        });
        if (response.text) {
          return response;
        }
      } catch (err: any) {
        lastError = err;
        console.warn(`Model ${model} attempt ${attempt} failed:`, err?.message || err);
        // If 503 or rate limit, wait a short backoff before retry
        if (attempt === 1) {
          await new Promise((resolve) => setTimeout(resolve, 1500));
        }
      }
    }
  }

  throw lastError || new Error("Failed to generate content after retries.");
}

// Health check endpoint
app.get("/api/health", (_req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// Analyze decision endpoint
app.post("/api/analyze-decision", async (req, res) => {
  try {
    const { dilemma, options, language = "auto", priorities = [], riskTolerance = "balanced" } = req.body;

    if (!dilemma || typeof dilemma !== "string" || dilemma.trim().length === 0) {
      return res.status(400).json({ error: "Please provide a decision dilemma." });
    }

    const ai = getGenAIClient();

    const systemInstruction = `You are 'The Tiebreaker', an elite, empathetic, and relentlessly clear decision-making strategist and analyst.
Your mission is to help users break decision paralysis, evaluate trade-offs objectively, and find confident clarity.

Language Guidelines:
- If language is 'es' OR if the user's dilemma is predominantly in Spanish, output ALL text, labels, headlines, criteria, and analysis in natural, fluent SPANISH.
- If language is 'en' or English, output ALL text in ENGLISH.
- Return 'detectedLanguage' as 'es' or 'en'.

Analysis Methodology:
1. Identify 2 to 4 distinct, concrete options (either from the user's specified options or distilled from the dilemma). Each option must have a clear short title and a concise 1-sentence tagline.
2. Provide a thorough Pros & Cons analysis for EACH option:
   - 3 to 5 realistic Pros with impact ratings (1 to 5, where 5 is massive benefit) and clear categorization (e.g., Financial, Career, Well-being, Freedom, Risk, Effort).
   - 3 to 5 realistic Cons with impact ratings (1 to 5, where 5 is heavy drawback) and clear categorization.
3. Conduct a comprehensive SWOT Analysis for each option (Strengths, Weaknesses, Opportunities, Threats) with 2 to 4 punchy items per quadrant.
4. Construct a Comparison Criteria Matrix:
   - Provide 4 to 6 universal decision criteria relevant to this specific dilemma (e.g. Cost / ROI, Long-term Growth, Daily Stress & Happiness, Flexibility & Freedom, Risk Level, Implementation Speed).
   - For each criteria, assign an importance weight (1 to 5) and give each option a score from 1 to 10 with a brief 1-line justification.
5. Synthesize 'The Tiebreaker Verdict':
   - Pick the recommended option based on the trade-offs and user preferences.
   - Craft a compelling, empathetic verdict headline.
   - Provide high-leverage reasoning.
   - Craft "The Deciding Question" (El factor decisivo): the single pivotal question the user must ask themselves in the mirror to choose.
   - Provide a "Gut Check Test" (Prueba de la moneda / intuición): e.g., "Imagine you flip a coin and it forces you into Option A. Do you feel relieved or disappointed?".
   - Provide 2 to 4 risk-hedging actions to mitigate downsides.
   - Provide 3 concrete immediate next steps.`;

    const userPrompt = `Dilemma to resolve:
"${dilemma}"

${options && Array.isArray(options) && options.filter(Boolean).length > 0 ? `User-specified Options:\n${options.filter(Boolean).map((o: string, idx: number) => `- Option ${idx + 1}: ${o}`).join("\n")}` : "Extract or recommend the most sensible contrasting options to decide between."}

User Stated Priorities: ${priorities && priorities.length > 0 ? priorities.join(", ") : "Balanced / Not specified"}
Risk Tolerance: ${riskTolerance}
Requested Language Mode: ${language}

Generate a comprehensive decision breakdown matching the structured schema.`;

    const response = await generateContentWithRetry(ai, {
      contents: userPrompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            detectedLanguage: { type: Type.STRING, description: "'en' or 'es'" },
            primaryQuestion: { type: Type.STRING, description: "Refined, crystal-clear decision question" },
            executiveSummary: { type: Type.STRING, description: "2-3 sentence strategic overview of the dilemma" },
            options: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  id: { type: Type.STRING, description: "Short alphanumeric identifier like opt_1, opt_2" },
                  name: { type: Type.STRING, description: "Clear option name" },
                  tagline: { type: Type.STRING, description: "1-sentence summary of this path" },
                  pros: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        impact: { type: Type.INTEGER, description: "1 to 5" },
                        category: { type: Type.STRING },
                      },
                      required: ["id", "text", "impact", "category"],
                    },
                  },
                  cons: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        id: { type: Type.STRING },
                        text: { type: Type.STRING },
                        impact: { type: Type.INTEGER, description: "1 to 5" },
                        category: { type: Type.STRING },
                      },
                      required: ["id", "text", "impact", "category"],
                    },
                  },
                  swot: {
                    type: Type.OBJECT,
                    properties: {
                      strengths: { type: Type.ARRAY, items: { type: Type.STRING } },
                      weaknesses: { type: Type.ARRAY, items: { type: Type.STRING } },
                      opportunities: { type: Type.ARRAY, items: { type: Type.STRING } },
                      threats: { type: Type.ARRAY, items: { type: Type.STRING } },
                    },
                    required: ["strengths", "weaknesses", "opportunities", "threats"],
                  },
                  overallScore: { type: Type.INTEGER, description: "Calculated composite score 1 to 100" },
                },
                required: ["id", "name", "tagline", "pros", "cons", "swot", "overallScore"],
              },
            },
            comparisonCriteria: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  description: { type: Type.STRING },
                  weight: { type: Type.INTEGER, description: "Importance weight 1 to 5" },
                  optionScores: {
                    type: Type.ARRAY,
                    items: {
                      type: Type.OBJECT,
                      properties: {
                        optionId: { type: Type.STRING },
                        score: { type: Type.INTEGER, description: "Score 1 to 10" },
                        comment: { type: Type.STRING },
                      },
                      required: ["optionId", "score", "comment"],
                    },
                  },
                },
                required: ["name", "description", "weight", "optionScores"],
              },
            },
            tiebreakerVerdict: {
              type: Type.OBJECT,
              properties: {
                recommendedOptionId: { type: Type.STRING },
                recommendedOptionName: { type: Type.STRING },
                verdictHeadline: { type: Type.STRING },
                reasoning: { type: Type.STRING },
                theDecidingQuestion: { type: Type.STRING },
                gutCheckTest: { type: Type.STRING },
                riskHedgingStrategies: { type: Type.ARRAY, items: { type: Type.STRING } },
                nextActionableSteps: { type: Type.ARRAY, items: { type: Type.STRING } },
              },
              required: [
                "recommendedOptionId",
                "recommendedOptionName",
                "verdictHeadline",
                "reasoning",
                "theDecidingQuestion",
                "gutCheckTest",
                "riskHedgingStrategies",
                "nextActionableSteps",
              ],
            },
          },
          required: [
            "detectedLanguage",
            "primaryQuestion",
            "executiveSummary",
            "options",
            "comparisonCriteria",
            "tiebreakerVerdict",
          ],
        },
      },
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response generated from model.");
    }

    const parsed = JSON.parse(text);
    return res.json(parsed);
  } catch (error: any) {
    console.error("Error analyzing decision:", error);
    return res.status(500).json({
      error: error.message || "Failed to analyze decision with AI.",
    });
  }
});

// Follow-up deep dive advice endpoint
app.post("/api/follow-up", async (req, res) => {
  try {
    const { dilemma, question, analysisContext, language = "en" } = req.body;

    if (!question || typeof question !== "string") {
      return res.status(400).json({ error: "Follow-up question is required." });
    }

    const ai = getGenAIClient();

    const prompt = `Context:
Original Dilemma: "${dilemma}"
Language: ${language}
Key Analysis Summary: ${JSON.stringify(analysisContext || {})}

User's specific follow-up question / doubt:
"${question}"

Provide a direct, wise, actionable response helping the user clarify this specific concern. Be structured with 2-3 bullet points or concrete advice. Respond in the requested language (${language === "es" ? "Spanish" : "English"}).`;

    const response = await generateContentWithRetry(ai, {
      contents: prompt,
      config: {
        systemInstruction: "You are The Tiebreaker advisor. Provide concise, high-value, empathetic decision coaching.",
      },
    });

    return res.json({ answer: response.text });
  } catch (error: any) {
    console.error("Error in follow-up:", error);
    return res.status(500).json({ error: error.message || "Failed to answer follow-up." });
  }
});

// Server and Vite setup
async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    const { createServer: createViteServer } = await import("vite");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (_req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`The Tiebreaker server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
