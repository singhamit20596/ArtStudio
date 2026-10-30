"use client";

import { useEffect, useState } from "react";
import { T } from "@/i18n/T";

const EVENT = "app:toast";

interface Message {
  message: string;
  /** The same message in Hindi, shown while the site is in Hindi. */
  hi?: string;
}

/** Show a short message at the bottom of the screen. Safe to call from any client code. */
export function toast(message: string, hi?: string) {
  window.dispatchEvent(new CustomEvent<Message>(EVENT, { detail: { message, hi } }));
}

interface Item extends Message {
  id: number;
}

export function Toaster() {
  const [items, setItems] = useState<Item[]>([]);

  useEffect(() => {
    let seq = 0;
    const onToast = (e: Event) => {
      const { message, hi } = (e as CustomEvent<Message>).detail;
      const id = ++seq;
      setItems((list) => [...list.filter((t) => t.message !== message).slice(-1), { id, message, hi }]);
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
          <T en={t.message} hi={t.hi} />
        </div>
      ))}
    </div>
  );
}
