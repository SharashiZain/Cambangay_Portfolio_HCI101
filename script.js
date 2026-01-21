const personalInfo = {
    name: "Kahlil Jay T. Cambangay",
    id: "24-1475",
    course: "Bachelor of Science in Information Technology",
    college: "College of Computer Science",
    email: "cambangay.kahliljay.tenedero@gmail.com",
    contact: "09605740781 / 09605741202",
    address: "#35 Int masaya st., Brgy Gulod Novaliches Q.C",
    bio: "I am a more practical and serious person when it comes in developing a system."
};

const STORAGE_KEY = "hci101PortfolioEntries";
let entries = [];

function initNavigation() {
    const navLinks = document.querySelectorAll(".nav-link");
    const sections = document.querySelectorAll(".section");

    navLinks.forEach((btn) => {
        btn.addEventListener("click", () => {
            const targetId = btn.getAttribute("data-target");

            navLinks.forEach((b) => b.classList.remove("active"));
            btn.classList.add("active");

            sections.forEach((section) => {
                section.classList.toggle("visible", section.id === targetId);
            });
        });
    });
}

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

function loadEntriesFromStorage() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (!raw) return;
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed)) {
            entries = parsed;
        }
    } catch (e) {
        console.error("Failed to parse saved entries", e);
    }
}

function saveEntriesToStorage() {
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
    } catch (e) {
        console.error("Failed to save entries", e);
    }
}

function handleEntryForm() {
    const form = document.getElementById("entryForm");
    const imageInput = document.getElementById("entryImage");

    form.addEventListener("submit", (event) => {
        event.preventDefault();

        const type = document.getElementById("entryType").value;
        const title = document.getElementById("entryTitle").value.trim();
        const date = document.getElementById("entryDate").value;
        const description = document.getElementById("entryDescription").value.trim();

        if (!type || !title || !date || !description) {
            alert("Please complete all required fields.");
            return;
        }

        const createEntry = (imageDataUrl) => {
            const newEntry = {
                id: Date.now(),
                type,
                title,
                date,
                description,
                image: imageDataUrl || null
            };

            entries.unshift(newEntry);
            saveEntriesToStorage();
            renderEntries();
            form.reset();
        };

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                createEntry(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            createEntry(null);
        }
    });
}

function renderEntries() {
    const container = document.getElementById("entriesContainer");
    const filterValue = document.getElementById("filterType").value;

    container.innerHTML = "";

    const filtered = entries.filter((e) =>
        filterValue === "All" ? true : e.type === filterValue
    );

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No entries yet. Add one using the form above.";
        empty.style.color = "#6b7280";
        empty.style.marginTop = "0.75rem";
        container.appendChild(empty);
        return;
    }

    filtered.forEach((entry) => {
        const card = document.createElement("article");
        card.className = "entry-card";

        const tag = document.createElement("div");
        tag.className = `entry-tag ${entry.type}`;
        tag.textContent = entry.type;
        card.appendChild(tag);

        if (entry.image) {
            const imageWrapper = document.createElement("div");
            imageWrapper.className = "entry-image-wrapper";

            const img = document.createElement("img");
            img.src = entry.image;
            img.alt = `${entry.type} - ${entry.title}`;

            imageWrapper.appendChild(img);
            card.appendChild(imageWrapper);
        }

        const content = document.createElement("div");
        content.className = "entry-content";

        const titleEl = document.createElement("h3");
        titleEl.className = "entry-title";
        titleEl.textContent = entry.title;

        const dateEl = document.createElement("p");
        dateEl.className = "entry-date";
        dateEl.textContent = new Date(entry.date).toLocaleDateString();

        const descEl = document.createElement("p");
        descEl.className = "entry-description";
        descEl.textContent = entry.description;

        content.appendChild(titleEl);
        content.appendChild(dateEl);
        content.appendChild(descEl);

        card.appendChild(content);
        container.appendChild(card);
    });
}

function initFilter() {
    const filterSelect = document.getElementById("filterType");
    filterSelect.addEventListener("change", renderEntries);
}

document.addEventListener("DOMContentLoaded", () => {
    initNavigation();
    fillPersonalInfo();
    loadEntriesFromStorage();
    handleEntryForm();
    initFilter();
    renderEntries();
});
