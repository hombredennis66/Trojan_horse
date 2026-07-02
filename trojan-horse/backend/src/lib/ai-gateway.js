import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Google Gen AI SDK
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || "");

/**
 * Sends a chat message along with its thread history to the Gemini API.
 */
export async function generateChatResponse(message, history) {
  try {
    // Execute content generation using the fast gemini-2.0-flash model
    const model = genAI.getGenerativeModel({
      model: 'gemini-2.0-flash',
      systemInstruction: "You are an internal dashboard assistant. Keep answers direct, data-focused, concise, and formatted beautifully in clean Markdown.",
    });

    // Format history structure to match Google Gen AI SDK contents schema
    const chatHistory = history.map(turn => ({
      role: turn.role,
      parts: [{ text: turn.text }]
    }));

    const chat = model.startChat({
      history: chatHistory,
      generationConfig: {
        temperature: 0.3,
        maxOutputTokens: 1000,
      }
    });

    const result = await chat.sendMessage(message);
    const response = await result.response;
    const text = response.text();

    if (!text) {
      throw new Error("Empty response received from Gemini API.");
    }

    return text;
  } catch (error) {
    console.error("AI Gateway Error:", error);
    throw new Error("Failed to process request through Gemini AI Gateway.");
  }
}
