import { AnimatePresence, animate, motion, useMotionValue } from 'framer-motion';
import { Check, Copy, ExternalLink, Loader2, RotateCw, Trash2, Undo2, X } from 'lucide-react';
import {
  type ReactNode,
  type PointerEvent as ReactPointerEvent,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react';
import type { Components } from 'react-markdown';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useCaseStudies } from '../hooks/useSanityData';
import { createNdjsonParser } from '../lib/chatStream';
import { selectStudy } from '../lib/studyEvents';
import type { ChatEvent, StatusLine } from '../types/chat';
import PageRefs from './chat/PageRefs';
import SpanWaterfall from './chat/SpanWaterfall';
import { FIREWALL_LIMIT_TEXT, TRY_AGAIN_LABEL, TRY_AGAIN_NOTE } from './chat/statusMessages';
import { matchStudies, type TraceTimings } from './chat/trace';

// API endpoint from environment variable
const CHAT_API_URL = import.meta.env.VITE_CHAT_API_URL || 'http://localhost:3000/api/chat';
const SUGGESTIONS_API_URL = CHAT_API_URL.replace('/api/chat', '/api/suggestions');

interface Message extends TraceTimings {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  failed?: boolean;
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
function MessageContent({ content, live }: { content: string; live: boolean }) {
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
    p: ({ children }) => <p className="mb-2">{processChildren(children)}</p>,
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
    ul: ({ children }) => <ul className="mb-2 list-disc pl-[1.15em]">{children}</ul>,
    ol: ({ children }) => <ol className="mb-2 list-decimal pl-[1.5em]">{children}</ol>,
    li: ({ children }) => (
      <li className="mb-1 text-ink marker:text-muted">{processChildren(children)}</li>
    ),
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
      <strong className="font-semibold text-ink">{processChildren(children)}</strong>
    ),
    em: ({ children }) => <em className="text-muted italic">{processChildren(children)}</em>,
    hr: () => <hr className="my-3 border-line" />,
  };

  // Remove suggestions line from content for display
  const { text: displayContent } = parseSuggestions(content);

  return (
    // data-live puts the streaming caret inline after the last word (index.css)
    <div className="markdown-content" data-live={live || undefined}>
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={markdownComponents}>
        {displayContent}
      </ReactMarkdown>
    </div>
  );
}

// How long "trace cleared" offers its undo.
const UNDO_MS = 5000;
const FALLBACK_SUGGESTIONS = [
  "What are Abhishek's technical skills?",
  "Tell me about Abhishek's experience",
  'What projects has Abhishek worked on?',
];

// One suggestion per row so ↑/↓ reads as a list; the picked row is amber (selected).
function SuggestionList({
  suggestions,
  onSelect,
  selectedIndex,
}: {
  suggestions: string[];
  onSelect: (suggestion: string, index: number) => void;
  selectedIndex: number;
}) {
  if (suggestions.length === 0) return null;
  return (
    <div className="mt-2">
      <ul className="font-mono text-[13px] md:text-xs">
        {suggestions.map((suggestion, index) => {
          const on = selectedIndex === index;
          return (
            <li key={suggestion}>
              <button
                type="button"
                onClick={() => onSelect(suggestion, index)}
                aria-current={on ? 'true' : undefined}
                className={`group mt-1.5 flex min-h-11 w-full items-center gap-2 rounded-[7px] border px-2.5 py-[7px] text-left transition-colors md:mt-0 md:min-h-0 ${on ? 'border-[color:var(--secondary-deep)] bg-[#1b1710] text-[color:var(--secondary)]' : 'border-line text-[#a9afbb] hover:text-[#34e5ff] md:border-transparent'}`}
              >
                <span
                  aria-hidden
                  className={
                    on ? '' : 'text-[#3a4050] transition-colors group-hover:text-[#34e5ff]'
                  }
                >
                  ❯
                </span>
                {suggestion}
              </button>
            </li>
          );
        })}
      </ul>
      <p className="mt-2 hidden font-mono text-xs text-muted md:block">
        <Key>↑</Key> <Key>↓</Key> pick · <Key>Enter</Key> send
      </p>
    </div>
  );
}

const Key = ({ children }: { children: ReactNode }) => (
  <kbd className="rounded border border-line bg-[#13151a] px-[5px] py-px text-ink">{children}</kbd>
);

// Counts the undo window down in whole seconds, so the visitor sees how long the offer lasts.
function UndoToast({ until, onUndo }: { until: number; onUndo: () => void }) {
  const [left, setLeft] = useState(() => Math.ceil((until - Date.now()) / 1000));
  useEffect(() => {
    const timer = window.setInterval(
      () => setLeft(Math.max(0, Math.ceil((until - Date.now()) / 1000))),
      250,
    );
    return () => window.clearInterval(timer);
  }, [until]);
  return (
    <div className="mb-2 flex items-center justify-between gap-2 rounded-lg border border-line bg-[#13151a] px-2.5 py-[7px] font-mono text-[12.5px] text-muted md:text-xs">
      <span>trace cleared</span>
      <button
        type="button"
        onClick={onUndo}
        className="-my-2 flex min-h-9 items-center gap-[5px] tabular-nums text-[color:var(--primary)] transition-colors hover:text-[#34e5ff]"
      >
        <Undo2 aria-hidden className="size-3" />
        undo · {left}s
      </button>
    </div>
  );
}

// Share of the sheet's height a drag must pass to close it; a fast flick closes sooner.
const DRAG_CLOSE_RATIO = 0.25;
const FLICK_PX_PER_MS = 0.5;
const FLICK_MIN_PX = 24;
const FLICK_WINDOW_MS = 100;

// Typing in a field must not trigger the "/" shortcut.
const isTyping = (el: Element | null) =>
  el instanceof HTMLInputElement ||
  el instanceof HTMLTextAreaElement ||
  (el instanceof HTMLElement && el.isContentEditable);

export default function ChatBot() {
  const reduce = useReducedMotion();
  const [input, setInput] = useState('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const [selectedSuggestionIndex, setSelectedSuggestionIndex] = useState(-1);
  // Nothing opens by itself: the chip opens the drawer, and only the visitor does that.
  const [open, setOpen] = useState(false);
  const [wide, setWide] = useState(() => window.matchMedia('(min-width: 768px)').matches);
  const [undo, setUndo] = useState<{
    messages: Message[];
    suggestions: string[];
    until: number;
  } | null>(null);
  // After "jump there" on a phone the chip is the way back to the answer
  const [jumped, setJumped] = useState(false);
  // A drag-close already moved the sheet off screen, so the exit must not slide it again
  const [dragClosing, setDragClosing] = useState(false);
  const { caseStudies } = useCaseStudies();
  const dragY = useMotionValue(0);
  const sheetRef = useRef<HTMLElement>(null);
  const drag = useRef<{ id: number; startY: number; trail: { y: number; t: number }[] }>(null);
  const transcriptRef = useRef<HTMLDivElement>(null);
  // true while the reader is at the bottom of the transcript; scrolling up pauses auto-follow
  const stickToBottom = useRef(true);
  const inputRef = useRef<HTMLInputElement>(null);
  const chipRef = useRef<HTMLButtonElement>(null);
  const hasFetchedSuggestions = useRef(false);
  const openingSuggestions = useRef<string[]>([]);
  const abortRef = useRef<AbortController | null>(null);
  const undoTimer = useRef<number | undefined>(undefined);

  useEffect(() => {
    const mq = window.matchMedia('(min-width: 768px)');
    const onChange = (e: MediaQueryListEvent) => setWide(e.matches);
    mq.addEventListener('change', onChange);
    return () => mq.removeEventListener('change', onChange);
  }, []);

  // Fetch the opening suggestions once, so the drawer invites a first question
  useEffect(() => {
    if (hasFetchedSuggestions.current) return;
    hasFetchedSuggestions.current = true;
    setLoadingSuggestions(true);
    fetch(SUGGESTIONS_API_URL)
      .then((res) => res.json())
      .then((data) => {
        const list =
          data.suggestions && Array.isArray(data.suggestions)
            ? data.suggestions
            : FALLBACK_SUGGESTIONS;
        openingSuggestions.current = list;
        setSuggestions(list);
      })
      .catch((err) => {
        console.error('Failed to fetch suggestions:', err);
        openingSuggestions.current = FALLBACK_SUGGESTIONS;
        setSuggestions(FALLBACK_SUGGESTIONS);
      })
      .finally(() => setLoadingSuggestions(false));
  }, []);

  // A new message (usually the reader's own question) always resumes following
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-runs on message count by design
  useEffect(() => {
    stickToBottom.current = true;
  }, [messages.length]);

  // Follow streamed words and status lines, which change content without adding messages
  // biome-ignore lint/correctness/useExhaustiveDependencies: re-runs on every message update by design
  useEffect(() => {
    const el = transcriptRef.current;
    if (el && stickToBottom.current) el.scrollTop = el.scrollHeight;
  }, [messages]);

  const openDrawer = useCallback(() => {
    dragY.set(0);
    setDragClosing(false);
    setJumped(false);
    setOpen(true);
    requestAnimationFrame(() => inputRef.current?.focus());
  }, [dragY]);

  const closeDrawer = useCallback(() => {
    setOpen(false);
    // focus goes back to the chip that opened the drawer
    requestAnimationFrame(() => chipRef.current?.focus());
  }, []);

  // "/" opens the drawer from anywhere on the page; Escape closes it
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === '/' && !open && !isTyping(document.activeElement)) {
        e.preventDefault();
        openDrawer();
      } else if (e.key === 'Escape' && open) {
        closeDrawer();
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, openDrawer, closeDrawer]);

  // "ask the chatbot about this" links (ServiceMap) open the drawer with a prefilled
  // question; the visitor just hits Enter
  useEffect(() => {
    const handleAsk = (e: Event) => {
      const question = (e as CustomEvent<{ question: string }>).detail?.question;
      if (!question) return;
      setInput(question);
      openDrawer();
    };
    window.addEventListener('tm-ask-chat', handleAsk);
    return () => window.removeEventListener('tm-ask-chat', handleAsk);
  }, [openDrawer]);

  // Reset selected suggestion when suggestions change
  // biome-ignore lint/correctness/useExhaustiveDependencies: intentional reset when suggestions change
  useEffect(() => {
    setSelectedSuggestionIndex(-1);
  }, [suggestions]);

  useEffect(() => {
    return () => {
      window.clearTimeout(undoTimer.current);
      abortRef.current?.abort();
    };
  }, []);

  // ↑/↓ cycle through suggestions and fill the input; Tab stays free to move focus
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    const step = e.key === 'ArrowDown' ? 1 : e.key === 'ArrowUp' ? -1 : 0;
    if (step !== 0 && suggestions.length > 0 && !isLoading) {
      e.preventDefault();
      const nextIndex =
        step === -1 && selectedSuggestionIndex <= 0
          ? suggestions.length - 1
          : (selectedSuggestionIndex + step) % suggestions.length;
      setSelectedSuggestionIndex(nextIndex);
      setInput(suggestions[nextIndex]);
    }
  };

  const sendMessage = useCallback(
    async (userMessage: string, history: Message[] = messages) => {
      if (!userMessage.trim() || isLoading) return;

      const userMsg: Message = {
        id: Date.now().toString(),
        role: 'user',
        content: userMessage,
      };

      // "clear" aborts this run: the fetch, the stream reader and the typing loop all stop
      const controller = new AbortController();
      abortRef.current = controller;
      const { signal } = controller;
      const sentAtMs = Date.now();

      setMessages((prev) => [...prev, userMsg]);
      setInput('');
      setIsLoading(true);
      setError(null);
      setSuggestions([]); // Clear suggestions while loading

      // Prepare messages for API (include history)
      const apiMessages = [...history, userMsg].map((m) => ({
        role: m.role,
        content: m.content,
      }));

      try {
        const response = await fetch(CHAT_API_URL, {
          method: 'POST',
          // NDJSON opts in to status events; without it the API sends plain text
          headers: { 'Content-Type': 'application/json', Accept: 'application/x-ndjson' },
          body: JSON.stringify({ messages: apiMessages }),
          signal,
        });

        if (response.status === 429) {
          setError(FIREWALL_LIMIT_TEXT);
          return;
        }
        if (!response.ok) {
          throw new Error('Failed to get response');
        }

        // Create assistant message placeholder
        const assistantId = (Date.now() + 1).toString();
        setMessages((prev) => [
          ...prev,
          { id: assistantId, role: 'assistant', content: '', statusLines: [], sentAtMs },
        ]);

        const updateAssistant = (change: (message: Message) => Message) =>
          setMessages((prev) => prev.map((m) => (m.id === assistantId ? change(m) : m)));

        const reader = response.body?.getReader();
        const decoder = new TextDecoder();
        // Stamped on arrival: the typing delay below must not shift a span's real time
        const pending: { event: ChatEvent; atMs: number }[] = [];
        const parser = createNdjsonParser((event) => pending.push({ event, atMs: Date.now() }));
        let wordBuffer = '';
        let fullContent = '';
        let failed = false;

        const addWordWithDelay = async (word: string) => {
          if (signal.aborted) return;
          fullContent += word;
          updateAssistant((m) => ({ ...m, content: m.content + word, streamLastMs: Date.now() }));
          // Small delay for smoother word-by-word effect
          await new Promise((resolve) => setTimeout(resolve, 15));
        };

        const handleEvent = async ({ event, atMs }: { event: ChatEvent; atMs: number }) => {
          if (signal.aborted) return;
          if (event.type === 'status') {
            failed ||= event.code === 'failed';
            const line: StatusLine = {
              code: event.code,
              elapsedMs: event.elapsedMs,
              waitSeconds: event.waitSeconds,
              receivedAtMs: atMs,
            };
            updateAssistant((m) => ({
              ...m,
              statusLines: [...(m.statusLines ?? []), line],
              failed: m.failed || event.code === 'failed',
            }));
            return;
          }
          updateAssistant((m) =>
            m.streamStartMs === undefined ? { ...m, streamStartMs: atMs } : m,
          );
          // Text arrives in token-sized pieces; re-split into whole words for the typing effect
          wordBuffer += event.delta;
          const words = wordBuffer.split(/(\s+)/);
          wordBuffer = words.pop() || '';
          for (const word of words) {
            await addWordWithDelay(word);
          }
        };

        if (reader) {
          while (!signal.aborted) {
            const { done, value } = await reader.read();
            if (done) break;
            parser.push(decoder.decode(value, { stream: true }));
            for (const stamped of pending.splice(0)) {
              await handleEvent(stamped);
            }
          }
          if (signal.aborted) {
            reader.cancel().catch(() => {});
            return;
          }
          parser.flush();
          for (const stamped of pending.splice(0)) {
            await handleEvent(stamped);
          }
          if (wordBuffer) {
            await addWordWithDelay(wordBuffer);
          }

          // Empty stream with no failed status (unexpected) — drop the blank answer, surface it
          if (!fullContent.trim() && !failed) {
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
        if (signal.aborted) return;
        console.error('Chat error:', err);
        setError('Failed to send message. Please try again.');
      } finally {
        // a cleared run must not flip the loading state of whatever came after it
        if (abortRef.current === controller) {
          abortRef.current = null;
          setIsLoading(false);
        }
      }
    },
    [messages, isLoading],
  );

  // Resend the last question after a failed answer, dropping that failed turn from history
  const retryLastQuestion = useCallback(() => {
    const lastUserIndex = messages.findLastIndex((m) => m.role === 'user');
    if (lastUserIndex < 0 || isLoading) return;
    const history = messages.slice(0, lastUserIndex);
    setMessages(history);
    sendMessage(messages[lastUserIndex].content, history);
    // the retry button unmounts with the failed turn; keep keyboard focus in the console
    if (wide) inputRef.current?.focus();
  }, [messages, isLoading, sendMessage, wide]);

  // Clear stops a running answer and brings back the opening suggestions, with a short undo.
  const clearTrace = () => {
    setUndo({ messages, suggestions, until: Date.now() + UNDO_MS });
    abortRef.current?.abort();
    abortRef.current = null;
    setIsLoading(false);
    setMessages([]);
    setError(null);
    setSuggestions(openingSuggestions.current);
    window.clearTimeout(undoTimer.current);
    undoTimer.current = window.setTimeout(() => setUndo(null), UNDO_MS);
    inputRef.current?.focus();
  };

  const undoClear = () => {
    if (!undo) return;
    setMessages(undo.messages);
    setSuggestions(undo.suggestions);
    setUndo(null);
    window.clearTimeout(undoTimer.current);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  const handleSuggestionClick = (suggestion: string, index: number) => {
    setSelectedSuggestionIndex(index);
    sendMessage(suggestion); // Auto-send on click
    // The clicked row unmounts; without this, focus drops to the page and ↑/↓ go dead.
    // Phones skip it: focusing the input would pop the keyboard over the answer.
    if (wide) inputRef.current?.focus();
  };

  // Scrolling is left to the row's own #work link
  const jumpToStudy = (slug: string) => {
    selectStudy(slug);
    if (!wide) {
      setJumped(true);
      closeDrawer();
    }
  };

  // The sheet follows the finger from the handle or header; buttons keep their own taps
  const onDragStart = (e: ReactPointerEvent<HTMLDivElement>) => {
    if (wide || (e.target as Element).closest('button')) return;
    e.currentTarget.setPointerCapture(e.pointerId);
    drag.current = {
      id: e.pointerId,
      startY: e.clientY,
      trail: [{ y: e.clientY, t: e.timeStamp }],
    };
  };

  const onDragMove = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    // Speed is read over the last FLICK_WINDOW_MS, so one jittery sample cannot fake a flick
    d.trail.push({ y: e.clientY, t: e.timeStamp });
    while (d.trail.length > 1 && e.timeStamp - d.trail[0].t > FLICK_WINDOW_MS) d.trail.shift();
    dragY.set(Math.max(0, e.clientY - d.startY));
  };

  const onDragEnd = (e: ReactPointerEvent<HTMLDivElement>) => {
    const d = drag.current;
    if (!d || d.id !== e.pointerId) return;
    drag.current = null;
    const pulled = dragY.get();
    const height = sheetRef.current?.offsetHeight ?? window.innerHeight;
    const from = d.trail[0];
    const elapsed = e.timeStamp - from.t;
    // a finger that paused before lifting is a slow release, not a flick
    const speed =
      elapsed > 0 && elapsed <= FLICK_WINDOW_MS * 2 ? (e.clientY - from.y) / elapsed : 0;
    const close =
      e.type !== 'pointercancel' &&
      (pulled > height * DRAG_CLOSE_RATIO || (speed > FLICK_PX_PER_MS && pulled > FLICK_MIN_PX));
    if (!close) {
      if (reduce) dragY.set(0);
      else animate(dragY, 0, { type: 'spring', stiffness: 420, damping: 38 });
      return;
    }
    if (reduce) {
      closeDrawer();
      return;
    }
    setDragClosing(true);
    animate(dragY, height, { duration: 0.2, ease: 'easeIn' }).then(closeDrawer);
  };

  const lastMsg = messages[messages.length - 1];
  const showSuggestions = suggestions.length > 0 && !isLoading;
  const canClear = messages.length > 0 || isLoading;
  const motionProps = reduce
    ? {
        initial: { opacity: 0 },
        animate: { opacity: 1 },
        exit: { opacity: 0 },
        transition: { duration: 0.12 },
      }
    : {
        initial: wide ? { opacity: 0, x: 24 } : { opacity: 0, y: 48 },
        animate: { opacity: 1, x: 0, y: 0 },
        exit: wide ? { opacity: 0, x: 24 } : dragClosing ? { opacity: 0 } : { opacity: 0, y: 48 },
        transition: { duration: 0.28, ease: [0.2, 0.7, 0.2, 1] as const },
      };

  return (
    <>
      {/* launcher chip: rises once after the hero, never pulses */}
      {!open && (
        <motion.button
          ref={chipRef}
          type="button"
          onClick={openDrawer}
          initial={reduce ? false : { opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.24, ease: [0.2, 0.7, 0.2, 1] }}
          aria-label={jumped ? 'Back to trace' : 'Ask this page (press / to open)'}
          className="fixed right-4 bottom-[calc(1rem+env(safe-area-inset-bottom,0px))] z-50 flex h-12 items-center gap-2.5 rounded-xl border px-4 font-mono text-[13px] text-ink shadow-[0_10px_26px_rgba(0,0,0,0.5)] transition-colors hover:text-ink md:h-10 md:px-3.5"
          style={{
            background: 'rgba(19,21,26,0.96)',
            borderColor: 'var(--primary-deep)',
          }}
        >
          <span style={{ color: 'var(--primary)' }}>trace ❯</span>
          <span>{jumped ? 'back to trace' : 'ask this page'}</span>
          <kbd className="hidden rounded border border-line px-1.5 text-[11px] text-muted md:inline">
            /
          </kbd>
        </motion.button>
      )}

      <AnimatePresence>
        {open && (
          <>
            {/* phones: the sheet covers most of the screen, so a tap on the strip above closes it */}
            {!wide && (
              <motion.button
                key="scrim"
                type="button"
                aria-label="Close trace console"
                onClick={closeDrawer}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/55"
              />
            )}
            <motion.aside
              key="drawer"
              ref={sheetRef}
              role="dialog"
              aria-label="Trace console"
              {...motionProps}
              style={{ y: dragY }}
              className="fixed inset-x-0 bottom-0 z-50 flex h-[88dvh] flex-col overscroll-contain rounded-t-2xl border-t border-[#2f3440] bg-[#111318] shadow-[0_-18px_40px_rgba(0,0,0,0.5)] md:inset-x-auto md:top-14 md:right-0 md:h-auto md:w-[420px] md:rounded-none md:border-t-0 md:border-l md:border-line md:shadow-[-22px_0_44px_rgba(0,0,0,0.45)]"
            >
              {/* handle + header: on phones this strip drags the sheet down to close it */}
              <div
                onPointerDown={onDragStart}
                onPointerMove={onDragMove}
                onPointerUp={onDragEnd}
                onPointerCancel={onDragEnd}
                className={`flex flex-none flex-col ${wide ? '' : 'cursor-grab touch-none select-none'}`}
              >
                {!wide && (
                  <span
                    aria-hidden
                    className="mx-auto mt-[7px] h-1 w-9 flex-none rounded-full bg-[#3a4050]"
                  />
                )}
                <div className="flex h-11 flex-none items-center justify-between gap-2.5 border-b border-line px-4 font-mono text-[12.5px] text-muted md:px-5 md:text-xs">
                  <span className="flex items-center gap-2 text-ink">
                    <span
                      className="size-[7px] rounded-full"
                      style={{ background: 'var(--primary)' }}
                    />
                    trace ❯ console
                  </span>
                  <span className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={clearTrace}
                      disabled={!canClear}
                      className={`flex min-h-8 items-center gap-1.5 rounded-[7px] border px-2.5 transition-colors hover:text-[#34e5ff] disabled:opacity-45 disabled:hover:text-muted md:min-h-0 md:px-2 md:py-1 ${undo ? 'border-[color:var(--secondary-deep)] text-[color:var(--secondary)]' : 'border-line'}`}
                    >
                      <Trash2 aria-hidden className="size-3" />
                      clear
                    </button>
                    <button
                      type="button"
                      onClick={closeDrawer}
                      className="flex min-h-8 items-center gap-1.5 rounded-[7px] border border-line px-2.5 transition-colors hover:text-[#34e5ff] md:min-h-0 md:px-2 md:py-1"
                    >
                      <X aria-hidden className="size-3" />
                      {wide ? 'esc' : 'close'}
                    </button>
                  </span>
                </div>
              </div>

              {/* transcript: scrolls by wheel, touch and keys, but the page keeps the only scrollbar */}
              <div
                ref={transcriptRef}
                onScroll={(e) => {
                  const el = e.currentTarget;
                  stickToBottom.current = el.scrollHeight - el.scrollTop - el.clientHeight < 48;
                }}
                className="min-h-0 flex-1 overflow-y-auto overflow-x-hidden px-4 py-3 [scrollbar-width:none] md:px-5 md:py-3.5 [&::-webkit-scrollbar]:hidden"
              >
                {undo && <UndoToast key={undo.until} until={undo.until} onUndo={undoClear} />}

                {messages.map((message) => {
                  const isLast = message.id === lastMsg?.id;
                  const live = isLoading && isLast;
                  if (message.role === 'user') {
                    return (
                      <p
                        key={message.id}
                        className="mt-5 flex gap-2 font-mono text-[12.5px] leading-normal font-medium text-ink first:mt-0 md:text-xs"
                      >
                        <span aria-hidden className="flex-none" style={{ color: 'var(--primary)' }}>
                          ❯
                        </span>
                        {message.content}
                      </p>
                    );
                  }
                  const { text } = parseSuggestions(message.content);
                  return (
                    <div key={message.id}>
                      <SpanWaterfall
                        timings={message}
                        live={live}
                        failed={Boolean(message.failed)}
                        reduce={reduce}
                      />
                      {message.content && (
                        <div
                          className="mt-2.5 text-[15px] leading-[1.58] text-ink md:text-[14px]"
                          style={{ overflowWrap: 'anywhere', wordBreak: 'break-word' }}
                        >
                          <MessageContent content={message.content} live={live} />
                        </div>
                      )}
                      {message.failed && isLast && (
                        <div className="mt-2.5 flex items-center gap-2.5 font-mono text-[12.5px] md:text-xs">
                          <button
                            type="button"
                            onClick={retryLastQuestion}
                            disabled={isLoading}
                            className="flex min-h-11 items-center gap-[7px] rounded-lg border border-[color:var(--primary-deep)] px-4 font-semibold text-[color:var(--primary)] transition-colors hover:border-[#34e5ff] hover:text-[#34e5ff] disabled:opacity-50 md:min-h-0 md:px-3 md:py-1.5"
                          >
                            <RotateCw aria-hidden className="size-3" />
                            {TRY_AGAIN_LABEL}
                          </button>
                          <span className="text-muted">{TRY_AGAIN_NOTE}</span>
                        </div>
                      )}
                      {/* only a finished answer points at the page: no rows popping in mid-stream */}
                      {!live && !message.failed && (
                        <PageRefs refs={matchStudies(text, caseStudies)} onJump={jumpToStudy} />
                      )}
                    </div>
                  );
                })}

                {/* before the first status or token arrives */}
                {isLoading && lastMsg?.role === 'user' && (
                  <p className="mt-2 font-mono text-[12.5px] text-muted md:text-xs">
                    querying logs
                    <span style={{ animation: 'blink 1s step-end infinite' }}>_</span>
                  </p>
                )}

                {loadingSuggestions && messages.length === 0 ? (
                  <output className="mt-2 flex items-center gap-2 font-mono text-xs text-muted">
                    <Loader2 size={12} className="animate-spin" aria-hidden="true" />
                    loading suggestions…
                  </output>
                ) : (
                  showSuggestions && (
                    <SuggestionList
                      suggestions={suggestions}
                      onSelect={handleSuggestionClick}
                      selectedIndex={selectedSuggestionIndex}
                    />
                  )
                )}

                {/* always-present live region: a region that only appears with the error
                    isn't announced reliably, so the text changes inside a stable one */}
                <div aria-live="polite">
                  {error && (
                    <p className="mt-3 font-mono text-[12.5px] text-[#ff6b6b] md:text-xs">
                      {error}
                    </p>
                  )}
                </div>
              </div>

              {/* composer */}
              <form
                onSubmit={handleSubmit}
                className="flex flex-none items-center gap-2.5 border-t border-line bg-[#111318] px-4 pt-2.5 pb-[calc(0.875rem+env(safe-area-inset-bottom,0px))] md:px-5 md:pb-[calc(0.7rem+env(safe-area-inset-bottom,0px))]"
              >
                <span
                  className="flex-none font-mono text-[12.5px] whitespace-nowrap md:text-xs"
                  style={{ color: 'var(--primary)' }}
                  aria-hidden="true"
                >
                  trace ❯
                </span>
                {/* never disabled: a disabled input drops focus, and ↑/↓ would go dead after
                    the first answer. Sending is blocked while an answer runs instead. */}
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKeyDown}
                  placeholder={messages.length ? 'ask a follow-up…' : 'ask about Abhishek’s work…'}
                  aria-label="Ask about Abhishek's work"
                  className="min-w-0 flex-1 rounded-md border-none bg-transparent px-1.5 py-2 text-base text-ink placeholder:text-muted focus:outline-none md:text-[14px]"
                />
                <button
                  type="submit"
                  disabled={isLoading || !input.trim()}
                  aria-label="Send"
                  className="flex min-h-11 flex-none items-center gap-[7px] rounded-lg border border-transparent bg-[linear-gradient(180deg,var(--primary),var(--primary-deep))] px-4 font-mono text-[12.5px] font-semibold whitespace-nowrap text-[#07140d] transition-colors disabled:cursor-not-allowed disabled:border-line disabled:bg-[#17191f] disabled:bg-none disabled:text-muted md:min-h-0 md:px-3 md:py-1.5 md:text-xs"
                >
                  {isLoading ? <Loader2 size={14} className="animate-spin" /> : 'send'}
                </button>
              </form>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
