import axios from 'axios';
import { Intensity, OutputLength, Persona, TranslationResult } from '../types';

// The URL and Key are now handled inside the function to ensure the environment is ready.
const BASE_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';

const SYSTEM_PROMPT = `
You are the Persona Engine. Transform the user input into the requested Persona.
Output must be a valid JSON object strictly following this structure:
{
  "translation": "The transformed text",
  "cringeScore": 0-100,
  "cringeLabel": "A short, funny label for the score (e.g., 'Pure Brainrot', 'LinkedIn Guru Level', 'Chai! Level 10')"
}

Guidelines:
1. Preserve the original meaning but completely change the VIBE.
2. Follow the requested Intensity (Low, Medium, High, Unhinged).
3. Follow the requested Length (Short, Medium, Long).
4. If Hashtags are requested, include them organically or at the end.
5. Be authentic to the persona archetypes.
6. Return ONLY the JSON object. No extra text.
`;

export const translateText = async (
  input: string,
  persona: Persona,
  intensity: Intensity,
  length: OutputLength,
  hashtags: boolean
): Promise<TranslationResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) {
    throw new Error('Gemini API Key is missing. Please check your .env file and restart the server.');
  }

  if (!input.trim()) throw new Error('Empty input');

  const fullUrl = `${BASE_URL}?key=${apiKey}`;

  const userPrompt = `
Persona: ${persona.label}
Style: ${persona.prompt}
Intensity: ${intensity}
Length: ${length}
Include Hashtags: ${hashtags}

User Input: "${input}"
  `.trim();

  try {
    const response = await axios.post(fullUrl, {
      contents: [{
        parts: [{ text: `${SYSTEM_PROMPT}\n\n${userPrompt}` }]
      }],
      generationConfig: {
        responseMimeType: "application/json"
      }
    });

    const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!resultText) throw new Error('Invalid AI response');

    return JSON.parse(resultText) as TranslationResult;
  } catch (error: any) {
    const apiError = error.response?.data?.error;
    if (apiError) {
      console.error('[Gemini API Error]:', JSON.stringify(apiError, null, 2));
      // Parse into concise user-facing messages
      if (error.response.status === 429) {
        const retryDelay = apiError.details?.find((d: any) => d['@type']?.includes('RetryInfo'))?.retryDelay;
        const seconds = retryDelay ? parseInt(retryDelay) : null;
        throw new Error(
          seconds
            ? `Rate limit hit. Please retry in ${seconds}s.`
            : 'Rate limit reached. Please wait a moment and try again.'
        );
      }
      if (error.response.status === 404) {
        throw new Error('AI model unavailable. Please check your API configuration.');
      }
      throw new Error(apiError.message?.split('.')[0] || 'API error. Please try again.');
    } else {
      console.error('[Gemini Network Error]:', error.message);
      throw new Error('Network error. Check your connection and try again.');
    }
  }
};
