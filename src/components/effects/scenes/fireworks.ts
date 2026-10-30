/**
 * Diwali: rockets rising from the bottom of the page and bursting into colourful sparks (round
 * bursts, rings and long golden "willow" bursts), with a soft flash at each burst.
 */
import type { Scene, View } from "../engine";
import { clamp, pickOne, rand } from "./util";

/** Saturated, so they show on the cream page as well as on maroon. */
const COLOURS = ["#ffc21a", "#ff7a00", "#ff3d8b", "#f0263c", "#19c46a", "#1fb5ff", "#9b5cff", "#e040fb"];
const WILLOW = "#ffb703";
/** Rocket gravity (px/s²). */
const ROCKET_G = 620;

interface Rocket {
  x: number;
  y: number;
  vx: number;
  vy: number;
  colour: string;
  colour2: string | null;
  trail: number[];
}

interface Spark {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  max: number;
  colour: string;
  width: number;
  drag: number;
  gravity: number;
}

interface Flash {
  x: number;
  y: number;
  life: number;
  colour: string;
}

export function create(start: View): Scene {
  let view = start;
  const rockets: Rocket[] = [];
  const sparks: Spark[] = [];
  const flashes: Flash[] = [];
  let next = 0.6;

  const maxSparks = () => (view.small ? 360 : 800);
  const scale = () => clamp(Math.min(view.w, view.h) / 800, 0.55, 1.15);

  function launch() {
    const y = view.h + 10;
    const top = rand(0.12, 0.5) * view.h;
    rockets.push({
      x: rand(0.1, 0.9) * view.w,
      y,
      vx: rand(-40, 40),
      vy: -Math.sqrt(2 * ROCKET_G * (y - top)),
      colour: pickOne(COLOURS),
      colour2: Math.random() < 0.4 ? pickOne(COLOURS) : null,
      trail: [],
    });
  }

  function burst(r: Rocket) {
    const kind = Math.random();
    const willow = kind > 0.72;
    const ring = !willow && kind > 0.45;
    let n = Math.round((view.small ? 40 : 72) * (ring ? 0.75 : 1));
    n = Math.min(n, maxSparks() - sparks.length);
    if (n < 12) return;
    const speed = rand(240, 360) * scale();
    for (let i = 0; i < n; i++) {
      const angle = (i / n) * Math.PI * 2 + rand(-0.08, 0.08);
      const v = ring ? speed : speed * (0.35 + 0.65 * Math.sqrt(Math.random()));
      sparks.push({
        x: r.x,
        y: r.y,
        vx: Math.cos(angle) * v,
        vy: Math.sin(angle) * v,
        life: 0,
        max: willow ? rand(2, 2.6) : rand(1.2, 1.8),
        colour: willow ? WILLOW : r.colour2 && i % 2 ? r.colour2 : r.colour,
        width: (willow ? 2 : 2.6) * (view.small ? 0.85 : 1),
        drag: willow ? 1.2 : 1.7,
        gravity: willow ? 80 : 120,
      });
    }
    flashes.push({ x: r.x, y: r.y, life: 0.28, colour: willow ? WILLOW : r.colour });
  }

  // Two rockets straight away, so the show starts as the page opens.
  launch();
  launch();

  return {
    resize(next) {
      view = next;
    },
    step(dt, level) {
      next -= dt;
      if (level > 0.05 && next <= 0 && rockets.length < 5) {
        launch();
        next = rand(0.35, 0.8) / Math.max(level, 0.25);
      }
      for (let i = rockets.length - 1; i >= 0; i--) {
        const r = rockets[i];
        r.trail.push(r.x, r.y);
        if (r.trail.length > 14) r.trail.splice(0, 2);
        r.vy += ROCKET_G * dt;
        r.x += r.vx * dt;
        r.y += r.vy * dt;
        if (r.vy > -40) {
          burst(r);
          rockets.splice(i, 1);
        }
      }
      for (let i = sparks.length - 1; i >= 0; i--) {
        const s = sparks[i];
        s.life += dt;
        if (s.life >= s.max) {
          sparks.splice(i, 1);
          continue;
        }
        const k = Math.exp(-s.drag * dt);
        s.vx *= k;
        s.vy = s.vy * k + s.gravity * dt;
        s.x += s.vx * dt;
        s.y += s.vy * dt;
      }
      for (let i = flashes.length - 1; i >= 0; i--) {
        flashes[i].life -= dt;
        if (flashes[i].life <= 0) flashes.splice(i, 1);
      }
      return level > 0 || rockets.length + sparks.length + flashes.length > 0;
    },
    draw(ctx, alpha) {
      ctx.lineCap = "round";
      const sc = scale();
      for (const f of flashes) {
        const radius = 90 * sc;
        const g = ctx.createRadialGradient(f.x, f.y, 0, f.x, f.y, radius);
        g.addColorStop(0, "rgba(255,244,214,0.9)");
        g.addColorStop(0.35, f.colour);
        g.addColorStop(1, "rgba(255,200,120,0)");
        ctx.globalAlpha = alpha * (f.life / 0.28) * 0.4;
        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(f.x, f.y, radius, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const r of rockets) {
        ctx.globalAlpha = alpha * 0.85;
        ctx.strokeStyle = "#ffcf7a";
        ctx.lineWidth = 2;
        ctx.beginPath();
        for (let i = 0; i < r.trail.length; i += 2) {
          if (i === 0) ctx.moveTo(r.trail[i], r.trail[i + 1]);
          else ctx.lineTo(r.trail[i], r.trail[i + 1]);
        }
        ctx.lineTo(r.x, r.y);
        ctx.stroke();
        ctx.fillStyle = "#fff4cf";
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.4, 0, Math.PI * 2);
        ctx.fill();
      }
      for (const s of sparks) {
        let a = 1 - s.life / s.max;
        // Twinkle as they fade.
        if (a < 0.35 && Math.random() < 0.4) a *= 0.3;
        ctx.globalAlpha = alpha * a;
        ctx.strokeStyle = s.colour;
        ctx.lineWidth = s.width;
        ctx.beginPath();
        ctx.moveTo(s.x - s.vx * 0.07, s.y - s.vy * 0.07);
        ctx.lineTo(s.x, s.y);
        ctx.stroke();
      }
    },
  };
}
