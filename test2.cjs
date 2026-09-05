const { JSDOM } = require("jsdom");
const fs = require('fs');

const dom = new JSDOM(`<html><body>
<div class="resumen-dashboard" style="display: block;"></div>
<div id="estadisticasPanel" style="display: none;" hidden></div>
<canvas id="resumenDoughnutChart"></canvas>
</body></html>`);
global.document = dom.window.document;
global.window = dom.window;

global.obtenerPedidos = () => {
    return [
        {id: 1, fecha: "2026-09-05", total: 100, productos: [{nombre: "Ceviche"}]}
    ];
};
global.obtenerFechaActual = () => "2026-09-05";
global.obtenerFechaPedido = () => "2026-09-05";
global.pedidoEstaCancelado = () => false;
global.pedidoEstaPendiente = () => false;
global.obtenerTotalPedido = (p) => p.total;
global.formatearPrecio = (v) => v;

global.ChartDataLabels = {};
global.Chart = class {
    constructor() {}
    destroy() {}
};
global.Chart.defaults = { color: '', font: { family: '' } };

const code = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');
eval(code);

try {
    actualizarResumen();
    mostrarEstadistica("ventas");
    console.log("mostrarEstadistica succeded");
} catch(e) {
    console.error("Error in mostrarEstadistica:", e);
}
