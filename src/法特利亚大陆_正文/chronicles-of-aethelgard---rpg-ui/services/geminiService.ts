import { GoogleGenAI } from "@google/genai";

// NOTE: In a real environment, ensure process.env.API_KEY is available.
// For this demo UI, this service is defined but not actively calling the API 
// to prevent API key errors without user configuration.

const getAiClient = () => {
    // Check if API key exists safely to avoid crashing the UI demo if not configured
    const apiKey = process.env.API_KEY;
    if (!apiKey) return null;
    return new GoogleGenAI({ apiKey });
};

export const generateResponse = async (prompt: string, history: any[]) => {
  const ai = getAiClient();
  if (!ai) {
    console.warn("API Key missing, returning mock response");
    return { text: "Simulated response: API Key not configured." };
  }

  try {
    const model = 'gemini-2.5-flash';
    // Construct contents based on history + new prompt
    // This is a simplified example.
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
          systemInstruction: "You are a Dungeon Master for a text-based RPG. Keep responses immersive, classical, and elegant.",
      }
    });
    return response;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};
