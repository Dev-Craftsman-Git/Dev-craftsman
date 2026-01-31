
import MissionCapabilities from "@/components/sections/MissionCapabilities";
import Pricing from "@/components/sections/Pricing";
import FeaturedProjects from "@/components/sections/FeaturedProjects";
import AboutSection from "@/components/sections/AboutSection";
import ContactSection from "@/components/sections/ContactSection";
import GetStartedSection from "@/components/sections/GetStartedSection";
import Hero from "@/components/sections/Hero";
import Footer from "@/components/sections/Footer";

import { getProjects, getSectionVisibility } from "@/lib/db-queries";

// export const revalidate = 3600; // Revalidate every hour
export const dynamic = 'force-dynamic';

export default async function Home() {
  const projects = await getProjects(true);
  const showPricing = await getSectionVisibility('home', 'pricing');

  return (
    <div className="flex flex-col min-h-screen">
      <Hero />
      <section id="mission">
        <MissionCapabilities />
      </section>
      {showPricing && (
        <section id="pricing">
          <Pricing />
        </section>
      )}

      <section id="portfolio">
        <FeaturedProjects initialProjects={projects} />
      </section>
      <section id="about">
        <AboutSection />
      </section>
      <section id="contact-us">
        <ContactSection />
      </section>
      <GetStartedSection />
      <Footer showPricing={showPricing} />
    </div>
  );
}
