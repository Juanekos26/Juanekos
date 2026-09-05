const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

// Replace dark inline backgrounds and colors
html = html.replace(/background: #10233f;/g, '');
html = html.replace(/background: linear-gradient\(135deg, #122a4a, #0e203a\);/g, '');
html = html.replace(/color: #ffffff;/g, 'color: var(--text-main, #ffffff);');
html = html.replace(/color: #7a8ba3;/g, 'color: var(--text-muted, #7a8ba3);');
html = html.replace(/border: 1px solid rgba\(255, 255, 255, 0.05\);/g, '');

// Give the container divs a class 'resumen-box' so we can target them
html = html.replace(/<div style="flex: 1;/g, '<div class="resumen-box" style="flex: 1;');
html = html.replace(/<button type="button" class="resumen-card-interactiva"/g, '<button type="button" class="resumen-card-interactiva resumen-box"');
html = html.replace(/<div style="border-radius: 20px; padding: 24px 20px; text-align: center;">/g, '<div class="resumen-box" style="border-radius: 20px; padding: 24px 20px; text-align: center;">'); // Wait, the comparativa is `<div style="border-radius: 20px; padding: 24px 20px; text-align: center; ">` let's find it.

fs.writeFileSync('Admin/panel-resumen.html', html);
