import { motion } from "framer-motion";
import { Search, Plus, FileText, Calendar, MoreVertical, Clock } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useRef, useState } from "react";

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

interface Note {
    id: number;
    title: string;
    preview: string;
    date: string;
    size: string;
    type: string;
}

export function Notes() {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [notes, setNotes] = useState<Note[]>(() => {
        const saved = localStorage.getItem("userNotes");
        return saved ? JSON.parse(saved) : [];
    });

    const handleUploadClick = () => {
        fileInputRef.current?.click();
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            // Simulate upload
            const newNote = {
                id: Date.now(),
                title: file.name,
                preview: "Processing new file...",
                date: "Just now",
                size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
                type: file.name.split(".").pop()?.toUpperCase() || "FILE"
            };
            const updatedNotes = [newNote, ...notes];
            setNotes(updatedNotes);
            localStorage.setItem("userNotes", JSON.stringify(updatedNotes));
        }
    };

    return (
        <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="space-y-8"
        >
            <input
                type="file"
                ref={fileInputRef}
                className="hidden"
                onChange={handleFileChange}
                accept=".pdf,.docx,.txt"
            />

            {/* Header */}
            <motion.div variants={item} className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                <div>
                    <h1 className="text-4xl font-bold text-white mb-2 font-poppins text-glow">My Notes</h1>
                    <p className="text-gray-400">Manage and organize your study materials.</p>
                </div>
                <Button
                    onClick={handleUploadClick}
                    className="bg-[#6366F1] text-black hover:bg-[#6366F1]/90 font-bold rounded-xl shadow-[0_0_20px_rgba(99, 102, 241,0.3)] hover:shadow-[0_0_30px_rgba(99, 102, 241,0.5)] transition-all"
                >
                    <Plus className="w-5 h-5 mr-2" />
                    Upload New Note
                </Button>
            </motion.div>

            {/* Search and Filters */}
            <motion.div variants={item} className="flex gap-4">
                <div className="relative flex-1 max-w-md">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                    <Input
                        placeholder="Search notes..."
                        className="pl-10 bg-[#0A0A0F]/50 border-[#6366F1]/20 focus:border-[#6366F1] text-white rounded-xl h-12"
                    />
                </div>
            </motion.div>

            {/* Notes Grid */}
            <motion.div variants={item} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {notes.map((note) => (
                    <div key={note.id} className="group p-6 rounded-3xl bg-[#0A0A0F]/50 border border-white/5 hover:border-[#6366F1]/30 transition-all duration-300 hover:shadow-[0_0_30px_rgba(0,0,0,0.5)] relative overflow-hidden">
                        <div className="absolute inset-0 bg-gradient-to-br from-[#6366F1]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                        <div className="relative z-10">
                            <div className="flex justify-between items-start mb-4">
                                <div className="p-3 rounded-2xl bg-[#6366F1]/10 text-[#6366F1]">
                                    <FileText className="w-6 h-6" />
                                </div>
                                <Button variant="ghost" size="icon" className="text-gray-400 hover:text-white hover:bg-white/5 rounded-full">
                                    <MoreVertical className="w-4 h-4" />
                                </Button>
                            </div>

                            <h3 className="text-xl font-bold text-white mb-2 line-clamp-1 group-hover:text-[#6366F1] transition-colors">{note.title}</h3>
                            <p className="text-gray-400 text-sm mb-6 line-clamp-2">{note.preview}</p>

                            <div className="flex items-center justify-between text-xs text-gray-500 border-t border-white/5 pt-4">
                                <div className="flex items-center gap-2">
                                    <Clock className="w-3 h-3" />
                                    {note.date}
                                </div>
                                <span className="px-2 py-1 rounded-md bg-white/5 text-gray-300 font-mono">
                                    {note.type} • {note.size}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}

                {/* Add New Placeholder Card */}
                <button
                    onClick={handleUploadClick}
                    className="flex flex-col items-center justify-center p-6 rounded-3xl border-2 border-dashed border-white/10 hover:border-[#6366F1]/50 bg-white/5 hover:bg-[#6366F1]/5 transition-all duration-300 group h-full min-h-[240px]"
                >
                    <div className="w-16 h-16 rounded-full bg-[#6366F1]/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                        <Plus className="w-8 h-8 text-[#6366F1]" />
                    </div>
                    <p className="text-lg font-bold text-white group-hover:text-[#6366F1] transition-colors">Start New Note</p>
                    <p className="text-sm text-gray-500 mt-2">Upload PDF, DOCX, or Image</p>
                </button>
            </motion.div>
        </motion.div>
    );
}
