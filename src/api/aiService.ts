import axios from 'axios';
import { Intensity, OutputLength, Persona, TranslationResult } from '../types';

const GEMINI_URL = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash-lite:generateContent';
const GROQ_URL = 'https://api.groq.com/openai/v1/chat/completions';

const SYSTEM_PROMPT = `
You are the Persona Engine. Transform the user input into the requested Persona.
Output must be a valid JSON object strictly following this structure:
{
  "translation": "The transformed text (WITHOUT hashtags)",
  "cringeScore": 0-100,
  "cringeLabel": "A short, funny label",
  "hashtags": ["#tag1", "#tag2"]
}

Guidelines:
1. Preserve the original meaning but completely change the VIBE.
2. Follow the requested Intensity (Low, Medium, High, Unhinged).
3. Follow the requested Length (Short, Medium, Long).
4. If Hashtags are requested, include them organically or at the end.
5. Be authentic to the persona archetypes.
6. If 'Include Hashtags' is true, generate 3-5 relevant ones in the 'hashtags' array. If false, return an empty array.
7. Return ONLY the JSON object. No extra text.
`;

const getPrompt = (input: string, persona: Persona, intensity: Intensity, length: OutputLength, hashtags: boolean) => `
Persona: ${persona.label}
Style: ${persona.prompt}
Intensity: ${intensity}
Length: ${length}
Include Hashtags: ${hashtags}

User Input: "${input}"
`.trim();

const cleanJsonResponse = (str: string): string => {
  // Removes markdown code blocks if present (e.g. ```json ... ```)
  const cleaned = str.replace(/```json\s?|```/g, '').trim();
  return cleaned;
};

const callGroq = async (prompt: string): Promise<TranslationResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GROQ_API_KEY;
  if (!apiKey) throw new Error('Groq Key Missing');

  const response = await axios.post(
    GROQ_URL,
    {
      model: 'llama-3.3-70b-versatile',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
    },
    {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
      timeout: 8000, // 8s timeout for Groq
    }
  );

  const content = response.data.choices[0].message.content;
  try {
    return JSON.parse(cleanJsonResponse(content));
  } catch (e) {
    console.error('[Groq Parsing Error]:', e, 'Original Content:', content);
    throw new Error('Failed to parse AI response. The vibe was too strong.');
  }
};

const callGemini = async (prompt: string): Promise<TranslationResult> => {
  const apiKey = process.env.EXPO_PUBLIC_GEMINI_API_KEY;
  if (!apiKey) throw new Error('Gemini Key Missing');

  const response = await axios.post(`${GEMINI_URL}?key=${apiKey}`, {
    contents: [{
      parts: [{ text: `${SYSTEM_PROMPT}\n\n${prompt}` }]
    }],
    generationConfig: {
      responseMimeType: "application/json"
    }
  });

  const resultText = response.data?.candidates?.[0]?.content?.parts?.[0]?.text;
  if (!resultText) throw new Error('Invalid Gemini response');
  try {
    return JSON.parse(cleanJsonResponse(resultText));
  } catch (e) {
    console.error('[Gemini Parsing Error]:', e, 'Original Content:', resultText);
    throw new Error('Failed to parse AI response. The vibe was too strong.');
  }
};

export const translateText = async (
  input: string,
  persona: Persona,
  intensity: Intensity,
  length: OutputLength,
  hashtags: boolean
): Promise<TranslationResult> => {
  if (!input.trim()) throw new Error('Empty input');
  
  const prompt = getPrompt(input, persona, intensity, length, hashtags);

  try {
    // Attempt Primary Engine (Groq)
    console.log('[Engine]: Attempting Groq...');
    return await callGroq(prompt);
  } catch (groqError: any) {
    console.warn('[Engine]: Groq Failed:', groqError.message);
    
    // Attempt Fallback Engine (Gemini)
    try {
      console.log('[Engine]: Falling back to Gemini...');
      return await callGemini(prompt);
    } catch (geminiError: any) {
      console.error('[Engine]: Gemini also failed:', geminiError.message);
      
      // Handle the specific error to show user
      if (groqError.response?.status === 429) {
        throw new Error('Groq Rate limit hit and Fallback failed. Please wait a moment.');
      }
      
      throw new Error(groqError.message || 'Persona Engine is currently unavailable.');
    }
  }
};
