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

function loadInfoAvatar() {
    const AVATAR_KEY = 'hci101AvatarDataUrl';
    const infoAvatarImg = document.getElementById('infoAvatarImg');
    const infoAvatarContainer = document.getElementById('infoAvatar');
    
    if (!infoAvatarImg || !infoAvatarContainer) return;
    
    try {
        const stored = localStorage.getItem(AVATAR_KEY);
        if (stored) {
            infoAvatarImg.src = stored;
            infoAvatarImg.style.display = 'block';
        } else {
            infoAvatarImg.style.display = 'none';
            const initials = getInitials(personalInfo.name);
            infoAvatarContainer.textContent = initials;
            infoAvatarContainer.style.color = '#f9fafb';
            infoAvatarContainer.style.fontWeight = '700';
            infoAvatarContainer.style.fontSize = '3rem';
        }
    } catch (e) {
        console.error('Failed to load avatar', e);
    }
}

function getInitials(name) {
    const parts = name.trim().split(' ');
    return parts.slice(0, 2).map(p => p[0] ? p[0].toUpperCase() : '').join('');
}

window.addEventListener("DOMContentLoaded", () => {
    fillPersonalInfo();
    loadInfoAvatar();
});
