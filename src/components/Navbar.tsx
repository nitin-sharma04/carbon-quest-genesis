
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/ThemeToggle";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { connectWallet } from "@/lib/web3";

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [address, setAddress] = useState<string | null>(null);

  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setAddress(connection.address);
    }
  };

  const shortAddress = address ? 
    `${address.substring(0, 6)}...${address.substring(address.length - 4)}` : 
    null;

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="sticky top-0 z-40 w-full border-b bg-background/80 backdrop-blur-sm"
    >
      <div className="container flex h-16 items-center">
        <Link to="/" className="flex items-center">
          <motion.div 
            whileHover={{ rotate: [0, 5, -5, 0] }}
            transition={{ duration: 0.5 }}
            className="mr-2 size-8"
          >
            <span className="text-2xl">🌿</span>
          </motion.div>
          <span className="text-xl font-heading font-bold bg-gradient-to-r from-carbon-700 to-carbon-500 dark:from-carbon-400 dark:to-carbon-200 bg-clip-text text-transparent">
            CarbonQuest
          </span>
        </Link>
        
        <div className="hidden md:flex flex-1 items-center justify-center space-x-4">
          <Link to="/" className="text-sm font-medium transition-colors hover:text-primary">
            Home
          </Link>
          <Link to="/dashboard" className="text-sm font-medium transition-colors hover:text-primary">
            Dashboard
          </Link>
          <Link to="/submit" className="text-sm font-medium transition-colors hover:text-primary">
            Submit Activity
          </Link>
          <Link to="/leaderboard" className="text-sm font-medium transition-colors hover:text-primary">
            Leaderboard
          </Link>
          <Link to="/about" className="text-sm font-medium transition-colors hover:text-primary">
            About
          </Link>
        </div>
        
        <div className="flex items-center justify-end space-x-4 flex-1">
          <ThemeToggle />
          
          <Button 
            variant="default" 
            className="hidden md:inline-flex bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
            onClick={handleConnectWallet}
          >
            {shortAddress || "Connect Wallet"}
          </Button>
          
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          >
            {mobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </Button>
        </div>
      </div>
      
      {/* Mobile menu */}
      {mobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          className="md:hidden border-t bg-background"
        >
          <div className="container py-4 space-y-3">
            <Link 
              to="/" 
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Home
            </Link>
            <Link 
              to="/dashboard" 
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Dashboard
            </Link>
            <Link 
              to="/submit" 
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Submit Activity
            </Link>
            <Link 
              to="/leaderboard" 
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              Leaderboard
            </Link>
            <Link 
              to="/about" 
              className="block py-2 text-sm font-medium"
              onClick={() => setMobileMenuOpen(false)}
            >
              About
            </Link>
            <Button 
              variant="default" 
              className="w-full bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white mt-2"
              onClick={() => {
                handleConnectWallet();
                setMobileMenuOpen(false);
              }}
            >
              {shortAddress || "Connect Wallet"}
            </Button>
          </div>
        </motion.div>
      )}
    </motion.header>
  );
}
