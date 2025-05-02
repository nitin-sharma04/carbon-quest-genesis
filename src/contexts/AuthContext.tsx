
import React, { createContext, useContext, useState, useEffect } from 'react';
import { authService, User } from '../services/authService';

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<User | null>;
  register: (email: string, password: string, walletAddress?: string) => Promise<User | null>;
  logout: () => void;
  linkWallet: (walletAddress: string) => Promise<User | null>;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    setUser(currentUser);
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const loggedInUser = await authService.login(email, password);
      setUser(loggedInUser);
      return loggedInUser;
    } catch (error) {
      throw error;
    }
  };

  const register = async (email: string, password: string, walletAddress?: string) => {
    try {
      const newUser = await authService.register(email, password, walletAddress);
      return newUser;
    } catch (error) {
      throw error;
    }
  };

  const logout = () => {
    authService.logout();
    setUser(null);
  };

  const linkWallet = async (walletAddress: string) => {
    if (!user) return null;
    const updatedUser = await authService.linkWallet(user.id, walletAddress);
    if (updatedUser) {
      setUser(updatedUser);
    }
    return updatedUser;
  };

  const value = {
    user,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    login,
    register,
    logout,
    linkWallet,
    isLoading
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
