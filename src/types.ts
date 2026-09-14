export interface ProConItem {
  id: string;
  text: string;
  impact: number; // 1 to 5
  category: string;
}

export interface SWOTData {
  strengths: string[];
  weaknesses: string[];
  opportunities: string[];
  threats: string[];
}

export interface DecisionOption {
  id: string;
  name: string;
  tagline: string;
  pros: ProConItem[];
  cons: ProConItem[];
  swot: SWOTData;
  overallScore: number; // 1 to 100
}

export interface CriteriaOptionScore {
  optionId: string;
  score: number; // 1 to 10
  comment: string;
}

export interface ComparisonCriterion {
  name: string;
  description: string;
  weight: number; // 1 to 5
  optionScores: CriteriaOptionScore[];
}

export interface TiebreakerVerdict {
  recommendedOptionId: string;
  recommendedOptionName: string;
  verdictHeadline: string;
  reasoning: string;
  theDecidingQuestion: string;
  gutCheckTest: string;
  riskHedgingStrategies: string[];
  nextActionableSteps: string[];
}

export interface DecisionAnalysis {
  id: string;
  createdAt: string;
  dilemma: string;
  detectedLanguage: 'en' | 'es';
  primaryQuestion: string;
  executiveSummary: string;
  options: DecisionOption[];
  comparisonCriteria: ComparisonCriterion[];
  tiebreakerVerdict: TiebreakerVerdict;
  userNotes?: string;
  chosenOptionId?: string;
  isDecided?: boolean;
}

export interface PresetTemplate {
  id: string;
  titleEn: string;
  titleEs: string;
  category: 'career' | 'life' | 'finance' | 'personal';
  dilemmaEn: string;
  dilemmaEs: string;
  optionsEn: string[];
  optionsEs: string[];
  prioritiesEn: string[];
  prioritiesEs: string[];
}

export type ViewTab = 'verdict' | 'pros_cons' | 'comparison' | 'swot' | 'all';
