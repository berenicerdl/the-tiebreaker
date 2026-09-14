import React, { useState } from 'react';
import {
  Award,
  HelpCircle,
  ShieldAlert,
  CheckCircle2,
  Coins,
  Sparkles,
  ArrowRight,
  Check,
  Calendar,
} from 'lucide-react';
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
  const [completedSteps, setCompletedSteps] = useState<number[]>([]);

  const handleFlipCoin = () => {
    setIsFlipping(true);
    setCoinResult(null);

    setTimeout(() => {
      const randomIdx = Math.floor(Math.random() * options.length);
      const chosen = options[randomIdx];
      setCoinResult(chosen.name);
      setIsFlipping(false);
    }, 900);
  };

  const handleCommitChoice = (optionId: string) => {
    onUpdateAnalysis({
      ...analysis,
      chosenOptionId: optionId,
      isDecided: true,
    });
  };

  const handleUndoCommitment = () => {
    onUpdateAnalysis({
      ...analysis,
      chosenOptionId: undefined,
      isDecided: false,
    });
  };

  const handleToggleStep = (stepIdx: number) => {
    if (completedSteps.includes(stepIdx)) {
      setCompletedSteps(completedSteps.filter((s) => s !== stepIdx));
    } else {
      setCompletedSteps([...completedSteps, stepIdx]);
    }
  };

  const chosenOption = options.find((o) => o.id === analysis.chosenOptionId);

  return (
    <div className="space-y-6">
      {/* Executive Verdict Hero Card */}
      <div
        id="verdict-banner"
        className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-6 sm:p-7 shadow-xl shadow-black/20"
      >
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between border-b border-[#2a2649] pb-5">
          <div className="space-y-2">
            <div className="inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-violet-600/20 to-fuchsia-600/20 border border-violet-500/30 px-3 py-1 text-xs font-bold text-violet-300 uppercase tracking-wider">
              <Award className="h-3.5 w-3.5 text-fuchsia-400" />
              <span>{t.verdictTitle}</span>
            </div>

            <h2 className="font-display text-2xl font-extrabold tracking-tight text-white sm:text-3xl">
              {tiebreakerVerdict.verdictHeadline}
            </h2>

            <div className="flex items-center gap-2 pt-1">
              <span className="text-xs text-[#8e8aa8] font-medium">
                {language === 'es' ? 'Veredicto sugerido:' : 'Tiebreaker Path:'}
              </span>
              <span className="rounded-xl border border-violet-500/40 bg-[#28224c] px-3 py-1 text-xs font-bold text-violet-200">
                {tiebreakerVerdict.recommendedOptionName}
              </span>
            </div>
          </div>

          {/* Commitment Action Control */}
          <div className="shrink-0">
            {analysis.isDecided ? (
              <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/30 p-3.5 text-right space-y-1">
                <div className="flex items-center justify-end gap-1.5 text-xs font-bold text-emerald-400">
                  <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                  <span>{t.decidedBadge}</span>
                </div>
                <p className="text-xs text-white font-bold">
                  {chosenOption?.name || tiebreakerVerdict.recommendedOptionName}
                </p>
                <button
                  type="button"
                  onClick={handleUndoCommitment}
                  className="text-[11px] text-[#8e8aa8] hover:text-white underline transition"
                >
                  {t.undoSelection}
                </button>
              </div>
            ) : (
              <div className="rounded-xl border border-[#2b274c] bg-[#16142a] p-3 space-y-2">
                <span className="block text-[11px] font-bold text-[#9b97b6]">
                  {t.selectWinnerPrompt}
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {options.map((opt) => (
                    <button
                      key={opt.id}
                      type="button"
                      onClick={() => handleCommitChoice(opt.id)}
                      className="rounded-lg border border-[#322d57] bg-[#1f1c39] px-2.5 py-1 text-xs font-bold text-white transition hover:border-violet-500 hover:bg-gradient-to-r hover:from-violet-600 hover:to-fuchsia-600"
                    >
                      {opt.name}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Narrative Reasoning */}
        <p className="mt-5 text-sm leading-relaxed text-[#cfcce2] sm:text-base">
          {tiebreakerVerdict.reasoning}
        </p>
      </div>

      {/* The Crux Question & The Intuitive Gut-Check */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* The Deciding Question */}
        <div
          id="crux-question-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-lg shadow-black/20 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#272349] text-violet-400">
                <HelpCircle className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.theCruxQuestion}
              </h3>
            </div>
            <p className="font-display text-base font-semibold italic leading-relaxed text-white sm:text-lg">
              &ldquo;{tiebreakerVerdict.theDecidingQuestion}&rdquo;
            </p>
          </div>
          <p className="mt-4 border-t border-[#2a264a] pt-3 text-[11px] text-[#7a7599]">
            {language === 'es'
              ? 'Responde con franqueza a esta única pregunta: todo lo demás son distracciones secundarias.'
              : 'Answer this single question with candor; the remaining complications will naturally dissolve.'}
          </p>
        </div>

        {/* The Intuitive Gut Check */}
        <div
          id="gut-check-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-lg shadow-black/20 flex flex-col justify-between"
        >
          <div>
            <div className="flex items-center gap-2 mb-3">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#272349] text-fuchsia-400">
                <Sparkles className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.gutCheck}
              </h3>
            </div>
            <p className="text-sm leading-relaxed text-[#cfcce2]">
              {tiebreakerVerdict.gutCheckTest}
            </p>
          </div>
          <p className="mt-4 border-t border-[#2a264a] pt-3 text-[11px] text-[#7a7599]">
            {language === 'es'
              ? 'La lógica examina los datos, pero tu instinto ya conoce la consecuencia que realmente estás dispuesto a asumir.'
              : 'Logic analyzes data, but intuition already knows the trade-off you are truly willing to bear.'}
          </p>
        </div>
      </div>

      {/* Subconscious Decision Coin Flip Simulator */}
      <div
        id="coin-simulator-card"
        className="rounded-2xl border border-[#2c284f] bg-[#17152b] p-5 sm:p-6"
      >
        <div className="flex flex-col items-center justify-between gap-4 text-center sm:flex-row sm:text-left">
          <div className="flex items-center gap-3.5">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-500 text-white shadow-md shadow-violet-950/40">
              <Coins className={`h-5 w-5 ${isFlipping ? 'animate-spin' : ''}`} />
            </div>
            <div>
              <h4 className="text-sm font-bold text-white">
                {t.flipCoinPrompt}
              </h4>
              <p className="text-xs text-[#8e8aa8] max-w-xl">
                {language === 'es'
                  ? 'Freud explicaba que lanzar una moneda no es para obedecerla, sino para descubrir qué resultado esperabas en secreto mientras está en el aire.'
                  : 'Sigmund Freud noted that flipping a coin is not to abide by it, but to catch your subconscious hoping for a specific outcome mid-air.'}
              </p>
            </div>
          </div>

          <button
            id="flip-coin-btn"
            type="button"
            onClick={handleFlipCoin}
            disabled={isFlipping}
            className="shrink-0 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-4 py-2.5 text-xs font-bold text-white shadow-md shadow-violet-950/40 transition hover:opacity-95 disabled:opacity-40"
          >
            {isFlipping ? (language === 'es' ? 'En el aire...' : 'Flipping...') : t.flipCoinButton}
          </button>
        </div>

        {/* Revealed Outcome */}
        {coinResult && (
          <div className="mt-4 rounded-xl border border-[#352f5a] bg-[#1f1c39] p-4 flex flex-col sm:flex-row items-center justify-between gap-2.5 animate-in fade-in duration-200">
            <div className="flex items-center gap-2.5">
              <span className="text-[11px] font-bold uppercase tracking-wider text-[#9b97b6]">
                {t.coinResult}
              </span>
              <span className="rounded-lg bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1 font-display text-sm font-extrabold text-white">
                {coinResult}
              </span>
            </div>
            <p className="text-xs italic text-[#cfcce2]">
              {t.coinGutCheckPrompt}
            </p>
          </div>
        )}
      </div>

      {/* Immediate 48-Hour Action Plan & Risk Hedging */}
      <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
        {/* Next 48 Hours Action Checklist */}
        <div
          id="immediate-steps-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-lg shadow-black/20"
        >
          <div className="flex items-center justify-between mb-3.5 border-b border-[#2a264a] pb-3">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#272349] text-violet-400">
                <Calendar className="h-4 w-4" />
              </div>
              <h3 className="text-xs font-bold text-white uppercase tracking-wider">
                {t.immediateSteps}
              </h3>
            </div>
            <span className="text-[11px] text-[#7a7599]">
              {completedSteps.length} / {tiebreakerVerdict.nextActionableSteps.length} {language === 'es' ? 'completados' : 'done'}
            </span>
          </div>

          <ul className="space-y-2.5">
            {tiebreakerVerdict.nextActionableSteps.map((step, idx) => {
              const isChecked = completedSteps.includes(idx);
              return (
                <li
                  key={idx}
                  onClick={() => handleToggleStep(idx)}
                  className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cfcce2] cursor-pointer group select-none"
                >
                  <div
                    className={`mt-0.5 flex h-4 w-4 shrink-0 items-center justify-center rounded-md border transition-all ${
                      isChecked
                        ? 'border-violet-500 bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white'
                        : 'border-[#3f3a69] bg-[#16142a] group-hover:border-violet-400'
                    }`}
                  >
                    {isChecked && <Check className="h-3 w-3" />}
                  </div>
                  <span className={isChecked ? 'line-through text-[#656084]' : ''}>
                    {step}
                  </span>
                </li>
              );
            })}
          </ul>
        </div>

        {/* Risk Hedging */}
        <div
          id="risk-hedging-card"
          className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-lg shadow-black/20"
        >
          <div className="flex items-center gap-2 mb-3.5 border-b border-[#2a264a] pb-3">
            <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-[#272349] text-fuchsia-400">
              <ShieldAlert className="h-4 w-4" />
            </div>
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              {t.riskHedging}
            </h3>
          </div>

          <ul className="space-y-2.5">
            {tiebreakerVerdict.riskHedgingStrategies.map((strategy, idx) => (
              <li key={idx} className="flex items-start gap-2.5 text-xs sm:text-sm text-[#cfcce2]">
                <span className="mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-lg bg-[#28234c] text-[11px] font-bold text-violet-300">
                  {idx + 1}
                </span>
                <span>{strategy}</span>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};
