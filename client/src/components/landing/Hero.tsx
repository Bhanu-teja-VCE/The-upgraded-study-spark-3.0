import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { CyberButton } from "../ui/CyberButton";
import { NeuralSphere } from "./NeuralSphere";
import { ArrowRight, Play } from "lucide-react";

export function Hero() {
    return (
        <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">

            {/* Background Sphere */}
            <div className="absolute inset-0 z-0 opacity-60">
                <NeuralSphere />
            </div>

            {/* Content */}
            <div className="container mx-auto px-4 z-10 relative text-center">
                <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.8, ease: "easeOut" }}
                    className="max-w-4xl mx-auto"
                >
                    <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#00D9FF]/10 border border-[#00D9FF]/20 text-[#00D9FF] text-xs font-bold uppercase tracking-widest mb-6 backdrop-blur-md">
                        <span className="w-2 h-2 rounded-full bg-[#00D9FF] animate-pulse" />
                        System Online v4.0
                    </div>

                    <h1 className="text-6xl md:text-8xl font-black tracking-tighter mb-8 leading-tight">
                        <span className="bg-clip-text text-transparent bg-gradient-to-br from-white via-white to-gray-500">
                            The Ultimate
                        </span>
                        <br />
                        <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00D9FF] to-[#8B5CF6] animate-gradient-x">
                            Study Spark
                        </span>
                    </h1>

                    <p className="text-xl md:text-2xl text-gray-400 mb-10 max-w-2xl mx-auto leading-relaxed">
                        Ignite your potential with the AI-powered nervous system for your academic life.
                    </p>

                    <div className="flex flex-col md:flex-row items-center justify-center gap-6">
                        <Link to="/register">
                            <CyberButton className="h-14 px-8 text-lg group">
                                Initialize Protocol
                                <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                            </CyberButton>
                        </Link>

                        <button className="flex items-center gap-3 text-gray-400 hover:text-white transition-colors group px-6 py-4 rounded-xl hover:bg-white/5">
                            <div className="w-10 h-10 rounded-full bg-white/10 flex items-center justify-center group-hover:scale-110 transition-transform">
                                <Play className="w-4 h-4 fill-current" />
                            </div>
                            <span className="font-medium">Watch Demo</span>
                        </button>
                    </div>
                </motion.div>
            </div>

            {/* Decorative Gradient Floor */}
            <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-[#0A0A0F] to-transparent pointer-events-none z-10" />
        </section>
    );
}
