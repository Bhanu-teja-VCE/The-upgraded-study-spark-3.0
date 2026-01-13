import { useState, useRef, useEffect } from "react";
import { Document, Page, pdfjs } from "react-pdf";
import { Send, Upload, Loader2, ZoomIn, ZoomOut, ChevronLeft, ChevronRight, Sparkles, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { chatWithNote } from "@/lib/groq";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

// Configure PDF Worker - critical for react-pdf
pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    'pdfjs-dist/build/pdf.worker.min.mjs',
    import.meta.url,
).toString();

interface Message {
    role: "user" | "system" | "assistant";
    content: string;
}

export function Chat() {
    const [file, setFile] = useState<File | null>(null);
    const [numPages, setNumPages] = useState<number>(0);
    const [pageNumber, setPageNumber] = useState(1);
    const [scale, setScale] = useState(1.0);
    const [messages, setMessages] = useState<Message[]>([
        { role: "assistant", content: "Hi! Upload a PDF to get started. I can summarize it or answer any questions." }
    ]);
    const [input, setInput] = useState("");
    const [isLoading, setIsLoading] = useState(false);
    const scrollRef = useRef<HTMLDivElement>(null);

    function onFileChange(event: React.ChangeEvent<HTMLInputElement>) {
        const { files } = event.target;
        if (files && files[0]) {
            setFile(files[0]);
            setMessages([{ role: "assistant", content: `I've loaded ${files[0].name}. What would you like to know?` }]);
        }
    }

    function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
        setNumPages(numPages);
    }

    const handleSend = async (manualInput?: string) => {
        const messageContent = manualInput || input;
        if (!messageContent.trim()) return;

        const userMsg = { role: "user" as const, content: messageContent };
        setMessages(prev => [...prev, userMsg]);
        if (!manualInput) setInput("");
        setIsLoading(true);

        try {
            const context = file ? `Current Document: ${file.name}` : "No document loaded.";
            const history = [...messages, userMsg].map(m => ({ role: m.role, content: m.content }));

            const response = await chatWithNote(history, context);

            setMessages(prev => [...prev, { role: "assistant", content: response || "I couldn't process that request." }]);
        } catch (error) {
            console.error(error);
            setMessages(prev => [...prev, { role: "assistant", content: "Error communicating with AI." }]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSummarize = () => {
        handleSend("Please provide a concise summary of this document, highlighting the key points and main takeaways.");
    };

    // Scroll to bottom
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollIntoView({ behavior: "smooth" });
        }
    }, [messages]);

    return (
        <div className="flex flex-col lg:flex-row h-[calc(100vh-8rem)] gap-6">
            {/* Left Panel: PDF Viewer */}
            <div className="flex-1 glass-card p-1 flex flex-col overflow-hidden relative min-w-[50%] rounded-3xl border-transparent">
                <div className="absolute top-4 right-4 z-10 flex gap-2">
                    <Button size="icon" className="bg-black/50 hover:bg-[#00D9FF] hover:text-black text-white backdrop-blur-md border border-white/10" onClick={() => setScale(s => s + 0.1)}><ZoomIn className="w-4 h-4" /></Button>
                    <Button size="icon" className="bg-black/50 hover:bg-[#00D9FF] hover:text-black text-white backdrop-blur-md border border-white/10" onClick={() => setScale(s => Math.max(0.5, s - 0.1))}><ZoomOut className="w-4 h-4" /></Button>
                </div>

                {!file ? (
                    <div className="h-full flex flex-col items-center justify-center border-2 border-dashed border-[#00D9FF]/20 rounded-3xl bg-[#0A0A0F]/50 hover:bg-[#0A0A0F]/70 transition-colors group">
                        <Input
                            type="file"
                            accept=".pdf"
                            onChange={onFileChange}
                            className="hidden"
                            id="file-upload"
                        />
                        <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center">
                            <div className="w-20 h-20 rounded-full bg-[#00D9FF]/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                                <Upload className="w-8 h-8 text-[#00D9FF]" />
                            </div>
                            <span className="text-xl font-bold text-white mb-2">Upload Study Material</span>
                            <span className="text-sm text-gray-400">PDF, DOCX up to 10MB</span>
                        </label>
                    </div>
                ) : (
                    <ScrollArea className="flex-1 h-full w-full rounded-2xl bg-[#0A0A0F]/80 flex justify-center p-4">
                        <Document
                            file={file}
                            onLoadSuccess={onDocumentLoadSuccess}
                            className="flex flex-col items-center"
                            loading={<div className="text-[#00D9FF] flex items-center gap-2"><Loader2 className="animate-spin" /> Loading PDF...</div>}
                            error={<div className="text-red-400">Failed to load PDF.</div>}
                        >
                            <Page
                                pageNumber={pageNumber}
                                scale={scale}
                                renderTextLayer={false}
                                renderAnnotationLayer={false}
                                className="shadow-2xl mb-4 rounded-lg overflow-hidden"
                            />
                        </Document>
                    </ScrollArea>
                )}

                {/* PDF Controls */}
                {file && (
                    <div className="flex items-center justify-between mt-4 px-6 py-3 bg-[#0A0A0F]/80 backdrop-blur-md rounded-2xl border border-white/5 mx-4 mb-4">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPageNumber(p => Math.max(1, p - 1))}
                            disabled={pageNumber <= 1}
                            className="text-white hover:text-[#00D9FF]"
                        >
                            <ChevronLeft className="w-4 h-4 mr-1" /> Previous
                        </Button>
                        <span className="text-sm font-mono text-[#00D9FF]">
                            Page {pageNumber} of {numPages}
                        </span>
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => setPageNumber(p => Math.min(numPages, p + 1))}
                            disabled={pageNumber >= numPages}
                            className="text-white hover:text-[#00D9FF]"
                        >
                            Next <ChevronRight className="w-4 h-4 ml-1" />
                        </Button>
                    </div>
                )}
            </div>

            {/* Right Panel: Chat Interface */}
            <div className="w-full lg:w-[450px] flex flex-col glass-card h-full rounded-3xl border-[#00D9FF]/10 overflow-hidden">
                {/* Chat Header */}
                <div className="p-4 border-b border-white/5 flex justify-between items-center bg-[#0A0A0F]/50 backdrop-blur-md">
                    <h3 className="font-bold text-white flex items-center gap-2">
                        <div className="w-2 h-2 bg-[#00D9FF] rounded-full shadow-[0_0_10px_#00D9FF]"></div>
                        AI Assistant
                    </h3>
                    {file && (
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={handleSummarize}
                            disabled={isLoading}
                            className="text-xs h-8 border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-black transition-all shadow-[0_0_10px_rgba(0,217,255,0.1)] rounded-lg"
                        >
                            <FileText className="w-3 h-3 mr-1.5" />
                            Summarize
                        </Button>
                    )}
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4 bg-[#0A0A0F]/30">
                    <div className="space-y-6">
                        {messages.map((msg, index) => (
                            <motion.div
                                key={index}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                className={cn(
                                    "flex w-full",
                                    msg.role === "user" ? "justify-end" : "justify-start"
                                )}
                            >
                                <div className={cn(
                                    "max-w-[85%] rounded-2xl p-4 text-sm leading-relaxed shadow-lg backdrop-blur-sm",
                                    msg.role === "user"
                                        ? "bg-[#00D9FF] text-black rounded-tr-none shadow-[0_4px_14px_rgba(0,217,255,0.3)] font-medium"
                                        : "bg-white/5 text-gray-100 rounded-tl-none border border-white/5"
                                )}>
                                    {msg.content}
                                </div>
                            </motion.div>
                        ))}
                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-white/5 rounded-2xl rounded-tl-none p-4 border border-white/5 flex items-center gap-3">
                                    <Loader2 className="w-5 h-5 animate-spin text-[#00D9FF]" />
                                    <span className="text-sm text-gray-400 animate-pulse">Analyzing document...</span>
                                </div>
                            </div>
                        )}
                        <div ref={scrollRef} />
                    </div>
                </ScrollArea>

                {/* Input */}
                <div className="p-4 border-t border-white/5 bg-[#0A0A0F]/50 backdrop-blur-md">
                    <form
                        onSubmit={(e) => { e.preventDefault(); handleSend(); }}
                        className="relative"
                    >
                        <Input
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            placeholder="Ask about this document..."
                            className="pr-12 bg-black/40 border-white/10 focus-visible:ring-[#00D9FF]/50 h-12 rounded-xl text-white placeholder:text-gray-500"
                        />
                        <Button
                            type="submit"
                            size="icon"
                            className="absolute right-1.5 top-1.5 h-9 w-9 bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black shadow-[0_0_10px_rgba(0,217,255,0.3)] rounded-lg transition-transform hover:scale-105"
                            disabled={isLoading || !input.trim()}
                        >
                            <Send className="w-4 h-4" />
                        </Button>
                    </form>
                </div>
            </div>
        </div>
    );
}
