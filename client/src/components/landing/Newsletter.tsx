import { useState } from "react";
import { motion } from "framer-motion";
import { Send, CheckCircle2, Loader2 } from "lucide-react";
import { useCreateSubscriber } from "@/hooks/use-subscribers";
import { z } from "zod";

const emailSchema = z.string().email("Please enter a valid email address");

export function Newsletter() {
  const [email, setEmail] = useState("");
  const [error, setError] = useState<string | null>(null);
  const { mutate, isPending, isSuccess } = useCreateSubscriber();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const result = emailSchema.safeParse(email);
    if (!result.success) {
      setError(result.error.errors[0].message);
      return;
    }

    mutate({ email });
  };

  return (
    <section id="waitlist" className="py-24 relative">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass-panel rounded-3xl p-10 md:p-16 border-primary/20 relative overflow-hidden"
        >
          {/* Background Glow */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-gradient-to-b from-primary/10 to-transparent pointer-events-none" />

          <h2 className="text-3xl md:text-5xl font-bold mb-6 relative z-10">
            Join the Waitlist
          </h2>
          <p className="text-muted-foreground text-lg mb-8 relative z-10">
            Be the first to experience the future of learning. Early access members get 
            <span className="text-secondary font-bold"> 3 months free</span> Pro plan.
          </p>

          <form onSubmit={handleSubmit} className="relative z-10 flex flex-col gap-4">
            <div className="relative">
              <input
                type="email"
                placeholder="Enter your email address"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isPending || isSuccess}
                className="w-full bg-black/40 border border-white/10 rounded-xl px-6 py-4 text-lg focus:outline-none focus:border-primary/50 focus:ring-1 focus:ring-primary/50 transition-all placeholder:text-muted-foreground/50 disabled:opacity-50"
              />
              {isSuccess && (
                <CheckCircle2 className="absolute right-4 top-1/2 -translate-y-1/2 text-green-500 w-6 h-6" />
              )}
            </div>
            
            {error && <p className="text-red-400 text-sm text-left px-2">{error}</p>}

            <button
              type="submit"
              disabled={isPending || isSuccess}
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 rounded-xl shadow-lg shadow-primary/20 hover:shadow-primary/40 transition-all duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isPending ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : isSuccess ? (
                "You're on the list!"
              ) : (
                <>
                  Get Early Access <Send className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </motion.div>
      </div>
    </section>
  );
}
