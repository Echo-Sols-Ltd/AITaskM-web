"use client";

import Link from "next/link";
import React, { useState, useEffect } from "react";
import { Menu, X } from "lucide-react";
import LanguageSwitcher from "./LanguageSwitcher";
import { useTranslations, useLocale } from "@/contexts/I18nContext";
import { ThemeToggle } from "./ui/ThemeToggle";
const Header: React.FC = () => {
  const t = useTranslations('header');
  const locale = useLocale();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  // Function to toggle mobile menu
  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  // Function to close mobile menu after selection
  const closeMenu = () => {
    setIsMenuOpen(false);
  };

  // Function to determine active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "home",
        "features",
        "how-it-works",
        "testimonials",
        "pricing",
        "faq",
      ];

      // Find the current section based on scroll position
      for (const section of sections) {
        const element = document.getElementById(section);
        if (element) {
          const rect = element.getBoundingClientRect();
          // If the section is in view (with some buffer for better UX)
          if (rect.top <= 150 && rect.bottom >= 150) {
            setActiveSection(section);
            break;
          }
        }
      }
    };

    // Add scroll event listener
    window.addEventListener("scroll", handleScroll);

    // Initial check for active section
    handleScroll();

    // Clean up event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Navigation items with translations
  const navItems = [
    { id: "home", label: t('nav.home'), href: "#home" },
    { id: "features", label: t('nav.features'), href: "#features" },
    { id: "how-it-works", label: t('nav.howItWorks'), href: "#how-it-works" },
    { id: "testimonials", label: t('nav.testimonials'), href: "#testimonials" },
    { id: "pricing", label: t('nav.pricing'), href: "#pricing" },
    { id: "faq", label: t('nav.faq'), href: "#faq" },
  ];

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-white/80 dark:bg-gray-900/80 backdrop-blur-lg border-b border-gray-200/50 dark:border-gray-700/50 transition-all duration-300">
      <div className="w-full mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="text-[#40b8a6] dark:text-emerald-400 font-serif italic text-2xl transition-colors duration-300">
            <Link href="/">MoveIt</Link>
          </div>

          <div className="hidden md:flex items-center justify-end w-full">
            {/* Nav Links  */}
            <nav className="flex items-center mr-8">
              {navItems.map((item) => (
                <Link
                  key={item.id}
                  href={item.href}
                  className={`font-medium transition-colors duration-300 px-3 py-2 mx-1 ${
                    activeSection === item.id
                      ? "text-[#40b8a6] dark:text-emerald-400 border-b-2 border-[#40b8a6] dark:border-emerald-400"
                      : "text-gray-700 dark:text-gray-300 hover:text-[#40b8a6] dark:hover:text-emerald-400"
                  }`}
                >
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Language Switcher and Auth buttons */}
            <div className="flex items-center space-x-4">
              <LanguageSwitcher />
              <Link
                href={`/${locale}/Auth/Login`}
                className="bg-[#40b8a6] dark:bg-emerald-600 text-white px-4 py-2 rounded-full font-medium border-2 border-[#40b8a6] dark:border-emerald-600 hover:bg-[#359e8d] dark:hover:bg-emerald-700 hover:shadow-[#9DD9D0]/40 dark:hover:shadow-emerald-900/40 transition-all duration-300"
              >
                {t('auth.login')}
              </Link>
              <Link
                href={`/${locale}/Auth/Signup`}
                className="bg-transparent text-[#40b8a6] dark:text-emerald-400 px-4 py-2 rounded-full font-medium border-2 border-[#40b8a6] dark:border-emerald-400 hover:bg-[#e7f9f6] dark:hover:bg-emerald-900/20 transition-all duration-300"
              >
                {t('auth.signup')}
              </Link>
              <ThemeToggle />
            </div>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="w-6 h-6 text-gray-700 dark:text-gray-300 transition-colors duration-300" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700 dark:text-gray-300 transition-colors duration-300" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Navigation */}
      {isMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-md dark:shadow-gray-900/50 z-40 border-b border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <div className="flex flex-col py-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`py-3 px-6 font-medium transition-colors duration-300 ${
                  activeSection === item.id
                    ? "text-[#40b8a6] dark:text-emerald-400 bg-[#f7fcfb] dark:bg-emerald-900/20"
                    : "text-gray-700 dark:text-gray-300 hover:text-[#40b8a6] dark:hover:text-emerald-400 hover:bg-[#f7fcfb] dark:hover:bg-emerald-900/20"
                }`}
                onClick={closeMenu}
              >
                {item.label}
              </Link>
            ))}
            <div className="flex flex-col space-y-3 mt-4 px-6 py-3 border-t border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
              <Link
                href={`/${locale}/Auth/Login`}
                className="bg-[#40b8a6] dark:bg-emerald-600 text-white px-4 py-2 rounded-full font-medium border-2 border-[#40b8a6] dark:border-emerald-600 hover:bg-[#359e8d] dark:hover:bg-emerald-700 text-center transition-all duration-300"
                onClick={closeMenu}
              >
                {t('auth.login')}
              </Link>
              <Link
                href={`/${locale}/Auth/Signup`}
                className="bg-transparent text-[#40b8a6] dark:text-emerald-400 px-4 py-2 rounded-full font-medium border-2 border-[#40b8a6] dark:border-emerald-400 hover:bg-[#e7f9f6] dark:hover:bg-emerald-900/20 text-center transition-all duration-300"
                onClick={closeMenu}
              >
                {t('auth.signup')}
              </Link>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;