import { ArrowRight } from "lucide-react";

export function HowItWorks() {
    return (
        <section id="how-it-works" className="py-24 bg-[#0A0A0F] relative">
            <div className="container mx-auto px-4">
                <div className="text-center mb-16">
                    <h2 className="text-4xl md:text-5xl font-black mb-4 text-white">
                        Execution Protocal
                    </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 relative">
                    {/* Connecting Line (Mobile overlap hidden) */}
                    <div className="hidden md:block absolute top-12 left-[16%] right-[16%] h-px bg-gradient-to-r from-transparent via-[#00D9FF]/30 to-transparent border-t border-dashed border-[#00D9FF]/30 z-0" />

                    {[
                        { step: "01", title: "Upload Data", desc: "Drop your PDFs, lectures, or notes into the Engine." },
                        { step: "02", title: "Neural Processing", desc: "AI extracts key concepts, generates quizzes, and builds a schedule." },
                        { step: "03", title: "Deep Work", desc: "Enter Focus Mode. Execute tasks. Track velocity." }
                    ].map((item, i) => (
                        <div key={i} className="relative z-10 flex flex-col items-center text-center">
                            <div className="w-24 h-24 rounded-full bg-[#0A0A0F] border-4 border-[#12121A] flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(0,0,0,0.5)]">
                                <span className="text-3xl font-black text-[#00D9FF]">{item.step}</span>
                            </div>
                            <h3 className="text-2xl font-bold text-white mb-2">{item.title}</h3>
                            <p className="text-gray-400 max-w-xs">{item.desc}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
