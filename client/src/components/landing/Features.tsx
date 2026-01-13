import { Zap, Brain, MessageSquare, Layout, Target, Share2, Trophy, FileText, Ghost } from "lucide-react";

const features = [
  {
    icon: <Brain className="w-6 h-6 text-[#00D9FF]" />,
    title: "Neural Summaries",
    description: "Transform 100-page PDFs into instant, digestible concept maps using advanced AI processing."
  },
  {
    icon: <MessageSquare className="w-6 h-6 text-[#8B5CF6]" />,
    title: "Consult Bhanu",
    description: "Chat with the 'COO of EngineOS' persona for brutal, tactical productivity advice."
  },
  {
    icon: <Target className="w-6 h-6 text-[#EF4444]" />,
    title: "Focus Mode",
    description: "Enter a gamified 'Monk Mode' with streak tracking and distraction logging."
  },
  {
    icon: <Zap className="w-6 h-6 text-[#EAB308]" />,
    title: "Flashcard Engine",
    description: "Auto-generated spaced repetition cards that adapt to your learning velocity."
  },
  {
    icon: <Layout className="w-6 h-6 text-[#EC4899]" />,
    title: "Visual Planner",
    description: "A dynamic study schedule that adjusts automatically when you miss a session."
  },
  {
    icon: <Share2 className="w-6 h-6 text-[#10B981]" />,
    title: "Cross-Platform",
    description: "Sync your 'Secondary Brain' across all devices via Firebase & Cloud FireStore."
  },
  {
    icon: <Trophy className="w-6 h-6 text-[#F59E0B]" />,
    title: "Gamified XP System",
    description: "Earn XP for every study session. Level up your 'Deep Work City' and track your rank."
  },
  {
    icon: <FileText className="w-6 h-6 text-[#3B82F6]" />,
    title: "Multi-Format Support",
    description: "Process PDFs, YouTube Transcripts (Coming Soon), and raw text into unified notes."
  },
  {
    icon: <Ghost className="w-6 h-6 text-[#6366F1]" />,
    title: "Infinite Quiz",
    description: "Test your mastery with AI-generated quizzes that find your weak spots instantly."
  }
];

export function Features() {
  return (
    <section id="features" className="py-24 relative overflow-hidden">
      <div className="container mx-auto px-4 z-10 relative">
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-black mb-4">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-gray-500">
              System Capabilities
            </span>
          </h2>
          <p className="text-gray-400 max-w-2xl mx-auto">
            Deploying military-grade study protocols to your workflow.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, i) => (
            <div key={i} className="group p-8 rounded-3xl bg-[#12121A]/50 border border-white/5 hover:border-[#00D9FF]/30 transition-all duration-300 hover:-translate-y-2">
              <div className="mb-6 bg-black/40 w-14 h-14 rounded-2xl flex items-center justify-center border border-white/5 group-hover:border-[#00D9FF]/20 transition-colors">
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold mb-3 text-white group-hover:text-[#00D9FF] transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 leading-relaxed font-light">
                {feature.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
