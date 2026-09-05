/* =====================================================
   JUANEKO'S · ESTADÍSTICAS GRÁFICAS (NUEVO DASHBOARD)
===================================================== */
(function() {
    const estadosOrden = ['inicio', 'pendiente', 'listo', 'cerrado', 'cancelado'];
    const etiquetasEstado = { inicio: 'Inicio', pendiente: 'Pendiente', listo: 'Listo', cerrado: 'Cerrado', cancelado: 'Cancelado' };

    function esCevicheItem(nombre) {
        const n = String(nombre || "").toLowerCase();
        const keywords = ["ceviche", "pota", "tiradito", "chilcano", "causa", "parihuela", "leche", "marisco", "mariscos", "chaufa", "duo", "dúo", "trio", "trío", "pescado"];
        return keywords.some(k => n.includes(k));
    }

    function fechaISODePedido(p) {
        if (p?.fechaISO) return String(p.fechaISO).slice(0, 10);
        const f = String(p?.fecha || '');
        const m = f.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
        if (m) return `${m[3]}-${m[2].padStart(2, '0')}-${m[1].padStart(2, '0')}`;
        return '';
    }

    function fechaPE(iso) {
        if (!iso) return '';
        const [y, m, d] = iso.split('-'); return `${d}/${m}`;
    }

    function ultimosDias(n) {
        const out = [];
        const hoy = new Date(); hoy.setHours(12, 0, 0, 0);
        for (let i = n - 1; i >= 0; i--) {
            const d = new Date(hoy); d.setDate(hoy.getDate() - i);
            out.push(window.juanekosFechaISO ? window.juanekosFechaISO(d) : d.toISOString().slice(0, 10));
        }
        return out;
    }

    function dinero(v) { return `S/ ${Number(v || 0).toFixed(2)}`; }

    function pedidosPeriodo(dias) {
        const fechas = new Set(ultimosDias(dias));
        return (typeof obtenerPedidosPanel === 'function' ? obtenerPedidosPanel() : []).filter(p => fechas.has(fechaISODePedido(p)));
    }

    function generarBarrasHTML(datos, formato, colorHex) {
        if (!datos || datos.length === 0) return `<div style="text-align:center;width:100%;color:#7a8ba3;padding:20px;">Sin datos</div>`;
        const max = Math.max(1, ...datos.map(x => x.valor));
        return datos.map(x => {
            const pct = x.valor <= 0 ? 2 : Math.max(5, (x.valor / max) * 100);
            const val = formato === 'dinero' ? (x.valor >= 1000 ? (x.valor/1000).toFixed(1)+'k' : Math.round(x.valor)) : String(x.valor);
            return `
            <div style="flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:8px; min-width:32px;" title="${fechaPE(x.fecha)} · ${formato==='dinero'?dinero(x.valor):x.valor}">
                <span style="font-size:0.75rem; color:#dce7f5; white-space:nowrap; font-weight:700; transform: rotate(-45deg); transform-origin: center bottom; margin-bottom:4px;">${formato==='dinero'?'S/ ':''}${val}</span>
                <div style="height:100%; width:100%; max-width:40px; background:rgba(255,255,255,0.03); border-radius:8px; display:flex; align-items:flex-end; overflow:hidden;">
                    <i style="display:block; width:100%; height:${pct}%; background:${colorHex}; border-radius:8px 8px 0 0; transition:height 0.4s ease;"></i>
                </div>
                <small style="font-size:0.7rem; color:#7a8ba3; font-weight:600; margin-top:4px;">${fechaPE(x.fecha)}</small>
            </div>`;
        }).join('');
    }

    function renderizarKpi(titulo, valor, subtitulo, colorBorder) {
        return `
        <article style="background:#10233f; border:1px solid rgba(255,255,255,0.05); border-top:3px solid ${colorBorder}; border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:center; box-shadow:0 8px 16px rgba(0,0,0,0.2);">
            <span style="color:#7a8ba3; font-size:0.75rem; font-weight:800; letter-spacing:1px; margin-bottom:8px;">${titulo}</span>
            <strong style="color:#ffffff; font-size:1.8rem; font-weight:900; margin-bottom:4px;">${valor}</strong>
            <small style="color:#2ecc71; font-size:0.8rem; font-weight:600;">${subtitulo}</small>
        </article>`;
    }

    window.renderizarPanelEstadisticas = function() {
        const panel = document.getElementById('panelEstadisticas');
        if (!panel || !document.getElementById('graficoVentasDias')) return;

        const select = document.getElementById('estadisticasDias');
        const dias = Number(select?.value || 30);
        const fechas = ultimosDias(dias);
        const pedidos = pedidosPeriodo(dias);
        const validos = pedidos.filter(p => normalizarEstado(p.estado) !== 'cancelado');

        // Datos para gráficos
        const ventas = fechas.map(fecha => ({ fecha, valor: validos.filter(p => fechaISODePedido(p) === fecha).reduce((s, p) => s + Number(obtenerTotalPedido(p) || 0), 0) }));
        const cantidades = fechas.map(fecha => ({ fecha, valor: pedidos.filter(p => fechaISODePedido(p) === fecha).length }));
        
        // Ventas Cevichería y Broaster
        const ventasCevicheria = fechas.map(fecha => {
            const validosDia = validos.filter(p => fechaISODePedido(p) === fecha);
            const valor = validosDia.reduce((s, p) => {
                let esCev = false; let esBros = false;
                (p.productos || []).forEach(item => { if (esCevicheItem(item.nombre)) esCev = true; else esBros = true; });
                let t = obtenerTotalPedido(p);
                if (esCev && !esBros) return s + t;
                if (esCev && esBros) return s + (t / 2);
                return s;
            }, 0);
            return { fecha, valor };
        });

        const ventasBroaster = fechas.map(fecha => {
            const validosDia = validos.filter(p => fechaISODePedido(p) === fecha);
            const valor = validosDia.reduce((s, p) => {
                let esCev = false; let esBros = false;
                (p.productos || []).forEach(item => { if (esCevicheItem(item.nombre)) esCev = true; else esBros = true; });
                let t = obtenerTotalPedido(p);
                if (esBros && !esCev) return s + t;
                if (!esBros && !esCev) return s + t; // Fallback a broaster
                if (esCev && esBros) return s + (t / 2);
                return s;
            }, 0);
            return { fecha, valor };
        });

        const totalVentas = ventas.reduce((s, x) => s + x.valor, 0);
        const totalCevicheria = ventasCevicheria.reduce((s, x) => s + x.valor, 0);
        const totalBroaster = ventasBroaster.reduce((s, x) => s + x.valor, 0);
        const mejorDia = ventas.reduce((a, b) => b.valor > a.valor ? b : a, { fecha: '', valor: 0 });

        // KPIs
        const kpis = document.getElementById('estadisticasKpis');
        if (kpis) {
            kpis.innerHTML = `
                ${renderizarKpi("INGRESOS TOTALES", dinero(totalVentas), "Sin pedidos cancelados", "#d4a017")}
                ${renderizarKpi("PEDIDOS TOTALES", pedidos.length, `En los últimos ${dias} días`, "#3b82f6")}
                ${renderizarKpi("MEJOR DÍA (VENTAS)", mejorDia.fecha ? fechaPE(mejorDia.fecha) : '—', mejorDia.valor > 0 ? `Ganancia: ${dinero(mejorDia.valor)}` : 'Sin registros', "#2ecc71")}
                ${renderizarKpi("VENTAS CEVICHERÍA", dinero(totalCevicheria), "Platos marinos", "#f97316")}
                ${renderizarKpi("VENTAS BROASTER", dinero(totalBroaster), "Frituras y otros", "#eab308")}
            `;
        }

        const t = document.getElementById('estadisticasTotalPeriodo');
        if (t) t.textContent = dinero(totalVentas);

        // Render Gráficos
        document.getElementById('graficoVentasDias').innerHTML = generarBarrasHTML(ventas, 'dinero', 'linear-gradient(180deg, #d4a017, #b38600)');
        document.getElementById('graficoCevicheriaDias').innerHTML = generarBarrasHTML(ventasCevicheria, 'dinero', 'linear-gradient(180deg, #f97316, #c2410c)');
        document.getElementById('graficoBroasterDias').innerHTML = generarBarrasHTML(ventasBroaster, 'dinero', 'linear-gradient(180deg, #eab308, #a16207)');
        document.getElementById('graficoPedidosDias').innerHTML = generarBarrasHTML(cantidades, 'numero', 'linear-gradient(180deg, #3b82f6, #1d4ed8)');

        // Gráfico de Estados
        const estados = document.getElementById('graficoEstadosPedidos');
        const coloresEstado = { inicio: '#8fa1b7', pendiente: '#f4c542', listo: '#59d98e', cerrado: '#9aa9bb', cancelado: '#ff6c78' };
        if (estados) {
            estados.innerHTML = estadosOrden.map(e => {
                const c = pedidos.filter(p => normalizarEstado(p.estado) === e).length;
                const pct = pedidos.length ? Math.round(c / pedidos.length * 100) : 0;
                return `
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; justify-content:space-between; color:#e9f1fa; font-size:0.9rem;">
                        <span style="font-weight:600; text-transform:uppercase;">${etiquetasEstado[e]}</span>
                        <strong style="color:${coloresEstado[e]};">${c} (${pct}%)</strong>
                    </div>
                    <div style="height:12px; background:#081827; border-radius:999px; overflow:hidden;">
                        <i style="display:block; height:100%; width:${pct}%; background:${coloresEstado[e]}; border-radius:999px;"></i>
                    </div>
                </div>`;
            }).join('');
        }

        if (select && !select.dataset.configurado) {
            select.addEventListener('change', window.renderizarPanelEstadisticas);
            select.dataset.configurado = '1';
        }
    };
})();
