const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

js = js.replace("const { ctx } = chart;", "if (chart.config.type === 'doughnut') return;\n        const { ctx } = chart;");

fs.writeFileSync('Js/panel/panel-resumen.js', js);

let js2 = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');
js2 = js2.replace("const { ctx, data } = chart;", "if (chart.config.type === 'doughnut') return;\n        const { ctx, data } = chart;");
fs.writeFileSync('Js/panel/panel-estadisticas.js', js2);
