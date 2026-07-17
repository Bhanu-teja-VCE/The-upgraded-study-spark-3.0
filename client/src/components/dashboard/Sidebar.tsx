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
            className="fixed left-0 top-0 h-screen z-50 flex flex-col transition-all duration-300 bg-card/80 backdrop-blur-xl border-r border-border shadow-lg dark:bg-[#0A0A0F]/90 dark:border-primary/10 dark:shadow-[4px_0_24px_rgba(0,0,0,0.4)]"
        >
            {/* Header */}
            <div className="h-24 flex items-center justify-center relative">
                <Link to="/" className="flex items-center gap-3 overflow-hidden px-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-primary to-[#8B5CF6] rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg dark:shadow-[0_0_15px_rgba(99, 102, 241,0.5)]">
                        <Sparkles className="w-6 h-6 text-white fill-white" />
                    </div>
                    {!collapsed && (
                        <motion.span
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="font-poppins font-bold text-2xl text-foreground whitespace-nowrap tracking-wide"
                        >
                            Study<span className="text-primary">Spark</span>
                        </motion.span>
                    )}
                </Link>

                <Button
                    variant="ghost"
                    size="icon"
                    className="absolute -right-3 top-1/2 -translate-y-1/2 w-6 h-6 rounded-full bg-card border border-border hover:bg-primary hover:text-primary-foreground text-primary transition-all shadow-lg z-50 dark:bg-[#0A0A0F] dark:border-primary/30"
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
                                        ? "bg-primary/10 text-foreground shadow-sm dark:shadow-[0_0_20px_rgba(99, 102, 241,0.1)]"
                                        : "text-muted-foreground hover:text-foreground hover:bg-muted/50",
                                    collapsed && "justify-center px-0"
                                )}
                            >
                                {isActive && (
                                    <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-primary rounded-r-full dark:shadow-[0_0_10px_hsl(var(--primary))]" />
                                )}
                                <item.icon className={cn("w-5 h-5 flex-shrink-0 transition-colors", isActive ? "text-primary" : "group-hover:text-primary")} />

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
            <div className="p-4 border-t border-border bg-muted/30 dark:bg-black/20 dark:border-primary/10">
                {!collapsed ? (
                    <div className="flex items-center gap-3 p-3 rounded-xl bg-muted/50 border border-border dark:bg-white/5 dark:border-white/5">
                        <Avatar className="h-10 w-10 border-2 border-primary">
                            <AvatarImage src="" />
                            <AvatarFallback className="bg-primary/20 text-primary font-bold">{user.initials}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1 overflow-hidden">
                            <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                            <p className="text-xs text-primary truncate">Pro Plan</p>
                        </div>
                        <ModeToggle />
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="text-muted-foreground hover:text-destructive">
                            <LogOut className="w-4 h-4" />
                        </Button>
                    </div>
                ) : (
                    <div className="flex flex-col gap-2 items-center">
                        <ModeToggle />
                        <Button variant="ghost" size="icon" onClick={handleLogout} className="w-full text-muted-foreground hover:text-destructive justify-center">
                            <LogOut className="w-5 h-5" />
                        </Button>
                    </div>
                )}
            </div>
        </motion.aside>
    );
}
