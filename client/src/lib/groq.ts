import Groq from "groq-sdk";

// --- GROQ SDK INITIALIZATION ---
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

const isMockMode = !GROQ_API_KEY || 
  GROQ_API_KEY === "your_groq_api_key_here" || 
  GROQ_API_KEY.toLowerCase().includes("mock") || 
  GROQ_API_KEY === "YOUR_GROQ_API_KEY";

let groq: Groq | null = null;
if (!isMockMode) {
    try {
        groq = new Groq({
            apiKey: GROQ_API_KEY,
            dangerouslyAllowBrowser: true,
        });
        console.log("Groq SDK initialized successfully.");
    } catch (e) {
        console.error("Groq SDK initialization failed:", e);
    }
} else {
    console.warn("Groq SDK running in MOCK mode. Dynamic fallback responses will be used.");
}

const getGroqClient = () => {
    if (!groq) {
        throw new Error("Groq SDK not initialized. Please check your API key.");
    }
    return groq;
};

export const summarizeText = async (text: string): Promise<string> => {
    if (isMockMode) {
        return `This is a simulated AI summary of your notes. Key Highlights:
1. Core Concepts: The uploaded material covers fundamental principles of the topic.
2. Structured Analysis: Definitions, relationships, and structural properties are outlined.
3. Key Takeaway: Continuous active recall and structured retrieval are recommended to master this content.`;
    }
    const completion = await getGroqClient().chat.completions.create({
        messages: [
            { role: "system", content: "Summarize the following text efficiently." },
            { role: "user", content: text }
        ],
        model: "llama-3.3-70b-versatile",
    });
    return completion.choices[0]?.message?.content || "";
};

interface FlashcardResponse {
    flashcards: Array<{ front: string; back: string }>;
}

export const generateFlashcards = async (content: string, count = 5): Promise<FlashcardResponse> => {
    if (isMockMode) {
        return {
            flashcards: [
                { front: "What is the primary goal of spaced repetition?", back: "To increase the interval of review to solidify memory retention over time and prevent forgetting." },
                { front: "Define active recall.", back: "Actively testing your memory instead of passively reading or highlighting notes." },
                { front: "How does StudySpark help with exam preparation?", back: "By using AI to auto-schedule study sessions and generate cheat-proof mock exams." },
                { front: "What is Monk Mode?", back: "A high-focus state where distractions are entirely locked out to build momentum." },
                { front: "Who is the COO of StudySpark?", back: "Bhanu, who provides tactical, elite productivity advice." }
            ].slice(0, count)
        };
    }
    const completion = await getGroqClient().chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Generate ${count} flashcards based on the user text. Output strictly JSON: { "flashcards": [{"front": "...", "back": "..."}] }`
            },
            { role: "user", content: content }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0]?.message?.content || "{}");
};

export const chatWithNote = async (history: Array<{ role: "user" | "system" | "assistant"; content: string }>, context: string): Promise<string> => {
    if (isMockMode) {
        const lastUserMessage = history.filter(m => m.role === 'user').pop()?.content || "";
        if (lastUserMessage.toLowerCase().includes("summarize") || lastUserMessage.toLowerCase().includes("summary")) {
            return `[Mock AI Assistant]: Here is a concise summary of the loaded material:
1. Core thesis: Active, focused study beats passive reading by a factor of 10.
2. Structure: Break files into core concepts, formulate quizzes, and test yourself under timer constraints.
3. Mindset: Limit distraction sessions. Aim for 4 hours of deep work daily.`;
        }
        return `[Mock AI Assistant]: I'm running in preview mode because no Groq API Key is configured. In response to your question: "${lastUserMessage}", here is a helpful study tip:
Try implementing the Feynman Technique—explain this concept to a child or peer. If you struggle with certain details, return to your notes.`;
    }
    try {
        const completion = await getGroqClient().chat.completions.create({
            messages: [
                { role: "system", content: `Context: ${context}` },
                ...history
            ],
            model: "llama-3.3-70b-versatile",
        });
        return completion.choices[0]?.message?.content || "";
    } catch (e: any) {
        console.error("Groq API Call Failed:", e);
        if (e?.error?.message) return `API Error: ${e.error.message}`;
        return "I'm having trouble connecting to the AI right now.";
    }
};

interface QuizResponse {
    quiz: Array<{
        q: string;
        options: string[];
        correct: number;
        explanation: string;
    }>;
}

export const generateQuiz = async (topic: string, difficulty: string, count = 5): Promise<QuizResponse> => {
    if (isMockMode) {
        return {
            quiz: [
                {
                    q: `What is the most effective study method for long-term retention of ${topic}?`,
                    options: ["Passive re-reading of text", "Active recall combined with spaced repetition", "Highlighting important terms", "Cramming the night before the exam"],
                    correct: 1,
                    explanation: "Active recall forces the brain to retrieve information, which strengthens neural pathways. Spaced repetition prevents the forgetting curve."
                },
                {
                    q: `When studying ${topic}, what does 'cognitive load' refer to?`,
                    options: ["The physical weight of textbook materials", "The total amount of mental effort being used in working memory", "The speed of typing lecture notes", "The time spent studying in a single sitting"],
                    correct: 1,
                    explanation: "Cognitive load theory states that working memory has a limited capacity, so information should be presented and processed in chunks."
                },
                {
                    q: `Which technique is recommended for deep focus sessions on ${topic}?`,
                    options: ["Multitasking with music and checking social media", "The Pomodoro Technique (focused blocks with short breaks)", "Studying for 12 hours straight without sleep", "Reading while sleeping"],
                    correct: 1,
                    explanation: "Structured intervals like the Pomodoro technique help sustain focus and prevent cognitive fatigue."
                },
                {
                    q: `What is a common pitfall when trying to master ${topic}?`,
                    options: ["Testing yourself too early in the cycle", "The illusion of competence (confusing recognition with recall)", "Explaining concepts to peers in simple terms", "Taking structured study breaks"],
                    correct: 1,
                    explanation: "Passive reading creates a false sense of familiarity, making you feel like you know the material when you actually cannot retrieve it independently."
                },
                {
                    q: `How can you integrate ${topic} concepts into your daily routine?`,
                    options: ["Avoid reviewing it until the exam day", "Apply the Feynman Technique (explaining it in simple terms)", "Memorize definitions verbatim without understanding them", "Write it down once and never look at it again"],
                    correct: 1,
                    explanation: "The Feynman Technique helps uncover gaps in your understanding by forcing you to simplify and explain the topic."
                }
            ].slice(0, count)
        };
    }
    const completion = await getGroqClient().chat.completions.create({
        messages: [
            {
                role: "system",
                content: `You are an examiner. Generate ${count} multiple-choice questions on ${topic}. Difficulty: ${difficulty}. Output strictly JSON format: { "quiz": [{ "q": "question", "options": ["a", "b", "c", "d"], "correct": 0, "explanation": "..." }] }`
            },
            { role: "user", content: `Generate quiz for ${topic}` }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0]?.message?.content || "{}");
};

export const createStudySchedule = async (examDate: string, subjects: string[], hoursPerDay: number) => {
    if (isMockMode) {
        const mockEvents = [];
        const today = new Date();
        const subList = subjects.length > 0 && subjects[0] !== "" ? subjects : ["Calculus", "General Chemistry", "Digital Logic Design"];
        for (let i = 0; i < Math.min(subList.length, 5); i++) {
            const start = new Date(today);
            start.setDate(today.getDate() + i);
            start.setHours(9 + i, 0, 0, 0);
            const end = new Date(start);
            end.setHours(start.getHours() + 2);
            mockEvents.push({
                title: `Deep Study: ${subList[i]}`,
                start: start.toISOString(),
                end: end.toISOString(),
                type: "review"
            });
        }
        return { events: mockEvents };
    }
    const completion = await getGroqClient().chat.completions.create({
        messages: [
            {
                role: "system",
                content: `Create a study schedule ending on ${examDate}. Allocate time ONLY for these specific subjects: ${subjects.join(", ")}. 
                IMPORTANT rules for scheduling:
                1. If a subject implies a single task (e.g., "Assignment", "Homework", "Read Chapter"), schedule it ONCE on the nearest available slot. DO NOT REPEAT it.
                2. If a subject implies exam preparation (e.g., "Finals", "Exam", "Course Review"), distribute study sessions evenly up to ${examDate}.
                3. Do NOT add filler events like 'Break' or 'group study'.
                Output strictly JSON object: { "events": [{ "title": "Topic", "start": "ISO_DATE", "end": "ISO_DATE", "type": "review" }] }`
            },
            { role: "user", content: "Generate schedule, strictly following the repetition rules." }
        ],
        model: "llama-3.3-70b-versatile",
        response_format: { type: "json_object" }
    });
    return JSON.parse(completion.choices[0]?.message?.content || "{}");
};

export const consultFocusCoach = async (message: string, systemInstruction: string = "You are an elite productivity commander. Your tone is brutal, efficient, and highly strategic."): Promise<string> => {
    if (isMockMode) {
        if (message.toLowerCase().includes("fail") || message.toLowerCase().includes("broke")) {
            return "Focus broken. Excuses are the currency of the mediocre. Reset your environment, lock your phone in another room, and start a new session. No more talking. Build.";
        }
        return "Bhanu here. Plan execution is the only metric that matters. Put in a solid block of deep work right now. Action overrides anxiety. Go build something.";
    }
    try {
        const completion = await getGroqClient().chat.completions.create({
            messages: [
                { role: "system", content: systemInstruction },
                { role: "user", content: message }
            ],
            model: "llama-3.3-70b-versatile",
        });
        return completion.choices[0]?.message?.content || "Communication failure.";
    } catch (e: any) {
        console.error("Focus Coach API Failed:", e);
        return "Commander is offline. Check connection.";
    }
};
