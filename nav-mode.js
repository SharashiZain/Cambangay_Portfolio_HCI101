// Modern layout - minimal init
function initNavMode() {
    // No sidebar toggle needed for modern layout
    document.body.classList.remove('mode-topbar', 'mode-sidebar', 'drawer-open', 'sidebar-hidden');
}

window.addEventListener('DOMContentLoaded', initNavMode);
