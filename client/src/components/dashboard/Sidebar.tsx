import { Link, useLocation } from "react-router-dom";
import { motion } from "framer-motion";
import {
    LayoutDashboard,
    MessageSquare,
    Settings,
    ChevronLeft,
    ChevronRight,
    LogOut,
    Sparkles,
    Layers,
    Brain,
    Calendar,
    BookOpen
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ModeToggle } from "@/components/mode-toggle";

interface SidebarProps {
    collapsed: boolean;
    setCollapsed: (v: boolean) => void;
}

const sidebarItems = [
    { icon: LayoutDashboard, label: "Dashboard", href: "/dashboard" },
    { icon: BookOpen, label: "My Notes", href: "/dashboard/notes" },
    { icon: Layers, label: "Flashcards", href: "/dashboard/flashcards" },
    { icon: Brain, label: "Practice", href: "/dashboard/quiz" },
    { icon: Calendar, label: "Planner", href: "/dashboard/planner" },
    { icon: Sparkles, label: "Focus Mode", href: "/dashboard/focus" },
    { icon: MessageSquare, label: "AI Chat", href: "/dashboard/chat" },
    { icon: Settings, label: "Settings", href: "/dashboard/settings" },
];

export function Sidebar({ collapsed, setCollapsed }: SidebarProps) {
    const location = useLocation();

    // Mock logout for UI preview
    const handleLogout = () => {
        window.location.href = "/";
    };

    const user = {
        name: localStorage.getItem("userName") || "Guest",
        initials: (localStorage.getItem("userName") || "Guest").substring(0, 2).toUpperCase()
    };

    return (
        <motion.aside
            initial={false}
            animate={{ width: collapsed ? 80 : 280 }}
            className="fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 bg-[#0A0A0F]/90 backdrop-blur-xl border-r border-[#00D9FF]/10 shadow-[4px_0_24px_rgba(0,0,0,0.4)]"
        >
            {/* Header */}
            <div className="h-24 flex items-center justify-center relative">
                <Link to="/" className="flex items-center gap-3 overflow-hidden px-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-[#00D9FF] to-[#8B5CF6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-[0_0_15px_rgba(0,217,255,0.5)]">
                        <Sparkles className="w-6 h-6 text-white fill-white" />
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-poppins font-bold text-2xl text-white whitespace-nowrap tracking-wide"
                        >
                            Study<span className="text-[#00D9FF]">Spark</span>
                        </motion.span>
                    )}
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-[#0A0A0F] border border-[#00D9FF]/30 hover:bg-[#00D9FF] hover:text-black text-[#00D9FF] transition-all shadow-lg z-50"
                    onClick={() => setCollapsed(!collapsed)}
                >
                    {collapsed ? <ChevronRight className="w-3 h-3" /> : <ChevronLeft className="w-3 h-3" />}
                </Button>
            </div>

            {/* Nav Items */}
            <nav className="flex-1 py-6 px-4 space-y-2 overflow-y-auto overflow-x-hidden custom-scrollbar">
                {sidebarItems.map((item) => {
                    const isActive = location.pathname === item.href;
                    return (
                        <Link key={item.href} to={item.href}>
                            <div
                                className={cn(
                                    "flex items-center gap-4 px-4 py-3.5 rounded-2xl transition-all duration-200 group relative overflow-hidden",
                                    isActive
                                        ? "bg-[#00D9FF]/10 text-white shadow-[0_0_20px_rgba(0,217,255,0.1)]"
                                        : "text-gray-400 hover:text-white hover:bg-white/5",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-[#00D9FF] rounded-r-full shadow-[0_0_10px_#00D9FF]" />
                                )}
                                <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-[#00D9FF]" : "group-hover:text-[#00D9FF]")} />

                                {!collapsed && (
                                    <motion.span
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        exit={{ opacity: 0 }}
                                        className="font-medium whitespace-nowrap"
                                    >
                                        {item.label}
                                    </motion.span>
                                )}
                            </div>
                        </Link>
                    );
                })}
            </nav>

            {/* Footer / Profile */}
            <div className="p-4 border-t border-[#00D9FF]/10 bg-black/20">
                {!collapsed ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                        <Avatar className="h-10 w-10 border-2 border-[#00D9FF]">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-[#00D9FF]/20 text-[#00D9FF] font-bold">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-white truncate">{user.name}</p>
                            <p className="text-xs text-[#00D9FF] truncate">Pro Plan</p>
                        </div>
                        <ModeToggle />
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-gray-400 hover:text-red-400">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 items-center">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="w-full text-gray-400 hover:text-red-400 justify-center">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
