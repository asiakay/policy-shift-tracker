document.addEventListener("DOMContentLoaded", function () {
    console.log("🚀 App is starting...");

    // ✅ Ensure policies load automatically on page load
    if (typeof fetchAndUpdate === "function") {
        fetchAndUpdate();  
    } else {
        console.error("❌ fetchAndUpdate is not defined. Check script order.");
    }
  
    // ✅ Add event listener for "Load More" button
    const loadMoreButton = document.getElementById("loadMoreButton");
  
    if (loadMoreButton) {
        loadMoreButton.addEventListener("click", function () {
            console.log("🔄 Load More button clicked...");
            fetchAndUpdate(false); // Fetch next page without resetting
        });
    } else {
        console.error("❌ Load More button not found. Check if it exists in HTML.");
    }

    // ✅ Ensure Firebase is Ready
    let waitForFirebase = setInterval(() => {
        if (typeof firebase !== "undefined" && firebase.apps.length) {
            clearInterval(waitForFirebase); // Stop checking
            console.log("✅ Firebase is Ready!");

            // ✅ Listen for Email Submissions
            const subscribeForm = document.getElementById("subscribeForm");
            if (subscribeForm) {
                subscribeForm.addEventListener("submit", function (event) {
                    event.preventDefault(); // Prevent page refresh

                    const email = document.getElementById("emailInput").value.trim();
                    if (!email) {
                        alert("❌ Please enter a valid email.");
                        return;
                    }

                    console.log("📩 Subscribing user:", email);

                    // 🔥 Store Email in Firestore
                    window.db.collection("subscribers").add({
                        email: email,
                        timestamp: firebase.firestore.FieldValue.serverTimestamp()
                    })
                    .then(() => {
                        alert("✅ Successfully subscribed!");
                        document.getElementById("emailInput").value = ""; // Clear input field
                    })
                    .catch(error => {
                        console.error("❌ Error adding email:", error);
                        alert("❌ Error subscribing. Try again later.");
                    });
                });
            } else {
                console.error("❌ Subscribe form not found. Check if it exists in HTML.");
            }
        }
    }, 500); // ✅ Check every 500ms until Firebase is ready
});