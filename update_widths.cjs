const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

html = html.replace(/<div class="resumen-box" style="flex: 1;  border-radius/g, '<div class="resumen-box" style="flex: 1; min-width: 140px; border-radius');
html = html.replace(/<button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="pendientes" style="flex: 1;  border-radius/g, '<button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="pendientes" style="flex: 1; min-width: 140px; border-radius');
html = html.replace(/<button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="cancelados" style="flex: 1;  border-radius/g, '<button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="cancelados" style="flex: 1; min-width: 140px; border-radius');

fs.writeFileSync('Admin/panel-resumen.html', html);
