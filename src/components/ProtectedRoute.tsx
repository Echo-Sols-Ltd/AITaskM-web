'use client';

import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/contexts/AuthContext';
import { useLocale } from '@/contexts/I18nContext';
import { motion } from 'framer-motion';
import { Loader2 } from 'lucide-react';

interface ProtectedRouteProps {
  children: React.ReactNode;
  requiredRole?: 'employee' | 'employer' | 'admin';
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ 
  children, 
  requiredRole 
}) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const router = useRouter();
  const locale = useLocale();

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      router.push(`/${locale}/Auth/Login`);
    }
  }, [isLoading, isAuthenticated, router, locale]);

  useEffect(() => {
    if (user && requiredRole && user.role !== requiredRole) {
      // Redirect to appropriate dashboard based on role
      switch (user.role) {
        case 'employer':
          router.push(`/${locale}/EmployerDashboard`);
          break;
        case 'admin':
          router.push(`/${locale}/Dashboard`);
          break;
        default:
          router.push(`/${locale}/Dashboard`);
      }
    }
  }, [user, requiredRole, router, locale]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-2xl p-8 shadow-lg border border-gray-200 text-center"
        >
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            className="w-12 h-12 mx-auto mb-4"
          >
            <Loader2 className="w-12 h-12 text-[#40b8a6]" />
          </motion.div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            Loading...
          </h3>
          <p className="text-gray-600">
            Checking authentication status
          </p>
        </motion.div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null; // Will redirect in useEffect
  }

  if (requiredRole && user?.role !== requiredRole) {
    return null; // Will redirect in useEffect
  }

  return <>{children}</>;
};

export default ProtectedRoute;
