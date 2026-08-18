function obtenerPedidos() {

    try {

        const datos =
            localStorage.getItem("pedidos");

        if (!datos) {
            return [];
        }

        const pedidos =
            JSON.parse(datos);

        return Array.isArray(pedidos)
            ? pedidos
            : [];

    } catch (error) {

        console.error(
            "Error al obtener pedidos:",
            error
        );

        return [];

    }
}

function guardarPedidos(pedidos) {

    if (!Array.isArray(pedidos)) {
        return false;
    }

    try {

        localStorage.setItem(
            "pedidos",
            JSON.stringify(pedidos)
        );

        return true;

    } catch (error) {

        console.error(
            "Error al guardar pedidos:",
            error
        );

        return false;

    }
}

function obtenerPedidoPorId(id) {

    const pedidos =
        obtenerPedidos();

    return pedidos.find(
        pedido =>
            String(pedido.id) ===
            String(id)
    ) || null;
}

function actualizarPedido(
    pedidoActualizado
) {

    if (!pedidoActualizado) {
        return false;
    }

    const pedidos =
        obtenerPedidos();

    const indice =
        pedidos.findIndex(
            pedido =>
                String(pedido.id) ===
                String(pedidoActualizado.id)
        );

    if (indice === -1) {
        return false;
    }

    pedidos[indice] =
        pedidoActualizado;

    return guardarPedidos(
        pedidos
    );
}

function eliminarPedidoPorId(id) {

    const pedidos =
        obtenerPedidos();

    const nuevosPedidos =
        pedidos.filter(
            pedido =>
                String(pedido.id) !==
                String(id)
        );

    if (
        nuevosPedidos.length ===
        pedidos.length
    ) {
        return false;
    }

    return guardarPedidos(
        nuevosPedidos
    );
}

function obtenerTotalPedido(pedido) {

    if (
        !pedido ||
        !Array.isArray(
            pedido.productos
        )
    ) {
        return 0;
    }

    return Number(
        pedido.productos.reduce(
            (total, producto) => {

                const precio =
                    Number(
                        producto.precio
                    ) || 0;

                const cantidad =
                    Number(
                        producto.cantidad
                    ) || 0;

                return total +
                    precio * cantidad;

            },
            0
        ).toFixed(2)
    );
}

function obtenerCantidadProductos(
    pedido
) {

    if (
        !pedido ||
        !Array.isArray(
            pedido.productos
        )
    ) {
        return 0;
    }

    return pedido.productos.reduce(
        (total, producto) =>
            total +
            (
                Number(
                    producto.cantidad
                ) || 0
            ),
        0
    );
}

function obtenerFechaActual() {

    const fecha =
        new Date();

    return fecha.toLocaleDateString(
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

function normalizarEstado(
    estado
) {

    const estados = [
        "abierto",
        "preparacion",
        "listo",
        "cerrado",
        "cancelado"
    ];

    const valor =
        String(
            estado || "abierto"
        )
            .toLowerCase()
            .trim();

    return estados.includes(valor)
        ? valor
        : "abierto";
}

function obtenerNombreEstado(
    estado
) {

    const nombres = {

        abierto:
            "Abierto",

        preparacion:
            "En preparación",

        listo:
            "Listo",

        cerrado:
            "Cerrado",

        cancelado:
            "Cancelado"

    };

    return (
        nombres[
            normalizarEstado(estado)
        ] ||
        "Abierto"
    );
}

function pedidoEstaPendiente(
    pedido
) {

    const estado =
        normalizarEstado(
            pedido?.estado
        );

    return (
        estado === "abierto" ||
        estado === "preparacion" ||
        estado === "listo"
    );

}

function pedidoEstaCancelado(
    pedido
) {

    return (
        normalizarEstado(
            pedido?.estado
        ) === "cancelado"
    );

}

function generarIdPedido() {

    return Date.now();

}