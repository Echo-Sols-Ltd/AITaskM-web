"use client"

import React from "react";
import Header from "../../../components/header";
import HeroSection from "./HomeSections/hero";
import KeyFeatures from "./HomeSections/features";
import HowItWorks from "./HomeSections/HowItWorks";
import TestimonialsSection from "./HomeSections/Testimonials";
import PricingPlans from "./HomeSections/PricingPlans";
import FAQComponent from "./HomeSections/FAQ";
import Footer from "./HomeSections/Footer";

const Home: React.FC = () => {
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

export default Home;
