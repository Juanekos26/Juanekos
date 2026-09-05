const fs = require('fs');

function fixTimezone(filePath) {
    let content = fs.readFileSync(filePath, 'utf8');
    content = content.replace(/toLocaleDateString\(\s*['"]es-PE['"]\s*\)/g, "toLocaleDateString('es-PE', {timeZone: 'America/Lima'})");
    content = content.replace(/toLocaleDateString\(\s*['"]es-PE['"]\s*,\s*\{(.*?)\}\s*\)/g, (match, p1) => {
        if (!p1.includes('timeZone')) {
            return `toLocaleDateString('es-PE', {timeZone: 'America/Lima', ${p1}})`;
        }
        return match;
    });
    content = content.replace(/toLocaleTimeString\(\s*['"]es-PE['"]\s*,\s*\{(.*?)\}\s*\)/g, (match, p1) => {
        if (!p1.includes('timeZone')) {
            return `toLocaleTimeString('es-PE', {timeZone: 'America/Lima', ${p1}})`;
        }
        return match;
    });
    fs.writeFileSync(filePath, content);
}

fixTimezone('Js/panel/panel-utilidades.js');
fixTimezone('Js/panel/panel.js');
fixTimezone('Js/panel/panel-impresion.js');
fixTimezone('Js/panel/panel-resumen.js');
fixTimezone('Js/pedido.js');

console.log("Timezones fixed");
