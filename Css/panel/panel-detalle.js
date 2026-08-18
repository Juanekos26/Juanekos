function generarProductosDetalle(
    productos
) {

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

    return productos
        .map(producto => {

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

            const acompanamientos =
                producto.acompanamientos ||
                {};

            const lista = [];

            Object.entries(
                nombres
            ).forEach(
                ([tipo, nombre]) => {

                    const cantidadAcompanamiento =
                        Number(
                            acompanamientos[
                                tipo
                            ] || 0
                        );

                    if (
                        cantidadAcompanamiento >
                        0
                    ) {

                        lista.push(
                            `${nombre} × ${cantidadAcompanamiento}`
                        );
                    }
                }
            );

            return `
                <article
                    class="detalle-producto"
                >

                    <div
                        class="detalle-producto-info"
                    >

                        <strong>
                            ${escaparHTML(
                                producto.nombre
                            )}
                        </strong>

                        <small>
                            ${cantidad} ×
                            ${formatearPrecio(
                                precio
                            )}
                        </small>

                        ${
                            lista.length
                                ? `
                                    <div
                                        class="detalle-acompanamientos"
                                    >

                                        <small>
                                            Acompañamientos:
                                        </small>

                                        ${lista
                                            .map(
                                                item =>
                                                    `<span>${escaparHTML(
                                                        item
                                                    )}</span>`
                                            )
                                            .join("")}

                                    </div>
                                `
                                : ""
                        }

                    </div>

                    <strong>
                        ${formatearPrecio(
                            subtotal
                        )}
                    </strong>

                </article>
            `;
        })
        .join("");
}

function mostrarDetallePedido(id) {

    if (
        typeof obtenerPedidoPorId !==
        "function"
    ) {
        return;
    }

    const pedido =
        obtenerPedidoPorId(id);

    if (!pedido) {

        alert(
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

    numero.textContent =
        `#${pedido.id}`;

    contenido.innerHTML = `

        <div class="detalle-cliente">

            <div>
                <span>CLIENTE</span>

                <strong>
                    ${escaparHTML(
                        pedido.cliente ||
                        "-"
                    )}
                </strong>
            </div>

            <div>
                <span>MESA</span>

                <strong>
                    ${escaparHTML(
                        pedido.mesa ||
                        "-"
                    )}
                </strong>
            </div>

            <div>
                <span>FECHA</span>

                <strong>
                    ${escaparHTML(
                        pedido.fecha ||
                        "-"
                    )}
                </strong>
            </div>

            <div>
                <span>HORA</span>

                <strong>
                    ${escaparHTML(
                        pedido.hora ||
                        "-"
                    )}
                </strong>
            </div>

            <div>
                <span>ESTADO</span>

                <strong>
                    ${obtenerTextoEstado(
                        pedido.estado ||
                        "abierto"
                    )}
                </strong>
            </div>

        </div>

        <div class="detalle-productos">

            <h3>
                Productos
            </h3>

            ${generarProductosDetalle(
                pedido.productos
            )}

        </div>

        <div class="detalle-total">

            <span>
                TOTAL
            </span>

            <strong>
                ${formatearPrecio(
                    pedido.total
                )}
            </strong>

        </div>
    `;

    detalle.hidden = false;

    detalle.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function cerrarDetallePedido() {

    const detalle =
        document.getElementById(
            "detallePedido"
        );

    if (detalle) {
        detalle.hidden = true;
    }
}

function cerrarPedidoPanel(id) {

    if (
        typeof cerrarPedido !==
        "function"
    ) {
        alert(
            "No se encontró cerrarPedido()."
        );

        return;
    }

    const pedido =
        obtenerPedidoPorId(id);

    if (!pedido) {

        alert(
            "No se encontró el pedido."
        );

        return;
    }

    if (
        pedido.estado === "cerrado"
    ) {

        alert(
            "Este pedido ya está cerrado."
        );

        return;
    }

    if (
        pedido.estado === "cancelado"
    ) {

        alert(
            "Este pedido está cancelado."
        );

        return;
    }

    const confirmar =
        window.confirm(
            `¿Deseas cerrar el pedido #${pedido.id}?`
        );

    if (!confirmar) {
        return;
    }

    if (!cerrarPedido(id)) {

        alert(
            "No se pudo cerrar el pedido."
        );

        return;
    }

    actualizarPanel();
}

