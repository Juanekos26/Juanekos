/* =====================================================
   JUANEKO'S - RESUMEN Y ESTADÍSTICAS GRÁFICAS
===================================================== */

function actualizarResumen() {
    const pedidos = obtenerPedidos();
    const hoy = obtenerFechaActual();
    const pedidosHoy = pedidos.filter(p => obtenerFechaPedido(p) === hoy);
    const validos = pedidos.filter(p => !pedidoEstaCancelado(p));
    const ventasHoy = pedidosHoy.filter(p => !pedidoEstaCancelado(p)).reduce((s, p) => s + obtenerTotalPedido(p), 0);
    const ventasTotales = validos.reduce((s, p) => s + obtenerTotalPedido(p), 0);

    actualizarElemento("ventasHoy", formatearPrecio(ventasHoy));
    actualizarElemento("pedidosHoy", pedidosHoy.length);
    actualizarElemento("ventasTotales", formatearPrecio(ventasTotales));
    actualizarElemento("pedidosTotales", pedidos.length);
    actualizarElemento("pedidosPendientes", pedidos.filter(pedidoEstaPendiente).length);
    actualizarElemento("pedidosCancelados", pedidos.filter(pedidoEstaCancelado).length);
    configurarBotonesEstadisticas();
}

function actualizarElemento(id, valor) {
    const el = document.getElementById(id);
    if (el) el.textContent = valor;
}

function configurarBotonesEstadisticas() {
    document.querySelectorAll("[data-estadistica]").forEach(boton => {
        if (boton.dataset.estadisticaConfigurado === "true") return;
        boton.addEventListener("click", () => mostrarEstadistica(boton.dataset.estadistica));
        boton.dataset.estadisticaConfigurado = "true";
    });
}

function obtenerDatosEstadistica(tipo, pedidos) {
    const agrupados = agruparPedidosPorDia(pedidos, tipo);
    return Object.keys(agrupados)
        .sort((a, b) => convertirFecha(a) - convertirFecha(b))
        .slice(-14)
        .map(fecha => ({ fecha, valor: Number(agrupados[fecha]) || 0 }));
}

function abreviarFecha(fecha) {
    const partes = String(fecha).split("/");
    return partes.length === 3 ? `${partes[0]}/${partes[1]}` : fecha;
}

function generarGraficoBarras(datos, formato = "numero") {
    if (!datos.length) {
        return `<div class="estadisticas-vacio"><span>📉</span><strong>Aún no hay datos</strong><p>Los gráficos aparecerán cuando se registren pedidos.</p></div>`;
    }

    const max = Math.max(...datos.map(d => d.valor), 1);
    return `
        <div class="chart-wrap" role="img" aria-label="Gráfico de resultados por fecha">
            <div class="chart-grid" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
            <div class="chart-bars">
                ${datos.map(d => {
                    const alto = Math.max(4, (d.valor / max) * 100);
                    const valor = formato === "dinero" ? formatearPrecio(d.valor) : d.valor;
                    return `
                        <div class="chart-item" title="${escaparHTML(d.fecha)} · ${escaparHTML(valor)}">
                            <span class="chart-value">${escaparHTML(valor)}</span>
                            <div class="chart-bar-track"><div class="chart-bar" style="height:${alto}%"></div></div>
                            <span class="chart-label">${escaparHTML(abreviarFecha(d.fecha))}</span>
                        </div>`;
                }).join("")}
            </div>
        </div>`;
}

function mostrarEstadistica(tipo) {
    const contenedor = document.getElementById("estadisticasPanel");
    if (!contenedor) return;

    const pedidos = obtenerPedidos();
    const config = {
        ventas: { titulo: "Ventas por día", subtitulo: "Ingresos registrados (sin cancelados)", formato: "dinero" },
        pedidos: { titulo: "Pedidos por día", subtitulo: "Cantidad total de órdenes registradas", formato: "numero" },
        pendientes: { titulo: "Pendientes por día", subtitulo: "Órdenes que todavía requieren atención", formato: "numero" },
        cancelados: { titulo: "Cancelados por día", subtitulo: "Seguimiento de pedidos anulados", formato: "numero" }
    }[tipo] || { titulo: "Estadísticas", subtitulo: "Resultados", formato: "numero" };

    const datos = obtenerDatosEstadistica(tipo, pedidos);
    const total = datos.reduce((s, d) => s + d.valor, 0);
    const promedio = datos.length ? total / datos.length : 0;
    const mejor = datos.length ? datos.reduce((a, b) => b.valor > a.valor ? b : a) : null;
    const imprimir = v => config.formato === "dinero" ? formatearPrecio(v) : Math.round(v * 10) / 10;

    contenedor.hidden = false;
    contenedor.innerHTML = `
        <div class="estadisticas-header">
            <div><span class="admin-etiqueta">ANALÍTICA · ÚLTIMOS 14 DÍAS</span><h3>${config.titulo}</h3><p>${config.subtitulo}</p></div>
            <button type="button" id="cerrarEstadisticas" class="btn-cerrar-detalle" aria-label="Cerrar estadísticas">✕</button>
        </div>
        <div class="analytics-kpis">
            <article><small>TOTAL DEL PERÍODO</small><strong>${imprimir(total)}</strong></article>
            <article><small>PROMEDIO DIARIO</small><strong>${imprimir(promedio)}</strong></article>
            <article><small>MEJOR DÍA</small><strong>${mejor ? escaparHTML(abreviarFecha(mejor.fecha)) : "—"}</strong><span>${mejor ? imprimir(mejor.valor) : "Sin datos"}</span></article>
        </div>
        ${generarGraficoBarras(datos, config.formato)}
        <div class="chart-legend"><span></span>${config.titulo}. Pasa el cursor o toca una barra para ver el detalle.</div>
    `;

    document.getElementById("cerrarEstadisticas")?.addEventListener("click", () => { contenedor.hidden = true; });
    contenedor.scrollIntoView({ behavior: "smooth", block: "nearest" });
}

function agruparPedidosPorDia(pedidos, tipo) {
    return pedidos.reduce((acc, pedido) => {
        const fecha = obtenerFechaPedido(pedido);
        if (!fecha) return acc;
        if (!(fecha in acc)) acc[fecha] = 0;

        if (tipo === "ventas") {
            if (!pedidoEstaCancelado(pedido)) acc[fecha] += obtenerTotalPedido(pedido);
        } else if (tipo === "pedidos") {
            acc[fecha] += 1;
        } else if (tipo === "pendientes") {
            if (pedidoEstaPendiente(pedido)) acc[fecha] += 1;
        } else if (tipo === "cancelados") {
            if (pedidoEstaCancelado(pedido)) acc[fecha] += 1;
        }
        return acc;
    }, {});
}
