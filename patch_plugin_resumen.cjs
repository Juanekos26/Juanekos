const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

const pluginDef = `
    const valuePlugin = {
      id: 'valuePlugin',
      afterDatasetsDraw(chart, args, options) {
        const { ctx } = chart;
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
            
            const isDinero = dataset.label && !dataset.label.toLowerCase().includes('pedidos') && !dataset.label.toLowerCase().includes('cancelados');
            // Assuming config.formato tells us, but we can access it directly since it's in scope
            const isDineroScoped = typeof config !== 'undefined' && config.formato === 'dinero';
            
            const text = (isDinero || isDineroScoped) ? 'S/ ' + dataVal : dataVal;
            
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

fs.writeFileSync('Js/panel/panel-resumen.js', js);
