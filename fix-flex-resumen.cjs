const fs = require('fs');
let js = fs.readFileSync('./Js/panel/panel-resumen.js', 'utf8');

js = js.replace(/<div style="width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;">/, '<div style="flex: 1; min-width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;">');

fs.writeFileSync('./Js/panel/panel-resumen.js', js);
