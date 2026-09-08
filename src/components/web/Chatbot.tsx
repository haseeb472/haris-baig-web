'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Send, X, Bot, Sparkles, User } from 'lucide-react';

interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function Chatbot() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 'welcome',
      text: `Welcome to LogicForge AI Assistant! I can help you explore our award-winning digital production capabilities. Ask me about our:
• **Services** (Art, Game Dev, Web Dev, AR/VR)
• **Portfolio Projects** (Case studies)
• **General FAQs**

What can I help you co-create today?`,
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  const [suggestions, setSuggestions] = useState<string[]>([
    'Our Services',
    'Show Portfolio',
    'Talk to Human'
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to the bottom on new messages or loading state change
  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [messages, isLoading]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    const userMsg: Message = {
      id: Math.random().toString(),
      text,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      
      const data = await response.json();
      
      if (data.reply) {
        setMessages((prev) => [
          ...prev,
          {
            id: Math.random().toString(),
            text: data.reply,
            sender: 'bot',
            timestamp: new Date()
          }
        ]);
      }
      
      if (data.suggestions && data.suggestions.length > 0) {
        setSuggestions(data.suggestions);
      }
    } catch (error) {
      console.error('Chat error:', error);
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          text: "I'm having trouble connecting right now. Please try again or visit our [Contact page](/contact).",
          sender: 'bot',
          timestamp: new Date()
        }
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSuggestionClick = (suggestion: string) => {
    const clean = suggestion.toLowerCase();
    if (clean.includes('request quote') || clean.includes('talk to human') || clean.includes('contact team') || clean.includes('whatsapp chat')) {
      window.location.href = '/contact';
    } else if (clean.includes('view projects') || clean.includes('show portfolio') || clean.includes('view case studies')) {
      window.location.href = '/projects';
    } else {
      sendMessage(suggestion);
    }
  };

  // Helper function to format bot reply (handles bold texts and list items beautifully)
  const formatMessage = (text: string) => {
    return text.split('\n').map((line, idx) => {
      const trimmed = line.trim();
      if (trimmed.startsWith('•') || trimmed.startsWith('-')) {
        const cleanLine = trimmed.replace(/^[•-]\s*/, '');
        return (
          <li key={idx} className="list-none pl-4 relative my-1 flex items-start gap-2 text-xs sm:text-sm text-gray-200">
            <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan mt-1.5 flex-shrink-0 shadow-[0_0_8px_#06b6d4]" />
            <span>{replaceBoldText(cleanLine)}</span>
          </li>
        );
      }
      return (
        <p key={idx} className="my-1.5 leading-relaxed text-xs sm:text-sm text-gray-200">
          {replaceBoldText(line)}
        </p>
      );
    });
  };

  const replaceBoldText = (text: string) => {
    const parts = text.split(/\*\*([^*]+)\*\*/g);
    return parts.map((part, i) => {
      if (i % 2 === 1) {
        return (
          <strong key={i} className="font-extrabold text-neon-cyan shadow-sm">
            {part}
          </strong>
        );
      }
      return part;
    });
  };

  return (
    <>
      {/* Floating Chat Trigger Bubble Button */}
      <div className="fixed bottom-6 right-6 z-50 flex items-center justify-center">
        <motion.button
          onClick={() => setIsOpen(!isOpen)}
          suppressHydrationWarning
          className="w-14 h-14 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue text-white flex items-center justify-center cursor-pointer shadow-[0_0_30px_rgba(168,85,247,0.3)] border border-white/10 hover:scale-105 active:scale-95 transition-all duration-300 relative group"
          aria-label="Toggle chat assistant"
          whileHover={{ rotate: 5 }}
        >
          {isOpen ? (
            <X className="w-6 h-6" />
          ) : (
            <MessageSquare className="w-6 h-6" />
          )}
          {/* Subtle floating glow effect */}
          <span className="absolute inset-0 rounded-full bg-gradient-to-tr from-neon-purple to-neon-blue opacity-30 blur-md -z-10 group-hover:opacity-60 transition-opacity" />
        </motion.button>
      </div>

      {/* Expandable Chat Window */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            data-lenis-prevent
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            transition={{ type: 'spring', damping: 25, stiffness: 220 }}
            className="fixed bottom-24 right-6 w-[360px] max-w-[calc(100vw-32px)] h-[540px] max-h-[calc(100vh-140px)] z-50 rounded-3xl border border-white/10 bg-black/75 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.6)] flex flex-col overflow-hidden"
          >
            {/* Header */}
            <div className="p-5 border-b border-white/10 bg-white/[0.02] flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-purple/20 to-neon-blue/20 border border-neon-cyan/20 flex items-center justify-center relative">
                  <Bot className="w-5 h-5 text-neon-cyan" />
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 border-2 border-black animate-pulse" />
                </div>
                <div>
                  <h3 className="font-space font-bold text-white text-sm flex items-center gap-1.5">
                    LogicForge AI
                    <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
                  </h3>
                  <p className="text-[10px] text-gray-400 font-medium">Ready to co-create</p>
                </div>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-1.5 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 text-gray-400 hover:text-white transition-all cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {/* Scrollable Messages Stream */}
            <div data-lenis-prevent className="flex-1 overflow-y-auto p-5 space-y-4 scrollbar-thin scrollbar-thumb-white/10 scrollbar-track-transparent">
              {messages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  {/* Bot Avatar */}
                  {msg.sender === 'bot' && (
                    <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <Bot className="w-4 h-4 text-neon-cyan" />
                    </div>
                  )}

                  {/* Message Bubble */}
                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 text-xs sm:text-sm font-sans ${
                      msg.sender === 'user'
                        ? 'bg-gradient-to-tr from-neon-purple to-neon-blue text-white rounded-tr-none border border-white/10'
                        : 'bg-white/[0.04] border border-white/5 text-gray-200 rounded-tl-none'
                    }`}
                  >
                    {msg.sender === 'user' ? (
                      <p>{msg.text}</p>
                    ) : (
                      <div className="space-y-1">{formatMessage(msg.text)}</div>
                    )}
                  </div>

                  {/* User Avatar */}
                  {msg.sender === 'user' && (
                    <div className="w-7 h-7 rounded-full bg-gradient-to-r from-neon-purple to-neon-blue flex items-center justify-center flex-shrink-0 mt-0.5 border border-white/10">
                      <User className="w-4 h-4 text-white" />
                    </div>
                  )}
                </div>
              ))}

              {/* Typing Indicator */}
              {isLoading && (
                <div className="flex gap-2.5 justify-start">
                  <div className="w-7 h-7 rounded-full bg-white/5 border border-white/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Bot className="w-4 h-4 text-neon-cyan" />
                  </div>
                  <div className="bg-white/[0.04] border border-white/5 rounded-2xl rounded-tl-none px-4 py-3 flex gap-1.5 items-center justify-center h-9">
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '0ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '150ms' }} />
                    <span className="w-1.5 h-1.5 rounded-full bg-neon-cyan animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Quick Suggestions Scrollable Bar */}
            <div className="px-5 py-3 border-t border-white/5 flex gap-2 overflow-x-auto select-none no-scrollbar flex-shrink-0 bg-white/[0.01]">
              {suggestions.map((chip, idx) => (
                <button
                  key={idx}
                  onClick={() => handleSuggestionClick(chip)}
                  className="px-3.5 py-1.5 rounded-full border border-white/10 hover:border-white/20 bg-white/5 hover:bg-white/10 text-white font-space text-[10px] uppercase font-bold tracking-wider whitespace-nowrap transition-all duration-300 cursor-pointer active:scale-95 flex-shrink-0"
                >
                  {chip}
                </button>
              ))}
            </div>

            {/* Input Form Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                sendMessage(inputText);
              }}
              className="p-4 border-t border-white/10 flex gap-2 items-center bg-white/[0.02]"
            >
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="Ask about services, open roles, portfolio..."
                className="flex-1 h-10 px-4 rounded-xl border border-white/10 bg-[#0f0f0f]/80 text-white text-xs sm:text-sm font-sans focus:outline-none focus:border-neon-cyan/50 focus:ring-1 focus:ring-neon-cyan/50 transition-colors"
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading || !inputText.trim()}
                className="w-10 h-10 rounded-xl bg-gradient-to-tr from-neon-purple to-neon-blue text-white flex items-center justify-center transition-all duration-300 disabled:opacity-50 disabled:scale-100 hover:scale-105 active:scale-95 cursor-pointer flex-shrink-0 border border-white/10"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
