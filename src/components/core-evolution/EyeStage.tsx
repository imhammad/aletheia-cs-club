"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

export default function EyeStage() {
  const containerRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      gsap.to(".eye-glow", {
        opacity: 0.6,
        scale: 1.15,
        transformOrigin: "center",
        duration: 2.4,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
      gsap.to(".eye-iris", {
        scale: 0.92,
        transformOrigin: "center",
        duration: 3,
        repeat: -1,
        yoyo: true,
        ease: "sine.inOut",
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <svg ref={containerRef} viewBox="0 0 420 280" className="w-full h-full" aria-hidden="true">
      <defs>
        <radialGradient id="irisGradient">
          <stop offset="0%" stopColor="var(--color-accent-light)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </radialGradient>
      </defs>
      <circle
        className="eye-glow"
        cx="210"
        cy="140"
        r="90"
        fill="var(--color-accent)"
        opacity="0.25"
        filter="blur(20px)"
      />
      <path
        d="M60,140 C120,70 300,70 360,140 C300,210 120,210 60,140 Z"
        fill="none"
        stroke="var(--color-foreground)"
        strokeWidth="2"
      />
      <circle className="eye-iris" cx="210" cy="140" r="42" fill="url(#irisGradient)" />
      <circle cx="210" cy="140" r="14" fill="var(--color-background)" />
    </svg>
  );
}