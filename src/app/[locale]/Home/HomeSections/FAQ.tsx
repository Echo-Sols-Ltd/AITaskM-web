import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "../../../../contexts/I18nContext";
import { div } from "framer-motion/client";

interface FAQ {
  questionKey: string;
  answerKey: string;
}

const FAQComponent: React.FC = () => {
  const t = useTranslations('faq');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  const faqs: FAQ[] = [
    {
      questionKey: "questions.free.question",
      answerKey: "questions.free.answer",
    },
    {
      questionKey: "questions.plans.question",
      answerKey: "questions.plans.answer",
    },
    {
      questionKey: "questions.mobile.question",
      answerKey: "questions.mobile.answer",
    },
    {
      questionKey: "questions.offline.question",
      answerKey: "questions.offline.answer",
    },
    {
      questionKey: "questions.cancel.question",
      answerKey: "questions.cancel.answer",
    },
    {
      questionKey: "questions.security.question",
      answerKey: "questions.security.answer",
    },
    {
      questionKey: "questions.collaboration.question",
      answerKey: "questions.collaboration.answer",
    },
    {
      questionKey: "questions.support.question",
      answerKey: "questions.support.answer",
    },
  ];

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5 },
    },
  };

  return (
    <div  className="w-full relative overflow-hidden bg-gradient-to-b from-teal-50 to-[#F0FFFD] dark:from-gray-900 dark:to-gray-800 py-16 px-4 transition-colors duration-300">
    <div id="faq" className="px-6 py-10 bg-white dark:bg-gray-900 max-w-4xl mx-auto transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-cyan-100/30 dark:bg-cyan-800/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 opacity-60 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-1/4 h-1/4 bg-emerald-100/30 dark:bg-emerald-800/10 rounded-full blur-3xl transform -translate-x-1/3 translate-y-1/3 opacity-60 transition-colors duration-300"></div>
      </div>

      {/* Section heading */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center mb-16 relative z-10"
      >
        <h2 className="text-3xl md:text-4xl font-bold text-gray-800 dark:text-white mb-4 transition-colors duration-300">
          {t('title')}
        </h2>
        <div className="h-1 w-24 bg-gradient-to-r from-emerald-400 to-cyan-400 dark:from-emerald-500 dark:to-cyan-500 rounded-full mx-auto mb-6 transition-colors duration-300"></div>
        <p className="text-gray-600 dark:text-gray-300 max-w-2xl mx-auto transition-colors duration-300">
          {t('subtitle')}
        </p>
      </motion.div>
      
      <motion.div 
        className="space-y-4 relative z-10"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden shadow-sm dark:shadow-gray-900/20 transition-all duration-300"
            variants={itemVariants}
            whileHover={{ 
              scale: 1.02, 
              boxShadow: "0 4px 20px rgba(0, 0, 0, 0.1)",
              transition: { duration: 0.2 } 
            }}
          >
            <motion.button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full p-4 flex items-center justify-between bg-cyan-50 dark:bg-gray-800 hover:bg-cyan-100 dark:hover:bg-gray-700 transition-colors duration-300 text-left"
              whileHover={{ 
                backgroundColor: activeIndex === index 
                  ? "rgba(6, 182, 212, 0.1)" 
                  : "rgba(6, 182, 212, 0.15)" 
              }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium text-gray-800 dark:text-gray-200 transition-colors duration-300">{t(faq.questionKey)}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
                className="flex-shrink-0 ml-2"
              >
                <ChevronDown className="w-5 h-5 text-gray-600 dark:text-gray-400 transition-colors duration-300" />
              </motion.div>
            </motion.button>
            <motion.div
              initial={false}
              animate={{
                height: activeIndex === index ? "auto" : 0,
                opacity: activeIndex === index ? 1 : 0,
              }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="overflow-hidden"
            >
              <motion.div 
                className="p-4 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 border-t border-gray-100 dark:border-gray-700 transition-colors duration-300"
                initial={{ y: -10 }}
                animate={{ y: activeIndex === index ? 0 : -10 }}
                transition={{ duration: 0.3 }}
              >
                {t(faq.answerKey)}
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
    </div>
  );
};

export default FAQComponent;