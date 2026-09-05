const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

js = js.replace(
    /actualizarElemento\("pedidosBroaster", `\$\{pedidosBroasterHoyCount\} pedidos`\);/,
    'actualizarElemento("pedidosBroaster", `${pedidosBroasterHoyCount} pedidos`);\n    actualizarElemento("pedidosHoyCevicheriaTop", pedidosCevicheriaHoyCount);\n    actualizarElemento("pedidosHoyBroasterTop", pedidosBroasterHoyCount);'
);

fs.writeFileSync('Js/panel/panel-resumen.js', js);
