const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');

const chartFuncs = `
  window.myChartJsInstances = window.myChartJsInstances || {};
  function createChart(containerId, datos, type, formato, colorHex, label) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<canvas id="canvas-' + containerId + '" style="width: 100%; height: 100%;"></canvas>';
    const ctx = document.getElementById('canvas-' + containerId).getContext('2d');
    
    if (window.myChartJsInstances[containerId]) {
      window.myChartJsInstances[containerId].destroy();
    }
    
    const labels = datos.map(d => fechaPE(d.fecha));
    const dataValues = datos.map(d => d.valor);
    const isDinero = formato === 'dinero';
    
    let bgColor = colorHex;
    let borderColor = colorHex;
    if (colorHex.includes('linear-gradient')) {
       const match = colorHex.match(/#([0-9a-fA-F]{3,6})/);
       if (match) {
           bgColor = match[0];
           borderColor = match[0];
       }
    }
    
    Chart.defaults.color = '#7a8ba3';

    window.myChartJsInstances[containerId] = new Chart(ctx, {
      type: type === 'lineas' ? 'line' : 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: dataValues,
          backgroundColor: type === 'lineas' ? bgColor + '33' : bgColor,
          borderColor: borderColor,
          borderWidth: 2,
          fill: type === 'lineas',
          tension: 0.4,
          borderRadius: type === 'lineas' ? 0 : 4,
          pointBackgroundColor: bgColor,
          pointBorderColor: '#ffffff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                let val = context.parsed.y;
                return isDinero ? 'S/ ' + val.toFixed(2) : val;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(122,139,163,0.1)' },
            ticks: {
                callback: function(value) { return isDinero ? 'S/ ' + value : value; }
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }
`;

js = js.replace('function generarLineasHTML(datos, formato, colorHex) {', chartFuncs + '\n  function generarLineasHTML(datos, formato, colorHex) {');

const replacement = `    createChart('graficoVentasDias', ventas, estadisticasTipoGrafico, 'dinero', '#f1c84b', 'Ingresos');
    createChart('graficoCevicheriaDias', cevicheria, estadisticasTipoGrafico, 'dinero', '#60a5fa', 'Cevichería');
    createChart('graficoBroasterDias', broaster, estadisticasTipoGrafico, 'dinero', '#d4a017', 'Broaster');
    createChart('graficoPedidosDias', pedidos, estadisticasTipoGrafico, 'numero', '#3b82f6', 'Pedidos');`;

js = js.replace(/const fnGrafico = estadisticasTipoGrafico === 'lineas' \? generarLineasHTML : generarBarrasHTML;[\s\S]*?document\.getElementById\("graficoPedidosDias"\)\.innerHTML = fnGrafico\([\s\S]*?\);/, replacement);

fs.writeFileSync('Js/panel/panel-estadisticas.js', js);
