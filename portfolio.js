// Portfolio page logic: save activities, quizzes, seatworks, and exams

const STORAGE_KEY = "hci101PortfolioEntries";
let entries = [];
let editingEntryId = null;

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
        populateWeekFilter();
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
        const week = document.getElementById("entryWeek").value;

        if (!type || !title || !date || !description || !week) {
            alert("Please complete all required fields.");
            return;
        }

        const createOrUpdateEntry = (imageDataUrl) => {
            if (editingEntryId) {
                // Update existing entry
                const index = entries.findIndex(e => e.id === editingEntryId);
                if (index !== -1) {
                    entries[index] = {
                        ...entries[index],
                        type,
                        title,
                        date,
                        week: parseInt(week, 10),
                        description,
                        image: imageDataUrl !== undefined ? imageDataUrl : entries[index].image
                    };
                }
                editingEntryId = null;
                document.querySelector('#entryForm button[type="submit"]').textContent = "Add to Portfolio";
            } else {
                // Create new entry
                const newEntry = {
                    id: Date.now(),
                    type,
                    title,
                    date,
                    week: parseInt(week, 10),
                    description,
                    image: imageDataUrl || null
                };
                entries.unshift(newEntry);
            }

            saveEntriesToStorage();
            renderEntries();
            form.reset();
        };

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                createOrUpdateEntry(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            createOrUpdateEntry(editingEntryId ? undefined : null);
        }
    });
}

function renderEntries() {
    const container = document.getElementById("entriesContainer");
    const filterValue = document.getElementById("filterType").value;
    const filterWeekValue = document.getElementById("filterWeek").value;

    container.innerHTML = "";

    const filtered = entries.filter((e) => {
        const typeMatch = filterValue === "All" ? true : e.type === filterValue;
        const weekMatch = filterWeekValue === "All" ? true : e.week === parseInt(filterWeekValue, 10);
        return typeMatch && weekMatch;
    });

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.textContent = "No entries yet. Add one using the form above.";
        empty.style.color = "#6b7280";
        empty.style.marginTop = "0.75rem";
        container.appendChild(empty);
        return;
    }

        const buildFileName = (entry) => {
            const safeTitle = (entry.title || "entry").toLowerCase().replace(/[^a-z0-9]+/gi, "_").replace(/_+/g, "_").replace(/^_|_$/g, "");
            const datePart = entry.date ? new Date(entry.date).toISOString().split("T")[0] : Date.now();
            const typePart = entry.type || "Entry";
            return `${typePart}_${safeTitle || "image"}_${datePart}.png`;
        };

        filtered.forEach((entry) => {
        const card = document.createElement("article");
        card.className = "entry-card";

        const tagContainer = document.createElement("div");
        tagContainer.className = "entry-tag-container";

        const tag = document.createElement("div");
        tag.className = `entry-tag ${entry.type}`;
        tag.textContent = entry.type;
        tagContainer.appendChild(tag);

        const weekBadge = document.createElement("div");
        weekBadge.className = "entry-week-badge";
        weekBadge.textContent = `Week ${entry.week || 'N/A'}`;
        tagContainer.appendChild(weekBadge);

        card.appendChild(tagContainer);

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

        const actions = document.createElement("div");
        actions.className = "entry-actions";

        if (entry.image) {
            const downloadLink = document.createElement("a");
            downloadLink.href = entry.image;
            downloadLink.download = buildFileName(entry);
            downloadLink.className = "btn-download";
            downloadLink.textContent = "Download";
            actions.appendChild(downloadLink);
        }

        const editBtn = document.createElement("button");
        editBtn.className = "btn-edit";
        editBtn.textContent = "Edit";
        editBtn.onclick = () => editEntry(entry.id);

        const deleteBtn = document.createElement("button");
        deleteBtn.className = "btn-delete";
        deleteBtn.textContent = "Delete";
        deleteBtn.onclick = () => deleteEntry(entry.id);

        actions.appendChild(editBtn);
        actions.appendChild(deleteBtn);
        card.appendChild(actions);
        container.appendChild(card);
    });
}

function deleteEntry(entryId) {
    if (!confirm("Are you sure you want to delete this entry?")) {
        return;
    }
    
    entries = entries.filter(e => e.id !== entryId);
    saveEntriesToStorage();
    renderEntries();
}

function editEntry(entryId) {
    const entry = entries.find(e => e.id === entryId);
    if (!entry) return;

    editingEntryId = entryId;

    document.getElementById("entryType").value = entry.type;
    document.getElementById("entryTitle").value = entry.title;
    document.getElementById("entryDate").value = entry.date;
    document.getElementById("entryWeek").value = entry.week;
    document.getElementById("entryDescription").value = entry.description;

    document.querySelector('#entryForm button[type="submit"]').textContent = "Update Entry";
    
    // Scroll to form
    document.getElementById("entryForm").scrollIntoView({ behavior: "smooth", block: "start" });
}

function populateWeekFilter() {
    const filterWeek = document.getElementById("filterWeek");
    const weeks = [...new Set(entries.map(e => e.week).filter(w => w))].sort((a, b) => a - b);
    
    filterWeek.innerHTML = '<option value="All">All Weeks</option>';
    weeks.forEach(week => {
        const option = document.createElement("option");
        option.value = week;
        option.textContent = `Week ${week}`;
        filterWeek.appendChild(option);
    });
}

function initFilter() {
    const filterSelect = document.getElementById("filterType");
    const filterWeek = document.getElementById("filterWeek");
    filterSelect.addEventListener("change", renderEntries);
    filterWeek.addEventListener("change", renderEntries);
}

window.addEventListener("DOMContentLoaded", () => {
    loadEntriesFromStorage();
    handleEntryForm();
    initFilter();
    populateWeekFilter();
    renderEntries();
});
