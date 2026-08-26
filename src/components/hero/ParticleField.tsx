"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PARTICLE_COUNT = 18;

export default function ParticleField() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const particles =
        containerRef.current?.querySelectorAll<HTMLSpanElement>(".particle");

      particles?.forEach((particle) => {
        // Random starting position + opacity, set client-side only —
        // keeps server and client render identical (avoids hydration errors)
        gsap.set(particle, {
          top: `${Math.random() * 100}%`,
          left: `${Math.random() * 100}%`,
          opacity: 0.15 + Math.random() * 0.35,
        });

        gsap.to(particle, {
          y: "random(-40, 40)",
          x: "random(-30, 30)",
          duration: "random(4, 8)",
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );
  if (prefersReducedMotion) return null;

  return (
    <div
      ref={containerRef}
      className="absolute inset-0 overflow-hidden pointer-events-none"
      aria-hidden="true"
    >
      {Array.from({ length: PARTICLE_COUNT }).map((_, i) => (
        <span
          key={i}
          className="particle absolute rounded-full bg-accent-light"
          style={{ width: "3px", height: "3px", opacity: 0 }}
        />
      ))}
    </div>
  );
}