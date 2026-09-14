import React, { useState, useEffect } from 'react';
import { X, Trash2, CheckCircle2, ArrowRight, History, Calendar, Search } from 'lucide-react';
import { DecisionAnalysis } from '../types';
import { TranslationStrings } from '../data/translations';

interface DecisionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  history: DecisionAnalysis[];
  onSelectDecision: (decision: DecisionAnalysis) => void;
  onDeleteDecision: (id: string) => void;
  onClearHistory: () => void;
  t: TranslationStrings;
  language: 'en' | 'es';
}

export const DecisionHistoryModal: React.FC<DecisionHistoryModalProps> = ({
  isOpen,
  onClose,
  history,
  onSelectDecision,
  onDeleteDecision,
  onClearHistory,
  t,
  language,
}) => {
  const [searchTerm, setSearchTerm] = useState('');

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredHistory = history.filter((item) =>
    item.dilemma.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tiebreakerVerdict.recommendedOptionName.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-xl rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 sm:p-6 shadow-2xl shadow-black/60 max-h-[85vh] flex flex-col"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-[#2a264a] pb-3.5">
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-display text-base font-bold text-white">
                {t.history}
              </h3>
              <span className="text-[11px] text-[#8e8aa8]">
                {history.length}{' '}
                {language === 'es' ? 'decisiones guardadas' : 'saved decisions'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-xl p-1.5 text-[#807b9f] hover:bg-[#282449] hover:text-white transition"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Search Bar */}
        {history.length > 0 && (
          <div className="mt-3.5 relative">
            <Search className="absolute left-3.5 top-2.5 h-3.5 w-3.5 text-[#6f6a91]" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder={language === 'es' ? 'Filtrar por dilema o veredicto...' : 'Filter decisions...'}
              className="w-full rounded-xl border border-[#2e2a53] bg-[#151429] pl-9 pr-3 py-2 text-xs text-white placeholder:text-[#5f5a81] focus:border-violet-500 focus:outline-none"
            />
          </div>
        )}

        {/* Content List */}
        <div className="mt-3.5 flex-1 overflow-y-auto space-y-2.5 pr-1">
          {filteredHistory.length === 0 ? (
            <div className="py-12 text-center text-[#7a7599]">
              <p className="text-xs">
                {searchTerm
                  ? language === 'es' ? 'No hay resultados que coincidan.' : 'No matching decisions.'
                  : t.noHistory}
              </p>
            </div>
          ) : (
            filteredHistory.map((item) => {
              const formattedDate = new Date(item.createdAt).toLocaleDateString(
                language === 'es' ? 'es-ES' : 'en-US',
                {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                }
              );

              return (
                <div
                  key={item.id}
                  className="group relative flex flex-col justify-between gap-2.5 rounded-xl border border-[#2b274e] bg-[#16142a] p-3.5 transition hover:border-violet-500/50 hover:bg-[#1f1c37] sm:flex-row sm:items-center"
                >
                  <div
                    className="flex-1 cursor-pointer min-w-0"
                    onClick={() => {
                      onSelectDecision(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2 mb-1">
                      <span className="flex items-center gap-1 text-[10px] text-[#787396]">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      {item.isDecided ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-950/40 border border-emerald-500/30 px-2 py-0.2 text-[10px] font-bold text-emerald-300">
                          <CheckCircle2 className="h-3 w-3 text-emerald-400" />
                          {t.decidedBadge}
                        </span>
                      ) : (
                        <span className="rounded-full bg-[#242142] px-2 py-0.2 text-[10px] font-medium text-[#8e8aa8]">
                          {language === 'es' ? 'Pendiente' : 'In Progress'}
                        </span>
                      )}
                    </div>
                    <h4 className="text-xs font-bold text-white group-hover:text-violet-200 line-clamp-1">
                      {item.dilemma}
                    </h4>
                    <p className="mt-0.5 text-[11px] text-[#8e8aa8]">
                      {language === 'es' ? 'Veredicto:' : 'Verdict:'}{' '}
                      <span className="font-bold text-violet-300">
                        {item.tiebreakerVerdict.recommendedOptionName}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2 shrink-0">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-bold text-white shadow-sm shadow-violet-950/40 hover:opacity-90 transition"
                    >
                      <span>{language === 'es' ? 'Ver' : 'Open'}</span>
                      <ArrowRight className="h-3 w-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      className="rounded-xl p-1.5 text-[#787396] hover:text-rose-400 hover:bg-[#252144] transition"
                      title="Delete"
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="mt-3.5 flex items-center justify-between border-t border-[#2a264a] pt-3.5">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-400 hover:underline"
            >
              {t.clearHistory}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-[#2e2a53] bg-[#16142a] px-3.5 py-1.5 text-xs font-bold text-[#cfcce2] hover:bg-[#221f3d] hover:text-white"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
