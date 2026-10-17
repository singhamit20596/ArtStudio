"use client";

import clsx from "clsx";
import { ChevronDown, Heart, Menu, Search, ShoppingBag, User } from "lucide-react";
import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import type { NavMenu } from "@/config/nav";
import { site } from "@/config/site";
import type { SearchItem } from "@/lib/types";
import { useShop } from "@/components/providers/ShopProvider";
import { AppLink } from "@/components/ui/AppLink";
import { Logo } from "./Logo";
import { MegaMenu } from "./MegaMenu";
import { MobileMenu } from "./MobileMenu";
import { SearchOverlay } from "./SearchOverlay";
import { CartDrawer } from "./CartDrawer";

interface HeaderProps {
  /** Transparent over the hero until the visitor scrolls (homepage). */
  overlay?: boolean;
  menus: NavMenu[];
  searchItems: SearchItem[];
}

export function Header({ overlay = false, menus, searchItems }: HeaderProps) {
  const [scrolled, setScrolled] = useState(false);
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const { wishlist, cartCount, setCartOpen } = useShop();
  const headerRef = useRef<HTMLElement>(null);
  const closeTimer = useRef<number | undefined>(undefined);
  const hoverOpenedAt = useRef(0);
  const triggerRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close transient menus if this page is hidden by a navigation (Activity keeps it mounted).
  useLayoutEffect(
    () => () => {
      setOpenMenu(null);
      setMobileOpen(false);
      setSearchOpen(false);
    },
    [],
  );

  const closeMenu = useCallback(() => {
    window.clearTimeout(closeTimer.current);
    setOpenMenu(null);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        triggerRefs.current[openMenu]?.focus();
        closeMenu();
      }
    };
    const onPointer = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) closeMenu();
    };
    document.addEventListener("keydown", onKey);
    document.addEventListener("pointerdown", onPointer);
    return () => {
      document.removeEventListener("keydown", onKey);
      document.removeEventListener("pointerdown", onPointer);
    };
  }, [openMenu, closeMenu]);

  const hoverOpen = (id: string, at: number) => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    window.clearTimeout(closeTimer.current);
    if (openMenu !== id) hoverOpenedAt.current = at;
    setOpenMenu(id);
  };
  // A click right after hover-opening keeps the panel open instead of toggling it shut.
  const clickToggle = (id: string, at: number) => {
    if (openMenu === id && at - hoverOpenedAt.current < 600) return;
    setOpenMenu((cur) => (cur === id ? null : id));
  };
  const hoverClose = () => {
    if (!window.matchMedia("(hover: hover)").matches) return;
    window.clearTimeout(closeTimer.current);
    closeTimer.current = window.setTimeout(() => setOpenMenu(null), 160);
  };

  const solid = !overlay || scrolled || openMenu !== null;
  const active = menus.find((m) => m.id === openMenu);

  const iconButton = "relative grid h-10 w-10 place-items-center transition-opacity hover:opacity-70";

  return (
    <>
      <header
        ref={headerRef}
        onMouseLeave={hoverClose}
        className={clsx(
          "sticky z-40 transition-[background-color,color,box-shadow] duration-300",
          solid ? "bg-paper text-ink shadow-[0_1px_0_var(--color-line)]" : "bg-transparent text-paper",
        )}
        style={{ top: "env(safe-area-inset-top, 0px)" }}
      >
        <div className="container-x grid h-16 grid-cols-[1fr_auto_1fr] items-center gap-3 lg:h-[76px]">
          {/* Left: menu button (mobile) / logo (desktop) */}
          <div className="flex items-center">
            <button type="button" onClick={() => setMobileOpen(true)} aria-label="Open menu" className={clsx(iconButton, "-ml-2 lg:hidden")}>
              <Menu size={22} strokeWidth={1.6} />
            </button>
            <AppLink href="/" aria-label={`${site.name} home`} className="hidden lg:block">
              <Logo inverted={!solid} />
            </AppLink>
          </div>

          {/* Centre: logo (mobile) / main navigation (desktop) */}
          <div className="flex justify-center">
            <AppLink href="/" aria-label={`${site.name} home`} className="lg:hidden">
              <Logo inverted={!solid} compact />
            </AppLink>
            <nav aria-label="Main" className="hidden lg:block">
              <ul className="flex items-center gap-1 xl:gap-3">
                {menus.map((menu) => (
                  <li key={menu.id} onMouseEnter={(e) => hoverOpen(menu.id, e.timeStamp)}>
                    <button
                      ref={(el) => {
                        triggerRefs.current[menu.id] = el;
                      }}
                      type="button"
                      aria-expanded={openMenu === menu.id}
                      aria-controls={`menu-${menu.id}`}
                      onClick={(e) => clickToggle(menu.id, e.timeStamp)}
                      className="nav-label flex h-[76px] items-center gap-1.5 px-3"
                    >
                      <span className={clsx("link-grow", openMenu === menu.id && "bg-[length:100%_1px]")}>{menu.label}</span>
                      <ChevronDown size={13} strokeWidth={2} aria-hidden="true" className={clsx("transition-transform", openMenu === menu.id && "rotate-180")} />
                    </button>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Right: actions */}
          <div className="-mr-2 flex items-center justify-end">
            <button type="button" onClick={() => setSearchOpen(true)} aria-label="Search" className={iconButton}>
              <Search size={20} strokeWidth={1.6} />
            </button>
            <AppLink href="/account" aria-label="Account" className={clsx(iconButton, "hidden sm:grid")}>
              <User size={20} strokeWidth={1.6} />
            </AppLink>
            <AppLink href="/account/wishlist" aria-label={`Wishlist, ${wishlist.length} items`} className={clsx(iconButton, "hidden sm:grid")}>
              <Heart size={20} strokeWidth={1.6} />
              {wishlist.length > 0 && <Count n={wishlist.length} inverted={!solid} />}
            </AppLink>
            <button type="button" onClick={() => setCartOpen(true)} aria-label={`Cart, ${cartCount} items`} className={iconButton}>
              <ShoppingBag size={20} strokeWidth={1.6} />
              {cartCount > 0 && <Count n={cartCount} inverted={!solid} />}
            </button>
          </div>
        </div>

        {active && <MegaMenu menu={active} onNavigate={closeMenu} />}
      </header>

      <MobileMenu open={mobileOpen} onClose={() => setMobileOpen(false)} menus={menus} />
      <SearchOverlay open={searchOpen} onClose={() => setSearchOpen(false)} items={searchItems} />
      <CartDrawer />
    </>
  );
}

function Count({ n, inverted }: { n: number; inverted: boolean }) {
  return (
    <span
      aria-hidden="true"
      className={clsx(
        "absolute right-0.5 top-0.5 grid h-[17px] min-w-[17px] place-items-center rounded-full px-1 text-[10px] font-semibold leading-none tabular-nums",
        inverted ? "bg-paper text-ink" : "bg-ink text-paper",
      )}
    >
      {n}
    </span>
  );
}
