function limpiarFiltros() {

    const buscador =
        document.getElementById(
            "buscarPedido"
        );

    const fecha =
        document.getElementById(
            "filtroFecha"
        );

    const estado =
        document.getElementById(
            "filtroEstado"
        );

    if (buscador) {
        buscador.value = "";
    }

    if (fecha) {
        fecha.value = "";
    }

    if (estado) {
        estado.value = "";
    }

    renderizarVentas();
}

function actualizarPanel() {

    actualizarResumen();

    renderizarVentas();
}

function configurarPanel() {

    const botonActualizar =
        document.getElementById(
            "btnActualizar"
        );

    const filtroFecha =
        document.getElementById(
            "filtroFecha"
        );

    const filtroEstado =
        document.getElementById(
            "filtroEstado"
        );

    const buscador =
        document.getElementById(
            "buscarPedido"
        );

    const botonLimpiarFiltros =
        document.getElementById(
            "btnLimpiarFiltros"
        );

    const botonCerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );

    const botonCerrarDetalle =
        document.getElementById(
            "cerrarDetalle"
        );

    if (botonActualizar) {

        botonActualizar.addEventListener(
            "click",
            actualizarPanel
        );
    }

    if (filtroFecha) {

        filtroFecha.addEventListener(
            "change",
            renderizarVentas
        );
    }

    if (filtroEstado) {

        filtroEstado.addEventListener(
            "change",
            renderizarVentas
        );
    }

    if (buscador) {

        buscador.addEventListener(
            "input",
            renderizarVentas
        );
    }

    if (botonLimpiarFiltros) {

        botonLimpiarFiltros.addEventListener(
            "click",
            limpiarFiltros
        );
    }

    if (botonCerrarSesion) {

        botonCerrarSesion.addEventListener(
            "click",
            () => {

                if (
                    typeof cerrarSesion ===
                    "function"
                ) {
                    cerrarSesion();
                }
            }
        );
    }

    if (botonCerrarDetalle) {

        botonCerrarDetalle.addEventListener(
            "click",
            cerrarDetallePedido
        );
    }

    actualizarPanel();
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.getElementById(
                "listaVentas"
            )
        ) {
            configurarPanel();
        }

    }
);