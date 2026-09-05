const fs = require('fs');

let file1 = 'Css/admin/admin-modern.css';
let css1 = fs.readFileSync(file1, 'utf8');
css1 = css1.replace(/\.ventas-resumen\s*\{[\s\S]*?\}/, '');
fs.writeFileSync(file1, css1);

let file2 = 'Css/admin/admin-ui.css';
let css2 = fs.readFileSync(file2, 'utf8');
css2 = css2.replace(/\.ventas-resumen\s*\{\s*grid-template-columns:\s*repeat\(3,\s*minmax\(0,1fr\)\);\s*\}/g, '');
fs.writeFileSync(file2, css2);

