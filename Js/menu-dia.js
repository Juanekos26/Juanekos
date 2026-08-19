/* =====================================================
   JUANEKO'S - MENÚ DEL DÍA
   Persistencia local para entradas y segundos diarios.
===================================================== */

const CLAVE_MENU_DIA = "juanekos_menu_dia";

function fechaISOJuanekos(fecha = new Date()) {
    const anio = fecha.getFullYear();
    const mes = String(fecha.getMonth() + 1).padStart(2, "0");
    const dia = String(fecha.getDate()).padStart(2, "0");
    return `${anio}-${mes}-${dia}`;
}

function obtenerMenuDiaGuardado() {
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_MENU_DIA) || "[]");
        return Array.isArray(datos) ? datos : [];
    } catch (error) {
        console.error("No se pudo leer el menú del día:", error);
        return [];
    }
}

function guardarMenuDiaGuardado(items) {
    try {
        localStorage.setItem(CLAVE_MENU_DIA, JSON.stringify(Array.isArray(items) ? items : []));
        return true;
    } catch (error) {
        console.error("No se pudo guardar el menú del día:", error);
        return false;
    }
}

function normalizarItemMenuDia(item) {
    return {
        id: Number(item?.id) || Date.now(),
        nombre: String(item?.nombre || "").trim(),
        tipo: item?.tipo === "entrada" ? "entrada" : "segundo",
        categoria: "menu-dia",
        precio: Math.max(0, Number(item?.precio) || 0),
        descripcion: String(item?.descripcion || "").trim(),
        fecha: String(item?.fecha || fechaISOJuanekos()),
        disponible: item?.disponible !== false,
        creadoEn: Number(item?.creadoEn) || Date.now(),
        actualizadoEn: Date.now()
    };
}

function obtenerMenuDiaPorFecha(fecha = fechaISOJuanekos(), incluirAgotados = false) {
    return obtenerMenuDiaGuardado()
        .filter(item => String(item.fecha) === String(fecha))
        .filter(item => incluirAgotados || item.disponible !== false)
        .map(normalizarItemMenuDia)
        .sort((a, b) => {
            if (a.tipo !== b.tipo) return a.tipo === "entrada" ? -1 : 1;
            return a.nombre.localeCompare(b.nombre, "es");
        });
}

function obtenerMenuDiaHoy(incluirAgotados = false) {
    return obtenerMenuDiaPorFecha(fechaISOJuanekos(), incluirAgotados);
}

function crearItemMenuDia(datos) {
    const items = obtenerMenuDiaGuardado();
    const item = normalizarItemMenuDia({
        ...datos,
        id: Date.now() + Math.floor(Math.random() * 1000),
        creadoEn: Date.now()
    });

    if (!item.nombre || item.precio <= 0) return null;

    items.push(item);
    return guardarMenuDiaGuardado(items) ? item : null;
}

function actualizarItemMenuDia(id, cambios) {
    const items = obtenerMenuDiaGuardado();
    const indice = items.findIndex(item => Number(item.id) === Number(id));
    if (indice < 0) return null;

    const actualizado = normalizarItemMenuDia({
        ...items[indice],
        ...cambios,
        id: items[indice].id,
        creadoEn: items[indice].creadoEn
    });

    if (!actualizado.nombre || actualizado.precio <= 0) return null;
    items[indice] = actualizado;
    return guardarMenuDiaGuardado(items) ? actualizado : null;
}

function eliminarItemMenuDia(id) {
    const items = obtenerMenuDiaGuardado();
    const nuevos = items.filter(item => Number(item.id) !== Number(id));
    if (nuevos.length === items.length) return false;
    return guardarMenuDiaGuardado(nuevos);
}

function alternarDisponibilidadMenuDia(id) {
    const item = obtenerMenuDiaGuardado().find(item => Number(item.id) === Number(id));
    if (!item) return null;
    return actualizarItemMenuDia(id, { disponible: item.disponible === false });
}

function copiarMenuDia(origen, destino) {
    const fuente = obtenerMenuDiaPorFecha(origen, true);
    if (!fuente.length) return 0;

    const existentes = obtenerMenuDiaGuardado();
    const nuevos = fuente.map((item, index) => normalizarItemMenuDia({
        ...item,
        id: Date.now() + index + Math.floor(Math.random() * 1000),
        fecha: destino,
        disponible: true,
        creadoEn: Date.now()
    }));

    guardarMenuDiaGuardado([...existentes, ...nuevos]);
    return nuevos.length;
}
