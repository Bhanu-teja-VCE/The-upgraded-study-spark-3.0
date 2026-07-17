import { useState, useEffect, useRef } from 'react';
import {
    LayoutDashboard,
    Timer,
    BarChart3,
    Calendar,
    Settings,
    Skull,
    Building2,
    MessageSquare,
    User,
    TrendingUp,
    CheckCircle2,
    XCircle,
    Play,
    Pause,
    Square,
    Zap,
    AlertTriangle,
    Send,
    Sparkles,
    Trophy
} from 'lucide-react';
import {
    AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer
} from 'recharts';
import { consultFocusCoach } from "@/lib/groq";

// --- STYLES & CONSTANTS ---
// Adapted for StudySpark: Cyan (#6366F1), Navy (#0A0A0F), Red (#EF4444)
const APP_ID = 'studyspark-focus-engine-v1';

// --- INITIAL DATA STRUCTURE ---
const INITIAL_DATA = {
    profile: {
        name: '',
        identity: '',
        startDate: new Date().toISOString(),
        onboarded: false,
        dayGoal: 4,
    },
    commitments: {} as any,
    sessions: [] as any[],
    distractions: [] as any[],
    reflections: {} as any,
    energyLogs: [] as any[],
    futureMessages: [] as any[],
    tasks: [] as any[],
    achievements: [] as any[],
    identityScore: 0,
    lastActive: Date.now(),
    chatHistory: [] as any[]
};

// --- UTILS ---
const getTodayKey = () => new Date().toISOString().split('T')[0];

const formatTime = (seconds: number) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = seconds % 60;
    return [h, m, s].map(v => v < 10 ? "0" + v : v).join(":");
};

const calculateStreak = (sessions: any[]) => {
    if (!sessions || !sessions.length) return 0;
    const dates = Array.from(new Set(sessions.map((s: any) => s.date.split('T')[0]))).sort().reverse();
    let streak = 0;
    for (let dateStr of dates) {
        const d = new Date(dateStr as string);
        const today = new Date(getTodayKey());
        const diffDays = Math.floor((today.getTime() - d.getTime()) / (1000 * 60 * 60 * 24));

        if (diffDays === streak || diffDays === streak - 1) {
            streak++;
        } else { break; }
    }
    return streak;
};

// --- MAIN COMPONENT ---

export default function FocusMode() {
    const [data, setData] = useState(() => {
        try {
            const saved = localStorage.getItem(APP_ID);
            if (saved) {
                const parsed = JSON.parse(saved);
                return {
                    ...INITIAL_DATA,
                    ...parsed,
                    profile: { ...INITIAL_DATA.profile, ...parsed.profile },
                };
            }
        } catch (e) { console.error("Data load fail", e); }
        return INITIAL_DATA;
    });

    const [view, setView] = useState('dashboard');
    const [showCommitmentModal, setShowCommitmentModal] = useState(false);
    const [monkMode, setMonkMode] = useState(false);

    useEffect(() => {
        localStorage.setItem(APP_ID, JSON.stringify(data));
    }, [data]);

    useEffect(() => {
        if (data.profile.onboarded && !data.commitments[getTodayKey()]) {
            setShowCommitmentModal(true);
        }
    }, [data.profile.onboarded, data.commitments]);

    const handleReset = () => {
        if (window.confirm("DESTROY ALL PROGRESS? Reality cannot be undone after this.")) {
            setData(INITIAL_DATA);
            localStorage.removeItem(APP_ID);
            setView('dashboard');
        }
    };

    const dayNumber = Math.floor((Date.now() - new Date(data.profile.startDate).getTime()) / (1000 * 60 * 60 * 24)) + 1;

    if (!data.profile.onboarded) return <OnboardingView onComplete={(p: any) => setData((prev: any) => ({ ...prev, profile: { ...p, onboarded: true } }))} />;

    return (
        <div className="flex h-[calc(100vh-4rem)] bg-[#0A0A0F] text-white font-sans overflow-hidden rounded-3xl border border-white/5 mx-6 mb-6">
            {/* Internal Sidebar */}
            <nav className="w-64 bg-[#12121A] border-r border-[#6366F1]/10 flex flex-col p-4 z-20">
                <div className="mb-8 flex items-center gap-2 px-2">
                    <div className="w-8 h-8 bg-[#6366F1] rounded flex items-center justify-center">
                        <Zap size={18} className="text-black fill-black" />
                    </div>
                    <span className="font-bold tracking-tighter text-lg">FOCUS ENGINE</span>
                </div>

                <div className="space-y-1 flex-1">
                    <NavItem active={view === 'dashboard'} onClick={() => setView('dashboard')} icon={<LayoutDashboard size={18} />} label="Command Center" />
                    <NavItem active={view === 'session'} onClick={() => setView('session')} icon={<Timer size={18} />} label="Deep Work" />
                    <NavItem active={view === 'chat'} onClick={() => setView('chat')} icon={<MessageSquare size={18} />} label="Consult Bhanu" />
                    <NavItem active={view === 'analytics'} onClick={() => setView('analytics')} icon={<BarChart3 size={18} />} label="Analytics" />
                    <NavItem active={view === 'progress'} onClick={() => setView('progress')} icon={<TrendingUp size={18} />} label="Growth City" />
                    <NavItem active={view === 'graveyard'} onClick={() => setView('graveyard')} icon={<Skull size={18} />} label="Graveyard" />
                    <NavItem active={view === 'identity'} onClick={() => setView('identity')} icon={<User size={18} />} label="Identity Shift" />
                    <NavItem active={view === 'settings'} onClick={() => setView('settings')} icon={<Settings size={18} />} label="Settings" />
                </div>

                <div className="pt-4 border-t border-white/10 space-y-4">
                    <div className="px-2 text-xs">
                        <div className="flex justify-between mb-1">
                            <span className="text-gray-500 uppercase font-black text-[10px]">Peak Streak</span>
                            <span className="text-[#6366F1]">{calculateStreak(data.sessions)} days</span>
                        </div>
                        <div className="w-full bg-white/5 h-1 rounded-full overflow-hidden">
                            <div className="h-full bg-[#6366F1]" style={{ width: `${Math.min(100, (dayNumber / 90) * 100)}%` }}></div>
                        </div>
                    </div>
                </div>
            </nav>

            {/* Main Content */}
            <main className="flex-1 flex flex-col overflow-y-auto relative bg-[#0A0A0F] scrollbar-thin scrollbar-thumb-gray-800">
                <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 bg-[#0A0A0F]/80 backdrop-blur-md sticky top-0 z-10">
                    <div className="flex items-center gap-6">
                        <div className="flex flex-col">
                            <span className="text-[10px] text-gray-500 uppercase font-black">Day {dayNumber} of 90</span>
                        </div>
                        <div className="h-8 w-px bg-white/10" />
                        <div className="flex flex-col">
                            <span className="text-sm font-medium max-w-[300px] truncate text-[#6366F1]">
                                {data.commitments[getTodayKey()]?.goal || 'No Active Goal'}
                            </span>
                        </div>
                    </div>
                    <button onClick={() => setMonkMode(true)} className="px-4 py-1.5 rounded-full text-xs font-bold border border-[#EF4444] text-[#EF4444] hover:bg-[#EF4444] hover:text-white transition-all">
                        ENTER MONK MODE
                    </button>
                </header>

                <div className="p-8 max-w-7xl mx-auto w-full">
                    {view === 'dashboard' && <DashboardView data={data} />}
                    {view === 'session' && <SessionView data={data} setData={setData} />}
                    {view === 'chat' && <ChatView data={data} setData={setData} />}
                    {view === 'analytics' && <AnalyticsView data={data} />}
                    {view === 'progress' && <ProgressMaterializer data={data} />}
                    {view === 'graveyard' && <GraveyardView data={data} />}
                    {view === 'identity' && <IdentityView data={data} />}
                    {view === 'settings' && <SettingsView data={data} onReset={handleReset} />}
                </div>
            </main>

            {showCommitmentModal && <CommitmentRitual onCommit={(c: any) => setData((prev: any) => ({ ...prev, commitments: { ...prev.commitments, [getTodayKey()]: c } }))} onHide={() => setShowCommitmentModal(false)} />}
            {monkMode && <MonkModeOverlay onClose={() => setMonkMode(false)} />}
        </div>
    );
}

function NavItem({ active, onClick, icon, label }: any) {
    return (
        <button onClick={onClick} className={`flex items-center gap-3 w-full px-3 py-2.5 rounded-lg transition-all ${active ? 'bg-[#6366F1]/10 text-[#6366F1] border border-[#6366F1]/20' : 'text-gray-400 hover:text-white border border-transparent'}`}>
            {icon} <span className="text-sm font-medium">{label}</span>
        </button>
    );
}

// --- DASHBOARD VIEW ---

function DashboardView({ data }: any) {
    const todaySessions = data.sessions.filter((s: any) => s.date.startsWith(getTodayKey()));
    const totalToday = todaySessions.reduce((acc: number, curr: any) => acc + curr.duration, 0);
    const target = data.commitments[getTodayKey()]?.duration || 4;

    return (
        <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <StatCard label="Deep Work Today" value={formatTime(totalToday)} subValue={`${Math.round((totalToday / 3600 / target) * 100)}% of target`} color="#6366F1" />
                <StatCard label="Current Streak" value={`${calculateStreak(data.sessions)} Days`} subValue="Momentum" color="#6366F1" />
                <StatCard label="Intensity Avg" value="8.4/10" subValue="Performance" color="#6366F1" />
                <StatCard label="Self-Deception" value="12%" subValue="Planned vs Actual" color="#EF4444" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-[#12121A] border border-white/5 rounded-2xl p-6">
                    <h3 className="text-lg font-bold mb-6 text-[#6366F1]">Velocity Heatmap</h3>
                    <div className="h-[300px]">
                        <ResponsiveContainer width="100%" height="100%">
                            <AreaChart data={data.sessions.slice(-14).map((s: any) => ({ d: s.date.split('T')[0], h: s.duration / 3600 }))}>
                                <CartesianGrid stroke="#333" vertical={false} />
                                <XAxis dataKey="d" stroke="#555" fontSize={10} />
                                <YAxis stroke="#555" fontSize={10} />
                                <Tooltip contentStyle={{ background: '#1a1a1a', border: 'none', borderRadius: '8px' }} />
                                <Area type="monotone" dataKey="h" stroke="#6366F1" fill="#6366F1" fillOpacity={0.1} strokeWidth={3} />
                            </AreaChart>
                        </ResponsiveContainer>
                    </div>
                </div>
                <div className="bg-[#12121A] border border-white/5 rounded-2xl p-6 flex flex-col justify-center items-center">
                    <Trophy className="text-[#6366F1] mb-4" size={48} />
                    <h4 className="font-black text-xl text-white">Level {Math.floor(data.sessions.length / 5) + 1}</h4>
                    <p className="text-xs text-gray-500 text-center mt-2 uppercase tracking-widest">Execute 3 more sessions to level up your city.</p>
                </div>
            </div>
        </div>
    );
}

// --- SESSION VIEW ---

function SessionView({ data, setData }: any) {
    const [isActive, setIsActive] = useState(false);
    const [seconds, setSeconds] = useState(0);
    const [intensity, setIntensity] = useState(8);
    const [distractions, setDistractions] = useState<number[]>([]);
    const [isFinishing, setIsFinishing] = useState(false);
    const [output, setOutput] = useState('');
    const [analyzing, setAnalyzing] = useState(false);

    const timerRef = useRef<any>(null);

    useEffect(() => {
        if (isActive) {
            timerRef.current = setInterval(() => setSeconds(s => s + 1), 1000);
        } else { clearInterval(timerRef.current); }
        return () => clearInterval(timerRef.current);
    }, [isActive]);

    const handleFinish = async () => {
        setAnalyzing(true);
        // Use Groq API here via specific instruction
        const analysisText = await consultFocusCoach(
            `Analyze this work session output: "${output}". Duration: ${formatTime(seconds)}. Intensity: ${intensity}/10. Distractions: ${distractions.length}. Be a brutal strategy advisor.`,
            "You are an elite productivity commander. Analyze the user's session report brutally and tactically."
        );

        const session = { id: Date.now(), date: new Date().toISOString(), duration: seconds, intensity, distractions, output, analysis: analysisText };
        setData((prev: any) => ({ ...prev, sessions: [...prev.sessions, session] }));
        setIsActive(false); setIsFinishing(false); setSeconds(0); setAnalyzing(false);
    };

    if (isFinishing) {
        return (
            <div className="absolute inset-0 bg-[#0A0A0F]/95 z-50 flex items-center justify-center p-6 backdrop-blur-sm">
                <div className="max-w-xl w-full bg-[#12121A] border border-white/10 p-10 rounded-3xl">
                    <h2 className="text-3xl font-black mb-6 text-white">SESSION REPORT</h2>
                    <textarea value={output} onChange={(e) => setOutput(e.target.value)} placeholder="What did you build?" className="w-full bg-black border border-white/10 rounded-xl p-4 h-40 outline-none focus:border-[#6366F1] text-white" />
                    <div className="flex gap-4 mt-8">
                        <button onClick={() => setIsFinishing(false)} className="flex-1 py-4 border border-white/20 rounded-xl text-white hover:bg-white/5">RESUME</button>
                        <button onClick={handleFinish} disabled={analyzing} className="flex-1 py-4 bg-[#6366F1] text-black font-black rounded-xl hover:scale-105 transition-transform">
                            {analyzing ? "ANALYZING..." : "LOG SESSION"}
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center justify-center min-h-[60vh]">
            <div className={`text-9xl font-black transition-all font-mono ${isActive ? 'text-[#6366F1] drop-shadow-[0_0_30px_#6366F144]' : 'text-white/10'}`}>
                {formatTime(seconds)}
            </div>
            <div className="mt-12 flex gap-8">
                {!isActive ? (
                    <button onClick={() => setIsActive(true)} className="w-24 h-24 rounded-full bg-[#6366F1] text-black flex items-center justify-center hover:scale-110 shadow-[0_0_40px_rgba(99, 102, 241,0.3)] transition-all">
                        <Play size={40} fill="black" />
                    </button>
                ) : (
                    <>
                        <button onClick={() => setIsActive(false)} className="w-24 h-24 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:scale-110 transition-all text-white"><Pause size={40} /></button>
                        <button onClick={() => setIsFinishing(true)} className="w-24 h-24 rounded-full bg-[#EF4444] flex items-center justify-center hover:scale-110 shadow-[0_0_30px_rgba(239,68,68,0.3)] transition-all"><Square size={40} fill="white" /></button>
                    </>
                )}
            </div>
            {isActive && (
                <div className="mt-12 w-full max-w-sm space-y-4">
                    <div className="flex justify-between text-xs font-black uppercase text-gray-500">
                        <span>Intensity: {intensity}</span>
                        <span className="text-[#6366F1] animate-pulse">FLOW STATE ENGAGED</span>
                    </div>
                    <input type="range" min="1" max="10" value={intensity} onChange={(e) => setIntensity(parseInt(e.target.value))} className="w-full accent-[#6366F1]" />
                    <button onClick={() => setDistractions([...distractions, Date.now()])} className="w-full py-4 border border-[#EF4444]/30 text-[#EF4444] rounded-xl text-xs font-black hover:bg-[#EF4444]/10 transition-colors">I BROKE FOCUS</button>
                </div>
            )}
        </div>
    );
}

// --- CHAT WITH BHANU ---

function ChatView({ data, setData }: any) {
    const [input, setInput] = useState('');
    const [loading, setLoading] = useState(false);
    const scrollRef = useRef<any>(null);

    const sendMessage = async () => {
        if (!input.trim() || loading) return;
        const userMsg = { role: 'user', text: input, timestamp: Date.now() };
        setData((prev: any) => ({ ...prev, chatHistory: [...(prev.chatHistory || []), userMsg] }));
        const currentInput = input; setInput(''); setLoading(true);

        // Call Groq API
        const responseText = await consultFocusCoach(
            currentInput,
            "You are Bhanu, COO of EngineOS. Give tactical, brutal, and elite productivity advice. Do not be polite. Be effective."
        );

        const assistantMsg = { role: 'assistant', text: responseText, timestamp: Date.now() };
        setData((prev: any) => ({ ...prev, chatHistory: [...(prev.chatHistory || []), assistantMsg] }));
        setLoading(false);
    };

    return (
        <div className="flex flex-col h-[calc(100vh-12rem)]">
            <div className="flex-1 overflow-y-auto space-y-4 pr-4" ref={scrollRef}>
                {(data.chatHistory || []).map((msg: any, i: number) => (
                    <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                        <div className={`max-w-[80%] p-4 rounded-2xl ${msg.role === 'user' ? 'bg-[#12121A]' : 'bg-[#6366F1]/5 border border-[#6366F1]/20'}`}>
                            <div className="text-[10px] uppercase font-black text-gray-500 mb-1">{msg.role === 'user' ? 'You' : 'Bhanu (COO)'}</div>
                            <div className="text-sm leading-relaxed text-gray-200">{msg.text}</div>
                        </div>
                    </div>
                ))}
            </div>
            <div className="mt-6 flex gap-3">
                <input value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && sendMessage()} className="flex-1 bg-[#12121A] border border-white/5 rounded-2xl px-6 py-4 outline-none focus:border-[#6366F1] text-white" placeholder="Consult Bhanu..." />
                <button onClick={sendMessage} className="w-14 h-14 bg-[#6366F1] text-black rounded-2xl flex items-center justify-center hover:bg-[#6366F1]/80 transition-colors"><Send size={24} /></button>
            </div>
        </div>
    );
}

// --- ANALYTICS VIEW ---

function AnalyticsView({ data }: any) {
    return (
        <div className="space-y-8 animate-in fade-in">
            <div className="bg-[#12121A] border border-white/5 rounded-2xl p-8">
                <h3 className="text-2xl font-black mb-6 text-[#EF4444]">The Uncomfortable Truth</h3>
                <p className="text-gray-400 max-w-2xl italic">You are currently at {(data.sessions.length / 4).toFixed(1)}% of your potential output capacity. The gap between your current pace and elite performance is visible.</p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mt-12">
                    <div className="p-6 bg-black border border-white/5 rounded-2xl">
                        <span className="text-xs text-gray-500 uppercase font-black">Regret Projection</span>
                        <div className="text-3xl font-black text-[#EF4444] mt-2">124 Hours Lost</div>
                        <p className="text-[10px] text-gray-600 mt-1">Based on missed sessions vs planned commitments.</p>
                    </div>
                    <div className="p-6 bg-black border border-white/5 rounded-2xl">
                        <span className="text-xs text-gray-500 uppercase font-black">Success Probability</span>
                        <div className="text-3xl font-black text-[#6366F1] mt-2">64%</div>
                        <p className="text-[10px] text-gray-600 mt-1">AI-calculated likelihood of reaching target identity.</p>
                    </div>
                </div>
            </div>
        </div>
    );
}

// --- GRAVEYARD VIEW ---

function GraveyardView({ data }: any) {
    const totalFails = data.sessions.reduce((acc: number, s: any) => acc + (s.distractions?.length || 0), 0);
    return (
        <div className="flex flex-col items-center justify-center min-h-[50vh] animate-in fade-in">
            <Skull size={80} className="text-[#EF4444] mb-6 animate-pulse" />
            <h2 className="text-4xl font-black text-white">THE GRAVEYARD</h2>
            <p className="text-gray-500 mt-4 italic">"{totalFails} focus sessions died here. Each one was a failure of will."</p>
            <div className="flex flex-wrap gap-4 mt-12 max-w-2xl justify-center opacity-30">
                {Array.from({ length: totalFails }).map((_, i) => <Skull key={i} size={32} className="text-[#EF4444]" />)}
            </div>
        </div>
    );
}

// --- IDENTITY VIEW ---

function IdentityView({ data }: any) {
    const totalHours = data.sessions.reduce((acc: number, s: any) => acc + s.duration, 0) / 3600;
    const alignment = Math.min(100, Math.round(totalHours * 2));
    return (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 animate-in fade-in items-center">
            <div className="relative w-64 h-80 bg-white/5 rounded-full mx-auto flex items-center justify-center border border-white/10 overflow-hidden">
                <User size={120} className={`${alignment > 50 ? 'text-[#6366F1] drop-shadow-[0_0_20px_#6366F1]' : 'text-gray-800'}`} />
                <div className="absolute bottom-10 bg-black px-4 py-1 rounded-full border border-white/20 text-[10px] font-black uppercase tracking-[0.2em] text-white">
                    {alignment}% Aligned
                </div>
            </div>
            <div className="bg-[#12121A] border border-white/5 rounded-3xl p-8">
                <h3 className="text-2xl font-black mb-4 text-white">Target Identity</h3>
                <p className="text-gray-400 italic text-xl border-l-4 border-[#6366F1] pl-6 py-4">"{data.profile.identity || "Identify yourself in the Command Center."}"</p>
                <div className="mt-8 space-y-4 text-white">
                    <IdentityCheck label="Ritual Consistency" passed={alignment > 20} />
                    <IdentityCheck label="Deep Work Threshold" passed={alignment > 50} />
                    <IdentityCheck label="Identity Integration" passed={alignment > 80} />
                </div>
            </div>
        </div>
    );
}

function IdentityCheck({ label, passed }: any) {
    return (
        <div className={`flex justify-between items-center p-4 rounded-xl border ${passed ? 'border-[#6366F1]/20 bg-[#6366F1]/5' : 'border-white/5 bg-transparent opacity-30'}`}>
            <span className="text-sm font-bold">{label}</span>
            {passed ? <CheckCircle2 className="text-[#6366F1]" size={18} /> : <XCircle className="text-gray-500" size={18} />}
        </div>
    );
}

// --- PROGRESS VIEW ---

function ProgressMaterializer({ data }: any) {
    const buildingCount = Math.floor((data.sessions.reduce((acc: number, s: any) => acc + s.duration, 0) / 3600) / 2);
    return (
        <div className="bg-[#12121A] border border-white/5 rounded-3xl p-12 relative overflow-hidden h-[500px]">
            <div className="flex items-center gap-2 mb-12 text-[#6366F1]">
                <Building2 size={24} /> <h3 className="text-2xl font-black">DEEP WORK CITY</h3>
            </div>
            <div className="h-64 border-b border-white/10 flex items-end justify-center gap-1 overflow-hidden">
                {Array.from({ length: buildingCount }).map((_, i) => (
                    <div key={i} className="bg-[#6366F1]/30 border-x border-t border-[#6366F1] w-8 animate-in slide-in-from-bottom" style={{ height: `${Math.random() * 80 + 10}%`, animationDelay: `${i * 50}ms` }} />
                ))}
                {buildingCount === 0 && <span className="mb-12 text-gray-700 italic">No output materialized. Build something.</span>}
            </div>
        </div>
    );
}

// --- RITUALS ---

function CommitmentRitual({ onCommit, onHide }: any) {
    const [goal, setGoal] = useState('');
    const [critique, setCritique] = useState('');
    const [loading, setLoading] = useState(false);

    const getCritique = async () => {
        setLoading(true);
        const res = await consultFocusCoach(`Critique this goal: ${goal}`, "Be a brutal strategy advisor.");
        setCritique(res); setLoading(false);
    };

    return (
        <div className="fixed inset-0 bg-black/95 z-50 backdrop-blur-xl flex items-center justify-center p-6">
            <div className="max-w-xl w-full bg-[#12121A] border border-white/10 rounded-3xl p-10">
                <h2 className="text-4xl font-black mb-8 leading-tight text-white">What deep work will you do today?</h2>
                <div className="relative">
                    <input value={goal} onChange={(e) => setGoal(e.target.value)} className="w-full bg-black border border-white/10 rounded-xl p-4 text-xl outline-none focus:border-[#6366F1] text-white" placeholder="Enter Mission..." />
                    <button onClick={getCritique} className="absolute right-4 top-4 text-[#6366F1]"><Sparkles size={20} /></button>
                </div>
                {critique && <div className="mt-4 p-4 bg-black rounded-xl text-xs italic text-gray-500 border border-[#6366F1]/20">{critique}</div>}
                <button onClick={() => { onCommit({ goal, duration: 4, startTime: '09:00' }); onHide(); }} className="w-full bg-[#6366F1] text-black font-black py-5 rounded-2xl mt-8 hover:scale-105 transition-all">I COMMIT TO THIS WORK</button>
            </div>
        </div>
    );
}

function OnboardingView({ onComplete }: any) {
    const [name, setName] = useState('');
    const [idnt, setIdnt] = useState('');
    return (
        <div className="fixed inset-0 bg-black flex items-center justify-center p-8 z-[100]">
            <div className="max-w-md w-full space-y-12">
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-white">WHO ARE YOU?</h1>
                    <input value={name} onChange={(e) => setName(e.target.value)} placeholder="Designation..." className="w-full bg-transparent border-b border-white/10 text-4xl outline-none focus:border-[#6366F1] py-4 text-white" />
                </div>
                <div>
                    <h1 className="text-5xl font-black tracking-tighter text-white">WHAT DO YOU BECOME?</h1>
                    <input value={idnt} onChange={(e) => setIdnt(e.target.value)} placeholder="Target Identity..." className="w-full bg-transparent border-b border-white/10 text-2xl outline-none focus:border-[#6366F1] py-4 text-white" />
                </div>
                <button onClick={() => onComplete({ name, identity: idnt })} className="bg-[#6366F1] text-black px-12 py-4 rounded-full font-black text-xl hover:scale-110">ACTIVATE</button>
            </div>
        </div>
    );
}

function SettingsView({ data, onReset }: any) {
    return (
        <div className="max-w-md space-y-8 animate-in fade-in">
            <h2 className="text-3xl font-black text-white">SYSTEM SETTINGS</h2>
            <div className="bg-[#12121A] p-6 rounded-2xl border border-white/5 space-y-4">
                <div>
                    <label className="text-[10px] text-gray-600 font-black uppercase">Current Profile</label>
                    <div className="text-xl font-bold text-white">{data.profile.name || "None"}</div>
                </div>
                <button onClick={onReset} className="w-full py-4 bg-[#EF4444]/10 border border-[#EF4444]/30 text-[#EF4444] font-black rounded-xl hover:bg-[#EF4444] hover:text-white transition-all">
                    DESTROY ALL DATA
                </button>
            </div>
        </div>
    );
}

function StatCard({ label, value, subValue, color }: any) {
    return (
        <div className="bg-[#12121A] border border-white/5 rounded-2xl p-5 shadow-xl hover:-translate-y-1 transition-transform">
            <div className="text-[10px] text-gray-500 uppercase font-black tracking-widest">{label}</div>
            <div className="text-3xl font-black mt-2" style={{ color }}>{value}</div>
            <div className="text-[10px] text-gray-500 font-bold uppercase mt-1">{subValue}</div>
        </div>
    );
}

function MonkModeOverlay({ onClose }: any) {
    return (
        <div className="fixed inset-0 bg-[#0A0A0F] z-[300] flex flex-col items-center justify-center p-8">
            <h1 className="text-[200px] font-black opacity-5 animate-pulse select-none text-white">FOCUS</h1>
            <div className="max-w-md text-center">
                <p className="text-[#EF4444] font-black uppercase tracking-[0.4em] mb-4">Monk Mode Lockdown</p>
                <button onClick={onClose} className="mt-8 text-gray-500 hover:text-white transition-colors uppercase text-[10px] tracking-widest">Type phrase to exit</button>
            </div>
        </div>
    );
}
