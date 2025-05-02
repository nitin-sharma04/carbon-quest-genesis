
import { toast } from "react-hot-toast";

// API base URL - would come from environment variable in production
const API_BASE_URL = "https://carbonquest-api.example.com"; // Replace with actual API URL in production

export interface SubmissionData {
  activityType: string;
  title: string;
  description: string;
  image: File;
  walletAddress: string;
}

export interface Submission {
  id: string;
  activityType: string;
  title: string;
  description: string;
  imageUrl: string;
  walletAddress: string;
  status: "pending" | "approved" | "rejected";
  tokenId?: string;
  tokenUri?: string;
  createdAt: string;
}

// For development/demo purposes, we'll simulate API calls with local storage
// In production, these would be actual API calls
export const api = {
  submitActivity: async (data: SubmissionData): Promise<Submission> => {
    try {
      // In a real implementation, this would be a fetch/axios call to your backend
      // const formData = new FormData();
      // formData.append("activityType", data.activityType);
      // formData.append("title", data.title);
      // formData.append("description", data.description);
      // formData.append("image", data.image);
      // formData.append("walletAddress", data.walletAddress);
      
      // const response = await fetch(`${API_BASE_URL}/submit-activity`, {
      //   method: "POST",
      //   body: formData,
      // });
      
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || "Failed to submit activity");
      // return result;
      
      // Mock API response for demo
      await new Promise(resolve => setTimeout(resolve, 1500)); // Simulate network delay
      
      const submission: Submission = {
        id: `submission_${Date.now()}`,
        activityType: data.activityType,
        title: data.title,
        description: data.description,
        imageUrl: URL.createObjectURL(data.image),
        walletAddress: data.walletAddress,
        status: "pending",
        createdAt: new Date().toISOString(),
      };
      
      // Store in localStorage for persistence during demo
      const submissions = this.getStoredSubmissions();
      submissions.push(submission);
      localStorage.setItem("carbonquest_submissions", JSON.stringify(submissions));
      
      return submission;
    } catch (error) {
      console.error("Error submitting activity:", error);
      throw error;
    }
  },
  
  getUserSubmissions: async (walletAddress: string): Promise<Submission[]> => {
    try {
      // In a real implementation, this would be a fetch call
      // const response = await fetch(`${API_BASE_URL}/submissions?walletAddress=${walletAddress}`);
      // const result = await response.json();
      // if (!response.ok) throw new Error(result.message || "Failed to fetch submissions");
      // return result;
      
      // Mock API response for demo
      await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
      
      const allSubmissions = api.getStoredSubmissions();
      return allSubmissions.filter(sub => sub.walletAddress.toLowerCase() === walletAddress.toLowerCase());
    } catch (error) {
      console.error("Error fetching user submissions:", error);
      throw error;
    }
  },
  
  // Helper for demo persistence
  getStoredSubmissions: (): Submission[] => {
    const storedData = localStorage.getItem("carbonquest_submissions");
    return storedData ? JSON.parse(storedData) : [];
  }
};
