import { useState, useEffect } from "react";
import { Navbar } from "@/components/landing/Navbar";
import { Hero } from "@/components/landing/Hero";
import { Features } from "@/components/landing/Features";
import { HowItWorks } from "@/components/landing/HowItWorks";
import { Pricing, Showcase } from "@/components/landing/Sections";

function Landing() {
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    useEffect(() => {
        const updateMousePosition = (ev: MouseEvent) => {
            setMousePosition({ x: ev.clientX, y: ev.clientY });
        };
        window.addEventListener('mousemove', updateMousePosition);
        return () => {
            window.removeEventListener('mousemove', updateMousePosition);
        };
    }, []);

    return (
        <div className="min-h-screen bg-[#0A0A0F] text-white selection:bg-[#6366F1]/30 overflow-x-hidden font-inter relative">
            {/* 1. Interactive Cursor Spotlight */}
            <div
                className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
                style={{
                    background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.1), transparent 80%)`
                }}
            />

            {/* 2. Ambient Background Glows */}
            <div className="fixed top-0 left-0 w-full h-full overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/10 rounded-full blur-[128px]" />
                <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px]" />
            </div>

            <div className="relative z-10">
                <Navbar />
                <Hero />
                <Features />
                <HowItWorks />
                <Showcase />
                <Pricing />

                {/* Footer */}
                <footer className="py-12 border-t border-white/5 mt-20 bg-[#0A0A0F]/80 backdrop-blur-sm">
                    <div className="container mx-auto px-4 text-center">
                        <p className="text-gray-500 mb-2">© 2024 StudySpark.</p>
                        <p className="text-xs text-[#6366F1]/50">Built with Groq & Firebase</p>
                    </div>
                </footer>
            </div>
        </div>
    );
}

export default Landing;
