/**
 * The visitor's sound choice, kept in localStorage["artstudio.sound"] ("on" / "off").
 * Until they choose, sound is on, except for visitors who prefer reduced motion: for them it
 * stays off until they turn it on. Read with useSyncExternalStore(subscribeSound, soundOn, soundServer).
 */

const SOUND_KEY = "artstudio.sound";
export const REDUCED_MOTION = "(prefers-reduced-motion: reduce)";

type Saved = "on" | "off" | null;

let saved: Saved | undefined;
const listeners = new Set<() => void>();

function read(): Saved {
  try {
    const value = window.localStorage.getItem(SOUND_KEY);
    return value === "on" || value === "off" ? value : null;
  } catch {
    return null;
  }
}

export function prefersReducedMotion() {
  return typeof window !== "undefined" && typeof window.matchMedia === "function" && window.matchMedia(REDUCED_MOTION).matches;
}

/** Whether sound is on now. */
export function soundOn(): boolean {
  if (saved === undefined) saved = read();
  return saved ? saved === "on" : !prefersReducedMotion();
}

/** The server render shows the usual state ("Sound on"); the browser corrects it right after hydration. */
export const soundServer = () => true;

export function setSoundOn(on: boolean) {
  saved = on ? "on" : "off";
  try {
    window.localStorage.setItem(SOUND_KEY, saved);
  } catch {
    /* storage blocked (private mode): the choice lasts for this visit */
  }
  listeners.forEach((l) => l());
}

export function subscribeSound(listener: () => void) {
  listeners.add(listener);
  const motion = window.matchMedia(REDUCED_MOTION);
  motion.addEventListener("change", listener);
  const onStorage = (e: StorageEvent) => {
    if (e.key !== SOUND_KEY && e.key !== null) return;
    saved = read();
    listener();
  };
  window.addEventListener("storage", onStorage);
  return () => {
    listeners.delete(listener);
    motion.removeEventListener("change", listener);
    window.removeEventListener("storage", onStorage);
  };
}
