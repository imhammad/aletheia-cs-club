<div align = "center">
  
# Aletheia CS Club

**Truth, Engineered.**

[Live Site](https://aletheia-cs-club.vercel.app/)

https://github.com/user-attachments/assets/97083666-399f-4eda-9e7a-19839511d049

</div>

A fully animated, scroll-driven portfolio website for Aletheia CS Club, a computer science club at Albukhary International University. The site was built from scratch as a showcase of the club's identity, activities, and technical focus areas, with an emphasis on distinctive, hand-built scroll animation rather than templated design.

## About This Project

Aletheia's website was designed around a simple principle: a computer science club's website should demonstrate technical craft, not just describe it. Nearly every section uses custom-built scroll-driven animation, ranging from particle systems and pinned scroll sequences to a fully three-dimensional character scene, all built without relying on pre-made animation templates or page builders.

## Features

- **Hero section** with a continuously morphing glass-style sphere, an ambient particle field, cursor-reactive parallax, and a word-by-word "meteor entrance" text effect that shatters into fragments on scroll.
- **Brand Story** section featuring large kinetic typography that flies in from screen corners alongside glass-styled objects, including a moment where the entire section inverts to a solid color theme for dramatic effect.
- **The Aletheia Core**, a pinned centerpiece section where a field of particles shatters and reforms through four states (raw data, circuitry, neural network, and a final eye motif tied to the club's identity) as the user scrolls, fully reversible in both directions.
- **Events showcase** presenting the club's workshops and bootcamps as a pinned, circular-wipe card reveal.
- **Community Globe**, a continuously rotating wireframe sphere built with pure vector math (no 3D engine) with orbiting message bubbles.
- **Player Kick scene**, a full three-dimensional sequence built with Three.js and a rigged, animated character model, combining scroll-scrubbed skeletal animation, physics-style ball motion, and particle-based impact effects.
- **Focus areas** with magnetic cursor-following hover cards.
- **Animated navbar** with scroll-aware hide and show behavior and a glass blur effect.
- **Footer** with an infinite scrolling marquee and a curtain-style reveal on scroll.
- Full support for reduced-motion accessibility preferences throughout the site.

## Tech Stack

**Framework and language**
- Next.js (App Router)
- TypeScript
- Tailwind CSS

**Animation**
- GSAP with the ScrollTrigger plugin, used as the core scroll-animation engine across every pinned and scrubbed section
- Lenis for smooth scrolling, synchronized with GSAP for accurate scroll-linked animation
- Framer Motion for interface-level micro-interactions such as menu transitions and button states
- Three.js, via React Three Fiber and Drei, for the three-dimensional player scene
- Hand-built particle and point-cloud systems (no external particle library) used for the shattering text, the morphing centerpiece, and the wireframe globe

**Assets**
- Character model and animation for the Player Kick scene sourced from Adobe Mixamo, converted to glTF format
- Fonts self-hosted via next/font (Space Grotesk, Inter, and JetBrains Mono)

**Hosting**
- Vercel


## Project Structure

src/app/ Route entry point and global styles

components/ All site sections and shared UI components

animations/ Reusable scroll-animation primitives

core-evolution/ Particle-morph centerpiece stage logic

hero/ Hero section assets and effects

player-kick/ Three.js player and ball logic

hooks/ Shared hooks (for example, reduced-motion detection)

public/models/ Three-dimensional character asset

images/ Event photography


## Deployment

The site is deployed on Vercel, connected directly to this repository. Any push to the main branch triggers an automatic production deployment.

## About Aletheia CS Club

Aletheia is a computer science club at Albukhary International University built on a simple belief: the most interesting problems in technology are rarely purely technical. They are also ethical, societal, and human. Aletheia exists for students who want to sit with those questions while still building real things.

Rather than hosting talks, Aletheia runs hands-on workshops. Members leave sessions having built and tested something themselves, not just having listened to a presentation. The club's focus spans artificial intelligence built from first principles, robotics, emerging trends in computer science, and the engineering fundamentals that underlie all of it.


### Leadership and Members

- **Hammad Hassan**, Founder
- **Faryaan Khan**, Co-Founder
- **Maria Saibaa**, Co-Founder
- **Nunung Wardani**, Member
- **Khalid Abdussamii**, Member

**Club Advisor:** Professor Dr. Zurinahni Zainol

### Activities

Aletheia's activities to date include:

- **PROMPTED**, a hands-on prompt engineering workshop covering how large language models work, prompting strategy, and practical technique, run in August 2026.
- An ongoing **Arduino workshop series**, taking members from foundational embedded systems concepts through to real hardware projects.
- An upcoming **Computer Vision Bootcamp**, covering image processing fundamentals through to working models.
  

## Acknowledgments

- Character model and animation courtesy of [Adobe Mixamo](https://www.mixamo.com), used under Mixamo's free usage terms.
- Built with [Next.js](https://nextjs.org), [GSAP](https://gsap.com), [Three.js](https://threejs.org), and [Tailwind CSS](https://tailwindcss.com).

---

Prepared by Aletheia CS Club, Albukhary International University.
