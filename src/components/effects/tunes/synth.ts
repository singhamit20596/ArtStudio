/**
 * Small Web Audio instruments for the collection tunes. Everything is synthesised (no audio files),
 * scheduled ahead on the AudioContext clock, and sent to `out.dest` (the tune's own volume, which
 * stop() fades out). Every source is listed in `out.sources` so a tune can be cut short.
 */

export interface Out {
  ctx: AudioContext;
  dest: AudioNode;
  sources: AudioScheduledSourceNode[];
}

const NOTES: Record<string, number> = { C: 0, "C#": 1, D: 2, "D#": 3, E: 4, F: 5, "F#": 6, G: 7, "G#": 8, A: 9, "A#": 10, B: 11 };

/** "E5" → 659.26 Hz (equal temperament, A4 = 440 Hz). */
export function note(name: string) {
  const m = /^([A-G]#?)(-?\d)$/.exec(name);
  if (!m) return 440;
  const midi = (Number(m[2]) + 1) * 12 + NOTES[m[1]];
  return 440 * 2 ** ((midi - 69) / 12);
}

const noiseBuffers = new WeakMap<BaseAudioContext, AudioBuffer>();

function noiseBuffer(ctx: AudioContext) {
  let buffer = noiseBuffers.get(ctx);
  if (!buffer) {
    buffer = ctx.createBuffer(1, ctx.sampleRate, ctx.sampleRate);
    const data = buffer.getChannelData(0);
    for (let i = 0; i < data.length; i++) data[i] = Math.random() * 2 - 1;
    noiseBuffers.set(ctx, buffer);
  }
  return buffer;
}

function run<T extends AudioScheduledSourceNode>(o: Out, node: T, start: number, stop: number): T {
  node.start(start);
  node.stop(stop);
  o.sources.push(node);
  return node;
}

function osc(o: Out, type: OscillatorType, freq: number, start: number, stop: number) {
  const node = o.ctx.createOscillator();
  node.type = type;
  node.frequency.setValueAtTime(freq, start);
  return run(o, node, start, stop);
}

function noise(o: Out, start: number, stop: number) {
  const node = o.ctx.createBufferSource();
  node.buffer = noiseBuffer(o.ctx);
  node.loop = true;
  node.start(start, Math.random() * 0.8);
  node.stop(stop);
  o.sources.push(node);
  return node;
}

function filter(o: Out, type: BiquadFilterType, freq: number, q = 0.7) {
  const f = o.ctx.createBiquadFilter();
  f.type = type;
  f.frequency.value = freq;
  f.Q.value = q;
  return f;
}

/** A gain that strikes to `peak` and dies away exponentially over `decay` seconds. */
function strike(o: Out, t: number, peak: number, decay: number, attack = 0.004) {
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), t + attack);
  g.gain.exponentialRampToValueAtTime(0.0001, t + attack + decay);
  return g;
}

/** Bell / glockenspiel: a few inharmonic partials, the higher ones dying sooner. */
export function bell(o: Out, t: number, freq: number, gain = 0.3, decay = 1.2) {
  const partials: [number, number, number][] = [
    [1, 1, 1],
    [2.76, 0.32, 0.45],
    [5.4, 0.1, 0.25],
    [0.5, 0.12, 1.2],
  ];
  for (const [ratio, level, d] of partials) {
    const f = freq * ratio;
    if (f > 14000) continue;
    const g = strike(o, t, gain * level, decay * d);
    osc(o, "sine", f, t, t + decay * d + 0.05).connect(g).connect(o.dest);
  }
}

/** A soft plucked bass note. */
export function softBass(o: Out, t: number, freq: number, gain = 0.2, decay = 0.5) {
  const g = strike(o, t, gain, decay, 0.01);
  g.connect(o.dest);
  osc(o, "sine", freq, t, t + decay + 0.05).connect(g);
  const g2 = strike(o, t, gain * 0.25, decay * 0.5, 0.01);
  g2.connect(o.dest);
  osc(o, "triangle", freq * 2, t, t + decay + 0.05).connect(g2);
}

/** Sleigh bells: three quick shakes of bright noise. */
export function sleigh(o: Out, t: number, gain = 0.06) {
  const hp = filter(o, "highpass", 6500);
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  [0, 0.035, 0.07].forEach((d, i) => {
    g.gain.setValueAtTime(gain * (1 - i * 0.25), t + d);
    g.gain.exponentialRampToValueAtTime(0.0005, t + d + (i === 2 ? 0.1 : 0.03));
  });
  noise(o, t, t + 0.2).connect(hp).connect(g).connect(o.dest);
}

const fluteWaves = new WeakMap<BaseAudioContext, PeriodicWave>();

/** Bansuri-like flute: a soft, nearly pure tone with gentle vibrato, gliding in from the previous note. */
export function flute(o: Out, t: number, freq: number, dur: number, opts: { gain?: number; from?: number; vibrato?: AudioNode } = {}) {
  const { gain = 0.16, from, vibrato } = opts;
  let wave = fluteWaves.get(o.ctx);
  if (!wave) {
    wave = o.ctx.createPeriodicWave(new Float32Array([0, 0, 0, 0, 0]), new Float32Array([0, 1, 0.16, 0.06, 0.02]));
    fluteWaves.set(o.ctx, wave);
  }
  const node = o.ctx.createOscillator();
  node.setPeriodicWave(wave);
  node.frequency.setValueAtTime(from ?? freq, t);
  if (from) node.frequency.exponentialRampToValueAtTime(freq, t + 0.06);
  if (vibrato) {
    const depth = o.ctx.createGain();
    depth.gain.setValueAtTime(0, t);
    depth.gain.linearRampToValueAtTime(freq * 0.007, t + Math.min(0.3, dur));
    vibrato.connect(depth).connect(node.frequency);
  }
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.05);
  g.gain.linearRampToValueAtTime(gain * 0.8, t + dur);
  g.gain.linearRampToValueAtTime(0, t + dur + 0.12);
  run(o, node, t, t + dur + 0.15).connect(g).connect(o.dest);
}

/** A slow sine used to wobble pitch (vibrato); connect it to a note's frequency through a small gain. */
export function lfo(o: Out, rate: number, start: number, stop: number) {
  return osc(o, "sine", rate, start, stop);
}

/** Brass: two slightly detuned sawtooth waves through a filter that opens as the note speaks. */
export function brass(o: Out, t: number, freq: number, dur: number, gain = 0.1) {
  const lp = filter(o, "lowpass", freq * 1.5, 0.9);
  lp.frequency.setValueAtTime(freq * 1.5, t);
  lp.frequency.exponentialRampToValueAtTime(Math.min(freq * 6, 12000), t + 0.06);
  lp.frequency.setTargetAtTime(Math.min(freq * 3.5, 9000), t + 0.06, 0.12);
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0.0001, t);
  g.gain.exponentialRampToValueAtTime(gain, t + 0.035);
  g.gain.setTargetAtTime(gain * 0.75, t + 0.035, 0.1);
  g.gain.setTargetAtTime(0.0001, t + dur, 0.04);
  lp.connect(g).connect(o.dest);
  for (const detune of [-6, 6]) {
    const node = osc(o, "sawtooth", freq, t, t + dur + 0.3);
    node.detune.value = detune;
    node.connect(lp);
  }
}

/** Snare drum: a burst of filtered noise with a short tone underneath. */
export function snare(o: Out, t: number, gain = 0.16) {
  const g = strike(o, t, gain, 0.13, 0.001);
  noise(o, t, t + 0.16).connect(filter(o, "highpass", 1800)).connect(g).connect(o.dest);
  const g2 = strike(o, t, gain * 0.5, 0.06, 0.001);
  osc(o, "triangle", 190, t, t + 0.08).connect(g2).connect(o.dest);
}

/** Bass drum (or a tabla's low "dha"): a sine that drops in pitch. */
export function drum(o: Out, t: number, gain = 0.35, from = 120, to = 48, decay = 0.35) {
  const node = osc(o, "sine", from, t, t + decay + 0.05);
  node.frequency.exponentialRampToValueAtTime(to, t + 0.12);
  node.connect(strike(o, t, gain, decay, 0.002)).connect(o.dest);
}

/** A tabla's ringing "na": a short high tone with a tap of noise. */
export function tablaNa(o: Out, t: number, gain = 0.08) {
  osc(o, "sine", 680, t, t + 0.2).connect(strike(o, t, gain, 0.16, 0.002)).connect(o.dest);
  noise(o, t, t + 0.04).connect(filter(o, "highpass", 3000)).connect(strike(o, t, gain * 0.5, 0.02, 0.001)).connect(o.dest);
}

/** A cracker going off in the distance: a soft thump, then a few crackles. */
export function pop(o: Out, t: number, gain = 0.2) {
  noise(o, t, t + 0.12).connect(filter(o, "lowpass", 1500)).connect(strike(o, t, gain, 0.09, 0.001)).connect(o.dest);
  for (let i = 0; i < 5; i++) {
    const at = t + 0.08 + Math.random() * 0.35;
    noise(o, at, at + 0.03).connect(filter(o, "highpass", 3500)).connect(strike(o, at, gain * 0.25, 0.015, 0.001)).connect(o.dest);
  }
}

/** A race-start beep. */
export function beep(o: Out, t: number, freq: number, dur: number, gain = 0.08) {
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.006);
  g.gain.setValueAtTime(gain, t + dur - 0.02);
  g.gain.linearRampToValueAtTime(0, t + dur);
  osc(o, "square", freq, t, t + dur + 0.02).connect(filter(o, "lowpass", 2600)).connect(g).connect(o.dest);
}

/**
 * An engine: a sawtooth and a square an octave down, through a filter that follows the revs.
 * `revs` lists [seconds after t, firing frequency in Hz]; the sound fades out over the last 0.6 s.
 */
export function engine(o: Out, t: number, revs: [number, number][], gain = 0.07) {
  const end = t + revs[revs.length - 1][0];
  const lp = filter(o, "lowpass", revs[0][1] * 6, 2.5);
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.15);
  g.gain.setValueAtTime(gain, end - 0.6);
  g.gain.linearRampToValueAtTime(0, end);
  lp.connect(g).connect(o.dest);
  const saw = osc(o, "sawtooth", revs[0][1], t, end + 0.05);
  const sub = osc(o, "square", revs[0][1] / 2, t, end + 0.05);
  const subGain = o.ctx.createGain();
  subGain.gain.value = 0.6;
  saw.connect(lp);
  sub.connect(subGain).connect(lp);
  for (const [at, f] of revs.slice(1)) {
    saw.frequency.linearRampToValueAtTime(f, t + at);
    sub.frequency.linearRampToValueAtTime(f / 2, t + at);
    lp.frequency.linearRampToValueAtTime(Math.min(f * 6, 4000), t + at);
  }
}

/** Air rushing past: noise through a filter that sweeps up and back down. */
export function whoosh(o: Out, t: number, dur: number, gain = 0.08) {
  const bp = filter(o, "bandpass", 350, 0.9);
  bp.frequency.setValueAtTime(350, t);
  bp.frequency.exponentialRampToValueAtTime(2200, t + dur * 0.5);
  bp.frequency.exponentialRampToValueAtTime(400, t + dur);
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + dur * 0.5);
  g.gain.linearRampToValueAtTime(0, t + dur);
  noise(o, t, t + dur + 0.02).connect(bp).connect(g).connect(o.dest);
}

/** Tyre squeal: narrow, high, filtered noise. */
export function squeal(o: Out, t: number, dur: number, gain = 0.03) {
  const bp = filter(o, "bandpass", 2600, 14);
  bp.frequency.setValueAtTime(2700, t);
  bp.frequency.linearRampToValueAtTime(2300, t + dur);
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0, t);
  g.gain.linearRampToValueAtTime(gain, t + 0.04);
  g.gain.linearRampToValueAtTime(0, t + dur);
  noise(o, t, t + dur + 0.02).connect(bp).connect(g).connect(o.dest);
}

/** A cymbal wash. */
export function cymbal(o: Out, t: number, gain = 0.05, decay = 1.4) {
  noise(o, t, t + decay + 0.05).connect(filter(o, "highpass", 5000)).connect(strike(o, t, gain, decay, 0.002)).connect(o.dest);
}

/** A slow, warm drone (tanpura-like) between `start` and `stop`. */
export function drone(o: Out, start: number, stop: number, freq: number, gain = 0.025) {
  const g = o.ctx.createGain();
  g.gain.setValueAtTime(0, start);
  g.gain.linearRampToValueAtTime(gain, start + 0.8);
  g.gain.setValueAtTime(gain, stop - 1);
  g.gain.linearRampToValueAtTime(0, stop);
  osc(o, "sawtooth", freq, start, stop + 0.05).connect(filter(o, "lowpass", 700)).connect(g).connect(o.dest);
}
