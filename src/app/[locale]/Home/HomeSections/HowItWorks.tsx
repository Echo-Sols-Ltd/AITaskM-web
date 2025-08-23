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
      className="relative bg-gradient-to-b from-[#F0FFFD] to-emerald-50 py-20 px-4 overflow-hidden"
    >
      {/* Background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.5 }}
          transition={{ duration: 1.5 }}
          className="absolute top-0 right-0 w-1/3 h-1/3 bg-cyan-100 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4"
        />
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.4 }}
          transition={{ duration: 1.5, delay: 0.3 }}
          className="absolute bottom-0 left-0 w-1/2 h-1/2 bg-emerald-100 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4"
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
          <h2 className="text-3xl md:text-4xl font-bold text-gray-800 mb-4">
            {t('title')}
          </h2>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6"></div>
          <p className="text-gray-600 max-w-2xl mx-auto">
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
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition-shadow duration-300 overflow-hidden border border-emerald-100"
            >
              <div className="p-6">
                <div
                  className={`w-12 h-12 mb-4 rounded-lg bg-[#40b8a6] ${feature.color} flex items-center justify-center shadow-lg`}
                >
                  {feature.icon}
                </div>
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600">
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
              className="bg-[#40b8a6] text-white font-medium py-3 px-8 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
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
