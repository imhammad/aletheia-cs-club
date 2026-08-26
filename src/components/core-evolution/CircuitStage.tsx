"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const PATHS = [
  "M40,40 H180 V100 H340",
  "M40,140 H120 V220 H260 V140 H380",
  "M100,40 V220",
  "M300,40 V180",
];

const NODES = [
  [40, 40], [180, 40], [180, 100], [340, 100],
  [40, 140], [120, 140], [120, 220], [260, 220],
  [260, 140], [380, 140], [100, 220], [300, 180],
];

export default function CircuitStage() {
  const containerRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      const traces = containerRef.current?.querySelectorAll(".trace");
      const nodes = containerRef.current?.querySelectorAll(".node");

      // "Draw-in" reveal using stroke-dashoffset — plays once per mount
      traces?.forEach((trace) => {
        const length = (trace as SVGPathElement).getTotalLength();
        gsap.set(trace, { strokeDasharray: length, strokeDashoffset: length });
        gsap.to(trace, {
          strokeDashoffset: 0,
          duration: 1.4,
          ease: "power2.inOut",
        });
      });

      if (prefersReducedMotion) return;
      nodes?.forEach((node) => {
        gsap.to(node, {
          opacity: 0.4,
          duration: () => 0.8 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 1.5,
        });
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <svg ref={containerRef} viewBox="0 0 420 280" className="w-full h-full" aria-hidden="true">
      {PATHS.map((d, i) => (
        <path key={i} d={d} className="trace" fill="none" stroke="var(--color-accent)" strokeWidth="2" />
      ))}
      {NODES.map(([x, y], i) => (
        <circle key={i} cx={x} cy={y} r="5" className="node" fill="var(--color-accent-light)" />
      ))}
    </svg>
  );
}