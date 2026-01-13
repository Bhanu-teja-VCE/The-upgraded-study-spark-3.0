import Groq from "groq-sdk";

// --- GROQ SDK INITIALIZATION ---
const GROQ_API_KEY = import.meta.env.VITE_GROQ_API_KEY || "";

let groq: Groq | null = null;
try {
    groq = new Groq({
        apiKey: GROQ_API_KEY,
        dangerouslyAllowBrowser: true,
    });
    console.log("Groq SDK initialized successfully.");
} catch (e) {
    console.error("Groq SDK initialization failed:", e);
}

const getGroqClient = () => {
    if (!groq) {
        throw new Error("Groq SDK not initialized. Please check your API key.");
    }
    return groq;
};

export const summarizeText = async (text: string): Promise<string> => {
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
