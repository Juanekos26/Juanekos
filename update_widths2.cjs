const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

html = html.replace(/<div class="resumen-card-group" style="display: flex; gap: 16px;">/g, '<div class="resumen-card-group" style="display: flex; gap: 16px; flex-wrap: wrap;">');

fs.writeFileSync('Admin/panel-resumen.html', html);
