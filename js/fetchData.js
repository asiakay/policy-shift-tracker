let currentPage = 1; // Tracks current page for pagination
const policiesPerPage = 10; // Number of policies per request

async function fetchAndUpdate(resetPage = true) {
  if (resetPage) {
    currentPage = 1; // Reset page count on new search
    document.getElementById("policyList").innerHTML = ""; // Clear previous results
  }

  let keyword = document.getElementById("searchInput").value.trim();
  let startDate = document.getElementById("startDate").value;
  let endDate = document.getElementById("endDate").value;

  let apiUrl = `https://www.federalregister.gov/api/v1/documents.json?per_page=${policiesPerPage}&page=${currentPage}`;

  if (keyword) {
    apiUrl += `&conditions[term]=${encodeURIComponent(keyword)}`;
  }
  if (startDate) {
    apiUrl += `&conditions[publication_date][gte]=${startDate}`;
  }
  if (endDate) {
    apiUrl += `&conditions[publication_date][lte]=${endDate}`;
  }

  //alert(`📡 Fetching from API: ${apiUrl}`);

  try {
    const response = await fetch(apiUrl);
    if (!response.ok)
      throw new Error(`❌ API responded with status: ${response.status}`);

    const data = await response.json(); // ✅ This must be outside the `if (!response.ok)`

    if (data.results.length > 0) {
      displayPolicies(data.results);
      currentPage++; // move to the next page for next calls
      document.getElementById("loadMoreButton").style.display = "block"; // show load more button
    } else {
      document.getElementById("loadMoreButton").style.display = "none"; //  hide button if no more results
    }
  } catch (error) {
    console.error("❌ API Fetch Error:", error);
  }
}

/*  
    if (!data.results || data.results.length === 0) {
      console.warn("📭 No policies found.");
      document.getElementById("policyList").innerHTML =
        "<p>📭 No policy updates available.</p>";
      return;
    }

    // ✅ Append new policies without clearing previous
    displayPolicies(data.results);
    isFetching = false; // unlock fetch after success
  } catch (error) {
    console.error("❌ API Fetch Error:", error);
    isFetching = false; // unlock fetch even if error occors
  }
}
// Load more policies when scrolling
window.addEventListener("scroll", () => {
  if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 50) {
    if (!isFetching) {
      currentPage++; // Increment page
      fetchAndUpdate(false); // Fetch new batch of documents
    }
  }
});
*/

// ✅ Display policies in the UI
function displayPolicies(policies) {
  const policyList = document.getElementById("policyList");

  if (!policyList) {
    console.error("❌ ERROR: #policyList element not found in HTML.");
    return;
  }

  // ✅ Sort policies by publication_date (newest first)

  policies.sort(
    (a, b) => new Date(b.publication_date) - new Date(a.publication_date)
  );

  policyList.innerHTML = ""; // ✅ Clear previous results

  if (policies.length === 0) {
    policyList.innerHTML = "<p>📭 No policy updates available.</p>";

    console.warn("📭 No policies found.");
    return;
  }

  policies.forEach((policy) => {
    console.log("📄 Processing policy:", policy.title);

    const policyCard = document.createElement("div");
    policyCard.classList.add("policy-card");

    let title = policy.title || "Untitled Policy";
    let date = policy.publication_date || "Unknown Date";
    let url = policy.html_url || "#";
    let department =
      policy.agencies && policy.agencies.length > 0
        ? policy.agencies[0].name
        : "Unknown Department";

    policyCard.innerHTML = `
            <div class="policy-header">
                <h2>${title}</h2>
            </div>
            <div class="policy-body">
                <p><strong>📅 Published:</strong> ${date}</p>
                <p>🏛️ <strong>Agency:</strong> ${department}</p>
            </div>
            <div class="policy-footer">
                <a href="${url}" target="_blank" class="read-more">🔗 Read Full Text</a>
            </div>
        `;

    policyList.appendChild(policyCard);
  });

  console.log("✅ Policies displayed:", policies.length);
}

// ✅ Auto-load policies on page load
document.addEventListener("DOMContentLoaded", function () {
  alert("🚀 Page Loaded. Fetching policies...");
  fetchAndUpdate();
});

// ✅ Ensure functions are globally accessible
// window.fetchAndUpdate = fetchAndUpdate;

// 🔍 Trigger search on button click
document.getElementById("searchButton").addEventListener("click", function () {
  alert("🔍 Search triggered");
  fetchAndUpdate(true); // pass true to reset results
});
