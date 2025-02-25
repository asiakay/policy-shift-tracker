self.addEventListener("install", event => {
    console.log("Service Worker installed.");
});

self.addEventListener("fetch", event => {
    // Allows the app to run offline (optional)
});