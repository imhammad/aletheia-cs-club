"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const COLS = 14;
const ROWS = 8;
const PATTERN = Array.from({ length: ROWS }, (_, r) =>
  Array.from({ length: COLS }, (_, c) => ((r + c) % 3 === 0 ? "1" : "0"))
);

export default function DataStage() {
  const groupRef = useRef<SVGGElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const glyphs = groupRef.current?.querySelectorAll("text");
      glyphs?.forEach((glyph) => {
        gsap.to(glyph, {
          opacity: () => 0.15 + Math.random() * 0.7,
          duration: () => 0.6 + Math.random() * 1.2,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });
    },
    { scope: groupRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <svg viewBox="0 0 420 280" className="w-full h-full" aria-hidden="true">
      <g
        ref={groupRef}
        fontFamily="var(--font-mono)"
        fontSize="18"
        fill="var(--color-accent-light)"
      >
        {PATTERN.map((row, r) =>
          row.map((digit, c) => (
            <text key={`${r}-${c}`} x={20 + c * 28} y={30 + r * 32} opacity={0.4}>
              {digit}
            </text>
          ))
        )}
      </g>
    </svg>
  );
}