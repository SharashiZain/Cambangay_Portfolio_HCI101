const STORAGE_KEY = "hci101PortfolioEntries";

const TYPES = [
    { key: "Activity", label: "Activities" },
    { key: "Quiz", label: "Quizzes" },
    { key: "Seatwork", label: "Seatworks" },
    { key: "Exam", label: "Exams" }
];

let entries = [];
let activeType = null;

let modalEl = null;
let modalImgEl = null;
let modalCaptionEl = null;
let modalCloseBtn = null;

function isModalOpen() {
    return modalEl && modalEl.classList.contains("open");
}

function openImageModal(src, altText, caption) {
    if (!modalEl || !modalImgEl) return;
    modalImgEl.src = src;
    modalImgEl.alt = altText || "Enlarged image";

    if (modalCaptionEl) {
        modalCaptionEl.textContent = caption || "";
        modalCaptionEl.style.display = caption ? "block" : "none";
    }

    modalEl.classList.add("open");
    modalEl.setAttribute("aria-hidden", "false");

    if (modalCloseBtn) modalCloseBtn.focus();
}

function closeImageModal() {
    if (!modalEl || !modalImgEl) return;
    modalEl.classList.remove("open");
    modalEl.setAttribute("aria-hidden", "true");
    modalImgEl.src = "";
    modalImgEl.alt = "";
    if (modalCaptionEl) modalCaptionEl.textContent = "";
}

function initImageModal() {
    modalEl = document.getElementById("imageModal");
    modalImgEl = document.getElementById("imageModalImg");
    modalCaptionEl = document.getElementById("imageModalCaption");
    modalCloseBtn = document.getElementById("closeImageModal");

    if (!modalEl) return;

    if (modalCloseBtn) {
        modalCloseBtn.addEventListener("click", closeImageModal);
    }

    modalEl.addEventListener("click", (e) => {
        const target = e.target;
        if (target && target.getAttribute && target.getAttribute("data-close") === "true") {
            closeImageModal();
        }
    });

    document.addEventListener("keydown", (e) => {
        if (!isModalOpen()) return;
        if (e.key === "Escape") closeImageModal();
    });
}

function loadEntries() {
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        const parsed = raw ? JSON.parse(raw) : [];
        entries = Array.isArray(parsed) ? parsed : [];
    } catch (e) {
        entries = [];
    }
}

function getWeeksForType(typeKey) {
    const weeks = new Set();
    entries
        .filter(e => e && e.type === typeKey)
        .forEach(e => {
            const w = Number(e.week);
            if (Number.isFinite(w) && w > 0) weeks.add(w);
        });

    return Array.from(weeks).sort((a, b) => a - b);
}

function buildFileName(entry) {
    const safeTitle = (entry.title || "entry")
        .toLowerCase()
        .replace(/[^a-z0-9]+/gi, "_")
        .replace(/_+/g, "_")
        .replace(/^_|_$/g, "");

    const datePart = entry.date ? new Date(entry.date).toISOString().split("T")[0] : "unknown-date";
    const typePart = entry.type || "Entry";
    const weekPart = entry.week ? `Week${entry.week}` : "WeekNA";

    return `${typePart}_${weekPart}_${safeTitle || "image"}_${datePart}.png`;
}

function renderFolderGrid() {
    const grid = document.getElementById("folderGrid");
    grid.innerHTML = "";

    TYPES.forEach(t => {
        const count = entries.filter(e => e && e.type === t.key && e.image).length;

        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "folder-card";
        btn.innerHTML = `
            <div class="folder-icon" aria-hidden="true"></div>
            <div class="folder-name">${t.label}</div>
            <div class="folder-meta">${count} image${count === 1 ? "" : "s"}</div>
        `;
        btn.addEventListener("click", () => openFolder(t.key));
        grid.appendChild(btn);
    });

    if (entries.length === 0) {
        const note = document.createElement("p");
        note.className = "muted";
        note.textContent = "No saved entries yet. Add entries in Activities & Assessments first.";
        grid.appendChild(note);
    }
}

function populateWeekSelect(typeKey) {
    const select = document.getElementById("weekSelect");
    select.innerHTML = '<option value="All">All Weeks</option>';

    getWeeksForType(typeKey).forEach(w => {
        const opt = document.createElement("option");
        opt.value = String(w);
        opt.textContent = `Week ${w}`;
        select.appendChild(opt);
    });
}

function renderFolderContents(typeKey) {
    const weekFilter = document.getElementById("weekSelect").value;
    const weeksContainer = document.getElementById("weeksContainer");
    weeksContainer.innerHTML = "";

    const filtered = entries
        .filter(e => e && e.type === typeKey)
        .filter(e => (weekFilter === "All" ? true : Number(e.week) === Number(weekFilter)))
        .sort((a, b) => {
            const wa = Number(a.week) || 0;
            const wb = Number(b.week) || 0;
            if (wa !== wb) return wa - wb;
            const da = a.date ? new Date(a.date).getTime() : 0;
            const db = b.date ? new Date(b.date).getTime() : 0;
            return da - db;
        });

    if (filtered.length === 0) {
        const empty = document.createElement("p");
        empty.className = "muted";
        empty.textContent = "No items found for this folder/week.";
        weeksContainer.appendChild(empty);
        return;
    }

    const byWeek = new Map();
    filtered.forEach(e => {
        const w = Number(e.week) || 0;
        if (!byWeek.has(w)) byWeek.set(w, []);
        byWeek.get(w).push(e);
    });

    Array.from(byWeek.keys()).sort((a, b) => a - b).forEach(week => {
        const section = document.createElement("section");
        section.className = "week-section";

        const title = document.createElement("h3");
        title.className = "week-title";
        title.textContent = week ? `Week ${week}` : "Week N/A";
        section.appendChild(title);

        const grid = document.createElement("div");
        grid.className = "media-grid";

        byWeek.get(week).forEach(entry => {
            const card = document.createElement("article");
            card.className = "media-card";

            const thumb = document.createElement("div");
            thumb.className = "media-thumb";

            if (entry.image) {
                thumb.classList.add("zoomable");
                thumb.setAttribute("role", "button");
                thumb.tabIndex = 0;

                const img = document.createElement("img");
                img.src = entry.image;
                img.alt = `${entry.type} - ${entry.title || ""}`.trim();
                thumb.appendChild(img);

                const caption = `${entry.title || "(Untitled)"}${entry.week ? ` • Week ${entry.week}` : ""}${entry.date ? ` • ${new Date(entry.date).toLocaleDateString()}` : ""}`;
                const open = () => openImageModal(entry.image, img.alt, caption);

                thumb.addEventListener("click", open);
                thumb.addEventListener("keydown", (ev) => {
                    if (ev.key === "Enter" || ev.key === " ") {
                        ev.preventDefault();
                        open();
                    }
                });
            } else {
                const placeholder = document.createElement("div");
                placeholder.className = "media-placeholder";
                placeholder.textContent = "No image";
                thumb.appendChild(placeholder);
            }

            const meta = document.createElement("div");
            meta.className = "media-meta";

            const entryTitle = document.createElement("div");
            entryTitle.className = "media-title";
            entryTitle.textContent = entry.title || "(Untitled)";

            const entryDate = document.createElement("div");
            entryDate.className = "media-date";
            entryDate.textContent = entry.date ? new Date(entry.date).toLocaleDateString() : "";

            meta.appendChild(entryTitle);
            meta.appendChild(entryDate);

            card.appendChild(thumb);
            card.appendChild(meta);

            if (entry.image) {
                const actions = document.createElement("div");
                actions.className = "media-actions";

                const dl = document.createElement("a");
                dl.className = "btn-download";
                dl.href = entry.image;
                dl.download = buildFileName(entry);
                dl.textContent = "Download";

                actions.appendChild(dl);
                card.appendChild(actions);
            }

            grid.appendChild(card);
        });

        section.appendChild(grid);
        weeksContainer.appendChild(section);
    });
}

function openFolder(typeKey) {
    activeType = typeKey;
    document.getElementById("folderGrid").style.display = "none";
    document.getElementById("folderContents").style.display = "block";
    document.getElementById("backToFolders").style.display = "inline-flex";

    populateWeekSelect(typeKey);
    renderFolderContents(typeKey);
}

function closeFolder() {
    activeType = null;
    document.getElementById("folderGrid").style.display = "grid";
    document.getElementById("folderContents").style.display = "none";
    document.getElementById("backToFolders").style.display = "none";
}

window.addEventListener("DOMContentLoaded", () => {
    loadEntries();

    initImageModal();

    document.getElementById("backToFolders").addEventListener("click", closeFolder);
    document.getElementById("weekSelect").addEventListener("change", () => {
        if (activeType) renderFolderContents(activeType);
    });

    renderFolderGrid();
});
