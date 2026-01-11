import { motion } from "framer-motion";

const stats = [
  "10,000+ Students Learning",
  "•",
  "500k+ Flashcards Generated",
  "•",
  "98% Exam Success Rate",
  "•",
  "Trusted by Ivy League Students",
  "•",
];

// Duplicate for seamless loop
const marqueeContent = [...stats, ...stats, ...stats];

export function TrustBar() {
  return (
    <div className="w-full bg-white/5 border-y border-white/5 py-4 overflow-hidden relative">
      <div className="absolute inset-y-0 left-0 w-20 bg-gradient-to-r from-background to-transparent z-10" />
      <div className="absolute inset-y-0 right-0 w-20 bg-gradient-to-l from-background to-transparent z-10" />
      
      <motion.div
        className="flex whitespace-nowrap gap-8 text-sm md:text-base font-medium text-muted-foreground"
        animate={{ x: ["0%", "-50%"] }}
        transition={{ duration: 20, repeat: Infinity, ease: "linear" }}
      >
        {marqueeContent.map((item, index) => (
          <span key={index} className="flex-shrink-0">
            {item}
          </span>
        ))}
      </motion.div>
    </div>
  );
}
