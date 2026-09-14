import React, { useState } from 'react';
import { Sparkles, Plus, Trash2, ArrowRight, ShieldCheck, Compass, Flame, HelpCircle } from 'lucide-react';
import { TranslationStrings } from '../data/translations';
import { PRESET_TEMPLATES } from '../data/presets';
import { PresetTemplate } from '../types';

interface DecisionInputFormProps {
  t: TranslationStrings;
  language: 'en' | 'es';
  onSubmit: (formData: {
    dilemma: string;
    options: string[];
    priorities: string[];
    riskTolerance: 'conservative' | 'balanced' | 'bold';
  }) => void;
  isLoading: boolean;
}

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  t,
  language,
  onSubmit,
  isLoading,
}) => {
  const [dilemma, setDilemma] = useState('');
  const [options, setOptions] = useState<string[]>(['', '']);
  const [showOptions, setShowOptions] = useState(false);
  const [priorities, setPriorities] = useState<string[]>([]);
  const [newPriority, setNewPriority] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'balanced' | 'bold'>('balanced');

  const defaultSuggestedPriorities = language === 'es'
    ? ['Crecimiento Profesional', 'Tranquilidad Mental', 'Retorno Financiero', 'Tiempo con Familia', 'Flexibilidad', 'Seguridad a Largo Plazo']
    : ['Career Growth', 'Peace of Mind', 'Financial Return', 'Family Time', 'Flexibility & Freedom', 'Long-term Security'];

  const handleApplyPreset = (preset: PresetTemplate) => {
    if (language === 'es') {
      setDilemma(preset.dilemmaEs);
      setOptions(preset.optionsEs);
      setPriorities(preset.prioritiesEs);
    } else {
      setDilemma(preset.dilemmaEn);
      setOptions(preset.optionsEn);
      setPriorities(preset.prioritiesEn);
    }
    setShowOptions(true);
  };

  const handleAddOption = () => {
    if (options.length < 5) {
      setOptions([...options, '']);
    }
  };

  const handleRemoveOption = (index: number) => {
    if (options.length > 2) {
      setOptions(options.filter((_, i) => i !== index));
    }
  };

  const handleOptionChange = (index: number, val: string) => {
    const updated = [...options];
    updated[index] = val;
    setOptions(updated);
  };

  const handleAddPriority = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter' && newPriority.trim()) {
      e.preventDefault();
      if (!priorities.includes(newPriority.trim())) {
        setPriorities([...priorities, newPriority.trim()]);
      }
      setNewPriority('');
    }
  };

  const handleTogglePriority = (p: string) => {
    if (priorities.includes(p)) {
      setPriorities(priorities.filter((item) => item !== p));
    } else {
      setPriorities([...priorities, p]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!dilemma.trim()) return;

    const filteredOptions = options.map((o) => o.trim()).filter(Boolean);
    onSubmit({
      dilemma: dilemma.trim(),
      options: filteredOptions,
      priorities,
      riskTolerance,
    });
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Intro Heading */}
      <div className="mb-8 text-center">
        <h1 className="font-serif text-3xl font-extrabold tracking-tight text-stone-900 sm:text-4xl md:text-5xl">
          {t.tagline}
        </h1>
        <p className="mx-auto mt-3 max-w-2xl text-base leading-relaxed text-stone-600 sm:text-lg">
          {t.subtitle}
        </p>
      </div>

      {/* Preset Scenarios Carousel */}
      <div className="mb-8 rounded-2xl border border-stone-200/80 bg-stone-100/60 p-4">
        <div className="mb-3 flex items-center justify-between">
          <span className="text-xs font-semibold uppercase tracking-wider text-stone-500">
            {t.tryExample}
          </span>
        </div>
        <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-2">
          {PRESET_TEMPLATES.map((preset) => {
            const title = language === 'es' ? preset.titleEs : preset.titleEn;
            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="group flex items-start gap-2.5 rounded-xl border border-stone-200/90 bg-white p-3 text-left shadow-2xs transition hover:border-amber-400 hover:shadow-sm"
              >
                <div className="mt-0.5 flex h-6 w-6 shrink-0 items-center justify-center rounded-md bg-stone-100 text-stone-600 group-hover:bg-amber-100 group-hover:text-amber-800">
                  <Sparkles className="h-3.5 w-3.5" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-semibold text-stone-900 group-hover:text-amber-800">
                    {title}
                  </p>
                  <p className="mt-0.5 line-clamp-1 text-[11px] text-stone-500">
                    {language === 'es' ? preset.dilemmaEs : preset.dilemmaEn}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Card */}
      <form
        id="decision-input-form"
        onSubmit={handleSubmit}
        className="rounded-2xl border border-stone-200 bg-white p-6 shadow-sm sm:p-8"
      >
        {/* Dilemma Textarea */}
        <div className="space-y-2">
          <label
            htmlFor="dilemma-input"
            className="flex items-center gap-2 text-sm font-bold tracking-tight text-stone-900 sm:text-base"
          >
            <span>{t.dilemmaLabel}</span>
            <span className="text-xs font-normal text-rose-500">*</span>
          </label>
          <textarea
            id="dilemma-input"
            rows={4}
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            placeholder={t.dilemmaPlaceholder}
            className="w-full rounded-xl border border-stone-300 p-3.5 text-stone-900 placeholder:text-stone-400 focus:border-amber-600 focus:outline-hidden focus:ring-2 focus:ring-amber-500/20 text-sm sm:text-base leading-relaxed"
            required
          />
        </div>

        {/* Optional Specific Options Toggle */}
        <div className="mt-6 border-t border-stone-100 pt-5">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-sm font-semibold text-stone-800">
                {t.optionsLabel}
              </span>
              <p className="text-xs text-stone-500">{t.optionsHint}</p>
            </div>
            <button
              id="toggle-options-btn"
              type="button"
              onClick={() => setShowOptions(!showOptions)}
              className="text-xs font-semibold text-amber-700 hover:text-amber-800 underline underline-offset-4"
            >
              {showOptions ? (language === 'es' ? 'Ocultar opciones manuales' : 'Hide custom options') : (language === 'es' ? 'Definir opciones manuales' : 'Define custom options')}
            </button>
          </div>

          {showOptions && (
            <div className="mt-4 space-y-3">
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-stone-100 text-xs font-bold text-stone-600">
                    {idx + 1}
                  </span>
                  <input
                    id={`custom-option-input-${idx}`}
                    type="text"
                    value={opt}
                    onChange={(e) => handleOptionChange(idx, e.target.value)}
                    placeholder={
                      language === 'es'
                        ? `Opción ${idx + 1} (ej. Opción A)`
                        : `Option ${idx + 1} (e.g., Option A)`
                    }
                    className="flex-1 rounded-lg border border-stone-300 px-3 py-2 text-xs sm:text-sm text-stone-900 focus:border-amber-600 focus:outline-hidden focus:ring-1 focus:ring-amber-500"
                  />
                  {options.length > 2 && (
                    <button
                      id={`remove-option-btn-${idx}`}
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      className="rounded-lg p-2 text-stone-400 hover:bg-stone-100 hover:text-rose-600"
                      title={t.removeOption}
                    >
                      <Trash2 className="h-4 w-4" />
                    </button>
                  )}
                </div>
              ))}
              {options.length < 4 && (
                <button
                  id="add-option-btn"
                  type="button"
                  onClick={handleAddOption}
                  className="flex items-center gap-1.5 text-xs font-medium text-amber-700 hover:text-amber-800"
                >
                  <Plus className="h-3.5 w-3.5" />
                  {t.addOption}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Priorities Section */}
        <div className="mt-6 border-t border-stone-100 pt-5">
          <label className="text-sm font-semibold text-stone-800">
            {t.prioritiesLabel}
          </label>
          <div className="mt-2.5 flex flex-wrap gap-1.5">
            {defaultSuggestedPriorities.map((item) => {
              const isSelected = priorities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleTogglePriority(item)}
                  className={`rounded-full px-3 py-1 text-xs font-medium transition-colors ${
                    isSelected
                      ? 'bg-amber-600 text-white'
                      : 'border border-stone-200 bg-stone-50 text-stone-600 hover:bg-stone-100'
                  }`}
                >
                  {isSelected && '✓ '}
                  {item}
                </button>
              );
            })}
          </div>

          <div className="mt-3">
            <input
              id="custom-priority-input"
              type="text"
              value={newPriority}
              onChange={(e) => setNewPriority(e.target.value)}
              onKeyDown={handleAddPriority}
              placeholder={t.addPriorityPlaceholder}
              className="w-full rounded-lg border border-stone-200 bg-stone-50/70 px-3 py-2 text-xs text-stone-800 placeholder:text-stone-400 focus:border-amber-600 focus:bg-white focus:outline-hidden focus:ring-1 focus:ring-amber-500 sm:text-sm"
            />
          </div>
        </div>

        {/* Risk Appetite Selector */}
        <div className="mt-6 border-t border-stone-100 pt-5">
          <label className="text-sm font-semibold text-stone-800">
            {t.riskToleranceLabel}
          </label>
          <div className="mt-2.5 grid grid-cols-1 gap-2 sm:grid-cols-3">
            <button
              id="risk-btn-conservative"
              type="button"
              onClick={() => setRiskTolerance('conservative')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                riskTolerance === 'conservative'
                  ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <ShieldCheck
                className={`h-4 w-4 shrink-0 ${
                  riskTolerance === 'conservative' ? 'text-amber-700' : 'text-stone-400'
                }`}
              />
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  {language === 'es' ? 'Conservador' : 'Conservative'}
                </span>
                <span className="block text-[11px] text-stone-500">
                  {language === 'es' ? 'Minimizar riesgos y asegurar' : 'Safety, security & downside protection'}
                </span>
              </div>
            </button>

            <button
              id="risk-btn-balanced"
              type="button"
              onClick={() => setRiskTolerance('balanced')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                riskTolerance === 'balanced'
                  ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Compass
                className={`h-4 w-4 shrink-0 ${
                  riskTolerance === 'balanced' ? 'text-amber-700' : 'text-stone-400'
                }`}
              />
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  {language === 'es' ? 'Equilibrado' : 'Balanced'}
                </span>
                <span className="block text-[11px] text-stone-500">
                  {language === 'es' ? 'Riesgo calculado e inteligente' : 'Pragmatic, measured trade-offs'}
                </span>
              </div>
            </button>

            <button
              id="risk-btn-bold"
              type="button"
              onClick={() => setRiskTolerance('bold')}
              className={`flex items-center gap-2.5 rounded-xl border p-3 text-left transition ${
                riskTolerance === 'bold'
                  ? 'border-amber-600 bg-amber-50/60 ring-1 ring-amber-600'
                  : 'border-stone-200 hover:bg-stone-50'
              }`}
            >
              <Flame
                className={`h-4 w-4 shrink-0 ${
                  riskTolerance === 'bold' ? 'text-amber-700' : 'text-stone-400'
                }`}
              />
              <div>
                <span className="block text-xs font-bold text-stone-900">
                  {language === 'es' ? 'Audaz' : 'Bold'}
                </span>
                <span className="block text-[11px] text-stone-500">
                  {language === 'es' ? 'Máximo potencial y upside' : 'Max upside, rapid growth & agility'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Submit Action */}
        <div className="mt-8 border-t border-stone-100 pt-6">
          <button
            id="submit-decision-btn"
            type="submit"
            disabled={isLoading || !dilemma.trim()}
            className="flex w-full items-center justify-center gap-2 rounded-xl bg-amber-600 py-3.5 px-6 font-semibold text-white shadow-sm transition hover:bg-amber-700 focus:outline-hidden focus:ring-2 focus:ring-amber-500/30 disabled:cursor-not-allowed disabled:opacity-50 text-sm sm:text-base"
          >
            {isLoading ? (
              <div className="flex items-center gap-2.5">
                <div className="h-5 w-5 animate-spin rounded-full border-2 border-white border-t-transparent" />
                <span>{t.analyzing}</span>
              </div>
            ) : (
              <>
                <Sparkles className="h-5 w-5" />
                <span>{t.breakTheTie}</span>
                <ArrowRight className="h-4 w-4" />
              </>
            )}
          </button>
          {isLoading && (
            <p className="mt-2 text-center text-xs text-stone-500">
              {t.analyzingSub}
            </p>
          )}
        </div>
      </form>
    </div>
  );
};
