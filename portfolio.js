const STORAGE_KEY = "hci101PortfolioEntries";
let entries = [];

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

function showSaveNotice(message) {
    const notice = document.getElementById("saveNotice");
    if (notice) {
        notice.textContent = message;
        notice.style.display = "block";
        return;
    }

    alert(message);
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

        const addEntry = (imageDataUrl) => {
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
            saveEntriesToStorage();
            form.reset();

            if (imageInput) imageInput.value = "";
            showSaveNotice("Saved! View your uploads in the Activity Folder tab.");
        };

        const file = imageInput.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = () => {
                addEntry(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            addEntry(null);
        }
    });
}

window.addEventListener("DOMContentLoaded", () => {
    loadEntriesFromStorage();
    handleEntryForm();
});
