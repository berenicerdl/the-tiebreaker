import React from 'react';
import { Table, Award } from 'lucide-react';
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
    <div className="space-y-5">
      {/* Header Info */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 border-b border-[#292548] pb-3">
        <div>
          <h3 className="font-display text-xl font-bold text-white">
            {t.comparisonTitle}
          </h3>
          <p className="text-xs text-[#8e8aa8] mt-0.5">
            {t.comparisonSubtitle}
          </p>
        </div>
        <div className="text-[11px] text-[#7a7599]">
          {language === 'es' ? 'Escala 1 (Crítico/Bajo) a 10 (Sobresaliente)' : 'Scored 1 (Low) to 10 (Superior)'}
        </div>
      </div>

      {/* Comparison Matrix Table Card: Modern Flat Dark Surface */}
      <div className="overflow-hidden rounded-2xl border border-[#2c284f] bg-[#1e1c35] shadow-xl shadow-black/20">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead className="border-b border-[#2a264a] bg-[#151429] text-[#9b97b6]">
              <tr>
                <th className="py-3.5 px-4 font-bold w-1/3 min-w-[200px] text-white">
                  {language === 'es' ? 'Dimensión de Evaluación' : 'Decision Dimension'}
                </th>
                <th className="py-3.5 px-3 font-bold text-center w-20 min-w-[70px]">
                  {t.criterionWeight}
                </th>
                {options.map((opt) => {
                  const isRecommended = opt.id === tiebreakerVerdict.recommendedOptionId;
                  return (
                    <th
                      key={opt.id}
                      className={`py-3.5 px-4 font-extrabold min-w-[200px] ${
                        isRecommended ? 'bg-[#252146] text-white' : 'text-[#cfcce2]'
                      }`}
                    >
                      <div className="flex items-center gap-2">
                        <span>{opt.name}</span>
                        {isRecommended && (
                          <span className="rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 px-2 py-0.5 text-[9px] font-extrabold text-white uppercase tracking-wider shadow-sm">
                            {language === 'es' ? 'Recomendada' : 'Top Choice'}
                          </span>
                        )}
                      </div>
                      <span className="block text-[11px] font-normal text-[#8e8aa8] line-clamp-1 mt-0.5">
                        {opt.tagline}
                      </span>
                    </th>
                  );
                })}
              </tr>
            </thead>
            <tbody className="divide-y divide-[#262244]">
              {comparisonCriteria.map((criterion, idx) => (
                <tr key={idx} className="hover:bg-[#23203e] transition-colors">
                  <td className="py-3.5 px-4 align-top">
                    <span className="font-bold text-white">{criterion.name}</span>
                    <p className="mt-0.5 text-[11px] text-[#8e8aa8] leading-tight">
                      {criterion.description}
                    </p>
                  </td>
                  <td className="py-3.5 px-3 text-center align-top">
                    <span className="inline-flex rounded-lg bg-[#272349] px-2 py-0.5 text-[11px] font-bold text-violet-300">
                      {criterion.weight}x
                    </span>
                  </td>
                  {options.map((opt) => {
                    const scoreObj = criterion.optionScores.find((s) => s.optionId === opt.id);
                    const score = scoreObj?.score || 5;
                    const rationale = scoreObj?.rationale || '';
                    const isRecommended = opt.id === tiebreakerVerdict.recommendedOptionId;

                    return (
                      <td
                        key={opt.id}
                        className={`py-3.5 px-4 align-top ${
                          isRecommended ? 'bg-[#221e3f]/60' : ''
                        }`}
                      >
                        <div className="flex items-center gap-2.5">
                          <span
                            className={`flex h-7 w-7 items-center justify-center rounded-lg font-display text-xs font-bold ${
                              score >= 8
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                                : score >= 5
                                ? 'bg-[#272349] text-violet-300'
                                : 'bg-[#1c1a32] text-[#706b90]'
                            }`}
                          >
                            {score}
                          </span>
                          <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-[#151429]">
                            <div
                              className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500"
                              style={{ width: `${(score / 10) * 100}%` }}
                            />
                          </div>
                        </div>
                        {rationale && (
                          <p className="mt-1.5 text-[11px] text-[#8e8aa8] leading-tight">
                            {rationale}
                          </p>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>

            {/* Bottom Cumulative Aggregation Row */}
            <tfoot className="border-t-2 border-[#2c284f] bg-[#16142a] font-bold">
              <tr>
                <td className="py-4 px-4 text-xs uppercase tracking-wider text-[#9b97b6]">
                  {language === 'es' ? 'Puntuación Total Ponderada' : 'Total Weighted Score'}
                </td>
                <td className="py-4 px-3 text-center text-xs text-[#706b90]">—</td>
                {options.map((opt) => {
                  const data = weightedTotals[opt.id];
                  const isRecommended = opt.id === tiebreakerVerdict.recommendedOptionId;
                  return (
                    <td
                      key={opt.id}
                      className={`py-4 px-4 ${
                        isRecommended ? 'bg-[#252146] text-white' : 'text-[#cfcce2]'
                      }`}
                    >
                      <div className="flex items-baseline gap-2">
                        <span className="font-display text-lg font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-violet-400 to-fuchsia-400">
                          {data.percentage}%
                        </span>
                        <span className="text-[11px] font-normal text-[#8e8aa8]">
                          ({data.total} / {data.maxPossible})
                        </span>
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
