
import { useState, useEffect } from "react";
import { Moon, Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

export function ThemeToggle() {
  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    // Check for system preference or saved preference
    const isDark = document.documentElement.classList.contains("dark") || 
                   window.matchMedia("(prefers-color-scheme: dark)").matches;
    setIsDarkMode(isDark);
  }, []);

  const toggleTheme = () => {
    if (isDarkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.theme = "light";
    } else {
      document.documentElement.classList.add("dark");
      localStorage.theme = "dark";
    }
    setIsDarkMode(!isDarkMode);
  };

  return (
    <Button
      variant="ghost"
      size="icon"
      onClick={toggleTheme}
      className="relative"
      aria-label="Toggle theme"
    >
      <Sun className={`h-5 w-5 transition-all ${isDarkMode ? "scale-0 opacity-0" : "scale-100 opacity-100"}`} />
      <Moon className={`absolute h-5 w-5 transition-all ${isDarkMode ? "scale-100 opacity-100" : "scale-0 opacity-0"}`} />
      <motion.div 
        className="absolute inset-0 rounded-full bg-primary/10"
        initial={false}
        animate={{ scale: [0.8, 1.2, 1], opacity: [0, 1, 0] }}
        transition={{ duration: 1, repeat: 0 }}
      />
    </Button>
  );
}
