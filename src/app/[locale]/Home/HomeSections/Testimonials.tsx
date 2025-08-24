import React from "react";
import Image from "next/image";
import { Quote } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations } from "../../../../contexts/I18nContext";

interface Testimonial {
  id: number;
  nameKey: string;
  roleKey: string;
  quoteKey: string;
  rating: number;
  image: string;
}

const TestimonialsSection = () => {
  const t = useTranslations('testimonials');

  const testimonials: Testimonial[] = [
    {
      id: 1,
      nameKey: "testimonial1.name",
      roleKey: "testimonial1.role",
      quoteKey: "testimonial1.quote",
      rating: 5,
      image: "/pp1.png",
    },
    {
      id: 2,
      nameKey: "testimonial2.name",
      roleKey: "testimonial2.role",
      quoteKey: "testimonial2.quote",
      rating: 5,
      image: "/pp2.png",
    },
    {
      id: 3,
      nameKey: "testimonial3.name",
      roleKey: "testimonial3.role",
      quoteKey: "testimonial3.quote",
      rating: 5,
      image: "/pp2.png", 
    },
    {
      id: 4,
      nameKey: "testimonial4.name",
      roleKey: "testimonial4.role",
      quoteKey: "testimonial4.quote",
      rating: 5,
      image: "/pp1.png", 
    },
  ];

  // Helper function to render star ratings using SVG namespace
  const renderStars = (rating: number) => {
    return Array(rating)
      .fill(0)
      .map((_, i) => (
        <motion.svg
          key={i}
          className="w-5 h-5 text-yellow-400 dark:text-yellow-300 transition-colors duration-300"
          fill="currentColor"
          viewBox="0 0 20 20"
          xmlns="http://www.w3.org/2000/svg"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: i * 0.1 }}
        >
          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z"></path>
        </motion.svg>
      ));
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.2,
        duration: 0.6,
        ease: "easeOut",
      },
    }),
  };

  const quoteVariants = {
    hidden: { opacity: 0, scale: 0 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 200,
        damping: 20,
      },
    },
  };

  const imageVariants = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 1,
      scale: 1,
      transition: {
        type: "spring",
        stiffness: 150,
        damping: 15,
      },
    },
  };

  return (
        <div  className="w-full relative overflow-hidden bg-gradient-to-b from-teal-50 to-[#F0FFFD] dark:from-gray-900 dark:to-gray-800 py-16 px-4 transition-colors duration-300">
    
    <section
      id="testimonials"
      className="w-full max-w-6xl mx-auto px-14 py-12 relative overflow-hidden bg-white dark:bg-gray-900 transition-colors duration-300"
    >
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/3 h-1/3 bg-emerald-100/30 dark:bg-emerald-800/10 rounded-full blur-3xl transform translate-x-1/2 -translate-y-1/4 opacity-60 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-100/30 dark:bg-cyan-800/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 opacity-60 transition-colors duration-300"></div>
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

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 md:gap-10 lg:gap-16 relative z-10">
        {/* First Column */}
        <div className="space-y-12 md:space-y-20">
          {[testimonials[0], testimonials[2]].map((testimonial, idx) => (
            <motion.div
              className="relative"
              key={testimonial.id}
              custom={idx}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="absolute -top-8 -left-8 w-16 h-16 md:w-20 md:h-20 bg-emerald-600 dark:bg-emerald-500 rounded-tl-3xl transition-colors duration-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 + 0.2, duration: 0.5 }}
              />
              <div className="relative z-10 bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 rounded-lg p-6 shadow-lg hover:shadow-xl dark:shadow-gray-900/30 dark:hover:shadow-gray-900/40 transition-all duration-300 border-t border-l border-white dark:border-gray-700 border-opacity-40">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  <motion.div
                    variants={quoteVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Quote className="h-8 w-8 text-emerald-600 dark:text-emerald-400 rotate-180 transition-colors duration-300" />
                  </motion.div>
                </div>
                <motion.p
                  className="text-gray-800 dark:text-gray-200 mb-6 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2 + 0.3, duration: 0.5 }}
                >
                  {t(testimonial.quoteKey)}
                </motion.p>
                <div className="flex items-center">
                  <motion.div
                    className="mr-3 h-12 w-12 overflow-hidden rounded-full shadow-md dark:shadow-gray-900/30 transition-shadow duration-300"
                    variants={imageVariants}
                  >
                    <Image
                      src={testimonial.image}
                      alt={`${t(testimonial.nameKey)}'s profile`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-teal-800 dark:text-teal-300 transition-colors duration-300">
                      {t(testimonial.nameKey)}
                    </p>
                    <p className="text-teal-600 dark:text-teal-400 text-sm transition-colors duration-300">—{t(testimonial.roleKey)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Second Column with offset for staggered effect */}
        <div className="space-y-12 md:space-y-20 mt-8 md:mt-32">
          {[testimonials[1], testimonials[3]].map((testimonial, idx) => (
            <motion.div
              className="relative"
              key={testimonial.id}
              custom={idx + 2}
              initial="hidden"
              animate="visible"
              variants={cardVariants}
              whileHover={{ y: -5, transition: { duration: 0.2 } }}
            >
              <motion.div
                className="absolute -top-8 -left-8 w-16 h-16 md:w-20 md:h-20 bg-emerald-600 dark:bg-emerald-500 rounded-tl-3xl transition-colors duration-300"
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: idx * 0.2 + 0.6, duration: 0.5 }}
              />
              <div className="relative z-10 bg-white dark:bg-gray-800 backdrop-blur-sm bg-opacity-90 dark:bg-opacity-90 rounded-lg p-6 shadow-lg hover:shadow-xl dark:shadow-gray-900/30 dark:hover:shadow-gray-900/40 transition-all duration-300 border-t border-l border-white dark:border-gray-700 border-opacity-40">
                <div className="flex justify-between items-center mb-4">
                  <div className="flex">{renderStars(testimonial.rating)}</div>
                  <motion.div
                    variants={quoteVariants}
                    initial="hidden"
                    animate="visible"
                  >
                    <Quote className="h-8 w-8 text-emerald-600 dark:text-emerald-400 rotate-180 transition-colors duration-300" />
                  </motion.div>
                </div>
                <motion.p
                  className="text-gray-800 dark:text-gray-200 mb-6 transition-colors duration-300"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: idx * 0.2 + 0.7, duration: 0.5 }}
                >
                  {t(testimonial.quoteKey)}
                </motion.p>
                <div className="flex items-center">
                  <motion.div
                    className="mr-3 h-12 w-12 overflow-hidden rounded-full shadow-md dark:shadow-gray-900/30 transition-shadow duration-300"
                    variants={imageVariants}
                  >
                    <Image
                      src={testimonial.image}
                      alt={`${t(testimonial.nameKey)}'s profile`}
                      width={48}
                      height={48}
                      className="object-cover"
                    />
                  </motion.div>
                  <div>
                    <p className="font-semibold text-teal-800 dark:text-teal-300 transition-colors duration-300">
                      {t(testimonial.nameKey)}
                    </p>
                    <p className="text-teal-600 dark:text-teal-400 text-sm transition-colors duration-300">—{t(testimonial.roleKey)}</p>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* SVG Footer Decoration */}
      <svg
        className="w-full h-16 mt-12 opacity-20 dark:opacity-10 transition-opacity duration-300"
        viewBox="0 0 1200 60"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="none"
      >
        <path
          d="M0,20 C300,60 600,0 1200,30 L1200,60 L0,60 Z"
          fill="currentColor"
          className="text-teal-500 dark:text-teal-400 transition-colors duration-300"
        />
      </svg>
    </section>
    </div>
  );
};

export default TestimonialsSection;