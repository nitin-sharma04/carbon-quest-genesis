
import { useState, useEffect } from "react";
import { Navbar } from "@/components/Navbar";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";

interface LeaderboardEntry {
  rank: number;
  address: string;
  displayName?: string;
  nftCount: number;
  totalImpact: string;
}

export default function Leaderboard() {
  const [leaderboardData, setLeaderboardData] = useState<LeaderboardEntry[]>([]);
  const [timeFrame, setTimeFrame] = useState<'weekly' | 'monthly' | 'allTime'>('monthly');
  const [loading, setLoading] = useState(true);
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  // Simulated data fetching
  useEffect(() => {
    const fetchLeaderboard = async () => {
      setLoading(true);
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock data
      const mockData: LeaderboardEntry[] = [
        { rank: 1, address: "0x8901Ac89eBF733A6C2DD0e3fAfC6a3F7B18c2434", displayName: "EcoWarrior", nftCount: 12, totalImpact: "2.4 tons CO₂" },
        { rank: 2, address: "0x71C7656EC7ab88b098defB751B7401B5f6d8976F", displayName: "GreenMaster", nftCount: 9, totalImpact: "1.8 tons CO₂" },
        { rank: 3, address: "0xFABB0ac9d68B0B445fB7357272Ff202C5651694a", nftCount: 8, totalImpact: "1.6 tons CO₂" },
        { rank: 4, address: "0x1aE0EA34a72D944a8C7603FfB3eC30a6669E454C", displayName: "TreePlanter", nftCount: 6, totalImpact: "1.2 tons CO₂" },
        { rank: 5, address: "0xBcd4042DE499D14e55001CcbB24a551F3b954096", nftCount: 5, totalImpact: "1.0 tons CO₂" },
        { rank: 6, address: "0x71bE63f3384f5fb98995898A86B02Fb2426c5788", nftCount: 4, totalImpact: "0.8 tons CO₂" },
        { rank: 7, address: "0xfB6916095ca1df60bB79Ce92cE3Ea74c37c5d359", displayName: "EcoEnthusiast", nftCount: 3, totalImpact: "0.6 tons CO₂" },
        { rank: 8, address: "0xDBF03B407c01E7cD3CBea99509d93f8DDDC8C6FB", nftCount: 2, totalImpact: "0.4 tons CO₂" },
        { rank: 9, address: "0xd8dA6BF26964aF9D7eEd9e03E53415D37aA96045", displayName: "GreenThinker", nftCount: 1, totalImpact: "0.2 tons CO₂" },
        { rank: 10, address: "0x5B38Da6a701c568545dCfcB03FcB875f56beddC4", nftCount: 1, totalImpact: "0.2 tons CO₂" },
      ];
      
      setLeaderboardData(mockData);
      setLoading(false);
    };
    
    fetchLeaderboard();
  }, [timeFrame]);
  
  const formatAddress = (address: string) => {
    return `${address.substring(0, 6)}...${address.substring(address.length - 4)}`;
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
          className="max-w-4xl mx-auto"
        >
          <div className="text-center mb-12">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4 gradient-heading">
              CarbonQuest Leaderboard
            </h1>
            <p className="text-lg text-muted-foreground">
              Top contributors making a positive environmental impact
            </p>
          </div>
          
          <div className="flex justify-center mb-8 space-x-2">
            {[
              { id: 'weekly', label: 'This Week' },
              { id: 'monthly', label: 'This Month' },
              { id: 'allTime', label: 'All Time' }
            ].map((period) => (
              <Button
                key={period.id}
                variant={timeFrame === period.id ? "default" : "outline"}
                onClick={() => setTimeFrame(period.id as any)}
                className={timeFrame === period.id ? "bg-carbon-600 hover:bg-carbon-500" : ""}
              >
                {period.label}
              </Button>
            ))}
          </div>
          
          {loading ? (
            <div className="py-16 text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-carbon-100 dark:bg-carbon-900/60 mb-4 animate-pulse">
                <div className="w-8 h-8 border-4 border-carbon-500 border-t-transparent rounded-full animate-spin" />
              </div>
              <p>Loading leaderboard data...</p>
            </div>
          ) : (
            <div className="glass-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left py-4 px-6">Rank</th>
                      <th className="text-left py-4 px-6">User</th>
                      <th className="text-center py-4 px-6">NFTs Earned</th>
                      <th className="text-right py-4 px-6">Carbon Impact</th>
                    </tr>
                  </thead>
                  <tbody>
                    {leaderboardData.map((entry, index) => (
                      <motion.tr
                        key={index}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        className={`border-b last:border-0 ${entry.rank <= 3 ? "bg-carbon-50/50 dark:bg-carbon-900/30" : ""}`}
                      >
                        <td className="py-4 px-6">
                          {entry.rank <= 3 ? (
                            <div className={`
                              w-8 h-8 rounded-full flex items-center justify-center font-bold text-white
                              ${entry.rank === 1 ? "bg-amber-500" : ""}
                              ${entry.rank === 2 ? "bg-gray-400" : ""}
                              ${entry.rank === 3 ? "bg-amber-700" : ""}
                            `}>
                              {entry.rank}
                            </div>
                          ) : (
                            <span>{entry.rank}</span>
                          )}
                        </td>
                        <td className="py-4 px-6">
                          <div>
                            {entry.displayName && (
                              <span className="font-medium block">{entry.displayName}</span>
                            )}
                            <span className="text-sm text-muted-foreground font-mono">
                              {formatAddress(entry.address)}
                            </span>
                          </div>
                        </td>
                        <td className="py-4 px-6 text-center">
                          <span className="inline-flex items-center justify-center bg-carbon-100 dark:bg-carbon-900/60 text-carbon-800 dark:text-carbon-100 rounded-full h-8 w-8">
                            {entry.nftCount}
                          </span>
                        </td>
                        <td className="py-4 px-6 text-right">{entry.totalImpact}</td>
                      </motion.tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
          
          <div className="mt-8 text-center">
            <p className="text-sm text-muted-foreground">
              Carbon impact is estimated based on the eco-activities verified and NFTs earned.
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
