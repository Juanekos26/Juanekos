const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

js = js.replace(/return isDinero \? 'S\/ ' \+ \(value >= 1000 \? \(value\/1000\)\.toFixed\(1\)\+'k' : Math\.round\(value\)\) : value;/, "return 'S/ ' + (value >= 1000 ? (value/1000).toFixed(1)+'k' : Math.round(value));");

fs.writeFileSync('Js/panel/panel-resumen.js', js);
