import React, { useState, useRef, useEffect } from 'react';
import { sendMessageToGemini } from '../services/geminiService';
import { ChatMessage } from '../types';
import { Send, Bot, User, Loader2 } from 'lucide-react';
import { useHealth } from '../contexts/HealthContext';
import ReactMarkdown from 'react-markdown';

const GeminiAdvisor: React.FC = () => {
  const { profile, metrics } = useHealth();
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      role: 'model',
      text: "안녕하세요, 최상일님. 업데이트된 건강 데이터를 확인했습니다. 위염 관리를 위한 식단, 족저근막염에 무리가 없는 운동법, 또는 시간 관리 팁 등 무엇이든 물어보세요.",
      timestamp: new Date()
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: Date.now().toString(),
      role: 'user',
      text: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);

    // Context aware prompt construction
    const glucose = metrics.find(m => m.label === 'Fasting Glucose')?.value;
    const bp = metrics.find(m => m.label === 'Blood Pressure')?.value;
    
    const contextPrompt = `
      [Current User Context Update]
      Name: ${profile.name} (50M)
      Job: Airline Office (Sedentary)
      BMI: ${profile.bmi}
      Waist: ${profile.waist}cm
      Fasting Glucose: ${glucose}
      Blood Pressure: ${bp}
      History: Plantar Fasciitis, Gastritis, Benign Gastric Ulcer.
      Constraints: No running (foot pain). 1am sleep.
      
      User Query (Korean): ${userMsg.text}
      
      Please answer in Korean using Markdown formatting (bold, lists).
    `;

    const responseText = await sendMessageToGemini(contextPrompt);

    const botMsg: ChatMessage = {
      id: (Date.now() + 1).toString(),
      role: 'model',
      text: responseText,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, botMsg]);
    setIsLoading(false);
  };

  // IME Composition handler to prevent duplicate submission in Korean
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      // isComposing is true when the user is currently typing a CJK character.
      // We should assume the event is handled by the IME and not trigger send.
      if (e.nativeEvent.isComposing) return;
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-[600px] bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden animate-fade-in">
      {/* Header */}
      <div className="bg-teal-700 p-4 text-white flex items-center gap-2">
        <Bot size={20} />
        <div>
          <h3 className="font-bold">AI 건강 상담사</h3>
          <p className="text-xs text-teal-100">Powered by Gemini 2.5</p>
        </div>
      </div>

      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
        {messages.map((msg) => (
          <div 
            key={msg.id} 
            className={`flex gap-3 ${msg.role === 'user' ? 'flex-row-reverse' : ''}`}
          >
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              msg.role === 'user' ? 'bg-indigo-100 text-indigo-600' : 'bg-teal-100 text-teal-600'
            }`}>
              {msg.role === 'user' ? <User size={16} /> : <Bot size={16} />}
            </div>
            
            <div className={`max-w-[85%] p-3 rounded-2xl text-sm leading-relaxed ${
              msg.role === 'user' 
                ? 'bg-indigo-600 text-white rounded-tr-none' 
                : 'bg-white text-slate-700 shadow-sm border border-slate-100 rounded-tl-none prose prose-sm max-w-none'
            }`}>
               {msg.role === 'user' ? (
                 <p>{msg.text}</p>
               ) : (
                 <ReactMarkdown 
                    components={{
                        ul: ({node, ...props}) => <ul className="list-disc pl-4 mb-2" {...props} />,
                        ol: ({node, ...props}) => <ol className="list-decimal pl-4 mb-2" {...props} />,
                        li: ({node, ...props}) => <li className="mb-1" {...props} />,
                        strong: ({node, ...props}) => <strong className="font-bold text-teal-700" {...props} />,
                    }}
                 >
                   {msg.text}
                 </ReactMarkdown>
               )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="flex gap-3">
            <div className="w-8 h-8 rounded-full bg-teal-100 text-teal-600 flex items-center justify-center shrink-0">
              <Bot size={16} />
            </div>
            <div className="bg-white p-3 rounded-2xl rounded-tl-none shadow-sm border border-slate-100 flex items-center gap-2">
              <Loader2 size={16} className="animate-spin text-teal-600" />
              <span className="text-xs text-slate-500">분석 및 답변 생성 중...</span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>

      {/* Input Area */}
      <div className="p-4 bg-white border-t border-slate-100">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="식단, 운동법, 검사 결과에 대해 물어보세요..."
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-teal-500 bg-white text-slate-900"
          />
          <button 
            onClick={handleSend}
            disabled={isLoading || !input.trim()}
            className="bg-teal-600 hover:bg-teal-700 disabled:bg-slate-300 text-white rounded-lg px-4 py-2 transition-colors"
          >
            <Send size={18} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default GeminiAdvisor;
