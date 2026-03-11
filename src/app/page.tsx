"use client";

import LandingHeader from "@/components/landing/LandingHeader";
import HeroSection from "@/components/landing/HeroSection";
import FeaturedDestinations from "@/components/landing/FeaturedDestinations";
import Footer from "@/components/landing/Footer";

export default function Home() {
  return (
    <div className="min-h-screen bg-[var(--bg-primary)]">
      <LandingHeader />
      <main className="pt-16">
        <HeroSection />
        <FeaturedDestinations />
      </main>
      <Footer />
    </div>
  );
}
