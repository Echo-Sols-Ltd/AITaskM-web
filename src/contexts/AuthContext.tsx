'use client';

import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: 'employee' | 'employer' | 'admin';
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers: User[] = [
  {
    id: '1',
    email: 'john.doe@company.com',
    name: 'John Doe',
    avatar: 'JD',
    role: 'employee'
  },
  {
    id: '2',
    email: 'jane.smith@company.com',
    name: 'Jane Smith',
    avatar: 'JS',
    role: 'employee'
  },
  {
    id: '3',
    email: 'admin@company.com',
    name: 'Admin User',
    avatar: 'AU',
    role: 'admin'
  },
  {
    id: '4',
    email: 'employer@company.com',
    name: 'Employer User',
    avatar: 'EU',
    role: 'employer'
  }
];

// Mock credentials
const mockCredentials = [
  { email: 'john.doe@company.com', password: 'password123' },
  { email: 'jane.smith@company.com', password: 'password123' },
  { email: 'admin@company.com', password: 'admin123' },
  { email: 'employer@company.com', password: 'employer123' },
  { email: 'demo@moveit.com', password: 'demo123' }
];

interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = () => {
      try {
        const storedUser = localStorage.getItem('moveit_user');
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (error) {
        console.error('Error checking auth status:', error);
        localStorage.removeItem('moveit_user');
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 1000));

    try {
      // Check credentials
      const validCredential = mockCredentials.find(
        cred => cred.email === email && cred.password === password
      );

      if (!validCredential) {
        setIsLoading(false);
        return false;
      }

      // Find user data
      let userData = mockUsers.find(u => u.email === email);
      
      // If demo user, create a demo user object
      if (email === 'demo@moveit.com') {
        userData = {
          id: 'demo',
          email: 'demo@moveit.com',
          name: 'Demo User',
          avatar: 'DU',
          role: 'employee'
        };
      }

      if (userData) {
        setUser(userData);
        localStorage.setItem('moveit_user', JSON.stringify(userData));
        setIsLoading(false);
        return true;
      }

      setIsLoading(false);
      return false;
    } catch (error) {
      console.error('Login error:', error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('moveit_user');
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    logout,
    isAuthenticated: !!user
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}

export type { User, AuthContextType };
