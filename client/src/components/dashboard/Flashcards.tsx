import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Wand2, ArrowRight, ArrowLeft, RefreshCw, Layers } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { generateFlashcards } from "@/lib/groq";
import { cn } from "@/lib/utils";

interface FlashcardData {
    front: string;
    back: string;
    difficulty?: "easy" | "medium" | "hard";
}

export function Flashcards() {
    const [cards, setCards] = useState<FlashcardData[]>([]);
    const [currentIndex, setCurrentIndex] = useState(0);
    const [isFlipped, setIsFlipped] = useState(false);
    const [direction, setDirection] = useState(0);

    // Generator State
    const [isGenerating, setIsGenerating] = useState(false);
    const [inputText, setInputText] = useState("");
    const [isDialogOpen, setIsDialogOpen] = useState(false);

    const handleGenerate = async () => {
        if (!inputText.trim()) return;
        setIsGenerating(true);
        try {
            const result = await generateFlashcards(inputText, 5);
            if (result && result.flashcards) {
                setCards(prev => [...prev, ...result.flashcards]);
                setIsDialogOpen(false);
                setInputText("");
            }
        } catch (error) {
            console.error("Generation failed:", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleNext = () => {
        if (currentIndex < cards.length - 1) {
            setIsFlipped(false);
            setDirection(1);
            setTimeout(() => setCurrentIndex(c => c + 1), 200);
        }
    };

    const handlePrev = () => {
        if (currentIndex > 0) {
            setIsFlipped(false);
            setDirection(-1);
            setTimeout(() => setCurrentIndex(c => c - 1), 200);
        }
    };

    if (cards.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center">
                <div className="w-24 h-24 bg-[#00D9FF]/10 rounded-3xl border border-[#00D9FF]/20 flex items-center justify-center mb-6 animate-pulse shadow-[0_0_40px_rgba(0,217,255,0.15)]">
                    <Layers className="w-12 h-12 text-[#00D9FF]" />
                </div>
                <h2 className="text-3xl font-bold mb-4 text-white font-poppins">Flashcard Deck Empty</h2>
                <p className="text-gray-400 max-w-md mb-8">
                    Upload text to generate AI flashcards or create them manually to start your spaced repetition session.
                </p>

                <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                    <DialogTrigger asChild>
                        <Button size="lg" className="bg-[#00D9FF] text-black hover:bg-[#00D9FF]/80 rounded-xl font-bold tracking-wide shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:scale-105">
                            <Wand2 className="w-4 h-4 mr-2" />
                            GENERATE DECK
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="bg-[#0A0A0F]/95 backdrop-blur-xl border-[#00D9FF]/30 text-white rounded-2xl">
                        <DialogHeader>
                            <DialogTitle className="font-bold text-[#00D9FF] text-xl">Generate Flashcards</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4 py-4">
                            <Textarea
                                placeholder="Paste your notes here (e.g., 'The mitochondria is the powerhouse of the cell...')"
                                className="min-h-[200px] bg-black/50 border-white/10 focus:border-[#00D9FF] rounded-xl focus-visible:ring-0 text-white text-sm leading-relaxed"
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                            />
                            <Button
                                onClick={handleGenerate}
                                className="w-full bg-[#00D9FF] text-black hover:bg-[#00D9FF]/80 rounded-xl font-bold"
                                disabled={isGenerating}
                            >
                                {isGenerating ? (
                                    <span className="flex items-center gap-2"><RefreshCw className="w-4 h-4 animate-spin" /> GENERATING...</span>
                                ) : (
                                    "INITIALIZE GENERATION"
                                )}
                            </Button>
                        </div>
                    </DialogContent>
                </Dialog>
            </div>
        );
    }

    const currentCard = cards[currentIndex];

    return (
        <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] relative overflow-hidden">

            {/* Progress Bar */}
            <div className="w-full max-w-xl h-1.5 bg-white/10 mb-8 rounded-full overflow-hidden">
                <motion.div
                    className="h-full bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentIndex + 1) / cards.length) * 100}%` }}
                />
            </div>

            <div className="relative w-full max-w-xl aspect-[3/2] perspective-1000">
                <AnimatePresence mode="wait" initial={false} custom={direction}>
                    <motion.div
                        key={currentIndex}
                        custom={direction}
                        initial={{ x: direction * 300, opacity: 0, rotateY: 0 }}
                        animate={{ x: 0, opacity: 1, rotateY: isFlipped ? 180 : 0 }}
                        exit={{ x: direction * -300, opacity: 0 }}
                        transition={{ type: "spring", stiffness: 260, damping: 20 }}
                        className="w-full h-full relative preserve-3d cursor-pointer group"
                        onClick={() => setIsFlipped(!isFlipped)}
                    >
                        {/* Front */}
                        <div className={cn(
                            "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center rounded-3xl",
                            "bg-[#0A0A0F] border border-[#00D9FF]/30 shadow-[0_0_30px_rgba(0,217,255,0.1)]",
                            "hover:border-[#00D9FF]/60 transition-colors"
                        )}>
                            <div className="absolute top-0 right-0 w-32 h-32 bg-[#00D9FF]/5 rounded-full blur-3xl -z-10" />
                            <span className="absolute top-6 left-6 text-[#00D9FF] text-xs font-mono tracking-widest">QUESTION_0{currentIndex + 1}</span>
                            <h3 className="text-2xl font-bold leading-relaxed text-white">{currentCard.front}</h3>
                            <p className="absolute bottom-6 text-xs text-gray-500 animate-pulse font-medium">CLICK TO REVEAL</p>
                        </div>

                        {/* Back */}
                        <div className={cn(
                            "absolute inset-0 backface-hidden flex flex-col items-center justify-center p-8 text-center rotate-y-180 rounded-3xl",
                            "bg-[#0D0D12] border border-[#00D9FF] shadow-[0_0_50px_rgba(0,217,255,0.15)]"
                        )}>
                            <span className="absolute top-6 left-6 text-[#00D9FF] text-xs font-mono tracking-widest">ANSWER</span>
                            <p className="text-xl leading-relaxed text-gray-200">{currentCard.back}</p>

                            <div className="absolute bottom-0 left-0 right-0 h-16 border-t border-white/10 flex divide-x divide-white/10 bg-black/20">
                                <button className="flex-1 hover:bg-red-500/10 text-red-400 text-xs font-bold transition-colors">FORGOT</button>
                                <button className="flex-1 hover:bg-yellow-500/10 text-yellow-400 text-xs font-bold transition-colors">HARD</button>
                                <button className="flex-1 hover:bg-[#00D9FF]/10 text-[#00D9FF] text-xs font-bold transition-colors">EASY</button>
                            </div>
                        </div>
                    </motion.div>
                </AnimatePresence>
            </div>

            {/* Controls */}
            <div className="flex items-center gap-6 mt-10">
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handlePrev}
                    disabled={currentIndex === 0}
                    className="bg-black/50 border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-black rounded-xl w-14 h-14 backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(0,217,255,0.1)] hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] disabled:opacity-30 disabled:hover:shadow-none"
                >
                    <ArrowLeft className="w-6 h-6" />
                </Button>
                <span className="font-mono text-lg text-gray-400 font-bold">
                    <span className="text-[#00D9FF]">{currentIndex + 1}</span> / {cards.length}
                </span>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={handleNext}
                    disabled={currentIndex === cards.length - 1}
                    className="bg-black/50 border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF] hover:text-black rounded-xl w-14 h-14 backdrop-blur-sm transition-all shadow-[0_0_20px_rgba(0,217,255,0.1)] hover:shadow-[0_0_30px_rgba(0,217,255,0.3)] disabled:opacity-30 disabled:hover:shadow-none"
                >
                    <ArrowRight className="w-6 h-6" />
                </Button>
            </div>
        </div>
    );
}
