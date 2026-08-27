import AboutSection from "./components/about-section";
import BpoSection from "./components/bpo-section";
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
      <BpoSection />
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
