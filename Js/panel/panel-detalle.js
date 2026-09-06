/* ========================================
   DETALLE DEL PEDIDO
======================================== */

/* ========================================
   IMAGEN DEL PRODUCTO EN DETALLE
======================================== */

function obtenerImagenDetalleProducto(producto) {
    if (!producto) return "../Imagenes/Logo/Logo.png";

    // 1. Imagen directa si viene en el objeto
    let url = producto.imagen_url || producto.imagen || producto.foto;
    if (url && typeof url === "string" && url.trim()) {
        url = url.trim();
        if (/^(https?:)?\/\//i.test(url) || url.startsWith("data:") || url.startsWith("blob:")) {
            return url;
        }
        if (url.startsWith("../")) return url;
        if (url.startsWith("/")) return url;
        return `../${url.replace(/^\/+/, "")}`;
    }

    // 2. Función global de menucarta si existe
    if (typeof obtenerImagenProducto === "function") {
        try {
            const res = obtenerImagenProducto(producto);
            if (res && typeof res === "string" && !res.includes("PortadaHora.png")) {
                return res.startsWith("../") ? res : (res.startsWith("/") ? res : `../${res.replace(/^\/+/, "")}`);
            }
        } catch (_) {}
    }

    // 3. Mapeo local según nombre y categoría
    const n = String(producto.nombre || "").toLowerCase().trim();
    const c = String(producto.categoria || "").toLowerCase().trim();

    // Broaster
    if (n.includes("pecho")) return "../Imagenes/Broaster/BroasterPecho.png";
    if (n.includes("pierna")) return "../Imagenes/Broaster/BroasterPiernaCompleta.png";
    if (n.includes("entre pierna") || n.includes("entrepierna")) return "../Imagenes/Broaster/BroasterEntrePierna.png";
    if (n.includes("ala")) return "../Imagenes/Broaster/BroasterAla.png";
    if (n.includes("salchipapa")) return n.includes("broaster") ? "../Imagenes/Broaster/BroasterSalchipapa.png" : "../Imagenes/Broaster/Salchipapa.png";
    if (n.includes("papa") && (n.includes("porcion") || n.includes("porción"))) return "../Imagenes/Broaster/PorcionPapa.png";
    if (n.includes("chaufa") && (n.includes("porcion") || n.includes("porción"))) return "../Imagenes/Broaster/PorcionChaufa.png";

    // Cevichería
    if (n.includes("pota")) {
        if (n.includes("chicharron") || n.includes("chicharrón")) return n.includes("ceviche") ? "../Imagenes/Ceviche/CevicheChicharonPota.png" : "../Imagenes/Ceviche/ChicharronPota.png";
        return "../Imagenes/Ceviche/CevichePota.png";
    }
    if (n.includes("marisco") || n.includes("mariscos")) {
        if (n.includes("arroz")) return "../Imagenes/Ceviche/ArrozMarisco.png";
        if (n.includes("chaufa")) return "../Imagenes/Ceviche/ChaufaMarisco.png";
        if (n.includes("trio") || n.includes("trío")) return "../Imagenes/Ceviche/TrioMariscos.png";
    }
    if (n.includes("duo") || n.includes("dúo")) return "../Imagenes/Ceviche/DuoChaufa.png";
    if (n.includes("ceviche")) {
        if (n.includes("pescado") || n.includes("solo")) return "../Imagenes/Ceviche/CevicheSolo.png";
        if (n.includes("chicharron") || n.includes("chicharrón")) return "../Imagenes/Ceviche/CevicheChicharonPescado.png";
        if (n.includes("mixto")) return "../Imagenes/Platos/ceviche_mixto.jpg";
        return "../Imagenes/Ceviche/CevicheSolo.png";
    }
    if (n.includes("parihuela")) return "../Imagenes/Ceviche/Parihuela.png";
    if (n.includes("chilcano")) return "../Imagenes/Ceviche/ChilcanoSolo.png";
    if (n.includes("leche de tigre") || n.includes("leche")) return "../Imagenes/Ceviche/LecheTigreSolo.png";
    if (n.includes("causa")) return "../Imagenes/Platos/causa_rellena.jpg";

    // Bebidas
    if (n.includes("chicha")) {
        if (n.includes("litro") && !n.includes("medio")) return "../Imagenes/Bebida/LitroChicha.jpg";
        if (n.includes("medio")) return "../Imagenes/Bebida/MedioLitroChicha.jpg";
        return "../Imagenes/Bebida/VasoChicha.jpg";
    }
    if (n.includes("maracuya") || n.includes("maracuyá")) {
        if (n.includes("litro") && !n.includes("medio")) return "../Imagenes/Bebida/LitroMaracuya.jpg";
        if (n.includes("medio")) return "../Imagenes/Bebida/MedioLitroMaracuya.jpg";
        return "../Imagenes/Bebida/VasoMaracuya.jpg";
    }

    // Criollos / Platos del menú
    if (n.includes("lomo")) return "../Imagenes/Platos/lomo_saltado.jpg";
    if (n.includes("aji") || n.includes("ají")) return "../Imagenes/Platos/aji_de_gallina.jpg";
    if (n.includes("arroz con pollo")) return "../Imagenes/Platos/arroz_con_pollo.jpg";
    if (n.includes("tallarin") || n.includes("tallarines")) return "../Imagenes/Platos/tallarines_rojos.jpg";
    if (n.includes("huancaina") || n.includes("huancaína")) return "../Imagenes/Platos/papa_huancaina.jpg";

    // Fallbacks por categoría
    if (c.includes("ceviche")) return "../Imagenes/Ceviche/CevicheSolo.png";
    if (c.includes("broaster")) return "../Imagenes/Broaster/BroasterPecho.png";
    if (c.includes("bebida")) return "../Imagenes/Bebida/VasoChicha.jpg";
    if (c.includes("menu") || c.includes("plato")) return "../Imagenes/Platos/lomo_saltado.jpg";

    return "../Imagenes/Logo/Logo.png";
}

/* ========================================
   ACOMPAÑAMIENTOS
======================================== */

function generarAcompanamientosDetalle(
    acompanamientos
) {

    if (!acompanamientos) {
        return "";
    }


    const nombres = {

        chaufaCompleto:
            "Chaufa completo",

        papaEnsalada:
            "Papa + Ensalada",

        papaChaufa:
            "Papa + Chaufa",

        papaSola:
            "Papa sola",

        chaufaSola:
            "Chaufa sola"

    };


    const chips = [];


    Object.entries(nombres).forEach(
        ([tipo, nombre]) => {

            const cantidad =
                Number(
                    acompanamientos[tipo] || 0
                );


            if (cantidad > 0) {

                chips.push(`
                    <span class="detalle-acomp-chip">
                        <i class="fa-solid fa-plus"></i>
                        ${escaparHTML(nombre)}
                        <strong>× ${cantidad}</strong>
                    </span>
                `);

            }

        }
    );


    if (!chips.length) {
        return "";
    }


    return `
        <div class="detalle-acompanamientos-wrapper">
            <span class="detalle-acomp-label">
                <i class="fa-solid fa-utensils"></i> Acompañamientos:
            </span>
            <div class="detalle-acomp-chips">
                ${chips.join("")}
            </div>
        </div>
    `;

}


/* ========================================
   PRODUCTOS
======================================== */

function generarProductosDetalle(productos) {

    if (
        !Array.isArray(productos) ||
        !productos.length
    ) {

        return `
            <div class="detalle-sin-productos">
                <i class="fa-solid fa-utensils"></i>
                <p>No hay productos registrados en este pedido.</p>
            </div>
        `;

    }


    return productos.map(
        (producto, idx) => {

            const cantidad =
                Number(
                    producto.cantidad || 0
                );


            const precio =
                Number(
                    producto.precio || 0
                );


            const subtotal =
                cantidad * precio;

            const imagenUrl = obtenerImagenDetalleProducto(producto);
            const categoria = producto.categoria || "Plato Principal";

            return `
                <article class="detalle-producto-card" id="detalleProdItem_${idx}">
                    <div class="detalle-producto-thumb">
                        <img 
                            src="${escaparHTML(imagenUrl)}" 
                            alt="${escaparHTML(producto.nombre || 'Producto')}" 
                            loading="lazy"
                            onerror="this.onerror=null; this.src='../Imagenes/Logo/Logo.png';"
                        >
                    </div>

                    <div class="detalle-producto-body">
                        <div class="detalle-producto-cabecera">
                            <h4 class="detalle-producto-nombre">
                                ${escaparHTML(producto.nombre || "Producto")}
                            </h4>
                            <span class="detalle-categoria-tag">
                                ${escaparHTML(categoria)}
                            </span>
                        </div>

                        <div class="detalle-producto-meta">
                            <span class="detalle-badge-cantidad">
                                <i class="fa-solid fa-boxes-stacked"></i> Cantidad: <strong>${cantidad}</strong>
                            </span>
                            <span class="detalle-precio-unitario">
                                Precio unitario: <strong>${formatearPrecio(precio)}</strong>
                            </span>
                        </div>

                        ${generarAcompanamientosDetalle(
                            producto.acompanamientos
                        )}

                    </div>

                    <div class="detalle-producto-precio-col">
                        <small>SUBTOTAL</small>
                        <strong class="detalle-producto-subtotal">
                            ${formatearPrecio(subtotal)}
                        </strong>
                    </div>

                </article>
            `;

        }
    ).join("");

}


/* ========================================
   MOSTRAR DETALLE
======================================== */

async function mostrarDetallePedido(id) {

    // Siempre abrir el pedido exacto solicitado y traer sus datos más recientes
    // desde Supabase. Así el botón Ver no depende de una caché incompleta.
    let pedido = null;

    try {
        if (typeof cargarPedidoIndividualAdmin === "function") {
            pedido = await cargarPedidoIndividualAdmin(id);
        }
    } catch (error) {
        console.error("Error cargando el pedido seleccionado:", error);
    }

    if (!pedido) pedido = buscarPedidoPanel(id);

    if (!pedido && typeof cargarPedidosSupabaseAdmin === "function") {
        await cargarPedidosSupabaseAdmin();
        pedido = buscarPedidoPanel(id);
    }

    if (!pedido) {
        mostrarMensaje("No se encontró el pedido o no se pudo cargar su detalle.");
        if (typeof cerrarVistaExclusivaPanel === "function") cerrarVistaExclusivaPanel();
        return;
    }


    // El componente debe permanecer montado. Si por una versión antigua fue
    // vaciado, se vuelve a cargar automáticamente antes de renderizar.
    let detalle = document.getElementById("detallePedido");
    if (!detalle) {
        const host = document.getElementById("panelDetalle");
        if (host) {
            try {
                const respuesta = await fetch("panel-detalle.html", { cache: "no-store" });
                if (respuesta.ok) {
                    host.innerHTML = await respuesta.text();
                    detalle = document.getElementById("detallePedido");
                    if (typeof configurarPanel === "function") configurarPanel();
                }
            } catch (error) {
                console.error("No se pudo reconstruir el detalle del pedido:", error);
            }
        }
    }

    if (typeof abrirVistaExclusivaPanel === "function") abrirVistaExclusivaPanel("panelDetalle");


    const numero =
        document.getElementById(
            "detalleNumero"
        );


    const estado =
        document.getElementById(
            "detalleEstado"
        );


    const contenido =
        document.getElementById(
            "detalleContenido"
        );


    if (!detalle || !numero || !contenido) {
        mostrarMensaje("No se pudo abrir la vista del pedido. Actualiza la página e inténtalo nuevamente.");
        if (typeof cerrarVistaExclusivaPanel === "function") cerrarVistaExclusivaPanel();
        return;
    }


    const estadoPedido =
        normalizarEstado(
            pedido.estado
        );


    numero.textContent =
        `#${pedido.id}`;


    if (estado) {

        estado.innerHTML =
            generarEstadoHTML(
                estadoPedido
            );

    }


    const cantidadTotal = Array.isArray(pedido.productos)
        ? pedido.productos.reduce((tot, p) => tot + Number(p.cantidad || 0), 0)
        : 0;
    const totalMonto = Number(pedido.total || 0);

    contenido.innerHTML = `
        <div class="detalle-cliente-grid">
            <div class="detalle-meta-card">
                <div class="detalle-meta-icon"><i class="fa-solid fa-user"></i></div>
                <div class="detalle-meta-textos">
                    <span class="detalle-meta-label">CLIENTE</span>
                    <strong class="detalle-meta-val">${escaparHTML(pedido.cliente || "Sin nombre")}</strong>
                </div>
            </div>

            <div class="detalle-meta-card">
                <div class="detalle-meta-icon"><i class="fa-solid fa-chair"></i></div>
                <div class="detalle-meta-textos">
                    <span class="detalle-meta-label">MESA / DESTINO</span>
                    <strong class="detalle-meta-val detalle-mesa-destacada">${escaparHTML(pedido.mesa || "-")}</strong>
                </div>
            </div>

            <div class="detalle-meta-card">
                <div class="detalle-meta-icon"><i class="fa-regular fa-calendar-days"></i></div>
                <div class="detalle-meta-textos">
                    <span class="detalle-meta-label">FECHA REGISTRO</span>
                    <strong class="detalle-meta-val">${escaparHTML(pedido.fecha || "-")}</strong>
                </div>
            </div>

            <div class="detalle-meta-card">
                <div class="detalle-meta-icon"><i class="fa-regular fa-clock"></i></div>
                <div class="detalle-meta-textos">
                    <span class="detalle-meta-label">HORA REGISTRO</span>
                    <strong class="detalle-meta-val">${escaparHTML(pedido.hora || "-")}</strong>
                </div>
            </div>

            <div class="detalle-meta-card">
                <div class="detalle-meta-icon"><i class="fa-solid fa-cubes-stacked"></i></div>
                <div class="detalle-meta-textos">
                    <span class="detalle-meta-label">TOTAL ÍTEMS</span>
                    <strong class="detalle-meta-val">${cantidadTotal} unidad(es)</strong>
                </div>
            </div>

            ${pedido.fechaCierre ? `
                <div class="detalle-meta-card detalle-meta-cerrado">
                    <div class="detalle-meta-icon"><i class="fa-solid fa-circle-check"></i></div>
                    <div class="detalle-meta-textos">
                        <span class="detalle-meta-label">FECHA Y HORA DE COBRO</span>
                        <strong class="detalle-meta-val">${escaparHTML(pedido.fechaCierre)} ${pedido.horaCierre ? `· ${escaparHTML(pedido.horaCierre)}` : ""}</strong>
                    </div>
                </div>
            ` : (pedido.fechaCancelacion ? `
                <div class="detalle-meta-card detalle-meta-cancelado">
                    <div class="detalle-meta-icon"><i class="fa-solid fa-ban"></i></div>
                    <div class="detalle-meta-textos">
                        <span class="detalle-meta-label">ANULACIÓN DE PEDIDO</span>
                        <strong class="detalle-meta-val">${escaparHTML(pedido.fechaCancelacion)} ${pedido.horaCancelacion ? `· ${escaparHTML(pedido.horaCancelacion)}` : ""}</strong>
                    </div>
                </div>
            ` : `
                <div class="detalle-meta-card detalle-meta-abierto">
                    <div class="detalle-meta-icon"><i class="fa-solid fa-receipt"></i></div>
                    <div class="detalle-meta-textos">
                        <span class="detalle-meta-label">ESTADO DE COBRO</span>
                        <strong class="detalle-meta-val detalle-cobro-pendiente">Pendiente de pago</strong>
                    </div>
                </div>
            `)}
        </div>

        <div class="detalle-seccion-productos">
            <div class="detalle-productos-header">
                <div>
                    <span class="admin-etiqueta">
                        <i class="fa-solid fa-burger" style="margin-right: 5px;"></i>LISTA DE PRODUCTOS
                    </span>
                    <h3>Ítems de la orden</h3>
                </div>
                <span class="detalle-productos-conteo">${Array.isArray(pedido.productos) ? pedido.productos.length : 0} producto(s)</span>
            </div>

            <div class="detalle-productos-lista">
                ${generarProductosDetalle(pedido.productos)}
            </div>
        </div>

        <div class="detalle-resumen-total">
            <div class="detalle-resumen-info">
                <div class="detalle-resumen-icono"><i class="fa-solid fa-cash-register"></i></div>
                <div>
                    <span class="detalle-resumen-label">RESUMEN ECONÓMICO</span>
                    <p class="detalle-resumen-desc">${cantidadTotal} unidad(es) en total</p>
                </div>
            </div>
            <div class="detalle-resumen-monto-box">
                <span class="detalle-resumen-total-label">TOTAL DEL PEDIDO</span>
                <strong class="detalle-resumen-total-monto">${formatearPrecio(totalMonto)}</strong>
            </div>
        </div>
    `;

    detalle.hidden = false;

    configurarBotonesDetalle(pedido);

    detalle.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

/* ========================================
   BOTONES DEL DETALLE
======================================== */

function configurarBotonesDetalle(pedido) {
    const editar = document.getElementById("btnEditarPedido");
    const estado = document.getElementById("btnCambiarEstado");
    const imprimir = document.getElementById("btnImprimirDetalle");
    const cerrar = document.getElementById("btnCerrarPedido");
    const cancelar = document.getElementById("btnCancelarPedido");
    const btnCerrarVista = document.getElementById("cerrarDetalle");

    if (btnCerrarVista) {
        btnCerrarVista.onclick = cerrarDetallePedido;
    }

    const estadoNormalizado = normalizarEstado(pedido.estado);
    const estaCerrado = estadoNormalizado === "cerrado";
    const estaCancelado = estadoNormalizado === "cancelado";
    const bloqueado = estaCerrado || estaCancelado;

    /* EDITAR */
    if (editar) {
        editar.disabled = bloqueado;
        editar.classList.toggle("is-disabled", bloqueado);
        editar.title = bloqueado 
            ? `No editable: Pedido ya ${estaCerrado ? 'PAGADO (CERRADO)' : 'ANULADO'}`
            : "Editar datos del pedido";

        editar.onclick = () => {
            if (bloqueado) {
                mostrarMensaje(`Este pedido no puede editarse porque está ${estaCerrado ? 'PAGADO (CERRADO)' : 'ANULADO'}.`);
                return;
            }
            if (typeof editarPedidoPanel === "function") {
                editarPedidoPanel(pedido.id);
            } else {
                mostrarMensaje("La función de edición no está disponible.");
            }
        };
    }

    /* CAMBIAR ESTADO */
    if (estado) {
        estado.disabled = bloqueado;
        estado.classList.toggle("is-disabled", bloqueado);
        estado.title = bloqueado 
            ? `Estado fijo: Pedido ya ${estaCerrado ? 'PAGADO (CERRADO)' : 'ANULADO'}`
            : "Cambiar fase del pedido";

        estado.onclick = () => {
            if (bloqueado) {
                mostrarMensaje(`Este pedido no puede cambiar de estado porque está ${estaCerrado ? 'PAGADO (CERRADO)' : 'ANULADO'}.`);
                return;
            }
            if (typeof cambiarEstadoPedidoPanel === "function") {
                cambiarEstadoPedidoPanel(pedido.id);
            } else {
                mostrarMensaje("La función de cambio de estado no está disponible.");
            }
        };
    }

    /* IMPRIMIR */
    if (imprimir) {
        imprimir.disabled = false;
        imprimir.onclick = () => {
            if (typeof imprimirPedidoPanel === "function") {
                imprimirPedidoPanel(pedido);
            } else {
                mostrarMensaje("La función de impresión no está disponible.");
            }
        };
    }

    /* CERRAR PEDIDO (PAGADO) */
    if (cerrar) {
        cerrar.disabled = bloqueado;
        cerrar.classList.toggle("is-disabled", bloqueado);
        cerrar.title = estaCerrado 
            ? "Este pedido ya está pagado y liquidado" 
            : (estaCancelado ? "Este pedido está anulado" : "Cobrar y cerrar pedido (PAGADO)");

        cerrar.onclick = () => {
            if (bloqueado) return;
            if (typeof cerrarPedidoPanel === "function") {
                cerrarPedidoPanel(pedido.id);
            } else {
                mostrarMensaje("La función de cerrar pedido no está disponible.");
            }
        };
    }

    /* CANCELAR PEDIDO (ANULAR) */
    if (cancelar) {
        cancelar.disabled = bloqueado;
        cancelar.classList.toggle("is-disabled", bloqueado);
        cancelar.title = estaCancelado 
            ? "Este pedido ya está anulado" 
            : (estaCerrado ? "Este pedido ya fue pagado y no se puede anular" : "Anular pedido sin cobro");

        cancelar.onclick = () => {
            if (bloqueado) return;
            if (typeof cancelarPedidoPanel === "function") {
                cancelarPedidoPanel(pedido.id);
            } else {
                mostrarMensaje("La función de cancelar pedido no está disponible.");
            }
        };
    }
}

/* ========================================
   CERRAR DETALLE
======================================== */

function cerrarDetallePedido() {
    if (typeof cerrarVistaExclusivaPanel === "function") cerrarVistaExclusivaPanel();

    const detalle = document.getElementById("detallePedido");
    if (detalle) {
        detalle.hidden = true;
    }
}

function editarPedidoPanel(id) {
    const pedido = buscarPedidoPanel(id);
    if (!pedido) {
        mostrarMensaje("No se encontró el pedido.");
        return;
    }

    const estado = normalizarEstado(pedido.estado);
    if (estado === "cerrado" || estado === "cancelado") {
        mostrarMensaje(`Este pedido ya no puede editarse porque está ${estado === 'cerrado' ? 'PAGADO (CERRADO)' : 'ANULADO'}.`);
        return;
    }

    if (typeof abrirEditorPedido === "function") {
        abrirEditorPedido(pedido);
    } else {
        mostrarMensaje("La función de edición no está disponible.");
    }
}

async function cancelarPedidoPanel(id) {
    const pedido = buscarPedidoPanel(id);
    if (!pedido) {
        mostrarMensaje("No se encontró el pedido.");
        return;
    }

    const estado = normalizarEstado(pedido.estado);
    if (estado === "cancelado") {
        mostrarMensaje("Este pedido ya está anulado.");
        return;
    }

    if (estado === "cerrado") {
        mostrarMensaje("Un pedido pagado y cerrado no puede anularse.");
        return;
    }

    const confirmado = await confirmarAccion(
        `¿Confirmas la anulación del pedido #${pedido.id}? Se cancelará sin cobro y no podrá volver a abrirse.`,
        { aceptar: "Anular Pedido", tipo: "peligro", titulo: "Confirmar Anulación" }
    );

    if (!confirmado) {
        return;
    }

    const pedidoActualizado = {
        ...pedido,
        estado: "cancelado"
    };

    const fechaHora = typeof obtenerFechaHora === "function" 
        ? obtenerFechaHora() 
        : { fecha: new Date().toLocaleDateString("es-PE"), hora: new Date().toLocaleTimeString("es-PE") };

    pedidoActualizado.fechaCancelacion = fechaHora.fecha;
    pedidoActualizado.horaCancelacion = fechaHora.hora;

    try {
        if (typeof persistirPedidoAdmin === "function") {
            await persistirPedidoAdmin(pedidoActualizado);
        }
        if (typeof actualizarPedido === "function") {
            actualizarPedido(pedidoActualizado);
        }
        const pedidos = typeof obtenerPedidosPanel === "function" ? obtenerPedidosPanel() : [];
        const indice = pedidos.findIndex(p => String(p.uuid || p.id) === String(pedidoActualizado.uuid || pedidoActualizado.id));
        if (indice >= 0 && typeof guardarCachePedidosPanel === "function") {
            pedidos[indice] = pedidoActualizado;
            guardarCachePedidosPanel(pedidos);
        }
    } catch (e) {
        console.error("Error al anular pedido:", e);
    }

    actualizarPanel();
    mostrarMensaje(`El pedido #${pedido.id} fue anulado.`);

    if (typeof mostrarDetallePedido === "function") {
        mostrarDetallePedido(pedido.id);
    }
}
