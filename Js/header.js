/* =========================================
   HEADER & NAVIGATION LOGIC
========================================= */

document.addEventListener('DOMContentLoaded', () => {
    // Inject overlay if it doesn't exist
    if (!document.querySelector('.menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.menu-overlay');

    if (menuToggle && nav && overlay) {
        function toggleMenu() {
            const vaAAbrir = !nav.classList.contains('open');
            if (vaAAbrir && typeof window.toggleCartSidebar === 'function') window.toggleCartSidebar(false);
            menuToggle.classList.toggle('open');
            nav.classList.toggle('open');
            overlay.classList.toggle('open');
            document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
        }

        menuToggle.addEventListener('click', toggleMenu);
        overlay.addEventListener('click', toggleMenu);

        // Close menu when clicking a link
        const navLinks = nav.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (nav.classList.contains('open')) {
                    toggleMenu();
                }
            });
        });
    }
});
