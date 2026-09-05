const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

const oldCancelados = `<strong id="pedidosCancelados" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block;">0</strong>`;
const newCancelados = `<strong id="pedidosCancelados" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
            <div style="display: flex; gap: 12px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted, #7a8ba3);">
               <span style="display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-fish" style="color:#f97316"></i> <span id="canceladosCev">0</span></span>
               <span style="display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-drumstick-bite" style="color:#eab308"></i> <span id="canceladosBro">0</span></span>
            </div>`;

html = html.replace(oldCancelados, newCancelados);
fs.writeFileSync('Admin/panel-resumen.html', html);
