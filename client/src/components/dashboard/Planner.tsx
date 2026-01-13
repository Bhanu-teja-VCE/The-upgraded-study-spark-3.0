import { useState } from "react";
import { Calendar, dateFnsLocalizer, Views } from "react-big-calendar";
import { format } from "date-fns";
import { parse } from "date-fns";
import { startOfWeek } from "date-fns";
import { getDay } from "date-fns";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { enUS } from "date-fns/locale";
import { Button } from "@/components/ui/button";
import { Plus, Sparkles, RefreshCw, Calendar as CalendarIcon, Clock } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createStudySchedule } from "@/lib/groq";
import { cn } from "@/lib/utils";

const locales = {
    "en-US": enUS,
};

const localizer = dateFnsLocalizer({
    format,
    parse,
    startOfWeek,
    getDay,
    locales,
});

interface CalendarEvent {
    id?: number;
    title: string;
    start: Date;
    end: Date;
    type?: string;
}

export function Planner() {
    const [events, setEvents] = useState<CalendarEvent[]>([
        {
            id: 1,
            title: "Review React Hooks",
            start: new Date(new Date().setHours(10, 0)),
            end: new Date(new Date().setHours(12, 0)),
            type: "review"
        }
    ]);
    const [view, setView] = useState(Views.MONTH);
    const [date, setDate] = useState(new Date());

    // Generator State
    const [isGenerating, setIsGenerating] = useState(false);
    const [goal, setGoal] = useState("");
    const [deadline, setDeadline] = useState("");
    const [subjects, setSubjects] = useState("");
    const [isAiOpen, setIsAiOpen] = useState(false);

    // Manual Event State
    const [isAddOpen, setIsAddOpen] = useState(false);
    const [newEventTitle, setNewEventTitle] = useState("");
    const [newEventStart, setNewEventStart] = useState("");
    const [newEventEnd, setNewEventEnd] = useState("");
    const [newEventType, setNewEventType] = useState("study");

    const handleGenerate = async () => {
        setIsGenerating(true);
        try {
            // Mock parsing logic as the Groq function expects array
            const subjectList = subjects.split(",").map(s => s.trim());
            const response = await createStudySchedule(deadline, subjectList, 4);

            if (response.events && Array.isArray(response.events)) {
                const newEvents: CalendarEvent[] = response.events.map((ev: any, idx: number) => ({
                    id: Date.now() + idx,
                    title: ev.title || "Study Session",
                    start: new Date(ev.start),
                    end: new Date(ev.end),
                    type: "generated"
                }));
                setEvents(prev => [...prev, ...newEvents]);
                setIsAiOpen(false);
            }
        } catch (error) {
            console.error("Schedule generation failed", error);
        } finally {
            setIsGenerating(false);
        }
    };

    const handleAddEvent = () => {
        if (!newEventTitle || !newEventStart || !newEventEnd) return;

        const start = new Date(newEventStart);
        const end = new Date(newEventEnd);

        setEvents(prev => [...prev, {
            id: Date.now(),
            title: newEventTitle,
            start,
            end,
            type: newEventType
        }]);

        setIsAddOpen(false);
        setNewEventTitle("");
        setNewEventStart("");
        setNewEventEnd("");
    };

    const eventStyleGetter = (event: CalendarEvent) => {
        let backgroundColor = "#00D9FF";
        let color = "#000";

        if (event.type === "generated") {
            backgroundColor = "#00FFD1";
        } else if (event.type === "review") {
            backgroundColor = "#8B5CF6";
            color = "#fff";
        } else if (event.type === "exam") {
            backgroundColor = "#EF4444";
            color = "#fff";
        }

        return {
            style: {
                backgroundColor,
                color,
                border: "none",
                borderRadius: "8px",
                fontWeight: "bold",
                fontSize: "0.85rem",
                padding: "4px 8px",
                boxShadow: `0 2px 10px ${backgroundColor}40`
            }
        };
    };

    const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);

    const handleSelectEvent = (event: CalendarEvent) => {
        setSelectedEvent(event);
    };

    return (
        <div style={{ height: "calc(100vh - 8rem)" }} className="flex flex-col p-6">
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h2 className="text-3xl font-bold text-white mb-2">Study Planner</h2>
                    <p className="text-slate-400">Manage your learning schedule and deadlines.</p>
                </div>

                <div className="flex gap-4">
                    <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-white/10 hover:bg-white/20 text-white border border-white/10 h-12 px-6 rounded-xl">
                                <Plus className="w-5 h-5 mr-2" /> Add Event
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0A0A0F] border-[#00D9FF]/20 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-[#00D9FF]">Add New Event</DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Event Title</Label>
                                    <Input
                                        placeholder="e.g., Math Finals, Group Study..."
                                        value={newEventTitle}
                                        onChange={e => setNewEventTitle(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#00D9FF]"
                                    />
                                </div>
                                <div className="grid grid-cols-2 gap-4">
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">Start Time</Label>
                                        <Input
                                            type="datetime-local"
                                            value={newEventStart}
                                            onChange={e => setNewEventStart(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label className="text-slate-300">End Time</Label>
                                        <Input
                                            type="datetime-local"
                                            value={newEventEnd}
                                            onChange={e => setNewEventEnd(e.target.value)}
                                            className="bg-white/5 border-white/10 text-white h-12 rounded-xl"
                                        />
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Type</Label>
                                    <Select value={newEventType} onValueChange={setNewEventType}>
                                        <SelectTrigger className="bg-white/5 border-white/10 text-white h-12 rounded-xl">
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent className="bg-[#0A0A0F] border-[#00D9FF]/20 text-white">
                                            <SelectItem value="study">Study Session</SelectItem>
                                            <SelectItem value="review">Review</SelectItem>
                                            <SelectItem value="exam">Exam / Deadline</SelectItem>
                                            <SelectItem value="other">Other</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                                <Button
                                    onClick={handleAddEvent}
                                    className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] mt-4"
                                >
                                    Create Event
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    <Dialog open={isAiOpen} onOpenChange={setIsAiOpen}>
                        <DialogTrigger asChild>
                            <Button className="bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold h-12 px-6 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] transition-all hover:scale-[1.02]">
                                <Sparkles className="w-5 h-5 mr-2" /> AI Auto-Schedule
                            </Button>
                        </DialogTrigger>
                        <DialogContent className="bg-[#0A0A0F] border-[#00D9FF]/20 text-white sm:max-w-md">
                            <DialogHeader>
                                <DialogTitle className="text-[#00D9FF] flex items-center gap-2">
                                    <Sparkles className="w-5 h-5" /> AI Schedule Generator
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-4 py-4">
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Deadline</Label>
                                    <Input
                                        type="date"
                                        value={deadline}
                                        onChange={e => setDeadline(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#00D9FF]"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label className="text-slate-300">Subjects (comma separated)</Label>
                                    <Input
                                        placeholder="Calculus, History, Physics..."
                                        value={subjects}
                                        onChange={e => setSubjects(e.target.value)}
                                        className="bg-white/5 border-white/10 text-white h-12 rounded-xl focus:border-[#00D9FF]"
                                    />
                                </div>
                                <Button
                                    onClick={handleGenerate}
                                    className="w-full bg-[#00D9FF] hover:bg-[#00D9FF]/80 text-black font-bold h-12 rounded-xl shadow-[0_0_20px_rgba(0,217,255,0.3)] mt-4"
                                    disabled={isGenerating}
                                >
                                    {isGenerating ? <RefreshCw className="animate-spin w-5 h-5 mr-2" /> : <Sparkles className="w-5 h-5 mr-2" />}
                                    {isGenerating ? "Generating Plan..." : "Generate Magic Plan"}
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>

                    {/* Task Detail Dialog */}
                    <Dialog open={!!selectedEvent} onOpenChange={() => setSelectedEvent(null)}>
                        <DialogContent className="bg-[#0A0A0F] border-[#00D9FF]/20 text-white sm:max-w-md backdrop-blur-3xl">
                            <DialogHeader>
                                <DialogTitle className="text-2xl font-bold flex items-center gap-2 text-[#00D9FF]">
                                    <div className="w-2 h-8 bg-[#00D9FF] rounded-full" />
                                    {selectedEvent?.title}
                                </DialogTitle>
                            </DialogHeader>
                            <div className="space-y-6 py-4">
                                <div className="flex items-center gap-3 text-slate-300">
                                    <Clock className="w-5 h-5 text-[#00D9FF]" />
                                    <div>
                                        <p className="text-sm font-semibold">Time</p>
                                        <p className="text-sm">{selectedEvent && format(selectedEvent.start, "MMM dd, h:mm a")} - {selectedEvent && format(selectedEvent.end, "h:mm a")}</p>
                                    </div>
                                </div>

                                <div className="flex items-center gap-3 text-slate-300">
                                    <CalendarIcon className="w-5 h-5 text-[#8B5CF6]" />
                                    <div>
                                        <p className="text-sm font-semibold">Type</p>
                                        <span className={cn(
                                            "inline-block px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider mt-1",
                                            selectedEvent?.type === 'exam' ? "bg-red-500/20 text-red-400" :
                                                selectedEvent?.type === 'review' ? "bg-purple-500/20 text-purple-400" :
                                                    "bg-[#00D9FF]/20 text-[#00D9FF]"
                                        )}>
                                            {selectedEvent?.type || "Task"}
                                        </span>
                                    </div>
                                </div>

                                <div className="p-4 bg-white/5 rounded-xl border border-white/5">
                                    <h4 className="text-sm font-bold text-white mb-2">Description</h4>
                                    <p className="text-sm text-gray-400">
                                        {selectedEvent?.type === "generated"
                                            ? "This is an AI-generated study session based on your goals. Focus on the core concepts."
                                            : "Manual task added to your planner."}
                                    </p>
                                </div>

                                <Button
                                    onClick={() => setSelectedEvent(null)}
                                    className="w-full bg-white/10 hover:bg-white/20 text-white"
                                >
                                    Close
                                </Button>
                            </div>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>

            <div className="flex-1 glass-card p-8 bg-slate-900/50 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl overflow-hidden">
                <Calendar
                    localizer={localizer}
                    events={events}
                    startAccessor="start"
                    endAccessor="end"
                    style={{ height: "100%" }}
                    view={view}
                    onView={setView}
                    date={date}
                    onNavigate={setDate}
                    eventPropGetter={eventStyleGetter}
                    onSelectEvent={handleSelectEvent}
                    className="text-slate-200"
                />
            </div>

            {/* Custom Styles override for Calendar to match dark theme */}
            <style>{`
        .rbc-calendar { color: #94a3b8; font-family: inherit; }
        .rbc-today { background-color: rgba(0, 217, 255, 0.05); }
        .rbc-off-range-bg { background-color: transparent; }
        .rbc-header { 
            border-bottom: 1px solid rgba(255,255,255,0.1); 
            padding: 16px; 
            font-weight: 700; 
            color: #00D9FF; 
            text-transform: uppercase;
            letter-spacing: 0.1em;
            font-size: 0.8rem;
        }
        .rbc-month-view, .rbc-time-view, .rbc-agenda-view { border: 1px solid rgba(255,255,255,0.1); border-radius: 16px; overflow: hidden; }
        .rbc-day-bg + .rbc-day-bg { border-left: 1px solid rgba(255,255,255,0.05); }
        .rbc-month-row + .rbc-month-row { border-top: 1px solid rgba(255,255,255,0.05); }
        .rbc-toolbar { margin-bottom: 24px; }
        .rbc-toolbar button { 
            color: #fff; 
            border: 1px solid rgba(255,255,255,0.1); 
            border-radius: 12px;
            padding: 8px 16px;
            transition: all 0.2s;
        }
        .rbc-toolbar button:hover { background-color: rgba(255,255,255,0.1); }
        .rbc-toolbar button.rbc-active { 
            background-color: #00D9FF; 
            border-color: #00D9FF; 
            color: #000;
            font-weight: bold;
            box-shadow: 0 0 15px rgba(0,217,255,0.3);
        }
        .rbc-toolbar-label { font-size: 1.5rem; font-weight: 800; color: white; }
        .rbc-event { padding: 4px 8px; }
      `}</style>
        </div>
    );
}
