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

    // Whenever GSAP recalculates trigger positions (e.g. a pin spacer gets
    // inserted, or the page height changes), tell Lenis to re-measure the
    // page too — otherwise Lenis can think scrolling has ended before a
    // pinned scrub animation has actually finished.
    const handleRefresh = () => lenis.resize();
    ScrollTrigger.addEventListener("refresh", handleRefresh);

    // Recalculate once more after everything, including images, has
    // actually finished loading — image loads shift page height too.
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