const fs = require('fs');
let file2 = 'Js/panel/panel-configuracion.js';
let js = fs.readFileSync(file2, 'utf8');

js = js.replace(/if \(nameEl && nombre\) \{\s*nameEl.textContent = nombre;\s*\}/g, 
  "if (nameEl) { nameEl.textContent = nombre || 'Administrador'; }");

fs.writeFileSync(file2, js);
