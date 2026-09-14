import React, { useState } from 'react';
import { MessageSquare, Send, AlertCircle, Loader2 } from 'lucide-react';
import { DecisionAnalysis } from '../types';
import { TranslationStrings } from '../data/translations';

interface FollowUpConsultantProps {
  analysis: DecisionAnalysis;
  t: TranslationStrings;
  language: 'en' | 'es';
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'assistant';
  text: string;
}

export const FollowUpConsultant: React.FC<FollowUpConsultantProps> = ({
  analysis,
  t,
  language,
}) => {
  const [question, setQuestion] = useState('');
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const quickPrompts =
    language === 'es'
      ? [
          '¿Cuál es el peor escenario si elijo la recomendada?',
          '¿Cómo puedo validar esta decisión en 14 días sin arriesgar demasiado?',
          '¿Qué pasaría si negocio una opción híbrida?',
        ]
      : [
          'What is the catastrophic downside if I take the recommendation?',
          'How can I prototype or de-risk this path within 14 days?',
          'Is there a viable hybrid middle-ground between these options?',
        ];

  const handleSendPrompt = (promptText: string) => {
    setQuestion(promptText);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!question.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `msg_${Date.now()}`,
      sender: 'user',
      text: question.trim(),
    };

    setMessages((prev) => [...prev, userMsg]);
    setQuestion('');
    setIsLoading(true);
    setError(null);

    try {
      const res = await fetch('/api/follow-up', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma: analysis.dilemma,
          question: userMsg.text,
          language: analysis.detectedLanguage || language,
          analysisContext: {
            recommendedOption: analysis.tiebreakerVerdict.recommendedOptionName,
            decidingQuestion: analysis.tiebreakerVerdict.theDecidingQuestion,
            options: analysis.options.map((o) => o.name),
          },
        }),
      });

      if (!res.ok) {
        throw new Error('Failed to get answer.');
      }

      const data = await res.json();
      const botMsg: ChatMessage = {
        id: `bot_${Date.now()}`,
        sender: 'assistant',
        text: data.answer || '',
      };
      setMessages((prev) => [...prev, botMsg]);
    } catch (err: any) {
      setError(err.message || 'Error reaching the Tiebreaker assistant.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 sm:p-6 shadow-xl shadow-black/20">
      <div className="flex items-center justify-between border-b border-[#2a264a] pb-3.5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40">
            <MessageSquare className="h-4 w-4" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-white">
              {language === 'es' ? 'Consultoría y Escenarios Hipotéticos' : 'Follow-Up Doubts & What-Ifs'}
            </h3>
            <p className="text-[11px] text-[#8e8aa8]">
              {language === 'es'
                ? 'Profundiza en cualquier aspecto, escenario o emoción con la IA.'
                : 'Drill down into hypothetical scenarios, emotional hesitation, or negotiations.'}
            </p>
          </div>
        </div>
      </div>

      {/* Suggested shortcuts / Prompts */}
      {messages.length === 0 && (
        <div className="mt-3.5">
          <span className="text-[10px] uppercase tracking-wider font-bold text-[#807b9f] block mb-2">
            {language === 'es' ? 'Preguntas sugeridas' : 'Suggested angles'}
          </span>
          <div className="flex flex-wrap gap-2">
            {quickPrompts.map((qp, i) => (
              <button
                key={i}
                type="button"
                onClick={() => handleSendPrompt(qp)}
                className="rounded-xl border border-[#2b274e] bg-[#16142a] px-3 py-1.5 text-[11px] font-medium text-[#cfcce2] hover:border-violet-500/50 hover:bg-[#221f3d] hover:text-white transition text-left"
              >
                {qp}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Messages history */}
      {messages.length > 0 && (
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-xl border border-[#2b274e] bg-[#16142a] p-3.5 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              <div
                className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white font-medium shadow-md shadow-violet-950/40'
                    : 'border border-[#322d56] bg-[#221f3d] text-[#f0edf9] shadow-sm'
                }`}
              >
                <span className="block text-[10px] font-bold uppercase tracking-wider mb-1 opacity-70">
                  {msg.sender === 'user'
                    ? language === 'es' ? 'Tú' : 'You'
                    : 'The Tiebreaker'}
                </span>
                <p className="whitespace-pre-wrap">{msg.text}</p>
              </div>
            </div>
          ))}

          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-violet-300 py-1.5">
              <Loader2 className="h-3.5 w-3.5 animate-spin text-fuchsia-400" />
              <span>{t.asking}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3.5 flex items-center gap-2 rounded-xl border border-rose-500/40 bg-rose-950/40 p-3 text-xs text-rose-300">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input query field */}
      <form onSubmit={handleSubmit} className="mt-4 flex gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.followUpQuestionPlaceholder}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-[#2e2a53] bg-[#151429] px-3.5 py-2.5 text-xs sm:text-sm text-white placeholder:text-[#5f5a81] focus:border-violet-500 focus:outline-none"
        />
        <button
          type="submit"
          disabled={!question.trim() || isLoading}
          className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-950/40 transition hover:opacity-90 disabled:opacity-30"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t.askFollowUp}</span>
        </button>
      </form>
    </div>
  );
};
