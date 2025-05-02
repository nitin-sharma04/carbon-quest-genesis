
import { Navbar } from "@/components/Navbar";
import { motion } from "framer-motion";

export default function About() {
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
              About CarbonQuest
            </h1>
            <p className="text-lg text-muted-foreground">
              Our mission, vision, and how we're using blockchain to incentivize eco-friendly actions
            </p>
          </div>
          
          <div className="glass-card p-6 mb-12">
            <h2 className="font-heading font-semibold text-2xl mb-4">Our Mission</h2>
            <p className="mb-6 text-muted-foreground">
              At CarbonQuest, we're on a mission to incentivize and reward eco-friendly actions through blockchain technology. 
              We believe that by recognizing and rewarding individual environmental contributions, we can create a collective 
              impact that helps combat climate change and protect our planet for future generations.
            </p>
            
            <h2 className="font-heading font-semibold text-2xl mb-4">How It Works</h2>
            <p className="mb-4 text-muted-foreground">
              CarbonQuest uses blockchain technology to create unique Carbon NFTs (Non-Fungible Tokens) that represent 
              verified eco-friendly actions. These digital certificates of achievement are stored permanently on the 
              Ethereum blockchain, creating an immutable record of your environmental contributions.
            </p>
            <p className="mb-6 text-muted-foreground">
              Each Carbon NFT contains metadata about the specific eco-activity performed, including images, 
              description, impact metrics, and verification details. These NFTs can be collected, displayed, 
              and even traded on compatible NFT marketplaces.
            </p>
            
            <h2 className="font-heading font-semibold text-2xl mb-4">Our Technology</h2>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Smart Contracts</h3>
              <p className="text-muted-foreground">
                Our ERC-721 compliant smart contracts are built on the Ethereum blockchain (currently on Sepolia testnet) 
                and utilize industry-standard libraries from OpenZeppelin to ensure security and reliability.
              </p>
            </div>
            <div className="mb-6">
              <h3 className="font-medium text-lg mb-2">Decentralized Storage</h3>
              <p className="text-muted-foreground">
                All Carbon NFT metadata and images are stored on IPFS (InterPlanetary File System), ensuring 
                that your achievements are permanently accessible and resistant to censorship.
              </p>
            </div>
            <div>
              <h3 className="font-medium text-lg mb-2">Verification Process</h3>
              <p className="text-muted-foreground">
                Our verification team reviews all submitted eco-activities to ensure authenticity before 
                approving them for NFT minting. This human-in-the-loop process helps maintain the integrity 
                and value of Carbon NFTs.
              </p>
            </div>
          </div>
          
          <div className="glass-card p-6">
            <h2 className="font-heading font-semibold text-2xl mb-4">Contact Us</h2>
            <p className="text-muted-foreground mb-6">
              Have questions, feedback, or suggestions? We'd love to hear from you!
            </p>
            
            <div className="space-y-4">
              <div>
                <h3 className="font-medium">Email</h3>
                <p className="text-muted-foreground">contact@carbonquest.example</p>
              </div>
              <div>
                <h3 className="font-medium">Twitter</h3>
                <p className="text-muted-foreground">@CarbonQuestNFT</p>
              </div>
              <div>
                <h3 className="font-medium">Discord</h3>
                <p className="text-muted-foreground">discord.gg/carbonquest</p>
              </div>
            </div>
          </div>
        </motion.div>
      </main>
      
      {/* Footer */}
      <footer className="bg-carbon-50 dark:bg-carbon-900/50 py-8">
        <div className="container text-center text-sm text-muted-foreground">
          <p>© 2025 CarbonQuest. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
}
