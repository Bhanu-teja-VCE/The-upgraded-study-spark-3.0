import Groq from "groq-sdk";

const groq = new Groq({
    apiKey: process.env.GROQ_API_KEY || "YOUR_GROQ_API_KEY"
});

async function main() {
    try {
        const history = [
            { role: "assistant", content: "Hi! Upload a PDF to get started. I can summarize it or answer any questions." },
            { role: "user", content: "Hello" }
        ];
        const context = "No document loaded.";

        console.log("Testing with context and history...");
        const completion = await groq.chat.completions.create({
            messages: [
                { role: "system", content: `Context: ${context}` },
                ...history
            ] as any,
            model: "llama-3.3-70b-versatile",
        });

        console.log("Full Response Structure:");
        console.dir(completion, { depth: null });

        const content = completion.choices[0]?.message?.content;
        console.log("Content:", content);
    } catch (error) {
        console.error("Error:", error);
    }
}

main();
