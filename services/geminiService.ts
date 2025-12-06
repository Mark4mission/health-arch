import { GoogleGenAI, Chat } from "@google/genai";
import { SYSTEM_INSTRUCTION } from "../constants";

let chatSession: Chat | null = null;
let isApiKeyMissing = false;

const getClient = (): GoogleGenAI | null => {
    // In Vite, environment variables exposed to the client must start with VITE_
    // and are accessed via import.meta.env
    const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ''; 
    
    if (!apiKey) {
      console.warn("API Key is missing. Please set VITE_GEMINI_API_KEY in your environment.");
      isApiKeyMissing = true;
      return null;
    }

    return new GoogleGenAI({ apiKey });
};

export const initializeChat = async () => {
  try {
    const ai = getClient();
    if (!ai) return false;

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
      if (isApiKeyMissing) {
        return "⚠️ 오류: API 키가 설정되지 않았습니다.\n\nVercel 설정 > Environment Variables에서 'VITE_GEMINI_API_KEY'가 올바르게 설정되었는지 확인하고 재배포(Redeploy) 해주세요.";
      }
      return "⚠️ 오류: AI 상담사 연결에 실패했습니다. 네트워크 상태를 확인하거나 잠시 후 다시 시도해주세요.";
    }
  }

  try {
    // We already checked chatSession in the block above
    const response = await chatSession!.sendMessage({ message });
    return response.text || "죄송합니다. 응답을 생성할 수 없습니다.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "오류: 건강 상담사와의 통신 중 문제가 발생했습니다. 잠시 후 다시 시도해주세요.";
  }
};
