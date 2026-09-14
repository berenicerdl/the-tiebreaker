export interface TranslationStrings {
  appName: string;
  tagline: string;
  subtitle: string;
  newDecision: string;
  history: string;
  dilemmaLabel: string;
  dilemmaPlaceholder: string;
  optionsLabel: string;
  optionsHint: string;
  addOption: string;
  removeOption: string;
  prioritiesLabel: string;
  addPriorityPlaceholder: string;
  riskToleranceLabel: string;
  riskConservative: string;
  riskBalanced: string;
  riskBold: string;
  breakTheTie: string;
  analyzing: string;
  analyzingSub: string;
  tryExample: string;
  tabs: {
    verdict: string;
    prosCons: string;
    comparison: string;
    swot: string;
    all: string;
  };
  verdictTitle: string;
  theCruxQuestion: string;
  gutCheck: string;
  riskHedging: string;
  immediateSteps: string;
  flipCoinPrompt: string;
  flipCoinButton: string;
  coinResult: string;
  coinGutCheckPrompt: string;
  prosTitle: string;
  consTitle: string;
  addCustomPro: string;
  addCustomCon: string;
  customItemPlaceholder: string;
  impactWeight: string;
  comparisonTitle: string;
  comparisonSubtitle: string;
  criterionWeight: string;
  swotStrengths: string;
  swotWeaknesses: string;
  swotOpportunities: string;
  swotThreats: string;
  markDecided: string;
  decidedBadge: string;
  selectWinnerPrompt: string;
  followUpQuestionPlaceholder: string;
  askFollowUp: string;
  asking: string;
  exportSummary: string;
  copied: string;
  clearHistory: string;
  noHistory: string;
  emptyDilemmaAlert: string;
  errorGeneric: string;
}

export const translations: Record<'en' | 'es', TranslationStrings> = {
  en: {
    appName: 'The Tiebreaker',
    tagline: 'Definitive Clarity for Difficult Decisions',
    subtitle: 'Evaluate tough choices through multi-layered Pros & Cons lists, comparison matrices, and strategic SWOT analyses powered by Gemini AI.',
    newDecision: 'New Decision',
    history: 'Saved Decisions',
    dilemmaLabel: 'What decision are you wrestling with?',
    dilemmaPlaceholder: 'e.g., Should I accept the job offer at an early-stage startup or stay in my corporate role? / Should we move closer to family or stay in the city?',
    optionsLabel: 'Contrasting Options (Optional)',
    optionsHint: 'Leave blank to let AI deduce the options, or specify your exact paths below:',
    addOption: '+ Add Another Option',
    removeOption: 'Remove',
    prioritiesLabel: 'Core Priorities & Values (Optional)',
    addPriorityPlaceholder: 'Add custom priority (e.g., Mental Health, Net Worth) + Enter',
    riskToleranceLabel: 'Your Risk Appetite',
    riskConservative: 'Conservative (Safety & Security)',
    riskBalanced: 'Balanced (Calculated Moves)',
    riskBold: 'Bold (Maximum Upside & Growth)',
    breakTheTie: 'Break the Tie with AI',
    analyzing: 'Synthesizing Trade-offs & Strategic Angles...',
    analyzingSub: 'Evaluating weights, compiling SWOT dimensions, and extracting the deciding factor.',
    tryExample: 'Or try a curated scenario:',
    tabs: {
      verdict: 'The Tiebreaker Verdict',
      prosCons: 'Pros & Cons List',
      comparison: 'Comparison Table',
      swot: 'SWOT Analysis',
      all: 'Full Dossier',
    },
    verdictTitle: 'The Tiebreaker Recommendation',
    theCruxQuestion: 'The Deciding Question',
    gutCheck: 'The Intuition & Gut-Check',
    riskHedging: 'How to Hedge Your Risks',
    immediateSteps: 'Immediate Action Steps (Next 48 Hours)',
    flipCoinPrompt: 'Still on the fence? Run the classic Tiebreaker Coin Test:',
    flipCoinButton: 'Flip the Decision Coin',
    coinResult: 'The coin landed on:',
    coinGutCheckPrompt: 'Notice your gut reaction: If you feel a wave of relief, this is your true answer. If your heart sinks or you want to flip again, pick the other option.',
    prosTitle: 'Key Advantages (Pros)',
    consTitle: 'Key Drawbacks (Cons)',
    addCustomPro: '+ Add personal pro',
    addCustomCon: '+ Add personal con',
    customItemPlaceholder: 'Type personal factor and press Enter...',
    impactWeight: 'Impact Weight',
    comparisonTitle: 'Comparative Criteria Matrix',
    comparisonSubtitle: 'Side-by-side weighted assessment across critical life & strategic dimensions (Scale 1–10)',
    criterionWeight: 'Weight',
    swotStrengths: 'Strengths (Internal)',
    swotWeaknesses: 'Weaknesses (Internal)',
    swotOpportunities: 'Opportunities (External)',
    swotThreats: 'Threats (External)',
    markDecided: 'Commit to a Choice',
    decidedBadge: 'Decision Finalized',
    selectWinnerPrompt: 'Which option did you choose?',
    followUpQuestionPlaceholder: 'Ask a follow-up doubt or request deeper advice on any factor...',
    askFollowUp: 'Consult AI',
    asking: 'Thinking...',
    exportSummary: 'Copy Markdown Summary',
    copied: 'Copied to clipboard!',
    clearHistory: 'Clear History',
    noHistory: 'No saved decisions yet. Run an analysis to store it here for future reflection.',
    emptyDilemmaAlert: 'Please describe the decision dilemma you would like to evaluate.',
    errorGeneric: 'Unable to complete analysis. Please verify your connection or try again.',
  },
  es: {
    appName: 'The Tiebreaker',
    tagline: 'Claridad Definitiva para Decisiones Difíciles',
    subtitle: 'Evalúa dilemas complejos mediante listas de pros y contras ponderadas, tablas comparativas y análisis DAFO/SWOT con inteligencia artificial.',
    newDecision: 'Nueva Decisión',
    history: 'Decisiones Guardadas',
    dilemmaLabel: '¿Qué decisión necesitas tomar?',
    dilemmaPlaceholder: 'Ej: ¿Debería aceptar la oferta de empleo en una startup o continuar en mi puesto corporativo? / ¿Comprar casa ahora o seguir alquilando?',
    optionsLabel: 'Opciones en Conflicto (Opcional)',
    optionsHint: 'Déjalo vacío para que la IA extraiga las opciones, o especifícalas aquí:',
    addOption: '+ Añadir otra opción',
    removeOption: 'Eliminar',
    prioritiesLabel: 'Prioridades y Valores Clave (Opcional)',
    addPriorityPlaceholder: 'Añadir prioridad (ej. Salud Mental, Estabilidad) + Enter',
    riskToleranceLabel: 'Tu Apetito al Riesgo',
    riskConservative: 'Conservador (Seguridad y Estabilidad)',
    riskBalanced: 'Equilibrado (Riesgo Calculado)',
    riskBold: 'Audaz (Máximo Crecimiento y Oportunidad)',
    breakTheTie: 'Romper el Empate con IA',
    analyzing: 'Analizando Trade-offs y Factores Estratégicos...',
    analyzingSub: 'Ponderando pros y contras, construyendo matriz DAFO y determinando el factor decisivo.',
    tryExample: 'O prueba un caso de ejemplo:',
    tabs: {
      verdict: 'El Veredicto (Desempate)',
      prosCons: 'Pros y Contras',
      comparison: 'Tabla Comparativa',
      swot: 'Análisis DAFO / SWOT',
      all: 'Dossier Completo',
    },
    verdictTitle: 'La Recomendación de The Tiebreaker',
    theCruxQuestion: 'La Pregunta Decisiva',
    gutCheck: 'Prueba de Intuición e Instinto',
    riskHedging: 'Estrategias de Mitigación de Riesgos',
    immediateSteps: 'Próximos Pasos Inmediatos (Próximas 48h)',
    flipCoinPrompt: '¿Aún tienes dudas? Aplica el test clásico de la moneda:',
    flipCoinButton: 'Lanzar la Moneda de la Decisión',
    coinResult: 'La moneda cayó en:',
    coinGutCheckPrompt: 'Observa tu reacción visceral: si sientes alivio, esta es tu decisión. Si te desilusionó o quieres lanzar otra vez, elige la otra opción.',
    prosTitle: 'Ventajas Clave (Pros)',
    consTitle: 'Desventajas Clave (Contras)',
    addCustomPro: '+ Añadir pro personal',
    addCustomCon: '+ Añadir contra personal',
    customItemPlaceholder: 'Escribe un factor personal y pulsa Enter...',
    impactWeight: 'Impacto',
    comparisonTitle: 'Matriz Comparativa por Criterios',
    comparisonSubtitle: 'Evaluación ponderada lado a lado en dimensiones críticas (Escala 1 al 10)',
    criterionWeight: 'Peso',
    swotStrengths: 'Fortalezas (Internas)',
    swotWeaknesses: 'Debilidades (Internas)',
    swotOpportunities: 'Oportunidades (Externas)',
    swotThreats: 'Amenazas (Externas)',
    markDecided: 'Comprometerse con una Opción',
    decidedBadge: 'Decisión Cerrada',
    selectWinnerPrompt: '¿Cuál opción elegiste?',
    followUpQuestionPlaceholder: 'Pregunta una duda puntual o pide consejo sobre algún factor...',
    askFollowUp: 'Consultar a la IA',
    asking: 'Pensando...',
    exportSummary: 'Copiar Resumen Markdown',
    copied: '¡Copiado al portapapeles!',
    clearHistory: 'Borrar Historial',
    noHistory: 'Aún no hay decisiones guardadas. Realiza un análisis para guardarlo aquí.',
    emptyDilemmaAlert: 'Por favor, describe el dilema o la decisión que necesitas evaluar.',
    errorGeneric: 'No se pudo completar el análisis. Por favor, inténtalo nuevamente.',
  },
};
