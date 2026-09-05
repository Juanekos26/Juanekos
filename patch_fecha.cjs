const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

const target = `<span id="adminReloj" style="color: #d4a017; font-size: 0.9rem; font-weight: 700;">--:--</span>`;
const newHTML = `<span id="adminFecha" style="color: var(--text-main, #ffffff); font-size: 0.9rem; font-weight: 600;"></span>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.9rem;">·</span>
            <span id="adminReloj" style="color: #d4a017; font-size: 0.9rem; font-weight: 700;">--:--</span>`;

html = html.replace(target, newHTML);
fs.writeFileSync('Admin/panel-resumen.html', html);
