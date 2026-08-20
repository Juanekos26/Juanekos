const INFO_MODOS_OPERACION = {
  automatico: { titulo: 'Automático', detalle: 'Cevichería 11:00 a. m.–3:59 p. m. · Broaster 4:00 p. m.–11:59 p. m.', icon: 'fa-robot', clase: 'automatico' },
  prueba: { titulo: 'Modo prueba', detalle: 'Muestra cevichería, broaster, bebidas y menú del día sin importar la hora.', icon: 'fa-vial', clase: 'prueba' },
  cevicheria: { titulo: 'Cevichería forzada', detalle: 'Muestra cevichería, menú del día y bebidas.', icon: 'fa-fish', clase: 'cevicheria' },
  broaster: { titulo: 'Broaster forzado', detalle: 'Muestra broaster y bebidas.', icon: 'fa-drumstick-bite', clase: 'broaster' },
  cerrado: { titulo: 'Fuera de horario', detalle: 'Bloquea temporalmente la carta para clientes.', icon: 'fa-store-slash', clase: 'cerrado' }
};

let configGuardada = 'automatico';
let intervaloReloj = null;

function obtenerHoraPeruCompleta() {
  const partes = new Intl.DateTimeFormat('es-PE', {
    timeZone: 'America/Lima', hour12: false,
    hour: '2-digit', minute: '2-digit', second: '2-digit'
  }).formatToParts(new Date());
  const mapa = Object.fromEntries(partes.map(p => [p.type, p.value]));
  const hora = Number(mapa.hour || 0);
  const minuto = Number(mapa.minute || 0);
  const segundo = Number(mapa.second || 0);
  return { hora, minuto, segundo, texto: `${String(hora).padStart(2,'0')}:${String(minuto).padStart(2,'0')}:${String(segundo).padStart(2,'0')}` };
}

function calcularModoAutomatico(horaDecimal) {
  if (horaDecimal >= 11 && horaDecimal < 16) return 'cevicheria';
  if (horaDecimal >= 16 && horaDecimal < 24) return 'broaster';
  return 'cerrado';
}

function calcularProximoCambio(horaDecimal) {
  if (horaDecimal >= 11 && horaDecimal < 16) return 'Broaster a las 4:00 p. m.';
  if (horaDecimal >= 16 && horaDecimal < 24) return 'Fuera de horario a las 12:00 a. m.';
  return 'Cevichería a las 11:00 a. m.';
}

function pintarModoEnElemento(el, modo) {
  if (!el) return;
  const info = INFO_MODOS_OPERACION[modo] || INFO_MODOS_OPERACION.automatico;
  el.innerHTML = `<i class="fa-solid ${info.icon}"></i> <span>${info.titulo}</span>`;
  el.className = `modo-estado-texto modo-${info.clase}`;
}

function actualizarPanelModos() {
  const reloj = obtenerHoraPeruCompleta();
  const horaDecimal = reloj.hora + reloj.minuto / 60;
  const horaEl = document.getElementById('modoHoraActual');
  if (horaEl) horaEl.textContent = reloj.texto;

  pintarModoEnElemento(document.getElementById('modoGuardadoTxt'), configGuardada);

  const btnVolver = document.getElementById('btnVolverAutomatico');
  if (btnVolver) btnVolver.style.display = configGuardada !== 'automatico' ? 'inline-flex' : 'none';

  const modoVisible = configGuardada === 'automatico' ? calcularModoAutomatico(horaDecimal) : configGuardada;
  pintarModoEnElemento(document.getElementById('modoVisibleTxt'), modoVisible);

  const proximo = document.getElementById('modoProximoTxt');
  if (proximo) {
    proximo.innerHTML = configGuardada === 'automatico'
      ? `<i class="fa-solid fa-forward-step"></i> ${calcularProximoCambio(horaDecimal)}`
      : '<i class="fa-solid fa-pause"></i> Pausado mientras el modo sea forzado';
  }

  const select = document.getElementById('modoOperacionSelect');
  const infoBox = document.getElementById('modoOperacionInfo');
  const btnGuardar = document.getElementById('btnGuardarModoOperacion');
  const badgeCambios = document.getElementById('badgeCambiosPendientes');
  if (!select) return;

  const cambios = select.value !== configGuardada;
  if (btnGuardar) btnGuardar.disabled = !cambios;
  if (badgeCambios) badgeCambios.style.display = cambios ? 'inline-flex' : 'none';

  const info = INFO_MODOS_OPERACION[select.value] || INFO_MODOS_OPERACION.automatico;
  if (infoBox) infoBox.innerHTML = `<strong><i class="fa-solid ${info.icon}"></i> ${info.titulo}</strong><p>${info.detalle}</p>`;
}

async function guardarModo(nuevoModo) {
  const btnGuardar = document.getElementById('btnGuardarModoOperacion');
  const originalText = btnGuardar?.innerHTML || '';
  if (btnGuardar) {
    btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    btnGuardar.disabled = true;
  }
  try {
    if (typeof window.juanekosGuardarModoOperacion !== 'function') throw new Error('No está disponible la función de guardado.');
    configGuardada = await window.juanekosGuardarModoOperacion(nuevoModo);
    const select = document.getElementById('modoOperacionSelect');
    if (select) select.value = configGuardada;
    actualizarPanelModos();
    window.dispatchEvent(new CustomEvent('juanekos:modo-operacion-actualizado', { detail: { modo: configGuardada } }));
    if (typeof mostrarMensaje === 'function') mostrarMensaje('Modo de operación actualizado.', 'exito');
  } catch (error) {
    console.error('Error guardando modo de operación:', error);
    if (typeof mostrarMensaje === 'function') mostrarMensaje(error?.message || 'No se pudo guardar el modo de operación.', 'error');
    if (btnGuardar) btnGuardar.disabled = false;
  } finally {
    if (btnGuardar) btnGuardar.innerHTML = originalText;
  }
}

async function configurarModoOperacionAdmin() {
  if (!document.getElementById('modoOperacionSelect')) return;
  if (intervaloReloj) clearInterval(intervaloReloj);
  try {
    configGuardada = typeof window.juanekosCargarModoOperacion === 'function'
      ? await window.juanekosCargarModoOperacion()
      : 'automatico';
  } catch (error) {
    console.warn('No se pudo cargar el modo de operación.', error);
    configGuardada = 'automatico';
  }

  const select = document.getElementById('modoOperacionSelect');
  select.value = configGuardada;
  if (!select.dataset.configurado) {
    select.addEventListener('change', actualizarPanelModos);
    select.dataset.configurado = '1';
  }

  const guardar = document.getElementById('btnGuardarModoOperacion');
  if (guardar && !guardar.dataset.configurado) {
    guardar.addEventListener('click', () => guardarModo(select.value));
    guardar.dataset.configurado = '1';
  }

  const automatico = document.getElementById('btnVolverAutomatico');
  if (automatico && !automatico.dataset.configurado) {
    automatico.addEventListener('click', () => { select.value = 'automatico'; guardarModo('automatico'); });
    automatico.dataset.configurado = '1';
  }

  actualizarPanelModos();
  intervaloReloj = setInterval(actualizarPanelModos, 1000);
}

window.configurarModoOperacionAdmin = configurarModoOperacionAdmin;
window.actualizarPanelModos = actualizarPanelModos;
