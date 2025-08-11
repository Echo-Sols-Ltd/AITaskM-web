"use client";

import React from "react";
import Header from "../../components/header";
import HeroSection from "./Home/HomeSections/hero";
import KeyFeatures from "./Home/HomeSections/features";
import HowItWorks from "./Home/HomeSections/HowItWorks";
import TestimonialsSection from "./Home/HomeSections/Testimonials";
import PricingPlans from "./Home/HomeSections/PricingPlans";
import FAQComponent from "./Home/HomeSections/FAQ";
import Footer from "./Home/HomeSections/Footer";

const LocalePage: React.FC = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-grow">
        <HeroSection />
        <KeyFeatures />
        <HowItWorks />
        <TestimonialsSection />
        <PricingPlans />
        <FAQComponent />
        <Footer />
      </main>
    </div>
  );
};

export default LocalePage;
