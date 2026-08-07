import AboutSection from "./components/about-section";
import CareersSection from "./components/careers-section";
import ContactSection from "./components/contact-section";
import EthosSection from "./components/ethos-section";
import Hero from "./components/hero";
import NetworkSection from "./components/network-section";
import NewsSection from "./components/news-section";
import ServiceMatrix from "./components/service-matrix";

export default function Home() {
  return (
    <main className="flex-1">
      <Hero />
      <EthosSection />
      <ServiceMatrix />
      <AboutSection />
      <NewsSection />
      <NetworkSection />
      <CareersSection />
      <ContactSection />
    </main>
  );
}
