import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// --- MOCK FIREBASE CONFIGURATION (For UI Preview) ---
// User requested to bypass backend persistence to view the interface.
console.warn("%c FIREBASE MOCKED ", "background: #222; color: #bada55", "Backend features will not persist. Groq API is still active.");

const firebaseConfig = {
    apiKey: "mock_key_for_ui_preview",
    authDomain: "mock.firebaseapp.com",
    projectId: "mock-project",
    storageBucket: "mock.appspot.com",
    messagingSenderId: "000000000",
    appId: "1:0000:web:mock"
};

// Initialize app with mock config so the SDK object exists
const app = initializeApp(firebaseConfig);

// Export auth/db/storage instances. 
// Note: Actual network requests to Firebase will fail or be no-ops, but the UI won't crash on load.
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);
