const fs = require('fs');
let html = fs.readFileSync('Admin/panel.html', 'utf8');
html = html.replace(
    '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>',
    '<script src="https://cdn.jsdelivr.net/npm/chart.js"></script>\n    <script src="https://cdn.jsdelivr.net/npm/chartjs-plugin-datalabels@2"></script>'
);
fs.writeFileSync('Admin/panel.html', html);
