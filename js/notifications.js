const mailgunDomain = "sandboxaf59fc399a75443c93715f23d7769923.mailgun.org";
const mailgunApiKey = "bb5774d74533d210294bf142cd6b42c7-667818f5-adc68a02";

// 🔥 Initialize Firebase Firestore
if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
}
const db = firebase.firestore();

// ✅ Declare Firestore collection reference
const subscribersCollection = db.collection("subscribers");

// 🔔 Request Browser Notification Permission
function requestNotificationPermission() {
    if ("Notification" in window) {
        Notification.requestPermission().then(permission => {
            if (permission === "granted") {
                alert("✅ Notifications enabled!");
            } else {
                alert("❌ Notifications denied by user.");
            }
        });
    }
}

// 📩 Subscribe to Email Alerts (Stores in Firebase)
document.getElementById("subscribeForm").addEventListener("submit", function(event) {
    event.preventDefault();
    const email = document.getElementById("emailInput").value.trim();

    if (!email) {
        alert("❌ No email entered!");
        return;
    }

    alert("📩 Attempting to store email: " + email);

    subscribersCollection.add({ email: email })
    .then(() => {
        alert("✅ Email stored successfully: " + email);
        document.getElementById("emailInput").value = "";  // Clear input
        loadSubscribers();  // Refresh UI list
    })
    .catch(error => {
        console.error("❌ Firebase Error:", error);
        alert("❌ Error storing email: " + error.message);
    });
});

// 🔄 Load Subscribers from Firebase & Display on Page
function loadSubscribers() {
    const list = document.getElementById("subscribersList");
    if (!list) return;

    list.innerHTML = "";  // Clear old data
    subscribersCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            const email = doc.data().email;

            const li = document.createElement("li");
            li.textContent = email;
            list.appendChild(li);
        });
    }).catch(error => {
        console.error("❌ Error loading subscribers:", error);
        alert("❌ Error loading subscribers: " + error.message);
    });
}

// 📩 Send Policy Alert to All Subscribers
function sendEmailAlert(policyTitle, policyUrl) {
    subscribersCollection.get().then(snapshot => {
        snapshot.forEach(doc => {
            const email = doc.data().email;

            alert(`📩 Sending email to: ${email}`);

            fetch("https://api.mailgun.net/v3/" + mailgunDomain + "/messages", {
                method: "POST",
                headers: {
                    "Authorization": "Basic " + btoa("api:" + mailgunApiKey),
                    "Content-Type": "application/x-www-form-urlencoded"
                },
                body: new URLSearchParams({
                    from: "Policy Alerts <mailgun@" + mailgunDomain + ">",
                    to: email,
                    subject: "🚨 New Policy Alert!",
                    text: `A new policy has been published: ${policyTitle}\nRead more: ${policyUrl}`
                })
            })
            .then(response => response.json())
            .then(data => {
                alert(`📩 Mailgun Response: ${JSON.stringify(data)}`);
                console.log("📩 Mailgun Response:", data);
            })
            .catch(error => {
                console.error("❌ Mailgun Error:", error);
                alert(`❌ Email Error: ${error.message}`);
            });
        });
    }).catch(error => {
        console.error("❌ Error fetching subscribers:", error);
        alert("❌ Error fetching subscribers: " + error.message);
    });
}

// 🔔 Send Browser Notification for New Policy Alerts
function sendBrowserNotification(policyTitle, policyUrl) {
    if (Notification.permission === "granted") {
        new Notification("🚨 New Policy Alert!", {
            body: policyTitle,
            icon: "icon.png",
            onclick: function () {
                window.open(policyUrl);
            }
        });
    } else {
        alert("❌ Browser notifications are not enabled.");
    }
}

// 🔍 Check for New Policies & Notify Users
let lastChecked = new Date();

function checkForNewPolicies(policies) {
    policies.forEach(policy => {
        let policyDate = new Date(policy.publication_date);
        if (policyDate > lastChecked) {
            alert("🔔 New policy found: " + policy.title);
            sendEmailAlert(policy.title, policy.html_url); // 📩 Email All Subscribers!
            sendBrowserNotification(policy.title, policy.html_url); // 🔔 Send Browser Notification
        }
    });

    lastChecked = new Date();
}

// 🎛 Enable Notifications Button
document.getElementById("enableNotifications").addEventListener("click", requestNotificationPermission);

// 🔄 Load Subscribers on Page Load
document.addEventListener("DOMContentLoaded", loadSubscribers);