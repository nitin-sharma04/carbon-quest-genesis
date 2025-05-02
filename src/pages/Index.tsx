
import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Navbar } from "@/components/Navbar";
import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";

export default function Index() {
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 500], [0, 100]);
  const y2 = useTransform(scrollY, [0, 500], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0]);
  
  const [mounted, setMounted] = useState(false);
  
  useEffect(() => {
    setMounted(true);
  }, []);
  
  if (!mounted) return null;
  
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow">
        {/* Hero section */}
        <section className="relative h-[90vh] flex items-center overflow-hidden">
          <div className="absolute inset-0 eco-pattern opacity-20 z-0" />
          
          <motion.div 
            style={{ y: y1 }} 
            className="absolute -top-16 -right-16 w-[600px] h-[600px] bg-gradient-to-br from-carbon-400/20 to-carbon-600/20 rounded-full blur-3xl z-0"
          />
          <motion.div 
            style={{ y: y2 }} 
            className="absolute -bottom-16 -left-16 w-[400px] h-[400px] bg-gradient-to-tr from-carbon-300/10 to-carbon-500/10 rounded-full blur-3xl z-0"
          />
          
          <div className="container relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <span className="inline-block bg-carbon-100 dark:bg-carbon-900/60 text-carbon-800 dark:text-carbon-100 text-sm font-medium py-1 px-3 rounded-full mb-4">
                  Eco-friendly rewards on blockchain
                </span>
              </motion.div>
              
              <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="font-heading font-bold text-4xl md:text-5xl lg:text-6xl mb-6 gradient-heading"
              >
                Earn Carbon NFTs for Your Eco-Friendly Actions
              </motion.h1>
              
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                className="text-lg md:text-xl text-muted-foreground mb-8"
              >
                Join the movement to make our planet greener. Plant trees, install solar panels, 
                use electric vehicles, and get rewarded with exclusive Carbon NFTs on the Ethereum blockchain.
              </motion.p>
              
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="flex flex-col sm:flex-row justify-center gap-4"
              >
                <Button asChild size="lg" className="bg-gradient-to-r from-carbon-600 to-carbon-500 hover:from-carbon-500 hover:to-carbon-400 text-white btn-glow">
                  <Link to="/submit">Submit Activity</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link to="/dashboard">View Dashboard</Link>
                </Button>
              </motion.div>
            </div>
          </div>
          
          <motion.div 
            style={{ opacity }} 
            className="absolute bottom-8 left-0 right-0 flex justify-center"
          >
            <motion.div 
              animate={{ y: [0, 8, 0] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              <ArrowDown className="h-6 w-6 text-muted-foreground" />
            </motion.div>
          </motion.div>
        </section>
        
        {/* How it works section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 gradient-heading">
                How CarbonQuest Works
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                A simple process to reward your environmental contributions
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
              {[
                {
                  title: "Submit Your Eco Activity",
                  description: "Take eco-friendly actions like planting trees, installing solar panels, or using EVs. Submit photos and description as proof.",
                  icon: "🌱",
                },
                {
                  title: "Verification Process",
                  description: "Our team verifies your submission and approves genuine eco-contributions to ensure authenticity.",
                  icon: "✅",
                },
                {
                  title: "Receive Carbon NFTs",
                  description: "Get your unique Carbon NFT minted directly to your wallet as a recognition of your positive impact.",
                  icon: "🏆",
                }
              ].map((step, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card p-6"
                >
                  <div className="bg-carbon-100 dark:bg-carbon-900/50 h-14 w-14 rounded-full flex items-center justify-center text-2xl mb-4">
                    {step.icon}
                  </div>
                  <h3 className="font-heading font-semibold text-xl mb-2">{step.title}</h3>
                  <p className="text-muted-foreground">{step.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* Featured activities section */}
        <section className="py-16 md:py-24 bg-carbon-50/50 dark:bg-carbon-950/50">
          <div className="container">
            <div className="text-center mb-12">
              <h2 className="font-heading font-bold text-3xl md:text-4xl mb-4 gradient-heading">
                Featured Eco Activities
              </h2>
              <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
                Discover ways to earn Carbon NFTs through these eco-friendly actions
              </p>
            </div>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                {
                  title: "Tree Plantation",
                  description: "Plant trees and help increase forest cover to combat climate change",
                  image: "https://images.unsplash.com/photo-1542601906990-b4d3fb778b09?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Solar Panel Installation",
                  description: "Switch to renewable energy by installing solar panels on your property",
                  image: "https://images.unsplash.com/photo-1509391366360-2e959784a276?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Electric Vehicle Usage",
                  description: "Reduce carbon footprint by switching to electric vehicles for daily commute",
                  image: "https://images.unsplash.com/photo-1593941707882-a56bba75ce7b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                },
                {
                  title: "Waste Recycling",
                  description: "Properly segregate and recycle waste to minimize landfill impact",
                  image: "https://images.unsplash.com/photo-1532996122724-e3c354a0b15b?ixlib=rb-4.0.3&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=500&q=80"
                }
              ].map((activity, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="glass-card overflow-hidden"
                >
                  <div className="aspect-video overflow-hidden">
                    <img 
                      src={activity.image} 
                      alt={activity.title}
                      className="object-cover w-full h-full hover:scale-105 transition-transform duration-300"
                    />
                  </div>
                  <div className="p-5">
                    <h3 className="font-heading font-semibold text-xl mb-2">{activity.title}</h3>
                    <p className="text-sm text-muted-foreground">{activity.description}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
        
        {/* CTA section */}
        <section className="py-16 md:py-24">
          <div className="container">
            <div className="max-w-5xl mx-auto relative overflow-hidden rounded-2xl">
              <div className="absolute inset-0 bg-gradient-to-br from-carbon-600 to-carbon-400 opacity-90" />
              <div className="absolute inset-0 eco-pattern opacity-10" />
              
              <div className="relative z-10 py-12 md:py-16 px-6 md:px-12 text-center">
                <motion.h2 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                  viewport={{ once: true }}
                  className="font-heading font-bold text-3xl md:text-4xl mb-4 text-white"
                >
                  Ready to Make a Difference?
                </motion.h2>
                <motion.p 
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.1 }}
                  viewport={{ once: true }}
                  className="text-lg text-white/80 max-w-2xl mx-auto mb-8"
                >
                  Join CarbonQuest today and start earning recognition for your environmental contributions
                </motion.p>
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  viewport={{ once: true }}
                >
                  <Button asChild size="lg" className="bg-white text-carbon-700 hover:bg-white/90 hover:text-carbon-800">
                    <Link to="/submit">Get Started Now</Link>
                  </Button>
                </motion.div>
              </div>
            </div>
          </div>
        </section>
      </main>
      
      {/* Footer */}
      <footer className="bg-carbon-50 dark:bg-carbon-900/50 py-12">
        <div className="container">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center mb-4 md:mb-0">
              <span className="text-2xl mr-2">🌿</span>
              <span className="text-xl font-heading font-bold gradient-heading">CarbonQuest</span>
            </div>
            <div className="flex flex-wrap gap-4 justify-center">
              <Link to="/" className="text-sm text-muted-foreground hover:text-carbon-600 dark:hover:text-carbon-300">
                Home
              </Link>
              <Link to="/dashboard" className="text-sm text-muted-foreground hover:text-carbon-600 dark:hover:text-carbon-300">
                Dashboard
              </Link>
              <Link to="/submit" className="text-sm text-muted-foreground hover:text-carbon-600 dark:hover:text-carbon-300">
                Submit Activity
              </Link>
              <Link to="/about" className="text-sm text-muted-foreground hover:text-carbon-600 dark:hover:text-carbon-300">
                About
              </Link>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-carbon-200 dark:border-carbon-800 text-center text-sm text-muted-foreground">
            <p>© 2025 CarbonQuest. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
