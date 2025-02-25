const watchlistTopics = {
    musk: ["Musk", "SpaceX", "Starlink", "Neuralink"],
    ai: ["AI", "Artificial Intelligence", "Machine Learning"],
    executive: ["Executive Order", "Presidential Order"]
};

function loadPreferences() {
    let userKeywords = JSON.parse(localStorage.getItem("notificationKeywords")) || Object.values(watchlistTopics).flat();
    console.log("✅ Loaded user preferences:", userKeywords);
}

document.getElementById("savePreferences").addEventListener("click", function () {
    let selectedTopics = [];
    for (let topic in watchlistTopics) {
        if (document.getElementById(topic).checked) {
            selectedTopics = selectedTopics.concat(watchlistTopics[topic]);
        }
    }
    localStorage.setItem("notificationKeywords", JSON.stringify(selectedTopics));
    alert("✅ Your preferences have been saved!");
});
