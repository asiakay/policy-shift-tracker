document.addEventListener("DOMContentLoaded", function () {
    console.log("📢 Checking Firebase...");

const firebaseConfig = {
    
    apiKey: "AIzaSyDCaJXsFvvEu7bh-igyLHYKZL4jyH9PDoE",
    authDomain: "pol-tracker.firebaseapp.com",
    projectId: "pol-tracker'",
    storageBucket: "pol-tracker.firebasestorage.app",
    messagingSenderId: "60506082718",
    appId: "1:60506082718:web:e81e5604e586f1fcc75a8f",
    measurementId: "G-DLKQ4FN98W"
  };


// ✅ Initialize Firebase (Only if not already initialized)
    if (!firebase.apps.length) {
        firebase.initializeApp(firebaseConfig);
        console.log("✅ Firebase Initialized Successfully");
    } else {
        console.log("🔄 Firebase Already Initialized");
    }

    // ✅ Make Firebase Firestore Available Globally
    const db = firebase.firestore();
    window.db = db;

    console.log("✅ Firestore Database Ready");
});