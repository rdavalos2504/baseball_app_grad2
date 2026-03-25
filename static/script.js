document.addEventListener("DOMContentLoaded", async () => {
    const select = document.getElementById("year-select");
    const teamsPanel = document.getElementById("teams-panel");
    const teamsContainer = document.getElementById("teams-container");

    try {
        const response = await fetch("/years");
        const years = await response.json();

        select.innerHTML = '<option value="">-- Choose a Year --</option>';
        years.forEach(year => {
            const option = document.createElement("option");
            option.value = year;
            option.textContent = year;
            select.appendChild(option);
        });
        select.disabled = false;
    } catch {
        select.innerHTML = '<option value="">Failed to load years</option>';
    }

    select.addEventListener("change", async () => {
        const year = select.value;
        if (!year) {
            teamsPanel.hidden = true;
            return;
        }

        teamsContainer.innerHTML = "<p class='loading'>Loading...</p>";
        teamsPanel.hidden = false;

        try {
            const response = await fetch(`/teams?year=${year}`);
            const leagues = await response.json();

            teamsContainer.innerHTML = "";
            for (const [league, teams] of Object.entries(leagues)) {
                const section = document.createElement("div");
                section.className = "league-section";

                const heading = document.createElement("h3");
                heading.textContent = league;
                section.appendChild(heading);

                const ul = document.createElement("ul");
                teams.forEach(name => {
                    const li = document.createElement("li");
                    li.textContent = name;
                    ul.appendChild(li);
                });
                section.appendChild(ul);

                teamsContainer.appendChild(section);
            }
        } catch {
            teamsContainer.innerHTML = "<p class='loading'>Failed to load teams</p>";
        }
    });
});
