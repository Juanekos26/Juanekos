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
        pedidos.filter(
            pedido =>
                ![
                    "cerrado",
                    "cancelado"
                ].includes(
                    pedido.estado || "abierto"
                )
        );

    const pedidosCancelados =
        pedidos.filter(
            pedido =>
                pedido.estado === "cancelado"
        );

    const elementos = {
        ventasHoy:
            document.getElementById(
                "ventasHoy"
            ),

        pedidosHoy:
            document.getElementById(
                "pedidosHoy"
            ),

        ventasTotales:
            document.getElementById(
                "ventasTotales"
            ),

        pedidosTotales:
            document.getElementById(
                "pedidosTotales"
            ),

        pedidosPendientes:
            document.getElementById(
                "pedidosPendientes"
            ),

        pedidosCancelados:
            document.getElementById(
                "pedidosCancelados"
            )
    };

    if (elementos.ventasHoy) {
        elementos.ventasHoy.textContent =
            formatearPrecio(ventasHoy);
    }

    if (elementos.pedidosHoy) {
        elementos.pedidosHoy.textContent =
            pedidosHoy.length;
    }

    if (elementos.ventasTotales) {
        elementos.ventasTotales.textContent =
            formatearPrecio(ventasTotales);
    }

    if (elementos.pedidosTotales) {
        elementos.pedidosTotales.textContent =
            pedidos.length;
    }

    if (elementos.pedidosPendientes) {
        elementos.pedidosPendientes.textContent =
            pedidosPendientes.length;
    }

    if (elementos.pedidosCancelados) {
        elementos.pedidosCancelados.textContent =
            pedidosCancelados.length;
    }
}

