import React, { useState } from 'react';
import { DecisionAnalysis, SWOTData } from '../types';
import { TranslationStrings } from '../data/translations';

interface SwotViewProps {
  analysis: DecisionAnalysis;
  t: TranslationStrings;
  language: 'en' | 'es';
}

export const SwotView: React.FC<SwotViewProps> = ({ analysis, t, language }) => {
  const [selectedOptionId, setSelectedOptionId] = useState<string>(
    analysis.options[0]?.id || ''
  );

  const activeOption =
    analysis.options.find((o) => o.id === selectedOptionId) || analysis.options[0];

  if (!activeOption) return null;

  const swot: SWOTData = activeOption.swot;

  return (
    <div className="space-y-5">
      {/* Option Selector Pills */}
      <div className="flex items-center justify-between border-b border-[#292548] pb-3">
        <div className="flex flex-wrap gap-2" role="tablist">
          {analysis.options.map((opt) => {
            const isActive = opt.id === activeOption.id;
            return (
              <button
                key={opt.id}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedOptionId(opt.id)}
                className={`rounded-xl px-4 py-2 text-xs font-bold transition-all ${
                  isActive
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40'
                    : 'border border-[#2b274e] bg-[#1a1831] text-[#9b97b6] hover:border-violet-500/40 hover:text-white'
                }`}
              >
                <span>{opt.name}</span>
              </button>
            );
          })}
        </div>
        <span className="text-[11px] text-[#7a7599] font-medium hidden sm:inline-block">
          {language === 'es' ? 'Cuadrante Estratégico Interno / Externo' : 'Internal vs External Matrix'}
        </span>
      </div>

      {/* Option Tagline Summary */}
      <div className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="rounded-lg bg-gradient-to-r from-violet-600/30 to-fuchsia-600/30 border border-violet-500/30 px-2.5 py-0.5 text-[10px] font-bold text-violet-300 uppercase tracking-wider">
              SWOT / DAFO
            </span>
            <h3 className="font-display text-xl font-bold text-white">
              {activeOption.name}
            </h3>
          </div>
          <p className="text-xs text-[#8e8aa8] mt-1">{activeOption.tagline}</p>
        </div>
      </div>

      {/* 2x2 Matrix Grid */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {/* Strengths (Internal Positive) */}
        <div
          id="swot-strengths-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20"
        >
          <div className="flex items-center justify-between border-b border-[#2a264a] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-violet-600/30 border border-violet-500/40 text-xs font-bold text-violet-300">
                S
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {t.swotStrengths}
              </h4>
            </div>
            <span className="text-[10px] text-violet-400 uppercase font-semibold">
              {language === 'es' ? 'Interno (+)' : 'Internal (+)'}
            </span>
          </div>
          <ul className="mt-3.5 space-y-2.5">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#cfcce2]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-violet-400" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses (Internal Negative) */}
        <div
          id="swot-weaknesses-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20"
        >
          <div className="flex items-center justify-between border-b border-[#2a264a] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-fuchsia-600/30 border border-fuchsia-500/40 text-xs font-bold text-fuchsia-300">
                W
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {t.swotWeaknesses}
              </h4>
            </div>
            <span className="text-[10px] text-fuchsia-400 uppercase font-semibold">
              {language === 'es' ? 'Interno (-)' : 'Internal (-)'}
            </span>
          </div>
          <ul className="mt-3.5 space-y-2.5">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#cfcce2]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-fuchsia-400" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities (External Positive) */}
        <div
          id="swot-opportunities-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20"
        >
          <div className="flex items-center justify-between border-b border-[#2a264a] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-indigo-600/30 border border-indigo-500/40 text-xs font-bold text-indigo-300">
                O
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {t.swotOpportunities}
              </h4>
            </div>
            <span className="text-[10px] text-indigo-400 uppercase font-semibold">
              {language === 'es' ? 'Externo (+)' : 'External (+)'}
            </span>
          </div>
          <ul className="mt-3.5 space-y-2.5">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#cfcce2]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-400" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats (External Negative) */}
        <div
          id="swot-threats-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20"
        >
          <div className="flex items-center justify-between border-b border-[#2a264a] pb-3">
            <div className="flex items-center gap-2.5">
              <span className="flex h-6 w-6 items-center justify-center rounded-lg bg-rose-600/30 border border-rose-500/40 text-xs font-bold text-rose-300">
                T
              </span>
              <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                {t.swotThreats}
              </h4>
            </div>
            <span className="text-[10px] text-rose-400 uppercase font-semibold">
              {language === 'es' ? 'Externo (-)' : 'External (-)'}
            </span>
          </div>
          <ul className="mt-3.5 space-y-2.5">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs text-[#cfcce2]">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-400" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
