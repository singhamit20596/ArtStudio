/**
 * Retirement Gifts: slow falling gold stars that twinkle, with confetti in the theme's gold, brass,
 * ribbon maroon, navy and ivory. Generic stars only: no flag colours, emblem or insignia.
 */
import type { Scene, View } from "../engine";
import { pickOne, rand } from "./util";

const CONFETTI = ["#d9b45a", "#c9a043", "#7a1e2c", "#24427a", "#efe4c8", "#e8c770"];
const SPRITE = 64;

interface Star {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  freq: number;
  phase: number;
  rot: number;
  spin: number;
  twinkle: number;
  age: number;
}

interface Bit {
  x: number;
  y: number;
  w: number;
  h: number;
  vy: number;
  sway: number;
  phase: number;
  rot: number;
  spin: number;
  flip: number;
  flipSpeed: number;
  colour: string;
  age: number;
}

let sprite: HTMLCanvasElement | null = null;

/** A gold five-pointed star with a darker brass edge, so it shows on parchment as well as navy. */
function makeSprite() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = SPRITE;
  const ctx = canvas.getContext("2d");
  if (!ctx) return canvas;
  const c = SPRITE / 2;
  const outer = c * 0.86;
  const inner = outer * 0.42;
  ctx.beginPath();
  for (let i = 0; i < 10; i++) {
    const r = i % 2 === 0 ? outer : inner;
    const a = (Math.PI / 5) * i - Math.PI / 2;
    if (i === 0) ctx.moveTo(c + r * Math.cos(a), c + r * Math.sin(a));
    else ctx.lineTo(c + r * Math.cos(a), c + r * Math.sin(a));
  }
  ctx.closePath();
  const g = ctx.createRadialGradient(c * 0.8, c * 0.7, 0, c, c, outer);
  g.addColorStop(0, "#fff3c4");
  g.addColorStop(0.45, "#e6c46a");
  g.addColorStop(1, "#a87d27");
  ctx.fillStyle = g;
  ctx.shadowColor = "rgba(90,62,20,0.45)";
  ctx.shadowBlur = 3;
  ctx.fill();
  ctx.shadowBlur = 0;
  ctx.lineWidth = 2;
  ctx.strokeStyle = "#8a6620";
  ctx.stroke();
  return canvas;
}

export function create(start: View): Scene {
  sprite ??= makeSprite();
  const star = sprite;
  let view = start;
  let clock = 0;
  const stars: Star[] = [];
  const bits: Bit[] = [];

  const maxStars = () => (view.small ? 22 : 40);
  const maxBits = () => (view.small ? 40 : 80);

  function addStar(y: number) {
    const r = rand(6, 13) * (view.small ? 0.85 : 1);
    stars.push({
      x: rand(0, view.w),
      y,
      r,
      vy: rand(26, 52),
      sway: rand(6, 20),
      freq: rand(0.5, 1.2),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI),
      spin: rand(-0.6, 0.6),
      twinkle: rand(0, Math.PI * 2),
      age: 0,
    });
  }

  function addBit(y: number) {
    bits.push({
      x: rand(0, view.w),
      y,
      w: rand(4, 7),
      h: rand(8, 13),
      vy: rand(45, 85),
      sway: rand(10, 30),
      phase: rand(0, Math.PI * 2),
      rot: rand(0, Math.PI),
      spin: rand(-2.5, 2.5),
      flip: rand(0, Math.PI),
      flipSpeed: rand(3, 7),
      colour: pickOne(CONFETTI),
      age: 0,
    });
  }

  // A first shower from just above the top of the screen.
  for (let i = 0; i < maxStars() * 0.6; i++) addStar(rand(-view.h * 0.45, -10));
  for (let i = 0; i < maxBits() * 0.6; i++) addBit(rand(-view.h * 0.45, -10));

  return {
    resize(next) {
      view = next;
    },
    step(dt, level) {
      clock += dt;
      let add = Math.min(Math.round(maxStars() * level) - stars.length, 1);
      while (add-- > 0) addStar(rand(-40, -12));
      add = Math.min(Math.round(maxBits() * level) - bits.length, 2);
      while (add-- > 0) addBit(rand(-30, -10));

      for (let i = stars.length - 1; i >= 0; i--) {
        const s = stars[i];
        s.age += dt;
        s.y += s.vy * dt;
        s.x += Math.sin(clock * s.freq + s.phase) * s.sway * dt;
        s.rot += s.spin * dt;
        s.twinkle += dt * 3;
        if (s.y > view.h + 20) stars.splice(i, 1);
      }
      for (let i = bits.length - 1; i >= 0; i--) {
        const b = bits[i];
        b.age += dt;
        b.y += b.vy * dt;
        b.x += Math.sin(clock * 1.3 + b.phase) * b.sway * dt;
        b.rot += b.spin * dt;
        b.flip += b.flipSpeed * dt;
        if (b.y > view.h + 20) bits.splice(i, 1);
      }
      return level > 0 || stars.length + bits.length > 0;
    },
    draw(ctx, alpha) {
      for (const b of bits) {
        ctx.globalAlpha = alpha * 0.9;
        ctx.save();
        ctx.translate(b.x, b.y);
        ctx.rotate(b.rot);
        ctx.scale(Math.cos(b.flip), 1);
        ctx.fillStyle = b.colour;
        ctx.fillRect(-b.w / 2, -b.h / 2, b.w, b.h);
        ctx.restore();
      }
      for (const s of stars) {
        const glow = 0.78 + 0.22 * Math.sin(s.twinkle);
        ctx.globalAlpha = alpha * glow;
        const size = s.r * 2 * (0.92 + 0.08 * Math.sin(s.twinkle));
        ctx.save();
        ctx.translate(s.x, s.y);
        ctx.rotate(s.rot);
        ctx.drawImage(star, -size / 2, -size / 2, size, size);
        ctx.restore();
      }
    },
  };
}
