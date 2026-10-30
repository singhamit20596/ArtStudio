/**
 * Runs the page-wide collection effects for <FestiveEffects> (plain module, no React):
 * which effect is on, when its tune may play, and the shared AudioContext.
 *
 * - A collection page or product page has one fixed effect; it plays as the page opens.
 * - The homepage watches its `[data-fx-zone]` sections (EffectZone.tsx) and plays the effect of the
 *   one that fills most of the screen, switching or stopping as the visitor scrolls on.
 * - The drawing code (engine.ts and one scene per effect) loads only when an effect first runs, and
 *   never for visitors who prefer reduced motion or who pressed "Stop animation" during this visit.
 * - Sound: browsers block audio until the visitor interacts, so a tune waits for the first tap, click
 *   or key press (if sound is on) and then plays once. The same tune does not repeat within
 *   REPEAT_GAP (moving between a collection's pages). Turning sound on plays the current tune (or a
 *   chime) at once; turning it off, or hiding the tab, stops it. The tunes' code loads on first use.
 */
import type { Runner } from "./engine";
import type { Playing } from "./tunes";
import { isEffectName, type EffectName } from "./types";
import { prefersReducedMotion, REDUCED_MOTION, setSoundOn, soundOn, subscribeSound } from "./settings";

/** Overall volume: quiet, under the page. */
const MASTER_VOLUME = 0.16;
/** A collection's tune does not play again within this many milliseconds, unless the visitor turns sound on. */
const REPEAT_GAP = 45_000;
/** A tune cut off sooner than this (e.g. by the click that opened another page) does not count as heard. */
const HEARD_AFTER = 2_000;
/** Homepage: a section is "in view" once it fills half the screen (or 70% of a short section is on screen). */
const ZONE_COVER = 0.5;
const ZONE_SEEN = 0.7;
/** Milliseconds a section must stay in view before its effect starts (so scrolling past does nothing). */
const ZONE_DELAY = 300;
/** Keys that do not start sound: moving focus, closing things, modifiers. */
const QUIET_KEYS = new Set(["Tab", "Escape", "Shift", "Control", "Alt", "Meta", "CapsLock"]);
const GESTURES = ["pointerdown", "pointerup", "click", "keydown", "touchend"] as const;

type Sound = EffectName | "chime";

/* ---------- "Is an animation showing?" (for the Stop animation button) ---------- */

let animating = false;
const animationListeners = new Set<() => void>();

function setAnimating(on: boolean) {
  if (on === animating) return;
  animating = on;
  animationListeners.forEach((l) => l());
}

export const animationStore = {
  subscribe(listener: () => void) {
    animationListeners.add(listener);
    return () => {
      animationListeners.delete(listener);
    };
  },
  get: () => animating,
  server: () => false,
};

/* ---------- Sound ---------- */

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let playing: (Playing & { name: Sound; since: number }) | null = null;
let pending: { name: Sound; force: boolean } | null = null;
let tuneToken = 0;
let idleTimer = 0;
const lastPlayed = new Map<Sound, number>();
let tunes: Promise<typeof import("./tunes")> | null = null;

/** Inside a user gesture: creates or wakes the AudioContext. */
function unlock() {
  if (!ctx) {
    const AC = window.AudioContext ?? (window as unknown as { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AC) return;
    try {
      ctx = new AC();
    } catch {
      return;
    }
    master = ctx.createGain();
    master.gain.value = MASTER_VOLUME;
    const limiter = ctx.createDynamicsCompressor();
    limiter.threshold.value = -18;
    limiter.ratio.value = 6;
    master.connect(limiter).connect(ctx.destination);
    ctx.addEventListener("statechange", tryPlay);
  }
  if (ctx.state !== "running") {
    void ctx.resume().catch(() => {});
    // Older iPhones only unlock audio once something has played inside the gesture: one silent sample.
    const silent = ctx.createBufferSource();
    silent.buffer = ctx.createBuffer(1, 1, ctx.sampleRate);
    silent.connect(ctx.destination);
    silent.start();
  }
  if (!pending && !playing) sleepSoon(4000);
}

/** Lets the audio hardware rest once nothing has played for a while. */
function sleepSoon(ms: number) {
  window.clearTimeout(idleTimer);
  idleTimer = window.setTimeout(() => {
    if (ctx?.state === "running" && !pending) void ctx.suspend().catch(() => {});
  }, ms);
}

function stopSound() {
  tuneToken++;
  if (!playing) return;
  playing.stop();
  if (performance.now() - playing.since < HEARD_AFTER) lastPlayed.delete(playing.name);
  playing = null;
}

/** Plays the pending tune if sound is on and the browser lets it; otherwise it keeps waiting. */
function tryPlay() {
  if (!pending || !soundOn() || document.hidden || !ctx || !master) return;
  if (ctx.state !== "running") {
    // Allowed after the first interaction in most browsers; "statechange" calls tryPlay again.
    void ctx.resume().catch(() => {});
    return;
  }
  const { name, force } = pending;
  pending = null;
  if (!force && performance.now() - (lastPlayed.get(name) ?? -Infinity) < REPEAT_GAP) return;
  const token = ++tuneToken;
  window.clearTimeout(idleTimer);
  (tunes ??= import("./tunes"))
    .then(({ playTune }) => {
      if (token !== tuneToken || !ctx || !master || ctx.state !== "running") return;
      playing?.stop();
      const since = performance.now();
      lastPlayed.set(name, since);
      const tune = { ...playTune(name, ctx, master), name, since };
      playing = tune;
      window.setTimeout(() => {
        if (playing === tune) playing = null;
      }, tune.duration * 1000);
      sleepSoon(tune.duration * 1000 + 1500);
    })
    .catch(() => {
      tunes = null;
    });
}

function onGesture(e: Event) {
  if (!soundOn()) return;
  if (e instanceof KeyboardEvent && QUIET_KEYS.has(e.key)) return;
  // The sound and animation buttons handle themselves (so "Sound off" never plays a note first).
  if (e.target instanceof Element && e.target.closest("[data-fx-control]")) return;
  if (ctx?.state === "running" && !pending) return;
  unlock();
  tryPlay();
}

/* ---------- The mounted effect ---------- */

interface Instance {
  readonly current: EffectName | null;
  set(effect: EffectName | null): void;
  stopMotion(): void;
}

let instance: Instance | null = null;
/** The visitor pressed "Stop animation" (or Escape): no more animations until they reload. */
let motionStopped = false;

const motionAllowed = () => !motionStopped && !prefersReducedMotion();

/** Runs the effects for one <FestiveEffects>; returns its cleanup. */
export function mountEffects(canvas: HTMLCanvasElement, options: { effect?: EffectName; zones?: boolean }) {
  let current: EffectName | null = null;
  let runner: Runner | null = null;
  let loading = false;
  let destroyed = false;
  const cleanups: (() => void)[] = [];

  function loadRunner() {
    if (loading) return;
    loading = true;
    // Wait for a quiet moment so the page's own work comes first.
    const load = () =>
      import("./engine")
        .then(({ createRunner }) => {
          if (destroyed) return;
          // Only the newest <FestiveEffects> drives the shared "animating" flag.
          runner = createRunner(canvas, (on) => {
            if (instance === self) setAnimating(on);
          });
          if (current && motionAllowed()) runner.play(current);
        })
        .catch(() => {
          loading = false;
        });
    if (typeof window.requestIdleCallback === "function") {
      const id = window.requestIdleCallback(load, { timeout: 1200 });
      cleanups.push(() => window.cancelIdleCallback(id));
    } else {
      const id = window.setTimeout(load, 300);
      cleanups.push(() => window.clearTimeout(id));
    }
  }

  const self: Instance = {
    get current() {
      return current;
    },
    set(effect) {
      if (effect === current) return;
      current = effect;
      if (effect && motionAllowed()) {
        if (runner) runner.play(effect);
        else loadRunner();
      } else runner?.stop();
      stopSound();
      pending = effect ? { name: effect, force: false } : null;
      tryPlay();
    },
    stopMotion() {
      runner?.stop();
    },
  };
  instance = self;

  const gesture = (e: Event) => onGesture(e);
  for (const type of GESTURES) window.addEventListener(type, gesture, { capture: true, passive: true });
  const onKey = (e: KeyboardEvent) => {
    if (e.key === "Escape" && animating) stopAnimation();
  };
  window.addEventListener("keydown", onKey);
  const onVisibility = () => {
    if (!document.hidden) return;
    stopSound();
    void ctx?.suspend().catch(() => {});
  };
  document.addEventListener("visibilitychange", onVisibility);
  const motion = window.matchMedia(REDUCED_MOTION);
  const onMotion = () => {
    if (motion.matches) runner?.stop();
  };
  motion.addEventListener("change", onMotion);
  const offSound = subscribeSound(() => {
    if (soundOn()) return;
    pending = null;
    stopSound();
  });

  if (options.effect) self.set(options.effect);
  if (options.zones) cleanups.push(watchZones(self));

  return () => {
    destroyed = true;
    const owner = instance === self;
    if (owner) instance = null;
    cleanups.forEach((c) => c());
    for (const type of GESTURES) window.removeEventListener(type, gesture, { capture: true });
    window.removeEventListener("keydown", onKey);
    document.removeEventListener("visibilitychange", onVisibility);
    motion.removeEventListener("change", onMotion);
    offSound();
    runner?.destroy();
    // The sound and the "animating" flag are shared: leave them to a newer <FestiveEffects> if there is one.
    if (owner) {
      setAnimating(false);
      pending = null;
      stopSound();
    }
  };
}

/** Homepage: plays the effect of the `[data-fx-zone]` section filling most of the screen. */
function watchZones(self: Instance) {
  const zones = Array.from(document.querySelectorAll<HTMLElement>("[data-fx-zone]"));
  let frame = 0;
  let timer = 0;
  let candidate: EffectName | null = null;

  const measure = () => {
    frame = 0;
    const vh = window.innerHeight;
    let best: EffectName | null = null;
    let bestCover = 0;
    for (const el of zones) {
      const r = el.getBoundingClientRect();
      if (!r.height) continue; // hidden (an earlier page kept by the router)
      const seen = Math.min(r.bottom, vh) - Math.max(r.top, 0);
      if (seen <= 0) continue;
      const cover = seen / vh;
      const name = el.dataset.fxZone;
      if ((cover >= ZONE_COVER || seen / r.height >= ZONE_SEEN) && cover > bestCover && isEffectName(name)) {
        best = name;
        bestCover = cover;
      }
    }
    if (best === candidate) return;
    candidate = best;
    window.clearTimeout(timer);
    timer = window.setTimeout(() => self.set(candidate), ZONE_DELAY);
  };
  const schedule = () => {
    if (!frame) frame = requestAnimationFrame(measure);
  };
  schedule();
  window.addEventListener("scroll", schedule, { passive: true });
  window.addEventListener("resize", schedule);
  return () => {
    cancelAnimationFrame(frame);
    window.clearTimeout(timer);
    window.removeEventListener("scroll", schedule);
    window.removeEventListener("resize", schedule);
  };
}

/* ---------- The two buttons ---------- */

/** The sound button (a click, so audio may start here). */
export function toggleSound() {
  const on = !soundOn();
  setSoundOn(on);
  if (on) {
    pending = { name: instance?.current ?? "chime", force: true };
    unlock();
    tryPlay();
  } else {
    pending = null;
    stopSound();
    void ctx?.suspend().catch(() => {});
  }
}

/** "Stop animation" (and Escape): fades out the animation and keeps the page still for the rest of the visit. */
export function stopAnimation() {
  motionStopped = true;
  instance?.stopMotion();
}
