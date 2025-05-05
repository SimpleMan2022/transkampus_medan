import { Header } from "@/components/layout/header"
import { Footer } from "@/components/layout/footer"
import { HeroSection } from "@/components/sections/HeroSection"
import { MapPreviewSection } from "@/components/sections/MapPreviewSection"
import { AboutSection } from "@/components/sections/AboutSection"
import { CTASection } from "@/components/sections/CTASection"
import { TeamSection } from "@/components/sections/TeamSection"
import { FeaturesSection } from "@/components/sections/FeaturesSection"
import * as Sections from "@/components/sections/FeaturesSection"
console.log("All Exports:", Sections);
export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">
        <HeroSection />
        <FeaturesSection />
        <MapPreviewSection />
        <AboutSection />
        <TeamSection />
        <CTASection />
      </main>
      <Footer />
    </div>
  )
}
