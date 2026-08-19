const CLAVE_PEDIDOS = "juanekos_pedidos";

function obtenerPedidosGuardados() {
    try {
        const datos = localStorage.getItem(CLAVE_PEDIDOS);

        if (!datos) {
            return [];
        }

        const pedidos = JSON.parse(datos);

        return Array.isArray(pedidos) ? pedidos : [];

    } catch (error) {
        console.error("Error al obtener pedidos:", error);
        return [];
    }
}

function guardarPedidos(pedidos) {
    try {
        localStorage.setItem(
            CLAVE_PEDIDOS,
            JSON.stringify(pedidos)
        );

        return true;

    } catch (error) {
        console.error("Error al guardar pedidos:", error);
        return false;
    }
}

function generarIdPedido() {
    const pedidos = obtenerPedidosGuardados();

    if (!pedidos.length) {
        return 1;
    }

    return Math.max(
        ...pedidos.map(
            pedido => Number(pedido.id) || 0
        )
    ) + 1;
}

function obtenerFechaHora() {
    const ahora = new Date();

    return {
        fecha: ahora.toLocaleDateString("es-PE"),
        hora: ahora.toLocaleTimeString("es-PE", {
            hour: "2-digit",
            minute: "2-digit",
            hour12: true
        }),
        timestamp: ahora.getTime()
    };
}

function crearPedido() {

    if (
        typeof obtenerPedidoActual !==
        "function"
    ) {
        alert("No se pudo obtener el pedido.");
        return null;
    }

    const actual =
        obtenerPedidoActual();

    if (!actual.cliente) {

        alert(
            "Ingresa el nombre del cliente."
        );

        document
            .getElementById("cliente")
            ?.focus();

        return null;
    }

    if (!actual.mesa) {

        alert(
            "Ingresa el número de mesa."
        );

        document
            .getElementById("mesa")
            ?.focus();

        return null;
    }

    if (
        !actual.productos ||
        !actual.productos.length
    ) {

        alert(
            "Agrega al menos un producto."
        );

        return null;
    }

    const fechaHora =
        obtenerFechaHora();

    const pedido = {

        id: generarIdPedido(),

        cliente:
            actual.cliente,

        mesa:
            actual.mesa,

        productos:
            actual.productos,

        total:
            Number(actual.total || 0),

        fecha:
            fechaHora.fecha,

        hora:
            fechaHora.hora,

        timestamp:
            fechaHora.timestamp,

        estado:
            "inicio"

    };

    const pedidos =
        obtenerPedidosGuardados();

    pedidos.push(pedido);

    const guardado =
        guardarPedidos(pedidos);

    if (!guardado) {
        return null;
    }

    return pedido;
}

function finalizarPedido() {

    const pedido =
        crearPedido();

    if (!pedido) {
        return;
    }

    alert(
        `Pedido #${pedido.id} registrado correctamente.`
    );

    if (
        typeof limpiarPedido ===
        "function"
    ) {
        limpiarPedido();
    }

    return pedido;
}

function agregarProductosAPedido(
    pedidoId,
    productosNuevos
) {

    if (
        !Array.isArray(
            productosNuevos
        )
    ) {
        return false;
    }

    const pedidos =
        obtenerPedidosGuardados();

    const pedido =
        pedidos.find(
            item =>
                Number(item.id) ===
                Number(pedidoId)
        );

    if (!pedido) {
        return false;
    }

    if (
        !Array.isArray(
            pedido.productos
        )
    ) {
        pedido.productos = [];
    }

    productosNuevos.forEach(
        nuevo => {

            const existente =
                pedido.productos.find(
                    producto =>
                        Number(
                            producto.productoId
                        ) ===
                        Number(
                            nuevo.productoId
                        )
                );

            if (existente) {

                existente.cantidad =
                    Number(
                        existente.cantidad || 0
                    ) +
                    Number(
                        nuevo.cantidad || 0
                    );

                if (
                    nuevo.acompanamientos
                ) {

                    existente.acompanamientos =
                        nuevo.acompanamientos;

                }

            } else {

                pedido.productos.push({
                    ...nuevo
                });

            }

        }
    );

    recalcularPedido(pedido);

    return guardarPedidos(
        pedidos
    );
}

function recalcularPedido(
    pedido
) {

    if (
        !pedido ||
        !Array.isArray(
            pedido.productos
        )
    ) {
        return pedido;
    }

    const total =
        pedido.productos.reduce(
            (suma, producto) =>
                suma +
                Number(
                    producto.precio || 0
                ) *
                Number(
                    producto.cantidad || 0
                ),
            0
        );

    pedido.total =
        Number(
            total.toFixed(2)
        );

    return pedido;
}

function actualizarPedido(
    pedidoActualizado
) {

    if (
        !pedidoActualizado ||
        !pedidoActualizado.id
    ) {
        return false;
    }

    const pedidos =
        obtenerPedidosGuardados();

    const indice =
        pedidos.findIndex(
            pedido =>
                Number(pedido.id) ===
                Number(
                    pedidoActualizado.id
                )
        );

    if (indice === -1) {
        return false;
    }

    recalcularPedido(
        pedidoActualizado
    );

    pedidos[indice] =
        pedidoActualizado;

    return guardarPedidos(
        pedidos
    );
}

function obtenerPedidoPorId(id) {

    return obtenerPedidosGuardados()
        .find(
            pedido =>
                Number(pedido.id) ===
                Number(id)
        ) || null;
}

function eliminarPedido(id) {

    const pedidos =
        obtenerPedidosGuardados();

    const nuevosPedidos =
        pedidos.filter(
            pedido =>
                Number(pedido.id) !==
                Number(id)
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

function cerrarPedido(id) {

    const pedidos =
        obtenerPedidosGuardados();

    const pedido =
        pedidos.find(
            item =>
                Number(item.id) ===
                Number(id)
        );

    if (!pedido) {
        return false;
    }

    const fechaHora =
        obtenerFechaHora();

    pedido.estado =
        "cerrado";

    pedido.fechaCierre =
        fechaHora.fecha;

    pedido.horaCierre =
        fechaHora.hora;

    return guardarPedidos(
        pedidos
    );
}

function calcularVentasTotales() {

    return obtenerPedidosGuardados()
        .reduce(
            (total, pedido) =>
                total +
                Number(
                    pedido.total || 0
                ),
            0
        );
}

function obtenerPedidosDeHoy() {

    const hoy =
        new Date()
            .toLocaleDateString(
                "es-PE"
            );

    return obtenerPedidosGuardados()
        .filter(
            pedido =>
                pedido.fecha === hoy
        );
}

function calcularVentasDeHoy() {

    return obtenerPedidosDeHoy()
        .reduce(
            (total, pedido) =>
                total +
                Number(
                    pedido.total || 0
                ),
            0
        );
}