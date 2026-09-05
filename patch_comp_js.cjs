const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');

const injection = `
    const containerComp = document.getElementById('graficoComparativoDias');
    if (containerComp) {
        containerComp.innerHTML = '<canvas id="canvas-graficoComparativoDias" style="width: 100%; height: 100%;"></canvas>';
        const ctxComp = document.getElementById('canvas-graficoComparativoDias').getContext('2d');
        if (window.myChartJsInstances['graficoComparativoDias']) {
            window.myChartJsInstances['graficoComparativoDias'].destroy();
        }
        
        window.myChartJsInstances['graficoComparativoDias'] = new Chart(ctxComp, {
            type: 'bar',
            data: {
                labels: cevicheria.map(d => fechaPE(d.fecha)),
                datasets: [
                    {
                        label: 'Cevichería',
                        data: cevicheria.map(d => d.valor),
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    },
                    {
                        label: 'Broaster',
                        data: broaster.map(d => d.valor),
                        backgroundColor: '#d4a017',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#7a8ba3', font: { family: "'Playfair Display', serif" } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) { return 'S/ ' + context.parsed.y.toFixed(2); }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(122,139,163,0.1)' },
                        ticks: {
                            color: '#7a8ba3',
                            callback: function(value) { return 'S/ ' + value; }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#7a8ba3' }
                    }
                }
            }
        });
    }
`;

js = js.replace("createChart('graficoPedidosDias', pedidos, estadisticasTipoGrafico, 'numero', '#3b82f6', 'Pedidos');", "createChart('graficoPedidosDias', pedidos, estadisticasTipoGrafico, 'numero', '#3b82f6', 'Pedidos');\n" + injection);

fs.writeFileSync('Js/panel/panel-estadisticas.js', js);
