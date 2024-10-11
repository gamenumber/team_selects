let names = JSON.parse(localStorage.getItem("names")) || [];

function addName() {
    const nameInput = document.getElementById("nameInput");
    const avatarInput = document.getElementById("avatarInput");
    const name = nameInput.value.trim();

    const avatarUrl = avatarInput.files[0]
        ? URL.createObjectURL(avatarInput.files[0])
        : "https://via.placeholder.com/80"; // Updated placeholder size

    if (name !== "") {
        names.push({ name, avatar: avatarUrl });
        nameInput.value = "";
        avatarInput.value = "";
        updateNameList();
        saveNamesToLocalStorage();
    }
}

function updateNameList() {
    const nameList = document.getElementById("nameList");
    nameList.innerHTML = "";
    names.forEach((person, index) => {
        const li = document.createElement("li");
        const card = document.createElement("div");
        card.className = "card";

        const img = document.createElement("img");
        img.src = person.avatar;
        img.onclick = () => changeAvatar(index);

        const nameText = document.createElement("span");
        nameText.textContent = person.name;
        nameText.onclick = () => editName(index); // Enable editing on click

        const deleteButton = document.createElement("button");
        deleteButton.textContent = "삭제";
        deleteButton.className = "delete-btn";
        deleteButton.onclick = () => removeName(index);

        card.appendChild(img);
        card.appendChild(nameText);
        card.appendChild(deleteButton);
        li.appendChild(card);
        nameList.appendChild(li);
    });
}

function removeName(index) {
    names.splice(index, 1);
    updateNameList();
    saveNamesToLocalStorage();
}

function changeAvatar(index) {
    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/*";
    fileInput.onchange = (event) => {
        const newAvatar = URL.createObjectURL(event.target.files[0]);
        names[index].avatar = newAvatar;
        updateNameList();
        saveNamesToLocalStorage();
    };
    fileInput.click();
}

function editName(index) {
    const newName = prompt("새 이름 입력:", names[index].name);
    if (newName !== null && newName.trim() !== "") {
        names[index].name = newName.trim();
        updateNameList();
        saveNamesToLocalStorage();
    }
}

function generateTeams() {
    const membersPerTeam = parseInt(
        document.getElementById("membersPerTeamInput").value
    );
    const teamsOutput = document.getElementById("teamsOutput");
    teamsOutput.innerHTML = ""; // Clear previous output

    const shuffledNames = names.sort(() => Math.random() - 0.5);
    const teams = [];
    while (shuffledNames.length) {
        teams.push(shuffledNames.splice(0, membersPerTeam));
    }

    teams.forEach((team, index) => {
        const teamDiv = document.createElement("div");
        teamDiv.className = "team";

        const teamLabel = document.createElement("strong");
        teamLabel.textContent = `팀 ${index + 1}:`;

        const deleteTeamButton = document.createElement("button");
        deleteTeamButton.textContent = "팀 삭제";
        deleteTeamButton.className = "delete-team-btn";
        deleteTeamButton.onclick = () => {
            teamDiv.remove();
        };

        teamDiv.appendChild(teamLabel);
        teamDiv.appendChild(deleteTeamButton);

        team.forEach((member) => {
            const memberCard = document.createElement("div");
            memberCard.className = "card";

            const memberImg = document.createElement("img");
            memberImg.src = member.avatar;
            memberImg.style.width = "60px"; // 팀 내 멤버 이미지 크기 조정
            memberImg.style.height = "60px";

            const memberName = document.createElement("span");
            memberName.textContent = member.name;

            memberCard.appendChild(memberImg);
            memberCard.appendChild(memberName);
            teamDiv.appendChild(memberCard);
        });

        teamsOutput.appendChild(teamDiv);
    });

    // Apply animation to the teams
    teamsOutput.childNodes.forEach((teamDiv, index) => {
        setTimeout(() => {
            teamDiv.style.opacity = 1;
            teamDiv.style.transform = "translateY(0)";
        }, index * 100);
    });
}

function clearAllNames() {
    names = [];
    updateNameList();
    saveNamesToLocalStorage();
}

function saveNamesToLocalStorage() {
    localStorage.setItem("names", JSON.stringify(names));
}

function downloadTeams() {
    const teamsOutput = document.getElementById("teamsOutput");

    // Use html2canvas to capture the element as an image
    html2canvas(teamsOutput, { scale: 2 }) // Increased scale for better quality
        .then((canvas) => {
            // Convert canvas to JPG data URL
            const dataURL = canvas.toDataURL("image/jpeg", 0.9); // Increased quality to 0.9

            // Create a link element
            const link = document.createElement("a");
            link.href = dataURL;
            link.download = "teams.jpg";

            // Append link to body, click it, and remove it
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        })
        .catch((error) => {
            console.error("Error in downloadTeams:", error);
            alert(
                "팀 이미지 다운로드 중 오류가 발생했습니다. 다시 시도해 주세요."
            );
        });
}
// Initialize the name list on page load
window.onload = updateNameList;
