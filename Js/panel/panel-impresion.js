const CLAVE_COMPROBANTE = "juanekos_comprobante";

function imprimirPedidoPanel(pedido) {

    if (
        pedido !== null &&
        typeof pedido !== "object"
    ) {
        pedido = buscarPedidoPanel(pedido);
    }

    if (!pedido) {
        mostrarMensaje("No se encontró el pedido.", "error");
        return;
    }

    if (
        !Array.isArray(pedido.productos) ||
        pedido.productos.length === 0
    ) {
        mostrarMensaje("El pedido no contiene productos.", "error");
        return;
    }

    const pedidoImpresion = {
        ...pedido,

        cliente:
            pedido.cliente || "-",

        mesa:
            pedido.mesa || "-",

        fecha:
            pedido.fecha || obtenerFechaActual(),

        hora:
            pedido.hora || obtenerHoraActual(),

        total:
            Number(pedido.total) || calcularTotalPedidoPanel(
                pedido.productos
            )
    };

    try {

        sessionStorage.setItem(
            CLAVE_COMPROBANTE,
            JSON.stringify(pedidoImpresion)
        );

    } catch (error) {

        console.error(
            "Error al preparar comprobante:",
            error
        );

        mostrarMensaje("No se pudo preparar el comprobante.", "error");

        return;
    }

    const ventana =
        window.open(
            "../Html/Comprobante.html",
            "_blank",
            "width=450,height=800"
        );

    if (!ventana) {

        mostrarMensaje("No se pudo abrir el comprobante. Permite las ventanas emergentes.", "error");

    }
}

function obtenerFechaActual() {

    return new Date().toLocaleDateString(
        "es-PE",
        {
            day: "2-digit",
            month: "2-digit",
            year: "numeric"
        }
    );
}

function obtenerHoraActual() {

    return new Date().toLocaleTimeString(
        "es-PE",
        {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }
    );
}

function calcularTotalPedidoPanel(
    productos
) {

    if (!Array.isArray(productos)) {
        return 0;
    }

    return Number(
        productos.reduce(
            (total, producto) => {

                const precio =
                    Number(producto.precio) || 0;

                const cantidad =
                    Number(producto.cantidad) || 0;

                return total +
                    precio * cantidad;

            },
            0
        ).toFixed(2)
    );
}

function imprimirPedidoActual() {

    if (
        typeof obtenerPedidoSeleccionado !==
        "function"
    ) {

        mostrarMensaje("No se pudo obtener el pedido seleccionado.", "error");

        return;
    }

    const pedido =
        obtenerPedidoSeleccionado();

    imprimirPedidoPanel(pedido);
}