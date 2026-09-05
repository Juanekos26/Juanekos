const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

js = js.replace(/p\.items\.forEach\(item => \{[\s\S]*?\}\);/g, `const productos = Array.isArray(p.productos) ? p.productos : [];
        productos.forEach(item => {
            if (esCevicheItem(item.nombre)) esCev = true;
            else esBros = true;
        });`);

fs.writeFileSync('Js/panel/panel-resumen.js', js);
