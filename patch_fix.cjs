const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

// Remove existing valuePlugin definition
const regexPlugin = /const valuePlugin = \{\s*id: 'valuePlugin',[\s\S]*?\}\s*\};\s*/;
js = js.replace(regexPlugin, '');

// Prepend valuePlugin to the very top of the file
const newPlugin = `
const valuePlugin = {
  id: 'valuePlugin',
  afterDatasetsDraw(chart, args, options) {
    if (chart.config.type === 'doughnut') return;
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

js = newPlugin + '\n' + js;

fs.writeFileSync('Js/panel/panel-resumen.js', js);
