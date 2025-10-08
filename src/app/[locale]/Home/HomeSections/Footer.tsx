import React from "react";
import {
  Twitter,
  Facebook,
  Instagram,
  Send,
  Mail,
  Heart,
} from "lucide-react";
import Link from "next/link";
import { useTranslations } from "../../../../contexts/I18nContext";

const Footer: React.FC = () => {
  const t = useTranslations('footer');
  const currentYear = new Date().getFullYear();

  return (
    <footer className="w-full bg-[#F0FFFD] dark:bg-gray-900 pt-8 pb-6 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-0 w-1/4 h-1/4 bg-emerald-100/20 dark:bg-emerald-800/10 rounded-full blur-3xl transform translate-x-1/3 -translate-y-1/3 opacity-40 transition-colors duration-300"></div>
        <div className="absolute bottom-0 left-0 w-1/3 h-1/3 bg-cyan-100/20 dark:bg-cyan-800/10 rounded-full blur-3xl transform -translate-x-1/4 translate-y-1/4 opacity-40 transition-colors duration-300"></div>
      </div>

      <div className="max-w-6xl mx-auto px-4 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {/* Company Info */}
          <div className="space-y-4">
            <div className="flex items-center">
              <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-400 transition-colors duration-300">
                Move
                <span className="italic text-cyan-500 dark:text-cyan-400 transition-colors duration-300">
                  It
                </span>
              </span>
            </div>
            <p className="text-gray-600 dark:text-gray-300 text-sm transition-colors duration-300">
              {t("companyDescription")}
            </p>
            <div className="pt-2">
              <button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-4 py-2 rounded-md text-sm flex items-center space-x-2 transition-all duration-300 shadow-sm hover:shadow-md dark:shadow-emerald-900/20">
                <Send className="w-4 h-4" />
                <span>{t("contactUs")}</span>
              </button>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-300">
              {t("resources.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/help"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("resources.helpCenter")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/status"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("resources.status")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/download"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("resources.downloadApps")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/pricing"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("resources.pricing")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/blog"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("resources.blog")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-300">
              {t("legal.title")}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="/privacy"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("legal.privacy")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("legal.terms")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/accessibility"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("legal.accessibility")}
                  </span>
                </Link>
              </li>
              <li>
                <Link
                  href="/security"
                  className="text-gray-600 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 text-sm flex items-center transition-colors duration-300 group"
                >
                  <span className="group-hover:translate-x-1 transition-transform duration-200">
                    {t("legal.security")}
                  </span>
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter */}
          <div>
            <h3 className="font-medium text-gray-800 dark:text-gray-200 mb-4 transition-colors duration-300">
              {t("newsletter.title")}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3 transition-colors duration-300">
              {t("newsletter.description")}
            </p>
            <div className="flex">
              <input
                type="email"
                className="flex-grow px-3 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-l-md focus:outline-none focus:ring-1 focus:ring-emerald-600 dark:focus:ring-emerald-400 focus:border-emerald-600 dark:focus:border-emerald-400 text-sm transition-colors duration-300 placeholder-gray-500 dark:placeholder-gray-400"
                placeholder={t("newsletter.placeholder")}
              />
              <button className="bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 text-white px-3 py-2 rounded-r-md transition-colors duration-300 shadow-sm hover:shadow-md dark:shadow-emerald-900/20">
                <Mail className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Social Links */}
        <div className="flex justify-center space-x-6 mb-6">
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            aria-label="Twitter"
          >
            <Twitter className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            aria-label="Facebook"
          >
            <Facebook className="w-5 h-5" />
          </a>
          <a
            href="#"
            className="text-gray-500 dark:text-gray-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-all duration-300 transform hover:scale-110 hover:-translate-y-1"
            aria-label="Instagram"
          >
            <Instagram className="w-5 h-5" />
          </a>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 dark:text-gray-400 text-sm pt-4 border-t border-gray-200 dark:border-gray-700 transition-colors duration-300">
          <p className="flex items-center justify-center">
            ©{currentYear}{" "}
            <span className="text-emerald-600 dark:text-emerald-400 font-medium mx-1 transition-colors duration-300">
              MoveIt
            </span>
            <span className="ml-1">{t("copyright.madeWith")}</span>
            <Heart
              className="w-4 h-4 mx-1 text-emerald-600 dark:text-emerald-400 inline "
              fill="currentColor"
            />
            <a href="https://www.echo-solution.com/">
              {" "}
              <span>{t("copyright.author")}</span>
            </a>{" "}
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;