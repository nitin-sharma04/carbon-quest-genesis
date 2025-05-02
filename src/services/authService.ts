
import { toast } from "react-hot-toast";

export interface User {
  id: string;
  email: string;
  walletAddress?: string;
  role: 'user' | 'admin';
}

// For development/demo purposes, we'll simulate users with localStorage
// In production, this would connect to your backend
const STORAGE_KEY = "carbonquest_users";
const CURRENT_USER_KEY = "carbonquest_current_user";

export const authService = {
  // Register new user
  register: async (email: string, password: string, walletAddress?: string): Promise<User | null> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getStoredUsers();
      
      // Check if email already exists
      if (users.find(u => u.email.toLowerCase() === email.toLowerCase())) {
        throw new Error("Email already registered");
      }
      
      const newUser: User = {
        id: `user_${Date.now()}`,
        email,
        walletAddress,
        role: 'user', // Default role is user
      };
      
      // Store user password separately for security (in a real app, you'd hash it)
      const secureUsers = getStoredSecureUsers();
      secureUsers.push({
        userId: newUser.id,
        password
      });
      
      // Save updates
      users.push(newUser);
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      localStorage.setItem("carbonquest_secure_users", JSON.stringify(secureUsers));
      
      // Create admin user if no users exist yet
      if (users.length === 1) {
        const adminUser: User = {
          id: `user_admin`,
          email: "admin@carbonquest.com",
          role: 'admin',
        };
        users.push(adminUser);
        secureUsers.push({
          userId: adminUser.id,
          password: "adminpassword" // In a real app, this would be securely stored
        });
        localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
        localStorage.setItem("carbonquest_secure_users", JSON.stringify(secureUsers));
        console.log("Created admin user: admin@carbonquest.com / adminpassword");
      }
      
      return newUser;
    } catch (error: any) {
      console.error("Registration error:", error);
      throw error;
    }
  },
  
  // Login user
  login: async (email: string, password: string): Promise<User | null> => {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 800));
      
      const users = getStoredUsers();
      const secureUsers = getStoredSecureUsers();
      
      // Find user by email
      const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());
      if (!user) {
        throw new Error("Invalid email or password");
      }
      
      // Verify password
      const userSecurity = secureUsers.find(u => u.userId === user.id);
      if (!userSecurity || userSecurity.password !== password) {
        throw new Error("Invalid email or password");
      }
      
      // Save current user session
      localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
      
      return user;
    } catch (error: any) {
      console.error("Login error:", error);
      throw error;
    }
  },
  
  // Logout current user
  logout: () => {
    localStorage.removeItem(CURRENT_USER_KEY);
  },
  
  // Get current logged-in user
  getCurrentUser: (): User | null => {
    const userJson = localStorage.getItem(CURRENT_USER_KEY);
    if (userJson) {
      try {
        return JSON.parse(userJson);
      } catch (e) {
        return null;
      }
    }
    return null;
  },
  
  // Check if user is admin
  isAdmin: (): boolean => {
    const user = authService.getCurrentUser();
    return user ? user.role === 'admin' : false;
  },
  
  // Link wallet to user account
  linkWallet: async (userId: string, walletAddress: string): Promise<User | null> => {
    const users = getStoredUsers();
    const userIndex = users.findIndex(u => u.id === userId);
    
    if (userIndex >= 0) {
      users[userIndex].walletAddress = walletAddress;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(users));
      
      // Update current user if it's the logged-in user
      const currentUser = authService.getCurrentUser();
      if (currentUser && currentUser.id === userId) {
        currentUser.walletAddress = walletAddress;
        localStorage.setItem(CURRENT_USER_KEY, JSON.stringify(currentUser));
      }
      
      return users[userIndex];
    }
    
    return null;
  }
};

// Helper functions for local storage
function getStoredUsers(): User[] {
  const usersJson = localStorage.getItem(STORAGE_KEY);
  return usersJson ? JSON.parse(usersJson) : [];
}

function getStoredSecureUsers(): Array<{userId: string, password: string}> {
  const usersJson = localStorage.getItem("carbonquest_secure_users");
  return usersJson ? JSON.parse(usersJson) : [];
}

