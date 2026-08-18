let pedidoEstadoActual = null;


/* ========================================
   ABRIR SELECTOR DE ESTADO
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

    pedidoEstadoActual =
        pedido;


    const selector =
        document.getElementById(
            "selectorEstadoPedido"
        );

    const select =
        document.getElementById(
            "nuevoEstadoPedido"
        );

    if (!selector || !select) {
        return;
    }


    select.value =
        estadoActual;


    selector.hidden =
        false;


    selector.scrollIntoView({
        behavior: "smooth",
        block: "nearest"
    });

}


/* ========================================
   GUARDAR ESTADO
======================================== */

function guardarEstadoPedido() {

    if (!pedidoEstadoActual) {

        mostrarMensaje(
            "No hay ningún pedido seleccionado."
        );

        return;

    }


    const select =
        document.getElementById(
            "nuevoEstadoPedido"
        );


    if (!select) {
        return;
    }


    const nuevoEstado =
        normalizarEstado(
            select.value
        );


    if (
        nuevoEstado !== "pendiente" &&
        nuevoEstado !== "cerrado" &&
        nuevoEstado !== "cancelado"
    ) {

        mostrarMensaje(
            "Estado no válido."
        );

        return;

    }


    if (
        nuevoEstado ===
        normalizarEstado(
            pedidoEstadoActual.estado
        )
    ) {

        cerrarSelectorEstado();

        return;

    }


    const confirmar =
        confirmarAccion(
            `¿Deseas cambiar el estado del pedido #${pedidoEstadoActual.id} a ${nuevoEstado.toUpperCase()}?`
        );


    if (!confirmar) {
        return;
    }


    const pedidoActualizado = {
        ...pedidoEstadoActual,
        estado: nuevoEstado
    };


    if (nuevoEstado === "cerrado") {

        const ahora =
            new Date();

        pedidoActualizado.fechaCierre =
            ahora.toLocaleDateString(
                "es-PE",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );

        pedidoActualizado.horaCierre =
            ahora.toLocaleTimeString(
                "es-PE",
                {
                    hour: "2-digit",
                    minute: "2-digit"
                }
            );

    }


    const guardado =
        actualizarPedido(
            pedidoActualizado
        );


    if (!guardado) {

        mostrarMensaje(
            "No se pudo actualizar el estado."
        );

        return;

    }


    cerrarSelectorEstado();


    mostrarMensaje(
        `El pedido #${pedidoEstadoActual.id} ahora está ${nuevoEstado.toUpperCase()}.`
    );


    actualizarPanel();


    if (
        typeof mostrarDetallePedido ===
        "function"
    ) {

        mostrarDetallePedido(
            pedidoActualizado.id
        );

    }

}


/* ========================================
   CERRAR SELECTOR
======================================== */

function cerrarSelectorEstado() {

    const selector =
        document.getElementById(
            "selectorEstadoPedido"
        );


    if (selector) {

        selector.hidden =
            true;

    }


    pedidoEstadoActual =
        null;

}


/* ========================================
   CONFIGURAR BOTONES
======================================== */

function configurarEstados() {

    const guardar =
        document.getElementById(
            "btnGuardarEstado"
        );


    const cancelar =
        document.getElementById(
            "btnCancelarCambioEstado"
        );


    if (
        guardar &&
        !guardar.dataset.estadoConfigurado
    ) {

        guardar.addEventListener(
            "click",
            guardarEstadoPedido
        );

        guardar.dataset.estadoConfigurado =
            "true";

    }


    if (
        cancelar &&
        !cancelar.dataset.estadoConfigurado
    ) {

        cancelar.addEventListener(
            "click",
            cerrarSelectorEstado
        );

        cancelar.dataset.estadoConfigurado =
            "true";

    }

}


/* ========================================
   INICIALIZAR
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarEstados();

    }
);