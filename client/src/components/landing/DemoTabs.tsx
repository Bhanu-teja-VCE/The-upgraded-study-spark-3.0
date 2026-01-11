import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FileText, Layers, MessageSquare } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { id: "summary", label: "Summary", icon: FileText },
  { id: "flashcards", label: "Flashcards", icon: Layers },
  { id: "chat", label: "AI Tutor", icon: MessageSquare },
];

export function DemoTabs() {
  const [activeTab, setActiveTab] = useState("summary");

  return (
    <section id="demo" className="py-24 bg-black/20">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-4xl font-bold">See It In Action</h2>
        </div>

        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-8 gap-2">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "px-6 py-3 rounded-full flex items-center gap-2 font-medium transition-all duration-200",
                  activeTab === tab.id 
                    ? "bg-primary text-primary-foreground shadow-lg shadow-primary/20" 
                    : "bg-white/5 hover:bg-white/10 text-muted-foreground"
                )}
              >
                <tab.icon className="w-4 h-4" />
                {tab.label}
              </button>
            ))}
          </div>

          <div className="relative h-[400px] md:h-[500px] glass-panel rounded-3xl border border-white/10 overflow-hidden shadow-2xl shadow-primary/5">
            <AnimatePresence mode="wait">
              {activeTab === "summary" && (
                <motion.div
                  key="summary"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full flex flex-col"
                >
                  <div className="w-full h-4 bg-white/10 rounded mb-4 w-3/4 animate-pulse" />
                  <div className="w-full h-4 bg-white/10 rounded mb-4 animate-pulse delay-75" />
                  <div className="w-full h-4 bg-white/10 rounded mb-4 w-5/6 animate-pulse delay-100" />
                  <div className="mt-8 p-6 rounded-2xl bg-black/20 border border-white/5">
                    <h4 className="text-primary font-bold mb-2 flex items-center gap-2">
                      <FileText className="w-4 h-4" /> AI Summary
                    </h4>
                    <p className="text-sm text-gray-300 leading-relaxed">
                      Photosynthesis is the process by which green plants and some other organisms use sunlight to synthesize foods with the aid of chlorophyll. The process involves the conversion of light energy into chemical energy...
                    </p>
                  </div>
                </motion.div>
              )}

              {activeTab === "flashcards" && (
                <motion.div
                  key="flashcards"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full flex items-center justify-center"
                >
                  <div className="w-full max-w-sm aspect-[3/2] bg-gradient-to-br from-secondary/20 to-primary/20 rounded-2xl border border-white/10 flex items-center justify-center p-8 text-center cursor-pointer hover:scale-105 transition-transform duration-300">
                    <div>
                      <h3 className="text-xl font-bold mb-2">What is the powerhouse of the cell?</h3>
                      <p className="text-sm text-muted-foreground">(Hover to flip)</p>
                    </div>
                  </div>
                </motion.div>
              )}

              {activeTab === "chat" && (
                <motion.div
                  key="chat"
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="p-8 h-full flex flex-col justify-end"
                >
                  <div className="space-y-4 mb-4">
                    <div className="flex justify-end">
                      <div className="bg-primary/20 text-primary-foreground px-4 py-2 rounded-2xl rounded-tr-sm max-w-[80%]">
                        Can you explain quantum entanglement simply?
                      </div>
                    </div>
                    <div className="flex justify-start">
                      <div className="bg-white/10 text-foreground px-4 py-2 rounded-2xl rounded-tl-sm max-w-[80%]">
                        Imagine two magic coins. No matter how far apart they are, if one lands on heads, the other instantly lands on tails. They are linked!
                      </div>
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <input 
                      type="text" 
                      placeholder="Ask anything..." 
                      className="flex-1 bg-black/30 border border-white/10 rounded-xl px-4 py-3 focus:outline-none focus:border-primary/50"
                      disabled
                    />
                    <button className="bg-primary p-3 rounded-xl">
                      <MessageSquare className="w-5 h-5 text-white" />
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
