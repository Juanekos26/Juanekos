const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

const regex = /\$\{\s*tipoGrafico\s*===\s*'lineas'[\s\S]*?generarGraficoBarras\(datos,\s*config.formato,\s*config.color\)\s*\}/;
js = js.replace(regex, '<div style="position:relative; width:100%; height:100%;"><canvas id="resumenChartModal"></canvas></div>');

// Add chart init logic right after `estadisticasPanel.innerHTML = \`...\`;`
const injectionPoint = 'const cerrar = () => {';

const chartInit = `
    const ctx = document.getElementById('resumenChartModal').getContext('2d');
    const isDinero = config.formato === 'dinero';
    let bgColor = config.color;
    let borderColor = config.color;
    if (config.color.includes('linear-gradient')) {
       const match = config.color.match(/#([0-9a-fA-F]{3,6})/);
       if (match) {
           bgColor = match[0];
           borderColor = match[0];
       }
    }

    if (window.myResumenChart) {
       window.myResumenChart.destroy();
    }
    
    Chart.defaults.color = '#7a8ba3';
    Chart.defaults.font.family = "'Playfair Display', serif";

    window.myResumenChart = new Chart(ctx, {
      type: tipoGrafico === 'lineas' ? 'line' : 'bar',
      data: {
        labels: datos.map(d => abreviarFecha(d.fecha)),
        datasets: [{
          label: config.titulo,
          data: datos.map(d => d.valor),
          backgroundColor: tipoGrafico === 'lineas' ? bgColor + '33' : bgColor,
          borderColor: borderColor,
          borderWidth: 2,
          fill: tipoGrafico === 'lineas',
          tension: 0.4,
          borderRadius: tipoGrafico === 'lineas' ? 0 : 4,
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

`;

js = js.replace(injectionPoint, chartInit + '\n    ' + injectionPoint);

fs.writeFileSync('Js/panel/panel-resumen.js', js);
