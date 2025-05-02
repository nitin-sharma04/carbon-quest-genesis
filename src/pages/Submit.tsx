
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { connectWallet } from "@/lib/web3";
import { toast } from "react-hot-toast";
import { motion } from "framer-motion";
import { api, Submission } from "@/services/api";
import { SubmissionList } from "@/components/SubmissionList";

export default function Submit() {
  const [address, setAddress] = useState<string | null>(null);
  const [activityType, setActivityType] = useState("");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");
  const [userSubmissions, setUserSubmissions] = useState<Submission[]>([]);
  const [loadingSubmissions, setLoadingSubmissions] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  useEffect(() => {
    if (address && activeTab === "submissions") {
      fetchUserSubmissions();
    }
  }, [address, activeTab]);
  
  const fetchUserSubmissions = async () => {
    if (!address) return;
    
    setLoadingSubmissions(true);
    try {
      const submissions = await api.getUserSubmissions(address);
      setUserSubmissions(submissions);
    } catch (error) {
      console.error("Error fetching submissions:", error);
      toast.error("Failed to load your submissions");
    } finally {
      setLoadingSubmissions(false);
    }
  };
  
  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setAddress(connection.address);
    }
  };
  
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!address) {
      toast.error("Please connect your wallet first");
      return;
    }
    
    if (!activityType || !title || !description || !image) {
      toast.error("Please fill all fields and upload an image");
      return;
    }
    
    setLoading(true);
    
    try {
      const submissionData = {
        activityType,
        title,
        description,
        image,
        walletAddress: address
      };
      
      await api.submitActivity(submissionData);
      
      toast.success("Activity submitted successfully!");
      setSubmitted(true);
    } catch (error) {
      console.error("Error submitting activity:", error);
      toast.error("Failed to submit activity");
    } finally {
      setLoading(false);
    }
  };
  
  const resetForm = () => {
    setActivityType("");
    setTitle("");
    setDescription("");
    setImage(null);
    setImagePreview(null);
    setSubmitted(false);
    setActiveTab("submit");
  };
  
  const handleViewSubmissions = () => {
    setActiveTab("submissions");
    fetchUserSubmissions();
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
              Submit Eco Activity
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your environmental contribution to earn a Carbon NFT
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
                Connect your MetaMask wallet first to submit your eco-friendly activity
              </p>
              <Button 
                onClick={handleConnectWallet}
                className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                size="lg"
              >
                Connect MetaMask
              </Button>
            </div>
          ) : submitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-16"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1, rotateY: [0, 360] }}
                transition={{ duration: 1.5, delay: 0.2 }}
                className="inline-flex mb-6 p-4 rounded-full bg-carbon-100 dark:bg-carbon-900/60"
              >
                <span className="text-5xl">🎉</span>
              </motion.div>
              <h2 className="text-2xl font-heading font-semibold mb-4">Submission Received!</h2>
              <p className="text-muted-foreground mb-6 max-w-md mx-auto">
                Thank you for your eco-friendly activity submission. Our team will review it shortly and mint your Carbon NFT upon verification.
              </p>
              <div className="flex flex-col sm:flex-row justify-center gap-4">
                <Button 
                  variant="default"
                  className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                  onClick={resetForm}
                >
                  Submit Another Activity
                </Button>
                <Button 
                  variant="outline"
                  onClick={handleViewSubmissions}
                >
                  View Your Submissions
                </Button>
              </div>
            </motion.div>
          ) : (
            <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 mb-6">
                <TabsTrigger value="submit">Submit New Activity</TabsTrigger>
                <TabsTrigger value="submissions">My Submissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="submit">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                >
                  <div className="glass-card p-6">
                    <form onSubmit={handleSubmit}>
                      <div className="mb-6">
                        <Label htmlFor="activityType">Activity Type</Label>
                        <Select value={activityType} onValueChange={setActivityType} required>
                          <SelectTrigger>
                            <SelectValue placeholder="Select activity type" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="tree-plantation">Tree Plantation</SelectItem>
                            <SelectItem value="solar-installation">Solar Panel Installation</SelectItem>
                            <SelectItem value="ev-usage">Electric Vehicle Usage</SelectItem>
                            <SelectItem value="waste-recycling">Waste Recycling</SelectItem>
                            <SelectItem value="other">Other Eco-friendly Activity</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div className="mb-6">
                        <Label htmlFor="title">Activity Title</Label>
                        <Input
                          id="title"
                          placeholder="Brief title of your eco activity"
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          required
                        />
                      </div>
                      
                      <div className="mb-6">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe your eco-friendly activity in detail..."
                          value={description}
                          onChange={(e) => setDescription(e.target.value)}
                          rows={5}
                          required
                        />
                      </div>
                      
                      <div className="mb-8">
                        <Label htmlFor="image">Upload Image Proof</Label>
                        <div className="mt-2">
                          <div className="border-2 border-dashed border-border rounded-lg p-6 text-center">
                            {imagePreview ? (
                              <div className="relative">
                                <img 
                                  src={imagePreview} 
                                  alt="Preview" 
                                  className="max-h-[200px] mx-auto rounded-lg"
                                />
                                <Button 
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  className="mt-4"
                                  onClick={() => {
                                    setImage(null);
                                    setImagePreview(null);
                                  }}
                                >
                                  Remove Image
                                </Button>
                              </div>
                            ) : (
                              <div className="space-y-2">
                                <div className="mx-auto w-12 h-12 rounded-full bg-carbon-100 dark:bg-carbon-900/60 flex items-center justify-center">
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 005.25 21h13.5A2.25 2.25 0 0021 18.75V16.5m-13.5-9L12 3m0 0l4.5 4.5M12 3v13.5" />
                                  </svg>
                                </div>
                                <div className="text-sm text-muted-foreground">
                                  <label htmlFor="file-upload" className="relative cursor-pointer">
                                    <span className="text-primary font-medium">Click to upload</span>
                                    <span> or drag and drop</span>
                                    <input 
                                      id="file-upload" 
                                      name="file-upload" 
                                      type="file" 
                                      accept="image/*"
                                      className="sr-only"
                                      onChange={handleImageChange}
                                    />
                                  </label>
                                </div>
                                <p className="text-xs text-muted-foreground">
                                  PNG, JPG, GIF up to 10MB
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                      
                      <Button 
                        type="submit"
                        className="w-full bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                        disabled={loading}
                      >
                        {loading ? "Submitting..." : "Submit Activity"}
                      </Button>
                    </form>
                  </div>
                  
                  <div className="mt-8">
                    <h3 className="font-semibold text-lg mb-4">Submission Guidelines</h3>
                    <ul className="list-disc pl-5 space-y-2 text-sm text-muted-foreground">
                      <li>Provide clear images that show your eco-friendly activity</li>
                      <li>Include specific details like location, date, and impact in your description</li>
                      <li>All submissions are reviewed by our team before NFT minting</li>
                      <li>You'll receive your Carbon NFT in your connected wallet after verification</li>
                      <li>Multiple submissions are allowed for different activities</li>
                    </ul>
                  </div>
                </motion.div>
              </TabsContent>
              
              <TabsContent value="submissions">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  className="space-y-6"
                >
                  <div className="flex justify-between items-center">
                    <h2 className="text-xl font-semibold">My Activity Submissions</h2>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={fetchUserSubmissions}
                      disabled={loadingSubmissions}
                    >
                      Refresh
                    </Button>
                  </div>
                  
                  <div className="bg-background/50 backdrop-blur-sm rounded-lg border p-4">
                    <SubmissionList 
                      submissions={userSubmissions} 
                      isLoading={loadingSubmissions} 
                    />
                  </div>
                  
                  <div className="flex justify-center mt-6">
                    <Button 
                      variant="default"
                      onClick={() => setActiveTab("submit")}
                      className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                    >
                      Submit New Activity
                    </Button>
                  </div>
                </motion.div>
              </TabsContent>
            </Tabs>
          )}
        </motion.div>
      </main>
    </div>
  );
}
