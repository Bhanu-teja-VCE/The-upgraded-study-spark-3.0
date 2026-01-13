import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Check, X, Brain, Trophy, ArrowRight, RefreshCw, AlertCircle, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { generateQuiz } from "@/lib/groq";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";

interface Question {
    q: string;
    options: string[];
    correct: number;
    explanation: string;
}

export function Quiz() {
    const [questions, setQuestions] = useState<Question[]>([]);
    const [currentQIndex, setCurrentQIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    // Generation State
    const [isGenerating, setIsGenerating] = useState(false);
    const [topic, setTopic] = useState("");
    const [difficulty, setDifficulty] = useState("medium");

    const handleGenerate = async () => {
        if (!topic.trim()) return;
        setIsGenerating(true);
        setQuestions([]);
        setShowResult(false);
        setCurrentQIndex(0);
        setScore(0);

        try {
            const result = await generateQuiz(topic, difficulty, 5);
            if (result && result.quiz) {
                setQuestions(result.quiz);
            }
        } catch (error) {
            console.error("Quiz generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleOptionClick = (index: number) => {
        if (isAnswered) return;
        setSelectedOption(index);
        setIsAnswered(true);
        if (index === questions[currentQIndex].correct) {
            setScore(s => s + 1);
        }
    };

    const handleNext = () => {
        if (currentQIndex < questions.length - 1) {
            setCurrentQIndex(i => i + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    if (questions.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center p-6 bg-[#0A0A0F]">
                <div className="w-24 h-24 bg-[#00D9FF]/10 rounded-3xl flex items-center justify-center mb-6 animate-pulse shadow-[0_0_30px_rgba(0,217,255,0.2)]">
                    <Brain className="w-12 h-12 text-[#00D9FF]" />
                </div>
                <h2 className="text-4xl font-bold mb-4 text-white">AI Quiz Engine</h2>
                <p className="text-slate-400 max-w-md mb-10 text-lg">
                    Challenge yourself. Generate a custom cheat-proof exam on any topic instantly with Groq AI.
                </p>

                <div className="w-full max-w-md space-y-6">
                    <div className="space-y-2 text-left">
                        <Label className="text-[#00D9FF]">Topic</Label>
                        <Input
                            placeholder="e.g., Quantum Physics, French Revolution..."
                            value={topic}
                            onChange={(e) => setTopic(e.target.value)}
                            className="bg-white/5 border-[#00D9FF]/20 text-white placeholder:text-slate-600 focus:border-[#00D9FF] focus:ring-[#00D9FF]/20 h-12 rounded-xl"
                        />
                    </div>

                    <div className="space-y-2 text-left">
                        <Label className="text-[#00D9FF]">Difficulty</Label>
                        <Select value={difficulty} onValueChange={setDifficulty}>
                            <SelectTrigger className="bg-white/5 border-[#00D9FF]/20 text-white h-12 rounded-xl focus:ring-[#00D9FF]/20">
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent className="bg-[#0A0A0F] border-[#00D9FF]/30 text-white">
                                <SelectItem value="easy">Easy</SelectItem>
                                <SelectItem value="medium">Medium</SelectItem>
                                <SelectItem value="hard">Hard (Exam Mode)</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <Button
                        size="lg"
                        className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:scale-[1.02]"
                        onClick={handleGenerate}
                        disabled={isGenerating || !topic}
                    >
                        {isGenerating ? (
                            <span className="flex items-center gap-2">
                                <Loader2 className="w-5 h-5 animate-spin" /> GENERATING EXAM...
                            </span>
                        ) : (
                            <span className="flex items-center gap-2">
                                START QUIZ <ArrowRight className="w-5 h-5" />
                            </span>
                        )}
                    </Button>
                </div>
            </div>
        );
    }

    if (showResult) {
        const percentage = Math.round((score / questions.length) * 100);
        return (
            <div className="flex flex-col items-center justify-center h-[calc(100vh-8rem)] text-center animate-fadeInUp bg-[#0A0A0F]">
                <div className={cn("w-32 h-32 rounded-full flex items-center justify-center mb-8 shadow-[0_0_40px_rgba(0,0,0,0.3)]", percentage > 70 ? "bg-yellow-500/10" : "bg-slate-500/10")}>
                    <Trophy className={cn("w-16 h-16", percentage > 70 ? "text-yellow-500 drop-shadow-[0_0_10px_rgba(234,179,8,0.5)]" : "text-slate-500")} />
                </div>

                <h2 className="text-6xl font-black mb-4 text-transparent bg-clip-text bg-gradient-to-r from-white to-slate-400">{percentage}%</h2>
                <p className="text-xl text-slate-400 mb-12">You scored <span className="text-white font-bold">{score}</span> out of <span className="text-white font-bold">{questions.length}</span> questions correct.</p>

                <div className="flex gap-4">
                    <Button onClick={() => setQuestions([])} variant="outline" className="h-12 border-[#00D9FF]/30 text-[#00D9FF] hover:bg-[#00D9FF]/10 hover:text-[#00D9FF] rounded-xl px-8">
                        New Topic
                    </Button>
                    <Button
                        onClick={() => {
                            setShowResult(false);
                            setCurrentQIndex(0);
                            setScore(0);
                            setIsAnswered(false);
                            setSelectedOption(null);
                        }}
                        className="h-12 bg-[#00D9FF] text-black hover:bg-[#00D9FF]/80 font-bold rounded-xl px-8 shadow-[0_0_20px_rgba(0,217,255,0.3)]"
                    >
                        Retry Quiz
                    </Button>
                </div>
            </div>
        );
    }

    const currentQ = questions[currentQIndex];

    return (
        <div className="max-w-4xl mx-auto py-10 px-6 h-full flex flex-col justify-center">
            <div className="flex items-center justify-between mb-8">
                <div>
                    <h2 className="text-2xl font-bold text-white mb-2 uppercase tracking-wider">{topic}</h2>
                    <div className="flex items-center gap-2 text-sm text-[#00D9FF]">
                        <span className="bg-[#00D9FF]/10 px-3 py-1 rounded-full border border-[#00D9FF]/20">Question {currentQIndex + 1} / {questions.length}</span>
                    </div>
                </div>
                <div className="text-right bg-white/5 px-6 py-3 rounded-2xl border border-white/10 backdrop-blur-md">
                    <span className="text-3xl font-mono font-bold text-[#00D9FF]">{score}</span>
                    <span className="text-xs text-slate-400 uppercase tracking-widest ml-2">Points</span>
                </div>
            </div>

            <div className="relative h-2 bg-white/5 rounded-full mb-12 overflow-hidden">
                <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${((currentQIndex) / questions.length) * 100}%` }}
                    className="absolute top-0 left-0 h-full bg-[#00D9FF] shadow-[0_0_10px_#00D9FF]"
                />
            </div>

            <Card className="bg-white/5 backdrop-blur-xl p-10 mb-8 border border-white/10 rounded-3xl shadow-2xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-[#00D9FF]" />
                <h3 className="text-3xl font-bold mb-10 leading-relaxed text-white">{currentQ.q}</h3>

                <div className="grid grid-cols-1 gap-4">
                    {currentQ.options.map((option, idx) => {
                        let stateStyles = "hover:bg-white/10 border-white/10 text-white/80 hover:text-white";
                        if (isAnswered) {
                            if (idx === currentQ.correct) stateStyles = "bg-green-500/20 border-green-500/50 text-green-400 shadow-[0_0_20px_rgba(34,197,94,0.1)]";
                            else if (idx === selectedOption) stateStyles = "bg-red-500/20 border-red-500/50 text-red-400";
                            else stateStyles = "opacity-40 border-transparent";
                        }

                        return (
                            <button
                                key={idx}
                                onClick={() => handleOptionClick(idx)}
                                disabled={isAnswered}
                                className={cn(
                                    "w-full text-left p-6 rounded-2xl border transition-all duration-200 flex items-center justify-between text-lg group/btn",
                                    stateStyles,
                                    !isAnswered && "hover:border-[#00D9FF]/50 hover:shadow-[0_0_15px_rgba(0,217,255,0.1)]"
                                )}
                            >
                                <div className="flex items-center gap-4">
                                    <span className={cn(
                                        "w-8 h-8 rounded-lg flex items-center justify-center text-sm font-bold transition-colors",
                                        isAnswered && idx === currentQ.correct ? "bg-green-500/20" : "bg-white/10 group-hover/btn:bg-[#00D9FF]/20"
                                    )}>
                                        {String.fromCharCode(65 + idx)}
                                    </span>
                                    <span className="font-medium">{option}</span>
                                </div>
                                {isAnswered && idx === currentQ.correct && <Check className="w-6 h-6 text-green-500" />}
                                {isAnswered && idx === selectedOption && idx !== currentQ.correct && <X className="w-6 h-6 text-red-500" />}
                            </button>
                        );
                    })}
                </div>
            </Card >

            <AnimatePresence>
                {isAnswered && (
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -20 }}
                        className="bg-[#00D9FF]/5 border border-[#00D9FF]/20 p-6 rounded-2xl mb-8 backdrop-blur-md"
                    >
                        <div className="flex items-start gap-4">
                            <div className="w-10 h-10 rounded-xl bg-[#00D9FF]/20 flex items-center justify-center shrink-0">
                                <AlertCircle className="w-5 h-5 text-[#00D9FF]" />
                            </div>
                            <div>
                                <h4 className="font-bold text-[#00D9FF] mb-2 text-lg">Detailed Explanation</h4>
                                <p className="text-slate-300 leading-relaxed text-lg">{currentQ.explanation}</p>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="flex justify-end">
                <Button
                    size="lg"
                    onClick={handleNext}
                    disabled={!isAnswered}
                    className="h-14 px-10 bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold text-lg rounded-2xl shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:scale-105"
                >
                    {currentQIndex === questions.length - 1 ? "Finish Quiz" : "Next Question"}
                    <ArrowRight className="w-5 h-5 ml-2" />
                </Button>
            </div>
        </div >
    );
}
