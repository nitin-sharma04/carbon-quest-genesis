
import { motion } from "framer-motion";
import { Submission } from "@/services/api";
import { Badge } from "@/components/ui/badge";
import { format } from "date-fns";

interface SubmissionListProps {
  submissions: Submission[];
  isLoading: boolean;
}

export function SubmissionList({ submissions, isLoading }: SubmissionListProps) {
  if (isLoading) {
    return (
      <div className="flex justify-center py-10">
        <div className="loader"></div>
      </div>
    );
  }
  
  if (submissions.length === 0) {
    return (
      <div className="text-center py-16">
        <div className="inline-flex mb-6 p-4 rounded-full bg-carbon-100 dark:bg-carbon-900/60">
          <span className="text-5xl">📋</span>
        </div>
        <h3 className="text-xl font-semibold">No submissions yet</h3>
        <p className="text-muted-foreground mt-2">
          Your eco-friendly activity submissions will appear here
        </p>
      </div>
    );
  }
  
  return (
    <div className="space-y-4">
      {submissions.map((submission, index) => (
        <motion.div
          key={submission.id}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: index * 0.1 }}
          className="glass-card p-4 rounded-lg"
        >
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="w-full sm:w-24 h-24 rounded-md overflow-hidden">
              <img 
                src={submission.imageUrl} 
                alt={submission.title} 
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1">
              <div className="flex justify-between items-start">
                <h3 className="font-semibold text-lg">{submission.title}</h3>
                <SubmissionStatusBadge status={submission.status} />
              </div>
              
              <p className="text-sm text-muted-foreground mb-2">{submission.activityType}</p>
              
              <p className="text-sm line-clamp-2">{submission.description}</p>
              
              <div className="mt-2 text-xs text-muted-foreground">
                Submitted {format(new Date(submission.createdAt), "MMM d, yyyy")}
              </div>
              
              {submission.tokenId && (
                <div className="mt-1 text-xs">
                  <span className="font-medium">Token ID:</span> #{submission.tokenId}
                </div>
              )}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}

function SubmissionStatusBadge({ status }: { status: Submission["status"] }) {
  switch (status) {
    case "approved":
      return <Badge className="bg-green-500">Minted 🎉</Badge>;
    case "rejected":
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="bg-amber-500/20 text-amber-700 border-amber-500/30">Pending ⏳</Badge>;
  }
}
