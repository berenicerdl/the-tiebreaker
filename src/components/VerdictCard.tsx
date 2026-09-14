import React, { useState } from 'react';
import { Award, HelpCircle, ShieldAlert, CheckCircle2, Coins, Sparkles, ArrowRight, Check } from 'lucide-react';
import { DecisionAnalysis } from '../types';
import { TranslationStrings } from '../data/translations';

interface VerdictCardProps {
  analysis: DecisionAnalysis;
  t: TranslationStrings;
  language: 'en' | 'es';
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

export const VerdictCard: React.FC<VerdictCardProps> = ({
  analysis,
  t,
  language,
  onUpdateAnalysis,
}) => {
  const { tiebreakerVerdict, options } = analysis;
  const [isFlipping, setIsFlipping] = useState(false);
  const [coinResult, setCoinResult] = useState<string | null>(null);

  const handleFlipCoin = () => {
    setIsFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      // Pick random option among the options
      const randomIdx = Math.floor(Math.random() * options.length);
      const chosen = options[randomIdx];
      setCoinResult(chosen.name);
      setIsFlipping(false);
    }, 1200);
  };

  const handleCommitChoice = (optionId: string) => {
    onUpdateAnalysis({
      ...analysis,
      chosenOptionId: optionId,
      isDecided: true,
    });
  };

  return (
    <div className="space-y-6">
      {/* Main Recommended Verdict Banner */}
      <div
        id="verdict-banner"
        className="relative overflow-hidden rounded-2xl border border-amber-300 bg-gradient-to-br from-amber-500/10 via-amber-100/50 to-stone-50 p-6 shadow-sm sm:p-8"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div>
            <div className="inline-flex items-center gap-1.5 rounded-full bg-amber-600 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-white shadow-2xs">
              <Award className="h-3.5 w-3.5" />
              <span>{t.verdictTitle}</span>
            </div>
            <h2 className="mt-3 font-serif text-2xl font-bold tracking-tight text-stone-950 sm:text-3xl">
              {tiebreakerVerdict.verdictHeadline}
            </h2>
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs font-medium text-stone-500">
                {language === 'es' ? 'Opción Recomendada:' : 'Recommended Path:'}
              </span>
              <span className="rounded-md bg-stone-900 px-2.5 py-0.5 text-xs font-bold text-amber-300">
                {tiebreakerVerdict.recommendedOptionName}
              </span>
            </div>
          </div>

          {/* Commitment status button */}
          <div className="shrink-0">
            {analysis.isDecided ? (
              <div className="flex items-center gap-1.5 rounded-xl border border-emerald-300 bg-emerald-50 px-3.5 py-2 text-xs font-semibold text-emerald-800">
                <CheckCircle2 className="h-4 w-4 text-emerald-600" />
                <span>
                  {t.decidedBadge}: {options.find((o) => o.id === analysis.chosenOptionId)?.name || tiebreakerVerdict.recommendedOptionName}
                </span>
              </div>
            ) : (
              <div className="rounded-xl border border-stone-200/90 bg-white/90 p-3 shadow-2xs">
                <span className="block text-[11px] font-semibold text-stone-600">
                  {t.selectWinnerPrompt}
                </span>
                <div className="mt-2 flex flex-wrap gap-1.5">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleCommitChoice(opt.id)}
                      className="rounded-lg border border-stone-300 bg-stone-50 px-2.5 py-1 text-xs font-semibold text-stone-800 transition hover:border-amber-600 hover:bg-amber-600 hover:text-white"
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Reasoning Narrative */}
        <p className="mt-4 text-sm leading-relaxed text-stone-700 sm:text-base">
          {tiebreakerVerdict.reasoning}
        </p>
      </div>

      {/* The Crux Question & The Gut-Check Quadrant */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* The Deciding Question */}
        <div
          id="crux-question-card"
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <HelpCircle className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {t.theCruxQuestion}
            </h3>
          </div>
          <p className="mt-3 font-serif text-base italic leading-relaxed text-stone-800 sm:text-lg">
            &ldquo;{tiebreakerVerdict.theDecidingQuestion}&rdquo;
          </p>
          <p className="mt-3 text-xs text-stone-500">
            {language === 'es'
              ? 'Si respondes con honestidad a esta única pregunta, el resto de variables encajan en su sitio.'
              : 'Answer this single question with total candor, and the surrounding trade-offs resolve themselves.'}
          </p>
        </div>

        {/* The Gut Check */}
        <div
          id="gut-check-card"
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-stone-100 text-stone-800">
              <Sparkles className="h-4 w-4 text-amber-600" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {t.gutCheck}
            </h3>
          </div>
          <p className="mt-3 text-sm leading-relaxed text-stone-700">
            {tiebreakerVerdict.gutCheckTest}
          </p>
          <p className="mt-3 text-xs text-stone-500">
            {language === 'es'
              ? 'La lógica pesa los datos, pero tu instinto ya conoce el desenlace que realmente deseas tolerar.'
              : 'Logic measures data, but your subconscious already knows which consequence you are truly prepared to own.'}
          </p>
        </div>
      </div>

      {/* Interactive Coin Flip Simulator */}
      <div
        id="coin-simulator-card"
        className="rounded-2xl border border-amber-200/80 bg-stone-50 p-6 sm:p-7"
      >
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3">
            <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-amber-600 text-stone-100 shadow-sm">
              <Coins className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-serif text-base font-bold text-stone-900">
                {t.flipCoinPrompt}
              </h4>
              <p className="text-xs text-stone-600">
                {language === 'es'
                  ? 'Freud aconsejaba lanzar una moneda: en el segundo que vuela, sabrás exactamente qué resultado esperas en secreto.'
                  : 'Sigmund Freud advised coin flips not to follow the coin, but to reveal what your heart secretly hoped while it was in the air.'}
              </p>
            </div>
          </div>

          <button
            id="flip-coin-btn"
            type="button"
            onClick={handleFlipCoin}
            disabled={isFlipping}
            className="flex shrink-0 items-center gap-2 rounded-xl bg-stone-900 px-4 py-2.5 text-xs font-semibold text-white shadow-xs transition hover:bg-stone-800 active:scale-95 disabled:opacity-50"
          >
            <Coins className={`h-4 w-4 ${isFlipping ? 'animate-spin text-amber-400' : ''}`} />
            <span>{isFlipping ? (language === 'es' ? 'Volando en el aire...' : 'Flipping...') : t.flipCoinButton}</span>
          </button>
        </div>

        {/* Coin result animation box */}
        {coinResult && (
          <div className="mt-4 rounded-xl border border-amber-300 bg-white p-4 text-center sm:text-left">
            <div className="flex flex-col items-center justify-between gap-2 sm:flex-row">
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold uppercase tracking-wider text-amber-800">
                  {t.coinResult}
                </span>
                <span className="rounded-md bg-amber-100 px-3 py-1 font-serif text-sm font-bold text-amber-900">
                  {coinResult}
                </span>
              </div>
              <span className="text-xs italic text-stone-500">
                {t.coinGutCheckPrompt}
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Risk Hedging & Immediate 48-Hour Steps */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Risk Hedging */}
        <div
          id="risk-hedging-card"
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-rose-50 text-rose-700">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {t.riskHedging}
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {tiebreakerVerdict.riskHedgingStrategies.map((strategy, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-rose-100 text-[10px] font-bold text-rose-800">
                  {idx + 1}
                </span>
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Immediate Steps */}
        <div
          id="immediate-steps-card"
          className="rounded-2xl border border-stone-200 bg-white p-6 shadow-2xs"
        >
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-emerald-50 text-emerald-700">
              <CheckCircle2 className="h-4 w-4" />
            </div>
            <h3 className="font-serif text-lg font-bold text-stone-900">
              {t.immediateSteps}
            </h3>
          </div>
          <ul className="mt-4 space-y-2.5">
            {tiebreakerVerdict.nextActionableSteps.map((step, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-stone-700">
                <span className="mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-full bg-emerald-100 text-[10px] font-bold text-emerald-800">
                  {idx + 1}
                </span>
                <span>{step}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
