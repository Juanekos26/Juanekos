const INFO_MODOS_OPERACION = {
  automatico: { titulo: 'Automático', detalle: '11:00 a. m. - 3:59 p. m. Cevichería · 4:00 p. m. - 11:59 p. m. Broaster', icon: 'fa-robot' },
  prueba: { titulo: 'Modo prueba', detalle: 'Muestra Cevichería, Broaster, bebidas y menú del día.', icon: 'fa-vial' },
  cevicheria: { titulo: 'Cevichería forzada', detalle: 'Muestra Cevichería + menú del día + bebidas.', icon: 'fa-fish' },
  broaster: { titulo: 'Broaster forzado', detalle: 'Muestra Broaster + bebidas.', icon: 'fa-drumstick-bite' },
  cerrado: { titulo: 'Fuera de horario', detalle: 'Bloquea temporalmente la carta.', icon: 'fa-store-slash' }
};

let configGuardada = 'automatico';
let intervaloReloj = null;

function obtenerHoraPeru() {
    const options = { timeZone: 'America/Lima', hour12: false, hour: '2-digit', minute: '2-digit', second: '2-digit' };
    const formatter = new Intl.DateTimeFormat('es-PE', options);
    return formatter.format(new Date());
}

function calcularModoAutomatico(horaDecimal) {
    if (horaDecimal >= 11 && horaDecimal < 16) return 'cevicheria';
    if (horaDecimal >= 16 && horaDecimal < 24) return 'broaster';
    return 'cerrado';
}

function calcularProximoCambio(horaDecimal) {
    if (horaDecimal >= 11 && horaDecimal < 16) return 'Broaster a las 16:00 (4:00 p.m.)';
    if (horaDecimal >= 16 && horaDecimal < 24) return 'Cerrado a las 00:00 (12:00 a.m.)';
    return 'Cevichería a las 11:00 a.m.';
}

function actualizarPanelModos() {
    // 1. Reloj
    const horaStr = obtenerHoraPeru();
    const [h, m, s] = horaStr.split(':');
    const horaDecimal = parseInt(h, 10) + (parseInt(m, 10) / 60);
    
    document.getElementById('modoHoraActual').textContent = horaStr;

    // 2. Modo Configurado
    const confInfo = INFO_MODOS_OPERACION[configGuardada];
    document.getElementById('modoGuardadoTxt').innerHTML = <i class="fa-solid "></i> ;
    
    const btnVolver = document.getElementById('btnVolverAutomatico');
    if (configGuardada !== 'automatico') {
        btnVolver.style.display = 'inline-flex';
    } else {
        btnVolver.style.display = 'none';
    }

    // 3. Visible y Próximo
    const modoVisibleEl = document.getElementById('modoVisibleTxt');
    const modoProximoEl = document.getElementById('modoProximoTxt');

    if (configGuardada === 'automatico') {
        const autoKey = calcularModoAutomatico(horaDecimal);
        const autoInfo = INFO_MODOS_OPERACION[autoKey];
        modoVisibleEl.innerHTML = <i class="fa-solid "></i> ;
        modoVisibleEl.className = 	ext-;
        modoProximoEl.textContent = calcularProximoCambio(horaDecimal);
    } else {
        modoVisibleEl.innerHTML = <i class="fa-solid "></i> ;
        modoVisibleEl.className = 	ext-;
        modoProximoEl.innerHTML = '<i class="fa-solid fa-pause"></i> Pausado (Forzado)';
    }

    // 4. Actualizar Select visualmente
    const select = document.getElementById('modoOperacionSelect');
    const infoBox = document.getElementById('modoOperacionInfo');
    const btnGuardar = document.getElementById('btnGuardarModoOperacion');
    const badgeCambios = document.getElementById('badgeCambiosPendientes');

    if (select.value === configGuardada) {
        btnGuardar.disabled = true;
        badgeCambios.style.display = 'none';
    } else {
        btnGuardar.disabled = false;
        badgeCambios.style.display = 'inline-flex';
    }

    const currSelInfo = INFO_MODOS_OPERACION[select.value];
    infoBox.innerHTML = <strong><i class="fa-solid "></i> </strong><p></p>;
}

async function guardarModo(nuevoModo) {
    const btnGuardar = document.getElementById('btnGuardarModoOperacion');
    const originalText = btnGuardar.innerHTML;
    btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';
    btnGuardar.disabled = true;
    
    try {
        configGuardada = await window.juanekosGuardarModoOperacion(nuevoModo);
        document.getElementById('modoOperacionSelect').value = configGuardada;
        actualizarPanelModos();
        
        // Disparar evento para que se actualice la carta del cliente sin recargar
        window.dispatchEvent(new Event('juanekos:modo-operacion-actualizado'));
        
        if (typeof mostrarMensaje === 'function') mostrarMensaje('Configuración guardada correctamente.', 'exito');
    } catch (error) {
        console.error(error);
        if (typeof mostrarMensaje === 'function') mostrarMensaje('No se pudo guardar el modo de operación.', 'error');
        btnGuardar.disabled = false;
    } finally {
        btnGuardar.innerHTML = originalText;
    }
}

async function configurarModoOperacionAdmin() {
    if (intervaloReloj) clearInterval(intervaloReloj);

    try {
        configGuardada = typeof window.juanekosCargarModoOperacion === 'function'
            ? await window.juanekosCargarModoOperacion()
            : 'automatico';
    } catch (e) {
        console.warn("Fallo carga de modo, usando automatico");
    }

    const select = document.getElementById('modoOperacionSelect');
    if (select) {
        select.value = configGuardada;
        select.addEventListener('change', actualizarPanelModos);
    }

    const btnGuardar = document.getElementById('btnGuardarModoOperacion');
    if (btnGuardar) {
        btnGuardar.addEventListener('click', () => guardarModo(select.value));
    }

    const btnVolver = document.getElementById('btnVolverAutomatico');
    if (btnVolver) {
        btnVolver.addEventListener('click', () => {
            select.value = 'automatico';
            guardarModo('automatico');
        });
    }

    actualizarPanelModos();
    intervaloReloj = setInterval(actualizarPanelModos, 1000);
}
