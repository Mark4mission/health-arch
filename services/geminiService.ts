import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;

const getClient = (): GoogleGenAI => {
    // Assuming process.env.API_KEY is available via Vite/Webpack configuration
    // In a real scenario, this requires a backend proxy or secure env handling
    const apiKey = process.env.API_KEY || ''; 
    return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  try {
    const ai = getClient();
    chatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      config: {
        systemInstruction: SYSTEM_INSTRUCTION,
      },
    });
    return true;
  } catch (error) {
    console.error("Failed to initialize Gemini chat:", error);
    return false;
  }
};

export const sendMessageToGemini = async (message: string): Promise<string> => {
  if (!chatSession) {
    const success = await initializeChat();
    if (!success) {
      return "Unable to connect to the AI advisor at this time. Please check your API key configuration.";
    }
  }

  try {
    // We already checked chatSession in the block above
    const response = await chatSession!.sendMessage({ message });
    return response.text || "I'm sorry, I couldn't generate a response.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "An error occurred while communicating with the health advisor.";
  }
};
