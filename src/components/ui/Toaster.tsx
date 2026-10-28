"use client";

import { useEffect, useState } from "react";

const EVENT = "app:toast";

/** Show a short message at the bottom of the screen. Safe to call from any client code. */
export function toast(message: string) {
  window.dispatchEvent(new CustomEvent<string>(EVENT, { detail: message }));
}

interface Item {
  id: number;
  message: string;
}

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let seq = 0;
    const onToast = (e: Event) => {
      const message = (e as CustomEvent<string>).detail;
      const id = ++seq;
      setItems((list) => [...list.filter((t) => t.message !== message).slice(-1), { id, message }]);
      window.setTimeout(() => setItems((list) => list.filter((t) => t.id !== id)), 3800);
    };
    window.addEventListener(EVENT, onToast);
    return () => window.removeEventListener(EVENT, onToast);
  }, []);

  return (
    <div
      aria-live="polite"
      className="pointer-events-none fixed inset-x-0 z-[80] flex flex-col items-center gap-2 px-4"
      style={{ bottom: "calc(24px + env(safe-area-inset-bottom, 0px))" }}
    >
      {items.map((t) => (
        <div key={t.id} role="status" className="anim-drop pointer-events-auto max-w-md bg-brown px-5 py-3 text-center text-[13px] leading-snug text-paper shadow-[0_10px_30px_rgb(90_62_43/0.3)]">
          {t.message}
        </div>
      ))}
    </div>
  );
}
