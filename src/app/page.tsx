import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import WhatWeDo from "@/components/WhatWeDo";
import EventsShowcase from "@/components/EventsShowcase";
import WhatWeFocusOn from "@/components/WhatWeFocusOn";

export default function Home() {
  return (
    <>
      <Navbar />
      <main>
        <Hero />
        <WhatWeDo />
        <EventsShowcase />
        <WhatWeFocusOn />
      </main>
    </>
  );
}