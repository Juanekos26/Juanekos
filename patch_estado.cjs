const fs = require('fs');
let content = fs.readFileSync('Js/panel/panel-utilidades.js', 'utf8');

const regex = /const textos = \{\s*inicio: "INICIO",\s*pendiente: "PENDIENTE",\s*listo: "LISTO",\s*cerrado: "CERRADO",\s*cancelado: "CANCELADO"\s*\};/;
const newTextos = `const textos = {
        inicio: "INICIO",
        pendiente: "PENDIENTE",
        listo: "LISTO",
        cerrado: "PAGADO (CERRADO)",
        cancelado: "ANULADO"
    };`;

content = content.replace(regex, newTextos);
fs.writeFileSync('Js/panel/panel-utilidades.js', content);
console.log('patched utilidades');
