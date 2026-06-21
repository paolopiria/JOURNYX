
import { GoogleGenAI } from "@google/genai";

export async function getGameSummary(gameTitle: string, description: string) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Provide a punchy, 2-sentence marketing summary for a game called "${gameTitle}". Here is its description: ${description}. Focus on why a modern gamer would love it.`,
      config: {
        temperature: 0.7,
        topK: 40,
        topP: 0.95,
      }
    });
    return response.text || "No AI summary available.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "The AI is resting right now. Check back soon!";
  }
}

export async function getGameScoreInsight(gameTitle: string, rating: number) {
  try {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Based on a community rating of ${rating}/5 for "${gameTitle}", explain in one short sentence what this score tells a potential buyer about the game's quality.`,
    });
    return response.text;
  } catch (error) {
    return null;
  }
}
