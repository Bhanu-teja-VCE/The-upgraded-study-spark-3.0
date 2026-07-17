import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Sparkles, Menu } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useState } from "react";

export function Navbar() {
    const [isOpen, setIsOpen] = useState(false);

    return (
        <nav className="fixed top-0 left-0 right-0 z-50 border-b border-[#6366F1]/10 bg-[#0A0A0F]/80 backdrop-blur-md">
            <div className="container mx-auto px-4 h-20 flex items-center justify-between">
                {/* Logo */}
                <Link to="/" className="flex items-center gap-3 group">
                    <div className="p-2.5 rounded-xl bg-[#6366F1]/10 group-hover:bg-[#6366F1]/20 transition-colors shadow-[0_0_15px_rgba(99, 102, 241,0.2)]">
                        <Sparkles className="w-5 h-5 text-[#6366F1]" />
                    </div>
                    <span className="font-poppins font-bold text-xl tracking-wide text-white">
                        Study<span className="text-[#6366F1]">Spark</span>
                    </span>
                </Link>

                {/* Desktop Links */}
                <div className="hidden md:flex items-center gap-8">
                    {["Features", "How It Works", "Showcase", "Pricing"].map((item) => (
                        <a
                            key={item}
                            href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                            className="text-sm font-medium text-gray-400 hover:text-white transition-colors hover:text-glow"
                        >
                            {item}
                        </a>
                    ))}

                    <div className="flex items-center gap-4 ml-4">
                        <Link to="/login">
                            <Button variant="ghost" className="text-white hover:text-[#6366F1] hover:bg-transparent font-medium">
                                Sign In
                            </Button>
                        </Link>
                        <Link to="/register">
                            <Button className="bg-[#6366F1] hover:bg-[#6366F1]/90 text-black font-semibold px-6 rounded-xl hover:shadow-[0_0_15px_rgba(99, 102, 241,0.4)] transition-all">
                                Get Started
                            </Button>
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div className="md:hidden">
                    <Sheet open={isOpen} onOpenChange={setIsOpen}>
                        <SheetTrigger asChild>
                            <Button variant="ghost" size="icon" className="text-white hover:text-[#6366F1]">
                                <Menu className="w-6 h-6" />
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="right" className="bg-[#0A0A0F] border-[#6366F1]/20 text-white">
                            <div className="flex flex-col gap-6 mt-12 px-2">
                                {["Features", "How It Works", "Showcase", "Pricing"].map((item) => (
                                    <a
                                        key={item}
                                        href={`#${item.toLowerCase().replace(/ /g, "-")}`}
                                        onClick={() => setIsOpen(false)}
                                        className="text-xl font-medium text-gray-400 hover:text-[#6366F1] transition-colors"
                                    >
                                        {item}
                                    </a>
                                ))}
                                <div className="h-px bg-white/10 my-2" />
                                <div className="flex flex-col gap-4">
                                    <Link to="/login" onClick={() => setIsOpen(false)}>
                                        <Button variant="ghost" className="w-full justify-start text-white text-lg">
                                            Sign In
                                        </Button>
                                    </Link>
                                    <Link to="/register" onClick={() => setIsOpen(false)}>
                                        <Button className="w-full h-12 bg-[#6366F1] text-black font-bold text-lg rounded-xl">
                                            Get Started
                                        </Button>
                                    </Link>
                                </div>
                            </div>
                        </SheetContent>
                    </Sheet>
                </div>
            </div>
        </nav>
    );
}
