
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { mintNFT, connectWallet } from "@/lib/web3";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";

export default function Admin() {
  const [recipient, setRecipient] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [isOwner, setIsOwner] = useState(false);
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setAddress(connection.address);
      // In a real app, we would check if the connected address is the contract owner
      // For demo purposes, we'll just simulate this check
      setIsOwner(true);
    }
  };
  
  const handleMintNFT = async (e) => {
    e.preventDefault();
    
    if (!recipient || !tokenURI) {
      toast.error("Please fill all fields");
      return;
    }
    
    if (!ethers.utils.isAddress(recipient)) {
      toast.error("Invalid recipient address");
      return;
    }
    
    setLoading(true);
    try {
      const tx = await mintNFT(recipient, tokenURI);
      if (tx) {
        setRecipient("");
        setTokenURI("");
        toast.success(`NFT minted successfully to ${recipient}`);
      }
    } catch (error) {
      console.error("Error minting NFT:", error);
      toast.error("Failed to mint NFT");
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
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4 gradient-heading">
              Admin Panel
            </h1>
            <p className="text-lg text-muted-foreground">
              Mint new Carbon NFTs to reward eco-friendly activities
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
                <span className="text-5xl">🔒</span>
              </motion.div>
              <h2 className="text-2xl font-heading font-semibold mb-4">Admin Authentication Required</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Connect your wallet as the contract owner to access admin functionality
              </p>
              <Button 
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                size="lg"
              >
                Connect Admin Wallet
              </Button>
            </div>
          ) : (
            <div>
              {isOwner ? (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="glass-card p-6"
                >
                  <form onSubmit={handleMintNFT}>
                    <div className="mb-6">
                      <Label htmlFor="recipient">Recipient Address</Label>
                      <Input
                        id="recipient"
                        placeholder="0x..."
                        value={recipient}
                        onChange={(e) => setRecipient(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The wallet address that will receive the Carbon NFT
                      </p>
                    </div>
                    
                    <div className="mb-6">
                      <Label htmlFor="tokenURI">Token URI</Label>
                      <Input
                        id="tokenURI"
                        placeholder="ipfs://..."
                        value={tokenURI}
                        onChange={(e) => setTokenURI(e.target.value)}
                        required
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        The IPFS URI containing the NFT metadata
                      </p>
                    </div>
                    
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                      disabled={loading}
                    >
                      {loading ? "Minting..." : "Mint Carbon NFT"}
                    </Button>
                  </form>
                  
                  <div className="mt-8 pt-6 border-t">
                    <h3 className="font-semibold text-lg mb-4">Recently Approved Activities</h3>
                    
                    <div className="space-y-4">
                      {[
                        {
                          id: "1",
                          activity: "Tree Plantation",
                          user: "0x1234...5678",
                          date: "2025-04-28"
                        },
                        {
                          id: "2",
                          activity: "Solar Panel Installation",
                          user: "0xabcd...efgh",
                          date: "2025-04-27"
                        }
                      ].map((item) => (
                        <div key={item.id} className="flex justify-between items-center p-4 bg-background rounded-lg border">
                          <div>
                            <h4 className="font-medium">{item.activity}</h4>
                            <p className="text-sm text-muted-foreground">
                              {item.user} • {item.date}
                            </p>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => setRecipient(item.user)}
                          >
                            Select
                          </Button>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="text-center py-16">
                  <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    transition={{ duration: 0.5 }}
                    className="inline-flex mb-6 p-4 rounded-full bg-carbon-100 dark:bg-carbon-900/60"
                  >
                    <span className="text-5xl">⚠️</span>
                  </motion.div>
                  <h2 className="text-2xl font-heading font-semibold mb-4">Access Denied</h2>
                  <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                    You are not authorized to access the admin panel. Only the contract owner can mint NFTs.
                  </p>
                </div>
              )}
            </div>
          )}
        </motion.div>
      </main>
    </div>
  );
}
