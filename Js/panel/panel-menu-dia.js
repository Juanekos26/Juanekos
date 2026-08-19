/* =====================================================
   JUANEKO'S - ADMINISTRACIÓN DEL MENÚ DEL DÍA
===================================================== */

let productosCacheMenuDia = null;

function fechaSeleccionadaMenuDiaAdmin() {
    return document.getElementById("fechaMenuDiaAdmin")?.value || new Date().toISOString().split('T')[0];
}

async function cargarProductosCache() {
    if (productosCacheMenuDia !== null) return;
    try {
        const { data, error } = await window.juanekosSupabase
            .from('productos')
            .select('id, nombre, precio, descripcion, categoria')
            .order('nombre');
        if (error) throw error;
        productosCacheMenuDia = data || [];
    } catch (err) {
        console.error("Error al cargar productos:", err);
        productosCacheMenuDia = [];
    }
}

async function abrirFormMenuDiaAdmin(tipo = "entrada", item = null) {
    const formOverlay = document.getElementById("modalMenuDiaAdminOverlay");
    if (!formOverlay) return;

    await cargarProductosCache();

    document.getElementById("menuDiaId").value = item?.id || "";
    document.getElementById("menuDiaTipoOculto").value = item?.tipo || tipo;
    
    document.getElementById("menuDiaNombre").value = item?.nombre || "";
    document.getElementById("menuDiaPrecio").value = item?.precio || "";
    document.getElementById("menuDiaDisponible").value = item?.disponible === false ? "false" : "true";
    document.getElementById("menuDiaDescripcion").value = item?.descripcion || "";

    const titulo = document.getElementById("menuDiaFormTitulo");
    const etiqueta = document.getElementById("lblTipoPlatoForm");
    if (titulo) titulo.textContent = item ? "Editar plato" : "Agregar plato";
    if (etiqueta) etiqueta.textContent = (item?.tipo || tipo).toUpperCase();

    const selectModo = document.getElementById("menuDiaModoIngreso");
    const containerSelect = document.getElementById("containerSelectProducto");
    const selectProducto = document.getElementById("menuDiaProductoSelect");

    if (item) {
        selectModo.value = "nuevo";
        selectModo.disabled = true;
        containerSelect.hidden = true;
    } else {
        selectModo.value = "nuevo";
        selectModo.disabled = false;
        containerSelect.hidden = true;
    }

    if (selectProducto) {
        selectProducto.innerHTML = `<option value="">Seleccione un producto...</option>` + 
            productosCacheMenuDia.map(p => `<option value="${p.id}" data-precio="${p.precio}" data-desc="${p.descripcion || ''}">${p.nombre}</option>`).join('');
    }

    formOverlay.hidden = false;
    requestAnimationFrame(() => document.getElementById("menuDiaNombre")?.focus());
}

function manejarCambioModo() {
    const modo = document.getElementById("menuDiaModoIngreso").value;
    const container = document.getElementById("containerSelectProducto");
    const inputNombre = document.getElementById("menuDiaNombre");
    
    if (modo === "existente") {
        container.hidden = false;
        inputNombre.readOnly = true;
    } else {
        container.hidden = true;
        inputNombre.readOnly = false;
        inputNombre.value = "";
        document.getElementById("menuDiaPrecio").value = "";
        document.getElementById("menuDiaDescripcion").value = "";
    }
}

function manejarSeleccionProducto() {
    const select = document.getElementById("menuDiaProductoSelect");
    const opcion = select.options[select.selectedIndex];
    if (opcion && opcion.value) {
        document.getElementById("menuDiaNombre").value = opcion.text;
        document.getElementById("menuDiaPrecio").value = opcion.dataset.precio || "";
        document.getElementById("menuDiaDescripcion").value = opcion.dataset.desc || "";
    } else {
        document.getElementById("menuDiaNombre").value = "";
        document.getElementById("menuDiaPrecio").value = "";
        document.getElementById("menuDiaDescripcion").value = "";
    }
}

function cerrarFormMenuDiaAdmin() {
    const formOverlay = document.getElementById("modalMenuDiaAdminOverlay");
    if (formOverlay) formOverlay.hidden = true;
}

async function fetchMenuDia(fecha) {
    try {
        const { data, error } = await window.juanekosSupabase
            .from('menu_dia')
            .select('*')
            .eq('fecha', fecha);
        if (error) throw error;
        return data || [];
    } catch (err) {
        console.error("Error obteniendo menú del día:", err);
        return [];
    }
}

async function renderizarMenuDiaAdmin() {
    const lista = document.getElementById("listaMenuDiaAdmin");
    if (!lista) return;

    const fecha = fechaSeleccionadaMenuDiaAdmin();
    lista.innerHTML = `<div style="text-align:center; padding:2rem;"><i class="fa-solid fa-spinner fa-spin fa-2x"></i></div>`;
    
    const items = await fetchMenuDia(fecha);
    const entradas = items.filter(item => item.tipo === "entrada" || (item.tipo == null && item.categoria === "entrada"));
    const segundos = items.filter(item => item.tipo === "segundo" || item.tipo === "fondo" || (item.tipo == null && (item.categoria === "segundo" || item.categoria === "fondo")));
    
    const disponibles = items.filter(item => item.disponible !== false).length;

    const resumen = document.getElementById("resumenMenuDiaAdmin");
    if (resumen) {
        resumen.innerHTML = `<strong>Cantidad total: ${items.length}</strong> | <strong>Cantidad disponible: ${disponibles}</strong>`;
    }

    const crearGrupo = (titulo, iconoClass, grupo) => `
        <section class="menu-dia-admin-group">
            <header>
                <div style="display:flex; align-items:center; gap:0.5rem;">
                    <i class="${iconoClass} fa-lg"></i>
                    <div>
                        <h3 style="margin:0">${titulo}</h3>
                        <p style="margin:0; font-size:0.85em; opacity:0.8">${grupo.length} plato(s)</p>
                    </div>
                </div>
            </header>
            <div class="menu-dia-admin-grid">
                ${grupo.length ? grupo.map(item => `
                    <article class="menu-dia-admin-item ${item.disponible === false ? "agotado" : ""}">
                        <div class="menu-dia-admin-item-main">
                            <div>
                                <span class="menu-dia-tipo"><i class="${item.tipo === 'entrada' ? 'fa-solid fa-bowl-food' : 'fa-solid fa-plate-wheat'}"></i> ${item.tipo === "entrada" ? "Entrada" : "Segundo"}</span>
                                <h4>${item.nombre}</h4>
                                ${item.descripcion ? `<p>${item.descripcion}</p>` : ""}
                            </div>
                            <strong>S/ ${Number(item.precio).toFixed(2)}</strong>
                        </div>
                        <div class="menu-dia-admin-status ${item.disponible === false ? "is-agotado" : "is-disponible"}">
                            <i class="${item.disponible === false ? "fa-solid fa-xmark" : "fa-solid fa-check"}"></i> ${item.disponible === false ? "Agotado" : "Disponible"}
                        </div>
                        <div class="menu-dia-admin-actions">
                            <button type="button" onclick="editarMenuDiaAdmin('${item.id}')"><i class="fa-solid fa-pen"></i> Editar</button>
                            <button type="button" onclick="cambiarDisponibilidadMenuDiaAdmin('${item.id}', ${item.disponible === false})"><i class="fa-solid ${item.disponible === false ? 'fa-check' : 'fa-ban'}"></i> ${item.disponible === false ? "Activar" : "Agotar"}</button>
                            <button type="button" class="danger" onclick="eliminarMenuDiaAdmin('${item.id}')"><i class="fa-solid fa-trash"></i> Eliminar</button>
                        </div>
                    </article>`).join("") : `<div class="menu-dia-empty"><i class="fa-solid fa-inbox"></i> No hay ${titulo.toLowerCase()} para esta fecha.</div>`}
            </div>
        </section>`;

    lista.innerHTML = crearGrupo("Entradas", "fa-solid fa-bowl-rice", entradas) + crearGrupo("Segundos", "fa-solid fa-utensils", segundos);
}

async function guardarFormularioMenuDia(evento) {
    evento.preventDefault();

    const id = document.getElementById("menuDiaId")?.value || null;
    const datos = {
        nombre: document.getElementById("menuDiaNombre")?.value.trim(),
        tipo: document.getElementById("menuDiaTipoOculto")?.value,
        precio: Number(document.getElementById("menuDiaPrecio")?.value),
        descripcion: document.getElementById("menuDiaDescripcion")?.value.trim(),
        disponible: document.getElementById("menuDiaDisponible")?.value !== "false",
        fecha: fechaSeleccionadaMenuDiaAdmin()
    };

    if (!datos.nombre) {
        alert("Escribe el nombre del plato.");
        return;
    }
    if (!Number.isFinite(datos.precio) || datos.precio <= 0) {
        alert("Ingresa un precio válido.");
        return;
    }

    try {
        if (id) {
            const { error } = await window.juanekosSupabase.from('menu_dia').update(datos).eq('id', id);
            if (error) throw error;
        } else {
            const { error } = await window.juanekosSupabase.from('menu_dia').insert([datos]);
            if (error) throw error;
        }
    } catch (error) {
        console.error("Error al guardar plato:", error);
        alert("No se pudo guardar el plato.");
        return;
    }

    cerrarFormMenuDiaAdmin();
    renderizarMenuDiaAdmin();
}

async function editarMenuDiaAdmin(id) {
    try {
        const { data, error } = await window.juanekosSupabase.from('menu_dia').select('*').eq('id', id).single();
        if (error) throw error;
        if (data) abrirFormMenuDiaAdmin(data.tipo, data);
    } catch (err) {
        console.error(err);
        alert("No se pudo cargar el plato para editar.");
    }
}

async function eliminarMenuDiaAdmin(id) {
    const confirmado = confirm(`¿Estás seguro de eliminar este plato?`);
    if (!confirmado) return;
    
    try {
        const { error } = await window.juanekosSupabase.from('menu_dia').delete().eq('id', id);
        if (error) throw error;
        renderizarMenuDiaAdmin();
    } catch (err) {
        console.error(err);
        alert("No se pudo eliminar el plato.");
    }
}

async function cambiarDisponibilidadMenuDiaAdmin(id, reactivar) {
    try {
        const { error } = await window.juanekosSupabase.from('menu_dia').update({ disponible: reactivar }).eq('id', id);
        if (error) throw error;
        renderizarMenuDiaAdmin();
    } catch (err) {
        console.error(err);
        alert("No se pudo actualizar la disponibilidad.");
    }
}

async function copiarMenuAyerAdmin() {
    const destino = fechaSeleccionadaMenuDiaAdmin();
    const fechaDestino = new Date(`${destino}T12:00:00`);
    if (Number.isNaN(fechaDestino.getTime())) return;
    
    fechaDestino.setDate(fechaDestino.getDate() - 1);
    const origen = fechaDestino.toISOString().split('T')[0];
    
    try {
        const { data: fuente, error: errFuente } = await window.juanekosSupabase.from('menu_dia').select('*').eq('fecha', origen);
        if (errFuente) throw errFuente;

        if (!fuente || !fuente.length) {
            alert("El día anterior no tiene platos registrados.");
            return;
        }

        const { data: existentes, error: errExist } = await window.juanekosSupabase.from('menu_dia').select('*').eq('fecha', destino);
        if (errExist) throw errExist;
        
        if (existentes && existentes.length) {
            const continuar = confirm("La fecha seleccionada ya tiene platos. ¿Deseas agregar también los del día anterior?");
            if (!continuar) return;
        }

        const nuevosRegistros = fuente.map(item => {
            const { id, ...resto } = item;
            resto.fecha = destino;
            return resto;
        });

        const { error: errInsert } = await window.juanekosSupabase.from('menu_dia').insert(nuevosRegistros);
        if (errInsert) throw errInsert;

        renderizarMenuDiaAdmin();
        alert(`${nuevosRegistros.length} plato(s) copiado(s) del día anterior.`);
    } catch (err) {
        console.error(err);
        alert("No se pudo copiar el menú.");
    }
}

function configurarMenuDiaAdmin() {
    const fecha = document.getElementById("fechaMenuDiaAdmin");
    const form = document.getElementById("formMenuDiaAdmin");
    const btnNuevaEntrada = document.getElementById("btnNuevaEntrada");
    const btnNuevoSegundo = document.getElementById("btnNuevoSegundo");
    const cerrar = document.getElementById("btnCerrarFormMenuDia");
    const cancelar = document.getElementById("btnCancelarFormMenuDia");
    const copiarAyer = document.getElementById("btnCopiarMenuAyer");
    const selectModo = document.getElementById("menuDiaModoIngreso");
    const selectProducto = document.getElementById("menuDiaProductoSelect");

    if (fecha && !fecha.dataset.configurado) {
        fecha.value = new Date().toISOString().split('T')[0];
        fecha.addEventListener("change", () => { cerrarFormMenuDiaAdmin(); renderizarMenuDiaAdmin(); });
        fecha.dataset.configurado = "true";
    }
    if (btnNuevaEntrada && !btnNuevaEntrada.dataset.configurado) {
        btnNuevaEntrada.addEventListener("click", () => abrirFormMenuDiaAdmin("entrada"));
        btnNuevaEntrada.dataset.configurado = "true";
    }
    if (btnNuevoSegundo && !btnNuevoSegundo.dataset.configurado) {
        btnNuevoSegundo.addEventListener("click", () => abrirFormMenuDiaAdmin("segundo"));
        btnNuevoSegundo.dataset.configurado = "true";
    }
    if (form && !form.dataset.configurado) {
        form.addEventListener("submit", guardarFormularioMenuDia);
        form.dataset.configurado = "true";
    }
    if (copiarAyer && !copiarAyer.dataset.configurado) {
        copiarAyer.addEventListener("click", copiarMenuAyerAdmin);
        copiarAyer.dataset.configurado = "true";
    }
    if (selectModo && !selectModo.dataset.configurado) {
        selectModo.addEventListener("change", manejarCambioModo);
        selectModo.dataset.configurado = "true";
    }
    if (selectProducto && !selectProducto.dataset.configurado) {
        selectProducto.addEventListener("change", manejarSeleccionProducto);
        selectProducto.dataset.configurado = "true";
    }

    [cerrar, cancelar].forEach(btn => {
        if (btn && !btn.dataset.configurado) {
            btn.addEventListener("click", cerrarFormMenuDiaAdmin);
            btn.dataset.configurado = "true";
        }
    });

    renderizarMenuDiaAdmin();
}
