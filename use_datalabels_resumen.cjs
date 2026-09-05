const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

// Remove valuePlugin definition
js = js.replace(/const valuePlugin = \{\s*id: 'valuePlugin',[\s\S]*?ctx\.restore\(\);\s*\}\s*\};\s*/, '');

// Remove valuePlugin from plugins array, keep ChartDataLabels
js = js.replace(/plugins: \[ChartDataLabels\],\s*plugins: \[valuePlugin\],/g, 'plugins: [ChartDataLabels],');
js = js.replace(/plugins: \[valuePlugin\],/g, ''); // cleanup any left overs

fs.writeFileSync('Js/panel/panel-resumen.js', js);
