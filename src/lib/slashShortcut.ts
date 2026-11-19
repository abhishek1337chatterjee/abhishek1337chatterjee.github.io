import { useSyncExternalStore } from 'react';

// WCAG 2.1.4: the single-key "/" chat shortcut can be switched off. One store so the chat and
// every "press /" hint agree; the choice stays in this browser.
const KEY = 'chat-slash-shortcut';
const listeners = new Set<() => void>();

function read() {
  try {
    return localStorage.getItem(KEY) !== 'off';
  } catch {
    return true;
  }
}

let on = read();

export const slashShortcut = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  get: () => on,
  set(next: boolean) {
    on = next;
    try {
      localStorage.setItem(KEY, next ? 'on' : 'off');
    } catch {
      // storage blocked (private mode): the switch still works for this visit
    }
    for (const l of listeners) l();
  },
};

export const useSlashShortcut = () =>
  useSyncExternalStore(slashShortcut.subscribe, slashShortcut.get);
