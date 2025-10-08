"use client";

import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from "react";
import { apiClient, type User as ApiUser } from "@/services/api";

interface User {
  id: string;
  email: string;
  name: string;
  avatar?: string;
  role: "employee" | "employer" | "admin" | "manager";
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, name: string, role: "employee" | "employer") => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check for existing session on mount
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem("moveit_token");
        if (token) {
          // Verify token with backend
          const response = await apiClient.verifyToken();
          const userData: User = {
            ...response.user,
            role: response.user.role as "employee" | "employer" | "admin" | "manager"
          };
          setUser(userData);
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // Clear invalid token
        localStorage.removeItem("moveit_token");
        localStorage.removeItem("moveit_user");
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);

    try {
      const response = await apiClient.login({ email, password });
      
      // Store token and user data
      localStorage.setItem("moveit_token", response.token);
      
      const userData: User = {
        ...response.user,
        role: response.user.role as "employee" | "employer" | "admin" | "manager"
      };
      
      setUser(userData);
      localStorage.setItem("moveit_user", JSON.stringify(userData));
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Login error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const register = async (email: string, password: string, name: string, role: "employee" | "employer"): Promise<boolean> => {
    setIsLoading(true);

    try {
      // Map frontend roles to backend roles
      const backendRole = role === "employer" ? "manager" : "employee";
      
      await apiClient.register({ 
        email, 
        password, 
        name, 
        role: backendRole as "employee" | "employer" | "admin" | "manager"
      });
      
      setIsLoading(false);
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      setIsLoading(false);
      return false;
    }
  };

  const logout = async () => {
    try {
      await apiClient.logout();
    } catch (error) {
      console.error("Logout error:", error);
    } finally {
      setUser(null);
      localStorage.removeItem("moveit_token");
      localStorage.removeItem("moveit_user");
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    login,
    register,
    logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}

export type { User, AuthContextType };
