"use client";

import { useEffect, useRef, useSyncExternalStore } from "react";
import { Pause, Volume2, VolumeX } from "lucide-react";
import { T } from "@/i18n/T";
import { animationStore, mountEffects, stopAnimation, toggleSound } from "./controller";
import { soundOn, soundServer, subscribeSound } from "./settings";
import type { EffectName } from "./types";

interface FestiveEffectsProps {
  /** A collection page or product page: this effect plays as the page opens. */
  effect?: EffectName;
  /** The homepage: play the effect of the `<EffectZone>` section in view instead. */
  zones?: boolean;
}

/**
 * Page-wide collection effects (owner, 30 Oct 2026): snow and "Jingle Bells" for Christmas, fireworks
 * and a festive tune for Diwali, racing cars and a race start for Car Gifts, gold stars and a fanfare
 * for Retirement Gifts. One fixed canvas over the page (under the header and the floating buttons,
 * never catching clicks), plus a sound button above the WhatsApp button and, while an animation is
 * showing, a "Stop animation" button. The work happens in controller.ts; the drawing and sound code
 * load only when needed.
 *
 * Put it inside the collection's theme class so the buttons wear its colours.
 */
export function FestiveEffects({ effect, zones = false }: FestiveEffectsProps) {
  const canvas = useRef<HTMLCanvasElement>(null);
  const soundButton = useRef<HTMLButtonElement>(null);
  const on = useSyncExternalStore(subscribeSound, soundOn, soundServer);
  const animating = useSyncExternalStore(animationStore.subscribe, animationStore.get, animationStore.server);

  useEffect(() => {
    const el = canvas.current;
    if (!el) return;
    return mountEffects(el, { effect, zones });
  }, [effect, zones]);

  const label = on ? <T en="Sound on" hi="आवाज़ चालू" /> : <T en="Sound off" hi="आवाज़ बंद" />;

  return (
    <>
      <canvas ref={canvas} className="fx-canvas" aria-hidden="true" />
      <div className="fx-controls" data-fx-control="">
        {animating && (
          <button
            type="button"
            className="fx-button"
            onClick={() => {
              stopAnimation();
              // This button goes away: keep keyboard focus nearby.
              soundButton.current?.focus();
            }}
          >
            <Pause size={16} aria-hidden="true" />
            <span className="sr-only">
              <T en="Stop animation" hi="एनिमेशन रोकें" />
            </span>
            <span className="fx-tip" aria-hidden="true">
              <T en="Stop animation" hi="एनिमेशन रोकें" />
            </span>
          </button>
        )}
        <button ref={soundButton} type="button" className="fx-button" onClick={toggleSound}>
          {on ? <Volume2 size={18} aria-hidden="true" /> : <VolumeX size={18} aria-hidden="true" />}
          <span className="sr-only">{label}</span>
          <span className="fx-tip" aria-hidden="true">
            {label}
          </span>
        </button>
      </div>
    </>
  );
}
