"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import Stats from "@/components/landing/Stats";
import FeaturedDestinations from "@/components/landing/FeaturedDestinations";
import HowItWorks from "@/components/landing/HowItWorks";
import WhyRayna from "@/components/landing/WhyRayna";
import Testimonials from "@/components/landing/Testimonials";
import CTABanner from "@/components/landing/CTABanner";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <LandingHeader />
      <main className="pt-16">
        <HeroSection />
        <Stats />
        <FeaturedDestinations />
        <HowItWorks />
        <WhyRayna />
        <Testimonials />
        <CTABanner />
      </main>
      <Footer />
    </div>
  );
}
