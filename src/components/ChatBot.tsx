import { useState, useRef, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Bot, User, Loader2, Copy, Check, ExternalLink } from 'lucide-react';

// API endpoint from environment variable
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3000/api/chat';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Component to render message content with clickable URLs and copyable phone numbers
function MessageContent({ content }: { content: string }) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Parse content and return React elements
  const parseContent = (text: string): React.ReactNode[] => {
    const elements: React.ReactNode[] = [];

    // Combined pattern: URLs, emails, phone numbers
    const pattern = /(https?:\/\/[^\s,)]+)|([a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,})|(\+91\s?\d{10}|\+91[-.\s]?\d{5}[-.\s]?\d{5})/g;

    let lastIndex = 0;
    let keyIndex = 0;
    let match: RegExpExecArray | null = pattern.exec(text);

    while (match !== null) {
      // Add text before the match
      if (match.index > lastIndex) {
        elements.push(
          <span key={`text-${keyIndex++}`}>
            {text.slice(lastIndex, match.index)}
          </span>
        );
      }

      const [, url, email, phone] = match;

      if (url) {
        // Clean URL (remove trailing punctuation)
        const cleanUrl = url.replace(/[.,;:!?)]+$/, '');
        const trailingPunc = url.slice(cleanUrl.length);

        elements.push(
          <a
            key={`url-${keyIndex++}`}
            href={cleanUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-0.5 text-[#06b6d4] hover:text-[#22d3ee] underline underline-offset-2 transition-colors"
          >
            {cleanUrl.length > 35 ? `${cleanUrl.slice(0, 35)}...` : cleanUrl}
            <ExternalLink size={11} className="inline flex-shrink-0" />
          </a>
        );

        if (trailingPunc) {
          elements.push(<span key={`punc-${keyIndex++}`}>{trailingPunc}</span>);
        }
      } else if (email) {
        elements.push(
          <a
            key={`email-${keyIndex++}`}
            href={`mailto:${email}`}
            className="inline-flex items-center gap-0.5 text-[#06b6d4] hover:text-[#22d3ee] underline underline-offset-2 transition-colors"
          >
            {email}
            <ExternalLink size={11} className="inline flex-shrink-0" />
          </a>
        );
      } else if (phone) {
        elements.push(
          <span key={`phone-${keyIndex++}`} className="inline-flex items-center gap-1">
            <a
              href={`tel:${phone.replace(/[-.\s]/g, '')}`}
              className="text-[#06b6d4] hover:text-[#22d3ee] underline underline-offset-2 transition-colors"
            >
              {phone}
            </a>
            <button
              onClick={() => handleCopy(phone)}
              className="p-0.5 rounded hover:bg-[#1e3a5f] transition-colors"
              title="Copy phone number"
              type="button"
            >
              {copiedText === phone ? (
                <Check size={12} className="text-green-400" />
              ) : (
                <Copy size={12} className="text-[#8892b0] hover:text-[#06b6d4]" />
              )}
            </button>
          </span>
        );
      }

      lastIndex = pattern.lastIndex;
      match = pattern.exec(text);
    }

    // Add remaining text
    if (lastIndex < text.length) {
      elements.push(
        <span key={`text-${keyIndex++}`}>
          {text.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  return <>{parseContent(content)}</>;
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when new messages arrive
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Close on escape key
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setIsOpen(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  const sendMessage = useCallback(async (userMessage: string) => {
    if (!userMessage.trim() || isLoading) return;

    const userMsg: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: userMessage,
    };

    setMessages((prev) => [...prev, userMsg]);
    setInput('');
    setIsLoading(true);
    setError(null);

    // Prepare messages for API (include history)
    const apiMessages = [...messages, userMsg].map((m) => ({
      role: m.role,
      content: m.content,
    }));

    try {
      const response = await fetch(CHAT_API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: apiMessages }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response');
      }

      // Create assistant message placeholder
      const assistantId = (Date.now() + 1).toString();
      setMessages((prev) => [
        ...prev,
        { id: assistantId, role: 'assistant', content: '' },
      ]);

      // Read streaming response with word-by-word effect
      const reader = response.body?.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      const addWordWithDelay = async (word: string, id: string) => {
        setMessages((prev) =>
          prev.map((m) =>
            m.id === id ? { ...m, content: m.content + word } : m
          )
        );
        // Small delay for smoother word-by-word effect
        await new Promise((resolve) => setTimeout(resolve, 15));
      };

      if (reader) {
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          buffer += chunk;

          // Process buffer word by word
          const words = buffer.split(/(\s+)/);
          // Keep the last potentially incomplete word in buffer
          buffer = words.pop() || '';

          for (const word of words) {
            await addWordWithDelay(word, assistantId);
          }
        }

        // Add any remaining content in buffer
        if (buffer) {
          await addWordWithDelay(buffer, assistantId);
        }
      }
    } catch (err) {
      console.error('Chat error:', err);
      setError('Failed to send message. Please try again.');
    } finally {
      setIsLoading(false);
    }
  }, [messages, isLoading]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <>
      {/* Chat Button - Left on mobile, Right on desktop */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0891b2] shadow-xl
                   bottom-6 left-6 lg:left-auto lg:right-6"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 1, duration: 0.5 }}
        style={{
          boxShadow: '0 4px 20px rgba(6, 182, 212, 0.4)',
        }}
        aria-label="Open chat"
      >
        <AnimatePresence mode="wait">
          {isOpen ? (
            <motion.div
              key="close"
              initial={{ rotate: -90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: 90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <X size={24} className="text-white" />
            </motion.div>
          ) : (
            <motion.div
              key="chat"
              initial={{ rotate: 90, opacity: 0 }}
              animate={{ rotate: 0, opacity: 1 }}
              exit={{ rotate: -90, opacity: 0 }}
              transition={{ duration: 0.2 }}
            >
              <MessageCircle size={24} className="text-white" />
            </motion.div>
          )}
        </AnimatePresence>

        {/* Pulse ring when closed */}
        {!isOpen && (
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#06b6d4]"
            initial={{ scale: 1, opacity: 0.5 }}
            animate={{ scale: 1.5, opacity: 0 }}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
        )}
      </motion.button>

      {/* Chat Panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            className="fixed z-50 flex flex-col bg-[#0a192f] border border-[#8892b0]/20 rounded-2xl shadow-2xl overflow-hidden
                       bottom-24 left-4 right-4 h-[70vh] max-h-[500px]
                       sm:left-6 sm:right-auto sm:w-[380px]
                       lg:left-auto lg:right-6"
          >
            {/* Header */}
            <div className="flex items-center gap-3 px-4 py-3 bg-gradient-to-r from-[#06b6d4]/10 to-[#db2777]/10 border-b border-[#8892b0]/10">
              <div className="flex items-center justify-center w-10 h-10 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0891b2]">
                <Bot size={20} className="text-white" />
              </div>
              <div className="flex-1">
                <h3 className="text-[#ccd6f6] font-semibold text-sm">Chat with AI</h3>
                <p className="text-[#8892b0] text-xs">Ask about Abhishek</p>
              </div>
              <button
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-lg hover:bg-[#112240] transition-colors"
                aria-label="Close chat"
              >
                <X size={18} className="text-[#8892b0]" />
              </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto overflow-x-hidden p-4 space-y-4 scrollbar-thin scrollbar-thumb-[#8892b0]/20 scrollbar-track-transparent">
              {/* Welcome message */}
              {messages.length === 0 && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-3"
                >
                  <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#06b6d4] to-[#0891b2]">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed bg-[#112240] text-[#ccd6f6] rounded-bl-md border border-[#8892b0]/10">
                    Hi! I'm Abhishek's AI assistant. Ask me anything about his skills, experience, or projects!
                  </div>
                </motion.div>
              )}

              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className={`flex gap-3 ${message.role === 'user' ? 'flex-row-reverse' : ''}`}
                >
                  {/* Avatar */}
                  <div
                    className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-[#db2777] to-[#9333ea]'
                        : 'bg-gradient-to-br from-[#06b6d4] to-[#0891b2]'
                    }`}
                  >
                    {message.role === 'user' ? (
                      <User size={16} className="text-white" />
                    ) : (
                      <Bot size={16} className="text-white" />
                    )}
                  </div>

                  {/* Message bubble */}
                  <div
                    className={`max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed break-words overflow-wrap-anywhere ${
                      message.role === 'user'
                        ? 'bg-gradient-to-br from-[#db2777] to-[#9333ea] text-white rounded-br-md'
                        : 'bg-[#112240] text-[#ccd6f6] rounded-bl-md border border-[#8892b0]/10'
                    }`}
                    style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                  >
                    {message.content ? (
                      <MessageContent content={message.content} />
                    ) : (
                      message.role === 'assistant' && isLoading && (
                        <Loader2 size={18} className="text-[#06b6d4] animate-spin" />
                      )
                    )}
                  </div>
                </motion.div>
              ))}

              {/* Loading indicator for initial response */}
              {isLoading && messages[messages.length - 1]?.role === 'user' && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="flex gap-3"
                >
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0891b2] flex items-center justify-center">
                    <Bot size={16} className="text-white" />
                  </div>
                  <div className="bg-[#112240] border border-[#8892b0]/10 rounded-2xl rounded-bl-md px-4 py-2.5">
                    <Loader2 size={18} className="text-[#06b6d4] animate-spin" />
                  </div>
                </motion.div>
              )}

              {/* Error message */}
              {error && (
                <div className="text-center text-red-400 text-sm py-2">
                  {error}
                </div>
              )}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form
              onSubmit={handleSubmit}
              className="p-4 border-t border-[#8892b0]/10 bg-[#0a192f]"
            >
              <div className="flex gap-2">
                <input
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Ask me anything..."
                  className="flex-1 px-4 py-2.5 bg-[#112240] border border-[#8892b0]/20 rounded-xl text-[#ccd6f6] text-sm placeholder-[#8892b0]/50 focus:outline-none focus:border-[#06b6d4]/50 transition-colors"
                  disabled={isLoading}
                />
                <motion.button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-[#06b6d4] to-[#0891b2] text-white disabled:opacity-50 disabled:cursor-not-allowed transition-opacity"
                >
                  <Send size={18} />
                </motion.button>
              </div>
            </form>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
