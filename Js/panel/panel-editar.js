function iniciarEdicionPedido(id) {

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

    console.log(
        "Pedido seleccionado para editar:",
        pedido
    );
}

function guardarEdicionPedido(
    pedidoActualizado
) {

    if (
        typeof actualizarPedido !==
        "function"
    ) {
        alert(
            "No se encontró actualizarPedido()."
        );

        return false;
    }

    const resultado =
        actualizarPedido(
            pedidoActualizado
        );

    if (resultado) {

        actualizarPanel();

        return true;
    }

    alert(
        "No se pudieron guardar los cambios."
    );

    return false;
}

