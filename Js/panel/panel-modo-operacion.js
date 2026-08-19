/* JUANEKO'S · CONTROL DEL MODO DE OPERACIÓN */
const INFO_MODOS_OPERACION = {
  automatico: { titulo: 'Automático', detalle: '11:00–15:59 Cevichería · 16:00–23:59 Broaster.', clase: 'automatico' },
  prueba: { titulo: 'Modo prueba', detalle: 'Muestra Cevichería, Broaster, bebidas y menú del día al mismo tiempo.', clase: 'prueba' },
  cevicheria: { titulo: 'Cevichería forzada', detalle: 'Muestra Cevichería + menú del día + bebidas sin importar la hora.', clase: 'cevicheria' },
  broaster: { titulo: 'Broaster forzado', detalle: 'Muestra Broaster + bebidas sin importar la hora.', clase: 'broaster' },
  cerrado: { titulo: 'Fuera de horario', detalle: 'Bloquea temporalmente la carta y no permite realizar pedidos.', clase: 'cerrado' }
};

function pintarModoOperacion(modo) {
  const actual = INFO_MODOS_OPERACION[modo] || INFO_MODOS_OPERACION.automatico;
  const select = document.getElementById('modoOperacionSelect');
  const badge = document.getElementById('modoOperacionBadge');
  const info = document.getElementById('modoOperacionInfo');
  if (select) select.value = modo || 'automatico';
  if (badge) {
    badge.textContent = actual.titulo;
    badge.className = `admin-modo-badge ${actual.clase}`;
  }
  if (info) info.innerHTML = `<strong>${actual.titulo}</strong><span>${actual.detalle}</span>`;
}

async function configurarModoOperacionAdmin() {
  const select = document.getElementById('modoOperacionSelect');
  const boton = document.getElementById('btnGuardarModoOperacion');
  if (!select || !boton) return;

  const modo = typeof window.juanekosCargarModoOperacion === 'function'
    ? await window.juanekosCargarModoOperacion()
    : 'automatico';
  pintarModoOperacion(modo);

  if (!select.dataset.configurado) {
    select.addEventListener('change', () => pintarModoOperacion(select.value));
    select.dataset.configurado = 'true';
  }

  if (!boton.dataset.configurado) {
    boton.addEventListener('click', async () => {
      boton.disabled = true;
      const texto = boton.textContent;
      boton.textContent = 'Guardando...';
      try {
        const guardado = await window.juanekosGuardarModoOperacion(select.value);
        pintarModoOperacion(guardado);
        if (typeof mostrarMensaje === 'function') mostrarMensaje('Modo de operación actualizado.', 'exito');
      } catch (error) {
        console.error(error);
        if (typeof mostrarMensaje === 'function') mostrarMensaje('No se pudo actualizar el modo de operación.', 'error');
      } finally {
        boton.disabled = false;
        boton.textContent = texto;
      }
    });
    boton.dataset.configurado = 'true';
  }

  window.juanekosIniciarRealtimeModo?.();
}

window.addEventListener('juanekos:modo-operacion-actualizado', event => {
  pintarModoOperacion(event.detail?.modo || 'automatico');
  if (typeof configurarCategoriasPermitidasEditor === 'function') configurarCategoriasPermitidasEditor();
  if (typeof renderizarProductosDisponibles === 'function') renderizarProductosDisponibles();
});
