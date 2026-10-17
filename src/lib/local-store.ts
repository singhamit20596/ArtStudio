/**
 * A tiny localStorage-backed store for useSyncExternalStore.
 * Safe when storage is blocked (private mode): values then live in memory for the visit.
 */
export function createLocalStore<T>(key: string, fallback: T) {
  let value: T | undefined;
  const listeners = new Set<() => void>();

  const read = (): T => {
    try {
      const raw = window.localStorage.getItem(key);
      return raw ? (JSON.parse(raw) as T) : fallback;
    } catch {
      return fallback;
    }
  };

  return {
    get: (): T => (value === undefined ? (value = read()) : value),
    server: (): T => fallback,
    set(next: T) {
      value = next;
      try {
        window.localStorage.setItem(key, JSON.stringify(next));
      } catch {
        /* storage unavailable (private mode, blocked): keep it in memory */
      }
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      const onStorage = (e: StorageEvent) => {
        if (e.key !== key) return;
        value = read();
        listeners.forEach((l) => l());
      };
      window.addEventListener("storage", onStorage);
      return () => {
        listeners.delete(listener);
        window.removeEventListener("storage", onStorage);
      };
    },
  };
}

/** Keeps the newest `max` entries, most recent first, without duplicates. */
export function pushRecent(list: string[], item: string, max: number) {
  return [item, ...list.filter((x) => x !== item)].slice(0, max);
}
