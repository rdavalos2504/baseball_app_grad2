document.addEventListener("DOMContentLoaded", async () => {
    const select = document.getElementById("year-select");
    const teamsPanel = document.getElementById("teams-panel");
    const teamsContainer = document.getElementById("teams-container");
    const playersPanel = document.getElementById("players-panel");
    const playersHeading = document.getElementById("players-heading");
    const playersList = document.getElementById("players-list");

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
            playersPanel.hidden = true;
            return;
        }

        teamsContainer.innerHTML = "<p class='loading'>Loading...</p>";
        teamsPanel.hidden = false;
        playersPanel.hidden = true;

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
                teams.forEach(team => {
                    const li = document.createElement("li");
                    li.textContent = team.name;
                    li.classList.add("team-item");
                    li.addEventListener("click", () => loadPlayers(year, team.teamID, team.name));
                    ul.appendChild(li);
                });
                section.appendChild(ul);

                teamsContainer.appendChild(section);
            }
        } catch {
            teamsContainer.innerHTML = "<p class='loading'>Failed to load teams</p>";
        }
    });

    async function loadPlayers(year, teamID, teamName) {
        playersHeading.textContent = teamName;
        playersList.innerHTML = "<li class='loading'>Loading...</li>";
        playersPanel.hidden = false;

        try {
            const response = await fetch(`/players?year=${year}&teamID=${teamID}`);
            const players = await response.json();

            playersList.innerHTML = "";
            players.forEach(player => {
                const li = document.createElement("li");
                li.textContent = `${player.firstName} ${player.lastName}`;
                playersList.appendChild(li);
            });
        } catch {
            playersList.innerHTML = "<li class='loading'>Failed to load players</li>";
        }
    }
});
