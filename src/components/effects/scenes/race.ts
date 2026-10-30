/**
 * Car Gifts: a red racing car (a generic shape: no brand, badge or logo) streaking across the page a
 * few times, in alternating directions, with speed lines and a trail of tyre smoke.
 */
import type { Scene, View } from "../engine";
import { clamp, pickOne, rand } from "./util";

/** When each car sets off (seconds) and where (share of the screen height). */
const PASSES = [
  { at: 0.3, y: 0.72 },
  { at: 2.7, y: 0.42 },
  { at: 5.1, y: 0.62 },
  { at: 7.5, y: 0.3 },
];
/** Seconds a car takes to cross the screen. */
const CROSSING = 1.15;
const LINE_COLOURS = ["rgba(20,21,24,0.32)", "rgba(215,25,32,0.5)", "rgba(255,204,0,0.65)", "rgba(150,150,158,0.45)"];

interface Car {
  x: number;
  y: number;
  dir: 1 | -1;
  speed: number;
  length: number;
  spin: number;
  puffTimer: number;
}

interface SpeedLine {
  dir: 1 | -1;
  x: number;
  y: number;
  len: number;
  width: number;
  speed: number;
  colour: string;
}

interface Puff {
  x: number;
  y: number;
  r: number;
  grow: number;
  life: number;
  max: number;
  vx: number;
  vy: number;
}

/** The car's outline, facing right, in units of its length (0–1 across, roof at 0, wheel centres at 0.235). */
function bodyPath(ctx: CanvasRenderingContext2D) {
  ctx.beginPath();
  ctx.moveTo(0.02, 0.235);
  ctx.lineTo(0.015, 0.17);
  ctx.quadraticCurveTo(0.02, 0.135, 0.08, 0.125);
  ctx.lineTo(0.27, 0.11);
  ctx.quadraticCurveTo(0.36, 0.035, 0.47, 0.03);
  ctx.lineTo(0.56, 0.03);
  ctx.quadraticCurveTo(0.64, 0.035, 0.72, 0.1);
  ctx.lineTo(0.9, 0.125);
  ctx.quadraticCurveTo(0.985, 0.14, 0.99, 0.19);
  ctx.lineTo(0.985, 0.235);
  ctx.closePath();
}

const bodyFills = new WeakMap<CanvasRenderingContext2D, CanvasGradient>();

function wheel(ctx: CanvasRenderingContext2D, x: number, spin: number) {
  const y = 0.235;
  const r = 0.075;
  ctx.fillStyle = "#111214";
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#c9cbd0";
  ctx.beginPath();
  ctx.arc(x, y, r * 0.55, 0, Math.PI * 2);
  ctx.fill();
  ctx.strokeStyle = "#4a4c52";
  ctx.lineWidth = 0.008;
  ctx.beginPath();
  for (let i = 0; i < 5; i++) {
    const a = spin + (i * Math.PI * 2) / 5;
    ctx.moveTo(x, y);
    ctx.lineTo(x + Math.cos(a) * r * 0.52, y + Math.sin(a) * r * 0.52);
  }
  ctx.stroke();
}

function drawCar(ctx: CanvasRenderingContext2D, car: Car, alpha: number) {
  ctx.save();
  ctx.translate(car.x, car.y);
  ctx.scale(car.length * car.dir, car.length);

  // Motion blur: a few fading copies behind.
  for (let k = 3; k >= 1; k--) {
    ctx.globalAlpha = alpha * 0.1 * (4 - k);
    ctx.save();
    ctx.translate(-0.11 * k, 0);
    ctx.fillStyle = "#d71920";
    bodyPath(ctx);
    ctx.fill();
    ctx.restore();
  }
  ctx.globalAlpha = alpha;

  // Shadow on the road.
  ctx.fillStyle = "rgba(0,0,0,0.22)";
  ctx.beginPath();
  ctx.ellipse(0.5, 0.31, 0.48, 0.022, 0, 0, Math.PI * 2);
  ctx.fill();

  // Headlight beam.
  const beam = ctx.createLinearGradient(0.98, 0, 1.45, 0);
  beam.addColorStop(0, "rgba(255,236,150,0.55)");
  beam.addColorStop(1, "rgba(255,236,150,0)");
  ctx.fillStyle = beam;
  ctx.beginPath();
  ctx.moveTo(0.975, 0.155);
  ctx.lineTo(1.45, 0.1);
  ctx.lineTo(1.45, 0.24);
  ctx.closePath();
  ctx.fill();

  let fill = bodyFills.get(ctx);
  if (!fill) {
    fill = ctx.createLinearGradient(0, 0.03, 0, 0.24);
    fill.addColorStop(0, "#ff4a50");
    fill.addColorStop(0.5, "#d71920");
    fill.addColorStop(1, "#9e0e14");
    bodyFills.set(ctx, fill);
  }
  ctx.fillStyle = fill;
  bodyPath(ctx);
  ctx.fill();
  ctx.strokeStyle = "rgba(0,0,0,0.55)";
  ctx.lineWidth = 0.008;
  ctx.stroke();

  // Windows.
  ctx.fillStyle = "rgba(24,30,40,0.88)";
  ctx.beginPath();
  ctx.moveTo(0.31, 0.105);
  ctx.quadraticCurveTo(0.38, 0.05, 0.47, 0.047);
  ctx.lineTo(0.555, 0.047);
  ctx.quadraticCurveTo(0.62, 0.05, 0.68, 0.1);
  ctx.closePath();
  ctx.fill();

  // Racing stripe, headlight and tail light.
  ctx.fillStyle = "#ffcc00";
  ctx.fillRect(0.06, 0.158, 0.88, 0.018);
  ctx.fillStyle = "#fff6c2";
  ctx.beginPath();
  ctx.ellipse(0.965, 0.155, 0.02, 0.011, 0, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#ff6b6b";
  ctx.fillRect(0.018, 0.145, 0.018, 0.02);

  wheel(ctx, 0.2, car.spin);
  wheel(ctx, 0.8, car.spin);
  ctx.restore();
}

let smokeSprite: HTMLCanvasElement | null = null;

/** A soft grey puff, so the smoke billows instead of looking like bubbles. */
function makeSmoke() {
  const canvas = document.createElement("canvas");
  canvas.width = canvas.height = 64;
  const ctx = canvas.getContext("2d");
  if (ctx) {
    const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
    g.addColorStop(0, "rgba(168,169,176,0.9)");
    g.addColorStop(0.55, "rgba(160,161,168,0.5)");
    g.addColorStop(1, "rgba(160,161,168,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, 64, 64);
  }
  return canvas;
}

export function create(start: View): Scene {
  smokeSprite ??= makeSmoke();
  const smoke = smokeSprite;
  let view = start;
  let clock = 0;
  let pass = 0;
  let dir: 1 | -1 = 1;
  const cars: Car[] = [];
  const lines: SpeedLine[] = [];
  const puffs: Puff[] = [];

  const carLength = () => clamp(view.w * 0.13, 110, 200);
  const maxLines = () => (view.small ? 18 : 40);
  const maxPuffs = () => (view.small ? 70 : 140);

  function addCar(i: number) {
    dir = i % 2 === 0 ? 1 : -1;
    const length = carLength();
    cars.push({
      x: dir === 1 ? -length : view.w + length,
      y: PASSES[i].y * view.h,
      dir,
      speed: (view.w + length * 2) / CROSSING,
      length,
      spin: 0,
      puffTimer: 0,
    });
  }

  function addLine() {
    const len = rand(80, 300) * (view.small ? 0.6 : 1);
    lines.push({
      dir,
      x: dir === 1 ? -len : view.w + len,
      y: rand(0.08, 0.95) * view.h,
      len,
      width: rand(1, 2.6),
      speed: rand(900, 1600) * (view.small ? 0.6 : 1),
      colour: pickOne(LINE_COLOURS),
    });
  }

  return {
    resize(next) {
      view = next;
    },
    step(dt, level) {
      clock += dt;
      while (pass < PASSES.length && clock >= PASSES[pass].at) {
        if (level > 0.3) addCar(pass);
        pass++;
      }
      const want = Math.round(maxLines() * level);
      let add = Math.min(want - lines.length, 2);
      while (add-- > 0) addLine();

      for (let i = lines.length - 1; i >= 0; i--) {
        const l = lines[i];
        l.x += l.dir * l.speed * dt;
        if (l.x > view.w + l.len + 10 || l.x < -l.len - 10) lines.splice(i, 1);
      }
      for (let i = cars.length - 1; i >= 0; i--) {
        const c = cars[i];
        c.x += c.dir * c.speed * dt;
        c.spin += (c.speed * dt) / (c.length * 0.075);
        c.puffTimer -= dt;
        while (c.puffTimer <= 0 && puffs.length < maxPuffs()) {
          c.puffTimer += 0.022;
          // From under the back wheel.
          const rear = c.x + c.dir * c.length * 0.2;
          puffs.push({
            x: rear + rand(-4, 4),
            y: c.y + c.length * 0.29,
            r: c.length * 0.05,
            grow: rand(28, 48) * (c.length / 160),
            life: 0,
            max: rand(1.1, 1.6),
            vx: -c.dir * rand(20, 70),
            vy: -rand(8, 30),
          });
        }
        if (c.puffTimer <= 0) c.puffTimer = 0.022;
        const gone = c.dir === 1 ? c.x > view.w + 10 : c.x < -10;
        if (gone) cars.splice(i, 1);
      }
      for (let i = puffs.length - 1; i >= 0; i--) {
        const p = puffs[i];
        p.life += dt;
        if (p.life >= p.max) {
          puffs.splice(i, 1);
          continue;
        }
        p.r += p.grow * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
      }
      return level > 0 || cars.length + lines.length + puffs.length > 0;
    },
    draw(ctx, alpha) {
      ctx.lineCap = "round";
      for (const l of lines) {
        ctx.globalAlpha = alpha;
        ctx.strokeStyle = l.colour;
        ctx.lineWidth = l.width;
        ctx.beginPath();
        ctx.moveTo(l.x, l.y);
        ctx.lineTo(l.x - l.dir * l.len, l.y);
        ctx.stroke();
      }
      for (const p of puffs) {
        ctx.globalAlpha = alpha * 0.55 * (1 - p.life / p.max);
        ctx.drawImage(smoke, p.x - p.r, p.y - p.r, p.r * 2, p.r * 2);
      }
      for (const c of cars) drawCar(ctx, c, alpha);
    },
  };
}
