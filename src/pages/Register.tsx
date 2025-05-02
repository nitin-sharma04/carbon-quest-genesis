
import { Link } from "react-router-dom";
import { Navbar } from "@/components/Navbar";
import { RegisterForm } from "@/components/auth/RegisterForm";
import { motion } from "framer-motion";

export default function Register() {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      
      <main className="flex-grow container py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-md mx-auto"
        >
          <div className="text-center mb-8">
            <h1 className="font-heading font-bold text-3xl md:text-4xl mb-4 gradient-heading">
              Join CarbonQuest
            </h1>
            <p className="text-lg text-muted-foreground">
              Create an account to start your eco-friendly journey
            </p>
          </div>
          
          <div className="glass-card p-6">
            <RegisterForm />
            
            <div className="mt-6 text-center">
              <p className="text-sm text-muted-foreground">
                Already have an account?{" "}
                <Link to="/login" className="text-carbon-600 hover:underline">
                  Sign in
                </Link>
              </p>
            </div>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
