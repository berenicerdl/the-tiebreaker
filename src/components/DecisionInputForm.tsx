import React, { useState, useEffect } from 'react';
import {
  Sparkles,
  Plus,
  Trash2,
  ArrowRight,
  ShieldCheck,
  Compass,
  Zap,
  Sliders,
  ChevronDown,
  ChevronUp,
  Loader2,
  Check,
} from 'lucide-react';
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
  initialValues?: {
    dilemma: string;
    options: string[];
    priorities: string[];
    riskTolerance: 'conservative' | 'balanced' | 'bold';
  } | null;
}

export const DecisionInputForm: React.FC<DecisionInputFormProps> = ({
  t,
  language,
  onSubmit,
  isLoading,
  initialValues,
}) => {
  const [dilemma, setDilemma] = useState(initialValues?.dilemma || '');
  const [options, setOptions] = useState<string[]>(
    initialValues?.options && initialValues.options.length >= 2
      ? initialValues.options
      : ['', '']
  );
  const [showOptions, setShowOptions] = useState(
    Boolean(initialValues?.options && initialValues.options.some(Boolean))
  );
  const [priorities, setPriorities] = useState<string[]>(
    initialValues?.priorities || []
  );
  const [newPriority, setNewPriority] = useState('');
  const [riskTolerance, setRiskTolerance] = useState<'conservative' | 'balanced' | 'bold'>(
    initialValues?.riskTolerance || 'balanced'
  );

  // Progressive feedback step index during loading
  const [loadingStepIdx, setLoadingStepIdx] = useState(0);

  useEffect(() => {
    if (!isLoading) {
      setLoadingStepIdx(0);
      return;
    }
    const interval = setInterval(() => {
      setLoadingStepIdx((prev) => (prev + 1) % (t.analyzingSteps?.length || 4));
    }, 2400);
    return () => clearInterval(interval);
  }, [isLoading, t.analyzingSteps]);

  // Sync if initial values change
  useEffect(() => {
    if (initialValues) {
      setDilemma(initialValues.dilemma || '');
      if (initialValues.options && initialValues.options.length > 0) {
        setOptions(initialValues.options);
        setShowOptions(true);
      }
      if (initialValues.priorities) {
        setPriorities(initialValues.priorities);
      }
      if (initialValues.riskTolerance) {
        setRiskTolerance(initialValues.riskTolerance);
      }
    }
  }, [initialValues]);

  const defaultSuggestedPriorities =
    language === 'es'
      ? [
          'Tranquilidad Mental',
          'Crecimiento Profesional',
          'Retorno Financiero',
          'Tiempo con Familia',
          'Flexibilidad & Libertad',
          'Seguridad a Largo Plazo',
        ]
      : [
          'Peace of Mind',
          'Career Growth',
          'Financial Return',
          'Family Time',
          'Flexibility & Freedom',
          'Long-term Security',
        ];

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
      const trimmed = newPriority.trim();
      if (!priorities.includes(trimmed)) {
        setPriorities([...priorities, trimmed]);
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
    if (!dilemma.trim() || isLoading) return;

    const filteredOptions = options.map((o) => o.trim()).filter(Boolean);
    onSubmit({
      dilemma: dilemma.trim(),
      options: filteredOptions,
      priorities,
      riskTolerance,
    });
  };

  return (
    <div className="mx-auto max-w-3xl px-4 py-8 sm:px-6">
      {/* Title & Introduction */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center gap-2 rounded-full border border-[#3b3464] bg-[#211d3c] px-3.5 py-1 text-xs font-semibold text-violet-300 shadow-sm mb-3">
          <Sparkles className="h-3.5 w-3.5 text-fuchsia-400" />
          <span>{language === 'es' ? 'Desempate guiado por IA' : 'AI-Powered Decision Engine'}</span>
        </div>
        <h1 className="font-display text-3xl font-extrabold tracking-tight text-white sm:text-4xl lg:text-5xl">
          {t.tagline}
        </h1>
        <p className="mx-auto mt-3 max-w-xl text-xs sm:text-sm text-[#9b97b6] leading-relaxed">
          {t.subtitle}
        </p>
      </div>

      {/* Preset Inspiration Pills */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2.5">
          <span className="text-[11px] font-bold text-[#807b9f] uppercase tracking-wider">
            {t.tryExample}
          </span>
        </div>
        <div className="flex flex-wrap gap-2">
          {PRESET_TEMPLATES.map((preset) => {
            const title = language === 'es' ? preset.titleEs : preset.titleEn;
            return (
              <button
                key={preset.id}
                id={`preset-btn-${preset.id}`}
                type="button"
                onClick={() => handleApplyPreset(preset)}
                className="rounded-xl border border-[#2b274d] bg-[#1c1a32] px-3 py-1.5 text-xs font-medium text-[#cfcce2] transition hover:border-violet-500/50 hover:bg-[#252243] hover:text-white text-left"
              >
                <span>{title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Form Container: Modern Flat Dark Surface */}
      <form
        id="decision-input-form"
        onSubmit={handleSubmit}
        className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 sm:p-7 space-y-6 shadow-xl shadow-black/20"
      >
        {/* Dilemma Input */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label
              htmlFor="dilemma-input"
              className="text-sm font-bold text-white"
            >
              {t.dilemmaLabel}
            </label>
            <span className="text-[11px] text-[#787396]">
              {dilemma.length} {language === 'es' ? 'caracteres' : 'chars'}
            </span>
          </div>
          <textarea
            id="dilemma-input"
            rows={3}
            value={dilemma}
            onChange={(e) => setDilemma(e.target.value)}
            placeholder={t.dilemmaPlaceholder}
            className="w-full rounded-xl border border-[#2e2a53] bg-[#151429] p-3.5 text-sm sm:text-base text-white placeholder:text-[#5f5a81] transition focus:border-violet-500 focus:bg-[#181630] focus:outline-none focus:ring-2 focus:ring-violet-500/20"
            required
            disabled={isLoading}
          />
        </div>

        {/* Collapsible Options Section */}
        <div className="border-t border-[#2a264a] pt-4">
          <button
            id="toggle-options-btn"
            type="button"
            onClick={() => setShowOptions(!showOptions)}
            className="flex w-full items-center justify-between text-left text-xs font-bold text-[#b4b0cd] hover:text-white py-1 transition"
          >
            <span className="flex items-center gap-2">
              <Sliders className="h-4 w-4 text-violet-400" />
              <span>{t.optionsLabel}</span>
            </span>
            <span className="flex items-center gap-1 text-[11px] text-[#807a9f] font-normal">
              {showOptions ? (
                <>
                  <span>{language === 'es' ? 'Contraer' : 'Collapse'}</span>
                  <ChevronUp className="h-3 w-3" />
                </>
              ) : (
                <>
                  <span>{language === 'es' ? 'Especificar opciones' : 'Define paths'}</span>
                  <ChevronDown className="h-3 w-3" />
                </>
              )}
            </span>
          </button>

          {showOptions && (
            <div className="mt-3.5 space-y-2.5">
              <p className="text-[11px] text-[#807a9f]">{t.optionsHint}</p>
              {options.map((opt, idx) => (
                <div key={idx} className="flex items-center gap-2.5">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-[#28244b] text-xs font-bold text-violet-300">
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
                        : `Option ${idx + 1} (e.g., Path A)`
                    }
                    disabled={isLoading}
                    className="flex-1 rounded-xl border border-[#2e2a53] bg-[#151429] px-3.5 py-2 text-xs sm:text-sm text-white placeholder:text-[#5f5a81] focus:border-violet-500 focus:outline-none focus:ring-1 focus:ring-violet-500/20"
                  />
                  {options.length > 2 && (
                    <button
                      id={`remove-option-btn-${idx}`}
                      type="button"
                      onClick={() => handleRemoveOption(idx)}
                      disabled={isLoading}
                      className="rounded-lg p-2 text-[#787396] hover:text-rose-400 hover:bg-[#29254b] transition"
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
                  disabled={isLoading}
                  className="flex items-center gap-1.5 text-xs font-bold text-violet-400 hover:text-violet-300 pt-1 transition"
                >
                  <Plus className="h-3.5 w-3.5" />
                  <span>{t.addOption}</span>
                </button>
              )}
            </div>
          )}
        </div>

        {/* Core Priorities Section */}
        <div className="border-t border-[#2a264a] pt-4">
          <label className="block text-xs font-bold text-white mb-2">
            {t.prioritiesLabel}
          </label>
          <div className="flex flex-wrap gap-2">
            {defaultSuggestedPriorities.map((item) => {
              const isSelected = priorities.includes(item);
              return (
                <button
                  key={item}
                  type="button"
                  onClick={() => handleTogglePriority(item)}
                  disabled={isLoading}
                  className={`rounded-xl px-3 py-1.5 text-xs font-medium transition-all ${
                    isSelected
                      ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/30'
                      : 'border border-[#2e2a53] bg-[#17152b] text-[#a5a1c2] hover:border-violet-500/40 hover:text-white'
                  }`}
                >
                  {isSelected && <Check className="inline h-3 w-3 mr-1" />}
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
              disabled={isLoading}
              placeholder={t.addPriorityPlaceholder}
              className="w-full rounded-xl border border-[#2e2a53] bg-[#151429] px-3.5 py-2 text-xs text-white placeholder:text-[#5f5a81] focus:border-violet-500 focus:outline-none"
            />
          </div>
        </div>

        {/* Risk Appetite Segmented Cards */}
        <div className="border-t border-[#2a264a] pt-4">
          <label className="block text-xs font-bold text-white mb-2.5">
            {t.riskToleranceLabel}
          </label>
          <div className="grid grid-cols-1 gap-2.5 sm:grid-cols-3" role="radiogroup">
            <button
              id="risk-btn-conservative"
              type="button"
              onClick={() => setRiskTolerance('conservative')}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                riskTolerance === 'conservative'
                  ? 'border-violet-500 bg-[#272349] text-white shadow-md shadow-violet-950/40 ring-1 ring-violet-500/30'
                  : 'border-[#2c284f] bg-[#17152b] text-[#9b97b6] hover:border-[#3d3768] hover:text-white'
              }`}
            >
              <ShieldCheck className={`h-5 w-5 shrink-0 ${riskTolerance === 'conservative' ? 'text-violet-400' : 'text-[#6f6a91]'}`} />
              <div className="min-w-0">
                <span className="block text-xs font-bold">
                  {language === 'es' ? 'Conservador' : 'Conservative'}
                </span>
                <span className="block text-[10px] truncate text-[#8883a8]">
                  {language === 'es' ? 'Seguridad y estabilidad' : 'Downside safety first'}
                </span>
              </div>
            </button>

            <button
              id="risk-btn-balanced"
              type="button"
              onClick={() => setRiskTolerance('balanced')}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                riskTolerance === 'balanced'
                  ? 'border-violet-500 bg-[#272349] text-white shadow-md shadow-violet-950/40 ring-1 ring-violet-500/30'
                  : 'border-[#2c284f] bg-[#17152b] text-[#9b97b6] hover:border-[#3d3768] hover:text-white'
              }`}
            >
              <Compass className={`h-5 w-5 shrink-0 ${riskTolerance === 'balanced' ? 'text-fuchsia-400' : 'text-[#6f6a91]'}`} />
              <div className="min-w-0">
                <span className="block text-xs font-bold">
                  {language === 'es' ? 'Equilibrado' : 'Balanced'}
                </span>
                <span className="block text-[10px] truncate text-[#8883a8]">
                  {language === 'es' ? 'Riesgo calculado' : 'Calculated trade-offs'}
                </span>
              </div>
            </button>

            <button
              id="risk-btn-bold"
              type="button"
              onClick={() => setRiskTolerance('bold')}
              disabled={isLoading}
              className={`flex items-center gap-3 rounded-xl border p-3 text-left transition-all ${
                riskTolerance === 'bold'
                  ? 'border-violet-500 bg-[#272349] text-white shadow-md shadow-violet-950/40 ring-1 ring-violet-500/30'
                  : 'border-[#2c284f] bg-[#17152b] text-[#9b97b6] hover:border-[#3d3768] hover:text-white'
              }`}
            >
              <Zap className={`h-5 w-5 shrink-0 ${riskTolerance === 'bold' ? 'text-pink-400' : 'text-[#6f6a91]'}`} />
              <div className="min-w-0">
                <span className="block text-xs font-bold">
                  {language === 'es' ? 'Audaz' : 'Bold'}
                </span>
                <span className="block text-[10px] truncate text-[#8883a8]">
                  {language === 'es' ? 'Máximo upside & avance' : 'Max upside & growth'}
                </span>
              </div>
            </button>
          </div>
        </div>

        {/* Submit & Progressive Feedback */}
        <div className="pt-2">
          {isLoading ? (
            <div className="rounded-xl border border-[#352f5c] bg-[#19172f] p-4 text-center space-y-2.5">
              <div className="flex items-center justify-center gap-2 text-white font-bold text-sm">
                <Loader2 className="h-4 w-4 animate-spin text-fuchsia-400" />
                <span>{t.analyzing}</span>
              </div>
              <p className="text-xs text-[#9b97b6] transition-all duration-300">
                {t.analyzingSteps?.[loadingStepIdx] || t.analyzingSub}
              </p>
              {/* Vibrant violet to fuchsia progress bar */}
              <div className="mx-auto mt-2 h-1.5 w-56 overflow-hidden rounded-full bg-[#272347]">
                <div
                  className="h-full bg-gradient-to-r from-violet-500 via-purple-500 to-fuchsia-500 transition-all duration-500"
                  style={{
                    width: `${((loadingStepIdx + 1) / (t.analyzingSteps?.length || 4)) * 100}%`,
                  }}
                />
              </div>
            </div>
          ) : (
            <button
              id="submit-decision-btn"
              type="submit"
              disabled={!dilemma.trim() || isLoading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-violet-600 via-purple-600 to-fuchsia-500 py-3.5 text-sm font-bold text-white shadow-lg shadow-violet-950/50 transition hover:opacity-95 disabled:opacity-30 active:scale-99"
            >
              <span>{t.breakTheTie}</span>
              <ArrowRight className="h-4 w-4 text-white" />
            </button>
          )}
        </div>
      </form>
    </div>
  );
};
