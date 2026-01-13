import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import React from "react";

interface CyberButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary";
  children: React.ReactNode;
}

export const CyberButton = React.forwardRef<HTMLButtonElement, CyberButtonProps>(
  ({ className, variant = "primary", children, ...props }, ref) => {
    return (
      <Button
        ref={ref}
        className={cn(
          "relative overflow-hidden font-bold transition-all duration-300",
          variant === "primary"
            ? "bg-[#00D9FF] text-black hover:bg-[#00D9FF] hover:shadow-[0_0_30px_rgba(0,217,255,0.4)]"
            : "bg-transparent border border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10",
          className
        )}
        {...props}
      >
        <span className="relative z-10 flex items-center">{children}</span>
        {variant === "primary" && (
          <div className="absolute inset-0 bg-white/20 translate-y-full hover:translate-y-0 transition-transform duration-300" />
        )}
      </Button>
    );
  }
);
CyberButton.displayName = "CyberButton";
