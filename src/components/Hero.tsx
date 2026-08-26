"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import MorphingOrb from "./hero/MorphingOrb";
import ParticleField from "./hero/ParticleField";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";

export default function Hero() {
  const containerRef = useRef<HTMLDivElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  // Entrance timeline — always runs once on mount, regardless of the
  // reduced-motion preference. A short one-time fade-in isn't the kind of
  // continuous motion that preference is meant to suppress.
  useGSAP(
    () => {
      const tl = gsap.timeline({ delay: 0.3 });

      tl.from(".hero-eyebrow", {
        opacity: 0,
        y: 20,
        duration: 0.6,
        ease: "power3.out",
      })
        .from(
          ".hero-word",
          {
            opacity: 0,
            y: 40,
            rotateX: -40,
            stagger: 0.08,
            duration: 0.8,
            ease: "power3.out",
          },
          "-=0.3"
        )
        .from(
          ".hero-subtitle",
          { opacity: 0, y: 20, duration: 0.6, ease: "power3.out" },
          "-=0.4"
        )
        .from(
          ".hero-orb",
          { opacity: 0, scale: 0.7, duration: 1, ease: "power3.out" },
          "-=0.9"
        )
        .from(".hero-scroll-cue", { opacity: 0, duration: 0.6 }, "-=0.2");
    },
    { scope: containerRef }
  );

  // Cursor parallax — separate effect, gated by the reduced-motion
  // preference, safe to tear down/rebuild independently of the entrance.
  useGSAP(
    () => {
      if (prefersReducedMotion) return;

      const xTo = gsap.quickTo(orbRef.current, "x", {
        duration: 0.8,
        ease: "power3",
      });
      const yTo = gsap.quickTo(orbRef.current, "y", {
        duration: 0.8,
        ease: "power3",
      });

      function handleMouseMove(e: MouseEvent) {
        const rect = containerRef.current!.getBoundingClientRect();
        const relX = (e.clientX - rect.left) / rect.width - 0.5;
        const relY = (e.clientY - rect.top) / rect.height - 0.5;
        xTo(relX * 40);
        yTo(relY * 40);
      }

      const node = containerRef.current;
      node?.addEventListener("mousemove", handleMouseMove);
      return () => node?.removeEventListener("mousemove", handleMouseMove);
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <section
      ref={containerRef}
      id="top"
      className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden px-6"
    >
      {/* Ambient grid background */}
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(var(--color-border) 1px, transparent 1px), linear-gradient(90deg, var(--color-border) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
        }}
      />

      <ParticleField />

      {/* Morphing glass orb */}
      <div
        ref={orbRef}
        className="hero-orb absolute w-[420px] h-[420px] md:w-[560px] md:h-[560px] opacity-70 blur-[2px]"
      >
        <MorphingOrb />
      </div>

      {/* Glass panel overlay for depth */}
      <div className="absolute w-[300px] h-[300px] rounded-full bg-surface/30 backdrop-blur-2xl border border-border/50" />

      <div className="relative z-10 flex flex-col items-center text-center gap-5">
        <p className="hero-eyebrow font-mono text-sm text-accent-light tracking-widest uppercase">
          Aletheia CS Club
        </p>

        <h1 className="font-display text-5xl md:text-7xl font-bold text-foreground leading-tight [perspective:800px]">
          <span className="hero-word inline-block">Truth,</span>{" "}
          <span className="hero-word inline-block text-accent">
            Engineered.
          </span>
        </h1>

        <p className="hero-subtitle font-body text-muted max-w-md">
          A CS club community of builders, thinkers, and AI explorers.
        </p>
      </div>

      <div className="hero-scroll-cue absolute bottom-10 flex flex-col items-center gap-2">
        <span className="font-mono text-xs text-muted tracking-widest uppercase">
          Scroll
        </span>
        <div className="w-px h-10 bg-gradient-to-b from-accent to-transparent" />
      </div>
    </section>
  );
}