import React from 'react';
import { Table, Sparkles, TrendingUp } from 'lucide-react';
import { DecisionAnalysis } from '../types';
import { TranslationStrings } from '../data/translations';

interface ComparisonTableViewProps {
  analysis: DecisionAnalysis;
  t: TranslationStrings;
  language: 'en' | 'es';
}

export const ComparisonTableView: React.FC<ComparisonTableViewProps> = ({
  analysis,
  t,
  language,
}) => {
  const { comparisonCriteria, options, tiebreakerVerdict } = analysis;

  // Calculate weighted score for each option
  const weightedTotals: Record<string, { total: number; maxPossible: number; percentage: number }> = {};

  options.forEach((opt) => {
    let sum = 0;
    let max = 0;
    comparisonCriteria.forEach((crit) => {
      const scoreObj = crit.optionScores.find((s) => s.optionId === opt.id);
      const score = scoreObj ? scoreObj.score : 5;
      sum += score * crit.weight;
      max += 10 * crit.weight;
    });
    const percentage = max > 0 ? Math.round((sum / max) * 100) : 50;
    weightedTotals[opt.id] = { total: sum, maxPossible: max, percentage };
  });

  return (
    <div className="space-y-6">
      {/* Table Header Intro */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs sm:p-6">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
            <Table className="h-4 w-4" />
          </div>
          <div>
            <h3 className="font-serif text-lg font-bold text-stone-900 sm:text-xl">
              {t.comparisonTitle}
            </h3>
            <p className="text-xs text-stone-500 sm:text-sm">
              {t.comparisonSubtitle}
            </p>
          </div>
        </div>
      </div>

      {/* Comparison Matrix Table Card */}
      <div className="overflow-hidden rounded-2xl border border-stone-200 bg-white shadow-2xs">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-stone-200 bg-stone-50 text-stone-700">
              <tr>
                <th className="py-3.5 px-4 font-semibold w-1/3 min-w-[200px]">
                  {language === 'es' ? 'Criterio de Decisión' : 'Decision Dimension'}
                </th>
                <th className="py-3.5 px-3 font-semibold text-center w-20 min-w-[80px]">
                  {t.criterionWeight}
                </th>
                {options.map((opt) => {
                  const isRecommended = opt.id === tiebreakerVerdict.recommendedOptionId;
                  return (
                    <th
                      key={opt.id}
                      className={`py-3.5 px-4 font-bold min-w-[220px] ${
                        isRecommended ? 'bg-amber-50/60 text-amber-950' : 'text-stone-900'
                      }`}
                    >
                      <div className="flex items-center gap-1.5">
                        <span>{opt.name}</span>
                        {isRecommended && (
                          <span className="rounded-sm bg-amber-600 px-1.5 py-0.5 text-[10px] font-bold text-white uppercase">
                            {language === 'es' ? 'Recomendada' : 'Top Choice'}
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] font-normal text-stone-500 line-clamp-1">
                        {opt.tagline}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {comparisonCriteria.map((criterion, idx) => (
                <tr key={idx} className="hover:bg-stone-50/60 transition-colors">
                  <td className="py-4 px-4 align-top">
                    <span className="font-semibold text-stone-900">{criterion.name}</span>
                    <p className="mt-0.5 text-[11px] text-stone-500 leading-tight">
                      {criterion.description}
                    </p>
                  </td>
                  <td className="py-4 px-3 text-center align-top">
                    <span className="inline-flex items-center rounded-full bg-stone-100 px-2 py-0.5 text-xs font-bold text-stone-700">
                      {criterion.weight}x
                    </span>
                  </td>
                  {options.map((opt) => {
                    const scoreObj = criterion.optionScores.find((s) => s.optionId === opt.id);
                    const score = scoreObj ? scoreObj.score : 5;
                    const comment = scoreObj ? scoreObj.comment : '';
                    const isRecommended = opt.id === tiebreakerVerdict.recommendedOptionId;

                    return (
                      <td
                        key={opt.id}
                        className={`py-4 px-4 align-top ${
                          isRecommended ? 'bg-amber-50/30' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2">
                          <span
                            className={`flex h-6 w-6 items-center justify-center rounded-md font-bold text-xs ${
                              score >= 8
                                ? 'bg-emerald-100 text-emerald-800'
                                : score >= 5
                                ? 'bg-amber-100 text-amber-800'
                                : 'bg-rose-100 text-rose-800'
                            }`}
                          >
                            {score}
                          </span>
                          {/* Mini visual score progress bar */}
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-stone-100">
                            <div
                              className={`h-full rounded-full ${
                                score >= 8 ? 'bg-emerald-500' : score >= 5 ? 'bg-amber-500' : 'bg-rose-500'
                              }`}
                              style={{ width: `${score * 10}%` }}
                            />
                          </div>
                        </div>
                        {comment && (
                          <p className="mt-2 text-[11px] leading-relaxed text-stone-600">
                            {comment}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
            {/* Weighted Composite Totals Footer */}
            <tfoot className="border-t-2 border-stone-200 bg-stone-50/90 font-semibold">
              <tr>
                <td colSpan={2} className="py-4 px-4 text-stone-900 font-bold">
                  {language === 'es' ? 'Puntuación Ponderada Total' : 'Composite Weighted Score'}
                </td>
                {options.map((opt) => {
                  const data = weightedTotals[opt.id];
                  const isRecommended = opt.id === tiebreakerVerdict.recommendedOptionId;

                  return (
                    <td
                      key={opt.id}
                      className={`py-4 px-4 ${isRecommended ? 'bg-amber-100/50' : ''}`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-serif text-xl font-extrabold text-stone-950">
                          {data.percentage}%
                        </span>
                        <span className="text-[11px] text-stone-500">
                          ({data.total}/{data.maxPossible} pts)
                        </span>
                      </div>
                      <div className="mt-1.5 h-2 w-full overflow-hidden rounded-full bg-stone-200">
                        <div
                          className={`h-full rounded-full ${
                            isRecommended ? 'bg-amber-600' : 'bg-stone-700'
                          }`}
                          style={{ width: `${data.percentage}%` }}
                        />
                      </div>
                    </td>
                  );
                })}
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  );
};
