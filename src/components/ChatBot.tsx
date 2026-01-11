import { AnimatePresence, motion } from 'framer-motion';
import {
  Bot,
  Check,
  Copy,
  ExternalLink,
  Loader2,
  MessageCircle,
  Send,
  User,
  X,
} from 'lucide-react';
import { type ReactNode, useCallback, useEffect, useRef, useState } from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

// API endpoint from environment variable
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3000/api/chat';
const SUGGESTIONS_API_URL = CHAT_API_URL.replace('/api/chat', '/api/suggestions');

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
}

// Parse suggestions from bot response
function parseSuggestions(content: string): { text: string; suggestions: string[] } {
  const suggestionsMatch = content.match(/\[SUGGESTIONS\]:\s*(.+)$/m);
  if (suggestionsMatch) {
    const suggestions = suggestionsMatch[1]
      .split('|')
      .map((s) => s.trim())
      .filter((s) => s.length > 0);
    const text = content.replace(/\n?\[SUGGESTIONS\]:.+$/m, '').trim();
    return { text, suggestions };
  }
  return { text: content, suggestions: [] };
}

// Component to render message content with markdown support
function MessageContent({ content }: { content: string }) {
  const [copiedText, setCopiedText] = useState<string | null>(null);

  const handleCopy = async (text: string) => {
    await navigator.clipboard.writeText(text);
    setCopiedText(text);
    setTimeout(() => setCopiedText(null), 2000);
  };

  // Process text to detect and render phone numbers with copy button
  const processPhoneNumbers = (text: string): ReactNode[] => {
    const phonePattern = /(\+91\s?\d{10}|\+91[-.\s]?\d{5}[-.\s]?\d{5})/g;
    const parts = text.split(phonePattern);

    return parts.map((part, index) => {
      // Check if this part matches phone pattern
      const isPhone = /^\+91[\s\d.-]+$/.test(part) && part.replace(/[-.\s]/g, '').length >= 12;
      if (isPhone) {
        return (
          <span key={index} className="inline-flex items-center gap-1">
            <a
              href={`tel:${part.replace(/[-.\s]/g, '')}`}
              className="text-[#06b6d4] hover:text-[#22d3ee] underline underline-offset-2 transition-colors"
            >
              {part}
            </a>
            <button
              onClick={() => handleCopy(part)}
              className="p-0.5 rounded hover:bg-[#1e3a5f] transition-colors"
              title="Copy phone number"
              type="button"
            >
              {copiedText === part ? (
                <Check size={12} className="text-green-400" />
              ) : (
                <Copy size={12} className="text-[#8892b0] hover:text-[#06b6d4]" />
              )}
            </button>
          </span>
        );
      }
      return part || null;
    });
  };

  // Recursively process children to handle phone numbers in text nodes
  const processChildren = (children: ReactNode): ReactNode => {
    if (typeof children === 'string') {
      const processed = processPhoneNumbers(children);
      return processed.length === 1 ? processed[0] : processed;
    }
    if (Array.isArray(children)) {
      return children.map((child, i) => <span key={i}>{processChildren(child)}</span>);
    }
    return children;
  };

  // Custom components for ReactMarkdown
  const markdownComponents: Components = {
    // Headings
    h1: ({ children }) => (
      <h1 className="text-lg font-bold text-[#ccd6f6] mt-3 mb-2 first:mt-0">
        {processChildren(children)}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="text-base font-bold text-[#ccd6f6] mt-3 mb-2 first:mt-0">
        {processChildren(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="text-sm font-bold text-[#ccd6f6] mt-2 mb-1 first:mt-0">
        {processChildren(children)}
      </h3>
    ),

    // Paragraphs
    p: ({ children }) => <p className="mb-2 last:mb-0">{processChildren(children)}</p>,

    // Links
    a: ({ href, children }) => {
      const isEmail = href?.startsWith('mailto:');
      return (
        <a
          href={href}
          target={isEmail ? undefined : '_blank'}
          rel={isEmail ? undefined : 'noopener noreferrer'}
          className="inline-flex items-center gap-0.5 text-[#06b6d4] hover:text-[#22d3ee] underline underline-offset-2 transition-colors break-all"
        >
          {children}
          <ExternalLink size={11} className="inline flex-shrink-0" />
        </a>
      );
    },

    // Lists
    ul: ({ children }) => <ul className="list-disc list-inside mb-2 space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="list-decimal list-inside mb-2 space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-[#ccd6f6]">{processChildren(children)}</li>,

    // Code
    code: ({ className, children }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="bg-[#1e3a5f] text-[#06b6d4] px-1.5 py-0.5 rounded text-xs font-mono">
            {children}
          </code>
        );
      }
      // Code block
      return (
        <code className="block bg-[#1e3a5f] text-[#ccd6f6] p-3 rounded-lg text-xs font-mono overflow-x-auto my-2">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <pre className="my-2">{children}</pre>,

    // Blockquote
    blockquote: ({ children }) => (
      <blockquote className="border-l-2 border-[#06b6d4] pl-3 my-2 text-[#8892b0] italic">
        {processChildren(children)}
      </blockquote>
    ),

    // Bold and italic
    strong: ({ children }) => (
      <strong className="font-bold text-[#ccd6f6]">{processChildren(children)}</strong>
    ),
    em: ({ children }) => <em className="italic text-[#a8b2d1]">{processChildren(children)}</em>,

    // Horizontal rule
    hr: () => <hr className="border-[#8892b0]/20 my-3" />,
  };

  // Remove suggestions line from content for display
  const { text: displayContent } = parseSuggestions(content);

  return (
    <div className="markdown-content">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}

// Suggestion chips component
function SuggestionChips({
  suggestions,
  onSelect,
  isLoading,
  selectedIndex,
}: {
  suggestions: string[];
  onSelect: (suggestion: string, index: number) => void;
  isLoading: boolean;
  selectedIndex: number;
}) {
  if (suggestions.length === 0 || isLoading) return null;

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex flex-wrap gap-2 mt-3"
    >
      {suggestions.map((suggestion, index) => (
        <motion.button
          key={suggestion}
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: index * 0.1 }}
          onClick={() => onSelect(suggestion, index)}
          className={`px-3 py-1.5 text-xs rounded-full transition-colors ${
            selectedIndex === index
              ? 'bg-[#06b6d4]/20 border border-[#06b6d4] text-[#06b6d4]'
              : 'bg-[#112240] border border-[#06b6d4]/30 text-[#06b6d4] hover:bg-[#06b6d4]/10 hover:border-[#06b6d4]/50'
          }`}
        >
          {suggestion}
        </motion.button>
      ))}
      <span className="text-[10px] text-[#8892b0]/50 self-center ml-1">Tab to fill</span>
    </motion.div>
  );
}

export default function ChatBot() {
  const [isOpen, setIsOpen] = useState(false);
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const hasFetchedSuggestions = useRef(false);

  // Fetch initial suggestions when chat opens
  useEffect(() => {
    if (isOpen && messages.length === 0 && !hasFetchedSuggestions.current) {
      hasFetchedSuggestions.current = true;
      setLoadingSuggestions(true);
      fetch(SUGGESTIONS_API_URL)
        .then((res) => res.json())
        .then((data) => {
          if (data.suggestions && Array.isArray(data.suggestions)) {
            setSuggestions(data.suggestions);
          }
        })
        .catch((err) => {
          console.error('Failed to fetch suggestions:', err);
          // Fallback suggestions
          setSuggestions([
            'What are your technical skills?',
            'Tell me about your experience',
            'What projects have you worked on?',
          ]);
        })
        .finally(() => setLoadingSuggestions(false));
    }
  }, [isOpen, messages.length]);

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

  // Reset selected suggestion when suggestions change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  // Handle Tab key to cycle through suggestions
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Tab' && suggestions.length > 0 && !isLoading) {
      e.preventDefault();
      const nextIndex = e.shiftKey
        ? selectedSuggestionIndex <= 0
          ? suggestions.length - 1
          : selectedSuggestionIndex - 1
        : (selectedSuggestionIndex + 1) % suggestions.length;
      setSelectedSuggestionIndex(nextIndex);
      setInput(suggestions[nextIndex]);
    }
  };

  const sendMessage = useCallback(
    async (userMessage: string) => {
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
      setSuggestions([]); // Clear suggestions while loading

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
        setMessages((prev) => [...prev, { id: assistantId, role: 'assistant', content: '' }]);

        // Read streaming response with word-by-word effect
        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        let buffer = '';
        let fullContent = '';

        const addWordWithDelay = async (word: string, id: string) => {
          fullContent += word;
          setMessages((prev) =>
            prev.map((m) => (m.id === id ? { ...m, content: m.content + word } : m)),
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

          // Extract suggestions from the complete response
          const { suggestions: newSuggestions } = parseSuggestions(fullContent);
          if (newSuggestions.length > 0) {
            setSuggestions(newSuggestions);
          }
        }
      } catch (err) {
        console.error('Chat error:', err);
        setError('Failed to send message. Please try again.');
      } finally {
        setIsLoading(false);
      }
    },
    [messages, isLoading],
  );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setInput(suggestion);
    setSelectedSuggestionIndex(index);
    inputRef.current?.focus();
  };

  return (
    <>
      {/* Chat Button - Always on right side to avoid content overlap */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed z-50 flex items-center justify-center w-14 h-14 rounded-full bg-gradient-to-br from-[#06b6d4] to-[#0891b2] shadow-xl
                   bottom-6 right-6"
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
                       sm:left-auto sm:right-6 sm:w-[380px]"
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
                  className="flex flex-col"
                >
                  <div className="flex gap-3">
                    <div className="flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center bg-gradient-to-br from-[#06b6d4] to-[#0891b2]">
                      <Bot size={16} className="text-white" />
                    </div>
                    <div className="max-w-[75%] px-4 py-2.5 rounded-2xl text-sm leading-relaxed bg-[#112240] text-[#ccd6f6] rounded-bl-md border border-[#8892b0]/10">
                      Hi! I'm Abhishek's AI assistant. Ask me anything about his skills, experience,
                      or projects!
                    </div>
                  </div>
                  {/* Initial suggestions */}
                  <div className="ml-11">
                    {loadingSuggestions ? (
                      <div className="flex items-center gap-2 mt-3 text-xs text-[#8892b0]">
                        <Loader2 size={12} className="animate-spin" />
                        Loading suggestions...
                      </div>
                    ) : (
                      <SuggestionChips
                        suggestions={suggestions}
                        onSelect={handleSuggestionClick}
                        isLoading={isLoading}
                        selectedIndex={selectedSuggestionIndex}
                      />
                    )}
                  </div>
                </motion.div>
              )}

              {messages.map((message, index) => {
                const isLastAssistant =
                  message.role === 'assistant' && index === messages.length - 1;
                return (
                  <motion.div
                    key={message.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex flex-col"
                  >
                    <div
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
                          message.role === 'assistant' &&
                          isLoading && <Loader2 size={18} className="text-[#06b6d4] animate-spin" />
                        )}
                      </div>
                    </div>
                    {/* Show suggestions after last assistant message */}
                    {isLastAssistant && !isLoading && message.content && (
                      <div className="ml-11">
                        <SuggestionChips
                          suggestions={suggestions}
                          onSelect={handleSuggestionClick}
                          isLoading={isLoading}
                          selectedIndex={selectedSuggestionIndex}
                        />
                      </div>
                    )}
                  </motion.div>
                );
              })}

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
              {error && <div className="text-center text-red-400 text-sm py-2">{error}</div>}

              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSubmit} className="p-4 border-t border-[#8892b0]/10 bg-[#0a192f]">
              <div className="flex gap-2">
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
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
