import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { TrustBar } from "@/components/landing/TrustBar";
import { DemoTabs } from "@/components/landing/DemoTabs";
import { Newsletter } from "@/components/landing/Newsletter";
import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { motion } from "framer-motion";

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground overflow-x-hidden selection:bg-primary/30">
      <Navbar />
      
      <main>
        <Hero />
        <TrustBar />
        
        <div id="features">
          <Features />
        </div>
        
        <DemoTabs />
        
        <div className="py-24 container mx-auto px-4">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="rounded-3xl bg-gradient-to-r from-primary/20 to-secondary/20 p-1"
          >
            <div className="bg-background/90 backdrop-blur-xl rounded-[22px] p-8 md:p-16 text-center">
              <h3 className="text-3xl md:text-4xl font-bold mb-6">Ready to stop cramming?</h3>
              <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
                Join thousands of students who have already switched to smart learning. 
                Save 10+ hours per week.
              </p>
            </div>
          </motion.div>
        </div>

        <Newsletter />
      </main>

      <Footer />
    </div>
  );
}
