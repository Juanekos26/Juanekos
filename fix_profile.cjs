const fs = require('fs');

// 1. Fix panel.html to remove `display: none;`
let file1 = 'Admin/panel.html';
let html = fs.readFileSync(file1, 'utf8');
html = html.replace('display: none;', 'display: block;');
fs.writeFileSync(file1, html);

// 2. Fix JS to remove tooltip injection and show name
let file2 = 'Js/panel/panel-configuracion.js';
let js = fs.readFileSync(file2, 'utf8');
js = js.replace(/profileContainer\.title = nombre \|\| 'Administrador';/g, '// title removed');
fs.writeFileSync(file2, js);
