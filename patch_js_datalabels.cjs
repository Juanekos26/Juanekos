const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

// For doughnut chart
let doughnutOptions = `
            options: {
                cutout: '75%',
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let label = context.label || '';
                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed !== null) {
                                    label += new Intl.NumberFormat('es-PE', { style: 'currency', currency: 'PEN' }).format(context.parsed);
                                }
                                return label;
                            }
                        }
                    },
                    datalabels: {
                        display: false // hide labels inside the tiny doughnut
                    }
                }
            }
`;
js = js.replace(/options:\s*\{\s*cutout:\s*'75%',\s*responsive:\s*true,\s*maintainAspectRatio:\s*false,\s*plugins:\s*\{\s*legend:\s*\{\s*display:\s*false\s*\}\s*\}\s*\}/, doughnutOptions);

// For main chart
let mainOptionsRegex = /plugins:\s*\{\s*legend:\s*\{\s*display:\s*false\s*\},/g;
js = js.replace(mainOptionsRegex, `plugins: {
                    datalabels: {
                        anchor: 'end',
                        align: 'top',
                        color: document.body.classList.contains('admin-light') ? '#1a2a3a' : '#ffffff',
                        font: { weight: 'bold', size: 11 },
                        formatter: function(value) {
                            if (value === 0) return '';
                            return isDinero ? 'S/ ' + (value >= 1000 ? (value/1000).toFixed(1)+'k' : Math.round(value)) : value;
                        }
                    },
                    legend: { display: false },`);

// Ensure we include the plugin array
js = js.replace(/type: tipoGrafico === 'lineas' \? 'line' : 'bar',/g, "plugins: [ChartDataLabels],\n      type: tipoGrafico === 'lineas' ? 'line' : 'bar',");
js = js.replace(/type: 'doughnut',/g, "plugins: [ChartDataLabels],\n            type: 'doughnut',");

fs.writeFileSync('Js/panel/panel-resumen.js', js);
