/**
 * Christmas: snow falling over the whole page. Soft round flakes plus a few six-armed crystals,
 * each with a faint blue-grey edge so they show on the snow-white page as well as on evergreen.
 */
import type { Scene, View } from "../engine";
import { rand } from "./util";

interface Flake {
  x: number;
  y: number;
  r: number;
  vy: number;
  sway: number;
  freq: number;
  phase: number;
  alpha: number;
  age: number;
  crystal: boolean;
  rot: number;
  spin: number;
}

const SPRITE = 64;
let sprites: { dot: HTMLCanvasElement; crystal: HTMLCanvasElement } | null = null;

function makeSprites() {
  const dot = document.createElement("canvas");
  dot.width = dot.height = SPRITE;
  const d = dot.getContext("2d");
  if (d) {
    const c = SPRITE / 2;
    const g = d.createRadialGradient(c, c, 0, c, c, c);
    g.addColorStop(0, "rgba(255,255,255,1)");
    g.addColorStop(0.42, "rgba(255,255,255,0.96)");
    g.addColorStop(0.56, "rgba(150,176,206,0.75)");
    g.addColorStop(1, "rgba(150,176,206,0)");
    d.fillStyle = g;
    d.fillRect(0, 0, SPRITE, SPRITE);
  }

  const crystal = document.createElement("canvas");
  crystal.width = crystal.height = SPRITE;
  const k = crystal.getContext("2d");
  if (k) {
    const c = SPRITE / 2;
    k.translate(c, c);
    k.lineCap = "round";
    k.strokeStyle = "#ffffff";
    k.shadowColor = "rgba(60,86,122,0.7)";
    k.shadowBlur = 3;
    k.lineWidth = 3;
    for (let i = 0; i < 6; i++) {
      k.save();
      k.rotate((Math.PI / 3) * i);
      k.beginPath();
      k.moveTo(0, 0);
      k.lineTo(0, -c * 0.8);
      k.moveTo(0, -c * 0.45);
      k.lineTo(-c * 0.2, -c * 0.62);
      k.moveTo(0, -c * 0.45);
      k.lineTo(c * 0.2, -c * 0.62);
      k.stroke();
      k.restore();
    }
  }
  return { dot, crystal };
}

export function create(start: View): Scene {
  sprites ??= makeSprites();
  const { dot, crystal } = sprites;
  let view = start;
  let target = 0;
  const flakes: Flake[] = [];

  const size = () => {
    target = Math.min(view.small ? 70 : 160, Math.round((view.w * view.h) / 6000));
  };

  function flake(y: number): Flake {
    const isCrystal = Math.random() < 0.16;
    const r = (isCrystal ? rand(4, 7) : rand(1.2, 3.6)) * (view.small ? 0.85 : 1);
    return {
      x: rand(-20, view.w + 20),
      y,
      r,
      vy: 38 + r * 15 + rand(-8, 8),
      sway: rand(8, 30),
      freq: rand(0.6, 1.6),
      phase: rand(0, Math.PI * 2),
      alpha: rand(0.7, 1),
      age: 0,
      crystal: isCrystal,
      rot: rand(0, Math.PI),
      spin: rand(-0.8, 0.8),
    };
  }

  size();
  // A first scattering across the screen (fading in), so the whole page starts snowing at once.
  for (let i = 0; i < target * 0.45; i++) flakes.push(flake(rand(-20, view.h * 0.9)));

  let clock = 0;
  return {
    resize(next) {
      view = next;
      size();
    },
    step(dt, level) {
      clock += dt;
      const want = Math.round(target * level);
      let add = Math.min(want - flakes.length, Math.max(1, Math.round(target * dt * 1.5)));
      while (add-- > 0) flakes.push(flake(rand(-30, -6)));
      const wind = 10;
      for (let i = flakes.length - 1; i >= 0; i--) {
        const f = flakes[i];
        f.age += dt;
        f.y += f.vy * dt;
        f.x += (wind + Math.sin(clock * f.freq + f.phase) * f.sway) * dt;
        f.rot += f.spin * dt;
        if (f.x > view.w + 30) f.x -= view.w + 60;
        if (f.y > view.h + 20) flakes.splice(i, 1);
      }
      return flakes.length > 0 || level > 0;
    },
    draw(ctx, alpha) {
      for (const f of flakes) {
        ctx.globalAlpha = alpha * f.alpha * Math.min(1, f.age / 0.8);
        const s = f.r * 4;
        if (f.crystal) {
          ctx.save();
          ctx.translate(f.x, f.y);
          ctx.rotate(f.rot);
          ctx.drawImage(crystal, -f.r * 1.6, -f.r * 1.6, f.r * 3.2, f.r * 3.2);
          ctx.restore();
        } else {
          ctx.drawImage(dot, f.x - s / 2, f.y - s / 2, s, s);
        }
      }
    },
  };
}
