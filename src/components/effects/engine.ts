/**
 * Draws one collection effect at a time on the page-wide <canvas> (loaded on demand by controller.ts).
 *
 * Each effect is a small "scene" module in ./scenes, loaded when first needed. A scene runs at full
 * strength for HOLD seconds, eases off until END, and whatever is still on screen then fades out over
 * DRAIN, so the page is quiet again after about 13 seconds. Switching effects (homepage sections)
 * fades the old one out quickly while the new one starts.
 *
 * Safeguards: one canvas, one requestAnimationFrame loop that stops when nothing is left to draw,
 * pixel density capped at MAX_DPR, frames skipped while the tab is hidden, and every scene caps its
 * particle count (lower on phones).
 */
import type { EffectName } from "./types";

export interface View {
  /** Canvas size in CSS pixels. */
  w: number;
  h: number;
  /** Phones and small windows: fewer, smaller particles. */
  small: boolean;
}

export interface Scene {
  /** Moves everything on by `dt` seconds. `level` (0–1) is how much new to add. Returns false once nothing is left. */
  step(dt: number, level: number): boolean;
  /** Draws in CSS pixels; `alpha` (0–1) fades the whole scene. */
  draw(ctx: CanvasRenderingContext2D, alpha: number): void;
  resize?(view: View): void;
}

export type SceneFactory = (view: View) => Scene;

const scenes: Record<EffectName, () => Promise<{ create: SceneFactory }>> = {
  christmas: () => import("./scenes/snow"),
  diwali: () => import("./scenes/fireworks"),
  cars: () => import("./scenes/race"),
  retirement: () => import("./scenes/stars"),
};

/** Seconds: rise to full strength, hold it, ease off until END, then fade out what is left. */
const RISE = 0.6;
const HOLD = 6;
const END = 11;
const DRAIN = 2.5;
/** Seconds to fade out an effect that is being replaced or stopped. */
const LEAVE = 0.6;
const MAX_DPR = 1.5;

function strength(t: number) {
  if (t < RISE) return t / RISE;
  if (t < HOLD) return 1;
  if (t < END) return 0.5 + 0.5 * Math.cos((Math.PI * (t - HOLD)) / (END - HOLD));
  return 0;
}

interface Layer {
  effect: EffectName;
  scene: Scene;
  t: number;
  alpha: number;
  leaving: boolean;
}

export interface Runner {
  /** Starts `effect` (fading out any other). */
  play(effect: EffectName): void;
  /** Fades out whatever is showing. */
  stop(): void;
  destroy(): void;
}

export function createRunner(canvas: HTMLCanvasElement, onActive: (active: boolean) => void): Runner {
  const ctx = canvas.getContext("2d");
  let layers: Layer[] = [];
  let frame = 0;
  let last = 0;
  let token = 0;
  let destroyed = false;
  let dpr = 1;
  let view: View = { w: 0, h: 0, small: false };

  /** Matches the canvas to its CSS size (100% × 100lvh, so a phone's sliding address bar does not resize it). */
  function fit() {
    const w = canvas.clientWidth;
    const h = canvas.clientHeight;
    const nextDpr = Math.min(window.devicePixelRatio || 1, MAX_DPR);
    if (!w || !h || (w === view.w && h === view.h && nextDpr === dpr)) return;
    dpr = nextDpr;
    view = { w, h, small: Math.min(w, h) < 640 };
    canvas.width = Math.round(w * dpr);
    canvas.height = Math.round(h * dpr);
    layers.forEach((l) => l.scene.resize?.(view));
  }

  function show(on: boolean) {
    if (on) {
      canvas.dataset.fxOn = "";
      canvas.dataset.effect = layers.find((l) => !l.leaving)?.effect ?? "";
    } else {
      delete canvas.dataset.fxOn;
      delete canvas.dataset.effect;
    }
    onActive(on);
  }

  function clear() {
    if (!ctx) return;
    ctx.setTransform(1, 0, 0, 1, 0, 0);
    ctx.clearRect(0, 0, canvas.width, canvas.height);
  }

  function tick(now: number) {
    frame = 0;
    if (!ctx) return;
    const dt = last ? Math.min((now - last) / 1000, 0.05) : 1 / 60;
    last = now;
    clear();
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    layers = layers.filter((layer) => {
      layer.t += dt;
      if (layer.leaving) layer.alpha -= dt / LEAVE;
      else if (layer.t > END) layer.alpha -= dt / DRAIN;
      const alive = layer.scene.step(dt, layer.leaving ? 0 : strength(layer.t));
      if (!alive || layer.alpha <= 0) return false;
      ctx.globalAlpha = 1;
      layer.scene.draw(ctx, Math.min(1, layer.alpha));
      return true;
    });
    ctx.globalAlpha = 1;
    if (layers.length) {
      frame = requestAnimationFrame(tick);
    } else {
      clear();
      show(false);
    }
  }

  function run() {
    if (frame || destroyed || document.hidden || !layers.length) return;
    last = 0;
    frame = requestAnimationFrame(tick);
  }

  function pause() {
    cancelAnimationFrame(frame);
    frame = 0;
  }

  const onVisibility = () => (document.hidden ? pause() : run());
  let resizeFrame = 0;
  const onResize = () => {
    if (resizeFrame) return;
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0;
      if (layers.length) fit();
    });
  };
  document.addEventListener("visibilitychange", onVisibility);
  window.addEventListener("resize", onResize);

  return {
    play(effect) {
      const mine = ++token;
      layers.forEach((l) => (l.leaving = true));
      scenes[effect]()
        .then(({ create }) => {
          if (destroyed || mine !== token) return;
          // Show the canvas first so it has a size to measure, then make the scene for that size.
          canvas.dataset.fxOn = "";
          fit();
          layers.push({ effect, scene: create(view), t: 0, alpha: 1, leaving: false });
          show(true);
          run();
        })
        .catch(() => {
          /* the scene's code could not load (offline): the page simply stays still */
        });
    },
    stop() {
      token++;
      layers.forEach((l) => (l.leaving = true));
    },
    destroy() {
      destroyed = true;
      token++;
      pause();
      cancelAnimationFrame(resizeFrame);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("resize", onResize);
      layers = [];
      clear();
      show(false);
    },
  };
}
