import React from 'react';
import { Scale, History, PlusCircle, Globe } from 'lucide-react';
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
    <header className="sticky top-0 z-40 w-full border-b border-stone-200 bg-stone-50/90 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        {/* Brand Logo & Name */}
        <div
          id="nav-brand"
          onClick={onNewDecision}
          className="flex cursor-pointer items-center gap-3 transition-opacity hover:opacity-85"
        >
          <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-600 text-stone-50 shadow-sm">
            <Scale className="h-5 w-5" />
          </div>
          <div>
            <span className="font-serif text-xl font-bold tracking-tight text-stone-900 sm:text-2xl">
              {t.appName}
            </span>
            <span className="hidden text-xs font-medium text-stone-500 sm:ml-2 sm:inline-block">
              {t.tagline}
            </span>
          </div>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Language Selector */}
          <div className="flex items-center rounded-lg border border-stone-200 bg-white p-0.5 text-xs font-medium shadow-xs">
            <button
              id="lang-btn-en"
              type="button"
              onClick={() => onToggleLanguage('en')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors ${
                language === 'en'
                  ? 'bg-amber-600 font-semibold text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="h-3 w-3" />
              EN
            </button>
            <button
              id="lang-btn-es"
              type="button"
              onClick={() => onToggleLanguage('es')}
              className={`flex items-center gap-1 rounded-md px-2.5 py-1.5 transition-colors ${
                language === 'es'
                  ? 'bg-amber-600 font-semibold text-white shadow-xs'
                  : 'text-stone-600 hover:text-stone-900'
              }`}
            >
              <Globe className="h-3 w-3" />
              ES
            </button>
          </div>

          {/* History Button */}
          <button
            id="nav-history-btn"
            type="button"
            onClick={onOpenHistory}
            className="relative flex items-center gap-1.5 rounded-lg border border-stone-200 bg-white px-3 py-1.5 text-xs font-medium text-stone-700 shadow-xs transition hover:border-stone-300 hover:bg-stone-100 sm:text-sm"
          >
            <History className="h-4 w-4 text-stone-500" />
            <span className="hidden sm:inline">{t.history}</span>
            {savedCount > 0 && (
              <span className="ml-1 inline-flex h-4 min-w-4 items-center justify-center rounded-full bg-amber-100 px-1 text-[10px] font-bold text-amber-800">
                {savedCount}
              </span>
            )}
          </button>

          {/* New Decision Button */}
          <button
            id="nav-new-decision-btn"
            type="button"
            onClick={onNewDecision}
            className="flex items-center gap-1.5 rounded-lg bg-stone-900 px-3 py-1.5 text-xs font-semibold text-white shadow-xs transition hover:bg-stone-800 sm:px-4 sm:py-2 sm:text-sm"
          >
            <PlusCircle className="h-4 w-4 text-stone-300" />
            <span className="whitespace-nowrap">{t.newDecision}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
