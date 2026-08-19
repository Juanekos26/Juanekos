/* =====================================================
   JUANEKO'S - ADMINISTRACIÓN DEL MENÚ DEL DÍA
===================================================== */

function fechaSeleccionadaMenuDiaAdmin() {
    return document.getElementById("fechaMenuDiaAdmin")?.value || fechaISOJuanekos();
}

function abrirFormMenuDiaAdmin(item = null) {
    const form = document.getElementById("formMenuDiaAdmin");
    if (!form) return;

    document.getElementById("menuDiaId").value = item?.id || "";
    document.getElementById("menuDiaNombre").value = item?.nombre || "";
    document.getElementById("menuDiaTipo").value = item?.tipo || "entrada";
    document.getElementById("menuDiaPrecio").value = item?.precio || "";
    document.getElementById("menuDiaDisponible").value = item?.disponible === false ? "false" : "true";
    document.getElementById("menuDiaDescripcion").value = item?.descripcion || "";

    const titulo = document.getElementById("menuDiaFormTitulo");
    if (titulo) titulo.textContent = item ? "Editar plato" : "Agregar plato";

    form.hidden = false;
    requestAnimationFrame(() => document.getElementById("menuDiaNombre")?.focus());
}

function cerrarFormMenuDiaAdmin() {
    const form = document.getElementById("formMenuDiaAdmin");
    if (form) form.hidden = true;
}

function renderizarMenuDiaAdmin() {
    const lista = document.getElementById("listaMenuDiaAdmin");
    if (!lista) return;

    const fecha = fechaSeleccionadaMenuDiaAdmin();
    const items = obtenerMenuDiaPorFecha(fecha, true);
    const entradas = items.filter(item => item.tipo === "entrada");
    const segundos = items.filter(item => item.tipo === "segundo");
    const disponibles = items.filter(item => item.disponible !== false).length;

    const resumen = document.getElementById("resumenMenuDiaAdmin");
    if (resumen) {
        resumen.innerHTML = `<strong>${items.length}</strong><span>platos</span><strong>${disponibles}</strong><span>disponibles</span>`;
    }

    const crearGrupo = (titulo, icono, grupo) => `
        <section class="menu-dia-admin-group">
            <header><span>${icono}</span><div><h3>${titulo}</h3><p>${grupo.length} ${grupo.length === 1 ? "plato" : "platos"}</p></div></header>
            <div class="menu-dia-admin-grid">
                ${grupo.length ? grupo.map(item => `
                    <article class="menu-dia-admin-item ${item.disponible === false ? "agotado" : ""}">
                        <div class="menu-dia-admin-item-main">
                            <div>
                                <span class="menu-dia-tipo">${item.tipo === "entrada" ? "Entrada" : "Segundo"}</span>
                                <h4>${escaparHTML(item.nombre)}</h4>
                                ${item.descripcion ? `<p>${escaparHTML(item.descripcion)}</p>` : ""}
                            </div>
                            <strong>S/ ${Number(item.precio).toFixed(2)}</strong>
                        </div>
                        <div class="menu-dia-admin-status ${item.disponible === false ? "is-agotado" : "is-disponible"}">
                            ${item.disponible === false ? "Agotado" : "Disponible"}
                        </div>
                        <div class="menu-dia-admin-actions">
                            <button type="button" onclick="editarMenuDiaAdmin(${item.id})">✏️ Editar</button>
                            <button type="button" onclick="cambiarDisponibilidadMenuDiaAdmin(${item.id})">${item.disponible === false ? "✅ Activar" : "⏸️ Agotar"}</button>
                            <button type="button" class="danger" onclick="eliminarMenuDiaAdmin(${item.id})">🗑️ Eliminar</button>
                        </div>
                    </article>`).join("") : `<div class="menu-dia-empty">No hay ${titulo.toLowerCase()} para esta fecha.</div>`}
            </div>
        </section>`;

    lista.innerHTML = crearGrupo("Entradas", "🥗", entradas) + crearGrupo("Segundos", "🍛", segundos);
}

function guardarFormularioMenuDia(evento) {
    evento.preventDefault();

    const id = Number(document.getElementById("menuDiaId")?.value) || null;
    const datos = {
        nombre: document.getElementById("menuDiaNombre")?.value.trim(),
        tipo: document.getElementById("menuDiaTipo")?.value,
        precio: Number(document.getElementById("menuDiaPrecio")?.value),
        descripcion: document.getElementById("menuDiaDescripcion")?.value.trim(),
        disponible: document.getElementById("menuDiaDisponible")?.value !== "false",
        fecha: fechaSeleccionadaMenuDiaAdmin()
    };

    if (!datos.nombre) return mostrarMensaje("Escribe el nombre del plato.", "error");
    if (!Number.isFinite(datos.precio) || datos.precio <= 0) return mostrarMensaje("Ingresa un precio válido.", "error");

    const resultado = id ? actualizarItemMenuDia(id, datos) : crearItemMenuDia(datos);
    if (!resultado) return mostrarMensaje("No se pudo guardar el plato.", "error");

    if (typeof sincronizarMenuDelDiaEnCatalogo === "function") sincronizarMenuDelDiaEnCatalogo();
    cerrarFormMenuDiaAdmin();
    renderizarMenuDiaAdmin();
    mostrarMensaje(id ? "Plato actualizado." : "Plato agregado al menú del día.", "exito");
}

function editarMenuDiaAdmin(id) {
    const item = obtenerMenuDiaGuardado().find(item => Number(item.id) === Number(id));
    if (item) abrirFormMenuDiaAdmin(normalizarItemMenuDia(item));
}

async function eliminarMenuDiaAdmin(id) {
    const item = obtenerMenuDiaGuardado().find(item => Number(item.id) === Number(id));
    if (!item) return;

    const confirmado = typeof confirmarAccion === "function"
        ? await confirmarAccion(`¿Eliminar “${item.nombre}” del menú del día?`, { titulo: "Eliminar plato", aceptar: "Eliminar", tipo: "peligro" })
        : confirm(`¿Eliminar ${item.nombre}?`);

    if (!confirmado) return;
    if (!eliminarItemMenuDia(id)) return mostrarMensaje("No se pudo eliminar el plato.", "error");

    if (typeof sincronizarMenuDelDiaEnCatalogo === "function") sincronizarMenuDelDiaEnCatalogo();
    renderizarMenuDiaAdmin();
    mostrarMensaje("Plato eliminado.", "exito");
}

function cambiarDisponibilidadMenuDiaAdmin(id) {
    const actualizado = alternarDisponibilidadMenuDia(id);
    if (!actualizado) return mostrarMensaje("No se pudo actualizar la disponibilidad.", "error");

    if (typeof sincronizarMenuDelDiaEnCatalogo === "function") sincronizarMenuDelDiaEnCatalogo();
    renderizarMenuDiaAdmin();
    mostrarMensaje(actualizado.disponible ? "Plato disponible nuevamente." : "Plato marcado como agotado.", "exito");
}


async function copiarMenuAyerAdmin() {
    const destino = fechaSeleccionadaMenuDiaAdmin();
    const fechaDestino = new Date(`${destino}T12:00:00`);
    if (Number.isNaN(fechaDestino.getTime())) return;
    fechaDestino.setDate(fechaDestino.getDate() - 1);
    const origen = fechaISOJuanekos(fechaDestino);
    const fuente = obtenerMenuDiaPorFecha(origen, true);

    if (!fuente.length) {
        mostrarMensaje("El día anterior no tiene platos registrados.", "error");
        return;
    }

    const existentes = obtenerMenuDiaPorFecha(destino, true);
    if (existentes.length) {
        const continuar = typeof confirmarAccion === "function"
            ? await confirmarAccion("La fecha seleccionada ya tiene platos. Los del día anterior se agregarán sin borrar los actuales.", { titulo: "Copiar menú", aceptar: "Copiar" })
            : confirm("La fecha seleccionada ya tiene platos. ¿Deseas agregar también los del día anterior?");
        if (!continuar) return;
    }

    const cantidad = copiarMenuDia(origen, destino);
    if (!cantidad) return mostrarMensaje("No se pudo copiar el menú.", "error");

    if (typeof sincronizarMenuDelDiaEnCatalogo === "function") sincronizarMenuDelDiaEnCatalogo();
    renderizarMenuDiaAdmin();
    mostrarMensaje(`${cantidad} plato${cantidad === 1 ? "" : "s"} copiado${cantidad === 1 ? "" : "s"} del día anterior.`, "exito");
}

function configurarMenuDiaAdmin() {
    const fecha = document.getElementById("fechaMenuDiaAdmin");
    const form = document.getElementById("formMenuDiaAdmin");
    const nuevo = document.getElementById("btnNuevoMenuDia");
    const cerrar = document.getElementById("btnCerrarFormMenuDia");
    const cancelar = document.getElementById("btnCancelarFormMenuDia");
    const copiarAyer = document.getElementById("btnCopiarMenuAyer");

    if (fecha && !fecha.dataset.configurado) {
        fecha.value = fechaISOJuanekos();
        fecha.addEventListener("change", () => { cerrarFormMenuDiaAdmin(); renderizarMenuDiaAdmin(); });
        fecha.dataset.configurado = "true";
    }
    if (nuevo && !nuevo.dataset.configurado) {
        nuevo.addEventListener("click", () => abrirFormMenuDiaAdmin());
        nuevo.dataset.configurado = "true";
    }
    if (form && !form.dataset.configurado) {
        form.addEventListener("submit", guardarFormularioMenuDia);
        form.dataset.configurado = "true";
    }
    if (copiarAyer && !copiarAyer.dataset.configurado) {
        copiarAyer.addEventListener("click", copiarMenuAyerAdmin);
        copiarAyer.dataset.configurado = "true";
    }

    [cerrar, cancelar].forEach(btn => {
        if (btn && !btn.dataset.configurado) {
            btn.addEventListener("click", cerrarFormMenuDiaAdmin);
            btn.dataset.configurado = "true";
        }
    });

    renderizarMenuDiaAdmin();
}
