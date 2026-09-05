const fs = require('fs');
let js = fs.readFileSync('./Js/panel/panel-estadisticas.js', 'utf8');

const generarLineasHTML = `
    function generarLineasHTML(datos, formato, colorHex) {
        if (!datos || datos.length === 0) return \`<div style="text-align:center;width:100%;color:#7a8ba3;padding:20px;">Sin datos</div>\`;
        const max = Math.max(1, ...datos.map(x => x.valor));
        const colorPlain = colorHex.includes('#') ? colorHex.match(/#[0-9a-fA-F]{3,6}/)[0] : '#60a5fa';
        
        let svgPath = "M 0 100 ";
        let svgPoints = "";
        const step = datos.length > 1 ? 100 / (datos.length - 1) : 100;
        
        datos.forEach((d, i) => {
            const x = i * step;
            const pct = d.valor <= 0 ? 0 : (d.valor / max) * 100;
            const y = 100 - pct;
            
            if (i === 0) svgPath = \`M \${x.toFixed(2)} \${y.toFixed(2)} \`;
            else svgPath += \`L \${x.toFixed(2)} \${y.toFixed(2)} \`;
            
            const val = formato === 'dinero' ? dinero(d.valor) : d.valor;
            svgPoints += \`<circle cx="\${x.toFixed(2)}" cy="\${y.toFixed(2)}" r="1.5" fill="\${colorPlain}" stroke="#0a1930" stroke-width="0.5" title="\${fechaPE(d.fecha)} · \${val}" />
                          <circle cx="\${x.toFixed(2)}" cy="\${y.toFixed(2)}" r="3" fill="transparent" style="cursor:crosshair;" title="\${fechaPE(d.fecha)} · \${val}" />\`;
        });
        
        let filledPath = svgPath;
        if (datos.length > 1) {
            filledPath += \`L 100 100 L 0 100 Z\`;
        } else {
            filledPath = \`M 0 100 L 0 0 L 100 0 L 100 100 Z\`;
        }

        const gradientId = 'grad-' + Math.random().toString(36).substr(2, 5);
        
        return \`<div style="width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;">
            <div style="flex: 1; position: relative; padding-bottom: 25px; margin-top: 20px;">
                <svg viewBox="0 -5 100 110" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: calc(100% - 25px); overflow: visible;">
                    <defs>
                        <linearGradient id="\${gradientId}" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="\${colorPlain}" stop-opacity="0.4"/>
                            <stop offset="100%" stop-color="\${colorPlain}" stop-opacity="0.0"/>
                        </linearGradient>
                    </defs>
                    <path d="\${filledPath}" fill="url(#\${gradientId})" />
                    <path d="\${svgPath}" fill="none" stroke="\${colorPlain}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    \${svgPoints}
                </svg>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; position: absolute; bottom: 0; left: 0; width: 100%;">
                \${datos.map((d, i) => {
                    const isEdge = i === 0 || i === datos.length - 1;
                    const isMid = i === Math.floor(datos.length / 2);
                    if (datos.length <= 10 || isEdge || isMid) {
                        return \`<span style="font-size:0.7rem; color:#7a8ba3; transform: rotate(-45deg); transform-origin: top left; position: absolute; left: \${(i / Math.max(1, datos.length - 1)) * 100}%; top: 5px;">\${fechaPE(d.fecha)}\</span>\`;
                    }
                    return '';
                }).join('')}
            </div>
        </div>\`;
    }
`;

js = js.replace(/function generarBarrasHTML/, generarLineasHTML + '\n    function generarBarrasHTML');

fs.writeFileSync('./Js/panel/panel-estadisticas.js', js);
