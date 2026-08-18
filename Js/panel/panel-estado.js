/* ========================================
   ESTADOS DE PEDIDOS
======================================== */


function cambiarEstadoPedidoPanel(id) {

    const pedido =
        buscarPedidoPanel(id);


    if (!pedido) {

        mostrarMensaje(
            "No se encontró el pedido."
        );

        return;

    }


    const estadoActual =
        normalizarEstado(
            pedido.estado
        );


    if (
        estadoActual === "cerrado" ||
        estadoActual === "cancelado"
    ) {

        mostrarMensaje(
            "Este pedido ya no puede cambiar de estado."
        );

        return;

    }


    const opciones = `
        Selecciona el nuevo estado:

        1. ABIERTO
        2. EN PREPARACIÓN
        3. LISTO
        4. CERRADO
        5. CANCELADO
    `;


    const seleccion =
        window.prompt(
            opciones,
            "1"
        );


    if (seleccion === null) {
        return;
    }


    const estados = {

        "1":
            "abierto",

        "2":
            "preparacion",

        "3":
            "listo",

        "4":
            "cerrado",

        "5":
            "cancelado"

    };


    const nuevoEstado =
        estados[
            seleccion.trim()
        ];


    if (!nuevoEstado) {

        mostrarMensaje(
            "Estado no válido."
        );

        return;

    }


    if (
        nuevoEstado ===
        "cancelado"
    ) {

        cancelarPedidoPanel(
            id
        );

        return;

    }


    if (
        nuevoEstado ===
        "cerrado"
    ) {

        cerrarPedidoPanel(
            id
        );

        return;

    }


    pedido.estado =
        nuevoEstado;


    if (
        typeof actualizarPedido !==
        "function"
    ) {

        mostrarMensaje(
            "No se encontró actualizarPedido()."
        );

        return;

    }


    const resultado =
        actualizarPedido(
            pedido
        );


    if (!resultado) {

        mostrarMensaje(
            "No se pudo actualizar el estado."
        );

        return;

    }


    actualizarPanel();


    if (
        typeof mostrarDetallePedido ===
        "function"
    ) {

        mostrarDetallePedido(
            id
        );

    }

}


/* ========================================
   CANCELAR PEDIDO
======================================== */

function cancelarPedidoPanel(id) {

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


    if (
        estado === "cancelado"
    ) {

        mostrarMensaje(
            "Este pedido ya está cancelado."
        );

        return;

    }


    if (
        estado === "cerrado"
    ) {

        mostrarMensaje(
            "Un pedido cerrado no puede cancelarse."
        );

        return;

    }


    const confirmar =
        confirmarAccion(
            `¿Deseas cancelar el pedido #${pedido.id}?`
        );


    if (!confirmar) {
        return;
    }


    pedido.estado =
        "cancelado";


    pedido.fechaCancelacion =
        new Date()
            .toLocaleDateString(
                "es-PE"
            );


    pedido.horaCancelacion =
        new Date()
            .toLocaleTimeString(
                "es-PE",
                {
                    hour: "2-digit",
                    minute: "2-digit",
                    hour12: true
                }
            );


    if (
        typeof actualizarPedido !==
        "function"
    ) {

        mostrarMensaje(
            "No se encontró actualizarPedido()."
        );

        return;

    }


    const resultado =
        actualizarPedido(
            pedido
        );


    if (!resultado) {

        mostrarMensaje(
            "No se pudo cancelar el pedido."
        );

        return;

    }


    actualizarPanel();


    if (
        typeof mostrarDetallePedido ===
        "function"
    ) {

        mostrarDetallePedido(
            id
        );

    }

}

