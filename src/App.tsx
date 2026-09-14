import React, { useState, useEffect } from 'react';
import {
  Scale,
  Award,
  ThumbsUp,
  Table,
  Layers,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Share2,
} from 'lucide-react';
import { DecisionAnalysis, ViewTab } from './types';
import { translations, TranslationStrings } from './data/translations';
import { Navbar } from './components/Navbar';
import { DecisionInputForm } from './components/DecisionInputForm';
import { VerdictCard } from './components/VerdictCard';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { DecisionHistoryModal } from './components/DecisionHistoryModal';
import { FollowUpConsultant } from './components/FollowUpConsultant';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    const saved = localStorage.getItem('tiebreaker_lang');
    if (saved === 'es' || saved === 'en') return saved;
    return navigator.language.startsWith('es') ? 'es' : 'en';
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(() => {
    const saved = localStorage.getItem('tiebreaker_current');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [history, setHistory] = useState<DecisionAnalysis[]>(() => {
    const saved = localStorage.getItem('tiebreaker_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  const [activeTab, setActiveTab] = useState<ViewTab>('verdict');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [copied, setCopied] = useState(false);

  const t: TranslationStrings = translations[language];

  // Persist language
  useEffect(() => {
    localStorage.setItem('tiebreaker_lang', language);
  }, [language]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('tiebreaker_history', JSON.stringify(history));
  }, [history]);

  // Persist current analysis
  useEffect(() => {
    if (currentAnalysis) {
      localStorage.setItem('tiebreaker_current', JSON.stringify(currentAnalysis));
    } else {
      localStorage.removeItem('tiebreaker_current');
    }
  }, [currentAnalysis]);

  const handleToggleLanguage = (lang: 'en' | 'es') => {
    setLanguage(lang);
  };

  const handleNewDecision = () => {
    setCurrentAnalysis(null);
    setError(null);
    setActiveTab('verdict');
  };

  const handleAnalyzeDecision = async (formData: {
    dilemma: string;
    options: string[];
    priorities: string[];
    riskTolerance: 'conservative' | 'balanced' | 'bold';
  }) => {
    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma: formData.dilemma,
          options: formData.options,
          language,
          priorities: formData.priorities,
          riskTolerance: formData.riskTolerance,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || t.errorGeneric);
      }

      const data = await response.json();
      const newAnalysis: DecisionAnalysis = {
        ...data,
        id: `dec_${Date.now()}`,
        createdAt: new Date().toISOString(),
        dilemma: formData.dilemma,
      };

      // If the model auto-detected Spanish, match app language to ensure cohesive experience
      if (data.detectedLanguage === 'es' && language !== 'es') {
        setLanguage('es');
      } else if (data.detectedLanguage === 'en' && language !== 'en') {
        setLanguage('en');
      }

      setCurrentAnalysis(newAnalysis);
      setActiveTab('verdict');

      // Add to history (prevent duplicates)
      setHistory((prev) => [newAnalysis, ...prev.filter((h) => h.id !== newAnalysis.id)]);
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnalysis = (updated: DecisionAnalysis) => {
    setCurrentAnalysis(updated);
    setHistory((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
  };

  const handleDeleteDecision = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'es' ? '¿Borrar todo el historial?' : 'Clear all saved decisions?')) {
      setHistory([]);
      setCurrentAnalysis(null);
    }
  };

  const handleCopySummary = () => {
    if (!currentAnalysis) return;
    const isEs = language === 'es';

    let md = `# ${isEs ? 'Análisis de Decisión: The Tiebreaker' : 'Decision Analysis: The Tiebreaker'}\n\n`;
    md += `**${isEs ? 'Dilema' : 'Dilemma'}:** ${currentAnalysis.dilemma}\n`;
    md += `**${isEs ? 'Pregunta Clave' : 'Key Question'}:** ${currentAnalysis.primaryQuestion}\n\n`;
    md += `## ${isEs ? 'El Veredicto' : 'The Tiebreaker Verdict'}\n`;
    md += `**${isEs ? 'Recomendación' : 'Recommended Path'}:** ${currentAnalysis.tiebreakerVerdict.recommendedOptionName}\n`;
    md += `> ${currentAnalysis.tiebreakerVerdict.verdictHeadline}\n\n`;
    md += `${currentAnalysis.tiebreakerVerdict.reasoning}\n\n`;
    md += `### ${isEs ? 'La Pregunta Decisiva' : 'The Deciding Question'}\n`;
    md += `"${currentAnalysis.tiebreakerVerdict.theDecidingQuestion}"\n\n`;

    md += `## ${isEs ? 'Opciones Evaluadas' : 'Evaluated Options'}\n`;
    currentAnalysis.options.forEach((opt) => {
      md += `### ${opt.name}\n_${opt.tagline}_\n\n`;
      md += `**Pros:**\n`;
      opt.pros.forEach((p) => {
        md += `- [${p.category}] ${p.text} (+${p.impact} pts)\n`;
      });
      md += `\n**Cons:**\n`;
      opt.cons.forEach((c) => {
        md += `- [${c.category}] ${c.text} (-${c.impact} pts)\n`;
      });
      md += `\n`;
    });

    md += `## ${isEs ? 'Pasos Inmediatos (Próximas 48 Horas)' : 'Immediate Action Steps (Next 48 Hours)'}\n`;
    currentAnalysis.tiebreakerVerdict.nextActionableSteps.forEach((s, idx) => {
      md += `${idx + 1}. ${s}\n`;
    });

    navigator.clipboard.writeText(md);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  return (
    <div className="min-h-screen bg-stone-100/70 text-stone-900 selection:bg-amber-500 selection:text-white flex flex-col font-sans">
      {/* Global Navbar */}
      <Navbar
        t={t}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {error && (
          <div className="mx-auto max-w-4xl px-4 pt-6">
            <div className="flex items-center gap-2.5 rounded-xl border border-rose-300 bg-rose-50 p-4 text-xs sm:text-sm text-rose-800 shadow-2xs">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-600" />
              <div className="flex-1">
                <span className="font-semibold">{t.errorGeneric}</span>
                <p className="mt-0.5 text-xs text-rose-700">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="font-bold text-rose-900 hover:opacity-75"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {!currentAnalysis ? (
          /* Decision Input View */
          <DecisionInputForm
            t={t}
            language={language}
            onSubmit={handleAnalyzeDecision}
            isLoading={isLoading}
          />
        ) : (
          /* Decision Analysis Workspace */
          <div className="mx-auto max-w-6xl px-4 py-8 sm:px-6 lg:px-8 space-y-6">
            {/* Top Back / Action Bar */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between border-b border-stone-200 pb-4">
              <button
                type="button"
                onClick={handleNewDecision}
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-600 hover:text-stone-900 transition"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>{language === 'es' ? 'Evaluar otra decisión' : 'Evaluate another decision'}</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 shadow-2xs hover:bg-stone-50 transition"
                >
                  {copied ? (
                    <>
                      <Check className="h-3.5 w-3.5 text-emerald-600" />
                      <span className="text-emerald-700">{t.copied}</span>
                    </>
                  ) : (
                    <>
                      <Copy className="h-3.5 w-3.5 text-stone-500" />
                      <span>{t.exportSummary}</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* Dilemma Header Hero Card */}
            <div className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs sm:p-7">
              <span className="rounded-md bg-stone-100 px-2.5 py-1 text-[11px] font-bold text-stone-600 uppercase tracking-wider">
                {language === 'es' ? 'Dilema Analizado' : 'Analyzed Dilemma'}
              </span>
              <h2 className="mt-2 font-serif text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
                {currentAnalysis.primaryQuestion || currentAnalysis.dilemma}
              </h2>
              <p className="mt-2 text-xs sm:text-sm text-stone-600 leading-relaxed max-w-4xl">
                {currentAnalysis.executiveSummary}
              </p>

              {/* Options Badges overview */}
              <div className="mt-5 flex flex-wrap items-center gap-2 border-t border-stone-100 pt-4">
                <span className="text-xs font-medium text-stone-500">
                  {language === 'es' ? 'Opciones contrastadas:' : 'Contrasting Options:'}
                </span>
                {currentAnalysis.options.map((opt) => {
                  const isRec = opt.id === currentAnalysis.tiebreakerVerdict.recommendedOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`inline-flex items-center gap-1.5 rounded-lg px-2.5 py-1 text-xs font-semibold ${
                        isRec
                          ? 'border border-amber-300 bg-amber-50 text-amber-900'
                          : 'border border-stone-200 bg-stone-50 text-stone-700'
                      }`}
                    >
                      {isRec && <Award className="h-3 w-3 text-amber-600" />}
                      <span>{opt.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multi-Tab Navigation Controls */}
            <div className="flex overflow-x-auto rounded-xl border border-stone-200 bg-white p-1 shadow-2xs">
              <button
                type="button"
                onClick={() => setActiveTab('verdict')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold sm:text-sm whitespace-nowrap transition ${
                  activeTab === 'verdict'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Award className="h-4 w-4" />
                <span>{t.tabs.verdict}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('pros_cons')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold sm:text-sm whitespace-nowrap transition ${
                  activeTab === 'pros_cons'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <ThumbsUp className="h-4 w-4" />
                <span>{t.tabs.prosCons}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('comparison')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold sm:text-sm whitespace-nowrap transition ${
                  activeTab === 'comparison'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Table className="h-4 w-4" />
                <span>{t.tabs.comparison}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('swot')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold sm:text-sm whitespace-nowrap transition ${
                  activeTab === 'swot'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <Layers className="h-4 w-4" />
                <span>{t.tabs.swot}</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-1.5 rounded-lg px-3.5 py-2 text-xs font-semibold sm:text-sm whitespace-nowrap transition ${
                  activeTab === 'all'
                    ? 'bg-amber-600 text-white shadow-2xs'
                    : 'text-stone-600 hover:text-stone-900 hover:bg-stone-50'
                }`}
              >
                <FileText className="h-4 w-4" />
                <span>{t.tabs.all}</span>
              </button>
            </div>

            {/* Dynamic Tab Views */}
            <div className="space-y-8">
              {(activeTab === 'verdict' || activeTab === 'all') && (
                <section>
                  {activeTab === 'all' && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-stone-900">
                        1. {t.tabs.verdict}
                      </span>
                    </div>
                  )}
                  <VerdictCard
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                    onUpdateAnalysis={handleUpdateAnalysis}
                  />
                </section>
              )}

              {(activeTab === 'pros_cons' || activeTab === 'all') && (
                <section className={activeTab === 'all' ? 'border-t border-stone-200 pt-8' : ''}>
                  {activeTab === 'all' && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-stone-900">
                        2. {t.tabs.prosCons}
                      </span>
                    </div>
                  )}
                  <ProsConsView
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                    onUpdateAnalysis={handleUpdateAnalysis}
                  />
                </section>
              )}

              {(activeTab === 'comparison' || activeTab === 'all') && (
                <section className={activeTab === 'all' ? 'border-t border-stone-200 pt-8' : ''}>
                  {activeTab === 'all' && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-stone-900">
                        3. {t.tabs.comparison}
                      </span>
                    </div>
                  )}
                  <ComparisonTableView
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                  />
                </section>
              )}

              {(activeTab === 'swot' || activeTab === 'all') && (
                <section className={activeTab === 'all' ? 'border-t border-stone-200 pt-8' : ''}>
                  {activeTab === 'all' && (
                    <div className="mb-3 flex items-center gap-2">
                      <span className="font-serif text-lg font-bold text-stone-900">
                        4. {t.tabs.swot}
                      </span>
                    </div>
                  )}
                  <SwotView
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                  />
                </section>
              )}

              {/* Follow-up Consultant AI Assistant */}
              <section className="border-t border-stone-200 pt-6">
                <FollowUpConsultant
                  analysis={currentAnalysis}
                  t={t}
                  language={language}
                />
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Decision History Modal */}
      <DecisionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={(item) => {
          setCurrentAnalysis(item);
          setActiveTab('verdict');
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearHistory={handleClearHistory}
        t={t}
        language={language}
      />

      {/* Minimal Footer */}
      <footer className="border-t border-stone-200 bg-stone-50 py-6 text-center text-xs text-stone-500">
        <div className="mx-auto max-w-7xl px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-1.5 font-medium text-stone-700">
            <Scale className="h-4 w-4 text-amber-600" />
            <span>The Tiebreaker</span>
            <span>—</span>
            <span className="text-stone-500">
              {language === 'es' ? 'Claridad Definitiva en Decisiones' : 'Definitive Decision Clarity'}
            </span>
          </div>
          <p className="text-stone-400">
            {language === 'es'
              ? 'Potenciado por Gemini AI • Soporte bilingüe en Español e Inglés'
              : 'Powered by Gemini AI • Bilingual support in English & Spanish'}
          </p>
        </div>
      </footer>
    </div>
  );
}
