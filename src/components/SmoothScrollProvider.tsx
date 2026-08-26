"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const LenisContext = createContext<Lenis | null>(null);

export function useLenis() {
  return useContext(LenisContext);
}

export default function SmoothScrollProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [lenisInstance, setLenisInstance] = useState<Lenis | null>(null);

   useEffect(() => {
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    if (prefersReducedMotion) {
      // Skip Lenis entirely — native browser scroll respects the user's
      // system-level motion preference better than any custom easing curve.
      return;
    }

    const lenis = new Lenis({
      duration: 1.2,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
    });
    setLenisInstance(lenis);

    lenis.on("scroll", ScrollTrigger.update);

    function raf(time: number) {
      lenis.raf(time * 1000);
    }
    gsap.ticker.add(raf);
    gsap.ticker.lagSmoothing(0);

    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    const handleLoad = () => ScrollTrigger.refresh();
    window.addEventListener("load", handleLoad);

    return () => {
      lenis.destroy();
      gsap.ticker.remove(raf);
      ScrollTrigger.removeEventListener("refresh", handleRefresh);
      window.removeEventListener("load", handleLoad);
      setLenisInstance(null);
    };
  }, []);

  return (
    <LenisContext.Provider value={lenisInstance}>
      {children}
    </LenisContext.Provider>
  );
}