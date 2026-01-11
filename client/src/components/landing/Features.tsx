import { motion } from "framer-motion";
import { BookOpen, BrainCircuit, Clock, Layers, Target, Wand2 } from "lucide-react";
import { cn } from "@/lib/utils";

const features = [
  {
    title: "Smart Summaries",
    description: "Condense hours of lectures into minutes of reading. Our AI captures the key concepts instantly.",
    icon: BrainCircuit,
    color: "text-primary",
    bg: "bg-primary/10",
    colSpan: "md:col-span-2",
  },
  {
    title: "Auto Flashcards",
    description: "Generate active recall decks automatically from your notes.",
    icon: Layers,
    color: "text-secondary",
    bg: "bg-secondary/10",
    colSpan: "md:col-span-1",
  },
  {
    title: "Doubt Solver",
    description: "Stuck? Ask your AI tutor for instant, context-aware explanations.",
    icon: Wand2,
    color: "text-emerald-400",
    bg: "bg-emerald-400/10",
    colSpan: "md:col-span-1",
  },
  {
    title: "Study Planner",
    description: "Get a personalized roadmap to ace your exams based on your syllabus.",
    icon: CalendarIcon,
    color: "text-orange-400",
    bg: "bg-orange-400/10",
    colSpan: "md:col-span-2",
  },
];

function CalendarIcon(props: any) {
  return <Clock {...props} />;
}

export function Features() {
  return (
    <section className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold mb-4">Supercharge Your Brain</h2>
          <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
            Everything you need to learn faster, retain more, and stress less.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -5 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className={cn(
                "glass-panel rounded-3xl p-8 hover:border-primary/30 transition-all duration-300 group relative overflow-hidden",
                feature.colSpan
              )}
            >
              <div className={cn("w-12 h-12 rounded-xl flex items-center justify-center mb-6", feature.bg)}>
                <feature.icon className={cn("w-6 h-6", feature.color)} />
              </div>
              
              <h3 className="text-2xl font-bold mb-3">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
              
              {/* Hover Glow */}
              <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-gradient-to-br from-white/5 to-white/0 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-500" />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
