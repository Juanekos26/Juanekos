const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-resumen.js', 'utf8');

const oldLogic = `    actualizarElemento("pedidosCancelados", pedidos.filter(pedidoEstaCancelado).length);`;

const newLogic = `    const pedidosCanceladosList = pedidos.filter(pedidoEstaCancelado);
    actualizarElemento("pedidosCancelados", pedidosCanceladosList.length);
    let countCanceladosCev = 0;
    let countCanceladosBro = 0;
    pedidosCanceladosList.forEach(p => {
        let esCev = false;
        let esBros = false;
        p.items.forEach(item => {
            if (item.modo === 'cevicheria') esCev = true;
            if (item.modo === 'broaster') esBros = true;
        });
        if (esCev && !esBros) countCanceladosCev++;
        else if (esBros && !esCev) countCanceladosBro++;
        else if (esCev && esBros) { countCanceladosCev++; countCanceladosBro++; }
        else countCanceladosBro++; // default to broaster if unknown logic dictates
    });
    actualizarElemento("canceladosCev", countCanceladosCev);
    actualizarElemento("canceladosBro", countCanceladosBro);`;

js = js.replace(oldLogic, newLogic);
fs.writeFileSync('Js/panel/panel-resumen.js', js);
