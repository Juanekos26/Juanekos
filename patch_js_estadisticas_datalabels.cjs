const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');

js = js.replace(/type: type === 'lineas' \? 'line' : 'bar',/g, "plugins: [ChartDataLabels],\n      type: type === 'lineas' ? 'line' : 'bar',");
js = js.replace(/type: 'bar',/g, "plugins: [ChartDataLabels],\n            type: 'bar',");

// Main chart options
let optionsRegex = /plugins:\s*\{\s*legend:\s*\{\s*display:\s*false\s*\},/g;
js = js.replace(optionsRegex, `plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: document.body.classList.contains('admin-light') ? '#1a2a3a' : '#ffffff',
                        font: { weight: 'bold', size: 10 },
                        formatter: function(value) {
                            if (value === 0) return '';
                            return format === 'dinero' ? 'S/ ' + (value >= 1000 ? (value/1000).toFixed(1)+'k' : Math.round(value)) : value;
                        }
                    },
                    legend: { display: false },`);

// Comp chart options (second match of plugins)
// Actually we can just find 'plugins: {' for the comp chart. Let's see how it's structured.
