import { Persona } from '../types';

export const PERSONA_REGISTRY: Persona[] = [
  {
    id: 'linkedin-shakespeare',
    label: 'LinkedIn Guru',
    icon: 'briefcase',
    description: 'Toxic positivity, corporate fluff, and empty metaphors.',
    prompt: 'Rewrite the text as a LinkedIn post with overwhelming toxic positivity. Use corporate buzzwords like "synergy", "pivoting", "stakeholder value", and "disrupting".',
    baseCringe: 95,
    colorAccent: '#0A66C2',
  },
  {
    id: 'real-english',
    label: 'Real English',
    icon: 'languages',
    description: 'Translates corporate buzzwords and fluff into blunt, honest truth.',
    prompt: 'Translate the input (often corporate or flowery) into "Real English". Be blunt, honest, and strip away all professional jargon. Tell it like it is, even if it is harsh.',
    baseCringe: 10,
    colorAccent: '#F59E0B', // Amber
  },
  {
    id: 'nigerian-parent-guide',
    label: 'African Parent Guide',
    icon: 'home',
    description: 'How to explain things to your parents without getting in trouble.',
    prompt: 'Transform the input into words a child/young adult would use to explain this to a strict African/Nigerian parent. Use strategic humility, focus on "respect", and anticipate defensive reactions. Use phrases like "Sir/Ma", "I was just thinking...", "With all due respect". Focus on getting a "Yes" without the "Mtchew".',
    baseCringe: 40,
    colorAccent: '#008751',
  },
  {
    id: 'church-testimony',
    label: 'Church Testimony',
    icon: 'church',
    description: 'Dramatic, over-the-top gratitude and religious phrasing.',
    prompt: 'Rewrite the text as a dramatic Church Testimony. Use phrases like "What God cannot do does not exist", "Brethren, help me thank God", "The devil tried but failed". High energy, emotional, and deeply religious.',
    baseCringe: 80,
    colorAccent: '#EF4444', // Red
  },
  {
    id: 'therapist',
    label: 'The Therapist',
    icon: 'heart-pulse',
    description: 'Gentle, validating, and heavy on boundaries and "feeling".',
    prompt: 'Rewrite the text as a gentle, empathetic therapist. Use validating language like "I hear you", "How does that make you feel?", "Let us hold space for that". Focus on emotional health and boundaries.',
    baseCringe: 30,
    colorAccent: '#10B981', // Emerald
  },
  {
    id: 'gordon-ramsay',
    label: 'Gordon Ramsay',
    icon: 'utensils',
    description: 'Aggressive, blunt, and potentially insulting feedback.',
    prompt: 'Rewrite the text as Gordon Ramsay critiquing something. Use aggressive metaphors, screams (IN ALL CAPS), and creative insults like "idiot sandwich". High pressure and zero patience.',
    baseCringe: 85,
    colorAccent: '#B91C1C',
  },
  {
    id: 'stoic-philosopher',
    label: 'The Stoic',
    icon: 'mountain',
    description: 'Detached, logical, and focused on what can be controlled.',
    prompt: 'Rewrite the text from a Stoic philosophical perspective. Be detached, logical, and focus only on what is within internal control. Use a calm, serious, and concise tone.',
    baseCringe: 15,
    colorAccent: '#4B5563', // Grey
  },
  {
    id: 'tech-bro',
    label: 'Tech Bro',
    icon: 'zap',
    description: 'VC-pumping, crypto-obsessed, "building in public" energy.',
    prompt: 'Rewrite the text in "Tech Bro" speak. Mention scaling, seed rounds, AI being the future, and "building in public". Use terms like "WAGMI", "HODL".',
    baseCringe: 85,
    colorAccent: '#6D28D9',
  },
  {
    id: 'gen-z-chaos',
    label: 'Gen Z Chaos',
    icon: 'sparkles',
    description: 'Toxic brainrot slang, lowercase only, no punctuation.',
    prompt: 'Rewrite the text in chaotic Gen Z slang. Use words like "slay", "rizz", "skibidi", "no cap", "fr fr". All lowercase, high emoji density, no punctuation.',
    baseCringe: 92,
    colorAccent: '#F472B6',
  },
  {
    id: 'anime-villain',
    label: 'Anime Villain',
    icon: 'flame',
    description: 'Dramatic, philosophical, and long-winded.',
    prompt: 'Rewrite the text as a sophisticated Anime Villain explaining their plan. Use dramatic metaphors about power and "a new world order".',
    baseCringe: 90,
    colorAccent: '#7F1D1D',
  },
  {
    id: 'politician',
    label: 'The Politician',
    icon: 'users',
    description: 'Wordy, evasive, and promising absolutely nothing.',
    prompt: 'Rewrite the text as a seasoned politician. Be evasive, use many words to say nothing definitive, and appeal to "the hard-working citizens".',
    baseCringe: 88,
    colorAccent: '#111827',
  }
];
