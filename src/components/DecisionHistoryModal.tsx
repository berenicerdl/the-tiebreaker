import React from 'react';
import { X, Trash2, CheckCircle2, ArrowRight, History, Calendar } from 'lucide-react';
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
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-stone-900/50 p-4 backdrop-blur-xs">
      <div className="relative w-full max-w-2xl rounded-2xl border border-stone-200 bg-white p-6 shadow-xl sm:p-7 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-stone-100 pb-4">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-100 text-amber-800">
              <History className="h-4 w-4" />
            </div>
            <div>
              <h3 className="font-serif text-lg font-bold text-stone-900">
                {t.history}
              </h3>
              <span className="text-xs text-stone-500">
                {history.length}{' '}
                {language === 'es' ? 'decisiones registradas' : 'saved decisions'}
              </span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-stone-700"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Content List */}
        <div className="mt-4 flex-1 overflow-y-auto space-y-3 pr-1">
          {history.length === 0 ? (
            <div className="py-12 text-center text-stone-500">
              <p className="text-sm">{t.noHistory}</p>
            </div>
          ) : (
            history.map((item) => {
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
                  className="group relative flex flex-col justify-between gap-3 rounded-xl border border-stone-200 bg-stone-50/50 p-4 transition hover:border-amber-400 hover:bg-white sm:flex-row sm:items-center"
                >
                  <div
                    className="flex-1 cursor-pointer"
                    onClick={() => {
                      onSelectDecision(item);
                      onClose();
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <span className="flex items-center gap-1 text-[11px] text-stone-400">
                        <Calendar className="h-3 w-3" />
                        {formattedDate}
                      </span>
                      {item.isDecided ? (
                        <span className="inline-flex items-center gap-1 rounded-full bg-emerald-100 px-2 py-0.5 text-[10px] font-bold text-emerald-800">
                          <CheckCircle2 className="h-3 w-3" />
                          {t.decidedBadge}
                        </span>
                      ) : (
                        <span className="rounded-full bg-stone-200/80 px-2 py-0.5 text-[10px] font-medium text-stone-600">
                          {language === 'es' ? 'Pendiente' : 'Under Review'}
                        </span>
                      )}
                    </div>
                    <h4 className="mt-1 text-sm font-bold text-stone-900 group-hover:text-amber-800 line-clamp-1">
                      {item.dilemma}
                    </h4>
                    <p className="mt-0.5 text-xs text-stone-500">
                      {language === 'es' ? 'Recomendación:' : 'Verdict:'}{' '}
                      <span className="font-semibold text-stone-700">
                        {item.tiebreakerVerdict.recommendedOptionName}
                      </span>
                    </p>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => {
                        onSelectDecision(item);
                        onClose();
                      }}
                      className="flex items-center gap-1 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white hover:bg-stone-800"
                    >
                      <span>{language === 'es' ? 'Ver Análisis' : 'Open'}</span>
                      <ArrowRight className="h-3.5 w-3.5" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        onDeleteDecision(item.id);
                      }}
                      className="rounded-lg p-1.5 text-stone-400 hover:bg-stone-100 hover:text-rose-600"
                      title="Delete"
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Footer actions */}
        {history.length > 0 && (
          <div className="mt-4 flex items-center justify-between border-t border-stone-100 pt-3">
            <button
              type="button"
              onClick={onClearHistory}
              className="text-xs text-rose-600 hover:underline"
            >
              {t.clearHistory}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="rounded-lg border border-stone-300 bg-white px-3 py-1.5 text-xs font-semibold text-stone-700 hover:bg-stone-50"
            >
              {language === 'es' ? 'Cerrar' : 'Close'}
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
