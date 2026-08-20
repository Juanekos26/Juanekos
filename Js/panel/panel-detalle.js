/* ========================================
   DETALLE DEL PEDIDO
======================================== */


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


    const elementos = [];


    Object.entries(nombres).forEach(
        ([tipo, nombre]) => {

            const cantidad =
                Number(
                    acompanamientos[tipo] || 0
                );


            if (cantidad > 0) {

                elementos.push(`
                    <span>
                        ${escaparHTML(nombre)}
                        × ${cantidad}
                    </span>
                `);

            }

        }
    );


    if (!elementos.length) {
        return "";
    }


    return `
        <div class="detalle-acompanamientos">

            <small>
                Acompañamientos
            </small>

            <div>
                ${elementos.join("")}
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
            <p class="sin-productos">
                No hay productos registrados.
            </p>
        `;

    }


    return productos.map(
        producto => {

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


            return `
                <article class="detalle-producto">

                    <div class="detalle-producto-info">

                        <strong>
                            ${escaparHTML(
                                producto.nombre
                            )}
                        </strong>

                        <small>
                            Categoría:
                            ${escaparHTML(
                                producto.categoria || "-"
                            )}
                        </small>

                        <small>
                            Cantidad:
                            ${cantidad}
                        </small>

                        <small>
                            Precio unitario:
                            ${formatearPrecio(precio)}
                        </small>

                        ${generarAcompanamientosDetalle(
                            producto.acompanamientos
                        )}

                    </div>

                    <strong class="detalle-producto-total">
                        ${formatearPrecio(subtotal)}
                    </strong>

                </article>
            `;

        }
    ).join("");

}


/* ========================================
   MOSTRAR DETALLE
======================================== */

function mostrarDetallePedido(id) {

    const pedido =
        buscarPedidoPanel(id);


    if (!pedido) {

        mostrarMensaje(
            "No se encontró el pedido."
        );

        return;

    }


    const detalle =
        document.getElementById(
            "detallePedido"
        );


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


    if (
        !detalle ||
        !numero ||
        !contenido
    ) {

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


    contenido.innerHTML = `

        <div class="detalle-cliente">

            <div>
                <span>CLIENTE</span>

                <strong>
                    ${escaparHTML(
                        pedido.cliente || "Sin nombre"
                    )}
                </strong>
            </div>


            <div>
                <span>MESA</span>

                <strong>
                    ${escaparHTML(
                        pedido.mesa || "-"
                    )}
                </strong>
            </div>


            <div>
                <span>FECHA</span>

                <strong>
                    ${escaparHTML(
                        pedido.fecha || "-"
                    )}
                </strong>
            </div>


            <div>
                <span>HORA</span>

                <strong>
                    ${escaparHTML(
                        pedido.hora || "-"
                    )}
                </strong>
            </div>


            <div>
                <span>PRODUCTOS</span>

                <strong>
                    ${
                        typeof obtenerCantidadProductos ===
                        "function"
                            ? obtenerCantidadProductos(
                                pedido.productos
                            )
                            : (
                                Array.isArray(
                                    pedido.productos
                                )
                                    ? pedido.productos.reduce(
                                        (
                                            total,
                                            producto
                                        ) =>
                                            total +
                                            Number(
                                                producto.cantidad || 0
                                            ),
                                        0
                                    )
                                    : 0
                            )
                    }
                </strong>
            </div>


            ${
                pedido.fechaCierre
                    ? `
                        <div>
                            <span>
                                CIERRE
                            </span>

                            <strong>
                                ${escaparHTML(
                                    pedido.fechaCierre
                                )}

                                ${
                                    pedido.horaCierre
                                        ? `
                                            ·
                                            ${escaparHTML(
                                                pedido.horaCierre
                                            )}
                                        `
                                        : ""
                                }
                            </strong>
                        </div>
                    `
                    : ""
            }

        </div>


        <div class="detalle-productos">

            <div class="detalle-productos-header">

                <span class="admin-etiqueta">
                    PRODUCTOS
                </span>

                <h3>
                    Detalle del pedido
                </h3>

            </div>

            ${generarProductosDetalle(
                pedido.productos
            )}

        </div>


        <div class="detalle-total">

            <span>
                TOTAL DEL PEDIDO
            </span>

            <strong>
                ${formatearPrecio(
                    pedido.total
                )}
            </strong>

        </div>

    `;


    detalle.hidden = false;


    configurarBotonesDetalle(
        pedido
    );


    detalle.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ========================================
   BOTONES DEL DETALLE
======================================== */

function configurarBotonesDetalle(pedido) {

    const editar =
        document.getElementById(
            "btnEditarPedido"
        );


    const estado =
        document.getElementById(
            "btnCambiarEstado"
        );


    const imprimir =
        document.getElementById(
            "btnImprimirDetalle"
        );


    const cerrar =
        document.getElementById(
            "btnCerrarPedido"
        );


    const cancelar =
        document.getElementById(
            "btnCancelarPedido"
        );


    const estadoNormalizado =
        normalizarEstado(
            pedido.estado
        );


    const bloqueado =
        estadoNormalizado === "cerrado" ||
        estadoNormalizado === "cancelado";


    /* EDITAR */

    if (editar) {

        editar.disabled =
            bloqueado;

        editar.onclick = () => {

            if (bloqueado) {
                return;
            }

            if (
                typeof editarPedidoPanel ===
                "function"
            ) {

                editarPedidoPanel(
                    pedido.id
                );

            } else {

                mostrarMensaje(
                    "La función de edición no está disponible."
                );

            }

        };

    }


    /* CAMBIAR ESTADO */

    if (estado) {

        estado.disabled =
            bloqueado;

        estado.onclick = () => {

            if (bloqueado) {
                return;
            }

            if (
                typeof cambiarEstadoPedidoPanel ===
                "function"
            ) {

                cambiarEstadoPedidoPanel(
                    pedido.id
                );

            } else {

                mostrarMensaje(
                    "La función de cambio de estado no está disponible."
                );

            }

        };

    }


    /* IMPRIMIR */

    if (imprimir) {

        imprimir.disabled = false;

        imprimir.onclick = () => {

            if (
                typeof imprimirPedidoPanel ===
                "function"
            ) {

                imprimirPedidoPanel(
                    pedido
                );

            } else {

                mostrarMensaje(
                    "La función de impresión no está disponible."
                );

            }

        };

    }


    /* CERRAR */

    if (cerrar) {

        cerrar.disabled =
            bloqueado;

        cerrar.onclick = () => {

            if (bloqueado) {
                return;
            }

            if (
                typeof cerrarPedidoPanel ===
                "function"
            ) {

                cerrarPedidoPanel(
                    pedido.id
                );

            } else {

                mostrarMensaje(
                    "La función de cerrar pedido no está disponible."
                );

            }

        };

    }


    /* CANCELAR */

    if (cancelar) {

        cancelar.disabled =
            bloqueado;

        cancelar.onclick = () => {

            if (bloqueado) {
                return;
            }

            if (
                typeof cancelarPedidoPanel ===
                "function"
            ) {

                cancelarPedidoPanel(
                    pedido.id
                );

            } else {

                mostrarMensaje(
                    "La función de cancelar pedido no está disponible."
                );

            }

        };

    }

}


/* ========================================
   CERRAR DETALLE
======================================== */

function cerrarDetallePedido() {

    const detalle =
        document.getElementById(
            "detallePedido"
        );


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

    if (normalizarEstado(pedido.estado) === "cerrado" ||
        normalizarEstado(pedido.estado) === "cancelado") {
        mostrarMensaje("Este pedido ya no puede editarse.");
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
        mostrarMensaje("Este pedido ya está cancelado.");
        return;
    }

    if (estado === "cerrado") {
        mostrarMensaje("Un pedido cerrado no puede cancelarse.");
        return;
    }

    if (!await confirmarAccion(`¿Deseas cancelar el pedido #${pedido.id}?`, { aceptar: "Cancelar pedido", tipo: "peligro" })) {
        return;
    }

    const pedidoActualizado = {
        ...pedido,
        estado: "cancelado"
    };

    const fechaHora = obtenerFechaHora();

    pedidoActualizado.fechaCancelacion = fechaHora.fecha;
    pedidoActualizado.horaCancelacion = fechaHora.hora;

    if (!actualizarPedido(pedidoActualizado)) {
        mostrarMensaje("No se pudo cancelar el pedido.");
        return;
    }

    actualizarPanel();

    mostrarMensaje(`El pedido #${pedido.id} fue cancelado.`);

    if (typeof mostrarDetallePedido === "function") {
        mostrarDetallePedido(pedido.id);
    }
}
