// One "the CMS didn't answer" flag shared by every data hook, and a retry that makes them
// all fetch again. A plain store, read through useSyncExternalStore.
let epoch = 0;
let failed = false;
const listeners = new Set<() => void>();
const emit = () => {
  for (const l of listeners) l();
};

export const cmsStatus = {
  subscribe(listener: () => void) {
    listeners.add(listener);
    return () => {
      listeners.delete(listener);
    };
  },
  epoch: () => epoch,
  failed: () => failed,
  markFailed() {
    if (failed) return;
    failed = true;
    emit();
  },
  // failed requests are already dropped from the in-flight cache, so a new epoch refetches them
  retry() {
    failed = false;
    epoch += 1;
    emit();
  },
};
