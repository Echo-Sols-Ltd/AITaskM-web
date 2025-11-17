  "use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { useRouter } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import { useLocale, useTranslations } from "@/contexts/I18nContext";
import { ThemeToggle } from "@/components/ui/ThemeToggle";
import { Eye, EyeOff, Loader2 } from "lucide-react";

const LoginPage: React.FC = () => {
  const [formData, setFormData] = useState({
    email: "",
    password: "",
    rememberMe: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const { login, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("auth");

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated && !isLoading) {
      router.push(`/${locale}/Dashboard`);
    }
  }, [isAuthenticated, isLoading, router, locale]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    if (error) setError("");
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError("");

    try {
      const success = await login(formData.email, formData.password);
      if (success) {
        router.push(`/${locale}/Dashboard`);
      } else {
        setError(t("errors.invalidCredentials") || "Invalid email or password");
      }
    } catch {
      setError(t("errors.loginFailed") || "Login failed. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-[#F0FFFD] to-[#edfbfa] dark:from-gray-900 dark:to-gray-800 flex items-center justify-center px-4 py-8 transition-colors duration-300">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="bg-white dark:bg-gray-800 rounded-xl shadow-lg dark:shadow-2xl p-8 w-full max-w-md transition-colors duration-300"
      >
        <div className="text-center mb-8">
          <div className="flex justify-end mb-4">
            <ThemeToggle />
          </div>
          <h1 className="text-3xl font-bold text-[#40b8a6] dark:text-[#4dd0bd] font-serif italic mb-2">
            MoveIt
          </h1>
          <p className="text-gray-600 dark:text-gray-300">
            {t("welcomeBack") || "Welcome back! Sign in to your account"}
          </p>
        </div>


        {error && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-300 text-sm"
          >
            {error}
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              {t("emailAddress") || "Email address"}
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#40b8a6] dark:focus:ring-[#4dd0bd] focus:border-transparent transition-all outline-none"
              placeholder="you@example.com"
              required
              disabled={isSubmitting}
            />
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                {t("password") || "Password"}
              </label>
              <Link
                href={`/${locale}/forgot-password`}
                className="text-sm text-[#40b8a6] dark:text-[#4dd0bd] hover:text-[#359e8d] dark:hover:text-[#40b8a6]"
              >
                {t("forgotPassword") || "Forgot password?"}
              </Link>
            </div>
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 pr-12 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-[#40b8a6] dark:focus:ring-[#4dd0bd] focus:border-transparent transition-all outline-none"
                placeholder="••••••••"
                required
                disabled={isSubmitting}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300"
                disabled={isSubmitting}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="rememberMe"
              name="rememberMe"
              checked={formData.rememberMe}
              onChange={handleChange}
              className="h-4 w-4 text-[#40b8a6] dark:text-[#4dd0bd] rounded border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 focus:ring-[#40b8a6] dark:focus:ring-[#4dd0bd]"
            />
            <label htmlFor="rememberMe" className="ml-2 text-sm text-gray-600 dark:text-gray-300">
              Remember me for 30 days
            </label>
          </div>

          <motion.button
            type="submit"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            disabled={isSubmitting}
            className="w-full bg-[#40b8a6] hover:bg-[#359e8d] dark:bg-[#4dd0bd] dark:hover:bg-[#40b8a6] disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed text-white font-medium py-3 px-4 rounded-lg transition-colors duration-200 shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
          >
            {isSubmitting ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                {t("signingIn") || "Signing in..."}
              </>
            ) : (
              t("signIn") || "Sign in"
            )}
          </motion.button>

          <div className="relative flex items-center justify-center">
            <div className="border-t border-gray-300 dark:border-gray-600 absolute w-full"></div>
            <div className="bg-white dark:bg-gray-800 px-3 text-gray-500 dark:text-gray-400 text-sm relative">
              or continue with
            </div>
          </div>

          <motion.button
            type="button"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="w-full flex items-center justify-center gap-3 bg-white dark:bg-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-3 px-4 rounded-lg transition-colors duration-200 border border-gray-300 dark:border-gray-600 shadow-sm"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path
                fill="#4285F4"
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
              />
              <path
                fill="#34A853"
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
              />
              <path
                fill="#FBBC05"
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
              />
              <path
                fill="#EA4335"
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
              />
            </svg>
            Continue with Google
          </motion.button>
        </form>

        <div className="text-center mt-6">
          <p className="text-gray-600 dark:text-gray-300">
            {t("noAccount") || "Don't have an account?"}{" "}
            <Link
              href={`/${locale}/Auth/Signup`}
              className="text-[#40b8a6] dark:text-[#4dd0bd] hover:text-[#359e8d] dark:hover:text-[#40b8a6] font-medium"
            >
              {t("signUpFree") || "Sign up for free"}
            </Link>
          </p>
        </div>
      </motion.div>
    </div>
  );
};

export default LoginPage;
