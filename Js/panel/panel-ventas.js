/* ========================================
   GESTIÓN DE VENTAS / PEDIDOS
======================================== */

function obtenerPedidosFiltrados() {

    let pedidos =
        obtenerPedidosPanel();


    const filtroFecha =
        document.getElementById(
            "filtroFecha"
        );


    const filtroEstado =
        document.getElementById(
            "filtroEstado"
        );


    const buscador =
        document.getElementById(
            "buscarPedido"
        );


    const fechaSeleccionada =
        filtroFecha?.value || "";


    const estadoSeleccionado =
        filtroEstado?.value || "";


    const textoBusqueda =
        buscador?.value
            ?.trim()
            .toLowerCase() || "";


    if (fechaSeleccionada) {

        const fecha =
            convertirFechaFiltro(
                fechaSeleccionada
            );

        pedidos =
            pedidos.filter(
                pedido =>
                    pedido.fecha === fecha
            );

    }


    if (estadoSeleccionado) {

        pedidos =
            pedidos.filter(
                pedido =>
                    normalizarEstado(
                        pedido.estado
                    ) === estadoSeleccionado
            );

    }


    if (textoBusqueda) {

        pedidos =
            pedidos.filter(
                pedido => {

                    const id =
                        String(
                            pedido.id || ""
                        ).toLowerCase();


                    const cliente =
                        String(
                            pedido.cliente || ""
                        ).toLowerCase();


                    const mesa =
                        String(
                            pedido.mesa || ""
                        ).toLowerCase();


                    const productos =
                        Array.isArray(
                            pedido.productos
                        )
                            ? pedido.productos
                                .map(
                                    producto =>
                                        producto.nombre || ""
                                )
                                .join(" ")
                                .toLowerCase()
                            : "";


                    return (
                        id.includes(
                            textoBusqueda
                        ) ||
                        cliente.includes(
                            textoBusqueda
                        ) ||
                        mesa.includes(
                            textoBusqueda
                        ) ||
                        productos.includes(
                            textoBusqueda
                        )
                    );

                }
            );

    }


    return pedidos;

}


/* ========================================
   FILA DEL PEDIDO
======================================== */

function generarFilaPedido(pedido) {

    const estado =
        normalizarEstado(
            pedido.estado
        );


    const bloqueado =
        estado === "cerrado" ||
        estado === "cancelado";


    return `
        <tr>

            <td>
                <strong>
                    #${escaparHTML(pedido.id)}
                </strong>
            </td>


            <td>
                ${escaparHTML(
                    pedido.fecha || "-"
                )}
            </td>


            <td>
                ${escaparHTML(
                    pedido.hora || "-"
                )}
            </td>


            <td>
                ${escaparHTML(
                    pedido.cliente || "Sin nombre"
                )}
            </td>


            <td>
                <strong>
                    ${escaparHTML(
                        pedido.mesa || "-"
                    )}
                </strong>
            </td>


            <td>
                <strong>
                    ${formatearPrecio(
                        pedido.total
                    )}
                </strong>
            </td>


            <td>

                <div class="acciones-pedido">

                    <button
                        type="button"
                        class="btn-ver-pedido"
                        data-accion="ver"
                        data-id="${escaparHTML(
                            pedido.id
                        )}"
                    >
                        Ver
                    </button>


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-editar-pedido-tabla"
                                    data-accion="editar"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Editar
                                </button>
                            `
                            : ""
                    }


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-estado-pedido-tabla"
                                    data-accion="estado"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Estado
                                </button>
                            `
                            : ""
                    }


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-cerrar-pedido"
                                    data-accion="cerrar"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Cerrar
                                </button>
                            `
                            : ""
                    }


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-cancelar-pedido-tabla"
                                    data-accion="cancelar"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Cancelar
                                </button>
                            `
                            : ""
                    }


                    ${generarEstadoHTML(
                        estado
                    )}

                </div>

            </td>

        </tr>
    `;

}


/* ========================================
   RENDERIZAR
======================================== */

function renderizarVentas() {

    const contenedor =
        document.getElementById(
            "listaVentas"
        );


    if (!contenedor) {
        return;
    }


    const pedidos =
        obtenerPedidosFiltrados();


    if (!pedidos.length) {

        contenedor.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="sin-ventas"
                >
                    No se encontraron pedidos.
                </td>
            </tr>
        `;

        return;

    }


    const ordenados =
        [...pedidos].sort(
            (a, b) =>
                Number(
                    b.timestamp || 0
                ) -
                Number(
                    a.timestamp || 0
                )
        );


    contenedor.innerHTML =
        ordenados
            .map(
                generarFilaPedido
            )
            .join("");


    configurarAccionesPedidos();

}


/* ========================================
   ACCIONES
======================================== */

function configurarAccionesPedidos() {

    const botones =
        document.querySelectorAll(
            "[data-accion]"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const accion =
                        boton.dataset.accion;


                    const id =
                        boton.dataset.id;


                    if (accion === "ver") {

                        if (
                            typeof mostrarDetallePedido ===
                            "function"
                        ) {

                            mostrarDetallePedido(id);

                        }

                        return;
                    }


                    if (accion === "editar") {

                        if (
                            typeof editarPedidoPanel ===
                            "function"
                        ) {

                            editarPedidoPanel(id);

                        }

                        return;
                    }


                    if (accion === "estado") {

                        if (
                            typeof cambiarEstadoPedidoPanel ===
                            "function"
                        ) {

                            cambiarEstadoPedidoPanel(id);

                        }

                        return;
                    }


                    if (accion === "cerrar") {

                        cerrarPedidoPanel(id);

                        return;
                    }


                    if (accion === "cancelar") {

                        if (
                            typeof cancelarPedidoPanel ===
                            "function"
                        ) {

                            cancelarPedidoPanel(id);

                        }

                        return;
                    }

                }
            );

        }
    );

}


/* ========================================
   CERRAR PEDIDO
======================================== */

function cerrarPedidoPanel(id) {

    const pedido =
        buscarPedidoPanel(id);


    if (!pedido) {

        mostrarMensaje(
            "No se encontró el pedido."
        );

        return;

    }


    const estado =
        normalizarEstado(
            pedido.estado
        );


    if (estado === "cerrado") {

        mostrarMensaje(
            "Este pedido ya está cerrado."
        );

        return;

    }


    if (estado === "cancelado") {

        mostrarMensaje(
            "Un pedido cancelado no puede cerrarse."
        );

        return;

    }


    const confirmar =
        confirmarAccion(
            `¿Deseas cerrar el pedido #${pedido.id}?`
        );


    if (!confirmar) {
        return;
    }


    if (
        typeof cerrarPedido !==
        "function"
    ) {

        mostrarMensaje(
            "No se encontró cerrarPedido()."
        );

        return;

    }


    const resultado =
        cerrarPedido(id);


    if (!resultado) {

        mostrarMensaje(
            "No se pudo cerrar el pedido."
        );

        return;

    }


    mostrarMensaje(
        `Pedido #${pedido.id} cerrado correctamente.`
    );


    actualizarPanel();


    if (
        typeof mostrarDetallePedido ===
        "function"
    ) {

        mostrarDetallePedido(id);

    }

}


/* ========================================
   LIMPIAR FILTROS
======================================== */

function limpiarFiltrosPedidos() {

    const fecha =
        document.getElementById(
            "filtroFecha"
        );


    const estado =
        document.getElementById(
            "filtroEstado"
        );


    const buscador =
        document.getElementById(
            "buscarPedido"
        );


    if (fecha) {
        fecha.value = "";
    }


    if (estado) {
        estado.value = "";
    }


    if (buscador) {
        buscador.value = "";
    }


    renderizarVentas();

}


/* ========================================
   EVENTOS
======================================== */

function configurarFiltrosVentas() {

    const fecha =
        document.getElementById(
            "filtroFecha"
        );


    const estado =
        document.getElementById(
            "filtroEstado"
        );


    const buscador =
        document.getElementById(
            "buscarPedido"
        );


    const limpiar =
        document.getElementById(
            "btnLimpiarFiltros"
        );


    if (fecha) {

        fecha.addEventListener(
            "change",
            renderizarVentas
        );

    }


    if (estado) {

        estado.addEventListener(
            "change",
            renderizarVentas
        );

    }


    if (buscador) {

        buscador.addEventListener(
            "input",
            renderizarVentas
        );

    }


    if (limpiar) {

        limpiar.addEventListener(
            "click",
            limpiarFiltrosPedidos
        );

    }

}