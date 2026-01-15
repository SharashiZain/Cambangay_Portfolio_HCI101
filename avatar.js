// avatar.js
// Handles loading/saving the sidebar avatar image to localStorage and triggering the file picker
const AVATAR_KEY = 'hci101AvatarDataUrl';

function initAvatar() {
    const avatarImg = document.getElementById('avatarImg');
    const avatarInput = document.getElementById('avatarInput');
    const avatarContainer = document.getElementById('sidebarAvatar');

    if (!avatarImg || !avatarInput || !avatarContainer) return;

    // Load stored avatar
    try {
        const stored = localStorage.getItem(AVATAR_KEY);
        if (stored) {
            avatarImg.src = stored;
        } else {
            // No stored image: show initials fallback by hiding the img
            avatarImg.style.display = 'none';
            avatarContainer.textContent = getInitialsFromName();
            avatarContainer.style.color = '#f9fafb';
            avatarContainer.style.fontWeight = '700';
            avatarContainer.style.fontSize = '1.25rem';
        }
    } catch (e) {
        console.error('Failed to load avatar', e);
    }

    // Avatar is not clickable for upload; uploads are handled from the Settings page.
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
            // remove any text content used for initials
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
