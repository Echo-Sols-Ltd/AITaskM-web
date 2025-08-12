import React, { useState } from "react";
import { ChevronDown } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "../../../../contexts/I18nContext";

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
    <div id="faq" className="px-6 py-10 bg-white max-w-4xl mx-auto">
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
      
      <motion.div 
        className="space-y-4"
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {faqs.map((faq, index) => (
          <motion.div 
            key={index} 
            className="border rounded-lg overflow-hidden"
            variants={itemVariants}
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.2 }}
          >
            <motion.button
              onClick={() =>
                setActiveIndex(activeIndex === index ? null : index)
              }
              className="w-full p-4 flex items-center justify-between bg-cyan-50 hover:bg-cyan-100 transition-colors duration-200 text-left"
              whileHover={{ backgroundColor: "#e0f7fa" }}
              whileTap={{ scale: 0.98 }}
            >
              <span className="font-medium text-gray-800">{t(faq.questionKey)}</span>
              <motion.div
                animate={{ rotate: activeIndex === index ? 180 : 0 }}
                transition={{ duration: 0.3 }}
              >
                <ChevronDown className="w-5 h-5 text-gray-600" />
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
              <div className="p-4 bg-white text-gray-700">{t(faq.answerKey)}</div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default FAQComponent;