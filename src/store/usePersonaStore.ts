import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { createMMKV } from 'react-native-mmkv';
import { PERSONA_REGISTRY } from '../constants/personas';
import { Intensity, OutputLength, Persona, TranslationResult, EnrichedTranslationResult } from '../types';

const storage = createMMKV();

const mmkvStorage = {
  setItem: (name: string, value: string) => storage.set(name, value),
  getItem: (name: string) => storage.getString(name) ?? null,
  removeItem: (name: string) => storage.remove(name),
};

interface PersonaState {
  inputText: string;
  setInputText: (text: string) => void;
  
  selectedPersona: Persona;
  setSelectedPersona: (persona: Persona) => void;
  
  intensity: Intensity;
  setIntensity: (intensity: Intensity) => void;
  
  outputLength: OutputLength;
  setOutputLength: (length: OutputLength) => void;
  
  hashtags: boolean;
  setHashtags: (enabled: boolean) => void;
  
  isTranslating: boolean;
  setIsTranslating: (status: boolean) => void;
  
  lastResult: TranslationResult | null;
  setLastResult: (result: TranslationResult | null) => void;

  history: EnrichedTranslationResult[];
  addToHistory: (result: TranslationResult) => void;
  clearHistory: () => void;

  reset: () => void;
}

export const usePersonaStore = create<PersonaState>()(
  persist(
    (set) => ({
      inputText: '',
      setInputText: (text) => set({ inputText: text }),
      
      selectedPersona: PERSONA_REGISTRY[0],
      setSelectedPersona: (persona) => set({ selectedPersona: persona }),
      
      intensity: 'Medium',
      setIntensity: (intensity) => set({ intensity }),
      
      outputLength: 'Medium',
      setOutputLength: (length) => set({ outputLength: length }),
      
      hashtags: false,
      setHashtags: (enabled) => set({ hashtags: enabled }),
      
      isTranslating: false,
      setIsTranslating: (status) => set({ isTranslating: status }),
      
      lastResult: null,
      setLastResult: (result) => set({ lastResult: result }),

      history: [],
      addToHistory: (result) => set((state) => {
        const enrichedResult = {
          ...result,
          personaId: state.selectedPersona.id,
          personaLabel: state.selectedPersona.label,
          timestamp: Date.now(),
        };
        return {
          history: [enrichedResult, ...state.history.filter(h => h.translation !== result.translation)].slice(0, 10)
        };
      }),
      clearHistory: () => set({ history: [] }),

      reset: () => set({
        inputText: '',
        intensity: 'Medium',
        outputLength: 'Medium',
        hashtags: false,
        lastResult: null,
      }),
    }),
    {
      name: 'persona-storage',
      storage: createJSONStorage(() => mmkvStorage),
      partialize: (state) => ({
        inputText: state.inputText,
        selectedPersona: state.selectedPersona,
        intensity: state.intensity,
        outputLength: state.outputLength,
        hashtags: state.hashtags,
        history: state.history,
      }),
    }
  )
);
