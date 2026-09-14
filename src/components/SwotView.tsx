import React, { useState } from 'react';
import { Shield, AlertCircle, Compass, Zap, Layers } from 'lucide-react';
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
    <div className="space-y-6">
      {/* Option Selector Pills */}
      <div className="flex flex-wrap items-center gap-2 border-b border-stone-200 pb-3">
        {analysis.options.map((opt) => {
          const isActive = opt.id === activeOption.id;
          return (
            <button
              key={opt.id}
              type="button"
              onClick={() => setSelectedOptionId(opt.id)}
              className={`rounded-xl px-4 py-2 text-xs font-semibold sm:text-sm transition-all ${
                isActive
                  ? 'bg-amber-600 text-white shadow-xs'
                  : 'border border-stone-200 bg-white text-stone-700 hover:border-stone-300 hover:bg-stone-50'
              }`}
            >
              <span>{opt.name}</span>
            </button>
          );
        })}
      </div>

      {/* Option Header */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <span className="rounded-md bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700 uppercase tracking-wider">
                SWOT / DAFO
              </span>
              <h3 className="font-serif text-xl font-bold text-stone-900">
                {activeOption.name}
              </h3>
            </div>
            <p className="mt-1 text-xs text-stone-500 sm:text-sm">
              {activeOption.tagline}
            </p>
          </div>
          <div className="mt-2 text-xs text-stone-500 sm:mt-0">
            {language === 'es'
              ? 'Cuadrante Estratégico Interno / Externo'
              : 'Internal & External Strategic Matrix'}
          </div>
        </div>
      </div>

      {/* 2x2 SWOT Matrix Grid */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Strengths (Internal Positive) */}
        <div
          id="swot-strengths-card"
          className="rounded-2xl border border-emerald-200 bg-emerald-50/40 p-5 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
              <Shield className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-emerald-950">
                {t.swotStrengths}
              </h4>
              <span className="text-[11px] text-emerald-700">
                {language === 'es' ? 'Ventajas inherentes y activos clave' : 'Inherent advantages & proprietary assets'}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {swot.strengths.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-emerald-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses (Internal Negative) */}
        <div
          id="swot-weaknesses-card"
          className="rounded-2xl border border-rose-200 bg-rose-50/40 p-5 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
              <AlertCircle className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-rose-950">
                {t.swotWeaknesses}
              </h4>
              <span className="text-[11px] text-rose-700">
                {language === 'es' ? 'Vulnerabilidades y limitaciones' : 'Internal friction, gaps & limitations'}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {swot.weaknesses.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-rose-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Opportunities (External Positive) */}
        <div
          id="swot-opportunities-card"
          className="rounded-2xl border border-indigo-200 bg-indigo-50/40 p-5 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-indigo-100 text-indigo-800">
              <Zap className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-indigo-950">
                {t.swotOpportunities}
              </h4>
              <span className="text-[11px] text-indigo-700">
                {language === 'es' ? 'Oportunidades de mercado y expansión' : 'Favorable trends & strategic tailwinds'}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {swot.opportunities.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-indigo-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Threats (External Negative) */}
        <div
          id="swot-threats-card"
          className="rounded-2xl border border-amber-200 bg-amber-50/40 p-5 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <Compass className="h-4 w-4" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-amber-950">
                {t.swotThreats}
              </h4>
              <span className="text-[11px] text-amber-700">
                {language === 'es' ? 'Riesgos externos e incertidumbres' : 'External headwinds & unmitigated risks'}
              </span>
            </div>
          </div>
          <ul className="mt-4 space-y-2.5">
            {swot.threats.map((item, idx) => (
              <li key={idx} className="flex items-start gap-2 text-xs sm:text-sm text-stone-800">
                <span className="mt-1 h-1.5 w-1.5 shrink-0 rounded-full bg-amber-600" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
