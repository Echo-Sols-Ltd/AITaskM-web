import React, { useState } from "react";
import { Check, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import Link from "next/link";
import { useTranslations } from "../../../../contexts/I18nContext";

interface PricingFeature {
  textKey: string;
}

interface PricingPlan {
  nameKey: string;
  descriptionKey: string;
  price: string;
  period: string;
  popular?: boolean;
  features: PricingFeature[];
  buttonTextKey: string;
  yearlyPrice?: string;
}

const PricingPlans = () => {
  const t = useTranslations('pricing');
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "monthly"
  );

  const pricingPlans: PricingPlan[] = [
    {
      nameKey: "plans.free.name",
      descriptionKey: "plans.free.description",
      price: "$0",
      yearlyPrice: "$0",
      period: t('billing.monthly'),
      features: [
        { textKey: "plans.free.features.tasks" },
        { textKey: "plans.free.features.reminders" },
        { textKey: "plans.free.features.access" },
        { textKey: "plans.free.features.modes" },
        { textKey: "plans.free.features.projects" },
        { textKey: "plans.free.features.attachments" },
      ],
      buttonTextKey: "buttons.getStarted",
    },
    {
      nameKey: "plans.pro.name",
      descriptionKey: "plans.pro.description",
      price: "$9.99",
      yearlyPrice: "$7.99",
      period: t('billing.monthly'),
      popular: true,
      features: [
        { textKey: "plans.pro.features.everything" },
        { textKey: "plans.pro.features.unlimited" },
        { textKey: "plans.pro.features.tracking" },
        { textKey: "plans.pro.features.collaboration" },
        { textKey: "plans.pro.features.integrations" },
        { textKey: "plans.pro.features.support" },
      ],
      buttonTextKey: "buttons.subscribe",
    },
    {
      nameKey: "plans.premium.name",
      descriptionKey: "plans.premium.description",
      price: "$19.99",
      yearlyPrice: "$16.99",
      period: t('billing.monthly'),
      features: [
        { textKey: "plans.premium.features.everything" },
        { textKey: "plans.premium.features.ai" },
        { textKey: "plans.premium.features.workflows" },
        { textKey: "plans.premium.features.security" },
        { textKey: "plans.premium.features.sync" },
        { textKey: "plans.premium.features.admin" },
      ],
      buttonTextKey: "buttons.subscribe",
    },
  ];

  // Calculate annual savings
  const getSavingsText = (plan: PricingPlan) => {
    if (t(plan.nameKey) === t('plans.free.name') || !plan.yearlyPrice) return null;
    const monthlyPrice = parseFloat(plan.price.replace("$", ""));
    const yearlyPrice = parseFloat(plan.yearlyPrice.replace("$", ""));
    const monthlySavings = monthlyPrice - yearlyPrice;
    const yearlySavings = monthlySavings * 12;

    return t('billing.saveYearly', { amount: yearlySavings.toFixed(2) });
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const planVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
    hover: {
      y: -10,
      transition: { duration: 0.3 },
    },
  };

  const checkmarkVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { type: "spring", stiffness: 200, damping: 10 },
    },
  };

  const buttonVariants = {
    hover: {
      scale: 1.03,
      transition: { duration: 0.2 },
    },
    tap: {
      scale: 0.97,
      transition: { duration: 0.1 },
    },
  };

  const featureVariants = {
    hidden: { opacity: 0, x: -10 },
    visible: (custom: number) => ({
      opacity: 1,
      x: 0,
      transition: {
        delay: custom * 0.05,
        duration: 0.3,
      },
    }),
  };

  const backgroundCircleVariants = {
    hidden: { scale: 0 },
    visible: {
      scale: 1,
      transition: { duration: 0.8 },
    },
  };

  return (
    <div
      id="pricing"
      className="w-full relative overflow-hidden bg-gradient-to-b from-teal-50 to-[#F0FFFD] dark:from-gray-900 dark:to-gray-800 py-16 px-4 transition-colors duration-300"
    >
      {/* Background elements */}
      <motion.div
        className="absolute top-20 right-0 w-64 h-64 rounded-full bg-teal-100/40 dark:bg-teal-800/20 opacity-40 -z-10 transition-colors duration-300"
        initial="hidden"
        animate="visible"
        variants={backgroundCircleVariants}
      />
      <motion.div
        className="absolute bottom-0 left-10 w-80 h-80 rounded-full bg-teal-100/30 dark:bg-teal-800/10 opacity-30 -z-10 transition-colors duration-300"
        initial="hidden"
        animate="visible"
        variants={backgroundCircleVariants}
        transition={{ delay: 0.2 }}
      />
      <motion.div
        className="absolute top-40 left-1/4 w-20 h-20 rounded-full bg-yellow-100/40 dark:bg-yellow-800/20 opacity-40 -z-10 transition-colors duration-300"
        initial="hidden"
        animate="visible"
        variants={backgroundCircleVariants}
        transition={{ delay: 0.4 }}
      />

      {/* Decorative patterns */}
      <div className="absolute top-10 right-10 opacity-10 dark:opacity-5 -z-10 transition-opacity duration-300">
        <svg width="120" height="120" viewBox="0 0 120 120" fill="none">
          <circle
            cx="60"
            cy="60"
            r="50"
            stroke="currentColor"
            strokeWidth="2"
            strokeDasharray="8 8"
            fill="none"
            className="text-gray-800 dark:text-gray-300 transition-colors duration-300"
          />
          <circle
            cx="60"
            cy="60"
            r="30"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-800 dark:text-gray-300 transition-colors duration-300"
          />
        </svg>
      </div>
      <div className="absolute bottom-10 left-1/4 opacity-10 dark:opacity-5 -z-10 transition-opacity duration-300">
        <svg width="100" height="100" viewBox="0 0 100 100" fill="none">
          <path
            d="M20 20L80 80M80 20L20 80"
            stroke="currentColor"
            strokeWidth="2"
            className="text-gray-800 dark:text-gray-300 transition-colors duration-300"
          />
          <rect
            x="10"
            y="10"
            width="80"
            height="80"
            stroke="currentColor"
            strokeWidth="2"
            fill="none"
            className="text-gray-800 dark:text-gray-300 transition-colors duration-300"
          />
        </svg>
      </div>

      <div className="max-w-6xl mx-auto">
        {/* Heading */}
        <div className="mb-16 text-center">
          <motion.h2
            className="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300"
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {t('title')}
          </motion.h2>

          <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 dark:from-emerald-500 dark:to-cyan-500 rounded-full mx-auto mt-2 mb-6 transition-colors duration-300"></div>

          <motion.p
            className="text-gray-600 dark:text-gray-300 mt-4 max-w-2xl mx-auto transition-colors duration-300"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            {t('subtitle')}
          </motion.p>
        </div>

        {/* Toggle */}
        <motion.div
          className="flex items-center justify-center space-x-3 mb-12"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <span
            className={`text-sm transition-colors duration-300 ${
              billingPeriod === "monthly"
                ? "font-semibold text-teal-600 dark:text-teal-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {t('billing.monthlyLabel')}
          </span>

          <motion.button
            onClick={() =>
              setBillingPeriod(
                billingPeriod === "monthly" ? "annually" : "monthly"
              )
            }
            className="relative w-14 h-7 bg-teal-200 dark:bg-teal-700 rounded-full p-1 transition-colors duration-300"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <motion.div
              className="absolute top-1 w-5 h-5 bg-emerald-600 dark:bg-emerald-500 rounded-full transition-colors duration-300"
              animate={{
                translateX: billingPeriod === "annually" ? 28 : 0,
              }}
              transition={{ type: "spring", stiffness: 300, damping: 20 }}
            />
          </motion.button>

          <span
            className={`text-sm transition-colors duration-300 ${
              billingPeriod === "annually"
                ? "font-semibold text-teal-600 dark:text-teal-400"
                : "text-gray-600 dark:text-gray-400"
            }`}
          >
            {t('billing.annuallyLabel')}
          </span>

          {billingPeriod === "annually" && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              className="ml-2 text-xs font-medium text-teal-600 dark:text-teal-300 bg-teal-100 dark:bg-teal-800 px-2 py-1 rounded-full flex items-center transition-colors duration-300"
            >
              <Sparkles size={12} className="mr-1" /> {t('billing.saveUpTo')}
            </motion.div>
          )}
        </motion.div>

        {/* Plans */}
        <motion.div
          className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 mb-12"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {pricingPlans.map((plan, index) => (
            <motion.div
              key={index}
              className={`relative rounded-2xl p-8 transition-all duration-300 ${
                plan.popular
                  ? "bg-white dark:bg-gray-800 border-2 border-emerald-600 dark:border-emerald-500 shadow-xl dark:shadow-emerald-900/20"
                  : "bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700 shadow-lg dark:shadow-gray-900/30"
              }`}
              variants={planVariants}
              whileHover="hover"
            >
              {plan.popular && (
                <motion.div
                  className="absolute top-0 right-6 transform -translate-y-1/2"
                  initial={{ y: -20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5 }}
                >
                  <div className="bg-emerald-600 dark:bg-emerald-500 text-white text-sm px-4 py-1 mt-4 rounded-full flex items-center shadow-md transition-colors duration-300">
                    <Sparkles size={14} className="mr-1" /> {t('popular')}
                  </div>
                </motion.div>
              )}

              <h3 className="text-2xl font-bold text-gray-900 dark:text-white transition-colors duration-300">{t(plan.nameKey)}</h3>
              <p className="text-gray-600 dark:text-gray-300 mb-4 transition-colors duration-300">{t(plan.descriptionKey)}</p>

              <motion.div
                className="mb-6"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{
                  duration: 0.5,
                  delay: index * 0.1 + 0.3,
                  ease: "easeInOut",
                }}
              >
                <span className="text-4xl font-bold text-gray-900 dark:text-white transition-colors duration-300">
                  {billingPeriod === "monthly" ? plan.price : plan.yearlyPrice}
                </span>
                <span className="text-gray-600 dark:text-gray-400 transition-colors duration-300">{plan.period}</span>

                {billingPeriod === "annually" && getSavingsText(plan) && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-xs font-medium text-teal-600 dark:text-teal-400 mt-2 transition-colors duration-300"
                  >
                    {getSavingsText(plan)}
                  </motion.div>
                )}
              </motion.div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, idx) => (
                  <motion.li
                    key={idx}
                    className="flex items-start"
                    custom={idx}
                    variants={featureVariants}
                  >
                    <motion.div
                      className="flex-shrink-0 h-6 w-6 rounded-full bg-emerald-600 dark:bg-emerald-500 flex items-center justify-center mt-0.5 transition-colors duration-300"
                      variants={checkmarkVariants}
                    >
                      <Check size={16} className="text-white" />
                    </motion.div>
                    <span className="ml-3 text-gray-700 dark:text-gray-300 transition-colors duration-300">{t(feature.textKey)}</span>
                  </motion.li>
                ))}
              </ul>
              <Link href="/Auth/Signup">
                <motion.button
                  className={`w-full py-3 rounded-lg font-medium transition-all duration-300 shadow-sm ${
                    plan.popular
                      ? "bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white shadow-emerald-900/20"
                      : "bg-transparent text-emerald-600 dark:text-emerald-400 border-2 border-emerald-600 dark:border-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-900/20"
                  }`}
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                >
                  {t(plan.buttonTextKey)}
                </motion.button>
              </Link>
            </motion.div>
          ))}
        </motion.div>

        {/* Footer note */}
        <motion.div
          className="text-center text-gray-500 dark:text-gray-400 text-sm max-w-2xl mx-auto transition-colors duration-300"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          {t('footer.trial')}
          <br />
          {t('footer.enterprise')}{" "}
          <a href="#" className="text-teal-500 dark:text-teal-400 hover:underline transition-colors duration-300">
            {t('footer.contactUs')}
          </a>
          .
        </motion.div>
      </div>
    </div>
  );
};

export default PricingPlans;