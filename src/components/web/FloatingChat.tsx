'use client';

import { useState, useRef, useEffect } from 'react';
import { MessageSquare, X, Send, MessageCircle, Sparkles, ArrowRight } from 'lucide-react';

interface ChatMessage {
  sender: 'user' | 'bot';
  text: string;
  suggestions?: string[];
}

export default function FloatingChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      sender: 'bot',
      text: 'Welcome to LogicForge! I am your AI Creative Assistant. Ask me about our services, case studies, or custom WebGL/Art design projects. What shall we co-create today?',
      suggestions: ['Our Services', 'Our Projects', 'Show Portfolio', 'Quote Request']
    }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSendMessage = async (textToSend: string) => {
    if (!textToSend.trim() || isLoading) return;

    // Add user message
    setMessages((prev) => [...prev, { sender: 'user', text: textToSend }]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: textToSend }),
      });

      const data = await response.json();
      
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: data.reply || 'Sorry, I encountered an error. Please try again.',
          suggestions: data.suggestions || []
        }
      ]);
    } catch (error) {
      setIsLoading(false);
      setMessages((prev) => [
        ...prev,
        {
          sender: 'bot',
          text: 'Connection error. Please check your internet and try again.'
        }
      ]);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    if (suggestion === 'Quote Request') {
      window.location.href = '/contact?tab=quote';
    } else if (suggestion === 'Our Services') {
      window.location.href = '/services';
    } else if (suggestion === 'Our Projects') {
      window.location.href = '/projects';
    } else if (suggestion === 'Show Portfolio') {
      handleSendMessage('Tell me about your projects');
    } else if (suggestion === 'Talk to Human' || suggestion === 'WhatsApp Chat') {
      window.open('https://wa.me/18005556664', '_blank');
    } else {
      handleSendMessage(suggestion);
    }
  };

  return (
    <div className="fixed bottom-6 right-6 z-[999] font-sans">
      {/* Floating Action Button */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="relative group p-4 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue text-white shadow-lg hover:shadow-neon-purple/50 transition-all duration-300 transform hover:scale-110 flex items-center justify-center cursor-pointer animate-glow"
          aria-label="Open AI Assistant"
        >
          <Sparkles className="w-6 h-6 absolute opacity-0 group-hover:opacity-100 group-hover:scale-125 transition-all duration-300" />
          <MessageSquare className="w-6 h-6 group-hover:opacity-0 transition-opacity duration-300" />
          <span className="absolute -top-1 -right-1 flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-neon-cyan opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-neon-cyan"></span>
          </span>
        </button>
      )}

      {/* Chat Window Panel */}
      {isOpen && (
        <div className="w-[360px] h-[500px] rounded-2xl glass-panel flex flex-col shadow-2xl overflow-hidden border border-neon-purple/20 transition-all duration-300 animate-fade-in animate-scale-up">
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-[#0f0f0f]/90 to-[#222]/50 border-b border-white/5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-1.5 rounded-lg bg-neon-purple/20">
                <Sparkles className="w-5 h-5 text-neon-cyan animate-pulse" />
              </div>
              <div>
                <h3 className="font-space font-bold text-sm tracking-wider text-white">LOGICFORGE AI</h3>
                <span className="text-[10px] text-neon-cyan flex items-center gap-1 font-semibold">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-ping"></span>
                  ONLINE HELP
                </span>
              </div>
            </div>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 text-gray-400 hover:text-white hover:bg-white/5 rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Messages List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-4 scrollbar-thin">
            {messages.map((msg, i) => (
              <div
                key={i}
                className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
              >
                <div
                  className={`max-w-[85%] rounded-2xl px-4 py-3 text-xs leading-relaxed ${
                    msg.sender === 'user'
                      ? 'bg-gradient-to-r from-neon-purple to-neon-blue text-white rounded-tr-none'
                      : 'bg-[#151515] border border-white/5 text-gray-300 rounded-tl-none'
                  }`}
                >
                  <p className="whitespace-pre-line">{msg.text}</p>
                </div>

                {/* Suggestions / Chips */}
                {msg.sender === 'bot' && msg.suggestions && msg.suggestions.length > 0 && (
                  <div className="flex flex-wrap gap-2 mt-3 max-w-[95%]">
                    {msg.suggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        onClick={() => handleSuggestionClick(suggestion)}
                        className="text-[10px] bg-white/5 hover:bg-neon-purple/20 text-gray-300 hover:text-white border border-white/10 hover:border-neon-purple/40 rounded-full px-3 py-1.5 transition-all cursor-pointer font-medium"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isLoading && (
              <div className="flex items-center gap-1 bg-[#151515] border border-white/5 rounded-2xl px-4 py-3 max-w-[80px]">
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></span>
                <span className="w-1.5 h-1.5 bg-gray-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></span>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Footer Input */}
          <div className="p-3 border-t border-white/5 bg-[#0f0f0f]/80 flex flex-col gap-2">
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(input);
              }}
              className="flex gap-2"
            >
              <input
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask LogicForge..."
                className="flex-1 text-xs bg-white/5 border border-white/10 rounded-xl px-3 py-2.5 text-white placeholder-gray-500 focus:outline-none focus:border-neon-purple transition-all"
              />
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2.5 rounded-xl bg-neon-purple hover:bg-neon-blue text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all flex items-center justify-center cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>

            <div className="flex justify-between items-center px-1 text-[10px] text-gray-500">
              <span>Escalate to Human:</span>
              <a
                href="https://wa.me/18005556664"
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1 text-emerald-400 hover:text-emerald-300 font-bold transition-all"
              >
                <MessageCircle className="w-3.5 h-3.5" />
                WhatsApp Chat
                <ArrowRight className="w-2.5 h-2.5" />
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
