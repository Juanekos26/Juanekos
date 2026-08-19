/* =====================================================
   JUANEKO'S - EDITOR DE PEDIDOS
   Edición consistente, responsive y menú por horario
===================================================== */

let pedidoEditando = null;
let productosEditando = [];

function clonarProductoEditor(producto) {
    return {
        productoId: Number(producto?.productoId),
        nombre: String(producto?.nombre || "Producto"),
        precio: Number(producto?.precio) || 0,
        categoria: String(producto?.categoria || ""),
        cantidad: Math.max(0, Number(producto?.cantidad) || 0),
        acompanamientos: { ...(producto?.acompanamientos || {}) }
    };
}

function esProductoConAcompanamientoEditor(producto) {
    return producto?.categoria === "broaster" &&
        !String(producto?.nombre || "").toLowerCase().startsWith("porción") &&
        !String(producto?.nombre || "").toLowerCase().startsWith("porcion");
}

function abrirEditorPedido(pedido) {
    if (!pedido) return;

    pedidoEditando = { ...pedido };
    productosEditando = Array.isArray(pedido.productos)
        ? pedido.productos.map(clonarProductoEditor)
        : [];

    const editor = document.getElementById("editorPedido");
    if (!editor) return;

    const numero = document.getElementById("editorNumero");
    const cliente = document.getElementById("editarCliente");
    const mesa = document.getElementById("editarMesa");

    if (numero) numero.textContent = pedido.numero || pedido.id || "—";
    if (cliente) cliente.value = pedido.cliente || "";
    if (mesa) mesa.value = pedido.mesa || "";

    editor.hidden = false;
    renderizarProductosEditor();
    actualizarTotalEditor();

    requestAnimationFrame(() => {
        editor.scrollIntoView({ behavior: "smooth", block: "start" });
    });
}

function renderizarProductosEditor() {
    const contenedor = document.getElementById("editorListaProductos");
    if (!contenedor) return;

    if (!productosEditando.length) {
        contenedor.innerHTML = `
            <div class="sin-productos-editor">
                <strong>No hay productos en el pedido</strong>
                <p>Agrega un producto para continuar.</p>
            </div>`;
        actualizarTotalEditor();
        return;
    }

    contenedor.innerHTML = productosEditando.map((producto, index) => {
        const subtotal = Number(producto.precio || 0) * Number(producto.cantidad || 0);
        return `
            <article class="editor-producto" data-producto-id="${escaparHTML(producto.productoId)}">
                <div class="editor-producto-info">
                    <small>${escaparHTML(producto.categoria || "producto")}</small>
                    <h4>${escaparHTML(producto.nombre)}</h4>
                    <span>S/ ${Number(producto.precio).toFixed(2)} c/u</span>
                </div>

                <div class="editor-cantidad-bloque">
                    <span class="editor-control-label">Cantidad</span>
                    <div class="editor-producto-control">
                        <button type="button" onclick="cambiarCantidadEditor(${index}, -1)" aria-label="Disminuir cantidad">−</button>
                        <strong>${Number(producto.cantidad) || 0}</strong>
                        <button type="button" onclick="cambiarCantidadEditor(${index}, 1)" aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>

                ${esProductoConAcompanamientoEditor(producto) ? renderizarAcompanamientosEditor(producto, index) : ""}

                <div class="editor-producto-subtotal">
                    <span>Subtotal</span>
                    <strong>S/ ${subtotal.toFixed(2)}</strong>
                </div>

                <button type="button" class="btn-eliminar-producto-editor" onclick="eliminarProductoEditor(${index})">
                    <span aria-hidden="true">🗑️</span> Eliminar
                </button>
            </article>`;
    }).join("");
}

function renderizarAcompanamientosEditor(producto, index) {
    if (typeof acompanamientosMenu === "undefined" || !Array.isArray(acompanamientosMenu)) return "";
    if (!producto.acompanamientos) producto.acompanamientos = {};

    return `
        <div class="editor-acompanamientos">
            <div class="editor-acompanamientos-titulo">
                <strong>🍽️ Acompañamientos</strong>
                <small>Máximo ${Number(producto.cantidad) || 0} en total</small>
            </div>
            <div class="editor-acompanamientos-grid">
                ${acompanamientosMenu.map(([icono, nombre, tipo]) => {
                    const cantidad = Number(producto.acompanamientos[tipo]) || 0;
                    return `
                        <div class="editor-acompanamiento">
                            <span>${icono} ${escaparHTML(nombre)}</span>
                            <div class="editor-mini-control">
                                <button type="button" onclick="cambiarAcompanamientoEditor(${index}, '${tipo}', -1)" aria-label="Disminuir ${escaparHTML(nombre)}">−</button>
                                <strong>${cantidad}</strong>
                                <button type="button" onclick="cambiarAcompanamientoEditor(${index}, '${tipo}', 1)" aria-label="Aumentar ${escaparHTML(nombre)}">+</button>
                            </div>
                        </div>`;
                }).join("")}
            </div>
        </div>`;
}

function totalAcompanamientosEditor(producto) {
    return Object.values(producto?.acompanamientos || {}).reduce(
        (suma, valor) => suma + (Number(valor) || 0), 0
    );
}

function ajustarAcompanamientosEditor(producto) {
    if (!esProductoConAcompanamientoEditor(producto)) return;
    if (!producto.acompanamientos) producto.acompanamientos = {};

    const limite = Math.max(0, Number(producto.cantidad) || 0);
    let exceso = Math.max(0, totalAcompanamientosEditor(producto) - limite);
    if (!exceso) return;

    const tipos = typeof TIPOS_ACOMPANAMIENTO !== "undefined"
        ? [...TIPOS_ACOMPANAMIENTO].reverse()
        : Object.keys(producto.acompanamientos).reverse();

    for (const tipo of tipos) {
        if (exceso <= 0) break;
        const actual = Number(producto.acompanamientos[tipo]) || 0;
        const quitar = Math.min(actual, exceso);
        producto.acompanamientos[tipo] = actual - quitar;
        exceso -= quitar;
    }
}

function cambiarCantidadEditor(index, cambio) {
    const producto = productosEditando[index];
    if (!producto) return;

    producto.cantidad = Math.max(0, Number(producto.cantidad || 0) + Number(cambio || 0));
    ajustarAcompanamientosEditor(producto);

    if (producto.cantidad <= 0) productosEditando.splice(index, 1);

    renderizarProductosEditor();
    actualizarTotalEditor();
}

function cambiarAcompanamientoEditor(index, tipo, cambio) {
    const producto = productosEditando[index];
    if (!producto || !esProductoConAcompanamientoEditor(producto)) return;

    if (!producto.acompanamientos) producto.acompanamientos = {};
    const actual = Number(producto.acompanamientos[tipo]) || 0;
    const nuevo = Math.max(0, actual + Number(cambio || 0));
    const totalSinActual = totalAcompanamientosEditor(producto) - actual;

    if (totalSinActual + nuevo > Number(producto.cantidad || 0)) {
        mostrarMensaje("Los acompañamientos no pueden superar la cantidad del producto.", "error");
        return;
    }

    producto.acompanamientos[tipo] = nuevo;
    renderizarProductosEditor();
}

function eliminarProductoEditor(index) {
    if (!productosEditando[index]) return;
    productosEditando.splice(index, 1);
    renderizarProductosEditor();
    actualizarTotalEditor();
}

function calcularTotalEditor() {
    return productosEditando.reduce((total, producto) => {
        return total + (Number(producto.precio) || 0) * (Number(producto.cantidad) || 0);
    }, 0);
}

function actualizarTotalEditor() {
    const total = document.getElementById("editorTotal");
    if (total) total.textContent = `S/ ${calcularTotalEditor().toFixed(2)}`;
}

function obtenerPedidoEditado() {
    return {
        ...pedidoEditando,
        cliente: document.getElementById("editarCliente")?.value.trim() || "",
        mesa: document.getElementById("editarMesa")?.value.trim() || "",
        productos: productosEditando.map(clonarProductoEditor),
        total: Number(calcularTotalEditor().toFixed(2))
    };
}

function identificarPedido(pedido) {
    if (pedido?.id !== undefined && pedido?.id !== null) return `id:${pedido.id}`;
    if (pedido?.numero !== undefined && pedido?.numero !== null) return `numero:${pedido.numero}`;
    if (pedido?.fecha && pedido?.hora) return `fecha:${pedido.fecha}|hora:${pedido.hora}`;
    return "";
}

function guardarCambiosPedido() {
    if (!pedidoEditando) return mostrarMensaje("No hay un pedido abierto para editar.", "error");

    const actualizado = obtenerPedidoEditado();
    if (!actualizado.cliente) return mostrarMensaje("Ingresa el nombre del cliente.", "error");
    if (!actualizado.mesa) return mostrarMensaje("Ingresa el número de mesa.", "error");
    if (!actualizado.productos.length) return mostrarMensaje("El pedido debe tener al menos un producto.", "error");

    const pedidos = obtenerPedidosPanel();
    const indice = pedidos.findIndex(p => Number(p.id) === Number(actualizado.id));
    if (indice < 0) return mostrarMensaje("No se encontró el pedido original.", "error");

    pedidos[indice] = {
        ...pedidos[indice],
        ...actualizado,
        total: Number(calcularTotalEditor().toFixed(2)),
        actualizadoEn: Date.now()
    };

    if (!guardarPedidosPanel(pedidos)) {
        return mostrarMensaje("No se pudieron guardar los cambios.", "error");
    }

    const id = pedidos[indice].id;
    cerrarEditorPedido();
    actualizarPanel();

    const detalle = document.getElementById("detallePedido");
    if (detalle && !detalle.hidden && typeof mostrarDetallePedido === "function") {
        mostrarDetallePedido(id);
    }

    mostrarMensaje(`Pedido #${id} actualizado correctamente.`, "exito");
}

function cerrarEditorPedido() {
    const editor = document.getElementById("editorPedido");
    if (editor) editor.hidden = true;
    cerrarSelectorProductos();
    pedidoEditando = null;
    productosEditando = [];
}

/* =====================================================
   SELECTOR DE PRODUCTOS POR HORARIO
===================================================== */

function obtenerInfoTurnoAdmin() {
    const categorias = typeof obtenerCategoriasPorHorario === "function"
        ? obtenerCategoriasPorHorario()
        : [];
    const hora = new Date().getHours();

    if (!categorias.length) {
        return {
            categorias: [],
            titulo: "Fuera de horario",
            detalle: "Atención: 11:00 a. m. a 11:59 p. m."
        };
    }

    if (hora < 16) {
        return {
            categorias,
            titulo: "Turno cevichería",
            detalle: "11:00 a. m. – 3:59 p. m. · Menú del día + cevichería + bebidas"
        };
    }

    return {
        categorias,
        titulo: "Turno broaster",
        detalle: "4:00 p. m. – 11:59 p. m. · Broaster + bebidas"
    };
}

function abrirSelectorProductos() {
    if (typeof sincronizarMenuDelDiaEnCatalogo === "function") sincronizarMenuDelDiaEnCatalogo();

    const selector = document.getElementById("selectorProductos");
    if (!selector) return;

    selector.hidden = false;
    configurarCategoriasPermitidasEditor();
    renderizarProductosDisponibles();
    requestAnimationFrame(() => selector.scrollIntoView({ behavior: "smooth", block: "start" }));
}

function cerrarSelectorProductos() {
    const selector = document.getElementById("selectorProductos");
    if (selector) selector.hidden = true;
}

function configurarCategoriasPermitidasEditor() {
    const info = obtenerInfoTurnoAdmin();
    const turno = document.getElementById("turnoProductoEditor");
    const select = document.getElementById("categoriaProductoEditor");

    if (turno) {
        turno.innerHTML = `<strong>${escaparHTML(info.titulo)}</strong><span>${escaparHTML(info.detalle)}</span>`;
        turno.classList.toggle("fuera-horario", info.categorias.length === 0);
    }

    if (!select) return;

    const nombres = { "menu-dia": "Menú del día", cevicheria: "Cevichería", broaster: "Broaster", bebidas: "Bebidas" };
    const anterior = select.value;
    select.innerHTML = `<option value="">Todas las permitidas</option>` + info.categorias
        .map(cat => `<option value="${cat}">${nombres[cat] || cat}</option>`)
        .join("");
    select.value = info.categorias.includes(anterior) ? anterior : "";
    select.disabled = info.categorias.length === 0;
}

function renderizarProductosDisponibles() {
    const contenedor = document.getElementById("listaProductosDisponibles");
    if (!contenedor) return;

    if (typeof menu === "undefined" || !Array.isArray(menu)) {
        contenedor.innerHTML = `<div class="selector-vacio">No se pudieron cargar los productos.</div>`;
        return;
    }

    const info = obtenerInfoTurnoAdmin();
    if (!info.categorias.length) {
        contenedor.innerHTML = `
            <div class="selector-vacio">
                <span>🌙</span>
                <strong>Menú cerrado por horario</strong>
                <p>No se pueden añadir productos fuera del horario de atención.</p>
            </div>`;
        return;
    }

    const busqueda = document.getElementById("buscarProductoEditor")?.value.trim().toLowerCase() || "";
    const categoria = document.getElementById("categoriaProductoEditor")?.value || "";

    const disponibles = menu.filter(producto => {
        return info.categorias.includes(producto.categoria) &&
            (!categoria || producto.categoria === categoria) &&
            (!busqueda || String(producto.nombre).toLowerCase().includes(busqueda));
    });

    if (!disponibles.length) {
        contenedor.innerHTML = `<div class="selector-vacio"><strong>No hay coincidencias</strong><p>Prueba otro nombre o categoría.</p></div>`;
        return;
    }

    const etiquetas = { "menu-dia": "Menú del día", cevicheria: "Cevichería", broaster: "Broaster", bebidas: "Bebidas" };
    contenedor.innerHTML = disponibles.map(producto => `
        <button type="button" class="producto-disponible" onclick="agregarProductoEditor(${producto.id})">
            <div>
                <small>${escaparHTML(etiquetas[producto.categoria] || producto.categoria)}</small>
                <span>${escaparHTML(producto.nombre)}</span>
            </div>
            <strong>S/ ${Number(producto.precio).toFixed(2)}</strong>
        </button>`).join("");
}

function configurarFiltrosProductos() {
    const buscar = document.getElementById("buscarProductoEditor");
    const categoria = document.getElementById("categoriaProductoEditor");

    if (buscar && !buscar.dataset.configurado) {
        buscar.addEventListener(
            "input",
            typeof debouncePanel === "function" ? debouncePanel(renderizarProductosDisponibles, 120) : renderizarProductosDisponibles
        );
        buscar.dataset.configurado = "true";
    }

    if (categoria && !categoria.dataset.configurado) {
        categoria.addEventListener("change", renderizarProductosDisponibles);
        categoria.dataset.configurado = "true";
    }

    configurarCategoriasPermitidasEditor();
}

function agregarProductoEditor(productoId) {
    if (typeof menu === "undefined" || !Array.isArray(menu)) return;

    const producto = menu.find(item => Number(item.id) === Number(productoId));
    if (!producto) return;

    const permitidas = obtenerInfoTurnoAdmin().categorias;
    if (!permitidas.includes(producto.categoria)) {
        mostrarMensaje("Ese producto no corresponde al horario actual.", "error");
        renderizarProductosDisponibles();
        return;
    }

    const existente = productosEditando.find(item => Number(item.productoId) === Number(producto.id));
    if (existente) {
        existente.cantidad = Number(existente.cantidad || 0) + 1;
    } else {
        productosEditando.push({
            productoId: Number(producto.id),
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            categoria: producto.categoria,
            cantidad: 1,
            acompanamientos: {}
        });
    }

    renderizarProductosEditor();
    actualizarTotalEditor();
    cerrarSelectorProductos();
    mostrarMensaje(`${producto.nombre} agregado al pedido.`, "exito");
}
