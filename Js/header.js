/* =========================================
   HEADER & NAVIGATION LOGIC
========================================= */

document.addEventListener('DOMContentLoaded', () => {
    if (!document.querySelector('.menu-overlay')) {
        const overlay = document.createElement('div');
        overlay.className = 'menu-overlay';
        document.body.appendChild(overlay);
    }

    const menuToggle = document.querySelector('.menu-toggle');
    const nav = document.querySelector('.nav');
    const overlay = document.querySelector('.menu-overlay');

    const cerrarMenu = () => {
        menuToggle?.classList.remove('open');
        nav?.classList.remove('open');
        overlay?.classList.remove('open');
        document.body.classList.remove('menu-abierto');
        if (!document.body.classList.contains('cart-abierto')) document.body.style.overflow = '';
    };
    window.cerrarMenuMovil = cerrarMenu;

    if (menuToggle && nav && overlay) {
        menuToggle.addEventListener('click', () => {
            const vaAAbrir = !nav.classList.contains('open');
            if (vaAAbrir) {
                if (typeof window.toggleCartSidebar === 'function') window.toggleCartSidebar(false);
                nav.classList.add('open');
                menuToggle.classList.add('open');
                overlay.classList.add('open');
                document.body.classList.add('menu-abierto');
                document.body.style.overflow = 'hidden';
            } else {
                cerrarMenu();
            }
        });
        overlay.addEventListener('click', cerrarMenu);
        nav.querySelectorAll('.nav-link').forEach(link => link.addEventListener('click', cerrarMenu));
    }
});
