import React, { useState } from 'react';
import { ThumbsUp, ThumbsDown, Plus, Trash2, Tag, Scale } from 'lucide-react';
import { DecisionAnalysis, DecisionOption, ProConItem } from '../types';
import { TranslationStrings } from '../data/translations';

interface ProsConsViewProps {
  analysis: DecisionAnalysis;
  t: TranslationStrings;
  language: 'en' | 'es';
  onUpdateAnalysis: (updated: DecisionAnalysis) => void;
}

export const ProsConsView: React.FC<ProsConsViewProps> = ({
  analysis,
  t,
  language,
  onUpdateAnalysis,
}) => {
  const [activeOptionId, setActiveOptionId] = useState<string>(
    analysis.options[0]?.id || ''
  );
  const [newProText, setNewProText] = useState('');
  const [newProImpact, setNewProImpact] = useState<number>(3);
  const [newConText, setNewConText] = useState('');
  const [newConImpact, setNewConImpact] = useState<number>(3);

  const activeOption =
    analysis.options.find((o) => o.id === activeOptionId) || analysis.options[0];

  const handleAddPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProText.trim() || !activeOption) return;

    const newPro: ProConItem = {
      id: `custom_pro_${Date.now()}`,
      text: newProText.trim(),
      impact: newProImpact,
      category: language === 'es' ? 'Personal' : 'Personal',
    };

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          pros: [...opt.pros, newPro],
        };
      }
      return opt;
    });

    onUpdateAnalysis({ ...analysis, options: updatedOptions });
    setNewProText('');
    setNewProImpact(3);
  };

  const handleAddCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConText.trim() || !activeOption) return;

    const newCon: ProConItem = {
      id: `custom_con_${Date.now()}`,
      text: newConText.trim(),
      impact: newConImpact,
      category: language === 'es' ? 'Personal' : 'Personal',
    };

    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          cons: [...opt.cons, newCon],
        };
      }
      return opt;
    });

    onUpdateAnalysis({ ...analysis, options: updatedOptions });
    setNewConText('');
    setNewConImpact(3);
  };

  const handleRemovePro = (proId: string) => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          pros: opt.pros.filter((p) => p.id !== proId),
        };
      }
      return opt;
    });
    onUpdateAnalysis({ ...analysis, options: updatedOptions });
  };

  const handleRemoveCon = (conId: string) => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id === activeOption.id) {
        return {
          ...opt,
          cons: opt.cons.filter((c) => c.id !== conId),
        };
      }
      return opt;
    });
    onUpdateAnalysis({ ...analysis, options: updatedOptions });
  };

  if (!activeOption) return null;

  const totalProWeight = activeOption.pros.reduce((acc, curr) => acc + curr.impact, 0);
  const totalConWeight = activeOption.cons.reduce((acc, curr) => acc + curr.impact, 0);
  const netAdvantage = totalProWeight - totalConWeight;

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
              onClick={() => setActiveOptionId(opt.id)}
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

      {/* Active Option Overview & Balance Bar */}
      <div className="rounded-2xl border border-stone-200 bg-white p-5 shadow-2xs">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h3 className="font-serif text-xl font-bold text-stone-900">
              {activeOption.name}
            </h3>
            <p className="text-xs text-stone-500 sm:text-sm">{activeOption.tagline}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-semibold">
            <div className="flex items-center gap-1.5 text-emerald-700">
              <ThumbsUp className="h-4 w-4" />
              <span>
                Pros: {activeOption.pros.length} ({language === 'es' ? 'Pts' : 'Pts'}: {totalProWeight})
              </span>
            </div>
            <div className="flex items-center gap-1.5 text-rose-700">
              <ThumbsDown className="h-4 w-4" />
              <span>
                {language === 'es' ? 'Contras' : 'Cons'}: {activeOption.cons.length} ({language === 'es' ? 'Pts' : 'Pts'}: {totalConWeight})
              </span>
            </div>
            <div
              className={`rounded-md px-2.5 py-1 text-xs font-bold ${
                netAdvantage > 0
                  ? 'bg-emerald-100 text-emerald-800'
                  : netAdvantage < 0
                  ? 'bg-rose-100 text-rose-800'
                  : 'bg-stone-100 text-stone-700'
              }`}
            >
              {language === 'es' ? 'Neto:' : 'Net:'} {netAdvantage > 0 ? `+${netAdvantage}` : netAdvantage}
            </div>
          </div>
        </div>

        {/* Visual Balance Bar */}
        <div className="mt-4">
          <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-stone-100">
            <div
              className="bg-emerald-500 transition-all duration-300"
              style={{
                width: `${
                  totalProWeight + totalConWeight > 0
                    ? (totalProWeight / (totalProWeight + totalConWeight)) * 100
                    : 50
                }%`,
              }}
            />
            <div
              className="bg-rose-500 transition-all duration-300"
              style={{
                width: `${
                  totalProWeight + totalConWeight > 0
                    ? (totalConWeight / (totalProWeight + totalConWeight)) * 100
                    : 50
                }%`,
              }}
            />
          </div>
        </div>
      </div>

      {/* Pros & Cons Columns */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pros Column */}
        <div className="rounded-2xl border border-emerald-200/80 bg-emerald-50/30 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-emerald-100 text-emerald-800">
                <ThumbsUp className="h-4 w-4" />
              </div>
              <h4 className="font-serif text-base font-bold text-emerald-950">
                {t.prosTitle}
              </h4>
            </div>
            <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-bold text-emerald-800">
              +{totalProWeight} pts
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {activeOption.pros.map((pro) => (
              <div
                key={pro.id}
                className="group flex items-start justify-between gap-3 rounded-xl border border-emerald-100 bg-white p-3 shadow-2xs transition hover:border-emerald-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600">
                      {pro.category}
                    </span>
                    <div className="flex items-center gap-0.5" title={`Impact: ${pro.impact}/5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            i < pro.impact ? 'bg-emerald-500' : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-stone-800 leading-snug">
                    {pro.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemovePro(pro.id)}
                  className="text-stone-300 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom Pro form */}
          <form onSubmit={handleAddPro} className="mt-4 space-y-2 border-t border-emerald-100 pt-3">
            <input
              type="text"
              value={newProText}
              onChange={(e) => setNewProText(e.target.value)}
              placeholder={t.customItemPlaceholder}
              className="w-full rounded-lg border border-emerald-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-emerald-600 focus:outline-hidden"
            />
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500">{t.impactWeight}:</span>
                <select
                  value={newProImpact}
                  onChange={(e) => setNewProImpact(Number(e.target.value))}
                  className="rounded border border-stone-200 bg-white px-1.5 py-0.5 text-xs text-stone-700"
                >
                  <option value={1}>1 - {language === 'es' ? 'Menor' : 'Low'}</option>
                  <option value={2}>2 - {language === 'es' ? 'Moderado' : 'Moderate'}</option>
                  <option value={3}>3 - {language === 'es' ? 'Importante' : 'Important'}</option>
                  <option value={4}>4 - {language === 'es' ? 'Muy Alto' : 'Very High'}</option>
                  <option value={5}>5 - {language === 'es' ? 'Crítico' : 'Critical'}</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!newProText.trim()}
                className="flex items-center gap-1 rounded-md bg-emerald-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-emerald-800 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t.addCustomPro}</span>
              </button>
            </div>
          </form>
        </div>

        {/* Cons Column */}
        <div className="rounded-2xl border border-rose-200/80 bg-rose-50/30 p-5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-rose-100 text-rose-800">
                <ThumbsDown className="h-4 w-4" />
              </div>
              <h4 className="font-serif text-base font-bold text-rose-950">
                {t.consTitle}
              </h4>
            </div>
            <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-bold text-rose-800">
              -{totalConWeight} pts
            </span>
          </div>

          <div className="mt-4 space-y-2.5">
            {activeOption.cons.map((con) => (
              <div
                key={con.id}
                className="group flex items-start justify-between gap-3 rounded-xl border border-rose-100 bg-white p-3 shadow-2xs transition hover:border-rose-300"
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="rounded-sm bg-stone-100 px-1.5 py-0.5 text-[10px] font-semibold text-stone-600">
                      {con.category}
                    </span>
                    <div className="flex items-center gap-0.5" title={`Impact: ${con.impact}/5`}>
                      {Array.from({ length: 5 }).map((_, i) => (
                        <div
                          key={i}
                          className={`h-1.5 w-1.5 rounded-full ${
                            i < con.impact ? 'bg-rose-500' : 'bg-stone-200'
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="mt-1 text-xs sm:text-sm text-stone-800 leading-snug">
                    {con.text}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={() => handleRemoveCon(con.id)}
                  className="text-stone-300 opacity-0 group-hover:opacity-100 hover:text-rose-600 transition"
                  title="Remove"
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </button>
              </div>
            ))}
          </div>

          {/* Add custom Con form */}
          <form onSubmit={handleAddCon} className="mt-4 space-y-2 border-t border-rose-100 pt-3">
            <input
              type="text"
              value={newConText}
              onChange={(e) => setNewConText(e.target.value)}
              placeholder={t.customItemPlaceholder}
              className="w-full rounded-lg border border-rose-200 bg-white px-3 py-2 text-xs text-stone-900 placeholder:text-stone-400 focus:border-rose-600 focus:outline-hidden"
            />
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="text-stone-500">{t.impactWeight}:</span>
                <select
                  value={newConImpact}
                  onChange={(e) => setNewConImpact(Number(e.target.value))}
                  className="rounded border border-stone-200 bg-white px-1.5 py-0.5 text-xs text-stone-700"
                >
                  <option value={1}>1 - {language === 'es' ? 'Menor' : 'Low'}</option>
                  <option value={2}>2 - {language === 'es' ? 'Moderado' : 'Moderate'}</option>
                  <option value={3}>3 - {language === 'es' ? 'Importante' : 'Important'}</option>
                  <option value={4}>4 - {language === 'es' ? 'Muy Alto' : 'Very High'}</option>
                  <option value={5}>5 - {language === 'es' ? 'Crítico' : 'Critical'}</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={!newConText.trim()}
                className="flex items-center gap-1 rounded-md bg-rose-700 px-2.5 py-1 text-xs font-semibold text-white hover:bg-rose-800 disabled:opacity-40"
              >
                <Plus className="h-3.5 w-3.5" />
                <span>{t.addCustomCon}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
