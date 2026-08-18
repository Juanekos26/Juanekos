function formatearPrecio(valor) {
    return `S/ ${Number(valor || 0).toFixed(2)}`;
}

function obtenerPedidosPanel() {
    if (typeof obtenerPedidosGuardados !== "function") {
        console.error(
            "No se encontró obtenerPedidosGuardados()."
        );

        return [];
    }

    return obtenerPedidosGuardados();
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function actualizarResumen() {

    const pedidos =
        obtenerPedidosPanel();

    const pedidosHoy =
        typeof obtenerPedidosDeHoy === "function"
            ? obtenerPedidosDeHoy()
            : [];

    const ventasHoy =
        pedidosHoy.reduce(
            (total, pedido) =>
                total + Number(pedido.total || 0),
            0
        );

    const ventasTotales =
        pedidos.reduce(
            (total, pedido) =>
                total + Number(pedido.total || 0),
            0
        );

    const pedidosPendientes =
        pedidos.filter(pedido =>
            !["cerrado", "cancelado"].includes(
                pedido.estado || "abierto"
            )
        );

    const pedidosCancelados =
        pedidos.filter(
            pedido =>
                pedido.estado === "cancelado"
        );

    const ventasHoyElemento =
        document.getElementById("ventasHoy");

    const pedidosHoyElemento =
        document.getElementById("pedidosHoy");

    const ventasTotalesElemento =
        document.getElementById("ventasTotales");

    const pedidosTotalesElemento =
        document.getElementById("pedidosTotales");

    const pedidosPendientesElemento =
        document.getElementById(
            "pedidosPendientes"
        );

    const pedidosCanceladosElemento =
        document.getElementById(
            "pedidosCancelados"
        );

    if (ventasHoyElemento) {
        ventasHoyElemento.textContent =
            formatearPrecio(ventasHoy);
    }

    if (pedidosHoyElemento) {
        pedidosHoyElemento.textContent =
            pedidosHoy.length;
    }

    if (ventasTotalesElemento) {
        ventasTotalesElemento.textContent =
            formatearPrecio(ventasTotales);
    }

    if (pedidosTotalesElemento) {
        pedidosTotalesElemento.textContent =
            pedidos.length;
    }

    if (pedidosPendientesElemento) {
        pedidosPendientesElemento.textContent =
            pedidosPendientes.length;
    }

    if (pedidosCanceladosElemento) {
        pedidosCanceladosElemento.textContent =
            pedidosCancelados.length;
    }
}

function convertirFechaFiltro(fecha) {

    if (!fecha) {
        return "";
    }

    const partes =
        fecha.split("-");

    if (partes.length !== 3) {
        return "";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

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

        const fechaFormato =
            convertirFechaFiltro(
                fechaSeleccionada
            );

        pedidos =
            pedidos.filter(
                pedido =>
                    pedido.fecha ===
                    fechaFormato
            );
    }

    if (estadoSeleccionado) {

        pedidos =
            pedidos.filter(
                pedido =>
                    (pedido.estado ||
                        "abierto") ===
                    estadoSeleccionado
            );
    }

    if (textoBusqueda) {

        pedidos =
            pedidos.filter(pedido => {

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

                return (
                    id.includes(
                        textoBusqueda
                    ) ||
                    cliente.includes(
                        textoBusqueda
                    ) ||
                    mesa.includes(
                        textoBusqueda
                    )
                );
            });
    }

    return pedidos;
}

function obtenerTextoEstado(estado) {

    const estados = {
        abierto: "ABIERTO",
        preparacion: "EN PREPARACIÓN",
        listo: "LISTO",
        cerrado: "CERRADO",
        cancelado: "CANCELADO"
    };

    return (
        estados[estado] ||
        String(estado || "abierto")
            .toUpperCase()
    );
}

function generarFilaPedido(pedido) {

    const estado =
        pedido.estado || "abierto";

    const botonCerrar =
        estado === "cerrado" ||
        estado === "cancelado"
            ? `
                <button
                    type="button"
                    class="btn-cerrar-pedido"
                    disabled
                >
                    ✓ ${obtenerTextoEstado(estado)}
                </button>
            `
            : `
                <button
                    type="button"
                    class="btn-cerrar-pedido"
                    data-accion="cerrar"
                    data-id="${escaparHTML(
                        pedido.id
                    )}"
                >
                    ✓ CERRAR
                </button>
            `;

    return `
        <tr>

            <td>
                #${escaparHTML(
                    pedido.id
                )}
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
                    pedido.cliente || "-"
                )}
            </td>

            <td>
                ${escaparHTML(
                    pedido.mesa || "-"
                )}
            </td>

            <td>
                <strong>
                    ${formatearPrecio(
                        pedido.total
                    )}
                </strong>
            </td>

            <td>

                <span
                    class="estado-pedido estado-${escaparHTML(
                        estado
                    )}"
                >
                    ${obtenerTextoEstado(
                        estado
                    )}
                </span>

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
                        👁️ VER
                    </button>

                    ${botonCerrar}

                </div>

            </td>

        </tr>
    `;
}

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
                    colspan="8"
                    class="sin-ventas"
                >
                    No se encontraron pedidos.
                </td>

            </tr>
        `;

        return;
    }

    const pedidosOrdenados =
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
        pedidosOrdenados
            .map(generarFilaPedido)
            .join("");

    configurarAccionesPedidos();
}

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

            const listaAcompanamientos =
                [];

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

                        listaAcompanamientos.push(
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
                            listaAcompanamientos.length
                                ? `
                                    <div
                                        class="detalle-acompanamientos"
                                    >

                                        <small>
                                            Acompañamientos:
                                        </small>

                                        ${listaAcompanamientos
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

    numero.textContent =
        `#${pedido.id}`;

    if (estado) {

        estado.textContent =
            `Estado: ${obtenerTextoEstado(
                pedido.estado ||
                    "abierto"
            )}`;
    }

    contenido.innerHTML = `

        <div class="detalle-cliente">

            <div>

                <span>
                    CLIENTE
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.cliente ||
                            "-"
                    )}
                </strong>

            </div>

            <div>

                <span>
                    MESA
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.mesa ||
                            "-"
                    )}
                </strong>

            </div>

            <div>

                <span>
                    FECHA
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.fecha ||
                            "-"
                    )}
                </strong>

            </div>

            <div>

                <span>
                    HORA
                </span>

                <strong>
                    ${escaparHTML(
                        pedido.hora ||
                            "-"
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
        typeof obtenerPedidoPorId ===
        "function"
            ? obtenerPedidoPorId(id)
            : null;

    if (!pedido) {

        alert(
            "No se encontró el pedido."
        );

        return;
    }

    if (
        pedido.estado ===
        "cerrado"
    ) {

        alert(
            "Este pedido ya está cerrado."
        );

        return;
    }

    if (
        pedido.estado ===
        "cancelado"
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

    const resultado =
        cerrarPedido(id);

    if (!resultado) {

        alert(
            "No se pudo cerrar el pedido."
        );

        return;
    }

    actualizarPanel();
}

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

                    if (
                        accion ===
                        "ver"
                    ) {

                        mostrarDetallePedido(
                            id
                        );
                    }

                    if (
                        accion ===
                        "cerrar"
                    ) {

                        cerrarPedidoPanel(
                            id
                        );
                    }

                }
            );

        }
    );
}

function limpiarFiltros() {

    const buscador =
        document.getElementById(
            "buscarPedido"
        );

    const fecha =
        document.getElementById(
            "filtroFecha"
        );

    const estado =
        document.getElementById(
            "filtroEstado"
        );

    if (buscador) {
        buscador.value = "";
    }

    if (fecha) {
        fecha.value = "";
    }

    if (estado) {
        estado.value = "";
    }

    renderizarVentas();
}

function actualizarPanel() {

    actualizarResumen();

    renderizarVentas();
}

function configurarPanel() {

    const botonActualizar =
        document.getElementById(
            "btnActualizar"
        );

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

    const botonLimpiarFiltros =
        document.getElementById(
            "btnLimpiarFiltros"
        );

    const botonCerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );

    const botonCerrarDetalle =
        document.getElementById(
            "cerrarDetalle"
        );

    if (botonActualizar) {

        botonActualizar.addEventListener(
            "click",
            actualizarPanel
        );
    }

    if (filtroFecha) {

        filtroFecha.addEventListener(
            "change",
            renderizarVentas
        );
    }

    if (filtroEstado) {

        filtroEstado.addEventListener(
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

    if (botonLimpiarFiltros) {

        botonLimpiarFiltros.addEventListener(
            "click",
            limpiarFiltros
        );
    }

    if (botonCerrarSesion) {

        botonCerrarSesion.addEventListener(
            "click",
            () => {

                if (
                    typeof cerrarSesion ===
                    "function"
                ) {

                    cerrarSesion();
                }

            }
        );
    }

    if (botonCerrarDetalle) {

        botonCerrarDetalle.addEventListener(
            "click",
            cerrarDetallePedido
        );
    }

    actualizar