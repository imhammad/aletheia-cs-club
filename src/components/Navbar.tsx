"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useLenis } from "./SmoothScrollProvider";

const NAV_LINKS = [
  { label: "What We Do", href: "#about" },
  { label: "Events", href: "#events" },
  { label: "Focus", href: "#focus" },
  { label: "Join", href: "#join" },
];

export default function Navbar() {
  const lenis = useLenis();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    if (!lenis) return;

    let lastScroll = 0;

    function handleScroll({ scroll }: { scroll: number }) {
      setScrolled(scroll > 60);
      setHidden(scroll > lastScroll && scroll > 200 && !menuOpen);
      lastScroll = scroll;
    }

    lenis.on("scroll", handleScroll);
    return () => {
      lenis.off("scroll", handleScroll);
    };
  }, [lenis, menuOpen]);

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full z-50 transition-all duration-500 ${
          hidden ? "-translate-y-full" : "translate-y-0"
        } ${
          scrolled
            ? "bg-background/70 backdrop-blur-md border-b border-border py-3"
            : "bg-transparent py-6"
        }`}
      >
        <div className="max-w-6xl mx-auto px-6 flex items-center justify-between">
          
          <a 
            href="#top"
            className="font-display font-bold text-lg text-foreground z-50"
          >
            ALETHEIA
          </a>

          <div className="hidden md:flex items-center gap-8 font-mono text-sm uppercase tracking-wide">
            {NAV_LINKS.map((link) => (
              <a 
                key={link.href}
                href={link.href}
                className="text-muted hover:text-accent-light transition-colors"
              >
                {link.label}
              </a>
            ))}
          </div>

          <button
            onClick={() => setMenuOpen((v) => !v)}
            className="md:hidden z-50 flex flex-col gap-1.5 w-6"
            aria-label="Toggle menu"
          >
            <motion.span
              animate={{ rotate: menuOpen ? 45 : 0, y: menuOpen ? 6 : 0 }}
              className="block w-6 h-0.5 bg-foreground origin-center"
            />
            <motion.span
              animate={{ opacity: menuOpen ? 0 : 1 }}
              className="block w-6 h-0.5 bg-foreground"
            />
            <motion.span
              animate={{ rotate: menuOpen ? -45 : 0, y: menuOpen ? -6 : 0 }}
              className="block w-6 h-0.5 bg-foreground origin-center"
            />
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-background/95 backdrop-blur-lg md:hidden flex flex-col items-center justify-center gap-8"
          >
            {NAV_LINKS.map((link, i) => (
              <motion.a
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.08 }}
                className="font-display text-3xl text-foreground hover:text-accent transition-colors"
              >
                {link.label}
              </motion.a>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}