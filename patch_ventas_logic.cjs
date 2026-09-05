const fs = require('fs');
let content = fs.readFileSync('Js/panel/panel-ventas.js', 'utf8');

content = content.replace(/if \(window.categoriaPedidoActiva === 'cevicheria'\) return esCev && !esBros;\s*if \(window.categoriaPedidoActiva === 'broaster'\) return esBros \|\| \(!esCev && !esBros\);/, `if (window.categoriaPedidoActiva === 'cevicheria') return esCev;\n            if (window.categoriaPedidoActiva === 'broaster') return esBros || (!esCev && !esBros);`);

fs.writeFileSync('Js/panel/panel-ventas.js', content);
console.log('Patched logic');
