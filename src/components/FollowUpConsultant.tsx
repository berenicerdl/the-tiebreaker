import React, { useState } from 'react';
import { MessageSquare, Send, Sparkles, User, Bot, AlertCircle } from 'lucide-react';
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
    <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs sm:p-6">
      <div className="flex items-center gap-2">
        <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-800">
          <MessageSquare className="h-4 w-4 text-amber-600" />
        </div>
        <div>
          <h3 className="font-serif text-base font-bold text-stone-900 sm:text-lg">
            {language === 'es' ? 'Consultoría y Dudas Pendientes' : 'Ask Follow-Up Doubts'}
          </h3>
          <p className="text-xs text-stone-500">
            {language === 'es'
              ? 'Profundiza en cualquier aspecto, escenario hipotético o negociación con la IA.'
              : 'Drill down into hypothetical scenarios, emotional hesitation, or specific trade-offs.'}
          </p>
        </div>
      </div>

      {/* Messages history */}
      {messages.length > 0 && (
        <div className="mt-4 max-h-80 space-y-3 overflow-y-auto rounded-xl border border-stone-100 bg-stone-50/60 p-3 text-xs sm:text-sm">
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex items-start gap-2.5 ${
                msg.sender === 'user' ? 'justify-end' : 'justify-start'
              }`}
            >
              {msg.sender === 'assistant' && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-amber-600 text-white">
                  <Bot className="h-3.5 w-3.5" />
                </div>
              )}
              <div
                className={`max-w-[85%] rounded-xl px-3.5 py-2 leading-relaxed whitespace-pre-line ${
                  msg.sender === 'user'
                    ? 'bg-stone-900 text-white'
                    : 'border border-stone-200 bg-white text-stone-800 shadow-2xs'
                }`}
              >
                {msg.text}
              </div>
              {msg.sender === 'user' && (
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-stone-200 text-stone-700">
                  <User className="h-3.5 w-3.5" />
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex items-center gap-2 text-xs text-stone-500">
              <div className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-amber-600 border-t-transparent" />
              <span>{t.asking}</span>
            </div>
          )}
        </div>
      )}

      {error && (
        <div className="mt-3 flex items-center gap-2 rounded-lg border border-rose-200 bg-rose-50 p-2.5 text-xs text-rose-800">
          <AlertCircle className="h-4 w-4 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* Input query form */}
      <form onSubmit={handleSubmit} className="mt-4 flex items-center gap-2">
        <input
          type="text"
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          placeholder={t.followUpQuestionPlaceholder}
          disabled={isLoading}
          className="flex-1 rounded-xl border border-stone-300 bg-stone-50/80 px-3.5 py-2.5 text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500"
        />
        <button
          type="submit"
          disabled={isLoading || !question.trim()}
          className="flex items-center gap-1.5 rounded-xl bg-amber-600 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-amber-700 disabled:opacity-40"
        >
          <Send className="h-3.5 w-3.5" />
          <span className="hidden sm:inline">{t.askFollowUp}</span>
        </button>
      </form>
    </div>
  );
};
