import { app, setupApp } from "./app";
import * as functions from "firebase-functions";

// Initialize the app when the function is loaded
// Note: registerRoutes is async, but we can't await it at top level easily in CJS-compatible cloud functions without a wrapper.
// However, 'app' is an express app. We can attach routes to it.
// If setupApp just attaches routes, we can call it.
// But we need to make sure it completes before handling requests.
// We can wrap the handler.

let isInitialized = false;

const apiHandler = functions.https.onRequest(async (req, res) => {
    if (!isInitialized) {
        await setupApp();
        isInitialized = true;
    }
    app(req, res);
});

export { apiHandler };
