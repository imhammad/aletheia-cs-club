import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
      </main>
    </>
  );
}