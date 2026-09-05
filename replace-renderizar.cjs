const fs = require('fs');
let js = fs.readFileSync('./Js/panel/panel-estadisticas.js', 'utf8');

const replacement = `
  let estadisticasTipoGrafico = 'barras';

  window.renderizarPanelEstadisticas = function () {
    const panel = document.getElementById("panelEstadisticas");
    if (!panel || !document.getElementById("graficoVentasDias")) return;

    const select = document.getElementById("estadisticasDias");
    const fInicioInput = document.getElementById('estadisticasFechaInicio');
    const fFinInput = document.getElementById('estadisticasFechaFin');
    
    let fechas = [];
    let dias = 31;
    
    if (fInicioInput && fFinInput && fInicioInput.value && fFinInput.value) {
        const dInicio = new Date(fInicioInput.value + "T00:00:00");
        const dFin = new Date(fFinInput.value + "T23:59:59");
        const dActual = new Date(dInicio);
        while (dActual <= dFin) {
            fechas.push(window.juanekosFechaISO ? window.juanekosFechaISO(dActual) : dActual.toISOString().slice(0, 10));
            dActual.setDate(dActual.getDate() + 1);
        }
        if (select) select.value = "31"; // Fallback to select
    } else {
        dias = Number(select?.value || 31);
        fechas = ultimosDias(dias);
    }

    const pedidos = pedidosPeriodo(dias); // Note: we should actually pass all pedidos and filter by dates.
    // Let's get all pedidos and filter by selected 'fechas' array.
    const todosPedidos = typeof obtenerPedidosPanel === 'function' ? obtenerPedidosPanel() : [];
    const pedidosFiltrados = todosPedidos.filter(p => fechas.includes(fechaISODePedido(p)));
    const validos = pedidosFiltrados.filter((p) => normalizarEstado(p.estado) !== "cancelado");

    // Datos para gráficos
    const ventas = fechas.map((fecha) => ({
      fecha,
      valor: validos
        .filter((p) => fechaISODePedido(p) === fecha)
        .reduce((s, p) => s + Number(obtenerTotalPedido(p) || 0), 0),
    }));
    
    const cantidades = fechas.map((fecha) => ({
      fecha,
      valor: pedidosFiltrados.filter((p) => fechaISODePedido(p) === fecha).length,
    }));

    // Ventas Cevichería y Broaster
    const ventasCevicheria = fechas.map((fecha) => {
      const validosDia = validos.filter((p) => fechaISODePedido(p) === fecha);
      const valor = validosDia.reduce((s, p) => {
        let esCev = false;
        let esBros = false;
        (p.productos || []).forEach((item) => {
          if (esCevicheItem(item.nombre)) esCev = true;
          else esBros = true;
        });
        let t = obtenerTotalPedido(p);
        if (esCev && !esBros) return s + t;
        if (esCev && esBros) return s + t / 2;
        return s;
      }, 0);
      return { fecha, valor };
    });

    const ventasBroaster = fechas.map((fecha) => {
      const validosDia = validos.filter((p) => fechaISODePedido(p) === fecha);
      const valor = validosDia.reduce((s, p) => {
        let esCev = false;
        let esBros = false;
        (p.productos || []).forEach((item) => {
          if (esCevicheItem(item.nombre)) esCev = true;
          else esBros = true;
        });
        let t = obtenerTotalPedido(p);
        if (esBros && !esCev) return s + t;
        if (!esBros && !esCev) return s + t; // Fallback a broaster
        if (esCev && esBros) return s + t / 2;
        return s;
      }, 0);
      return { fecha, valor };
    });

    const totalVentas = ventas.reduce((s, x) => s + x.valor, 0);
    const totalCevicheria = ventasCevicheria.reduce((s, x) => s + x.valor, 0);
    const totalBroaster = ventasBroaster.reduce((s, x) => s + x.valor, 0);
    const mejorDia = ventas.reduce((a, b) => (b.valor > a.valor ? b : a), {
      fecha: "",
      valor: 0,
    });

    // KPIs
    const kpis = document.getElementById("estadisticasKpis");
    if (kpis) {
      kpis.innerHTML = \`
                \${renderizarKpi("INGRESOS TOTALES", dinero(totalVentas), "Sin pedidos cancelados", "#d4a017")}
                \${renderizarKpi("PEDIDOS TOTALES", pedidosFiltrados.length, \`Periodo seleccionado\`, "#3b82f6")}
                \${renderizarKpi("MEJOR DÍA (VENTAS)", mejorDia.fecha ? fechaPE(mejorDia.fecha) : "—", mejorDia.valor > 0 ? \`Ganancia: \${dinero(mejorDia.valor)}\` : "Sin registros", "#2ecc71")}
                \${renderizarKpi("VENTAS CEVICHERÍA", dinero(totalCevicheria), "Platos marinos", "#f97316")}
                \${renderizarKpi("VENTAS BROASTER", dinero(totalBroaster), "Frituras y otros", "#eab308")}
            \`;
    }

    const t = document.getElementById("estadisticasTotalPeriodo");
    if (t) t.textContent = dinero(totalVentas);

    // Render Gráficos
    const fnGrafico = estadisticasTipoGrafico === 'lineas' ? generarLineasHTML : generarBarrasHTML;

    document.getElementById("graficoVentasDias").innerHTML = fnGrafico(
      ventas,
      "dinero",
      "linear-gradient(180deg, #d4a017, #b38600)",
    );
    document.getElementById("graficoCevicheriaDias").innerHTML = fnGrafico(
      ventasCevicheria,
      "dinero",
      "linear-gradient(180deg, #f97316, #c2410c)",
    );
    document.getElementById("graficoBroasterDias").innerHTML = fnGrafico(
      ventasBroaster,
      "dinero",
      "linear-gradient(180deg, #eab308, #a16207)",
    );
    document.getElementById("graficoPedidosDias").innerHTML = fnGrafico(
      cantidades,
      "numero",
      "linear-gradient(180deg, #3b82f6, #1d4ed8)",
    );

    // Gráfico de Estados
    const estados = document.getElementById("graficoEstadosPedidos");
    const coloresEstado = {
      inicio: "#8fa1b7",
      pendiente: "#f4c542",
      listo: "#59d98e",
      cerrado: "#9aa9bb",
      cancelado: "#ff6c78",
    };

    if (estados) {
      estados.innerHTML = estadosOrden
        .map((e) => {
          const c = pedidosFiltrados.filter(
            (p) => normalizarEstado(p.estado) === e,
          ).length;
          const pct = pedidosFiltrados.length
            ? Math.round((c / pedidosFiltrados.length) * 100)
            : 0;
          return \`
                <div style="display:flex; flex-direction:column; gap:6px;">
                    <div style="display:flex; justify-content:space-between; color:#e9f1fa; font-size:0.9rem;">
                        <span style="font-weight:600; text-transform:uppercase;">\${etiquetasEstado[e]}</span>
                        <strong style="color:\${coloresEstado[e]};">\${c} (\${pct}%)</strong>
                    </div>
                    <div style="height:12px; background:#081827; border-radius:999px; overflow:hidden;">
                        <i style="display:block; height:100%; width:\${pct}%; background:\${coloresEstado[e]}; border-radius:999px;"></i>
                    </div>
                </div>\`;
        })
        .join("");
    }

    // Event Listeners (una sola vez)
    if (select && !select.dataset.configurado) {
      select.addEventListener("change", () => {
          if(fInicioInput) fInicioInput.value = '';
          if(fFinInput) fFinInput.value = '';
          window.renderizarPanelEstadisticas();
      });
      select.dataset.configurado = "1";
    }
    
    const btnFiltrar = document.getElementById('btnFiltrarEstadisticasPersonalizadas');
    if (btnFiltrar && !btnFiltrar.dataset.configurado) {
        btnFiltrar.addEventListener('click', () => {
            if (fInicioInput && fFinInput && fInicioInput.value && fFinInput.value) {
                if (new Date(fInicioInput.value) > new Date(fFinInput.value)) {
                    if (typeof mostrarMensaje === 'function') mostrarMensaje('La fecha de inicio debe ser menor a la final.', 'error');
                    else alert('La fecha de inicio debe ser menor a la final.');
                    return;
                }
                window.renderizarPanelEstadisticas();
            } else {
                if (typeof mostrarMensaje === 'function') mostrarMensaje('Selecciona ambas fechas.', 'error');
                else alert('Selecciona ambas fechas.');
            }
        });
        btnFiltrar.dataset.configurado = '1';
    }

    const btnBarras = document.getElementById('btnChartTypeBarras');
    const btnLineas = document.getElementById('btnChartTypeLineas');
    
    const updateChartButtons = () => {
        if(btnBarras) {
            btnBarras.style.background = estadisticasTipoGrafico === 'barras' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)';
            btnBarras.style.color = estadisticasTipoGrafico === 'barras' ? '#60a5fa' : '#7a8ba3';
            btnBarras.style.borderColor = estadisticasTipoGrafico === 'barras' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)';
        }
        if(btnLineas) {
            btnLineas.style.background = estadisticasTipoGrafico === 'lineas' ? 'rgba(59,130,246,0.15)' : 'rgba(255,255,255,0.05)';
            btnLineas.style.color = estadisticasTipoGrafico === 'lineas' ? '#60a5fa' : '#7a8ba3';
            btnLineas.style.borderColor = estadisticasTipoGrafico === 'lineas' ? 'rgba(59,130,246,0.3)' : 'rgba(255,255,255,0.1)';
        }
    };

    if (btnBarras && !btnBarras.dataset.configurado) {
        btnBarras.addEventListener('click', () => {
            estadisticasTipoGrafico = 'barras';
            updateChartButtons();
            window.renderizarPanelEstadisticas();
        });
        btnBarras.dataset.configurado = '1';
    }
    
    if (btnLineas && !btnLineas.dataset.configurado) {
        btnLineas.addEventListener('click', () => {
            estadisticasTipoGrafico = 'lineas';
            updateChartButtons();
            window.renderizarPanelEstadisticas();
        });
        btnLineas.dataset.configurado = '1';
    }
    
    updateChartButtons();
  };
})();
`;

js = js.replace(/window\.renderizarPanelEstadisticas = function \(\) \{[\s\S]*\}\)\(\);/, replacement);
fs.writeFileSync('./Js/panel/panel-estadisticas.js', js);
