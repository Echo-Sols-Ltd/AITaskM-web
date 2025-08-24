'use client';

import Link from "next/link";
import Image from "next/image";
import React, { useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import { useInView } from "react-intersection-observer";
import { useTranslations } from "../../../../contexts/I18nContext"; 

const HeroSection: React.FC = () => {
  const t = useTranslations('hero');
  const controls = useAnimation();
  const [ref, inView] = useInView({ threshold: 0.2, triggerOnce: true });

  // Array of avatar images for both mobile and desktop social proof sections
  const userAvatars = ["/pp1.png", "/pp2.png", "/pp1.png", "/pp2.png"];

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  const containerVariants = {
    hidden: {},
    visible: {
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } },
  };

  return (
    <section
      id="home"
      className="relative bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa] dark:from-gray-900 dark:to-gray-800 py-16 sm:py-24 px-4 sm:px-6 lg:px-12 overflow-hidden min-h-[700px] transition-colors duration-300"
    >
      {/* Decorative elements */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.7 }}
          transition={{ duration: 1.2 }}
          className="absolute -right-20 -top-20 w-[450px] h-[470px] bg-[#E1FFFA] dark:bg-emerald-900/20 rounded-full blur-[30px] lg:blur-[0px] transition-colors duration-300"
        />
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 0.8 }}
          transition={{ duration: 1.2, delay: 0.2 }}
          className="absolute right-48 top-17 w-[400px] h-[400px] bg-[#9DD9D0] dark:bg-emerald-800/30 rounded-full blur-[20px] lg:blur-[0px] transition-colors duration-300"
        />

        {/* Additional decorative elements */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.15 }}
          transition={{ duration: 1.5 }}
          className="absolute left-1/4 bottom-1/4 w-24 h-24 rounded-full bg-[#40b8a6] dark:bg-emerald-600/50 hidden lg:block transition-colors duration-300"
        />
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 0.1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="absolute left-10 top-20 w-32 h-32 rounded-full border-4 border-[#9DD9D0] dark:border-emerald-700/50 hidden lg:block transition-colors duration-300"
        />
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        <motion.div
          ref={ref}
          variants={containerVariants}
          initial="hidden"
          animate={controls}
          className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12 items-center"
        >
          {/* Text content */}
          <div className="space-y-8 pt-8 md:pt-12 order-2 lg:order-1">
            <motion.div className="space-y-3" variants={itemVariants}>
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.2, duration: 0.7 }}
                className="bg-[#e7f9f6] dark:bg-emerald-900/30 text-[#40b8a6] dark:text-emerald-400 px-4 py-2 rounded-full inline-block mb-4 transition-colors duration-300"
              >
                <span className="font-medium">
                  {t('trustedBy')}
                </span>
              </motion.div>

              <motion.h1 className="text-5xl sm:text-6xl md:text-7xl font-bold leading-tight tracking-tight transition-colors duration-300">
                <span className="text-black dark:text-white">{t('title.better')} </span>
                <span className="text-[#40b8a6] dark:text-emerald-400">{t('title.task')}</span>
                <br />
                <span className="text-[#40b8a6] dark:text-emerald-400">{t('title.management')} </span>
                <span className="text-black dark:text-white">{t('title.starts')}</span>
                <br />
                <span className="text-black dark:text-white">{t('title.with')} </span>
                <motion.span
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ delay: 1, duration: 0.8 }}
                  className="text-[#40b8a6] dark:text-emerald-400 font-serif italic relative inline-block transition-colors duration-300"
                >
                  MoveIt
                  <motion.span
                    initial={{ width: "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ delay: 1.4, duration: 0.7 }}
                    className="absolute -bottom-1 left-0 h-[6px] bg-[#e7f9f6] dark:bg-emerald-900/50 rounded-full transition-colors duration-300"
                  />
                </motion.span>
              </motion.h1>
            </motion.div>

            <motion.p
              variants={itemVariants}
              className="text-gray-600 dark:text-gray-300 text-lg max-w-lg mt-6 hidden md:block transition-colors duration-300"
            >
              {t('description')}
            </motion.p>

            <motion.div
              variants={itemVariants}
              className="pt-6 md:pt-8 flex flex-wrap gap-4"
            >
              <Link
                href="/Auth/Signup"
                className="inline-flex items-center bg-[#40b8a6] dark:bg-emerald-600 text-white px-8 py-4 rounded-full font-medium text-lg shadow-lg shadow-[#9DD9D0]/30 dark:shadow-emerald-900/30 hover:bg-[#359e8d] dark:hover:bg-emerald-500 hover:shadow-[#9DD9D0]/40 dark:hover:shadow-emerald-900/40 transition-all duration-300 transform hover:-translate-y-1"
              >
                {t('buttons.getStarted')}
                <motion.span
                  initial={{ x: 0 }}
                  animate={{ x: [0, 5, 0] }}
                  transition={{
                    repeat: Infinity,
                    repeatType: "loop",
                    duration: 1.5,
                  }}
                  className="ml-2 text-xl"
                >
                  →
                </motion.span>
              </Link>

              <Link
                href="/demo"
                className="inline-flex items-center bg-transparent text-[#40b8a6] dark:text-emerald-400 border-2 border-[#40b8a6] dark:border-emerald-400 px-6 py-[14px] rounded-full font-medium text-lg hover:bg-[#e7f9f6] dark:hover:bg-emerald-900/30 transition-all duration-300"
              >
                {t('buttons.watchDemo')}
              </Link>
            </motion.div>

            {/* Social proof with images - visible on mobile */}
            <motion.div
              variants={itemVariants}
              className="flex items-center gap-2 mt-8 lg:hidden"
            >
              <div className="flex -space-x-2">
                {userAvatars.map((avatar, i) => (
                  <div
                    key={i}
                    className="w-8 h-8 rounded-full border-2 border-white dark:border-gray-700 overflow-hidden transition-colors duration-300"
                  >
                    <Image
                      src={avatar}
                      alt={`User ${i + 1}`}
                      width={32}
                      height={32}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
              <span className="text-sm text-gray-600 dark:text-gray-400 transition-colors duration-300">
                <span className="font-semibold">{t('rating')}</span> {t('reviews')}
              </span>
            </motion.div>
          </div>

          {/* Image and stat elements */}
          <div className="relative h-[400px] md:h-[500px] lg:h-[600px] order-1 lg:order-2">
            {/* Stats bubbles */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.6, duration: 0.6 }}
              className="absolute top-0 right-0 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-lg dark:shadow-gray-900/30 z-20 flex items-center gap-3 transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="bg-black dark:bg-gray-700 p-2 rounded-full transition-colors duration-300">
                <svg
                  className="h-5 w-5 text-white"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 0.8, duration: 0.4 }}
                  className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300"
                >
                  {t('stats.users')}
                </motion.span>
                <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('stats.usersLabel')}</div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.8, duration: 0.6 }}
              className="absolute bottom-32 right-0 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-lg dark:shadow-gray-900/30 z-20 flex items-center gap-3 transform hover:scale-105 transition-all duration-300 border border-gray-100 dark:border-gray-700"
            >
              <div className="p-2 border-2 border-black dark:border-gray-300 rounded transition-colors duration-300">
                <svg
                  className="h-5 w-5 text-black dark:text-gray-300 transition-colors duration-300"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M5 13l4 4L19 7"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1, duration: 0.4 }}
                  className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300"
                >
                  {t('stats.tasks')}
                </motion.span>
                <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('stats.tasksLabel')}</div>
              </div>
            </motion.div>

            {/* New stat bubble */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 1, duration: 0.6 }}
              className="absolute top-32 left-0 bg-white dark:bg-gray-800 px-5 py-3 rounded-full shadow-lg dark:shadow-gray-900/30 z-20 items-center gap-3 transform hover:scale-105 transition-all duration-300 hidden lg:flex border border-gray-100 dark:border-gray-700"
            >
              <div className="p-2 bg-[#e7f9f6] dark:bg-emerald-900/30 rounded-full transition-colors duration-300">
                <svg
                  className="h-5 w-5 text-[#40b8a6] dark:text-emerald-400 transition-colors duration-300"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <div>
                <motion.span
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: 1.2, duration: 0.4 }}
                  className="font-bold text-lg text-gray-900 dark:text-white transition-colors duration-300"
                >
                  {t('stats.faster')}
                </motion.span>
                <div className="text-sm text-gray-500 dark:text-gray-400 transition-colors duration-300">{t('stats.fasterLabel')}</div>
              </div>
            </motion.div>

            {/* Hero image with glow effect */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3, duration: 0.8 }}
              className="absolute top-0 right-0 w-full h-full flex justify-center lg:justify-end items-center"
            >
              <div className="relative">
                {/* Glow effect */}
                <div className="absolute -inset-1 bg-[#9DD9D0]/20 dark:bg-emerald-600/20 rounded-full blur-lg transition-colors duration-300"></div>

                <div className="relative z-10">
                  <Image
                    src="/heroImage.png"
                    alt={t('imageAlt')}
                    width={500}
                    height={500}
                    className="object-contain dark:brightness-90 dark:contrast-110 transition-all duration-300"
                    priority
                  />
                </div>
              </div>
            </motion.div>
          </div>
        </motion.div>

        {/* Bottom social proof with images - visible on desktop */}
        <motion.div
          variants={itemVariants}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.4, duration: 0.6 }}
          className="mt-16 hidden lg:flex items-center justify-between border-t border-gray-200 dark:border-gray-700 pt-8 transition-colors duration-300"
        >
          <div className="flex items-center gap-3">
            <div className="flex -space-x-2">
              {userAvatars.map((avatar, i) => (
                <div
                  key={i}
                  className="w-10 h-10 rounded-full border-2 border-white dark:border-gray-600 overflow-hidden transition-colors duration-300"
                >
                  <Image
                    src={avatar}
                    alt={`User ${i + 1}`}
                    width={40}
                    height={40}
                    className="w-full h-full object-cover"
                  />
                </div>
              ))}
            </div>
            <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">
              <span className="font-semibold">{t('rating')}</span> {t('reviews')}
            </span>
          </div>

          <div className="flex items-center gap-6">
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#e7f9f6] dark:bg-emerald-900/30 rounded-full transition-colors duration-300">
                <svg
                  className="h-4 w-4 text-[#40b8a6] dark:text-emerald-400 transition-colors duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('features.easySetup')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#e7f9f6] dark:bg-emerald-900/30 rounded-full transition-colors duration-300">
                <svg
                  className="h-4 w-4 text-[#40b8a6] dark:text-emerald-400 transition-colors duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('features.freeTrial')}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="p-1 bg-[#e7f9f6] dark:bg-emerald-900/30 rounded-full transition-colors duration-300">
                <svg
                  className="h-4 w-4 text-[#40b8a6] dark:text-emerald-400 transition-colors duration-300"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{t('features.noCreditCard')}</span>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default HeroSection;