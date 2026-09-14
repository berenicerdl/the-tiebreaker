import React from 'react';
import { Scale, History, Plus, Sparkles } from 'lucide-react';
import { TranslationStrings } from '../data/translations';

interface NavbarProps {
  t: TranslationStrings;
  language: 'en' | 'es';
  onToggleLanguage: (lang: 'en' | 'es') => void;
  onNewDecision: () => void;
  onOpenHistory: () => void;
  savedCount: number;
}

export const Navbar: React.FC<NavbarProps> = ({
  t,
  language,
  onToggleLanguage,
  onNewDecision,
  onOpenHistory,
  savedCount,
}) => {
  return (
    <header className="sticky top-0 z-40 w-full border-b border-[#292548] bg-[#131226]/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4 sm:px-6">
        {/* Brand Logo & Name */}
        <button
          id="nav-brand"
          onClick={onNewDecision}
          className="flex items-center gap-3 text-left transition hover:opacity-90 focus:outline-none group"
        >
          <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-tr from-violet-600 via-purple-600 to-fuchsia-500 text-white shadow-lg shadow-violet-950/50 transition-transform group-hover:scale-105">
            <Scale className="h-5 w-5 text-white" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-display text-lg font-bold tracking-tight text-white sm:text-xl">
                {t.appName}
              </span>
              <span className="hidden rounded-full bg-violet-500/10 border border-violet-500/20 px-2 py-0.5 text-[10px] font-semibold text-violet-300 sm:inline-block">
                AI Engine
              </span>
            </div>
            <span className="hidden text-xs font-normal text-[#8e8aa8] sm:block">
              {t.tagline}
            </span>
          </div>
        </button>

        {/* Action Controls */}
        <div className="flex items-center gap-2.5">
          {/* Language Selector Segmented Control */}
          <div
            id="lang-toggle-container"
            className="flex items-center rounded-xl border border-[#2c2750] bg-[#1a1831] p-0.5 text-xs font-medium"
            role="group"
            aria-label="Language selection"
          >
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                language === 'en'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                  : 'text-[#8e8aa8] hover:text-white'
              }`}
            >
              EN
            </button>
            <button
              id="lang-btn-es"
              type="button"
              onClick={() => onToggleLanguage('es')}
              className={`rounded-lg px-2.5 py-1 text-xs font-semibold transition-all ${
                language === 'es'
                  ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                  : 'text-[#8e8aa8] hover:text-white'
              }`}
            >
              ES
            </button>
          </div>

          {/* History Button */}
          <button
            id="nav-history-btn"
            type="button"
            onClick={onOpenHistory}
            className="flex items-center gap-1.5 rounded-xl border border-[#2c2750] bg-[#1e1c35] px-3 py-1.5 text-xs font-semibold text-[#cfcce2] transition hover:border-violet-500/50 hover:bg-[#252342] hover:text-white"
            title={t.history}
          >
            <History className="h-3.5 w-3.5 text-violet-400" />
            <span className="hidden sm:inline">{t.history}</span>
            {savedCount > 0 && (
              <span className="inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-violet-600 px-1 text-[10px] font-bold text-white">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          <button
            id="nav-new-decision-btn"
            type="button"
            onClick={onNewDecision}
            className="flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 px-3.5 py-1.5 text-xs font-bold text-white shadow-md shadow-violet-950/40 transition active:scale-98"
          >
            <Plus className="h-3.5 w-3.5" />
            <span>{t.newDecision}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
