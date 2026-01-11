import { motion, HTMLMotionProps } from "framer-motion";
import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface CyberButtonProps extends HTMLMotionProps<"button"> {
  children: ReactNode;
  variant?: "primary" | "secondary" | "outline";
  className?: string;
}

export function CyberButton({ children, variant = "primary", className, ...props }: CyberButtonProps) {
  const baseStyles = "relative px-8 py-4 rounded-xl font-bold text-lg overflow-hidden group transition-all duration-300";
  
  const variants = {
    primary: "bg-primary text-primary-foreground shadow-[0_0_20px_rgba(14,165,233,0.3)] hover:shadow-[0_0_30px_rgba(14,165,233,0.5)] border border-primary/50",
    secondary: "bg-secondary text-secondary-foreground shadow-[0_0_20px_rgba(139,92,246,0.3)] hover:shadow-[0_0_30px_rgba(139,92,246,0.5)] border border-secondary/50",
    outline: "bg-transparent border-2 border-primary/30 text-primary hover:bg-primary/10 hover:border-primary/60",
  };

  return (
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      className={cn(baseStyles, variants[variant], className)}
      {...props}
    >
      <span className="relative z-10 flex items-center justify-center gap-2">
        {children}
      </span>
      
      {/* Glow Effect Overlay */}
      <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent translate-x-[-100%] group-hover:translate-x-[100%] transition-transform duration-700 ease-in-out z-0" />
    </motion.button>
  );
}
