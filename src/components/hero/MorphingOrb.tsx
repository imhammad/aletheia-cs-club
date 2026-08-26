"use client";

import { useRef } from "react";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";

// All three paths have the identical command structure (M + 4×C + Z, same
// number of coordinate pairs) so GSAP can tween between them directly —
// no MorphSVG plugin needed.
const BLOB_PATHS = [
  "M100,30 C140,30 170,60 170,100 C170,140 140,170 100,170 C60,170 30,140 30,100 C30,60 60,30 100,30 Z",
  "M100,20 C150,25 180,65 165,110 C155,150 115,175 75,165 C35,155 15,110 30,65 C42,30 70,15 100,20 Z",
  "M105,25 C145,15 180,50 175,95 C170,145 130,180 85,170 C45,160 20,120 25,75 C30,35 65,35 105,25 Z",
];

export default function MorphingOrb() {
  const pathRef = useRef<SVGPathElement>(null);
  const groupRef = useRef<SVGGElement>(null);

  useGSAP(() => {
    // Continuous shape morph — cycles through the blob shapes forever
    const morphTl = gsap.timeline({ repeat: -1, yoyo: true });
    BLOB_PATHS.slice(1).forEach((d) => {
      morphTl.to(pathRef.current, {
        attr: { d },
        duration: 4,
        ease: "sine.inOut",
      });
    });

    // Independent gentle float/drift, so it feels alive even mid-morph
    gsap.to(groupRef.current, {
      y: 25,
      x: 15,
      rotate: 6,
      duration: 6,
      repeat: -1,
      yoyo: true,
      ease: "sine.inOut",
    });
  });

  return (
    <svg viewBox="0 0 200 200" className="w-full h-full" aria-hidden="true">
      <defs>
        <linearGradient id="orbGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="var(--color-accent-light)" />
          <stop offset="100%" stopColor="var(--color-accent)" />
        </linearGradient>
        <filter id="orbBlur">
          <feGaussianBlur stdDeviation="1.5" />
        </filter>
      </defs>
      <g ref={groupRef}>
        <path
          ref={pathRef}
          d={BLOB_PATHS[0]}
          fill="url(#orbGradient)"
          opacity="0.85"
          filter="url(#orbBlur)"
        />
      </g>
    </svg>
  );
}