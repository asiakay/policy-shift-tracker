document.addEventListener("DOMContentLoaded", function() {
    const resultsDiv = document.getElementById("results");
    const loadingDiv = document.getElementById("loading");
    const searchInput = document.getElementById("search-input");
    const searchButton = document.getElementById("search-button");
    const loadMoreButton = document.getElementById("load-more-button");
    const startDateInput = document.getElementById("start-date");
    const endDateInput = document.getElementById("end-date");

    let allResults = [];
    let displayedCount = 0;
    const resultsPerPage = 5;

    function getDefaultDate(daysAgo) {
        const date = new Date();
        date.setDate(date.getDate() - daysAgo);
        return date.toISOString().split("T")[0]; // Format YYYY-MM-DD
    }

    function fetchResults(searchTerm = "data") {
        resultsDiv.innerHTML = "";
        loadingDiv.style.display = "block";
        loadMoreButton.style.display = "none";

        let startDate = startDateInput.value || getDefaultDate(30); // Default: Last 30 days
        let endDate = endDateInput.value || getDefaultDate(0); // Default: Today

        if (new Date(startDate) > new Date(endDate)) {
            alert("⚠️ The start date must be before the end date.");
            loadingDiv.style.display = "none";
            return;
        }

        const url = "https://www.federalregister.gov/api/v1/documents.json";
        const params = new URLSearchParams({
            "conditions[term]": searchTerm,
            "conditions[publication_date][gte]": startDate,
            "conditions[publication_date][lte]": endDate,
            "per_page": 100
        });

        fetch(`${url}?${params}`)
            .then(response => response.json())
            .then(data => {
                console.log("API Response:", data);
                allResults = data.results;
                displayedCount = 0;

                if (allResults.length === 0) {
                    resultsDiv.innerHTML = "<p>No results found.</p>";
                    loadingDiv.style.display = "none";
                    return;
                }

                // ✅ Sort results by `publication_date` (newest first)
            allResults = data.results.sort((a, b) => new Date(b.publication_date) - new Date(a.publication_date));

            displayedCount = 0;
            loadingDiv.style.display = "none";
            displayNextResults();

            if (allResults.length > resultsPerPage) {
                loadMoreButton.style.display = "block";
            }
        })
        .catch(error => {
            console.error("Error fetching data:", error);
            loadingDiv.innerHTML = `<p style="color:red;">⚠️ Error loading data. Try refreshing.</p>`;
});
}
    function displayNextResults() {
        const slice = allResults.slice(displayedCount, displayedCount + resultsPerPage);
        slice.forEach(doc => {
            const entry = document.createElement("div");
            entry.classList.add("entry");

            const title = doc.title || "No Title Available";
            const publicationDate = doc.publication_date || "Unknown Date";

            let agencies = "Independent Publication";
            if (doc.agency_names && doc.agency_names.length > 0) {
                agencies = doc.agency_names.join(", ");
            } else if (doc.agencies && doc.agencies.length > 0) {
                agencies = doc.agencies.map(a => a.name).join(", ");
            }

            let fullTextUrl = doc.html_url || doc.full_text_xml_url || doc.pdf_url || null;
            if (!fullTextUrl && doc.document_number) {
                fullTextUrl = `https://www.federalregister.gov/documents/${doc.publication_date}/${doc.document_number}`;
            }

            const linkDisplay = fullTextUrl 
                ? `<a href="${fullTextUrl}" target="_blank" rel="noopener noreferrer">Read Full Text</a>`
                : `<span style="color: gray;">No Link Available</span>`;

            entry.innerHTML = `
                <div class="title">${title}</div>
                <div class="date"><strong>Published:</strong> ${publicationDate}</div>
                <div class="agency"><strong>Agency:</strong> ${agencies}</div>
                <div class="link">${linkDisplay}</div>
            `;

            resultsDiv.appendChild(entry);
        });

        displayedCount += resultsPerPage;

        if (displayedCount >= allResults.length) {
            loadMoreButton.style.display = "none";
        }
    }

    // Initial load with default term
    fetchResults();

    // Handle search button click
    searchButton.addEventListener("click", function() {
        const searchTerm = searchInput.value.trim();
        if (searchTerm === "") {
            alert("Please enter a search term!");
            return;
        }
        fetchResults(searchTerm);
    });

    // Enable "Enter" key search
    searchInput.addEventListener("keypress", function(event) {
        if (event.key === "Enter") {
            searchButton.click();
        }
    });

    // Load more results when button is clicked
    loadMoreButton.addEventListener("click", function() {
        displayNextResults();
    });
});