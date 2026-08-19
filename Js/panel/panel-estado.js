let pedidoEstadoActual = null;

function cambiarEstadoPedidoPanel(id) {

    const pedido = buscarPedidoPanel(id);

    if (!pedido) {
        mostrarMensaje("No se encontró el pedido.");
        return;
    }

    const estadoActual = normalizarEstado(pedido.estado);

    if (estadoActual === "cerrado" || estadoActual === "cancelado") {
        mostrarMensaje("Este pedido ya no puede cambiar de estado.");
        return;
    }

    const selector = document.getElementById("selectorEstadoPedido");
    const select = document.getElementById("nuevoEstadoPedido");
    const numero = document.getElementById("estadoPedidoNumero");

    if (!selector || !select) {
        mostrarMensaje("No se encontró el selector de estado.");
        return;
    }

    pedidoEstadoActual = pedido;

    select.value = ["inicio", "pendiente", "listo", "cerrado", "cancelado"].includes(estadoActual)
        ? estadoActual
        : "inicio";

    if (numero) {
        numero.textContent = `#${pedido.id}`;
    }

    selector.hidden = false;

    selector.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });
}

async function guardarEstadoPedido() {

    if (!pedidoEstadoActual) {
        mostrarMensaje("No hay ningún pedido seleccionado.");
        return;
    }

    const select = document.getElementById("nuevoEstadoPedido");

    if (!select) {
        return;
    }

    const nuevoEstado = normalizarEstado(select.value);
    const estadoAnterior = normalizarEstado(pedidoEstadoActual.estado);

    if (!["inicio", "pendiente", "listo", "cerrado", "cancelado"].includes(nuevoEstado)) {
        mostrarMensaje("Estado no válido.");
        return;
    }

    if (nuevoEstado === estadoAnterior) {
        cerrarSelectorEstado();
        return;
    }

    if (!await confirmarAccion(
        `¿Deseas cambiar el estado del pedido #${pedidoEstadoActual.id} a ${nuevoEstado.toUpperCase()}?`,
        { aceptar: "Cambiar estado" }
    )) {
        return;
    }

    const pedidoActualizado = {
        ...pedidoEstadoActual,
        estado: nuevoEstado
    };

    if (nuevoEstado === "cerrado") {

        const fechaHora = obtenerFechaHora();

        pedidoActualizado.fechaCierre = fechaHora.fecha;
        pedidoActualizado.horaCierre = fechaHora.hora;

    } else if (estadoAnterior === "cerrado") {

        delete pedidoActualizado.fechaCierre;
        delete pedidoActualizado.horaCierre;

    }

    try {
        await persistirPedidoAdmin(pedidoActualizado);
        const pedidos = obtenerPedidosPanel();
        const indice = pedidos.findIndex(p => String(p.uuid || p.id) === String(pedidoActualizado.uuid || pedidoActualizado.id));
        if (indice >= 0) pedidos[indice] = pedidoActualizado;
        guardarCachePedidosPanel(pedidos);
    } catch (error) {
        console.error(error);
        mostrarMensaje("No se pudo actualizar el estado en Supabase.", "error");
        return;
    }

    const id = pedidoActualizado.id;

    cerrarSelectorEstado();

    actualizarPanel();

    mostrarMensaje(
        `El pedido #${id} ahora está ${nuevoEstado.toUpperCase()}.`
    );

    if (typeof mostrarDetallePedido === "function") {
        mostrarDetallePedido(id);
    }
}

function cerrarSelectorEstado() {

    const selector = document.getElementById("selectorEstadoPedido");

    if (selector) {
        selector.hidden = true;
    }

    pedidoEstadoActual = null;
}

function configurarEstados() {

    const guardar = document.getElementById("btnGuardarEstado");
    const cancelar = document.getElementById("btnCancelarCambioEstado");
    const cerrar = document.getElementById("cerrarSelectorEstado");

    if (guardar && !guardar.dataset.estadoConfigurado) {
        guardar.addEventListener("click", guardarEstadoPedido);
        guardar.dataset.estadoConfigurado = "true";
    }

    if (cancelar && !cancelar.dataset.estadoConfigurado) {
        cancelar.addEventListener("click", cerrarSelectorEstado);
        cancelar.dataset.estadoConfigurado = "true";
    }

    if (cerrar && !cerrar.dataset.estadoConfigurado) {
        cerrar.addEventListener("click", cerrarSelectorEstado);
        cerrar.dataset.estadoConfigurado = "true";
    }
}

document.addEventListener("DOMContentLoaded", configurarEstados);
