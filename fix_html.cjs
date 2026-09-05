const fs = require('fs');

let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

// Find where PARTE 1 starts, and the end of Comparativa
// We will replace everything from <!-- PARTE 1 to the end of <!-- Tarjeta Comparativa final --> with our grid

let headerEndIdx = html.indexOf('<!-- PARTE 1: Fila de 2 tarjetas');
if (headerEndIdx === -1) {
    console.log("Could not find start");
    process.exit(1);
}

let comparativaEndIdx = html.indexOf('</div>\n</div>\n<section');
if (comparativaEndIdx === -1) {
     comparativaEndIdx = html.indexOf('</section>');
     // that's dangerous. Let's just do a string replacement.
}

