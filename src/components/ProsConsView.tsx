import React, { useState } from 'react';
import {
  Plus,
  Trash2,
  Scale,
  Sliders,
} from 'lucide-react';
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
  const [newConText, setNewConText] = useState('');

  const activeOption =
    analysis.options.find((o) => o.id === activeOptionId) || analysis.options[0];

  if (!activeOption) return null;

  const handleAddPro = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newProText.trim() || !activeOption) return;

    const newPro: ProConItem = {
      id: `custom_pro_${Date.now()}`,
      text: newProText.trim(),
      impact: 4,
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
  };

  const handleAddCon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newConText.trim() || !activeOption) return;

    const newCon: ProConItem = {
      id: `custom_con_${Date.now()}`,
      text: newConText.trim(),
      impact: 4,
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

  const handleAdjustImpact = (type: 'pro' | 'con', itemId: string, delta: number) => {
    const updatedOptions = analysis.options.map((opt) => {
      if (opt.id === activeOption.id) {
        if (type === 'pro') {
          return {
            ...opt,
            pros: opt.pros.map((p) =>
              p.id === itemId
                ? { ...p, impact: Math.max(1, Math.min(5, p.impact + delta)) }
                : p
            ),
          };
        } else {
          return {
            ...opt,
            cons: opt.cons.map((c) =>
              c.id === itemId
                ? { ...c, impact: Math.max(1, Math.min(5, c.impact + delta)) }
                : c
            ),
          };
        }
      }
      return opt;
    });
    onUpdateAnalysis({ ...analysis, options: updatedOptions });
  };

  const totalProWeight = activeOption.pros.reduce((acc, curr) => acc + curr.impact, 0);
  const totalConWeight = activeOption.cons.reduce((acc, curr) => acc + curr.impact, 0);
  const netAdvantage = totalProWeight - totalConWeight;

  return (
    <div className="space-y-6">
      {/* Option Selector Segmented Bar */}
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
                onClick={() => setActiveOptionId(opt.id)}
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
          {language === 'es' ? 'Ponderación de Impacto (1 a 5)' : 'Weighted Impact (1 to 5)'}
        </span>
      </div>

      {/* Summary Score Bar */}
      <div className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h3 className="font-display text-xl font-bold text-white">
              {activeOption.name}
            </h3>
            <p className="text-xs text-[#8e8aa8] mt-0.5">{activeOption.tagline}</p>
          </div>

          {/* Net Balance Metric */}
          <div className="flex items-center gap-4 border-t border-[#2a264a] pt-3 sm:border-0 sm:pt-0">
            <div className="flex items-center gap-2">
              <span className="text-[11px] font-bold text-[#807b9f] uppercase tracking-wider">
                {language === 'es' ? 'Balance Neto' : 'Net Score'}:
              </span>
              <span
                className={`rounded-xl px-3 py-1 text-xs font-extrabold ${
                  netAdvantage > 0
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                    : netAdvantage < 0
                    ? 'bg-[#29244c] text-rose-300'
                    : 'bg-[#211e3b] text-[#9b97b6]'
                }`}
              >
                {netAdvantage > 0 ? `+${netAdvantage}` : netAdvantage} pts
              </span>
            </div>

            <div className="text-xs text-[#8e8aa8]">
              <span className="font-bold text-violet-300">+{totalProWeight}</span> pros /{' '}
              <span className="font-bold text-fuchsia-300">-{totalConWeight}</span> cons
            </div>
          </div>
        </div>

        {/* Visual Balance Line */}
        <div className="mt-4 flex h-2 w-full overflow-hidden rounded-full bg-[#151429]">
          <div
            className="bg-gradient-to-r from-violet-500 to-purple-500 transition-all duration-300"
            style={{
              width: `${
                totalProWeight + totalConWeight > 0
                  ? (totalProWeight / (totalProWeight + totalConWeight)) * 100
                  : 50
              }%`,
            }}
          />
          <div
            className="bg-gradient-to-r from-purple-500 to-fuchsia-500 transition-all duration-300"
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

      {/* Side-by-Side Pros & Cons Grid */}
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Pros Column */}
        <div className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#2a264a] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-violet-400 shadow-sm shadow-violet-400/50" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t.prosTitle}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-violet-300">
                +{totalProWeight} pts
              </span>
            </div>

            <ul className="space-y-2.5">
              {activeOption.pros.map((pro) => (
                <li
                  key={pro.id}
                  className="group flex items-start justify-between gap-2.5 rounded-xl border border-[#2c284f] bg-[#16142a] p-3 text-xs text-[#cfcce2] transition hover:border-violet-500/40 hover:bg-[#1a1831]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="leading-relaxed">{pro.text}</p>
                    <span className="mt-1.5 inline-block text-[10px] text-violet-400/80 font-semibold uppercase tracking-wider">
                      {pro.category}
                    </span>
                  </div>

                  {/* Impact adjustment controls */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleAdjustImpact('pro', pro.id, -1)}
                      disabled={pro.impact <= 1}
                      className="h-6 w-6 rounded-lg border border-[#37325d] bg-[#221f3d] text-white hover:border-violet-400 disabled:opacity-30 text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold text-violet-300 text-xs">
                      {pro.impact}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustImpact('pro', pro.id, 1)}
                      disabled={pro.impact >= 5}
                      className="h-6 w-6 rounded-lg border border-[#37325d] bg-[#221f3d] text-white hover:border-violet-400 disabled:opacity-30 text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemovePro(pro.id)}
                      className="ml-1 text-[#656084] hover:text-rose-400"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Add Custom Pro */}
          <form onSubmit={handleAddPro} className="mt-4 border-t border-[#2a264a] pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newProText}
                onChange={(e) => setNewProText(e.target.value)}
                placeholder={t.customItemPlaceholder}
                className="flex-1 rounded-xl border border-[#2e2a53] bg-[#151429] px-3 py-2 text-xs text-white placeholder:text-[#5f5a81] focus:border-violet-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newProText.trim()}
                className="rounded-xl bg-gradient-to-r from-violet-600 to-purple-600 px-3.5 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-30 shadow-md shadow-violet-950/30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>

        {/* Cons Column */}
        <div className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 shadow-xl shadow-black/20 flex flex-col justify-between">
          <div className="space-y-3">
            <div className="flex items-center justify-between border-b border-[#2a264a] pb-3">
              <div className="flex items-center gap-2">
                <span className="h-2.5 w-2.5 rounded-full bg-fuchsia-400 shadow-sm shadow-fuchsia-400/50" />
                <h4 className="text-xs font-bold uppercase tracking-wider text-white">
                  {t.consTitle}
                </h4>
              </div>
              <span className="text-[11px] font-bold text-fuchsia-300">
                -{totalConWeight} pts
              </span>
            </div>

            <ul className="space-y-2.5">
              {activeOption.cons.map((con) => (
                <li
                  key={con.id}
                  className="group flex items-start justify-between gap-2.5 rounded-xl border border-[#2c284f] bg-[#16142a] p-3 text-xs text-[#cfcce2] transition hover:border-fuchsia-500/40 hover:bg-[#1a1831]"
                >
                  <div className="min-w-0 flex-1">
                    <p className="leading-relaxed">{con.text}</p>
                    <span className="mt-1.5 inline-block text-[10px] text-fuchsia-400/80 font-semibold uppercase tracking-wider">
                      {con.category}
                    </span>
                  </div>

                  {/* Impact adjustment controls */}
                  <div className="flex items-center gap-1.5 shrink-0 pt-0.5">
                    <button
                      type="button"
                      onClick={() => handleAdjustImpact('con', con.id, -1)}
                      disabled={con.impact <= 1}
                      className="h-6 w-6 rounded-lg border border-[#37325d] bg-[#221f3d] text-white hover:border-fuchsia-400 disabled:opacity-30 text-xs font-bold flex items-center justify-center"
                    >
                      -
                    </button>
                    <span className="w-4 text-center font-bold text-fuchsia-300 text-xs">
                      {con.impact}
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAdjustImpact('con', con.id, 1)}
                      disabled={con.impact >= 5}
                      className="h-6 w-6 rounded-lg border border-[#37325d] bg-[#221f3d] text-white hover:border-fuchsia-400 disabled:opacity-30 text-xs font-bold flex items-center justify-center"
                    >
                      +
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveCon(con.id)}
                      className="ml-1 text-[#656084] hover:text-rose-400"
                      title="Remove"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </li>
              ))}
            </ul>
          </div>

          {/* Quick Add Custom Con */}
          <form onSubmit={handleAddCon} className="mt-4 border-t border-[#2a264a] pt-3">
            <div className="flex gap-2">
              <input
                type="text"
                value={newConText}
                onChange={(e) => setNewConText(e.target.value)}
                placeholder={t.customItemPlaceholder}
                className="flex-1 rounded-xl border border-[#2e2a53] bg-[#151429] px-3 py-2 text-xs text-white placeholder:text-[#5f5a81] focus:border-fuchsia-500 focus:outline-none"
              />
              <button
                type="submit"
                disabled={!newConText.trim()}
                className="rounded-xl bg-gradient-to-r from-purple-600 to-fuchsia-600 px-3.5 py-2 text-xs font-bold text-white transition hover:opacity-90 disabled:opacity-30 shadow-md shadow-fuchsia-950/30"
              >
                <Plus className="h-4 w-4" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};
