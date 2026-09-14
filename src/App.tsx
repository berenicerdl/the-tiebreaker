import React, { useState, useEffect } from 'react';
import {
  Scale,
  Award,
  ThumbsUp,
  Table,
  Layers,
  FileText,
  Copy,
  Check,
  RotateCcw,
  Sparkles,
  AlertCircle,
  ArrowLeft,
  Edit3,
  CheckCircle2,
} from 'lucide-react';
import { DecisionAnalysis, ViewTab } from './types';
import { translations, TranslationStrings } from './data/translations';
import { Navbar } from './components/Navbar';
import { DecisionInputForm } from './components/DecisionInputForm';
import { VerdictCard } from './components/VerdictCard';
import { ProsConsView } from './components/ProsConsView';
import { ComparisonTableView } from './components/ComparisonTableView';
import { SwotView } from './components/SwotView';
import { DecisionHistoryModal } from './components/DecisionHistoryModal';
import { FollowUpConsultant } from './components/FollowUpConsultant';

export default function App() {
  const [language, setLanguage] = useState<'en' | 'es'>(() => {
    const saved = localStorage.getItem('tiebreaker_lang');
    if (saved === 'es' || saved === 'en') return saved;
    return navigator.language.startsWith('es') ? 'es' : 'en';
  });

  const [currentAnalysis, setCurrentAnalysis] = useState<DecisionAnalysis | null>(() => {
    const saved = localStorage.getItem('tiebreaker_current');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return null;
      }
    }
    return null;
  });

  const [history, setHistory] = useState<DecisionAnalysis[]>(() => {
    const saved = localStorage.getItem('tiebreaker_history');
    if (saved) {
      try {
        return JSON.parse(saved);
      } catch (e) {
        return [];
      }
    }
    return [];
  });

  // Stored form values to allow easy reversal / editing without data loss
  const [cachedFormValues, setCachedFormValues] = useState<{
    dilemma: string;
    options: string[];
    priorities: string[];
    riskTolerance: 'conservative' | 'balanced' | 'bold';
  } | null>(null);

  const [isEditingForm, setIsEditingForm] = useState(false);
  const [activeTab, setActiveTab] = useState<ViewTab>('verdict');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const t: TranslationStrings = translations[language];

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((current) => (current === msg ? null : current));
    }, 2500);
  };

  // Persist language
  useEffect(() => {
    localStorage.setItem('tiebreaker_lang', language);
  }, [language]);

  // Persist history
  useEffect(() => {
    localStorage.setItem('tiebreaker_history', JSON.stringify(history));
  }, [history]);

  // Persist current analysis
  useEffect(() => {
    if (currentAnalysis) {
      localStorage.setItem('tiebreaker_current', JSON.stringify(currentAnalysis));
    } else {
      localStorage.removeItem('tiebreaker_current');
    }
  }, [currentAnalysis]);

  // Keyboard shortcuts (Shneiderman's Rule 2: Enable Frequent Users to Use Shortcuts)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeTag = (document.activeElement?.tagName || '').toLowerCase();
      if (activeTag === 'input' || activeTag === 'textarea') return;

      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'h') {
        e.preventDefault();
        setIsHistoryOpen((prev) => !prev);
      } else if (e.key.toLowerCase() === 'n' && !e.ctrlKey && !e.metaKey) {
        handleNewDecision();
      } else if (e.key.toLowerCase() === 'e' && currentAnalysis && !isEditingForm) {
        handleEditDilemma();
      } else if (currentAnalysis && !isEditingForm) {
        if (e.key === '1') setActiveTab('verdict');
        if (e.key === '2') setActiveTab('pros_cons');
        if (e.key === '3') setActiveTab('comparison');
        if (e.key === '4') setActiveTab('swot');
        if (e.key === '5') setActiveTab('all');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [currentAnalysis, isEditingForm]);

  const handleToggleLanguage = (lang: 'en' | 'es') => {
    setLanguage(lang);
  };

  const handleNewDecision = () => {
    setCurrentAnalysis(null);
    setIsEditingForm(false);
    setCachedFormValues(null);
    setError(null);
    setActiveTab('verdict');
  };

  const handleEditDilemma = () => {
    if (currentAnalysis && !cachedFormValues) {
      setCachedFormValues({
        dilemma: currentAnalysis.dilemma,
        options: currentAnalysis.options.map((o) => o.name),
        priorities: [],
        riskTolerance: 'balanced',
      });
    }
    setIsEditingForm(true);
  };

  const handleAnalyzeDecision = async (formData: {
    dilemma: string;
    options: string[];
    priorities: string[];
    riskTolerance: 'conservative' | 'balanced' | 'bold';
  }) => {
    setIsLoading(true);
    setError(null);
    setCachedFormValues(formData);

    try {
      const response = await fetch('/api/analyze-decision', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          dilemma: formData.dilemma,
          options: formData.options,
          language,
          priorities: formData.priorities,
          riskTolerance: formData.riskTolerance,
        }),
      });

      if (!response.ok) {
        const errJson = await response.json().catch(() => ({}));
        throw new Error(errJson.error || t.errorGeneric);
      }

      const data = await response.json();
      const newAnalysis: DecisionAnalysis = {
        ...data,
        id: `dec_${Date.now()}`,
        createdAt: new Date().toISOString(),
        dilemma: formData.dilemma,
      };

      if (data.detectedLanguage === 'es' && language !== 'es') {
        setLanguage('es');
      } else if (data.detectedLanguage === 'en' && language !== 'en') {
        setLanguage('en');
      }

      setCurrentAnalysis(newAnalysis);
      setIsEditingForm(false);
      setActiveTab('verdict');

      // Add to history
      setHistory((prev) => [newAnalysis, ...prev.filter((h) => h.id !== newAnalysis.id)]);
      showToast(language === 'es' ? 'Análisis completado' : 'Analysis complete');
    } catch (err: any) {
      console.error(err);
      setError(err.message || t.errorGeneric);
    } finally {
      setIsLoading(false);
    }
  };

  const handleUpdateAnalysis = (updated: DecisionAnalysis) => {
    setCurrentAnalysis(updated);
    setHistory((prev) => prev.map((h) => (h.id === updated.id ? updated : h)));
    if (updated.isDecided) {
      showToast(language === 'es' ? 'Decisión fijada' : 'Decision committed');
    }
  };

  const handleDeleteDecision = (id: string) => {
    setHistory((prev) => prev.filter((h) => h.id !== id));
    if (currentAnalysis?.id === id) {
      setCurrentAnalysis(null);
    }
    showToast(language === 'es' ? 'Decisión eliminada' : 'Decision removed');
  };

  const handleClearHistory = () => {
    if (window.confirm(language === 'es' ? '¿Borrar todo el historial de decisiones?' : 'Clear all saved decisions?')) {
      setHistory([]);
      showToast(language === 'es' ? 'Historial borrado' : 'History cleared');
    }
  };

  const handleCopySummary = () => {
    if (!currentAnalysis) return;
    const isEs = language === 'es';

    let md = `# ${isEs ? 'Análisis de Decisión: The Tiebreaker' : 'Decision Analysis: The Tiebreaker'}\n\n`;
    md += `**${isEs ? 'Dilema' : 'Dilemma'}:** ${currentAnalysis.dilemma}\n`;
    md += `**${isEs ? 'Pregunta Clave' : 'Key Question'}:** ${currentAnalysis.primaryQuestion}\n\n`;
    md += `## ${isEs ? 'El Veredicto' : 'The Tiebreaker Verdict'}\n`;
    md += `**${isEs ? 'Recomendación' : 'Recommended Path'}:** ${currentAnalysis.tiebreakerVerdict.recommendedOptionName}\n`;
    md += `> ${currentAnalysis.tiebreakerVerdict.verdictHeadline}\n\n`;
    md += `${currentAnalysis.tiebreakerVerdict.reasoning}\n\n`;
    md += `### ${isEs ? 'La Pregunta Decisiva' : 'The Deciding Question'}\n`;
    md += `"${currentAnalysis.tiebreakerVerdict.theDecidingQuestion}"\n\n`;

    md += `## ${isEs ? 'Opciones Evaluadas' : 'Evaluated Options'}\n`;
    currentAnalysis.options.forEach((opt) => {
      md += `### ${opt.name}\n_${opt.tagline}_\n\n`;
      md += `**Pros:**\n`;
      opt.pros.forEach((p) => {
        md += `- [${p.category}] ${p.text} (+${p.impact} pts)\n`;
      });
      md += `\n**Cons:**\n`;
      opt.cons.forEach((c) => {
        md += `- [${c.category}] ${c.text} (-${c.impact} pts)\n`;
      });
      md += `\n`;
    });

    md += `## ${isEs ? 'Pasos Inmediatos (Próximas 48 Horas)' : 'Immediate Action Steps (Next 48 Hours)'}\n`;
    currentAnalysis.tiebreakerVerdict.nextActionableSteps.forEach((s, idx) => {
      md += `${idx + 1}. ${s}\n`;
    });

    navigator.clipboard.writeText(md);
    showToast(t.copied);
  };

  return (
    <div className="min-h-screen bg-[#131226] text-[#f3f2fa] flex flex-col font-sans selection:bg-violet-500 selection:text-white">
      {/* Global Minimalist Navbar */}
      <Navbar
        t={t}
        language={language}
        onToggleLanguage={handleToggleLanguage}
        onNewDecision={handleNewDecision}
        onOpenHistory={() => setIsHistoryOpen(true)}
        savedCount={history.length}
      />

      {/* Main Content Area */}
      <main className="flex-1 pb-16">
        {/* Error Alert Box */}
        {error && (
          <div className="mx-auto max-w-3xl px-4 pt-6">
            <div className="flex items-center gap-3 rounded-2xl border border-rose-500/40 bg-rose-950/40 p-4 text-xs sm:text-sm text-rose-200 shadow-xl">
              <AlertCircle className="h-5 w-5 shrink-0 text-rose-400" />
              <div className="flex-1">
                <span className="font-bold">{t.errorGeneric}</span>
                <p className="text-xs text-rose-300/80 mt-0.5">{error}</p>
              </div>
              <button
                type="button"
                onClick={() => setError(null)}
                className="font-bold text-rose-300 hover:text-white p-1"
              >
                ✕
              </button>
            </div>
          </div>
        )}

        {!currentAnalysis || isEditingForm ? (
          /* View 1: Decision Framing & Input Form */
          <div>
            {isEditingForm && currentAnalysis && (
              <div className="mx-auto max-w-3xl px-4 pt-4">
                <button
                  type="button"
                  onClick={() => setIsEditingForm(false)}
                  className="inline-flex items-center gap-2 text-xs font-bold text-[#9b97b6] hover:text-white transition"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>{language === 'es' ? 'Volver al análisis' : 'Back to analysis'}</span>
                </button>
              </div>
            )}
            <DecisionInputForm
              t={t}
              language={language}
              onSubmit={handleAnalyzeDecision}
              isLoading={isLoading}
              initialValues={cachedFormValues}
            />
          </div>
        ) : (
          /* View 2: Multi-Angle Analysis & Finalization Workspace */
          <div className="mx-auto max-w-5xl px-4 py-6 sm:px-6 space-y-6">
            {/* Top Action Bar with 3-Stage Process Breadcrumbs */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 border-b border-[#292548] pb-3.5">
              {/* Process Stages (Closure Indicator) */}
              <div className="flex items-center gap-2 text-xs">
                <button
                  type="button"
                  onClick={handleEditDilemma}
                  className="flex items-center gap-1.5 text-[#8e8aa8] hover:text-white transition"
                  title={t.editDilemma}
                >
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-[#242142] text-[10px] font-bold text-[#b2aecd]">
                    1
                  </span>
                  <span className="hidden sm:inline">{language === 'es' ? 'Dilema' : 'Frame'}</span>
                </button>
                <span className="text-[#3b3662]">→</span>
                <span className="flex items-center gap-1.5 font-bold text-white">
                  <span className="flex h-5 w-5 items-center justify-center rounded-full bg-gradient-to-r from-violet-600 to-fuchsia-600 text-[10px] font-extrabold text-white shadow-sm">
                    2
                  </span>
                  <span>{language === 'es' ? 'Análisis' : 'Analyze'}</span>
                </span>
                <span className="text-[#3b3662]">→</span>
                <span className={`flex items-center gap-1.5 ${currentAnalysis.isDecided ? 'font-bold text-emerald-300' : 'text-[#706b90]'}`}>
                  <span className={`flex h-5 w-5 items-center justify-center rounded-full text-[10px] font-bold ${currentAnalysis.isDecided ? 'bg-emerald-600 text-white' : 'bg-[#242142] text-[#706b90]'}`}>
                    3
                  </span>
                  <span>{language === 'es' ? 'Decisión' : 'Commit'}</span>
                </span>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={handleEditDilemma}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2b274e] bg-[#1e1c35] px-3 py-1.5 text-xs font-bold text-[#cfcce2] shadow-sm hover:border-violet-500/50 hover:bg-[#252243] hover:text-white transition"
                >
                  <Edit3 className="h-3.5 w-3.5 text-violet-400" />
                  <span>{t.editDilemma}</span>
                </button>

                <button
                  type="button"
                  onClick={handleCopySummary}
                  className="flex items-center gap-1.5 rounded-xl border border-[#2b274e] bg-[#1e1c35] px-3 py-1.5 text-xs font-bold text-[#cfcce2] shadow-sm hover:border-violet-500/50 hover:bg-[#252243] hover:text-white transition"
                >
                  <Copy className="h-3.5 w-3.5 text-fuchsia-400" />
                  <span>{t.exportSummary}</span>
                </button>
              </div>
            </div>

            {/* Context Banner: Modern Flat Dark Surface */}
            <div className="rounded-2xl border border-[#2c284f] bg-[#1e1c35] p-5 sm:p-6 shadow-xl shadow-black/20">
              <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-wider text-violet-400">
                    {language === 'es' ? 'Dilema Evaluado' : 'Evaluated Dilemma'}
                  </span>
                  <h2 className="font-display text-xl font-extrabold tracking-tight text-white sm:text-2xl mt-1">
                    {currentAnalysis.primaryQuestion || currentAnalysis.dilemma}
                  </h2>
                </div>

                {currentAnalysis.isDecided && (
                  <div className="inline-flex items-center gap-1.5 rounded-xl bg-gradient-to-r from-violet-600 to-fuchsia-600 px-3 py-1.5 text-xs font-extrabold text-white self-start sm:self-auto shrink-0 shadow-md shadow-violet-950/40">
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    <span>{t.decidedBadge}</span>
                  </div>
                )}
              </div>

              <p className="mt-2.5 text-xs sm:text-sm text-[#b2aecd] leading-relaxed">
                {currentAnalysis.executiveSummary}
              </p>

              {/* Contrasting Options Badges */}
              <div className="mt-4 flex flex-wrap items-center gap-2 border-t border-[#2a264a] pt-3.5">
                <span className="text-[11px] font-bold text-[#807b9f]">
                  {language === 'es' ? 'Caminos analizados:' : 'Paths analyzed:'}
                </span>
                {currentAnalysis.options.map((opt) => {
                  const isRec = opt.id === currentAnalysis.tiebreakerVerdict.recommendedOptionId;
                  const isChosen = opt.id === currentAnalysis.chosenOptionId;
                  return (
                    <div
                      key={opt.id}
                      className={`inline-flex items-center gap-1.5 rounded-xl px-3 py-1 text-xs font-bold transition ${
                        isChosen
                          ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-sm'
                          : isRec
                          ? 'border border-violet-500/50 bg-[#28224c] text-violet-200'
                          : 'border border-[#2e2a52] bg-[#17152b] text-[#9b97b6]'
                      }`}
                    >
                      {isChosen ? (
                        <Check className="h-3 w-3 text-emerald-300" />
                      ) : isRec ? (
                        <Award className="h-3 w-3 text-fuchsia-300" />
                      ) : null}
                      <span>{opt.name}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Multi-Tab Navigation Controls with Modern Flat Gradient Pills */}
            <div className="flex overflow-x-auto rounded-xl border border-[#2b274e] bg-[#18162d] p-1 shadow-lg shadow-black/20" role="tablist">
              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'verdict'}
                onClick={() => setActiveTab('verdict')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'verdict'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40'
                    : 'text-[#9b97b6] hover:text-white hover:bg-[#221f3d]'
                }`}
              >
                <Award className="h-3.5 w-3.5" />
                <span>{t.tabs.verdict}</span>
                <span className="hidden sm:inline text-[10px] opacity-70">1</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'pros_cons'}
                onClick={() => setActiveTab('pros_cons')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'pros_cons'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40'
                    : 'text-[#9b97b6] hover:text-white hover:bg-[#221f3d]'
                }`}
              >
                <ThumbsUp className="h-3.5 w-3.5" />
                <span>{t.tabs.prosCons}</span>
                <span className="hidden sm:inline text-[10px] opacity-70">2</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'comparison'}
                onClick={() => setActiveTab('comparison')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'comparison'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40'
                    : 'text-[#9b97b6] hover:text-white hover:bg-[#221f3d]'
                }`}
              >
                <Table className="h-3.5 w-3.5" />
                <span>{t.tabs.comparison}</span>
                <span className="hidden sm:inline text-[10px] opacity-70">3</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'swot'}
                onClick={() => setActiveTab('swot')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'swot'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40'
                    : 'text-[#9b97b6] hover:text-white hover:bg-[#221f3d]'
                }`}
              >
                <Layers className="h-3.5 w-3.5" />
                <span>{t.tabs.swot}</span>
                <span className="hidden sm:inline text-[10px] opacity-70">4</span>
              </button>

              <button
                type="button"
                role="tab"
                aria-selected={activeTab === 'all'}
                onClick={() => setActiveTab('all')}
                className={`flex items-center gap-2 rounded-lg px-3.5 py-2 text-xs font-bold whitespace-nowrap transition-all ${
                  activeTab === 'all'
                    ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-md shadow-violet-950/40'
                    : 'text-[#9b97b6] hover:text-white hover:bg-[#221f3d]'
                }`}
              >
                <FileText className="h-3.5 w-3.5" />
                <span>{t.tabs.all}</span>
                <span className="hidden sm:inline text-[10px] opacity-70">5</span>
              </button>
            </div>

            {/* Dynamic Tab Views */}
            <div className="space-y-6">
              {(activeTab === 'verdict' || activeTab === 'all') && (
                <section>
                  {activeTab === 'all' && (
                    <div className="mb-2.5">
                      <h3 className="font-display text-lg font-bold text-white">
                        1. {t.tabs.verdict}
                      </h3>
                    </div>
                  )}
                  <VerdictCard
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                    onUpdateAnalysis={handleUpdateAnalysis}
                  />
                </section>
              )}

              {(activeTab === 'pros_cons' || activeTab === 'all') && (
                <section className={activeTab === 'all' ? 'border-t border-[#292548] pt-6' : ''}>
                  {activeTab === 'all' && (
                    <div className="mb-2.5">
                      <h3 className="font-display text-lg font-bold text-white">
                        2. {t.tabs.prosCons}
                      </h3>
                    </div>
                  )}
                  <ProsConsView
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                    onUpdateAnalysis={handleUpdateAnalysis}
                  />
                </section>
              )}

              {(activeTab === 'comparison' || activeTab === 'all') && (
                <section className={activeTab === 'all' ? 'border-t border-[#292548] pt-6' : ''}>
                  {activeTab === 'all' && (
                    <div className="mb-2.5">
                      <h3 className="font-display text-lg font-bold text-white">
                        3. {t.tabs.comparison}
                      </h3>
                    </div>
                  )}
                  <ComparisonTableView
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                  />
                </section>
              )}

              {(activeTab === 'swot' || activeTab === 'all') && (
                <section className={activeTab === 'all' ? 'border-t border-[#292548] pt-6' : ''}>
                  {activeTab === 'all' && (
                    <div className="mb-2.5">
                      <h3 className="font-display text-lg font-bold text-white">
                        4. {t.tabs.swot}
                      </h3>
                    </div>
                  )}
                  <SwotView
                    analysis={currentAnalysis}
                    t={t}
                    language={language}
                  />
                </section>
              )}

              {/* Follow-up Consultant AI Assistant */}
              <section className="border-t border-[#292548] pt-6">
                <FollowUpConsultant
                  analysis={currentAnalysis}
                  t={t}
                  language={language}
                />
              </section>
            </div>
          </div>
        )}
      </main>

      {/* Ephemeral Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-5 right-5 z-50 flex items-center gap-2.5 rounded-xl border border-violet-500/40 bg-[#231f41] px-4 py-2.5 text-xs font-bold text-white shadow-2xl animate-in fade-in slide-in-from-bottom-2 duration-200">
          <Check className="h-4 w-4 text-emerald-400" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Decision History Modal */}
      <DecisionHistoryModal
        isOpen={isHistoryOpen}
        onClose={() => setIsHistoryOpen(false)}
        history={history}
        onSelectDecision={(item) => {
          setCurrentAnalysis(item);
          setIsEditingForm(false);
          setActiveTab('verdict');
        }}
        onDeleteDecision={handleDeleteDecision}
        onClearHistory={handleClearHistory}
        t={t}
        language={language}
      />

      {/* Minimalist Dark Footer */}
      <footer className="border-t border-[#221f3f] bg-[#0e0d1c] py-5 text-center text-xs text-[#8e8aa8]">
        <div className="mx-auto max-w-5xl px-4 flex items-center justify-center gap-2.5">
          <div className="flex items-center gap-2 font-medium text-white">
            <Scale className="h-4 w-4 text-violet-400" />
            <span className="font-bold">The Tiebreaker</span>
            <span className="text-[#3b3662]">•</span>
            <span className="text-[#8e8aa8]">
              {language === 'es' ? 'Claridad Definitiva en Decisiones' : 'Definitive Decision Clarity'}
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}
