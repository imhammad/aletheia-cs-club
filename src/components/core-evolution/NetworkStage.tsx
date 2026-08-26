"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "@/hooks/usePrefersReducedMotion";

const LAYER_DEFS = [
  { x: 60, ys: [70, 140, 210] },
  { x: 210, ys: [40, 100, 160, 220] },
  { x: 360, ys: [100, 180] },
];

function buildConnections() {
  const lines: { x1: number; y1: number; x2: number; y2: number }[] = [];
  for (let l = 0; l < LAYER_DEFS.length - 1; l++) {
    const a = LAYER_DEFS[l];
    const b = LAYER_DEFS[l + 1];
    a.ys.forEach((y1) => {
      b.ys.forEach((y2) => {
        lines.push({ x1: a.x, y1, x2: b.x, y2 });
      });
    });
  }
  return lines;
}

const CONNECTIONS = buildConnections();

export default function NetworkStage() {
  const containerRef = useRef<SVGSVGElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  useGSAP(
    () => {
      if (prefersReducedMotion) return;
      const lines = containerRef.current?.querySelectorAll(".link");
      const nodes = containerRef.current?.querySelectorAll(".node");

      lines?.forEach((line) => {
        gsap.to(line, {
          opacity: () => 0.1 + Math.random() * 0.4,
          duration: () => 1 + Math.random() * 1.5,
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });

      nodes?.forEach((node) => {
        gsap.to(node, {
          scale: 1.3,
          transformOrigin: "center",
          duration: () => 0.8 + Math.random(),
          repeat: -1,
          yoyo: true,
          ease: "sine.inOut",
          delay: Math.random() * 2,
        });
      });
    },
    { scope: containerRef, dependencies: [prefersReducedMotion] }
  );

  return (
    <svg ref={containerRef} viewBox="0 0 420 280" className="w-full h-full" aria-hidden="true">
      {CONNECTIONS.map((line, i) => (
        <line
          key={i}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          className="link"
          stroke="var(--color-accent)"
          strokeWidth="1"
          opacity="0.25"
        />
      ))}
      {LAYER_DEFS.flatMap((layer, li) =>
        layer.ys.map((y, ni) => (
          <circle
            key={`${li}-${ni}`}
            cx={layer.x}
            cy={y}
            r="7"
            className="node"
            fill="var(--color-accent-light)"
          />
        ))
      )}
    </svg>
  );
}