"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const BEATS = [
  { text: "Learn With Us.", style: "big" as const, inverted: false },
  { text: "Aletheia Presents", style: "label" as const, inverted: false },
  { text: "Zero Unemployment.", style: "big" as const, inverted: true },
  { text: "This Is Aletheia.", style: "big" as const, inverted: false },
];

// Four corner offsets — each beat enters from one and exits toward the
// one two positions later (its diagonal opposite).
const CORNERS = [
  { x: -280, y: -180 },
  { x: 280, y: 180 },
  { x: 280, y: -180 },
  { x: -280, y: 180 },
];

export default function BrandStory() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const bgFlashRef = useRef<HTMLDivElement>(null);
  const textRefs = useRef<(HTMLDivElement | null)[]>([]);
  const heartRef = useRef<HTMLDivElement>(null);
  const diamondRef = useRef<HTMLDivElement>(null);
  const hexagonRef = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const numBeats = BEATS.length;

      gsap.set(textRefs.current.filter(Boolean), { opacity: 0, scale: 0.3 });
      gsap.set([heartRef.current, diamondRef.current, hexagonRef.current], {
        opacity: 0,
      });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * numBeats}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      BEATS.forEach((beat, i) => {
        const el = textRefs.current[i];
        if (!el) return;
        const enterFrom = CORNERS[i % 4];
        const exitTo = CORNERS[(i + 2) % 4];

        tl.fromTo(
          el,
          { opacity: 0, scale: 0.3, x: enterFrom.x, y: enterFrom.y },
          { opacity: 1, scale: 1, x: 0, y: 0, duration: 0.5, ease: "power2.out" },
          i
        ).to(
          el,
          { opacity: 0, scale: 1.4, x: exitTo.x, y: exitTo.y, duration: 0.5, ease: "power2.in" },
          i + 0.5
        );

        // The one dramatic beat: flip the whole section to orange/black
        if (beat.inverted && bgFlashRef.current) {
          tl.to(bgFlashRef.current, { opacity: 1, duration: 0.4, ease: "power2.out" }, i - 0.1)
            .set(el, { color: "var(--color-background)" }, i)
            .to(bgFlashRef.current, { opacity: 0, duration: 0.4, ease: "power2.in" }, i + 0.6)
            .set(el, { color: "var(--color-foreground)" }, i + 1);
        }
      });

      // Heart accompanies beat 1 ("Aletheia Presents")
      if (heartRef.current) {
        tl.fromTo(
          heartRef.current,
          { opacity: 0, scale: 0.4, x: -320, y: -100, rotate: -20 },
          { opacity: 0.8, scale: 1, x: -140, y: -40, rotate: 0, duration: 0.5 },
          1
        ).to(
          heartRef.current,
          { opacity: 0, scale: 0.5, x: 320, y: 160, rotate: 20, duration: 0.5 },
          1.5
        );
      }

      // Diamond accompanies beat 2 ("Zero Unemployment") and zooms into
      // the screen right as the background flips — the "portal" moment
      if (diamondRef.current) {
        tl.fromTo(
          diamondRef.current,
          { opacity: 0, scale: 0.3, x: 320, y: 160, rotate: 30 },
          { opacity: 0.7, scale: 1, x: 140, y: 40, rotate: 0, duration: 0.35 },
          1.9
        )
          .to(
            diamondRef.current,
            { scale: 6, opacity: 0.15, x: 0, y: 0, duration: 0.35, ease: "power2.in" },
            2.25
          )
          .set(diamondRef.current, { opacity: 0 }, 2.6);
      }

      // Hexagon closes things out with beat 3
      if (hexagonRef.current) {
        tl.fromTo(
          hexagonRef.current,
          { opacity: 0, scale: 0.4, x: 280, y: -140, rotate: 25 },
          { opacity: 0.6, scale: 1, x: 130, y: -60, rotate: 0, duration: 0.5 },
          3
        ).to(
          hexagonRef.current,
          { opacity: 0, scale: 0.5, x: -280, y: 140, rotate: -25, duration: 0.5 },
          3.5
        );
      }
    },
    { scope: sectionRef }
  );

  return (
    <section
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center overflow-hidden bg-background px-6"
    >
      <div
        ref={bgFlashRef}
        aria-hidden="true"
        className="absolute inset-0 bg-accent opacity-0 pointer-events-none"
      />

      <div ref={heartRef} className="absolute w-40 h-40 md:w-56 md:h-56 pointer-events-none">
        <svg viewBox="0 0 32 29" className="w-full h-full" aria-hidden="true">
          <defs>
            <linearGradient id="heartGrad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="var(--color-accent-light)" />
              <stop offset="100%" stopColor="var(--color-accent)" />
            </linearGradient>
          </defs>
          <path
            d="M16 29 C16 29 0 18 0 8.5 C0 3 4 0 8 0 C11 0 14 2 16 5 C18 2 21 0 24 0 C28 0 32 3 32 8.5 C32 18 16 29 16 29 Z"
            fill="url(#heartGrad)"
          />
        </svg>
      </div>

      <div ref={diamondRef} className="absolute w-48 h-48 md:w-64 md:h-64 pointer-events-none">
        <div
          className="w-full h-full bg-gradient-to-br from-accent-light/70 to-accent/70 backdrop-blur-md border border-accent-light/40"
          style={{ clipPath: "polygon(50% 0%, 100% 50%, 50% 100%, 0% 50%)" }}
        />
      </div>

      <div ref={hexagonRef} className="absolute w-40 h-40 md:w-52 md:h-52 pointer-events-none">
        <div
          className="w-full h-full bg-gradient-to-br from-accent-light/60 to-accent/60 backdrop-blur-md border border-accent-light/40"
          style={{
            clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
          }}
        />
      </div>

      {BEATS.map((beat, i) => (
        <div
          key={beat.text}
          ref={(el) => {
            textRefs.current[i] = el;
          }}
          className="absolute flex items-center justify-center px-6"
        >
          {beat.style === "label" ? (
            <p className="font-mono text-2xl md:text-4xl text-accent-light tracking-widest uppercase text-center">
              {beat.text}
            </p>
          ) : (
            <h2 className="font-display text-5xl md:text-7xl lg:text-8xl font-bold text-foreground text-center">
              {beat.text}
            </h2>
          )}
        </div>
      ))}
    </section>
  );
}