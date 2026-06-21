import { AnimatePresence, motion } from 'framer-motion';
import { Check, ChevronDown, Copy, ExternalLink, Loader2 } from 'lucide-react';
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
              className="text-[color:var(--primary)] underline underline-offset-2 transition-opacity hover:opacity-80"
            >
              {part}
            </a>
            <button
              onClick={() => handleCopy(part)}
              className="rounded p-0.5 transition-colors hover:bg-base-300/60"
              title="Copy phone number"
              aria-label={copiedText === part ? 'Phone number copied' : 'Copy phone number'}
              type="button"
            >
              {copiedText === part ? (
                <Check size={12} className="text-[color:var(--primary)]" />
              ) : (
                <Copy size={12} className="text-muted" />
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

  // Custom components for ReactMarkdown — Trace theme
  const markdownComponents: Components = {
    h1: ({ children }) => (
      <h1 className="mt-3 mb-2 font-display text-base font-bold text-ink first:mt-0">
        {processChildren(children)}
      </h1>
    ),
    h2: ({ children }) => (
      <h2 className="mt-3 mb-2 font-display text-[15px] font-bold text-ink first:mt-0">
        {processChildren(children)}
      </h2>
    ),
    h3: ({ children }) => (
      <h3 className="mt-2 mb-1 font-display text-sm font-bold text-ink first:mt-0">
        {processChildren(children)}
      </h3>
    ),
    p: ({ children }) => <p className="mb-2 last:mb-0">{processChildren(children)}</p>,
    a: ({ href, children }) => {
      const isEmail = href?.startsWith('mailto:');
      return (
        <a
          href={href}
          target={isEmail ? undefined : '_blank'}
          rel={isEmail ? undefined : 'noopener noreferrer'}
          className="inline-flex items-center gap-0.5 break-all text-[color:var(--primary)] underline underline-offset-2 transition-opacity hover:opacity-80"
        >
          {children}
          <ExternalLink size={11} className="inline flex-shrink-0" />
        </a>
      );
    },
    ul: ({ children }) => <ul className="mb-2 list-inside list-disc space-y-1">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-inside list-decimal space-y-1">{children}</ol>,
    li: ({ children }) => <li className="text-ink">{processChildren(children)}</li>,
    code: ({ className, children }) => {
      const isInline = !className;
      if (isInline) {
        return (
          <code className="rounded bg-base-300/70 px-1.5 py-0.5 font-mono text-xs text-[color:var(--primary)]">
            {children}
          </code>
        );
      }
      return (
        <code className="my-2 block overflow-x-auto rounded-lg bg-base-300/70 p-3 font-mono text-xs text-ink">
          {children}
        </code>
      );
    },
    pre: ({ children }) => <pre className="my-2">{children}</pre>,
    blockquote: ({ children }) => (
      <blockquote className="my-2 border-l-2 border-[color:var(--primary)] pl-3 text-muted italic">
        {processChildren(children)}
      </blockquote>
    ),
    strong: ({ children }) => (
      <strong className="font-bold text-ink">{processChildren(children)}</strong>
    ),
    em: ({ children }) => <em className="text-muted italic">{processChildren(children)}</em>,
    hr: () => <hr className="my-3 border-line" />,
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

// Suggestion pills — mono chips shown above the input line
function SuggestionPills({
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
    // mobile: one horizontal-scroll row (compact); sm+: wrap to fill width
    <div className="mb-2.5 flex flex-nowrap items-center gap-1.5 overflow-x-auto [scrollbar-width:none] sm:flex-wrap [&::-webkit-scrollbar]:hidden">
      {suggestions.map((suggestion, index) => (
        <button
          key={suggestion}
          type="button"
          onClick={() => onSelect(suggestion, index)}
          className="shrink-0 whitespace-nowrap rounded-full border px-2.5 py-1.5 font-mono text-[11.5px] transition-colors sm:shrink"
          style={{
            borderColor:
              selectedIndex === index
                ? 'color-mix(in srgb, var(--primary) 55%, transparent)'
                : 'rgba(237,239,243,0.12)',
            color: selectedIndex === index ? 'var(--primary)' : '#8a91a0',
          }}
        >
          {suggestion}
        </button>
      ))}
      <span className="ml-1 hidden font-mono text-[10px] text-muted/50 sm:inline">
        click to send · Tab to edit
      </span>
    </div>
  );
}

// Docked state — a small themed "trace ❯" chip that reopens the console, with a
// pulse ring + a brief hint so the user knows where the console went.
function DockedConsole({ onReopen, hintVisible }: { onReopen: () => void; hintVisible: boolean }) {
  return (
    <div className="relative">
      <AnimatePresence>
        {hintVisible && (
          <motion.div
            initial={{ opacity: 0, y: 8, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 8, scale: 0.96 }}
            transition={{ duration: 0.25, ease: [0.2, 0.7, 0.2, 1] }}
            className="absolute right-0 bottom-full mb-2.5 w-max max-w-[78vw] rounded-xl border border-line px-3 py-2 font-mono text-[11.5px] text-ink"
            style={{
              background: 'rgba(23,25,31,0.96)',
              backdropFilter: 'blur(14px)',
              WebkitBackdropFilter: 'blur(14px)',
              boxShadow: '0 10px 30px rgba(0,0,0,0.45)',
            }}
          >
            <span style={{ color: 'var(--primary)' }}>trace ❯</span> console docked — tap to reopen
            {/* little pointer toward the chip */}
            <span
              className="absolute top-full right-5 size-2.5 -translate-y-1/2 rotate-45 border-r border-b border-line"
              style={{ background: 'rgba(23,25,31,0.96)' }}
            />
          </motion.div>
        )}
      </AnimatePresence>

      <button
        type="button"
        onClick={onReopen}
        aria-label="Reopen trace console"
        className="group relative flex items-center gap-1.5 rounded-full border px-4 py-2.5 font-mono text-[13px] font-semibold transition-transform hover:-translate-y-0.5"
        style={{
          background: 'rgba(23,25,31,0.96)',
          backdropFilter: 'blur(14px)',
          WebkitBackdropFilter: 'blur(14px)',
          color: 'var(--primary)',
          borderColor: 'color-mix(in srgb, var(--primary) 45%, transparent)',
          boxShadow:
            '0 -8px 30px rgba(0,0,0,0.4), 0 0 0 1px color-mix(in srgb, var(--primary) 12%, transparent)',
        }}
      >
        {/* pulse ring to stay discoverable after the hint fades */}
        <span
          className="absolute inset-0 animate-ping rounded-full opacity-40"
          style={{ boxShadow: '0 0 0 1px color-mix(in srgb, var(--primary) 50%, transparent)' }}
          aria-hidden="true"
        />
        <span className="relative">trace ❯</span>
      </button>
    </div>
  );
}

export default function ChatBot() {
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  const [expanded, setExpanded] = useState(false);
  // docked = collapsed to the small trace❯ icon; open = full console
  const [open, setOpen] = useState(true);
  const [hintVisible, setHintVisible] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const consoleRef = useRef<HTMLDivElement>(null);
  const hasFetchedSuggestions = useRef(false);
  const hintTimer = useRef<number | undefined>(undefined);

  // Publish the docked-or-open block's live height as --console-h so page content
  // can pad itself clear of the fixed bar. Re-runs on open/close so the observed
  // element (console card ↔ small chip) is always the current one.
  // biome-ignore lint/correctness/useExhaustiveDependencies: `open` re-runs the effect to re-observe the swapped element
  useEffect(() => {
    const el = consoleRef.current;
    if (!el) return;
    const apply = () => {
      document.documentElement.style.setProperty('--console-h', `${el.offsetHeight + 8}px`);
    };
    apply();
    const ro = new ResizeObserver(apply);
    ro.observe(el);
    return () => {
      ro.disconnect();
      document.documentElement.style.removeProperty('--console-h');
    };
  }, [open]);

  // transcript panel shows only once there's a conversation in flight (and open)
  const panelVisible = open && expanded && (messages.length > 0 || isLoading);

  // Fetch the opening suggestions once (on mount) so the console invites a query
  useEffect(() => {
    if (hasFetchedSuggestions.current) return;
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
        setSuggestions([
          "What are Abhishek's technical skills?",
          "Tell me about Abhishek's experience",
          'What projects has Abhishek worked on?',
        ]);
      })
      .finally(() => setLoadingSuggestions(false));
  }, []);

  // Auto-scroll the transcript as messages stream in
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional scroll on message change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages.length]);

  // Escape collapses the transcript panel
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setExpanded(false);
    };
    window.addEventListener('keydown', handleEscape);
    return () => window.removeEventListener('keydown', handleEscape);
  }, []);

  // Reset selected suggestion when suggestions change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    return () => window.clearTimeout(hintTimer.current);
  }, []);

  // dock → small chip + a brief themed hint that auto-fades
  const dock = () => {
    setOpen(false);
    setExpanded(false);
    setHintVisible(true);
    window.clearTimeout(hintTimer.current);
    hintTimer.current = window.setTimeout(() => setHintVisible(false), 4500);
  };

  const reopen = () => {
    window.clearTimeout(hintTimer.current);
    setHintVisible(false);
    setOpen(true);
  };

  // Tab cycles through suggestions and fills the input
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

      setExpanded(true);
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

          // Empty stream (e.g. upstream LLM error) — drop the blank bubble, surface it
          if (!fullContent.trim()) {
            setMessages((prev) => prev.filter((m) => m.id !== assistantId));
            setError('No response from the assistant. Please try again.');
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
    setSelectedSuggestionIndex(index);
    sendMessage(suggestion); // Auto-send on click
  };

  const showSuggestions = suggestions.length > 0 && !isLoading;
  const lastMsg = messages[messages.length - 1];
  const streaming = isLoading && lastMsg?.role === 'assistant' && lastMsg.content.length > 0;

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <motion.div
        initial={{ y: 90, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: 'spring', stiffness: 260, damping: 28 }}
        className="pointer-events-auto mx-auto w-full max-w-6xl px-3.5 pb-3.5"
      >
        {/* expand panel — the transcript */}
        <AnimatePresence>
          {panelVisible && (
            <motion.div
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 16 }}
              transition={{ duration: 0.2 }}
              className="-mb-px rounded-t-2xl border border-b-0 border-line p-4 pt-3.5"
              style={{
                background: 'rgba(23,25,31,0.94)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: '0 -18px 50px rgba(0,0,0,0.45)',
              }}
            >
              {/* panel header */}
              <div className="mb-3 flex items-center justify-between gap-2.5 font-mono text-[11px] uppercase tracking-[0.1em] text-muted">
                <span className="flex items-center gap-2">
                  <span
                    className="size-[7px] rounded-full"
                    style={{
                      background: 'var(--primary)',
                      boxShadow: '0 0 7px color-mix(in srgb, var(--primary) 70%, transparent)',
                    }}
                  />
                  query · telemetry
                </span>
                <button
                  type="button"
                  onClick={() => setExpanded(false)}
                  className="rounded px-1.5 py-0.5 text-muted transition-colors hover:bg-base-content/5 hover:text-ink"
                >
                  collapse ✕
                </button>
              </div>

              {/* transcript */}
              <div className="flex max-h-[38vh] flex-col overflow-y-auto overflow-x-hidden [scrollbar-width:thin]">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`mb-2.5 flex ${
                      message.role === 'user' ? 'justify-end' : 'justify-start'
                    }`}
                  >
                    <div
                      className="max-w-[82%] break-words rounded-xl px-3.5 py-2.5 text-[13.5px] leading-[1.55] text-ink"
                      style={{
                        background:
                          message.role === 'user'
                            ? 'color-mix(in srgb, var(--primary) 15%, transparent)'
                            : 'rgba(237,239,243,0.04)',
                        border:
                          message.role === 'user'
                            ? '1px solid color-mix(in srgb, var(--primary) 32%, transparent)'
                            : '1px solid rgba(237,239,243,0.08)',
                        overflowWrap: 'anywhere',
                        wordBreak: 'break-word',
                      }}
                    >
                      {message.content ? (
                        <MessageContent content={message.content} />
                      ) : (
                        <span className="font-mono text-xs text-muted">
                          querying logs
                          <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
                        </span>
                      )}
                      {/* streaming caret on the live assistant message */}
                      {streaming && message.id === lastMsg?.id && (
                        <span
                          className="ml-0.5 inline-block h-3.5 w-[7px] align-[-2px]"
                          style={{
                            background: 'var(--primary)',
                            animation: 'blink 1s step-end infinite',
                          }}
                        />
                      )}
                    </div>
                  </div>
                ))}

                {/* loading bubble before the first token arrives */}
                {isLoading && lastMsg?.role === 'user' && (
                  <div className="mb-2.5 flex justify-start">
                    <div
                      className="rounded-xl px-3.5 py-2.5 font-mono text-xs text-muted"
                      style={{
                        background: 'rgba(237,239,243,0.04)',
                        border: '1px solid rgba(237,239,243,0.08)',
                      }}
                    >
                      querying logs
                      <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
                    </div>
                  </div>
                )}

                {error && (
                  <div
                    role="alert"
                    aria-live="polite"
                    className="py-2 text-center text-sm text-error"
                  >
                    {error}
                  </div>
                )}
                <div ref={messagesEndRef} />
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* bottom block: full console (open) or docked chip — ref stays stable for --console-h */}
        <div ref={consoleRef} className={open ? undefined : 'flex justify-end'}>
          {open ? (
            <div
              className="rounded-2xl border border-line p-3"
              style={{
                background: 'rgba(23,25,31,0.96)',
                backdropFilter: 'blur(14px)',
                WebkitBackdropFilter: 'blur(14px)',
                boxShadow: '0 -10px 40px rgba(0,0,0,0.4)',
              }}
            >
              {/* minimize handle */}
              <div className="mb-2 flex items-center justify-between">
                <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-muted/45">
                  trace ❯ console
                </span>
                <button
                  type="button"
                  onClick={dock}
                  aria-label="Minimize console"
                  title="Minimize console"
                  className="flex items-center gap-1 rounded-md border border-line px-2 py-1 font-mono text-[11px] text-muted transition-colors hover:border-[color:var(--primary)] hover:text-[color:var(--primary)]"
                >
                  <ChevronDown size={14} aria-hidden="true" />
                  minimize
                </button>
              </div>

              {loadingSuggestions && messages.length === 0 ? (
                <output className="mb-2.5 flex items-center gap-2 font-mono text-[11px] text-muted">
                  <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                  loading suggestions…
                </output>
              ) : (
                showSuggestions && (
                  <SuggestionPills
                    suggestions={suggestions}
                    onSelect={handleSuggestionClick}
                    isLoading={isLoading}
                    selectedIndex={selectedSuggestionIndex}
                  />
                )
              )}

              <form onSubmit={handleSubmit} className="flex items-center gap-2.5">
                <span
                  className="flex-none font-mono text-sm"
                  style={{ color: 'var(--primary)' }}
                  aria-hidden="true"
                >
                  trace ❯
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  onFocus={() => messages.length > 0 && setExpanded(true)}
                  placeholder="ask my telemetry anything…"
                  aria-label="Query the portfolio"
                  className="min-w-0 flex-1 border-none bg-transparent py-2 text-[14.5px] text-ink placeholder:text-muted/60 focus:outline-none"
                  disabled={isLoading}
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send query"
                  className="flex flex-none items-center gap-1.5 rounded-lg px-3.5 py-2 font-mono text-[13px] font-semibold transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
                  style={{ background: 'var(--primary)', color: '#0e0f13' }}
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'send'}
                </button>
              </form>
            </div>
          ) : (
            <DockedConsole onReopen={reopen} hintVisible={hintVisible} />
          )}
        </div>
      </motion.div>
    </div>
  );
}
