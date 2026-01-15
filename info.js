// Personal information data for the Personal Information page
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

window.addEventListener("DOMContentLoaded", fillPersonalInfo);
