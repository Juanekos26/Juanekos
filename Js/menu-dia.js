/* JUANEKO'S · MENÚ DEL DÍA EN SUPABASE */
const CLAVE_MENU_DIA = 'juanekos_menu_dia_cache';
let menuDiaCache = [];

function fechaISOJuanekos(fecha = new Date()) {
  return window.juanekosFechaISO ? window.juanekosFechaISO(fecha) : fecha.toISOString().slice(0,10);
}

function normalizarItemMenuDia(item) {
  return {
    id: String(item?.id || ''),
    nombre: String(item?.nombre || '').trim(),
    tipo: item?.tipo === 'entrada' ? 'entrada' : 'segundo',
    categoria: 'menu-dia',
    precio: Math.max(0, Number(item?.precio) || 0),
    descripcion: String(item?.descripcion || '').trim(),
    imagen_url: String(item?.imagen_url || '').trim(),
    fecha: String(item?.fecha || fechaISOJuanekos()),
    disponible: item?.disponible !== false && item?.agotado !== true && item?.activo !== false,
    agotado: item?.agotado === true,
    activo: item?.activo !== false,
    created_at: item?.created_at || null,
    updated_at: item?.updated_at || null
  };
}

function persistirCacheMenuDia() {
  try { localStorage.setItem(CLAVE_MENU_DIA, JSON.stringify(menuDiaCache)); } catch (_) {}
}

function leerCacheMenuDia() {
  if (menuDiaCache.length) return menuDiaCache;
  try {
    const x = JSON.parse(localStorage.getItem(CLAVE_MENU_DIA) || '[]');
    if (Array.isArray(x)) menuDiaCache = x.map(normalizarItemMenuDia);
  } catch (_) {}
  return menuDiaCache;
}

function obtenerMenuDiaGuardado() { return leerCacheMenuDia(); }
function guardarMenuDiaGuardado(items) {
  menuDiaCache = (Array.isArray(items) ? items : []).map(normalizarItemMenuDia);
  persistirCacheMenuDia();
  return true;
}

async function cargarMenuDiaSupabase(fecha = null, incluirAgotados = true) {
  const sb = window.juanekosSupabase;
  if (!sb) return obtenerMenuDiaGuardado();
  let q = sb.from('menu_dia').select('*').eq('activo', true).order('tipo').order('nombre');
  if (fecha) q = q.eq('fecha', fecha);
  if (!incluirAgotados) q = q.eq('disponible', true).eq('agotado', false);
  const { data, error } = await q;
  if (error) { console.error('Menú del día:', error); return obtenerMenuDiaGuardado(); }

  const nuevos = (data || []).map(normalizarItemMenuDia);
  if (fecha) {
    menuDiaCache = [...leerCacheMenuDia().filter(x => x.fecha !== fecha), ...nuevos];
  } else menuDiaCache = nuevos;
  persistirCacheMenuDia();
  window.dispatchEvent(new CustomEvent('juanekos:menu-dia-actualizado', { detail: { fecha } }));
  return nuevos;
}

function obtenerMenuDiaPorFecha(fecha = fechaISOJuanekos(), incluirAgotados = false) {
  return leerCacheMenuDia()
    .filter(x => x.fecha === String(fecha))
    .filter(x => incluirAgotados || x.disponible)
    .sort((a,b) => a.tipo === b.tipo ? a.nombre.localeCompare(b.nombre,'es') : (a.tipo === 'entrada' ? -1 : 1));
}
function obtenerMenuDiaHoy(incluirAgotados = false) { return obtenerMenuDiaPorFecha(fechaISOJuanekos(), incluirAgotados); }

async function crearItemMenuDia(datos) {
  const sb = window.juanekosSupabase;
  const payload = {
    nombre: datos.nombre, tipo: datos.tipo, precio: Number(datos.precio), descripcion: datos.descripcion || null, imagen_url: datos.imagen_url || null,
    fecha: datos.fecha || fechaISOJuanekos(), disponible: datos.disponible !== false,
    agotado: datos.disponible === false, activo: true
  };
  const { data, error } = await sb.from('menu_dia').insert(payload).select().single();
  if (error) { console.error(error); return null; }
  await cargarMenuDiaSupabase(payload.fecha, true);
  return normalizarItemMenuDia(data);
}

async function actualizarItemMenuDia(id, cambios) {
  const sb = window.juanekosSupabase;
  const payload = { ...cambios };
  delete payload.id; delete payload.categoria;
  if ('disponible' in payload) payload.agotado = payload.disponible === false;
  const { data, error } = await sb.from('menu_dia').update(payload).eq('id', id).select().single();
  if (error) { console.error(error); return null; }
  await cargarMenuDiaSupabase(data.fecha, true);
  return normalizarItemMenuDia(data);
}

async function eliminarItemMenuDia(id) {
  const item = leerCacheMenuDia().find(x => String(x.id) === String(id));
  const { error } = await window.juanekosSupabase.from('menu_dia').delete().eq('id', id);
  if (error) { console.error(error); return false; }
  if (item) await cargarMenuDiaSupabase(item.fecha, true);
  return true;
}

async function alternarDisponibilidadMenuDia(id) {
  const item = leerCacheMenuDia().find(x => String(x.id) === String(id));
  if (!item) return null;
  return actualizarItemMenuDia(id, { disponible: !item.disponible });
}

async function copiarMenuDia(origen, destino) {
  await cargarMenuDiaSupabase(origen, true);
  const fuente = obtenerMenuDiaPorFecha(origen, true);
  if (!fuente.length) return 0;
  const payload = fuente.map(x => ({ nombre:x.nombre, descripcion:x.descripcion||null, imagen_url:x.imagen_url||null, tipo:x.tipo, precio:x.precio, fecha:destino, disponible:true, agotado:false, activo:true }));
  const { error } = await window.juanekosSupabase.from('menu_dia').insert(payload);
  if (error) { console.error(error); return 0; }
  await cargarMenuDiaSupabase(destino, true);
  return payload.length;
}

async function iniciarMenuDiaOnline() {
  await cargarMenuDiaSupabase(fechaISOJuanekos(), false);
  const sb = window.juanekosSupabase;
  if (!sb || window.__juanekosMenuRealtime) return;
  window.__juanekosMenuRealtime = sb.channel('juanekos-menu-dia')
    .on('postgres_changes', { event:'*', schema:'public', table:'menu_dia' }, async () => {
      await cargarMenuDiaSupabase(fechaISOJuanekos(), false);
    }).subscribe();
}

document.addEventListener('DOMContentLoaded', iniciarMenuDiaOnline);
