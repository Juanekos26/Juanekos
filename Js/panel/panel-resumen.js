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

    const mainDashboard = document.querySelector(".resumen-dashboard");
    const estadisticasPanel = document.getElementById("estadisticasPanel");

    if (mainDashboard) mainDashboard.style.display = "none";
    if (estadisticasPanel) {
        estadisticasPanel.hidden = false;
        estadisticasPanel.style.display = "block";
    }

    estadisticasPanel.innerHTML = `
        <div style="background: #10233f; border: 1px solid rgba(255,255,255,0.08); border-radius: 24px; width: 100%; max-width: 1200px; margin: 0 auto; padding: 32px; box-shadow: 0 10px 40px rgba(0,0,0,0.5); display: flex; flex-direction: column; gap: 24px; animation: fadeIn 0.3s ease;">
            <div style="display: flex; justify-content: space-between; align-items: flex-start; border-bottom: 1px solid rgba(255,255,255,0.06); padding-bottom: 16px;">
                <div>
                    <span style="color: #d4a017; font-size: 0.8rem; font-weight: 800; letter-spacing: 2px; display: block; margin-bottom: 6px;">ANALÍTICA GRÁFICA · ÚLTIMOS 30 DÍAS (1 MES)</span>
                    <h3 style="color: #ffffff; font-size: 1.8rem; font-weight: 800; margin: 0; font-family: 'Playfair Display', serif;">${config.titulo}</h3>
                    <p style="color: #7a8ba3; font-size: 0.95rem; margin: 4px 0 0 0;">${config.subtitulo}</p>
                </div>
                <button type="button" id="cerrarGraficoResumen" style="background: rgba(255,255,255,0.08); border: none; width: 44px; height: 44px; border-radius: 50%; color: #ffffff; font-size: 1.2rem; cursor: pointer; display: grid; place-items: center; transition: background 0.2s; box-shadow: 0 4px 10px rgba(0,0,0,0.2);"><i class="fa-solid fa-xmark"></i></button>
            </div>
            
            <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 16px; background: rgba(0,0,0,0.25); padding: 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.04); text-align: center;">
                <div>
                    <span style="color: #7a8ba3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">TOTAL (1 MES)</span>
                    <strong style="color: #d4a017; font-size: 1.4rem; font-weight: 800;">${imprimir(total)}</strong>
                </div>
                <div>
                    <span style="color: #7a8ba3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">PROMEDIO DIARIO</span>
                    <strong style="color: #ffffff; font-size: 1.4rem; font-weight: 800;">${imprimir(promedio)}</strong>
                </div>
                <div>
                    <span style="color: #7a8ba3; font-size: 0.8rem; font-weight: 700; display: block; margin-bottom: 8px;">MEJOR DÍA</span>
                    <strong style="color: #2ecc71; font-size: 1.2rem; font-weight: 800; display: block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">${mejor ? escaparHTML(abreviarFecha(mejor.fecha)) : "—"}</strong>
                </div>
            </div>

            <div style="background: #0a1930; border-radius: 20px; padding: 24px; border: 1px solid rgba(255,255,255,0.05); min-height: 400px; display: flex; align-items: flex-end;">
                ${generarGraficoBarras(datos, config.formato)}
            </div>

            <div style="display: flex; justify-content: center; margin-top: 10px;">
                <button type="button" id="btnExportarPDFGrafico" style="background: linear-gradient(135deg, #d4a017, #b38600); color: #0f1c2e; border: none; border-radius: 999px; padding: 14px 32px; font-weight: 800; font-size: 1rem; cursor: pointer; display: flex; align-items: center; justify-content: center; gap: 12px; box-shadow: 0 6px 20px rgba(212,160,23,0.35); transition: transform 0.2s;"><i class="fa-solid fa-file-pdf"></i> Guardar como PDF</button>
            </div>
            
            <div style="text-align: center; color: #7a8ba3; font-size: 0.85rem; font-style: italic;">
                Análisis mensual de los últimos 30 días.
            </div>
        </div>
    `;

    const cerrar = () => {
        if (estadisticasPanel) {
            estadisticasPanel.hidden = true;
            estadisticasPanel.style.display = "none";
            estadisticasPanel.innerHTML = "";
        }
        if (mainDashboard) {
            // Restore based on window size
            mainDashboard.style.display = window.innerWidth >= 768 ? "grid" : "flex";
        }
    };
    
    document.getElementById("cerrarGraficoResumen")?.addEventListener("click", cerrar);
    document.getElementById("btnExportarPDFGrafico")?.addEventListener("click", () => exportarAPDF(tipo, datos, config, total, promedio, mejor));
}

function exportarAPDF(tipo, datos, config, total, promedio, mejor) {
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

    const maxVal = Math.max(...datos.map(d => d.valor), 1);
    let chartHtml = `<div class="chart-container">`;
    datos.forEach(d => {
        const h = Math.max(2, Math.min(100, (d.valor / maxVal) * 100));
        const valFmt = esDinero ? (d.valor >= 1000 ? (d.valor/1000).toFixed(1)+'k' : Math.round(d.valor)) : d.valor;
        chartHtml += `
            <div class="chart-bar-wrap">
                <div class="chart-val">${d.valor > 0 ? valFmt : ''}</div>
                <div class="chart-bar" style="height: ${h}%; opacity: ${d.valor > 0 ? '1' : '0.1'}"></div>
                <div class="chart-date">${d.fecha.slice(0,5).replace('-','/')}</div>
            </div>
        `;
    });
    chartHtml += `</div>`;

    let pdfHtml = `
    <!DOCTYPE html>
    <html lang="es">
    <head>
        <meta charset="UTF-8">
        <title>Reporte_${tipo}</title>
        <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@400;600;800&display=swap" rel="stylesheet">
        <style>
            @page { size: A4; margin: 0; }
            body { font-family: 'Plus Jakarta Sans', sans-serif; color: #1e293b; margin: 0; padding: 0; background: #e2e8f0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
            .page { width: 210mm; min-height: 297mm; padding: 20mm; margin: 0 auto; background: white; box-sizing: border-box; box-shadow: 0 10px 25px rgba(0,0,0,0.1); }
            @media print { body { background: white; } .page { box-shadow: none; width: 100%; min-height: auto; margin: 0; padding: 15mm; } }
            
            .header { display: flex; justify-content: space-between; align-items: flex-end; border-bottom: 3px solid #0f1c2e; padding-bottom: 15px; margin-bottom: 30px; }
            .brand h1 { margin: 0; color: #0f1c2e; font-size: 28px; font-weight: 800; text-transform: uppercase; letter-spacing: -1px; }
            .brand span { color: #d4a017; }
            .report-info { text-align: right; }
            .report-title { font-size: 14px; font-weight: 800; color: #d4a017; text-transform: uppercase; margin-bottom: 4px; letter-spacing: 0.5px; }
            .report-date { font-size: 11px; color: #64748b; font-weight: 600; }
            
            .kpi-grid { display: flex; gap: 15px; margin-bottom: 35px; page-break-inside: avoid; }
            .kpi-card { flex: 1; background: #0f1c2e; border-radius: 12px; padding: 20px; color: white; position: relative; overflow: hidden; }
            .kpi-card::before { content: ''; position: absolute; top: -50%; right: -20%; width: 100px; height: 200%; background: rgba(255,255,255,0.03); transform: rotate(15deg); pointer-events: none; }
            .kpi-label { font-size: 10px; color: #94a3b8; text-transform: uppercase; font-weight: 800; margin-bottom: 8px; letter-spacing: 0.5px; }
            .kpi-value { font-size: 24px; font-weight: 800; color: #ffffff; letter-spacing: -0.5px; }
            .kpi-value.gold { color: #d4a017; }
            .kpi-sub { font-size: 11px; color: #10b981; margin-top: 6px; font-weight: 600; background: rgba(16, 185, 129, 0.15); padding: 4px 8px; border-radius: 4px; display: inline-block; }
            
            .section-title { font-size: 14px; font-weight: 800; color: #0f1c2e; margin-bottom: 20px; display: flex; align-items: center; gap: 8px; text-transform: uppercase; letter-spacing: 0.5px; }
            .section-title::before { content: ''; width: 4px; height: 16px; background: #d4a017; border-radius: 2px; }
            
            .chart-box { background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 25px; margin-bottom: 35px; page-break-inside: avoid; }
            .chart-container { display: flex; align-items: flex-end; justify-content: space-between; height: 140px; padding-top: 25px; gap: 4px; }
            .chart-bar-wrap { display: flex; flex-direction: column; align-items: center; justify-content: flex-end; height: 100%; flex: 1; }
            .chart-val { font-size: 8px; font-weight: 800; color: #475569; margin-bottom: 8px; transform: rotate(-45deg); transform-origin: center bottom; }
            .chart-bar { width: 100%; max-width: 14px; background: linear-gradient(180deg, #d4a017 0%, #b38600 100%); border-radius: 4px 4px 0 0; }
            .chart-date { font-size: 9px; font-weight: 800; color: #94a3b8; margin-top: 10px; }
            
            .table-container { border-radius: 12px; overflow: hidden; border: 1px solid #e2e8f0; margin-bottom: 30px; page-break-inside: auto; }
            table { width: 100%; border-collapse: collapse; text-align: left; }
            tr { page-break-inside: avoid; page-break-after: auto; }
            th { background: #f1f5f9; color: #0f1c2e; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 14px 20px; letter-spacing: 0.5px; border-bottom: 2px solid #e2e8f0; }
            th:last-child, td:last-child { text-align: right; }
            td { padding: 12px 20px; font-size: 13px; font-weight: 600; color: #334155; border-bottom: 1px solid #e2e8f0; }
            tr:last-child td { border-bottom: none; }
            tr:nth-child(even) { background: #fafafa; }
            .val-positive { color: #0f1c2e; font-weight: 800; }
            
            .footer { text-align: center; font-size: 10px; font-weight: 600; color: #94a3b8; padding-top: 20px; border-top: 1px solid #e2e8f0; }
        </style>
    </head>
    <body>
        <div class="page">
            <div class="header">
                <div class="brand">
                    <h1>Juaneko<span>'s</span></h1>
                </div>
                <div class="report-info">
                    <div class="report-title">${tituloReporte}</div>
                    <div class="report-date">Emitido: ${new Date().toLocaleString()}</div>
                </div>
            </div>

            <div class="kpi-grid">
                <div class="kpi-card">
                    <div class="kpi-label">Rendimiento Total</div>
                    <div class="kpi-value gold">${esDinero ? 'S/ ' + total.toFixed(2) : total}</div>
                    <div class="kpi-sub">Últimos 30 días</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Promedio Diario</div>
                    <div class="kpi-value">${esDinero ? 'S/ ' + promedio.toFixed(2) : Math.round(promedio * 10) / 10}</div>
                    <div class="kpi-sub">Media constante</div>
                </div>
                <div class="kpi-card">
                    <div class="kpi-label">Pico Máximo (Mejor Día)</div>
                    <div class="kpi-value">${mejor ? (esDinero ? 'S/ ' + mejor.valor.toFixed(2) : mejor.valor) : '0'}</div>
                    ${mejor ? `<div class="kpi-sub">Alcanzado el ${mejor.fecha}</div>` : ''}
                </div>
            </div>

            <div class="section-title">Análisis de Tendencia</div>
            <div class="chart-box">
                ${chartHtml}
            </div>

            <div class="section-title">Desglose Operativo Diario</div>
            <div class="table-container">
                <table>
                    <thead>
                        <tr>
                            <th>Fecha de Operación</th>
                            <th>Registro Consolidado</th>
                        </tr>
                    </thead>
                    <tbody>
                        ${datos.map(d => `
                        <tr>
                            <td style="color: #64748b;">${d.fecha}</td>
                            <td class="${d.valor > 0 ? 'val-positive' : ''}">${esDinero ? `S/ ${Number(d.valor).toFixed(2)}` : d.valor}</td>
                        </tr>
                        `).join('')}
                    </tbody>
                </table>
            </div>

            <div class="footer">
                Reporte Analítico Generado Automáticamente por Juaneko's Sistema Inteligente
            </div>
        </div>
        <script>
            window.onload = function() { 
                setTimeout(() => window.print(), 500); 
            };
        </script>
    </body>
    </html>
    `;

    const blob = new Blob([pdfHtml], { type: 'text/html;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const win = window.open(url, '_blank');
    
    if(!win) {
         alert("Por favor, permite las ventanas emergentes (pop-ups) para generar el PDF.");
    }
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
