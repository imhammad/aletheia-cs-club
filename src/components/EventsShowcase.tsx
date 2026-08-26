"use client";

import { useRef } from "react";
import Image from "next/image";
import { useGSAP } from "@gsap/react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

const EVENTS = [
  {
    status: "Completed",
    title: "PROMPTED",
    subtitle: "Prompt Engineering Workshop",
    description:
      "A hands-on session on writing effective prompts and understanding how LLMs interpret them — from basic structure to advanced technique.",
    date: "9 August 2026",
    image: "/images/prompted_workshop.jpeg",
  },
  {
    status: "Ongoing — 4/5 sessions",
    title: "Arduino Workshop Series",
    subtitle: "Hardware & Embedded Systems",
    description:
      "A five-part series taking members from first blink of an LED to building real embedded-systems projects with Arduino.",
    date: "In progress",
    image: "/images/arduino_workshop.jpeg",
  },
  {
    status: "Upcoming",
    title: "Computer Vision Bootcamp",
    subtitle: "AI That Sees",
    description:
      "An intensive bootcamp on building computer vision systems from the ground up — image processing fundamentals through to working models.",
    date: "Starts 31 August 2026",
    image: "/images/CV_bootcamp.jpeg",
  },
];

export default function EventsShowcase() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const cardRefs = useRef<(HTMLDivElement | null)[]>([]);

  useGSAP(
    () => {
      const cards = cardRefs.current;
      if (cards.length < 3 || cards.some((c) => !c)) return;

      // Card 0: active and fully visible. Cards 1 & 2: hidden behind a
      // closed circular mask, parked slightly left.
    gsap.set(cards[0], {
        x: "0%",
        y: "0%",
        scale: 1,
        opacity: 1,
        clipPath: "circle(150% at 50% 50%)",
        zIndex: 1,
    });
        gsap.set([cards[1], cards[2]], {
        x: "-12%",
        y: "0%",
        scale: 1,
        opacity: 0,
        clipPath: "circle(0% at 0% 50%)",
    });
    gsap.set(cards[1], { zIndex: 2 });
    gsap.set(cards[2], { zIndex: 3 });

      const tl = gsap.timeline({
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: () => `+=${window.innerHeight * 2}`,
          scrub: 1,
          pin: true,
          invalidateOnRefresh: true,
        },
      });

      // Step 1: card 1 wipes in over card 0; card 0 recedes down-right
      tl.to(cards[0], { x: "35%", y: "25%", scale: 0.88, opacity: 0.35 }, 0)
        .to(
          cards[1],
          { x: "0%", y: "0%", scale: 1, opacity: 1, clipPath: "circle(150% at 50% 50%)" },
          0
        )
        // Step 2: card 2 wipes in over card 1; card 1 recedes down-right
        .to(cards[1], { x: "35%", y: "25%", scale: 0.88, opacity: 0.35 }, 1)
        .to(
          cards[2],
          { x: "0%", y: "0%", scale: 1, opacity: 1, clipPath: "circle(150% at 50% 50%)" },
          1
        );
    },
    { scope: sectionRef }
  );

  return (
    <section id="events" ref={sectionRef} className="relative py-32">
      <div className="px-6 max-w-5xl mx-auto mb-16">
        <p className="font-mono text-sm text-accent-light tracking-widest uppercase mb-4">
          What We&apos;ve Built
        </p>
        <h2 className="font-display text-3xl md:text-5xl font-bold text-foreground">
          Workshops, shipped.
        </h2>
      </div>

      <div className="relative h-[560px] max-w-xl mx-auto px-6">
        {EVENTS.map((event, i) => (
          <div
            key={event.title}
            ref={(el) => {
              cardRefs.current[i] = el;
            }}
            className="absolute inset-0 border border-border bg-surface/70 rounded-3xl p-8 backdrop-blur-sm flex flex-col"
          >
            <div className="relative aspect-video rounded-xl overflow-hidden mb-6 shrink-0 border border-border">
              <Image
                src={event.image}
                alt={event.title}
                fill
                sizes="(max-width: 640px) 90vw, 576px"
                className="object-cover"
              />
            </div>
            <span className="font-mono text-xs text-accent uppercase tracking-widest">
              {event.status}
            </span>
            <h3 className="font-display text-2xl font-bold text-foreground mt-3 mb-1">
              {event.title}
            </h3>
            <p className="font-body text-accent-light text-sm mb-3">
              {event.subtitle}
            </p>
            <p className="font-body text-muted text-sm leading-relaxed flex-1">
              {event.description}
            </p>
            <div className="mt-4 pt-4 border-t border-border">
              <span className="font-mono text-xs text-muted">
                {event.date}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}