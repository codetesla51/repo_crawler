document.getElementById("searchButton").addEventListener("click", function () {
    const query = document.getElementById("searchQuery").value;
    const lang = document.getElementById("lang").value;
    const loader = document.getElementById("loader");
    const resultsContainer = document.getElementById("results");
    const resultsHeading = document.getElementById("resultsHeading");
    if (query) {
        loader.style.display = "block";
        resultsContainer.innerHTML = "";
        resultsHeading.style.display = "none";
        const url = `https://api.github.com/search/repositories?q=${encodeURIComponent(
            query
        )}${
            lang ? `+language:${encodeURIComponent(lang)}` : ""
        }&sort=stars&order=desc`;
        fetch(url, {
            method: "GET",
            headers: {
                "User-Agent": "repo/crawler"
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data.items && data.items.length > 0) {
                    data.items.forEach(item => {
                        const repoName = item.name;
                        const repoUrl = item.html_url;
                        const repoDescription = item.description
                            ? item.description
                            : "No description found";
                        const repoStars = item.stargazers_count;
                        const repoForks = item.forks_count;
                        const repoOwner = item.owner.login;
                        const repoAvatarUrl = item.owner.avatar_url;
                        const repoProfileUrl = item.owner.html_url;
                        const repoLanguage = item.language
                            ? item.language
                            : "Unknown";
                        const repoLicense =
                            item.license && item.license.name
                                ? item.license.name
                                : "No license";
                        const repoSize = (item.size / 1024).toFixed(2); // Size in MB
                        const repoLastUpdated = new Date(item.updated_at)
                            .toISOString()
                            .slice(0, 10);
                        const maxLength = 150;
                        const shortenedDescription =
                            repoDescription.length > maxLength
                                ? `${repoDescription.slice(0, maxLength)}...`
                                : repoDescription;
                        resultsContainer.innerHTML += `
              <div class='repo' data-aos='fade-up'>
                <h3><a href='${repoUrl}' target='_blank'>${repoName}</a></h3>
                <div class='desc'>
                  <p>${shortenedDescription}</p>
                  <div class='strs'>
                    <div class='stars'><i class='icon-copy bi bi-stars'></i>&nbsp;${repoStars}</div>
                    <div class='forks'><i class='icon-copy bi bi-share'></i>&nbsp; ${repoForks}</div>
                  </div>
                </div>
                <div class='additional-info'>
                  <p>Language: ${repoLanguage}</p>
                  <p>License: ${repoLicense}</p>
                  <p>Size: ${repoSize} MB</p>
                  <p>Last Updated: ${repoLastUpdated}</p>
                </div>
                <div class='owner'>
                  <div class='owner_img'>
                    <img class='own_img' src='${repoAvatarUrl}' alt='${repoOwner}' />
                  </div>
                  <div class='owner_name'>
                    <p>Repo Owner</p>
                    <h3><a href='${repoProfileUrl}' target='_blank'>${repoOwner}</a></h3>
                  </div>
                </div>
              </div>
            `;
                    });
                    resultsHeading.style.display = "block";
                } else {
                    resultsContainer.innerHTML =
                        "<p class='error'>No repositories found for the query.</p>";
                }
            })
            .catch(error => {
                console.error("Error fetching data:", error);
                resultsContainer.innerHTML =
                    "<p class='error'>Error fetching data. Please try again.</p>";
            })
            .finally(() => {
                loader.style.display = "none";
            });
    } else {
        resultsContainer.innerHTML =
            "<p class='error'>Please enter a search query.</p>";
    }
});

// Loader on window load
window.addEventListener("load", function () {
    var minimumLoaderTime = 3000; // 3 seconds
    setTimeout(function () {
        document.getElementById("loader-container").style.display = "none"; // Hide loader after timeout
    }, minimumLoaderTime);
});

// AOS Initialization
AOS.init();
