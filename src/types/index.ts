export type Intensity = 'Low' | 'Medium' | 'High' | 'Unhinged';
export type OutputLength = 'Short' | 'Medium' | 'Long';

export interface Persona {
  id: string;
  label: string;
  icon: string;
  description: string;
  prompt: string;
  baseCringe?: number; // 0-100
  colorAccent?: string; // For the Liquid Background
}

export interface TranslationResult {
  translation: string;
  cringeScore: number;
  cringeLabel: string;
  hashtags?: string[];
}

export interface EnrichedTranslationResult extends TranslationResult {
  personaId: string;
  personaLabel: string;
  timestamp: number;
}
