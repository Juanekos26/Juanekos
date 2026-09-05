/* JUANEKO'S · PEDIDOS ONLINE EN SUPABASE */
const CLAVE_PEDIDOS = 'juanekos_pedidos';
function obtenerPedidosGuardados(){ try { const x=JSON.parse(localStorage.getItem(CLAVE_PEDIDOS)||'[]'); return Array.isArray(x)?x:[]; } catch(_){ return []; } }
function guardarPedidos(p){ try { localStorage.setItem(CLAVE_PEDIDOS, JSON.stringify(p)); return true; } catch(_){ return false; } }
function obtenerFechaHora(){ const a=new Date(); return { fecha:a.toLocaleDateString('es-PE', {timeZone: 'America/Lima'}), hora:a.toLocaleTimeString('es-PE',{timeZone: 'America/Lima', hour:'2-digit',minute:'2-digit',hour12:true}), timestamp:a.getTime() }; }

async function crearPedido() {
  if (typeof obtenerPedidoActual !== 'function') return null;
  const actual = obtenerPedidoActual();
  if (!actual.cliente) { alert('Ingresa el nombre del cliente.'); document.getElementById('cliente')?.focus(); return null; }
  const mesa = Number(actual.mesa);
  if (!Number.isInteger(mesa) || mesa <= 0) { alert('Ingresa un número de mesa válido.'); document.getElementById('mesa')?.focus(); return null; }
  if (!actual.productos?.length) { alert('Agrega al menos un producto.'); return null; }
  if (typeof window.validarAcompanamientosObligatorios === 'function' && !window.validarAcompanamientosObligatorios(true)) return null;

  const sb = window.juanekosSupabase;
  if (!sb) { alert('No hay conexión con el sistema de pedidos.'); return null; }

  const boton = document.querySelector('.btn-finalizar');
  if (boton) { boton.disabled = true; boton.dataset.texto = boton.textContent; boton.textContent = '⏳ REGISTRANDO...'; }
  try {
    const { data, error } = await sb.rpc('crear_pedido_web', {
      p_cliente_nombre: actual.cliente,
      p_mesa: mesa,
      p_productos: actual.productos,
      p_observaciones: actual.observaciones || null
    });
    if (error) throw error;
    
    const fh = obtenerFechaHora();
    // Si la base de datos nos devuelve la fecha (p.ej. data.fecha o data.created_at), la usamos para evitar desincronización
    const fechaServidor = data.fecha ? data.fecha : (data.created_at ? new Date(data.created_at).toLocaleDateString('es-PE', {timeZone: 'America/Lima'}) : fh.fecha);
    const horaServidor = data.hora ? data.hora : (data.created_at ? new Date(data.created_at).toLocaleTimeString('es-PE', {timeZone: 'America/Lima', hour:'2-digit', minute:'2-digit', hour12:true}) : fh.hora);
    const timestampServidor = data.created_at ? new Date(data.created_at).getTime() : fh.timestamp;
    
    const pedido = {
      uuid: data.id,
      id: Number(data.numero_pedido),
      cliente: actual.cliente,
      mesa,
      productos: actual.productos,
      total: Number(data.total || actual.total || 0),
      fecha: fechaServidor, hora: horaServidor, timestamp: timestampServidor,
      estado: data.estado || 'inicio'
    };

    const local = obtenerPedidosGuardados().filter(x => String(x.uuid) !== String(pedido.uuid));
    local.push(pedido); guardarPedidos(local.slice(-20));
    return pedido;
  } catch (error) {
    console.error('Error registrando pedido:', error);
    alert(`No se pudo registrar el pedido. ${error?.message || 'Intenta nuevamente.'}`);
    return null;
  } finally {
    if (boton) { boton.disabled = false; boton.textContent = boton.dataset.texto || '✅ FINALIZAR PEDIDO'; }
  }
}

async function finalizarPedido() {
  const pedido = await crearPedido();
  if (!pedido) return;
  alert(`Pedido #${pedido.id} registrado correctamente.`);
  if (typeof limpiarPedido === 'function') limpiarPedido();
  return pedido;
}

function recalcularPedido(pedido){ if(!pedido?.productos) return pedido; pedido.total=Number(pedido.productos.reduce((s,p)=>s+Number(p.precio||0)*Number(p.cantidad||0),0).toFixed(2)); return pedido; }
function obtenerPedidoPorId(id){ return obtenerPedidosGuardados().find(p=>String(p.id)===String(id)||String(p.uuid)===String(id))||null; }
function calcularVentasTotales(){ return obtenerPedidosGuardados().reduce((s,p)=>s+Number(p.total||0),0); }
function obtenerPedidosDeHoy(){ const h=new Date().toLocaleDateString('es-PE', {timeZone: 'America/Lima'}); return obtenerPedidosGuardados().filter(p=>p.fecha===h); }
function calcularVentasDeHoy(){ return obtenerPedidosDeHoy().reduce((s,p)=>s+Number(p.total||0),0); }

/* Compatibilidad con módulos del panel administrativo */
function actualizarPedido(pedidoActualizado) {
  if (!pedidoActualizado) return false;
  const obtener = typeof obtenerPedidosPanel === 'function' ? obtenerPedidosPanel : obtenerPedidosGuardados;
  const guardar = typeof guardarPedidosPanel === 'function' ? guardarPedidosPanel : guardarPedidos;
  const pedidos = obtener();
  const i = pedidos.findIndex(p => String(p.uuid || p.id) === String(pedidoActualizado.uuid || pedidoActualizado.id));
  if (i < 0) return false;
  pedidos[i] = recalcularPedido({ ...pedidos[i], ...pedidoActualizado });
  return guardar(pedidos);
}
function eliminarPedido(id) {
  const obtener = typeof obtenerPedidosPanel === 'function' ? obtenerPedidosPanel : obtenerPedidosGuardados;
  const guardar = typeof guardarPedidosPanel === 'function' ? guardarPedidosPanel : guardarPedidos;
  const pedidos = obtener();
  const nuevos = pedidos.filter(p => String(p.id)!==String(id) && String(p.uuid)!==String(id));
  if (nuevos.length===pedidos.length) return false;
  return guardar(nuevos);
}
function cerrarPedido(id) {
  const p = (typeof buscarPedidoPanel==='function'?buscarPedidoPanel(id):obtenerPedidoPorId(id));
  if (!p) return false;
  return actualizarPedido({ ...p, estado:'cerrado' });
}
