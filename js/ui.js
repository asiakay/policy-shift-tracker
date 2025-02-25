function displayPolicies(policies) {
    const container = document.querySelector("#policyContainer");
    if (!container) {
        console.error("❌ Container not found in the DOM!");
        return;
    }

    container.innerHTML = ""; // Clear old policies

    policies.forEach(policy => {
        const card = document.createElement("div");
        card.classList.add("policy-card");

        card.innerHTML = `
            <h3>${policy.title}</h3>
            <p class="policy-meta">📅 Published: ${policy.publication_date}</p>
            <p class="policy-meta">🏛️ Agency: ${policy.agencies ? policy.agencies.map(a => a.name).join(", ") : "Unknown"}</p>
            <a href="${policy.html_url}" target="_blank">Read Full Text</a>
        `;

        container.appendChild(card);
    });
}