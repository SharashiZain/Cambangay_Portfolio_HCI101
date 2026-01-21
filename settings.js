const SETTINGS_KEY = 'hci101Settings';

function loadSettings() {
    try {
        const raw = localStorage.getItem(SETTINGS_KEY);
        if (!raw) return { enableAvatarUpload: true, assistantInstructions: '' };
        return JSON.parse(raw);
    } catch (e) {
        console.error('Failed to load settings', e);
        return { enableAvatarUpload: true, assistantInstructions: '' };
    }
}

function saveSettings(settings) {
    try {
        localStorage.setItem(SETTINGS_KEY, JSON.stringify(settings));
    } catch (e) {
        console.error('Failed to save settings', e);
    }
}

function initSettingsForm() {
    const settings = loadSettings();
    const checkbox = document.getElementById('enableAvatarUpload');
    const avatarFile = document.getElementById('avatarFileSetting');
    const removeBtn = document.getElementById('removeAvatar');
    const textarea = document.getElementById('assistantInstructions');
    const saveBtn = document.getElementById('saveSettings');
    const clearBtn = document.getElementById('clearSettings');

    checkbox.checked = !!settings.enableAvatarUpload;
    textarea.value = settings.assistantInstructions || '';

    saveBtn.addEventListener('click', () => {
        const newSettings = {
            enableAvatarUpload: !!checkbox.checked,
            assistantInstructions: textarea.value.trim()
        };
        saveSettings(newSettings);
        alert('Settings saved locally.');
    });

    if (avatarFile) {
        avatarFile.addEventListener('change', (ev) => {
            const file = ev.target.files && ev.target.files[0];
            if (!file) return;

            const raw = loadSettings();
            if (raw.enableAvatarUpload === false) {
                alert('Avatar upload is disabled. Enable it in Settings to upload.');
                return;
            }

            const reader = new FileReader();
            reader.onload = () => {
                try {
                    localStorage.setItem('hci101AvatarDataUrl', reader.result);
                    alert('Avatar uploaded and saved.');
                    
                    const avatarImg = document.getElementById('avatarImg');
                    if (avatarImg) {
                        avatarImg.src = reader.result;
                        avatarImg.style.display = 'block';
                        const container = document.getElementById('sidebarAvatar');
                        if (container && container.firstChild && container.firstChild.nodeType === Node.TEXT_NODE) {
                            container.firstChild.remove();
                        }
                    }
                } catch (e) {
                    console.error('Failed to save avatar', e);
                    alert('Failed to save avatar.');
                }
            };
            reader.readAsDataURL(file);
        });
    }

    if (removeBtn) {
        removeBtn.addEventListener('click', () => {
            if (!confirm('Remove the current avatar?')) return;
            try {
                localStorage.removeItem('hci101AvatarDataUrl');
                const avatarImg = document.getElementById('avatarImg');
                const container = document.getElementById('sidebarAvatar');
                if (avatarImg) {
                    avatarImg.src = '';
                    avatarImg.style.display = 'none';
                }
                if (container) {
                    container.textContent = '';
                    const nameEl = document.querySelector('.profile-header .name');
                    if (nameEl) {
                        const parts = nameEl.textContent.trim().split(' ');
                        const initials = parts.slice(0,2).map(p => p[0] ? p[0].toUpperCase() : '').join('');
                        container.textContent = initials;
                        container.style.color = '#f9fafb';
                        container.style.fontWeight = '700';
                        container.style.fontSize = '1.25rem';
                    }
                }
                alert('Avatar removed.');
            } catch (e) {
                console.error(e);
                alert('Failed to remove avatar.');
            }
        });
    }

    clearBtn.addEventListener('click', () => {
        if (!confirm('Clear settings and assistant instructions?')) return;
        const reset = { enableAvatarUpload: true, assistantInstructions: '' };
        saveSettings(reset);
        checkbox.checked = true;
        textarea.value = '';
        alert('Settings cleared.');
    });
}

window.addEventListener('DOMContentLoaded', initSettingsForm);
