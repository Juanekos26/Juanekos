const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel-estadisticas.js', 'utf8');

js = js.replace("createChart('graficoCevicheriaDias', cevicheria, estadisticasTipoGrafico, 'dinero', '#60a5fa', 'Cevichería');", "createChart('graficoCevicheriaDias', ventasCevicheria, estadisticasTipoGrafico, 'dinero', '#60a5fa', 'Cevichería');");
js = js.replace("createChart('graficoBroasterDias', broaster, estadisticasTipoGrafico, 'dinero', '#d4a017', 'Broaster');", "createChart('graficoBroasterDias', ventasBroaster, estadisticasTipoGrafico, 'dinero', '#d4a017', 'Broaster');");
js = js.replace("createChart('graficoPedidosDias', pedidos, estadisticasTipoGrafico, 'numero', '#3b82f6', 'Pedidos');", "createChart('graficoPedidosDias', cantidades, estadisticasTipoGrafico, 'numero', '#3b82f6', 'Pedidos');");

js = js.replace("labels: cevicheria.map(d => fechaPE(d.fecha)),", "labels: ventasCevicheria.map(d => fechaPE(d.fecha)),");
js = js.replace("data: cevicheria.map(d => d.valor),", "data: ventasCevicheria.map(d => d.valor),");
js = js.replace("data: broaster.map(d => d.valor),", "data: ventasBroaster.map(d => d.valor),");

fs.writeFileSync('Js/panel/panel-estadisticas.js', js);
