const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-configuracion.js', 'utf8');

const regex = /btnNotif\.addEventListener[\s\S]*?btnNotif\.dataset\.configurado = '1';\n    \}/;
js = js.replace(regex, '');

fs.writeFileSync('Js/panel/panel-configuracion.js', js);
