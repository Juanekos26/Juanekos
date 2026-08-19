document.addEventListener('DOMContentLoaded', () => {
    // 1. Dynamic Year
    const yearElement = document.getElementById('footer-year');
    if (yearElement) {
        yearElement.textContent = new Date().getFullYear();
    }

    // 2. Open/Close status logic
    const statusContainer = document.getElementById('footer-status');
    if (!statusContainer) return;

    // Obtener la hora actual en la zona horaria de Perú
    const options = { timeZone: 'America/Lima', hour: 'numeric', minute: 'numeric', hour12: false };
    const formatter = new Intl.DateTimeFormat('es-PE', options);
    
    const timeParts = formatter.format(new Date()).split(':');
    const hour = parseInt(timeParts[0], 10);
    const minute = parseInt(timeParts[1], 10);
    const currentDecimalTime = hour + (minute / 60);

    const isOpen = currentDecimalTime >= 11.0 && currentDecimalTime < 24.0;

    if (isOpen) {
        statusContainer.innerHTML = \
            <div class="status-indicator status-abierto">
                <span class="status-dot"></span> Abierto ahora
            </div>
        \;
    } else {
        statusContainer.innerHTML = \
            <div class="status-indicator status-cerrado">
                <span class="status-dot"></span> Cerrado
            </div>
        \;
    }
});
