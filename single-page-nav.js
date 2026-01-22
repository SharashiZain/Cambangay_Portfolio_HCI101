function initSinglePageNav() {
    const main = document.querySelector(".main-scroll") || document.querySelector(".main-content");
    if (!main) return;

    const sections = Array.from(document.querySelectorAll("section[id]"));
    if (sections.length === 0) return;

    const navLinks = Array.from(document.querySelectorAll(".topnav-link[href^='#'], .nav-link[href^='#']"));

    const setActive = (id) => {
        navLinks.forEach((link) => {
            const href = link.getAttribute("href") || "";
            link.classList.toggle("active", href === `#${id}`);
        });
    };

    navLinks.forEach((link) => {
        link.addEventListener("click", (e) => {
            const href = link.getAttribute("href") || "";
            if (!href.startsWith("#")) return;

            const target = document.querySelector(href);
            if (!target) return;

            e.preventDefault();
            target.scrollIntoView({ behavior: "smooth", block: "start" });
            setActive(target.id);
        });
    });

    // Scroll-based detection for better accuracy
    const navHeight = 64; // Height of the top nav bar
    
    function updateActiveOnScroll() {
        const scrollPosition = window.scrollY + navHeight + 100;
        
        // Check if we're at the very top - activate home
        if (window.scrollY < 100) {
            setActive(sections[0].id);
            return;
        }
        
        // Find which section is currently in view
        let currentSection = sections[0].id;
        
        for (const section of sections) {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.offsetHeight;
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
                currentSection = section.id;
                break;
            }
        }
        
        setActive(currentSection);
    }
    
    // Throttle scroll events for performance
    let ticking = false;
    window.addEventListener('scroll', () => {
        if (!ticking) {
            window.requestAnimationFrame(() => {
                updateActiveOnScroll();
                ticking = false;
            });
            ticking = true;
        }
    });
    
    // Initial check
    updateActiveOnScroll();
}

window.addEventListener("DOMContentLoaded", initSinglePageNav);
