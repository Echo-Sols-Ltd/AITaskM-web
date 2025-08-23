'use client';

import React from "react";
import {
  ClipboardList,
  BellRing,
  Users,
  LineChart,
  ShieldCheck,
  Check,
  CalendarSync
} from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "../../../../contexts/I18nContext"; 

const KeyFeatures: React.FC = () => {
  const t = useTranslations('features');

  // Enhanced feature data with Lucide React icons and added benefits
  const features = [
    {
      icon: <ClipboardList className="w-6 h-6 text-emerald-600" />,
      titleKey: "smartTaskManagement.title",
      descriptionKey: "smartTaskManagement.description",
      benefitsKeys: [
        "smartTaskManagement.benefits.customCategories",
        "smartTaskManagement.benefits.priorityFlags",
        "smartTaskManagement.benefits.batchCreation",
      ],
    },
    {
      icon: <BellRing className="w-6 h-6 text-cyan-600" />,
      titleKey: "deadlineReminders.title",
      descriptionKey: "deadlineReminders.description",
      benefitsKeys: [
        "deadlineReminders.benefits.emailNotifications",
        "deadlineReminders.benefits.customAlerts",
        "deadlineReminders.benefits.recurringReminders",
      ],
    },
    {
      icon: <Users className="w-6 h-6 text-emerald-600" />,
      titleKey: "teamCollaboration.title",
      descriptionKey: "teamCollaboration.description",
      benefitsKeys: [
        "teamCollaboration.benefits.rolePermissions",
        "teamCollaboration.benefits.taskCommenting",
        "teamCollaboration.benefits.activityTracking",
      ],
    },
    {
      icon: <LineChart className="w-6 h-6 text-cyan-600" />,
      titleKey: "progressTracking.title",
      descriptionKey: "progressTracking.description",
      benefitsKeys: [
        "progressTracking.benefits.customDashboards",
        "progressTracking.benefits.exportReports",
        "progressTracking.benefits.trendAnalysis",
      ],
    },
    {
      icon: <ShieldCheck className="w-6 h-6 text-emerald-600" />,
      titleKey: "securePrivate.title",
      descriptionKey: "securePrivate.description",
      benefitsKeys: [
        "securePrivate.benefits.endToEndEncryption",
        "securePrivate.benefits.gdprCompliant",
        "securePrivate.benefits.twoFactorAuth",
      ],
    },
    {
      icon: <CalendarSync className="w-6 h-6 text-emerald-600" />,
      titleKey: "realtimeSync.title",
      descriptionKey: "realtimeSync.description",
      benefitsKeys: [
        "realtimeSync.benefits.instantUpdates",
        "realtimeSync.benefits.cloudSync",
        "realtimeSync.benefits.offlineAccess",
      ],
    },
  ];

  // Animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.5, ease: "easeOut" },
    },
  };

  const titleVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.7, ease: "easeOut" },
    },
  };

  return (
    <section
      id="features"
      className="py-20 px-4 bg-white relative overflow-hidden"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-100/50 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 opacity-60"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-100/50 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 opacity-60"></div>

        <svg
          className="absolute right-10 top-1/3 text-emerald-200 w-24 h-24 opacity-30"
          viewBox="0 0 100 100"
          fill="none"
        >
          <circle
            cx="50"
            cy="50"
            r="40"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="25"
            stroke="currentColor"
            strokeWidth="2"
          />
          <circle
            cx="50"
            cy="50"
            r="10"
            stroke="currentColor"
            strokeWidth="2"
          />
        </svg>

        <svg
          className="absolute left-10 bottom-1/4 text-cyan-200 w-16 h-16 opacity-30"
          viewBox="0 0 100 100"
          fill="none"
        >
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            stroke="currentColor"
            strokeWidth="2"
            rx="10"
          />
          <rect
            x="30"
            y="30"
            width="40"
            height="40"
            stroke="currentColor"
            strokeWidth="2"
            rx="5"
          />
        </svg>
      </div>

      <div className="max-w-7xl mx-auto relative z-10">
        {/* Title with gradient underline */}
        <motion.div
          className="mb-16 text-center"
          initial="hidden"
          animate="visible"
          variants={titleVariants}
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4">{t('title')}</h2>
          <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 rounded-full mx-auto mb-6"></div>
          <p className="mt-6 text-gray-600 max-w-2xl mx-auto">
            {t('subtitle')}
          </p>
        </motion.div>

        {/* Feature cards grid */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              whileHover={{
                y: -5,
                boxShadow: "0 15px 30px rgba(0, 0, 0, 0.1)",
                transition: { duration: 0.2 },
              }}
              className={`bg-white rounded-2xl p-6 border border-emerald-100 shadow-md transition-all duration-300 
                ${index > 2 && index < 5 && "lg:col-span-3/2"}`}
            >
              <div className="flex flex-col h-full">
                <div className="bg-gradient-to-br from-emerald-50 to-cyan-50 p-4 rounded-xl mb-5 inline-flex">
                  <div className="bg-white p-3 rounded-full shadow-sm">
                    {feature.icon}
                  </div>
                </div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">
                  {t(feature.titleKey)}
                </h3>
                <p className="text-gray-600 mb-5">{t(feature.descriptionKey)}</p>

                {/* Feature benefits list */}
                <div className="mt-auto">
                  <div className="border-t border-gray-100 pt-4 mt-2">
                    <ul className="space-y-2">
                      {feature.benefitsKeys.map((benefitKey, i) => (
                        <li
                          key={i}
                          className="flex items-center text-sm text-gray-600"
                        >
                          <Check
                            size={16}
                            className="text-emerald-500 mr-2 flex-shrink-0"
                          />
                          <span>{t(benefitKey)}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>

        {/* Call to action */}
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
              {t('cta.button')}
            </motion.button>
          </Link>

          <p className="text-gray-500 mt-4 text-sm">
            {t('cta.subtitle')}
          </p>
        </motion.div>
      </div>
    </section>
  );
};

export default KeyFeatures;