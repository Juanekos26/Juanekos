document.addEventListener('DOMContentLoaded', () => {
    const sidebar = document.getElementById('adminSidebar');
    const overlay = document.getElementById('sidebarOverlay');
    const toggleBtn = document.getElementById('toggleSidebarBtn');
    const closeBtn = document.getElementById('closeSidebarMobile');
    
    // Check local storage for desktop state
    const isCollapsed = localStorage.getItem('sidebarCollapsed') === 'true';
    if (isCollapsed && window.innerWidth > 900) {
        sidebar.classList.add('collapsed');
    }

    // Toggle Sidebar (Desktop & Mobile)
    toggleBtn.addEventListener('click', () => {
        if (window.innerWidth > 900) {
            // Desktop: Toggle collapsed state
            sidebar.classList.toggle('collapsed');
            localStorage.setItem('sidebarCollapsed', sidebar.classList.contains('collapsed'));
        } else {
            // Mobile: Toggle offcanvas open
            sidebar.classList.add('open');
            overlay.classList.add('active');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        }
    });

    // Close Sidebar (Mobile)
    const closeMobileSidebar = () => {
        if (window.innerWidth <= 900) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    };

    closeBtn.addEventListener('click', closeMobileSidebar);
    overlay.addEventListener('click', closeMobileSidebar);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && sidebar.classList.contains('open')) {
            closeMobileSidebar();
        }
    });

    // Add tooltip attributes dynamically when collapsed, remove when expanded
    const navButtons = document.querySelectorAll('.sidebar-nav .nav-btn');
    
    const updateTooltips = () => {
        if (sidebar.classList.contains('collapsed')) {
            navButtons.forEach(btn => {
                const text = btn.querySelector('.nav-text')?.textContent;
                if (text) btn.setAttribute('title', text);
            });
        } else {
            navButtons.forEach(btn => {
                btn.removeAttribute('title');
            });
        }
    };

    // Initial check
    updateTooltips();

    // Listen to changes in class to update tooltips
    const observer = new MutationObserver(updateTooltips);
    observer.observe(sidebar, { attributes: true, attributeFilter: ['class'] });
});
