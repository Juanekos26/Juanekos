function formatearPrecio(valor) {
    return `S/ ${Number(valor || 0).toFixed(2)}`;
}

function obtenerPedidosPanel() {
    if (typeof obtenerPedidosGuardados !== "function") {
        console.error("No se encontró obtenerPedidosGuardados().");
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
    const pedidos = obtenerPedidosPanel();

    const pedidosHoy =
        typeof obtenerPedidosDeHoy === "function"
            ? obtenerPedidosDeHoy()
            : [];

    const ventasHoy = pedidosHoy.reduce(
        (total, pedido) =>
            total + Number(pedido.total || 0),
        0
    );

    const ventasTotales = pedidos.reduce(
        (total, pedido) =>
            total + Number(pedido.total || 0),
        0
    );

    const ventasHoyElemento =
        document.getElementById("ventasHoy");

    const pedidosHoyElemento =
        document.getElementById("pedidosHoy");

    const ventasTotalesElemento =
        document.getElementById("ventasTotales");

    const pedidosTotalesElemento =
        document.getElementById("pedidosTotales");

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
}

function convertirFechaFiltro(fecha) {
    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return "";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerPedidosFiltrados() {
    const pedidos = obtenerPedidosPanel();

    const filtro =
        document.getElementById("filtroFecha");

    const fechaSeleccionada =
        filtro?.value || "";

    if (!fechaSeleccionada) {
        return pedidos;
    }

    const fechaFormato =
        convertirFechaFiltro(fechaSeleccionada);

    return pedidos.filter(pedido =>
        pedido.fecha === fechaFormato
    );
}

function generarFilaPedido(pedido) {
    const estado =
        pedido.estado || "abierto";

    const botonCerrar =
        estado === "cerrado"
            ? `
                <button
                    type="button"
                    class="btn-cerrar-pedido"
                    disabled
                >
                    ✓ CERRADO
                </button>
            `
            : `
                <button
                    type="button"
                    class="btn-cerrar-pedido"
                    data-accion="cerrar"
                    data-id="${escaparHTML(pedido.id)}"
                >
                    ✓ CERRAR
                </button>
            `;

    return `
        <tr>

            <td>
                #${escaparHTML(pedido.id)}
            </td>

            <td>
                ${escaparHTML(pedido.fecha || "-")}
            </td>

            <td>
                ${escaparHTML(pedido.hora || "-")}
            </td>

            <td>
                ${escaparHTML(pedido.cliente || "-")}
            </td>

            <td>
                ${escaparHTML(pedido.mesa || "-")}
            </td>

            <td>
                <strong>
                    ${formatearPrecio(pedido.total)}
                </strong>
            </td>

            <td>

                <div class="acciones-pedido">

                    <button
                        type="button"
                        class="btn-ver-pedido"
                        data-accion="ver"
                        data-id="${escaparHTML(pedido.id)}"
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
        document.getElementById("listaVentas");

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
                    No hay ventas registradas.
                </td>
            </tr>
        `;

        return;
    }

    const pedidosOrdenados =
        [...pedidos].sort(
            (a, b) =>
                Number(b.timestamp || 0) -
                Number(a.timestamp || 0)
        );

    contenedor.innerHTML =
        pedidosOrdenados
            .map(generarFilaPedido)
            .join("");

    configurarAccionesPedidos();
}

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

    return productos.map(producto => {

        const cantidad =
            Number(producto.cantidad || 0);

        const precio =
            Number(producto.precio || 0);

        const subtotal =
            cantidad * precio;

        const acompanamientos =
            producto.acompanamientos || {};

        const nombres = {
            chaufaCompleto: "Chaufa completo",
            papaEnsalada: "Papa + Ensalada",
            papaChaufa: "Papa + Chaufa",
            papaSola: "Papa sola",
            chaufaSola: "Chaufa sola"
        };

        const acompanamientosTexto = [];

        Object.entries(nombres).forEach(
            ([tipo, nombre]) => {

                const cantidadAcompanamiento =
                    Number(
                        acompanamientos[tipo] || 0
                    );

                if (cantidadAcompanamiento > 0) {
                    acompanamientosTexto.push(
                        `${nombre} × ${cantidadAcompanamiento}`
                    );
                }
            }
        );

        return `
            <article class="detalle-producto">

                <div class="detalle-producto-info">

                    <strong>
                        ${escaparHTML(producto.nombre)}
                    </strong>

                    <small>
                        ${cantidad} ×
                        ${formatearPrecio(precio)}
                    </small>

                    ${
                        acompanamientosTexto.length
                            ? `
                                <div class="detalle-acompanamientos">

                                    <small>
                                        Acompañamientos:
                                    </small>

                                    ${acompanamientosTexto
                                        .map(
                                            item =>
                                                `<span>${escaparHTML(item)}</span>`
                                        )
                                        .join("")}

                                </div>
                            `
                            : ""
                    }

                </div>

                <strong>
                    ${formatearPrecio(subtotal)}
                </strong>

            </article>
        `;
    }).join("");
}

function mostrarDetallePedido(id) {
    if (
        typeof obtenerPedidoPorId !== "function"
    ) {
        return;
    }

    const pedido =
        obtenerPedidoPorId(id);

    if (!pedido) {
        alert("No se encontró el pedido.");
        return;
    }

    const detalle =
        document.getElementById("detallePedido");

    const numero =
        document.getElementById("detalleNumero");

    const contenido =
        document.getElementById("detalleContenido");

    if (!detalle || !numero || !contenido) {
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
                        pedido.cliente || "-"
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
                <span>ESTADO</span>
                <strong>
                    ${escaparHTML(
                        pedido.estado || "abierto"
                    ).toUpperCase()}
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
                ${formatearPrecio(pedido.total)}
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
        document.getElementById("detallePedido");

    if (detalle) {
        detalle.hidden = true;
    }
}

function cerrarPedidoPanel(id) {
    if (
        typeof cerrarPedido !== "function"
    ) {
        alert("No se encontró la función cerrarPedido().");
        return;
    }

    const pedido =
        typeof obtenerPedidoPorId === "function"
            ? obtenerPedidoPorId(id)
            : null;

    if (!pedido) {
        alert("No se encontró el pedido.");
        return;
    }

    if (pedido.estado === "cerrado") {
        alert("Este pedido ya está cerrado.");
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
        alert("No se pudo cerrar el pedido.");
        return;
    }

    actualizarPanel();
}

function configurarAccionesPedidos() {
    const botones =
        document.querySelectorAll(
            "[data-accion]"
        );

    botones.forEach(boton => {

        boton.addEventListener(
            "click",
            () => {

                const accion =
                    boton.dataset.accion;

                const id =
                    boton.dataset.id;

                if (accion === "ver") {
                    mostrarDetallePedido(id);
                }

                if (accion === "cerrar") {
                    cerrarPedidoPanel(id);
                }

            }
        );

    });
}

function actualizarPanel() {
    actualizarResumen();
    renderizarVentas();
}

function configurarPanel() {
    const botonActualizar =
        document.getElementById("btnActualizar");

    const filtroFecha =
        document.getElementById("filtroFecha");

    const botonCerrarSesion =
        document.getElementById("btnCerrarSesion");

    const botonCerrarDetalle =
        document.getElementById("cerrarDetalle");

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

    if (botonCerrarSesion) {
        botonCerrarSesion.addEventListener(
            "click",
            () => {

                if (
                    typeof cerrarSesion === "function"
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

    actualizarPanel();
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.getElementById("listaVentas")
        ) {
            configurarPanel();
        }

    }
);