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

  function generarLineasHTML(datos, formato, colorHex) {
    if (!datos || datos.length === 0)
      return `<div style="text-align:center;width:100%;color:#7a8ba3;padding:20px;">Sin datos</div>`;
    const max = Math.max(1, ...datos.map((x) => x.valor));
    const colorPlain = colorHex.includes("#")
      ? colorHex.match(/#[0-9a-fA-F]{3,6}/)[0]
      : "#60a5fa";

    let svgPath = "M 0 100 ";
    let svgPoints = "";
    const step = datos.length > 1 ? 100 / (datos.length - 1) : 100;

    datos.forEach((d, i) => {
      const x = i * step;
      const pct = d.valor <= 0 ? 0 : (d.valor / max) * 100;
      const y = 100 - pct;

      if (i === 0) svgPath = `M ${x.toFixed(2)} ${y.toFixed(2)} `;
      else svgPath += `L ${x.toFixed(2)} ${y.toFixed(2)} `;

      const val = formato === "dinero" ? dinero(d.valor) : d.valor;
      svgPoints += `<circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="1.5" fill="${colorPlain}" stroke="#0a1930" stroke-width="0.5" title="${fechaPE(d.fecha)} · ${val}" />
                          <circle cx="${x.toFixed(2)}" cy="${y.toFixed(2)}" r="3" fill="transparent" style="cursor:crosshair;" title="${fechaPE(d.fecha)} · ${val}" />`;
    });

    let filledPath = svgPath;
    if (datos.length > 1) {
      filledPath += `L 100 100 L 0 100 Z`;
    } else {
      filledPath = `M 0 100 L 0 0 L 100 0 L 100 100 Z`;
    }

    const gradientId = "grad-" + Math.random().toString(36).substr(2, 5);

    return `<div style="flex: 1; min-width: 100%; height: 100%; display: flex; flex-direction: column; position: relative;">
            <div style="flex: 1; position: relative; padding-bottom: 25px; margin-top: 20px;">
                <svg viewBox="0 -5 100 110" preserveAspectRatio="none" style="position: absolute; top: 0; left: 0; width: 100%; height: calc(100% - 25px); overflow: visible;">
                    <defs>
                        <linearGradient id="${gradientId}" x1="0" x2="0" y1="0" y2="1">
                            <stop offset="0%" stop-color="${colorPlain}" stop-opacity="0.4"/>
                            <stop offset="100%" stop-color="${colorPlain}" stop-opacity="0.0"/>
                        </linearGradient>
                    </defs>
                    <path d="${filledPath}" fill="url(#${gradientId})" />
                    <path d="${svgPath}" fill="none" stroke="${colorPlain}" stroke-width="0.8" stroke-linecap="round" stroke-linejoin="round" />
                    ${svgPoints}
                </svg>
            </div>
            <div style="display: flex; justify-content: space-between; align-items: flex-end; position: absolute; bottom: 0; left: 0; width: 100%;">
                ${datos
                  .map((d, i) => {
                    const isEdge = i === 0 || i === datos.length - 1;
                    const isMid = i === Math.floor(datos.length / 2);
                    if (datos.length <= 10 || isEdge || isMid) {
                      return `<span style="font-size:0.7rem; color:#7a8ba3; transform: rotate(-45deg); transform-origin: top left; position: absolute; left: ${(i / Math.max(1, datos.length - 1)) * 100}%; top: 5px;">${fechaPE(d.fecha)}</span>`;
                    }
                    return "";
                  })
                  .join("")}
            </div>
        </div>`;
  }

  function generarBarrasHTML(datos, formato, colorHex) {
    if (!datos || datos.length === 0)
      return `<div style="text-align:center;width:100%;color:#7a8ba3;padding:20px;">Sin datos</div>`;
    const max = Math.max(1, ...datos.map((x) => x.valor));
    return datos
      .map((x) => {
        const pct = x.valor <= 0 ? 2 : Math.max(5, (x.valor / max) * 100);
        const val =
          formato === "dinero"
            ? x.valor >= 1000
              ? (x.valor / 1000).toFixed(1) + "k"
              : Math.round(x.valor)
            : String(x.valor);
        return `
            <div style="flex:1; height:100%; display:flex; flex-direction:column; justify-content:flex-end; align-items:center; gap:8px; min-width:32px;" title="${fechaPE(x.fecha)} · ${formato === "dinero" ? dinero(x.valor) : x.valor}">
                <span style="font-size:0.75rem; color:#dce7f5; white-space:nowrap; font-weight:700; transform: rotate(-45deg); transform-origin: center bottom; margin-bottom:4px;">${formato === "dinero" ? "S/ " : ""}${val}</span>
                <div style="height:100%; width:100%; max-width:40px; background:rgba(255,255,255,0.03); border-radius:8px; display:flex; align-items:flex-end; overflow:hidden;">
                    <i style="display:block; width:100%; height:${pct}%; background:${colorHex}; border-radius:8px 8px 0 0; transition:height 0.4s ease;"></i>
                </div>
                <small style="font-size:0.7rem; color:#7a8ba3; font-weight:600; margin-top:4px;">${fechaPE(x.fecha)}</small>
            </div>`;
      })
      .join("");
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

