import React, { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { api, SubmissionData, Submission } from "@/services/api";
import { toast } from "react-hot-toast";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import { connectWallet } from "@/lib/web3";

export default function Submit() {
  const [activityType, setActivityType] = useState("tree-planting");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissions, setSubmissions] = useState<Submission[]>([]);
  const [isLoadingSubmissions, setIsLoadingSubmissions] = useState(false);
  const [activeTab, setActiveTab] = useState("submit");
  const [address, setAddress] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    // Load user submissions on mount and when address changes
    loadUserSubmissions();
  }, [address, user]);
  
  const handleConnectWallet = async () => {
    const connection = await connectWallet();
    if (connection) {
      setAddress(connection.address);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedImage(file);
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!activityType || !title || !description || !selectedImage || !address) {
      toast.error("Please fill all fields and connect your wallet");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const submissionData: SubmissionData = {
        activityType,
        title,
        description,
        image: selectedImage,
        walletAddress: address || "",
        userId: user?.id // Add user ID to link submission to user account
      };
      
      const result = await api.submitActivity(submissionData);
      
      // Reset form
      setActivityType("tree-planting");
      setTitle("");
      setDescription("");
      setSelectedImage(null);
      setImagePreview(null);
      
      toast.success("Activity submitted successfully!");
      setActiveTab("submissions"); // Switch to submissions tab after successful submission
    } catch (error: any) {
      console.error("Error submitting activity:", error);
      toast.error(error.message || "Failed to submit activity");
    } finally {
      setIsSubmitting(false);
    }
  };
  
  const loadUserSubmissions = async () => {
    if (!address && !user?.id) {
      setSubmissions([]);
      return;
    }
    
    setIsLoadingSubmissions(true);
    try {
      const userSubmissions = await api.getUserSubmissions(address || "", user?.id);
      setSubmissions(userSubmissions);
    } catch (error) {
      console.error("Error loading submissions:", error);
      toast.error("Failed to load your submissions");
    } finally {
      setIsLoadingSubmissions(false);
    }
  };

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
              Submit Your Activity
            </h1>
            <p className="text-lg text-muted-foreground">
              Share your eco-friendly actions and earn Carbon NFTs
            </p>
          </div>
          
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="glass-card p-6"
          >
            <Tabs defaultValue="submit" className="space-y-4">
              <TabsList className="flex justify-center">
                <TabsTrigger value="submit">Submit Activity</TabsTrigger>
                <TabsTrigger value="submissions" onClick={loadUserSubmissions}>My Submissions</TabsTrigger>
              </TabsList>
              
              <TabsContent value="submit">
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <Label htmlFor="activityType">Activity Type</Label>
                    <select
                      id="activityType"
                      className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                      value={activityType}
                      onChange={(e) => setActivityType(e.target.value)}
                    >
                      <option value="tree-planting">Tree Planting</option>
                      <option value="clean-energy">Clean Energy Adoption</option>
                      <option value="waste-reduction">Waste Reduction</option>
                      <option value="sustainable-transport">Sustainable Transport</option>
                    </select>
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Title</Label>
                    <Input
                      id="title"
                      placeholder="A brief title for your activity"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe your activity in detail"
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      required
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="image">Image</Label>
                    <Input
                      type="file"
                      id="image"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="hidden"
                    />
                    <Label htmlFor="image" className="inline-flex items-center justify-center rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 hover:cursor-pointer">
                      {selectedImage ? "Change Image" : "Upload Image"}
                    </Label>
                    {imagePreview && (
                      <div className="mt-2">
                        <img
                          src={imagePreview}
                          alt="Activity Preview"
                          className="max-w-full h-auto rounded-md"
                        />
                      </div>
                    )}
                  </div>
                  
                  {!address ? (
                    <Button 
                      variant="default" 
                      className="w-full bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                      onClick={handleConnectWallet}
                    >
                      Connect Wallet
                    </Button>
                  ) : (
                    <Button 
                      type="submit"
                      className="w-full bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? "Submitting..." : "Submit Activity"}
                    </Button>
                  )}
                </form>
              </TabsContent>
              
              <TabsContent value="submissions">
                {isLoadingSubmissions ? (
                  <div className="text-center py-8">
                    <div className="loader"></div>
                    <p className="mt-2 text-muted-foreground">Loading your submissions...</p>
                  </div>
                ) : submissions.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">No submissions found. Submit your first activity!</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {submissions.map((submission) => (
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
                              {submission.activityType}
                            </p>
                            <p className="text-sm text-muted-foreground">
                              Submitted on {new Date(submission.createdAt).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>
            </Tabs>
          </motion.div>
        </motion.div>
      </main>
    </div>
  );
}
