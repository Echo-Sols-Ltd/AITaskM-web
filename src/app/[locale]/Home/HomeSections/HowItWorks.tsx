'use client';

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useTranslations } from "../../../../contexts/I18nContext";
import { Zap, FolderKanban, Bell, Users } from "lucide-react";

const HowItWorks: React.FC = () => {
  const t = useTranslations('howItWorks');

  const features = [
    {
      icon: <Zap className="h-6 w-6 text-white" />,
      titleKey: "steps.signUp.title",
      descriptionKey: "steps.signUp.description",
      color: "from-emerald-500 to-emerald-600",
    },
    {
      icon: <FolderKanban className="h-6 w-6 text-white" />,
      titleKey: "steps.organize.title",
      descriptionKey: "steps.organize.description",
      color: "from-cyan-500 to-cyan-600",
    },
    {
      icon: <Bell className="h-6 w-6 text-white" />,
      titleKey: "steps.track.title",
      descriptionKey: "steps.track.description",
      color: "from-emerald-500 to-cyan-500",
    },
    {
      icon: <Users className="h-6 w-6 text-white" />,
      titleKey: "steps.collaborate.title",
      descriptionKey: "steps.collaborate.description",
      color: "from-cyan-500 to-emerald-500",
    },
  ];

  return (
    <section
      id="how-it-works"
      className="relative bg-gradient-to-b from-[#F0FFFD] to-emerald-50 dark:from-gray-900 dark:to-gray-800 py-20 px-4 overflow-hidden transition-colors duration-300"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-100/50 dark:bg-cyan-800/20 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 transition-colors duration-300"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-100/50 dark:bg-emerald-800/20 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 transition-colors duration-300"
        />
      </div>

      <div className="container mx-auto max-w-6xl relative z-10">
        {/* Section heading */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
            {t('title')}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 dark:from-emerald-500 dark:to-cyan-500 rounded-full mx-auto mb-6 transition-colors duration-300"></div>
          <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Features grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 lg:gap-8 mb-16">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 + 0.2 }}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
              className="bg-white dark:bg-gray-800 rounded-xl shadow-md hover:shadow-xl dark:shadow-gray-900/30 dark:hover:shadow-gray-900/40 transition-all duration-300 overflow-hidden border border-emerald-100 dark:border-gray-700"
            >
              <div className="p-6">
                <div
                  className={`w-12 h-12 mb-4 rounded-lg bg-gradient-to-br ${feature.color} flex items-center justify-center shadow-lg dark:shadow-gray-900/30 transition-colors duration-300`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 dark:text-white mb-2 transition-colors duration-300">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 dark:text-gray-300 transition-colors duration-300">
                  {t(feature.descriptionKey)}
                </p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Call-to-action button */}
        <motion.div
          className="mt-16 text-center"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
        >
          <Link href="Auth/Signup">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className="bg-emerald-600 dark:bg-emerald-600 hover:bg-emerald-700 dark:hover:bg-emerald-500 text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl dark:shadow-emerald-900/30 dark:hover:shadow-emerald-900/40 transition-all duration-300"
            >
              {t('cta.buttons.getStarted')}
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default HowItWorks;