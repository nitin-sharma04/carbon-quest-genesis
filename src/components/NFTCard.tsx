
import { useState } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { NFTMetadata } from "@/lib/web3";

interface NFTCardProps {
  id: string;
  metadata: NFTMetadata;
}

export function NFTCard({ id, metadata }: NFTCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  
  // Format IPFS image URL
  const imageUrl = metadata.image.startsWith("ipfs://") 
    ? `https://gateway.pinata.cloud/ipfs/${metadata.image.replace("ipfs://", "")}`
    : metadata.image;
  
  // Extract activity type from metadata attributes
  const activityType = metadata.attributes.find(attr => attr.trait_type === "Activity Type")?.value || "Eco Activity";
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      whileHover={{ y: -5 }}
      className="relative perspective"
      onClick={() => setIsFlipped(!isFlipped)}
    >
      <motion.div
        className="w-full h-full preserve-3d cursor-pointer"
        animate={{ rotateY: isFlipped ? 180 : 0 }}
        transition={{ duration: 0.6, type: "spring" }}
      >
        {/* Front of card */}
        <Card className="absolute backface-hidden w-full">
          <CardContent className="p-0">
            <div className="relative aspect-square overflow-hidden rounded-t-lg">
              <img 
                src={imageUrl || "https://placehold.co/400x400?text=Carbon+NFT"} 
                alt={metadata.name}
                className="object-cover w-full h-full"
              />
              <div className="absolute top-2 right-2 bg-black/60 text-white text-xs font-medium px-2 py-1 rounded-full">
                #{id}
              </div>
            </div>
            <div className="p-4">
              <div className="flex items-center justify-between">
                <h3 className="font-heading font-semibold text-lg">{metadata.name}</h3>
                <span className="inline-flex items-center rounded-full bg-carbon-100 dark:bg-carbon-900 px-2 py-1 text-xs text-carbon-800 dark:text-carbon-100">
                  {activityType}
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                {metadata.description}
              </p>
            </div>
          </CardContent>
        </Card>
        
        {/* Back of card */}
        <Card className="absolute backface-hidden w-full rotateY-180">
          <CardContent className="p-6">
            <h3 className="font-heading font-semibold text-lg mb-2">Details</h3>
            <div className="space-y-2">
              {metadata.attributes.map((attribute, index) => (
                <div key={index} className="flex justify-between">
                  <span className="text-sm font-medium">{attribute.trait_type}:</span>
                  <span className="text-sm text-muted-foreground">{attribute.value}</span>
                </div>
              ))}
              <div className="flex justify-between mt-4 pt-2 border-t">
                <span className="text-sm font-medium">Token ID:</span>
                <span className="text-sm text-muted-foreground">#{id}</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
