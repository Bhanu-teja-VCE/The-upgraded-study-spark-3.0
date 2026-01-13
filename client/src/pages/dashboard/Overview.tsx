import { motion } from "framer-motion";
import {
    Flame,
    FileText,
    Layers,
    Clock,
    Upload,
    MessageSquare,
    MonitorPlay,
    HelpCircle,
    CheckCircle2,
    ArrowUpRight
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const container = {
    hidden: { opacity: 0 },
    show: {
        opacity: 1,
        transition: {
            staggerChildren: 0.1
        }
    }
};

const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 }
};

export default function DashboardOverview() {
    const userName = localStorage.getItem("userName") || "Guest";

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            {/* Welcome Section */}
            <motion.div variants={item} className="flex justify-between items-end">
                <div>
                    <h1 className="text-4xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400 mb-2">
                        Welcome back, {userName.split(' ')[0]}! 👋
                    </h1>
                    <p className="text-gray-400 text-lg">
                        Let's make today productive. You have <span className="text-[#00D9FF]">4 tasks</span> due soon.
                    </p>
                </div>
                <div className="hidden md:block text-right">
                    <p className="text-sm text-gray-500 font-mono">CURRENT SESSION</p>
                    <p className="text-2xl font-mono text-[#00D9FF] animate-pulse">00:00</p>
                </div>
            </motion.div>

            {/* Stats Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard
                    icon={Flame}
                    value="0"
                    label="Day Streak"
                    color="text-orange-500"
                    bg="bg-orange-500/10"
                    border="border-orange-500/20"
                />
                <StatCard
                    icon={FileText}
                    value="0"
                    label="Notes Summarized"
                    color="text-blue-400"
                    bg="bg-blue-400/10"
                    border="border-blue-400/20"
                />
                <StatCard
                    icon={Layers}
                    value="0"
                    label="Cards Reviewed"
                    color="text-purple-400"
                    bg="bg-purple-400/10"
                    border="border-purple-400/20"
                />
                <StatCard
                    icon={Clock}
                    value="0h"
                    label="Study Hours"
                    color="text-[#00D9FF]"
                    bg="bg-[#00D9FF]/10"
                    border="border-[#00D9FF]/20"
                />
            </motion.div>

            {/* Quick Actions & Activity Layout */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Left Column (Actions + Tasks) */}
                <motion.div variants={item} className="lg:col-span-2 space-y-8">
                    {/* Quick Actions */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#00D9FF] rounded-full"></span>
                            Quick Actions
                        </h2>
                        <div className="grid grid-cols-2 gap-4">
                            <ActionCard
                                icon={Upload}
                                title="Upload Notes"
                                desc="Summarize & Analyze"
                                primary
                                href="/dashboard/notes"
                            />
                            <ActionCard
                                icon={MessageSquare}
                                title="Start AI Chat"
                                desc="Ask Doubt Assistant"
                                href="/dashboard/chat"
                            />
                            <ActionCard
                                icon={Layers}
                                title="Create Deck"
                                desc="Generate Flashcards"
                                href="/dashboard/flashcards"
                            />
                            <ActionCard
                                icon={HelpCircle}
                                title="Practice Quiz"
                                desc="Test Your Knowledge"
                                href="/dashboard/quiz"
                            />
                        </div>
                    </section>

                    {/* Upcoming Tasks */}
                    <section>
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-[#8B5CF6] rounded-full"></span>
                            Coming Up
                        </h2>
                        <div className="glass-card p-8 space-y-2 rounded-2xl text-center">
                            <CheckCircle2 className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                            <p className="text-gray-400 font-medium">No active tasks</p>
                            <p className="text-sm text-gray-600">Tasks from your planner will appear here.</p>
                            <Link to="/dashboard/planner">
                                <Button variant="ghost" className="text-[#00D9FF] mt-2 underline">Go to Planner</Button>
                            </Link>
                        </div>
                    </section>
                </motion.div>

                {/* Right Column (Recent Activity) */}
                <motion.div variants={item} className="space-y-8">
                    <section className="h-full">
                        <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                            <span className="w-1 h-6 bg-pink-500 rounded-full"></span>
                            Recent Activity
                        </h2>
                        <div className="glass-card p-6 h-full min-h-[400px] rounded-2xl relative overflow-hidden flex flex-col items-center justify-center text-center">
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9FF]/5 rounded-full blur-3xl -z-10" />

                            <div className="relative z-10">
                                <Clock className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                                <p className="text-gray-400 font-medium mb-1">No recent activity</p>
                                <p className="text-sm text-gray-600 mb-6">Your study history will show up here.</p>

                                <Link to="/dashboard/notes">
                                    <Button className="bg-white/5 hover:bg-white/10 text-white border border-white/5">
                                        Start Studying
                                    </Button>
                                </Link>
                            </div>
                        </div>
                    </section>
                </motion.div>
            </div>
        </motion.div>
    );
}

function StatCard({ icon: Icon, value, label, color, bg, border }: any) {
    return (
        <Card className={`glass-card border-none relative overflow-hidden group hover:-translate-y-1 transition-transform duration-300`}>
            <div className={`absolute top-0 right-0 p-3 opacity-10 group-hover:opacity-20 transition-opacity ${color}`}>
                <Icon className="w-16 h-16" />
            </div>
            <CardContent className="p-6">
                <div className={`w-10 h-10 rounded-lg ${bg} flex items-center justify-center mb-4 ${color} ring-1 ring-inset ${border}`}>
                    <Icon className="w-5 h-5" />
                </div>
                <div>
                    <h3 className="text-3xl font-bold text-white mb-1 tracking-tight">{value}</h3>
                    <p className="text-sm text-gray-400 font-medium">{label}</p>
                </div>
            </CardContent>
        </Card>
    );
}

import { Link } from "react-router-dom";

function ActionCard({ icon: Icon, title, desc, primary, href }: any) {
    const Content = (
        <div className={cn(
            "text-left p-6 rounded-2xl border transition-all duration-300 relative overflow-hidden group hover:shadow-[0_0_20px_rgba(0,217,255,0.15)] h-full w-full block",
            primary
                ? "bg-gradient-to-br from-[#00D9FF]/20 to-[#8B5CF6]/20 border-[#00D9FF]/30 hover:border-[#00D9FF]"
                : "bg-white/5 border-white/5 hover:bg-white/10 hover:border-white/20"
        )}>
            {primary && <div className="absolute inset-0 bg-[#00D9FF]/5 group-hover:bg-[#00D9FF]/10 transition-colors" />}

            <div className={cn(
                "w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110",
                primary ? "bg-[#00D9FF] text-black shadow-lg shadow-[#00D9FF]/30" : "bg-white/10 text-white"
            )}>
                <Icon className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1 group-hover:text-glow transition-all">{title}</h3>
            <p className={cn("text-sm", primary ? "text-[#00D9FF]" : "text-gray-400")}>{desc}</p>

            <ArrowUpRight className="absolute top-4 right-4 w-5 h-5 text-gray-500 opacity-0 group-hover:opacity-100 group-hover:translate-x-1 -translate-y-1 transition-all" />
        </div>
    );

    return (
        <Link to={href} className="block h-full">
            {Content}
        </Link>
    );
}

function TaskItem({ title, time, tag, color }: any) {
    return (
        <div className="flex items-center gap-4 p-3 rounded-xl hover:bg-white/5 transition-colors cursor-pointer group">
            <div className="w-5 h-5 rounded-full border-2 border-white/20 group-hover:border-[#00D9FF] transition-colors flex items-center justify-center">
                <div className="w-2.5 h-2.5 rounded-full bg-[#00D9FF] opacity-0 group-hover:opacity-100 transition-opacity" />
            </div>
            <div className="flex-1">
                <h4 className="font-medium text-white group-hover:text-[#00D9FF] transition-colors">{title}</h4>
                <p className="text-xs text-gray-500">{time}</p>
            </div>
            <span className="flex items-center gap-1.5 text-xs font-medium bg-white/5 px-2.5 py-1 rounded-md border border-white/5">
                <span className={`w-1.5 h-1.5 rounded-full ${color}`} />
                {tag}
            </span>
        </div>
    );
}

function ActivityItem({ icon: Icon, title, action, time, accent }: any) {
    return (
        <div className="flex items-center gap-4 group cursor-pointer">
            <div className={cn("w-10 h-10 rounded-full flex items-center justify-center bg-white/5 border border-white/10 group-hover:border-[#00D9FF]/30 transition-colors", accent)}>
                <Icon className="w-5 h-5" />
            </div>
            <div className="flex-1">
                <p className="text-sm text-white font-medium group-hover:text-[#00D9FF] transition-colors">{title}</p>
                <p className="text-xs text-gray-500">{action} • {time}</p>
            </div>
        </div>
    );
}
