import { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./lib/queryClient";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/toaster";
import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import DashboardOverview from "@/pages/dashboard/Overview";
import { Chat } from "@/components/dashboard/Chat";
import { Flashcards } from "@/components/dashboard/Flashcards";
import { Quiz } from "@/components/dashboard/Quiz";
import { Planner } from "@/components/dashboard/Planner";
import FocusMode from "@/components/dashboard/FocusMode";
import { Notes } from "@/components/dashboard/Notes";
import Settings from "@/components/dashboard/Settings";

// Auth is disabled for UI preview mode
// When Firebase is properly configured, uncomment AuthProvider and ProtectedRoute

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider defaultTheme="dark" storageKey="vite-ui-theme">
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />

            {/* Dashboard Routes of Preview */}
            <Route path="/dashboard" element={<DashboardLayout />}>
              <Route index element={<DashboardOverview />} />
              <Route path="notes" element={<Notes />} />
              <Route path="chat" element={<Chat />} />
              <Route path="flashcards" element={<Flashcards />} />
              <Route path="quiz" element={<Quiz />} />
              <Route path="planner" element={<Planner />} />
              <Route path="focus" element={<FocusMode />} />
              <Route path="settings" element={<Settings />} />
            </Route>

            <Route path="*" element={<NotFound />} />
          </Routes>
          <Toaster />
        </Router>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

// Shared Layout Component to handle the Cursor Logic
const AuthLayout = ({ children, title, subtitle }: { children: React.ReactNode; title: string; subtitle: string }) => {
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const updateMousePosition = (ev: MouseEvent) => {
      setMousePosition({ x: ev.clientX, y: ev.clientY });
    };
    window.addEventListener('mousemove', updateMousePosition);
    return () => {
      window.removeEventListener('mousemove', updateMousePosition);
    };
  }, []);

  return (
    <div className="min-h-screen bg-[#050507] flex items-center justify-center p-4 relative overflow-hidden font-sans selection:bg-[#6366F1] selection:text-black">

      {/* 1. The Interactive Cursor Spotlight (Background) */}
      <div
        className="pointer-events-none fixed inset-0 z-0 transition-opacity duration-300"
        style={{
          background: `radial-gradient(600px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(99, 102, 241, 0.15), transparent 80%)`
        }}
      />

      {/* 2. Static Ambient Background Glows (Deep Purple/Blue) */}
      <div className="absolute top-[-10%] left-[-10%] w-96 h-96 bg-purple-600/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-cyan-600/10 rounded-full blur-[128px] pointer-events-none" />

      {/* 3. The Glass Card */}
      <div className="w-full max-w-md relative z-10">
        <div className="absolute inset-0 bg-gradient-to-b from-white/5 to-white/0 rounded-2xl -z-10 blur-sm" />

        <div className="bg-[#0A0A0F]/60 backdrop-blur-xl border border-white/10 rounded-2xl p-8 shadow-2xl relative overflow-hidden group">

          {/* Subtle sheen effect on the card that moves opposite to cursor (optional parallax feel) */}
          <div
            className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{
              background: `radial-gradient(400px circle at ${mousePosition.x}px ${mousePosition.y}px, rgba(255,255,255,0.03), transparent 40%)`
            }}
          />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-white tracking-tight mb-2">{title}</h1>
            <p className="text-gray-400 text-sm">{subtitle}</p>
          </div>

          {children}

        </div>
      </div>
    </div>
  );
};

// Reusable Input Component
const InputField = ({ type, placeholder }: { type: string; placeholder: string }) => (
  <div className="group relative">
    <input
      type={type}
      placeholder=" "
      className="peer w-full p-4 bg-[#12121A] border border-white/5 rounded-xl text-white outline-none focus:border-[#6366F1]/50 transition-all duration-300 placeholder-transparent z-10 relative"
    />
    <label className="absolute left-4 top-4 text-gray-500 text-sm transition-all duration-300 peer-placeholder-shown:text-base peer-placeholder-shown:top-4 peer-focus:-top-2.5 peer-focus:text-xs peer-focus:text-[#6366F1] peer-focus:bg-[#0A0A0F] peer-focus:px-1 pointer-events-none z-20">
      {placeholder}
    </label>
    {/* Glow effect on input focus */}
    <div className="absolute inset-0 rounded-xl bg-[#6366F1] opacity-0 peer-focus:opacity-5 blur-md transition-opacity duration-300 pointer-events-none" />
  </div>
);

// Login Page
export function LoginPage() {
  return (
    <AuthLayout title="Welcome Back" subtitle="Sign in to continue your streak on StudySpark">
      <div className="space-y-5">
        <InputField type="email" placeholder="Email Address" />
        <InputField type="password" placeholder="Password" />

        <div className="flex justify-end">
          <a href="#" className="text-xs text-gray-400 hover:text-[#6366F1] transition-colors">
            Forgot Password?
          </a>
        </div>

        <a href="/dashboard" className="block">
          <button className="w-full py-4 bg-gradient-to-r from-[#6366F1] to-[#0099FF] text-black font-bold rounded-xl hover:shadow-[0_0_40px_rgba(99, 102, 241,0.3)] transform transition-all duration-300 active:scale-95 relative overflow-hidden group">
            <span className="relative z-10">Sign In</span>
            {/* Button internal shine */}
            <div className="absolute inset-0 h-full w-full scale-0 rounded-2xl transition-all duration-300 group-hover:scale-100 group-hover:bg-white/20"></div>
          </button>
        </a>

        <p className="text-center text-gray-500 text-sm mt-6">
          Don't have an account?{" "}
          <a href="/register" className="text-[#6366F1] hover:text-[#6366F1]/80 font-medium transition-colors">
            Sign up
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}

// Register Page
export function RegisterPage() {
  return (
    <AuthLayout title="Create Account" subtitle="Join StudySpark and master your productivity">
      <div className="space-y-5">
        <InputField type="text" placeholder="Full Name" />
        <InputField type="email" placeholder="Email Address" />
        <InputField type="password" placeholder="Password" />

        <a href="/dashboard" className="block mt-2">
          <button className="w-full py-4 bg-gradient-to-r from-[#8B5CF6] to-[#6366F1] text-white font-bold rounded-xl hover:shadow-[0_0_40px_rgba(139,92,246,0.3)] transform transition-all duration-300 active:scale-95">
            Create Account
          </button>
        </a>

        <p className="text-center text-gray-500 text-sm mt-6">
          Already have an account?{" "}
          <a href="/login" className="text-[#6366F1] hover:text-[#6366F1]/80 font-medium transition-colors">
            Sign in
          </a>
        </p>
      </div>
    </AuthLayout>
  );
}

export default App;
