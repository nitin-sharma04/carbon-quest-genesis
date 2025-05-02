
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { mintNFT } from "@/lib/web3";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { ethers } from "ethers";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

// This component is already protected by PrivateRoute with adminOnly={true} in App.tsx
export default function Admin() {
  const [recipient, setRecipient] = useState("");
  const [tokenURI, setTokenURI] = useState("");
  const [address, setAddress] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [mounted, setMounted] = useState(false);
  const { user, isAdmin } = useAuth();
  const [activeTab, setActiveTab] = useState("pending");
  
  useEffect(() => {
    setMounted(true);
    loadSubmissions();
  }, []);
  
  const loadSubmissions = async () => {
    setLoading(true);
    try {
      const submissions = await api.getAllSubmissions();
      setPendingSubmissions(submissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load submissions");
    } finally {
      setLoading(false);
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

  const handleApproveSubmission = async (submission) => {
    setLoading(true);
    try {
      // Set the recipient and tokenURI fields to prepare for minting
      setRecipient(submission.walletAddress);
      // In a real app, you would generate an actual IPFS URI here
      setTokenURI(`ipfs://QmExample123/${submission.id}`);
      
      // Update submission status in the database
      await api.updateSubmissionStatus(submission.id, "approved", "1", `ipfs://QmExample123/${submission.id}`);
      toast.success("Submission approved");
      loadSubmissions();
    } catch (error) {
      console.error("Error approving submission:", error);
      toast.error("Failed to approve submission");
    } finally {
      setLoading(false);
    }
  };

  const handleRejectSubmission = async (submission) => {
    setLoading(true);
    try {
      await api.updateSubmissionStatus(submission.id, "rejected");
      toast.success("Submission rejected");
      loadSubmissions();
    } catch (error) {
      console.error("Error rejecting submission:", error);
      toast.error("Failed to reject submission");
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
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <Tabs defaultValue="submissions" className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="submissions">User Submissions</TabsTrigger>
                <TabsTrigger value="manual">Manual Minting</TabsTrigger>
              </TabsList>
              
              <TabsContent value="submissions" className="space-y-4">
                <div className="flex justify-between items-center mb-4">
                  <h2 className="font-semibold text-lg">Activity Submissions</h2>
                  <div>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={loadSubmissions}
                      disabled={loading}
                    >
                      {loading ? "Loading..." : "Refresh"}
                    </Button>
                  </div>
                </div>
                
                <div className="flex space-x-2 mb-4">
                  <Button
                    variant={activeTab === "pending" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("pending")}
                  >
                    Pending
                  </Button>
                  <Button
                    variant={activeTab === "approved" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("approved")}
                  >
                    Approved
                  </Button>
                  <Button
                    variant={activeTab === "rejected" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setActiveTab("rejected")}
                  >
                    Rejected
                  </Button>
                </div>
                
                <div className="space-y-4">
                  {pendingSubmissions
                    .filter(sub => activeTab === "all" || sub.status === activeTab)
                    .map((submission) => (
                      <div key={submission.id} className="flex justify-between items-start p-4 bg-background rounded-lg border">
                        <div className="flex space-x-4">
                          <div className="w-16 h-16 rounded-md overflow-hidden">
                            <img 
                              src={submission.imageUrl} 
                              alt={submission.title} 
                              className="w-full h-full object-cover"
                            />
                          </div>
                          <div>
                            <div className="flex items-center space-x-2">
                              <h4 className="font-medium">{submission.title}</h4>
                              <Badge variant={
                                submission.status === "pending" ? "outline" :
                                submission.status === "approved" ? "default" : "destructive"
                              }>
                                {submission.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-muted-foreground">
                              {submission.walletAddress.substring(0, 6)}...
                              {submission.walletAddress.substring(submission.walletAddress.length - 4)}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              {new Date(submission.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        
                        {submission.status === "pending" && (
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleApproveSubmission(submission)}
                              disabled={loading}
                            >
                              Approve
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              className="text-destructive"
                              onClick={() => handleRejectSubmission(submission)}
                              disabled={loading}
                            >
                              Reject
                            </Button>
                          </div>
                        )}
                      </div>
                    ))}
                  
                  {pendingSubmissions.filter(sub => activeTab === "all" || sub.status === activeTab).length === 0 && (
                    <div className="text-center py-8">
                      <p className="text-muted-foreground">No {activeTab} submissions found</p>
                    </div>
                  )}
                </div>
              </TabsContent>
              
              <TabsContent value="manual">
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
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
