/* =====================================================
   JUANEKO'S · ESTADÍSTICAS GRÁFICAS (NUEVO DASHBOARD)
===================================================== */
(function () {
  const estadosOrden = ["inicio", "pendiente", "listo", "cerrado", "cancelado"];
  const etiquetasEstado = {
    inicio: "Inicio",
    pendiente: "Pendiente",
    listo: "Listo",
    cerrado: "Cerrado",
    cancelado: "Cancelado",
  };

  function esCevicheItem(nombre) {
    const n = String(nombre || "").toLowerCase();
    const keywords = [
      "ceviche",
      "pota",
      "tiradito",
      "chilcano",
      "causa",
      "parihuela",
      "leche",
      "marisco",
      "mariscos",
      "chaufa",
      "duo",
      "dúo",
      "trio",
      "trío",
      "pescado",
    ];
    return keywords.some((k) => n.includes(k));
  }

  function fechaISODePedido(p) {
    if (p?.fechaISO) return String(p.fechaISO).slice(0, 10);
    const f = String(p?.fecha || "");
    const m = f.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if (m) return `${m[3]}-${m[2].padStart(2, "0")}-${m[1].padStart(2, "0")}`;
    return "";
  }

  function fechaPE(iso) {
    if (!iso) return "";
    const [y, m, d] = iso.split("-");
    return `${d}/${m}`;
  }

  function ultimosDias(n) {
    const out = [];
    const hoy = new Date();
    hoy.setHours(12, 0, 0, 0);
    for (let i = n - 1; i >= 0; i--) {
      const d = new Date(hoy);
      d.setDate(hoy.getDate() - i);
      out.push(
        window.juanekosFechaISO
          ? window.juanekosFechaISO(d)
          : d.toISOString().slice(0, 10),
      );
    }
    return out;
  }

  function dinero(v) {
    return `S/ ${Number(v || 0).toFixed(2)}`;
  }

  function pedidosPeriodo(dias) {
    const fechas = new Set(ultimosDias(dias));
    return (
      typeof obtenerPedidosPanel === "function" ? obtenerPedidosPanel() : []
    ).filter((p) => fechas.has(fechaISODePedido(p)));
  }

  
  window.myChartJsInstances = window.myChartJsInstances || {};
  function createChart(containerId, datos, type, formato, colorHex, label) {
    const container = document.getElementById(containerId);
    if (!container) return;
    container.innerHTML = '<canvas id="canvas-' + containerId + '" style="width: 100%; height: 100%;"></canvas>';
    const ctx = document.getElementById('canvas-' + containerId).getContext('2d');
    
    if (window.myChartJsInstances[containerId]) {
      window.myChartJsInstances[containerId].destroy();
    }
    
    const labels = datos.map(d => fechaPE(d.fecha));
    const dataValues = datos.map(d => d.valor);
    const isDinero = formato === 'dinero';
    
    let bgColor = colorHex;
    let borderColor = colorHex;
    if (colorHex.includes('linear-gradient')) {
       const match = colorHex.match(/#([0-9a-fA-F]{3,6})/);
       if (match) {
           bgColor = match[0];
           borderColor = match[0];
       }
    }
    
    
    const valuePlugin = {
      id: 'valuePlugin',
      afterDatasetsDraw(chart, args, options) {
        if (chart.config.type === 'doughnut') return;
        const { ctx, data } = chart;
        ctx.save();
        ctx.font = 'bold 11px sans-serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'bottom';
        
        chart.data.datasets.forEach((dataset, i) => {
          const meta = chart.getDatasetMeta(i);
          if (meta.hidden) return;
          
          meta.data.forEach((bar, index) => {
            const dataVal = dataset.data[index];
            if (dataVal === 0) return;
            
            const isDinero = dataset.label !== 'Pedidos';
            const text = isDinero ? 'S/ ' + dataVal : dataVal;
            
            ctx.fillStyle = '#ffffff';
            ctx.strokeStyle = '#0a1930';
            ctx.lineWidth = 3;
            
            const x = bar.x;
            const y = bar.y - 5;
            
            ctx.strokeText(text, x, y);
            ctx.fillText(text, x, y);
          });
        });
        ctx.restore();
      }
    };

    Chart.defaults.color = '#7a8ba3';

    window.myChartJsInstances[containerId] = new Chart(ctx, {
      type: type === 'lineas' ? 'line' : 'bar',
      data: {
        labels: labels,
        datasets: [{
          label: label,
          data: dataValues,
          backgroundColor: type === 'lineas' ? bgColor + '33' : bgColor,
          borderColor: borderColor,
          borderWidth: 2,
          fill: type === 'lineas',
          tension: 0.4,
          borderRadius: type === 'lineas' ? 0 : 4,
          pointBackgroundColor: bgColor,
          pointBorderColor: '#ffffff',
          pointRadius: 5,
          pointHoverRadius: 7
        }]
      },
      plugins: [valuePlugin],
      options: {
        responsive: true,
        maintainAspectRatio: false,
        plugins: {
          legend: { display: false },
          tooltip: {
            callbacks: {
              label: function(context) {
                let val = context.parsed.y;
                return isDinero ? 'S/ ' + val.toFixed(2) : val;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            grid: { color: 'rgba(122,139,163,0.1)' },
            ticks: {
                callback: function(value) { return isDinero ? 'S/ ' + value : value; }
            }
          },
          x: {
            grid: { display: false }
          }
        }
      }
    });
  }



  function renderizarKpi(titulo, valor, subtitulo, colorBorder) {
    return `
        <article style="background:#10233f; border:1px solid rgba(255,255,255,0.05); border-top:3px solid ${colorBorder}; border-radius:16px; padding:20px; display:flex; flex-direction:column; justify-content:center; box-shadow:0 8px 16px rgba(0,0,0,0.2);">
            <span style="color:#7a8ba3; font-size:0.75rem; font-weight:800; letter-spacing:1px; margin-bottom:8px;">${titulo}</span>
            <strong style="color:#ffffff; font-size:1.8rem; font-weight:900; margin-bottom:4px;">${valor}</strong>
            <small style="color:#2ecc71; font-size:0.8rem; font-weight:600;">${subtitulo}</small>
        </article>`;
  }

  
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
      kpis.innerHTML = `
                ${renderizarKpi("INGRESOS TOTALES", dinero(totalVentas), "Sin pedidos cancelados", "#d4a017")}
                ${renderizarKpi("PEDIDOS TOTALES", pedidosFiltrados.length, `Periodo seleccionado`, "#3b82f6")}
                ${renderizarKpi("MEJOR DÍA (VENTAS)", mejorDia.fecha ? fechaPE(mejorDia.fecha) : "—", mejorDia.valor > 0 ? `Ganancia: ${dinero(mejorDia.valor)}` : "Sin registros", "#2ecc71")}
                ${renderizarKpi("VENTAS CEVICHERÍA", dinero(totalCevicheria), "Platos marinos", "#f97316")}
                ${renderizarKpi("VENTAS BROASTER", dinero(totalBroaster), "Frituras y otros", "#eab308")}
            `;
    }

    const t = document.getElementById("estadisticasTotalPeriodo");
    if (t) t.textContent = dinero(totalVentas);

    // Render Gráficos
        createChart('graficoVentasDias', ventas, estadisticasTipoGrafico, 'dinero', '#f1c84b', 'Ingresos');
    createChart('graficoCevicheriaDias', cevicheria, estadisticasTipoGrafico, 'dinero', '#60a5fa', 'Cevichería');
    createChart('graficoBroasterDias', broaster, estadisticasTipoGrafico, 'dinero', '#d4a017', 'Broaster');
    createChart('graficoPedidosDias', pedidos, estadisticasTipoGrafico, 'numero', '#3b82f6', 'Pedidos');

    const containerComp = document.getElementById('graficoComparativoDias');
    if (containerComp) {
        containerComp.innerHTML = '<canvas id="canvas-graficoComparativoDias" style="width: 100%; height: 100%;"></canvas>';
        const ctxComp = document.getElementById('canvas-graficoComparativoDias').getContext('2d');
        if (window.myChartJsInstances['graficoComparativoDias']) {
            window.myChartJsInstances['graficoComparativoDias'].destroy();
        }
        
        window.myChartJsInstances['graficoComparativoDias'] = new Chart(ctxComp, {
            type: 'bar',
            data: {
                labels: cevicheria.map(d => fechaPE(d.fecha)),
                datasets: [
                    {
                        label: 'Cevichería',
                        data: cevicheria.map(d => d.valor),
                        backgroundColor: '#3b82f6',
                        borderRadius: 4
                    },
                    {
                        label: 'Broaster',
                        data: broaster.map(d => d.valor),
                        backgroundColor: '#d4a017',
                        borderRadius: 4
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        labels: { color: '#7a8ba3', font: { family: "'Playfair Display', serif" } }
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) { return 'S/ ' + context.parsed.y.toFixed(2); }
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        grid: { color: 'rgba(122,139,163,0.1)' },
                        ticks: {
                            color: '#7a8ba3',
                            callback: function(value) { return 'S/ ' + value; }
                        }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: '#7a8ba3' }
                    }
                }
            }
        });
    }


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

