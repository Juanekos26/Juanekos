const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');

const pluginDef = `
    const valuePlugin = {
      id: 'valuePlugin',
      afterDatasetsDraw(chart, args, options) {
        const { ctx, data } = chart;
        ctx.save();
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;
          
          meta.data.forEach((bar, index) => {
            const dataVal = dataset.data[index];
            if (dataVal === 0) return;
            
            const isDinero = dataset.label !== 'Pedidos';
            const text = isDinero ? 'S/ ' + dataVal : dataVal;
            
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#0a1930';
            ctx.lineWidth = 3;
            
            const x = bar.x;
            const y = bar.y - 5;
            
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
          });
        });
        ctx.restore();
      }
    };
`;

js = js.replace("Chart.defaults.color = '#7a8ba3';", pluginDef + "\n    Chart.defaults.color = '#7a8ba3';");
js = js.replace("options: {", "plugins: [valuePlugin],\n      options: {");

// Also add to the comparative chart
js = js.replace("options: {\\n                responsive: true,", "plugins: [valuePlugin],\n            options: {\n                responsive: true,");

fs.writeFileSync('Js/panel/panel-estadisticas.js', js);
