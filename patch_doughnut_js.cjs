const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

const injection = `
    actualizarElemento("totalVentasDoughnut", formatearPrecio(ventasHoy));
    const ctxDoughnut = document.getElementById('resumenDoughnutChart');
    if (ctxDoughnut) {
        if (window.myResumenDoughnutChart) {
            window.myResumenDoughnutChart.destroy();
        }
        window.myResumenDoughnutChart = new Chart(ctxDoughnut.getContext('2d'), {
            type: 'doughnut',
            data: {
                labels: ['Cevichería', 'Broaster'],
                datasets: [{
                    data: [ventasCevicheriaHoy, ventasBroasterHoy],
                    backgroundColor: ['#3b82f6', '#eab308'],
                    borderWidth: 0,
                    hoverOffset: 4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                return 'S/ ' + context.parsed.toFixed(2);
                            }
                        }
                    }
                }
            }
        });
    }
`;

js = js.replace('actualizarElemento("porcentajeBroaster", `${porcentajeBros}%`);', 'actualizarElemento("porcentajeBroaster", `${porcentajeBros}%`);\n' + injection);

fs.writeFileSync('Js/panel/panel-resumen.js', js);
