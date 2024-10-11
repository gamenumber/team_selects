document.addEventListener("DOMContentLoaded", () => {
    const addButton = document.querySelector('button[onclick="addName()"]');
    const nameList = document.getElementById("nameList");
    const teamsOutput = document.getElementById("teamsOutput");
    const membersPerTeamInput = document.getElementById("membersPerTeamInput");

    // Add name with avatar
    window.addName = function () {
        const nameInput = document.getElementById("nameInput");
        const avatarInput = document.getElementById("avatarInput");

        const name = nameInput.value.trim();
        const file = avatarInput.files[0];

        if (name === "" || !file) {
            alert("이름과 아바타를 입력해주세요.");
            return;
        }

        const newCard = document.createElement("li");
        newCard.classList.add("card");
        const reader = new FileReader();

        reader.onload = function (e) {
            newCard.innerHTML = `
                <img src="${e.target.result}" alt="Avatar">
                <span>${name}</span>
                <button class="delete-btn">삭제</button>
            `;
            nameList.appendChild(newCard);
            animateCard(newCard);
        };
        reader.readAsDataURL(file);
        nameInput.value = ""; // Clear input field
        avatarInput.value = ""; // Clear file input
    };

    // Animate new card
    function animateCard(card) {
        card.animate(
            [
                { transform: "scale(0)", opacity: 0 }, // Initial state
                { transform: "scale(1)", opacity: 1 }, // End state
            ],
            {
                duration: 500,
                easing: "ease-out",
                fill: "forwards",
            }
        );
    }

    // Delete button functionality
    nameList.addEventListener("click", (e) => {
        if (e.target.classList.contains("delete-btn")) {
            const card = e.target.parentElement;
            fadeOutCard(card);
        }
    });

    // Fade out effect
    function fadeOutCard(card) {
        card.animate(
            [
                { opacity: 1 }, // Initial state
                { opacity: 0 }, // End state
            ],
            {
                duration: 500,
                easing: "ease-in",
                fill: "forwards",
            }
        ).onfinish = () => {
            card.remove(); // Remove from DOM after fade out
        };
    }

    // Generate teams based on member count
    window.generateTeams = function () {
        const membersPerTeam = parseInt(membersPerTeamInput.value);
        const members = Array.from(nameList.children).map((card) => {
            return {
                name: card.querySelector("span").innerText,
                avatar: card.querySelector("img").src,
            };
        });

        const teams = [];
        while (members.length) {
            const team = members.splice(0, membersPerTeam);
            teams.push(team);
        }

        displayTeams(teams);
    };

    // Display teams
    function displayTeams(teams) {
        teamsOutput.innerHTML = ""; // Clear previous output
        teams.forEach((team, index) => {
            const teamDiv = document.createElement("div");
            teamDiv.classList.add("team");
            teamDiv.innerHTML = `<strong>팀 ${index + 1}</strong>`;

            team.forEach((member) => {
                const memberDiv = document.createElement("div");
                memberDiv.classList.add("card");
                memberDiv.innerHTML = `
                    <img src="${member.avatar}" alt="Avatar">
                    <span>${member.name}</span>
                    <button class="delete-team-btn">삭제</button>
                `;
                teamDiv.appendChild(memberDiv);

                // Animate the new member card
                animateCard(memberDiv);
            });
            teamsOutput.appendChild(teamDiv);
        });
    }

    // Clear all names
    window.clearAllNames = function () {
        while (nameList.firstChild) {
            fadeOutCard(nameList.firstChild);
        }
        teamsOutput.innerHTML = ""; // Clear teams output
    };

    // Download teams as image (using html2canvas)
    window.downloadTeams = function () {
        html2canvas(teamsOutput).then((canvas) => {
            const link = document.createElement("a");
            link.href = canvas.toDataURL("image/png");
            link.download = "teams.png";
            link.click();
        });
    };

    // Rotate cards on hover
    nameList.addEventListener("mouseover", (e) => {
        if (e.target.closest(".card")) {
            const card = e.target.closest(".card");
            card.animate(
                [
                    { transform: "rotateY(0deg)" }, // Initial state
                    { transform: "rotateY(20deg)" }, // Rotate
                    { transform: "rotateY(0deg)" }, // Return
                ],
                {
                    duration: 300,
                    easing: "ease-in-out",
                    fill: "forwards",
                }
            );
        }
    });
});
