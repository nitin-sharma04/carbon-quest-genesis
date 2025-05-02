
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "@/contexts/AuthContext";

// Import pages
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard";
import Submit from "./pages/Submit";
import Admin from "./pages/Admin";
import Leaderboard from "./pages/Leaderboard";
import About from "./pages/About";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Register from "./pages/Register";

// Import private route component for authorization
import PrivateRoute from "./components/auth/PrivateRoute";

// Import toast notifications
import { Toaster as HotToaster } from "react-hot-toast";

const queryClient = new QueryClient();

const App = () => {
  // Initialize theme from local storage or system preference
  useEffect(() => {
    if (localStorage.theme === 'dark' || 
        (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, []);
  
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <HotToaster position="bottom-right" />
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Index />} />
              <Route path="/dashboard" element={<PrivateRoute element={<Dashboard />} />} />
              <Route path="/submit" element={<PrivateRoute element={<Submit />} />} />
              <Route path="/admin" element={<PrivateRoute element={<Admin />} adminOnly={true} />} />
              <Route path="/leaderboard" element={<Leaderboard />} />
              <Route path="/about" element={<About />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="*" element={<NotFound />} />
            </Routes>
          </BrowserRouter>
        </TooltipProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
