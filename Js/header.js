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

/* =========================================
   BADGE DEL PEDIDO ENTRE PÁGINAS
========================================= */
function actualizarBadgePedidoGlobal() {
    const badge = document.getElementById('cart-badge-header');
    if (!badge) return;
    let total = 0;
    try {
        const estado = JSON.parse(localStorage.getItem('juanekos_pedido_temporal') || 'null');
        total = Array.isArray(estado?.items)
            ? estado.items.reduce((suma, item) => suma + Math.max(0, Number(item?.cantidad) || 0), 0)
            : 0;
    } catch (_) {}
    badge.textContent = total;
}

document.addEventListener('DOMContentLoaded', actualizarBadgePedidoGlobal);
window.addEventListener('storage', actualizarBadgePedidoGlobal);
