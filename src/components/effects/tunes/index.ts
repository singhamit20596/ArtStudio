/**
 * The collection tunes (loaded on demand by controller.ts). All synthesised; the melodies are either
 * public domain ("Jingle Bells", James Lord Pierpont, 1857) or written for this site.
 * Each tune function schedules its notes from `t0` and returns its length in seconds.
 */
import type { EffectName } from "../types";
import { beep, bell, brass, cymbal, drone, drum, engine, flute, lfo, note, pop, sleigh, snare, softBass, squeal, tablaNa, whoosh, type Out } from "./synth";

type Tune = (o: Out, t0: number) => number;

/** Christmas: the chorus's second half of "Jingle Bells" on glockenspiel bells, with sleigh bells and a soft bass. */
const jingleBells: Tune = (o, t0) => {
  const q = 0.27;
  const melody: [string, number][] = [
    ["E5", 1], ["E5", 1], ["E5", 2],
    ["E5", 1], ["E5", 1], ["E5", 2],
    ["E5", 1], ["G5", 1], ["C5", 1.5], ["D5", 0.5],
    ["E5", 4],
    ["F5", 1], ["F5", 1], ["F5", 1.5], ["F5", 0.5],
    ["F5", 1], ["E5", 1], ["E5", 1], ["E5", 0.5], ["E5", 0.5],
    ["G5", 1], ["G5", 1], ["F5", 1], ["D5", 1],
    ["C5", 4],
  ];
  let t = t0;
  for (const [n, beats] of melody) {
    bell(o, t, note(n), 0.3, 1.1);
    t += beats * q;
  }
  // Bass on beats 1 and 3: C, C, C, C, F, C, G, C.
  const bass = ["C3", "G2", "C3", "G2", "C3", "G2", "C3", "G2", "F2", "C3", "C3", "G2", "G2", "D3", "C3"];
  bass.forEach((n, i) => softBass(o, t0 + i * 2 * q, note(n), 0.16, 0.45));
  // Sleigh bells on every beat until the last bar.
  for (let beat = 0; beat < 28; beat++) sleigh(o, t0 + beat * q, beat % 2 ? 0.07 : 0.045);
  // A little sparkle on the last note.
  ["C6", "E6", "G6"].forEach((n, i) => bell(o, t0 + 28 * q + 0.06 * i, note(n), 0.07, 1.4));
  return 32 * q + 1.2;
};

/**
 * Diwali: an original tune in raag Bhupali (Sa Re Ga Pa Dha) on a bansuri-like flute, over a soft drone,
 * with a light tabla beat, a temple bell and a few distant crackers.
 */
const diwaliTune: Tune = (o, t0) => {
  const q = 0.28;
  const melody: [string, number][] = [
    ["G5", 1], ["A5", 0.5], ["C6", 0.5], ["A5", 1], ["G5", 1],
    ["E5", 0.5], ["G5", 0.5], ["A5", 1], ["G5", 2],
    ["E5", 1], ["D5", 0.5], ["E5", 0.5], ["G5", 1], ["E5", 1],
    ["D5", 0.5], ["C5", 0.5], ["D5", 1], ["E5", 2],
    ["G5", 1], ["A5", 0.5], ["C6", 0.5], ["D6", 1], ["C6", 1],
    ["A5", 0.5], ["C6", 0.5], ["A5", 1], ["G5", 2],
    ["E5", 0.5], ["G5", 0.5], ["A5", 0.5], ["G5", 0.5], ["E5", 1], ["D5", 1],
    ["C5", 4],
  ];
  const length = 32 * q;
  const end = t0 + length + 1.4;
  drone(o, t0, end, note("C3"), 0.02);
  drone(o, t0, end, note("G3"), 0.016);
  const vibrato = lfo(o, 5.2, t0, end);
  let t = t0;
  let previous: number | undefined;
  for (const [n, beats] of melody) {
    const f = note(n);
    flute(o, t, f, beats * q * 0.96, { gain: 0.15, from: previous, vibrato });
    previous = f;
    t += beats * q;
  }
  // Temple bell at the start, halfway and at the end.
  [0, 16, 28].forEach((beat) => bell(o, t0 + beat * q, note("A5"), 0.1, 2.4));
  // Tabla: dha . na na . na dha na (in eighths), every bar but the last.
  const pattern = ["dha", "", "na", "na", "", "na", "dha", "na"];
  for (let bar = 0; bar < 7; bar++) {
    pattern.forEach((stroke, i) => {
      const at = t0 + (bar * 4 + i * 0.5) * q;
      if (stroke === "dha") {
        drum(o, at, 0.14, 150, 95, 0.4);
        tablaNa(o, at, 0.05);
      } else if (stroke === "na") tablaNa(o, at, 0.045);
    });
  }
  // Soft crackers in the distance.
  [7.5, 15.5, 23.5, 30, 30.6, 31.3].forEach((beat) => pop(o, t0 + beat * q, 0.16));
  return length + 1.4;
};

/** Car Gifts: three race-start beeps and a high "go", the engine revving up through the gears, then a pass-by whoosh. */
const raceStart: Tune = (o, t0) => {
  [0.4, 1, 1.6].forEach((at) => beep(o, t0 + at, note("D5"), 0.16, 0.07));
  beep(o, t0 + 2.2, note("D6"), 0.5, 0.07);
  engine(
    o,
    t0,
    [
      [0, 42], [0.25, 44], [0.4, 70], [0.65, 45], [1.1, 46], [1.25, 78], [1.5, 46], [2.2, 48],
      [3, 150], [3.06, 95], [3.8, 175], [3.86, 115], [4.6, 195], [5.6, 120],
    ],
    0.065,
  );
  squeal(o, t0 + 2.25, 0.4, 0.025);
  whoosh(o, t0 + 4.4, 1, 0.09);
  return 6;
};

/**
 * Retirement Gifts: an original ceremonial fanfare for brass with a marching snare and bass drum.
 * Deliberately not a bugle call: it is not "Last Post", "Reveille" or any anthem.
 */
const fanfare: Tune = (o, t0) => {
  // A snare roll that swells, then the fanfare.
  const roll = 1;
  for (let i = 0; i < 22; i++) snare(o, t0 + i * (roll / 22), 0.03 + (0.1 * i) / 22);
  const s = t0 + roll;
  drum(o, s, 0.3, 110, 45, 0.5);
  const q = 0.42;
  const melody: [string, number][] = [
    ["G4", 0.5], ["C5", 0.25], ["C5", 0.25], ["C5", 0.5], ["D5", 0.5], ["E5", 1], ["C5", 1],
    ["F5", 0.75], ["F5", 0.25], ["E5", 0.5], ["D5", 0.5], ["E5", 1], ["G5", 1],
    ["A5", 0.75], ["A5", 0.25], ["G5", 0.5], ["F5", 0.5], ["E5", 0.5], ["F5", 0.5], ["D5", 1],
    ["G5", 0.75], ["F5", 0.25], ["E5", 0.5], ["D5", 0.5], ["C5", 2],
  ];
  let t = s;
  for (const [n, beats] of melody) {
    brass(o, t, note(n), beats * q * 0.9, 0.1);
    t += beats * q;
  }
  // Held chords underneath, two per bar.
  const chords = [
    ["C4", "E4"], ["C4", "G4"],
    ["F3", "A3", "C4"], ["E3", "G3", "C4"],
    ["F3", "A3", "C4"], ["G3", "B3", "D4"],
    ["G3", "B3", "F4"], ["C3", "E3", "G3", "C4"],
  ];
  chords.forEach((chord, i) => chord.forEach((n) => brass(o, s + i * 2 * q, note(n), 2 * q * (i === 7 ? 1.4 : 0.95), 0.035)));
  // Marching drums: bass drum on 1 and 3, snare on 1, 2, 2-and, 3, 4, 4-e, 4-and.
  for (let bar = 0; bar < 4; bar++) {
    const b = s + bar * 4 * q;
    drum(o, b, 0.22, 110, 45, 0.4);
    drum(o, b + 2 * q, 0.18, 110, 45, 0.4);
    if (bar === 3) continue;
    [0, 1, 1.5, 2, 3, 3.25, 3.5].forEach((beat, i) => snare(o, b + beat * q, i === 0 || i === 3 ? 0.11 : 0.07));
  }
  cymbal(o, s + 14 * q, 0.04, 1.6);
  return roll + 16 * q + 1.2;
};

/** A two-note chime: the answer to turning sound on where no tune is playing. */
const chime: Tune = (o, t0) => {
  bell(o, t0, note("C6"), 0.14, 0.9);
  bell(o, t0 + 0.13, note("G6"), 0.12, 1.1);
  return 1.3;
};

const tunes: Record<EffectName | "chime", Tune> = { christmas: jingleBells, diwali: diwaliTune, cars: raceStart, retirement: fanfare, chime };

export interface Playing {
  /** Seconds from now until it ends. */
  duration: number;
  /** Fades it out at once and cuts every note still to come. */
  stop(): void;
}

/** Starts a tune `delay` seconds from now on its own volume, connected to `out`. */
export function playTune(name: EffectName | "chime", ctx: AudioContext, out: AudioNode, delay = 0.25): Playing {
  const bus = ctx.createGain();
  bus.connect(out);
  const o: Out = { ctx, dest: bus, sources: [] };
  const length = tunes[name](o, ctx.currentTime + delay);
  let stopped = false;
  return {
    duration: delay + length,
    stop() {
      if (stopped) return;
      stopped = true;
      const now = ctx.currentTime;
      bus.gain.cancelScheduledValues(now);
      bus.gain.setValueAtTime(bus.gain.value, now);
      bus.gain.linearRampToValueAtTime(0, now + 0.2);
      for (const source of o.sources) {
        try {
          source.stop(now + 0.25);
        } catch {
          /* already stopped */
        }
      }
      window.setTimeout(() => bus.disconnect(), 400);
    },
  };
}
