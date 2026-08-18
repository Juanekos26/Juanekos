let pedidoEstadoActual = null;

function abrirSelectorEstado(
    id
) {

    const pedido =
        obtenerPedidoPorId(id);

    if (!pedido) {

        alert(
            "No se encontró el pedido."
        );

        return;

    }

    pedidoEstadoActual =
        pedido;

    const selector =
        document.getElementById(
            "selectorEstado"
        );

    const numero =
        document.getElementById(
            "estadoPedidoNumero"
        );

    if (!selector) {
        return;
    }

    if (numero) {

        numero.textContent =
            pedido.id || "—";

    }

    selector.hidden =
        false;

    document.body.classList.add(
        "estado-abierto"
    );

    marcarEstadoActual(
        pedido.estado
    );

}

function marcarEstadoActual(
    estado
) {

    const opciones =
        document.querySelectorAll(
            ".estado-opcion"
        );

    const estadoActual =
        normalizarEstado(
            estado
        );

    opciones.forEach(
        opcion => {

            opcion.classList.toggle(
                "activo",
                opcion.dataset.estado ===
                estadoActual
            );

        }
    );

}

function cambiarEstadoPedido(
    nuevoEstado
) {

    if (!pedidoEstadoActual) {
        return;
    }

    const estado =
        normalizarEstado(
            nuevoEstado
        );

    const pedidoActualizado = {
        ...pedidoEstadoActual,
        estado: estado
    };

    const guardado =
        actualizarPedido(
            pedidoActualizado
        );

    if (!guardado) {

        alert(
            "No se pudo actualizar el estado."
        );

        return;

    }

    pedidoEstadoActual =
        pedidoActualizado;

    cerrarSelectorEstado();

    if (
        typeof actualizarPanel ===
        "function"
    ) {

        actualizarPanel();

    }

}

function cerrarSelectorEstado() {

    const selector =
        document.getElementById(
            "selectorEstado"
        );

    if (selector) {
        selector.hidden =
            true;
    }

    document.body.classList.remove(
        "estado-abierto"
    );

    pedidoEstadoActual =
        null;

}

function configurarEstados() {

    const opciones =
        document.querySelectorAll(
            ".estado-opcion"
        );

    opciones.forEach(
        opcion => {

            if (
                opcion.dataset.estadoConfigurado
            ) {
                return;
            }

            opcion.addEventListener(
                "click",
                () => {

                    cambiarEstadoPedido(
                        opcion.dataset.estado
                    );

                }
            );

            opcion.dataset.estadoConfigurado =
                "true";

        }
    );

    const cerrar =
        document.getElementById(
            "cerrarSelectorEstado"
        );

    if (cerrar) {

        cerrar.addEventListener(
            "click",
            cerrarSelectorEstado
        );

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        configurarEstados();

    }
);