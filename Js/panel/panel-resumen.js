/* ========================================
   RESUMEN DEL PANEL
======================================== */


function actualizarResumen() {

    const pedidos =
        obtenerPedidosPanel();


    const hoy =
        typeof obtenerPedidosDeHoy ===
        "function"
            ? obtenerPedidosDeHoy()
            : pedidos.filter(
                pedido =>
                    pedido.fecha ===
                    new Date().toLocaleDateString(
                        "es-PE"
                    )
            );


    const ventasHoy =
        hoy.reduce(
            (
                total,
                pedido
            ) =>
                total +
                Number(
                    pedido.total || 0
                ),
            0
        );


    const ventasTotales =
        pedidos.reduce(
            (
                total,
                pedido
            ) =>
                total +
                Number(
                    pedido.total || 0
                ),
            0
        );


    const pendientes =
        pedidos.filter(
            pedido => {

                const estado =
                    normalizarEstado(
                        pedido.estado
                    );

                return (
                    estado === "abierto" ||
                    estado === "preparacion"
                );

            }
        );


    const cancelados =
        pedidos.filter(
            pedido =>
                normalizarEstado(
                    pedido.estado
                ) === "cancelado"
        );


    const ventasHoyElemento =
        document.getElementById(
            "ventasHoy"
        );


    const pedidosHoyElemento =
        document.getElementById(
            "pedidosHoy"
        );


    const ventasTotalesElemento =
        document.getElementById(
            "ventasTotales"
        );


    const pedidosTotalesElemento =
        document.getElementById(
            "pedidosTotales"
        );


    const pendientesElemento =
        document.getElementById(
            "pedidosPendientes"
        );


    const canceladosElemento =
        document.getElementById(
            "pedidosCancelados"
        );


    if (ventasHoyElemento) {

        ventasHoyElemento.textContent =
            formatearPrecio(
                ventasHoy
            );

    }


    if (pedidosHoyElemento) {

        pedidosHoyElemento.textContent =
            hoy.length;

    }


    if (ventasTotalesElemento) {

        ventasTotalesElemento.textContent =
            formatearPrecio(
                ventasTotales
            );

    }


    if (pedidosTotalesElemento) {

        pedidosTotalesElemento.textContent =
            pedidos.length;

    }


    if (pendientesElemento) {

        pendientesElemento.textContent =
            pendientes.length;

    }


    if (canceladosElemento) {

        canceladosElemento.textContent =
            cancelados.length;

    }

}