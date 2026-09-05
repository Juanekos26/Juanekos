const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');

// Remove valuePlugin definition
js = js.replace(/const valuePlugin = \{\s*id: 'valuePlugin',[\s\S]*?ctx\.restore\(\);\s*\}\s*\};\s*/, '');

// Replace `type: type === 'lineas' ? 'line' : 'bar',` with plugins: [ChartDataLabels]
js = js.replace(/type: type === 'lineas' \? 'line' : 'bar',/g, "plugins: [ChartDataLabels],\n      type: type === 'lineas' ? 'line' : 'bar',");
// And replace `plugins: [valuePlugin],` with nothing
js = js.replace(/plugins: \[valuePlugin\],/g, '');

// Add datalabels config inside the first options.plugins
let optionsRegex = /plugins:\s*\{\s*legend:\s*\{\s*display:\s*false\s*\},/g;
js = js.replace(optionsRegex, `plugins: {
          datalabels: {
              anchor: 'end',
              align: 'top',
              color: document.body.classList.contains('admin-light') ? '#1a2a3a' : '#ffffff',
              font: { weight: 'bold', size: 10 },
              formatter: function(value) {
                  if (value === 0) return '';
                  return isDinero ? 'S/ ' + (value >= 1000 ? (value/1000).toFixed(1)+'k' : Math.round(value)) : value;
              }
          },
          legend: { display: false },`);

// For the comparativo chart
js = js.replace(/type: 'bar',/g, "plugins: [ChartDataLabels],\n            type: 'bar',");
js = js.replace(/legend:\s*\{\s*labels:\s*\{\s*color:\s*'#7a8ba3'/g, `datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: document.body.classList.contains('admin-light') ? '#1a2a3a' : '#ffffff',
                        font: { weight: 'bold', size: 10 },
                        formatter: function(value) {
                            if (value === 0) return '';
                            return 'S/ ' + (value >= 1000 ? (value/1000).toFixed(1)+'k' : Math.round(value));
                        }
                    },
                    legend: {
                        labels: { color: document.body.classList.contains('admin-light') ? '#4a5568' : '#7a8ba3'`);

fs.writeFileSync('Js/panel/panel-estadisticas.js', js);
