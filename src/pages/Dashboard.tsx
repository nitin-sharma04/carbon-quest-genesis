
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { NFTCard } from "@/components/NFTCard";
import { Button } from "@/components/ui/button";
import { toast } from "react-hot-toast";
import { connectWallet, getUserNFTs } from "@/lib/web3";
import { motion } from "framer-motion";

export default function Dashboard() {
  const [address, setAddress] = useState<string | null>(null);
  const [nfts, setNfts] = useState([]);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (address) {
      loadUserNFTs();
    }
  }, [address]);
  
  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setAddress(connection.address);
    }
  };
  
  const loadUserNFTs = async () => {
    if (!address) return;
    
    setLoading(true);
    try {
      const userNFTs = await getUserNFTs(address);
      setNfts(userNFTs);
    } catch (error) {
      console.error("Error loading NFTs:", error);
      toast.error("Failed to load your NFTs");
    } finally {
      setLoading(false);
    }
  };
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-5xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4 gradient-heading">
              Your Carbon NFT Dashboard
            </h1>
            <p className="text-lg text-muted-foreground">
              View and manage your earned Carbon NFTs
            </p>
          </div>
          
          {!address ? (
            <div className="text-center py-16">
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5 }}
                className="inline-flex mb-6 p-4 rounded-full bg-carbon-100 dark:bg-carbon-900/60"
              >
                <span className="text-5xl">🔗</span>
              </motion.div>
              <h2 className="text-2xl font-heading font-semibold mb-4">Connect Your Wallet</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your MetaMask wallet to view your Carbon NFTs on the Sepolia testnet
              </p>
              <Button 
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                size="lg"
              >
                Connect MetaMask
              </Button>
            </div>
          ) : (
            <div>
              <div className="bg-card rounded-lg p-6 mb-8 flex flex-col sm:flex-row justify-between items-center gap-4 border">
                <div>
                  <h2 className="text-lg font-medium">Connected Wallet</h2>
                  <p className="text-sm text-muted-foreground font-mono">{address}</p>
                </div>
                <Button
                  variant="outline"
                  onClick={loadUserNFTs}
                  disabled={loading}
                >
                  {loading ? "Loading..." : "Refresh NFTs"}
                </Button>
              </div>
              
              {loading ? (
                <div className="py-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-carbon-100 dark:bg-carbon-900/60 mb-4 animate-pulse">
                    <div className="w-8 h-8 border-4 border-carbon-500 border-t-transparent rounded-full animate-spin" />
                  </div>
                  <p>Loading your Carbon NFTs...</p>
                </div>
              ) : (
                <>
                  {nfts.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                      {nfts.map((nft, index) => (
                        <NFTCard 
                          key={nft.id}
                          id={nft.id}
                          metadata={nft.metadata}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="py-16 text-center">
                      <motion.div
                        initial={{ scale: 0.9, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{ duration: 0.5 }}
                        className="inline-flex mb-6 p-4 rounded-full bg-carbon-100 dark:bg-carbon-900/60"
                      >
                        <span className="text-5xl">🌱</span>
                      </motion.div>
                      <h2 className="text-2xl font-heading font-semibold mb-4">No NFTs Found</h2>
                      <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                        You don't have any Carbon NFTs yet. Submit your eco-friendly activities to earn your first NFT!
                      </p>
                      <Button 
                        variant="default"
                        className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                        asChild
                      >
                        <a href="/submit">Submit Activity</a>
                      </Button>
                    </div>
                  )}
                </>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
