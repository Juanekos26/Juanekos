const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

// Replace the Pedidos de Hoy block
const oldPedidosDeHoy = `        <!-- Pedidos de hoy -->
        <div class="resumen-box" style="flex: 1;  border-radius: 20px; padding: 20px 16px; text-align: center;  display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-clipboard"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS DE HOY</span>
            <strong id="pedidosHoy" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.78rem; font-weight: 500; line-height: 1.2;">Sin pedidos<br>registrados</span>
        </div>`;

const newPedidos = `        <!-- Pedidos Hoy Cevicheria -->
        <div class="resumen-box" style="flex: 1;  border-radius: 20px; padding: 20px 16px; text-align: center;  display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2); display: flex; align-items: center; justify-content: center; color: #f97316; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-fish"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS CEVICHERÍA (HOY)</span>
            <strong id="pedidosHoyCevicheriaTop" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
        </div>
        <!-- Pedidos Hoy Broaster -->
        <div class="resumen-box" style="flex: 1;  border-radius: 20px; padding: 20px 16px; text-align: center;  display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); display: flex; align-items: center; justify-content: center; color: #eab308; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-drumstick-bite"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS BROASTER (HOY)</span>
            <strong id="pedidosHoyBroasterTop" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
        </div>`;

// Check if group is wrap
html = html.replace('<div class="resumen-card-group" style="display: flex; gap: 16px;">', '<div class="resumen-card-group" style="display: flex; gap: 16px; flex-wrap: wrap;">');

html = html.replace(oldPedidosDeHoy, newPedidos);

fs.writeFileSync('Admin/panel-resumen.html', html);
