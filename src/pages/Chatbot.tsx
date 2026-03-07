import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MessageSquare, 
  Send, 
  User, 
  Bot, 
  Loader2, 
  Sparkles,
  RefreshCcw,
  Trash2
} from 'lucide-react';
import { aiService } from '../services/api';
import { ChatMessage } from '../types';
import ReactMarkdown from 'react-markdown';

export default function Chatbot() {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await aiService.getChatHistory();
        setMessages(res.data);
      } catch (err) {
        console.error('Error fetching chat history:', err);
      }
    };
    fetchHistory();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;

    const userMsg: ChatMessage = {
      id: Date.now(),
      role: 'user',
      content: input,
      created_at: new Date().toISOString()
    };

    setMessages(prev => [...prev, userMsg]);
    setInput('');
    setLoading(true);

    try {
      const res = await aiService.chat(input);
      const botMsg: ChatMessage = {
        id: Date.now() + 1,
        role: 'assistant',
        content: res.data.response,
        created_at: new Date().toISOString()
      };
      setMessages(prev => [...prev, botMsg]);
    } catch (err) {
      console.error('Error sending message:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto h-[calc(100vh-12rem)] flex flex-col">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-3">
          <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
            <Bot className="w-7 h-7 text-emerald-400" />
          </div>
          <div>
            <h1 className="text-2xl font-bold">AI Career Assistant</h1>
            <div className="flex items-center space-x-1.5">
              <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-xs text-emerald-400 font-medium">Online & Ready to Help</span>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <button className="p-2 glass-card hover:bg-white/10 transition-colors text-gray-400">
            <RefreshCcw className="w-5 h-5" />
          </button>
          <button className="p-2 glass-card hover:bg-white/10 transition-colors text-gray-400">
            <Trash2 className="w-5 h-5" />
          </button>
        </div>
      </div>

      <div className="flex-1 glass-card overflow-hidden flex flex-col">
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {messages.length === 0 && (
            <div className="h-full flex flex-col items-center justify-center text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-white/5 border border-white/10 flex items-center justify-center">
                <Sparkles className="w-10 h-10 text-primary" />
              </div>
              <div className="space-y-2">
                <h3 className="text-xl font-bold">How can I help you today?</h3>
                <p className="text-gray-400 max-w-sm">
                  Ask me about resume tips, interview strategies, 
                  or career growth recommendations.
                </p>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 w-full max-w-lg">
                {[
                  "How can I improve my resume?",
                  "Tips for a software engineer interview",
                  "What skills are in demand for 2024?",
                  "How to negotiate my salary?"
                ].map((suggestion, i) => (
                  <button
                    key={i}
                    onClick={() => setInput(suggestion)}
                    className="p-4 text-sm text-left glass-card hover:border-primary/30 transition-all text-gray-300"
                  >
                    {suggestion}
                  </button>
                ))}
              </div>
            </div>
          )}

          {messages.map((msg) => (
            <motion.div
              key={msg.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
            >
              <div className={`flex max-w-[80%] space-x-4 ${msg.role === 'user' ? 'flex-row-reverse space-x-reverse' : ''}`}>
                <div className={`w-10 h-10 rounded-xl flex-shrink-0 flex items-center justify-center border ${
                  msg.role === 'user' 
                    ? 'bg-primary/20 border-primary/30' 
                    : 'bg-emerald-500/20 border-emerald-500/30'
                }`}>
                  {msg.role === 'user' ? <User className="w-5 h-5 text-primary" /> : <Bot className="w-5 h-5 text-emerald-400" />}
                </div>
                <div className={`p-4 rounded-2xl ${
                  msg.role === 'user' 
                    ? 'bg-primary text-white rounded-tr-none' 
                    : 'bg-white/5 border border-white/10 text-gray-200 rounded-tl-none'
                }`}>
                  <div className="markdown-body prose prose-invert max-w-none text-sm leading-relaxed">
                    <ReactMarkdown>{msg.content}</ReactMarkdown>
                  </div>
                  <p className={`text-[10px] mt-2 opacity-50 ${msg.role === 'user' ? 'text-right' : ''}`}>
                    {new Date(msg.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
          {loading && (
            <div className="flex justify-start">
              <div className="flex max-w-[80%] space-x-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                  <Bot className="w-5 h-5 text-emerald-400" />
                </div>
                <div className="bg-white/5 border border-white/10 p-4 rounded-2xl rounded-tl-none">
                  <Loader2 className="w-5 h-5 animate-spin text-emerald-400" />
                </div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form onSubmit={handleSend} className="p-6 border-t border-white/10 bg-black/20">
          <div className="relative">
            <input
              type="text"
              className="w-full glass-input pl-6 pr-16 py-4"
              placeholder="Type your message here..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
            <button
              type="submit"
              disabled={!input.trim() || loading}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-3 bg-primary text-white rounded-xl hover:bg-primary/90 transition-all disabled:opacity-50"
            >
              <Send className="w-5 h-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
