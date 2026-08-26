"use client";

import { useRef, type ReactNode } from "react";
import gsap from "gsap";
import { usePrefersReducedMotion } from "../hooks/usePrefersReducedMotion";


export default function MagneticWrapper({
  children,
  strength = 0.3,
}: {
  children: ReactNode;
  strength?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const prefersReducedMotion = usePrefersReducedMotion();

  function handleMouseMove(e: React.MouseEvent<HTMLDivElement>) {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const relX = e.clientX - rect.left - rect.width / 2;
    const relY = e.clientY - rect.top - rect.height / 2;

    gsap.to(el, {
      x: relX * strength,
      y: relY * strength,
      duration: 0.4,
      ease: "power3.out",
    });
  }

  function handleMouseLeave() {
    if (prefersReducedMotion) return;
    const el = ref.current;
    if (!el) return;
    gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.4)" });
  }

  return (
    <div
      ref={ref}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      {children}
    </div>
  );
}