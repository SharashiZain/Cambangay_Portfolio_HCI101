const personalInfo = {
    name: "Kahlil Jay T. Cambangay",
    id: "24-1475",
    course: "Bachelor of Science in Information Technology",
    college: "College of Computer Science",
    email: "cambangay.kahliljay.tenedero@gmail.com",
    contact: "09605740781",
    address: "Quezon City, Philippines",
    bio: "I am a more practical and serious person when it comes in developing a system.",

    skills: [
        { name: "Cisco Packet Tracer", level: "Advanced" },
        { name: "SQL Queries", level: "Intermediate" },
        { name: "Virtual Machine", level: "Intermediate" },
        { name: "Java Programming", level: "Intermediate" },
        { name: "HTML & CSS", level: "Intermediate" },
        { name: "Hardware Troubleshooting", level: "Advanced" },
    ],
    hobbies: [
        "Repairing Technologies",
        "Watching Anime",
        "Listening to Music",
    ],
    goalProject: {
        title: "Triangular Converged Network Using Raspberry Pi 5 Routers with Integrated Data, Voice, and Video Traffic",
        description: "Design and deploy a converged network using three Raspberry Pi 5 routers interconnected in a triangular topology, providing data, voice, and video services through wired and wireless LANs, with VoIP via Asterisk, and dynamic routing via FRR/OSPF."
    }
};

function fillPersonalInfo() {
    document.getElementById("infoName").textContent = personalInfo.name;
    document.getElementById("infoId").textContent = personalInfo.id;
    document.getElementById("infoCourse").textContent = personalInfo.course;
    document.getElementById("infoCollege").textContent = personalInfo.college;
    document.getElementById("infoEmail").textContent = personalInfo.email;
    document.getElementById("infoContact").textContent = personalInfo.contact;
    document.getElementById("infoAddress").textContent = personalInfo.address;
    document.getElementById("infoBio").textContent = personalInfo.bio;
}

function renderSkills() {
    const container = document.getElementById("skillsGrid");
    if (!container) return;

    container.innerHTML = "";
    (personalInfo.skills || []).slice(0, 6).forEach((skill) => {
        const card = document.createElement("div");
        card.className = "card";

        const title = document.createElement("h4");
        title.textContent = typeof skill === "object" ? skill.name : skill;

        const level = document.createElement("p");
        level.className = "skill-level";
        level.textContent = typeof skill === "object" ? skill.level : "";

        card.appendChild(title);
        card.appendChild(level);
        container.appendChild(card);
    });
}

function renderHobbies() {
    const container = document.getElementById("hobbiesList");
    if (!container) return;

    container.innerHTML = "";
    (personalInfo.hobbies || []).forEach((hobby) => {
        const chip = document.createElement("span");
        chip.className = "chip";
        chip.textContent = hobby;
        container.appendChild(chip);
    });
}

function renderGoalProject() {
    const titleEl = document.getElementById("goalProjectTitle");
    const descEl = document.getElementById("goalProjectDesc");
    if (!titleEl || !descEl) return;

    titleEl.textContent = personalInfo.goalProject?.title || "";
    descEl.textContent = personalInfo.goalProject?.description || "";
}

window.addEventListener("DOMContentLoaded", () => {
    fillPersonalInfo();
    renderSkills();
    renderHobbies();
    renderGoalProject();
});
