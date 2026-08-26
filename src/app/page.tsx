import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import EventsShowcase from "@/components/EventsShowcase";
import WhatWeFocusOn from "@/components/WhatWeFocusOn";
import JoinSection from "@/components/JoinSection";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="relative z-10 bg-background mb-[420px]">
        <Hero />
        <WhatWeDo />
        <EventsShowcase />
        <WhatWeFocusOn />
        <JoinSection />
      </main>
      <Footer />
    </>
  );
}