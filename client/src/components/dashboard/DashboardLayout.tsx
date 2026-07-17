import { useState } from "react";
import { Sidebar } from "./Sidebar";
import { Outlet } from "react-router-dom";
import { motion } from "framer-motion";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Bell, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

export function DashboardLayout() {
    const [collapsed, setCollapsed] = useState(false);

    // Get user from localStorage or default to "Guest"
    const [user, setUser] = useState(() => {
        const savedName = localStorage.getItem("userName");
        return {
            displayName: savedName || "Guest",
            photoURL: "",
            initials: savedName ? savedName.substring(0, 2).toUpperCase() : "GU"
        };
    });

    return (
        <div className="min-h-screen bg-background text-foreground selection:bg-primary/30 font-inter overflow-hidden">
            {/* Gradient background - adapts to theme */}
            <div className="fixed inset-0 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-primary/5 via-background to-background pointer-events-none dark:from-[#6366F1]/5" />

            <Sidebar collapsed={collapsed} setCollapsed={setCollapsed} />

            <motion.main
                animate={{ marginLeft: collapsed ? 80 : 280 }}
                className="min-h-screen flex flex-col transition-all duration-300 relative z-10"
            >
                {/* Floating Header */}
                <header className="h-20 px-8 flex items-center justify-between sticky top-4 z-40 mx-6 mt-4 rounded-2xl glass-card">
                    <div className="flex items-center gap-6 flex-1 max-w-2xl">
                        <div className="relative w-full max-w-md hidden md:block group">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
                            <Input
                                placeholder="Search notes, flashcards, or topics..."
                                className="bg-muted/50 border-border pl-10 h-10 rounded-xl focus-visible:ring-primary focus-visible:ring-offset-0 text-sm placeholder:text-muted-foreground transition-all hover:bg-muted/70"
                            />
                        </div>
                    </div>

                    <div className="flex items-center gap-4">
                        <Button variant="ghost" size="icon" className="relative text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-full w-10 h-10">
                            <Bell className="w-5 h-5" />
                            <span className="absolute top-2 right-2 w-2 h-2 bg-primary rounded-full shadow-[0_0_8px_hsl(var(--primary))]"></span>
                        </Button>

                        <div className="h-8 w-[1px] bg-border mx-2" />

                        <div className="flex items-center gap-3 pl-2">
                            <div className="text-right hidden md:block">
                                <p className="text-sm font-bold text-foreground leading-none mb-1">{user.displayName}</p>
                                <p className="text-[10px] text-primary font-medium tracking-wider uppercase">Pro Student</p>
                            </div>
                            <Avatar className="h-9 w-9 border-2 border-primary/30 shadow-[0_0_10px_hsl(var(--primary)/0.2)]">
                                <AvatarImage src={user.photoURL || ""} />
                                <AvatarFallback className="bg-primary text-primary-foreground font-bold">{user.initials}</AvatarFallback>
                            </Avatar>
                        </div>
                    </div>
                </header>

                {/* Content */}
                <div className="flex-1 p-8 overflow-y-auto overflow-x-hidden custom-scrollbar">
                    <div className="max-w-7xl mx-auto pb-10">
                        <Outlet />
                    </div>
                </div>
            </motion.main>
        </div>
    );
}
