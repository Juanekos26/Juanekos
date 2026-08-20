/* JUANEKO'S · ESTADÍSTICAS GRÁFICAS */
(function(){
  const estadosOrden = ['inicio','pendiente','listo','cerrado','cancelado'];
  const etiquetasEstado = {inicio:'Inicio',pendiente:'Pendiente',listo:'Listo',cerrado:'Cerrado',cancelado:'Cancelado'};

  function fechaISODePedido(p){
    if (p?.fechaISO) return String(p.fechaISO).slice(0,10);
    const f=String(p?.fecha||'');
    const m=f.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
    if(m) return `${m[3]}-${m[2].padStart(2,'0')}-${m[1].padStart(2,'0')}`;
    return '';
  }
  function fechaPE(iso){
    if(!iso) return '';
    const [y,m,d]=iso.split('-'); return `${d}/${m}`;
  }
  function ultimosDias(n){
    const out=[];
    const hoy=new Date(); hoy.setHours(12,0,0,0);
    for(let i=n-1;i>=0;i--){ const d=new Date(hoy); d.setDate(hoy.getDate()-i); out.push(window.juanekosFechaISO?window.juanekosFechaISO(d):d.toISOString().slice(0,10)); }
    return out;
  }
  function dinero(v){ return `S/ ${Number(v||0).toFixed(2)}`; }
  function pedidosPeriodo(dias){
    const fechas=new Set(ultimosDias(dias));
    return (typeof obtenerPedidosPanel==='function'?obtenerPedidosPanel():[]).filter(p=>fechas.has(fechaISODePedido(p)));
  }
  function barras(contenedor, datos, formato){
    if(!contenedor) return;
    const max=Math.max(1,...datos.map(x=>x.valor));
    contenedor.innerHTML=datos.map(x=>{
      const pct=x.valor<=0?2:Math.max(5,(x.valor/max)*100);
      const val=formato==='dinero'?dinero(x.valor):String(x.valor);
      return `<div class="barra-pro-item" title="${fechaPE(x.fecha)} · ${val}">
        <span class="barra-pro-valor">${val}</span>
        <div class="barra-pro-track"><i style="height:${pct}%"></i></div>
        <small>${fechaPE(x.fecha)}</small>
      </div>`;
    }).join('');
  }

  window.renderizarPanelEstadisticas=function(){
    const panel=document.getElementById('panelEstadisticas');
    if(!panel || !document.getElementById('graficoVentasDias')) return;
    const select=document.getElementById('estadisticasDias');
    const dias=Number(select?.value||14);
    const fechas=ultimosDias(dias);
    const pedidos=pedidosPeriodo(dias);
    const validos=pedidos.filter(p=>normalizarEstado(p.estado)!=='cancelado');
    const ventas=fechas.map(fecha=>({fecha,valor:validos.filter(p=>fechaISODePedido(p)===fecha).reduce((s,p)=>s+Number(obtenerTotalPedido(p)||0),0)}));
    const cantidades=fechas.map(fecha=>({fecha,valor:pedidos.filter(p=>fechaISODePedido(p)===fecha).length}));
    const total=ventas.reduce((s,x)=>s+x.valor,0);
    const ticket=validos.length?total/validos.length:0;
    const mejor=ventas.reduce((a,b)=>b.valor>a.valor?b:a,{fecha:'',valor:0});

    const kpis=document.getElementById('estadisticasKpis');
    if(kpis) kpis.innerHTML=`
      <article><span>Ingresos</span><strong>${dinero(total)}</strong><small>sin cancelados</small></article>
      <article><span>Pedidos</span><strong>${pedidos.length}</strong><small>${dias} días</small></article>
      <article><span>Ticket promedio</span><strong>${dinero(ticket)}</strong><small>por pedido válido</small></article>
      <article><span>Mejor día</span><strong>${mejor.fecha?fechaPE(mejor.fecha):'—'}</strong><small>${dinero(mejor.valor)}</small></article>`;
    const t=document.getElementById('estadisticasTotalPeriodo'); if(t) t.textContent=dinero(total);
    barras(document.getElementById('graficoVentasDias'),ventas,'dinero');
    barras(document.getElementById('graficoPedidosDias'),cantidades,'numero');

    const estados=document.getElementById('graficoEstadosPedidos');
    if(estados){
      estados.innerHTML=estadosOrden.map(e=>{
        const c=pedidos.filter(p=>normalizarEstado(p.estado)===e).length;
        const pct=pedidos.length?Math.round(c/pedidos.length*100):0;
        return `<div class="estado-grafico-row estado-${e}"><div><span>${etiquetasEstado[e]}</span><strong>${c}</strong></div><div class="estado-grafico-track"><i style="width:${pct}%"></i></div><small>${pct}%</small></div>`;
      }).join('');
    }
    if(select && !select.dataset.configurado){ select.addEventListener('change',window.renderizarPanelEstadisticas); select.dataset.configurado='1'; }
  };
})();
