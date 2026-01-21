const AVATAR_KEY = 'hci101AvatarDataUrl';
const NAV_MODE_KEY = 'hci101NavMode';

function initAvatar() {
    initNavMode();

    const avatarImg = document.getElementById('avatarImg');
    const avatarInput = document.getElementById('avatarInput');
    const avatarContainer = document.getElementById('sidebarAvatar');

    if (!avatarImg || !avatarInput || !avatarContainer) return;

    
    try {
        const stored = localStorage.getItem(AVATAR_KEY);
        if (stored) {
            avatarImg.src = stored;
        } else {
            avatarImg.style.display = 'none';
            avatarContainer.textContent = getInitialsFromName();
            avatarContainer.style.color = '#f9fafb';
            avatarContainer.style.fontWeight = '700';
            avatarContainer.style.fontSize = '1.25rem';
        }
    } catch (e) {
        console.error('Failed to load avatar', e);
    }

    avatarContainer.style.cursor = 'default';

    avatarInput.addEventListener('change', (ev) => {
        const file = ev.target.files && ev.target.files[0];
        if (!file) return;
        const reader = new FileReader();
        reader.onload = () => {
            const dataUrl = reader.result;
            try {
                localStorage.setItem(AVATAR_KEY, dataUrl);
            } catch (e) {
                console.error('Failed to save avatar to localStorage', e);
            }
            avatarImg.src = dataUrl;
            avatarImg.style.display = 'block';
            if (avatarContainer.firstChild && avatarContainer.firstChild.nodeType === Node.TEXT_NODE) {
                avatarContainer.firstChild.remove();
            }
        };
        reader.readAsDataURL(file);
    });
}

function getInitialsFromName() {
    try {
        const nameEl = document.querySelector('.profile-header .name');
        if (!nameEl) return '';
        const parts = nameEl.textContent.trim().split(' ');
        const initials = parts.slice(0,2).map(p => p[0] ? p[0].toUpperCase() : '').join('');
        return initials || '';
    } catch (e) {
        return '';
    }
}

window.addEventListener('DOMContentLoaded', initAvatar);

function initNavMode() {
    const mode = getNavMode();
    applyNavMode(mode);
    ensureNavModeToggle();
}

function getNavMode() {
    try {
        const stored = localStorage.getItem(NAV_MODE_KEY);
        return stored === 'topbar' ? 'topbar' : 'sidebar';
    } catch (e) {
        return 'sidebar';
    }
}

function setNavMode(mode) {
    try {
        localStorage.setItem(NAV_MODE_KEY, mode);
    } catch (e) {
    }
}

function applyNavMode(mode) {
    document.body.classList.toggle('mode-topbar', mode === 'topbar');
    document.body.classList.toggle('mode-sidebar', mode !== 'topbar');
}

function ensureNavModeToggle() {
    let toggle = document.querySelector('.sidebar-toggle');
    if (!toggle) {
        toggle = document.createElement('button');
        toggle.className = 'sidebar-toggle';
        toggle.type = 'button';
        toggle.innerHTML = '<svg width="18" height="12" viewBox="0 0 18 12" fill="none" xmlns="http://www.w3.org/2000/svg"><rect width="18" height="2" rx="1" fill="currentColor"/><rect y="5" width="18" height="2" rx="1" fill="currentColor"/><rect y="10" width="18" height="2" rx="1" fill="currentColor"/></svg>';
        document.body.appendChild(toggle);
    }

    const updateLabel = () => {
        const mode = getNavMode();
        toggle.setAttribute('aria-label', mode === 'topbar' ? 'Switch to sidebar mode' : 'Switch to top menu mode');
        toggle.title = mode === 'topbar' ? 'Sidebar mode' : 'Top menu mode';
    };

    updateLabel();

    if (!toggle.dataset.navModeBound) {
        toggle.dataset.navModeBound = '1';
        toggle.addEventListener('click', () => {
            const current = getNavMode();
            const next = current === 'topbar' ? 'sidebar' : 'topbar';
            setNavMode(next);
            applyNavMode(next);
            updateLabel();
        });
    }
}
