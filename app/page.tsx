import AboutSection from "./components/about-section";
import CareersSection from "./components/careers-section";
import ContactSection from "./components/contact-section";
import CultureSection from "./components/culture-section";
import EthosSection from "./components/ethos-section";
import Hero from "./components/hero";
import HistorySection from "./components/history-section";
import NetworkSection from "./components/network-section";
import NewsSection from "./components/news-section";
import RisePanel from "./components/rise-panel";
import ServiceOrbit from "./components/service-orbit";
import WorkspaceSection from "./components/workspace-section";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <RisePanel>
        <EthosSection />
      </RisePanel>

      <ServiceOrbit />
      {/*
        BpoSection is parked, not deleted — see app/components/bpo-section.tsx.
        It details the digital marketing division at a depth no other division
        can currently match, and a page that gives one of four practices its own
        band reads as a claim about what the company mostly does. It goes back
        in here the day AI, systems and global have material of the same weight;
        restoring it is this line plus the import.
      */}
      <AboutSection />
      <HistorySection />
      <NewsSection />
      <NetworkSection />
      <CareersSection />
      <CultureSection />
      <WorkspaceSection />
      <ContactSection />
    </main>
  );
}
