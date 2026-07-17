# StudySpark 3.0 ⚡

### *The AI-Powered Productivity Command Center for Academic Mastery*

**StudySpark** is a high-fidelity productivity web application designed to help students optimize focus, schedule deep study blocks, and leverage state-of-the-art AI to learn faster and retain more. By integrating active recall, spaced repetition, and brutal strategic AI coaching, StudySpark transforms passive studying into active mastery.

---

## 🚀 Key Features

*   **⚡ Deep Work Focus Engine**: Track and log deep work sessions with visual velocity heatmaps, focus intensities, and a gamified level-progression system.
*   **🔒 Monk Mode Lockdown**: A full-screen distraction-blocking interface designed to keep you centered during high-intensity study blocks.
*   **📅 AI Study Planner**: Input your exam deadlines and subjects to automatically generate a structured study calendar, distributed evenly to prevent cramming.
*   **📄 Interactive PDF Chat & Summarization**: Upload study PDFs to view them in-app, ask context-aware questions, and get instant summaries.
*   **🃏 Spaced-Repetition Flashcards**: Instantly generate active recall card decks from your pasted notes or textbooks.
*   **🧠 Custom Practice Exams**: Generate cheat-proof multiple-choice practice tests on any topic, complete with detailed explanations for correct and incorrect answers.
*   **💬 Bhanu (COO) AI Coach**: Consult Bhanu, an elite productivity commander trained to give brutal, strategic, and direct coaching to defeat procrastination.

---

## 🛠️ Technology Stack

*   **Frontend**: 
    *   **React 18** with **TypeScript** for robust component architecture.
    *   **Vite** for ultra-fast bundling and Hot Module Replacement (HMR).
    *   **Tailwind CSS** with **Shadcn UI** components for a clean, modern glassmorphism design.
    *   **Framer Motion** for premium interactive animations and screen transitions.
    *   **Recharts** for visualizing focus session logs and learning metrics.
    *   **React-PDF** for in-browser document parsing and annotation rendering.
*   **Backend**: 
    *   **Express** & **Node.js** running a unified API server.
    *   **Drizzle ORM** with **PostgreSQL** (`node-postgres`) for waitlist subscription logging.
    *   **Passport.js** for local session-based authentication routing structure.
*   **AI Integration**:
    *   **Groq SDK** utilizing the high-throughput **Llama 3.3 70B Versatile** model for high-speed, JSON-schema validated generations.
    *   **Zero-Config Mock Fallbacks**: Includes a robust local mock system that detects missing API keys and provides high-fidelity simulated responses, allowing instant local testing without setup friction.

---

## 📐 Architecture & Design System

The application is structured as a monorepo-style single-page app (SPA):
```
├── client/              # React frontend application
│   ├── src/
│   │   ├── components/  # Reusable UI & Dashboard components
│   │   ├── lib/         # Groq SDK & Firebase utility helpers
│   │   └── pages/       # Router layouts (Landing, Overview, Login)
├── server/              # Express backend server
│   ├── routes.ts        # API endpoint definitions
│   ├── storage.ts       # Database & Memory storage interfaces
│   └── index.ts         # Server entry point
├── shared/              # Zod schemas & TypeScript types shared between client/server
```

### Key Architectural Highlights:
1.  **Drizzle ORM Database Schema**: Simple database migration pipeline utilizing Drizzle Kit to sync database structures with PostgreSQL pools.
2.  **Graceful Degraded States**: Built-in mock mode intercepting Groq API queries if no valid `VITE_GROQ_API_KEY` is present.
3.  **Unified Build Pipeline**: Static asset compiler that builds React production assets directly into the Express server directory, simplifying deployment.

---

## 💻 Getting Started

### Prerequisites
*   Node.js (v18 or above recommended)
*   npm

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/Bhanu-teja-VCE/The-upgraded-study-spark-3.0.git
    cd The-upgraded-study-spark-3.0
    ```

2.  **Install dependencies**:
    ```bash
    npm install --legacy-peer-deps
    ```

3.  **Run in Development Mode**:
    ```bash
    npm run dev
    ```
    The application will start serving locally on `http://localhost:5000`.

4.  **Build for Production**:
    ```bash
    npm run build
    ```
