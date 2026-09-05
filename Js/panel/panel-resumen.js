/* =====================================================
   JUANEKO'S - RESUMEN Y ESTADÍSTICAS GRÁFICAS
===================================================== */

function esCevicheItem(nombre) {
    const n = String(nombre || "").toLowerCase();
    const keywords = ["ceviche", "pota", "tiradito", "chilcano", "causa", "parihuela", "leche", "marisco", "mariscos", "chaufa", "duo", "dúo", "trio", "trío", "pescado"];
    return keywords.some(k => n.includes(k));
}

function actualizarResumen() {
    const pedidos = obtenerPedidos();
    const hoy = obtenerFechaActual();
    const pedidosHoy = pedidos.filter(p => obtenerFechaPedido(p) === hoy && !pedidoEstaCancelado(p));
    const validos = pedidos.filter(p => !pedidoEstaCancelado(p));
    
    const ventasHoy = pedidosHoy.reduce((s, p) => s + obtenerTotalPedido(p), 0);
    const ventasTotales = validos.reduce((s, p) => s + obtenerTotalPedido(p), 0);

    // Calcular Cevichería vs Broaster (Hoy)
    let ventasCevicheriaHoy = 0;
    let pedidosCevicheriaHoyCount = 0;
    let ventasBroasterHoy = 0;
    let pedidosBroasterHoyCount = 0;

    pedidosHoy.forEach(p => {
        const productos = Array.isArray(p.productos) ? p.productos : [];
        let esCev = false;
        let esBros = false;
        let totalP = obtenerTotalPedido(p);
        
        productos.forEach(item => {
            if (esCevicheItem(item.nombre)) {
                esCev = true;
            } else {
                esBros = true;
            }
        });

        if (esCev && !esBros) {
            ventasCevicheriaHoy += totalP;
            pedidosCevicheriaHoyCount++;
        } else if (esBros && !esCev) {
            ventasBroasterHoy += totalP;
            pedidosBroasterHoyCount++;
        } else if (esCev && esBros) {
            ventasCevicheriaHoy += totalP / 2;
            ventasBroasterHoy += totalP / 2;
            pedidosCevicheriaHoyCount++;
            pedidosBroasterHoyCount++;
        } else {
            ventasBroasterHoy += totalP;
            pedidosBroasterHoyCount++;
        }
    });

    const totalVentasCat = ventasCevicheriaHoy + ventasBroasterHoy;
    const porcentajeCev = totalVentasCat > 0 ? Math.round((ventasCevicheriaHoy / totalVentasCat) * 100) : 0;
    const porcentajeBros = totalVentasCat > 0 ? Math.round((ventasBroasterHoy / totalVentasCat) * 100) : 0;

    actualizarElemento("ventasHoy", formatearPrecio(ventasHoy));
    actualizarElemento("pedidosHoy", pedidosHoy.length);
    actualizarElemento("pedidosHoySub", `${pedidosHoy.length} pedidos`);
    
    actualizarElemento("ventasCevicheria", formatearPrecio(ventasCevicheriaHoy));
    actualizarElemento("pedidosCevicheria", `${pedidosCevicheriaHoyCount} pedidos`);
    
    actualizarElemento("ventasBroaster", formatearPrecio(ventasBroasterHoy));
    actualizarElemento("pedidosBroaster", `${pedidosBroasterHoyCount} pedidos`);

    actualizarElemento("ventasTotales", formatearPrecio(ventasTotales));
    actualizarElemento("pedidosTotalesCount", `${validos.length} pedidos`);
    actualizarElemento("pedidosTotales", pedidos.length);
    actualizarElemento("pedidosPendientes", pedidos.filter(pedidoEstaPendiente).length);
    actualizarElemento("pedidosCancelados", pedidos.filter(pedidoEstaCancelado).length);

    actualizarElemento("porcentajeCevicheria", `${porcentajeCev}%`);
    actualizarElemento("porcentajeBroaster", `${porcentajeBros}%`);

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
        .slice(-30)
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
    const pedidos = obtenerPedidos();
    const config = {
        ventas: { titulo: "Ventas por día", subtitulo: "Ingresos registrados (sin cancelados)", formato: "dinero" },
        pedidos: { titulo: "Pedidos por día", subtitulo: "Cantidad total de órdenes registradas", formato: "numero" },
        pendientes: { titulo: "Pendientes por día", subtitulo: "Órdenes que todavía requieren atención", formato: "numero" },
        cancelados: { titulo: "Cancelados por día", subtitulo: "Seguimiento de pedidos anulados", formato: "numero" },
        cevicheria: { titulo: "Ventas Cevichería por día", subtitulo: "Ingresos diarios en platillos marinos", formato: "dinero" },
        broaster: { titulo: "Ventas Broaster por día", subtitulo: "Ingresos diarios en pollo broaster y otros", formato: "dinero" }
    }[tipo] || { titulo: "Estadísticas", subtitulo: "Resultados", formato: "numero" };

    const datos = obtenerDatosEstadistica(tipo, pedidos);
    const total = datos.reduce((s, d) => s + d.valor, 0);
    const promedio = datos.length ? total / datos.length : 0;
    const mejor = datos.length ? datos.reduce((a, b) => b.valor > a.valor ? b : a) : null;
    const imprimir = v => config.formato === "dinero" ? formatearPrecio(v) : Math.round(v * 10) / 10;

    let modalExistente = document.getElementById("modalGraficoEstadisticas");
    if (modalExistente) modalExistente.remove();

    const modal = document.createElement("div");
    modal.id = "modalGraficoEstadisticas";
    modal.style.cssText = "position: fixed; inset: 0; z-index: 99999; background: rgba(3, 10, 22, 0.85); backdrop-filter: blur(8px); display: flex; align-items: center; justify-content: center; padding: 16px; animation: fadeInModal 0.25s ease;";
    
    modal.innerHTML = `
        <div style="background: #10233f; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; width: 100%; max-width: 480px; max-height: 90vh; overflow-y: auto; padding: 24px; box-shadow: 0 25px 60px rgba(0,0,0,0.7); display: flex; flex-direction: column; gap: 16px;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 14px;">
                <div>
                    <span style="color: #d4a017; font-size: 0.7rem; font-weight: 800; letter-spacing: 1.5px; display: block; margin-bottom: 4px;">ANALÍTICA GRÁFICA · ÚLTIMOS 30 DÍAS (1 MES)</span>
                    <h3 style="color: #ffffff; font-size: 1.3rem; font-weight: 800; margin: 0; font-family: 'Playfair Display', serif;">${config.titulo}</h3>
                    <p style="color: #7a8ba3; font-size: 0.82rem; margin: 2px 0 0 0;">${config.subtitulo}</p>
                </div>
                <button type="button" id="cerrarModalGrafico" style="background: rgba(255,255,255,0.08); border: none; width: 38px; height: 38px; border-radius: 50%; color: #ffffff; font-size: 1.1rem; cursor: pointer; display: grid; place-items: center; transition: background 0.2s;">✕</button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 8px; background: rgba(0,0,0,0.25); padding: 12px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.04); text-align: center;">
                <div>
                    <span style="color: #7a8ba3; font-size: 0.65rem; font-weight: 700; display: block; margin-bottom: 4px;">TOTAL (1 MES)</span>
                    <strong style="color: #d4a017; font-size: 0.95rem; font-weight: 800;">${imprimir(total)}</strong>
                </div>
                <div>
                    <span style="color: #7a8ba3; font-size: 0.65rem; font-weight: 700; display: block; margin-bottom: 4px;">PROMEDIO</span>
                    <strong style="color: #ffffff; font-size: 0.95rem; font-weight: 800;">${imprimir(promedio)}</strong>
                </div>
                <div>
                    <span style="color: #7a8ba3; font-size: 0.65rem; font-weight: 700; display: block; margin-bottom: 4px;">MEJOR DÍA</span>
                    <strong style="color: #2ecc71; font-size: 0.85rem; font-weight: 800; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${mejor ? escaparHTML(abreviarFecha(mejor.fecha)) : "—"}</strong>
                </div>
            </div>

            <div style="background: #0a1930; border-radius: 16px; padding: 16px; border: 1px solid rgba(255,255,255,0.05);">
                ${generarGraficoBarras(datos, config.formato)}
            </div>

            <button type="button" id="btnExportarExcel" style="width: 100%; background: linear-gradient(135deg, #d4a017, #b38600); color: #0f1c2e; border: none; border-radius: 14px; padding: 12px; font-weight: 800; font-size: 0.9rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 8px; box-shadow: 0 4px 15px rgba(212,160,23,0.3); transition: transform 0.2s;"><i class="fa-solid fa-file-excel"></i> Exportar a Excel (.xls)</button>

            <div style="text-align: center; color: #7a8ba3; font-size: 0.78rem; font-style: italic;">
                Análisis mensual de los últimos 30 días.
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    const cerrar = () => modal.remove();
    document.getElementById("cerrarModalGrafico")?.addEventListener("click", cerrar);
    document.getElementById("btnExportarExcel")?.addEventListener("click", () => exportarAExcel(tipo, datos, config, total, promedio, mejor));
    modal.addEventListener("click", (e) => {
        if (e.target === modal) cerrar();
    });
}

function exportarAExcel(tipo, datos, config, total, promedio, mejor) {
    const titulos = {
        ventas: "REPORTE DE VENTAS TOTALES (ÚLTIMOS 30 DÍAS)",
        pedidos: "REPORTE DE PEDIDOS TOTALES (ÚLTIMOS 30 DÍAS)",
        pendientes: "REPORTE DE PEDIDOS PENDIENTES (ÚLTIMOS 30 DÍAS)",
        cancelados: "REPORTE DE PEDIDOS CANCELADOS (ÚLTIMOS 30 DÍAS)",
        cevicheria: "REPORTE DE VENTAS - CEVICHERÍA (ÚLTIMOS 30 DÍAS)",
        broaster: "REPORTE DE VENTAS - BROASTER (ÚLTIMOS 30 DÍAS)"
    };
    const tituloReporte = titulos[tipo] || config.titulo;
    const esDinero = config.formato === "dinero";

    let excelHtml = `
    <html xmlns:o="urn:schemas-microsoft-com:office:office" xmlns:x="urn:schemas-microsoft-com:office:excel" xmlns="http://www.w3.org/1999/xhtml">
    <head>
        <meta http-equiv="content-type" content="text/html; charset=UTF-8">
        <style>
            .title { font-size: 16pt; font-weight: bold; color: #ffffff; background: #0f1c2e; text-align: center; }
            .subtitle { font-size: 11pt; font-weight: bold; color: #d4a017; background: #0f1c2e; text-align: center; }
            .section { font-size: 11pt; font-weight: bold; color: #0f1c2e; background: #e2e8f0; }
            .th { font-size: 10pt; font-weight: bold; color: #ffffff; background: #0f1c2e; text-align: center; border: 1px solid #cbd5e1; }
            .td { font-size: 10pt; color: #334155; border: 1px solid #cbd5e1; }
            .td-num { font-size: 10pt; color: #0f1c2e; font-weight: bold; text-align: right; border: 1px solid #cbd5e1; }
        </style>
    </head>
    <body>
        <table>
            <tr><td colspan="2" class="title">RESTAURANTE JUANEKO'S</td></tr>
            <tr><td colspan="2" class="subtitle">${tituloReporte}</td></tr>
            <tr><td colspan="2" style="text-align:center; font-size:9pt; color:#64748b;">Fecha de Emisión: ${new Date().toLocaleString()}</td></tr>
            <tr><td colspan="2"></td></tr>
            <tr><td colspan="2" class="section">RESUMEN EJECUTIVO</td></tr>
            <tr><td class="td" style="font-weight:bold;">Total del Período:</td><td class="td-num">${esDinero ? 'S/ ' + total.toFixed(2) : total}</td></tr>
            <tr><td class="td" style="font-weight:bold;">Promedio Diario:</td><td class="td-num">${esDinero ? 'S/ ' + promedio.toFixed(2) : Math.round(promedio * 10) / 10}</td></tr>
            <tr><td class="td" style="font-weight:bold;">Mejor Día:</td><td class="td-num">${mejor ? mejor.fecha + ' (' + (esDinero ? 'S/ ' + mejor.valor.toFixed(2) : mejor.valor) + ')' : 'Sin datos'}</td></tr>
            <tr><td colspan="2"></td></tr>
            <tr><td colspan="2" class="section">DETALLE HISTÓRICO DIARIO (ÚLTIMOS 30 DÍAS)</td></tr>
            <tr>
                <td class="th">Fecha de Registro</td>
                <td class="th">Monto / Cantidad Registrada</td>
            </tr>
    `;

    datos.forEach(d => {
        const valFmt = esDinero ? `S/ ${Number(d.valor).toFixed(2)}` : d.valor;
        excelHtml += `
            <tr>
                <td class="td" style="text-align:center;">${d.fecha}</td>
                <td class="td-num">${valFmt}</td>
            </tr>
        `;
    });

    excelHtml += `
        </table>
    </body>
    </html>
    `;

    const blob = new Blob([excelHtml], { type: 'application/vnd.ms-excel;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Juanekos_Reporte_${tipo}_${new Date().toISOString().slice(0, 10)}.xls`;
    document.body.appendChild(link);
    link.click();
    link.remove();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
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
        } else if (tipo === "cevicheria") {
            if (!pedidoEstaCancelado(pedido)) {
                let cevTotal = 0;
                const productos = Array.isArray(pedido.productos) ? pedido.productos : [];
                let esCev = false, esBros = false;
                let totalP = obtenerTotalPedido(pedido);
                productos.forEach(item => {
                    if (esCevicheItem(item.nombre)) esCev = true;
                    else esBros = true;
                });
                if (esCev && !esBros) cevTotal = totalP;
                else if (esCev && esBros) cevTotal = totalP / 2;
                acc[fecha] += cevTotal;
            }
        } else if (tipo === "broaster") {
            if (!pedidoEstaCancelado(pedido)) {
                let brosTotal = 0;
                const productos = Array.isArray(pedido.productos) ? pedido.productos : [];
                let esCev = false, esBros = false;
                let totalP = obtenerTotalPedido(pedido);
                productos.forEach(item => {
                    if (esCevicheItem(item.nombre)) esCev = true;
                    else esBros = true;
                });
                if (esBros && !esCev) brosTotal = totalP;
                else if (esCev && esBros) brosTotal = totalP / 2;
                else if (!esCev && !esBros) brosTotal = totalP;
                acc[fecha] += brosTotal;
            }
        }
        return acc;
    }, {});
}
