async function cargarComponentesPanel() {

    const componentes = {
        panelResumen: "panel-resumen.html",
        panelPedidos: "panel-pedidos.html",
        panelDetalle: "panel-detalle.html",
        panelEstado: "panel-estado.html",
        panelEditar: "panel-editar.html",
        panelProductos: "panel-productos.html"
    };

    for (
        const [contenedorId, archivo] of
        Object.entries(componentes)
    ) {

        const contenedor =
            document.getElementById(
                contenedorId
            );

        if (!contenedor) {
            continue;
        }

        try {

            const respuesta =
                await fetch(archivo);

            if (!respuesta.ok) {

                throw new Error(
                    `No se pudo cargar ${archivo}`
                );

            }

            contenedor.innerHTML =
                await respuesta.text();

        } catch (error) {

            console.error(
                `Error cargando ${archivo}:`,
                error
            );

        }

    }

}


function actualizarPanel() {

    if (
        typeof actualizarResumen ===
        "function"
    ) {

        actualizarResumen();

    }

    if (
        typeof renderizarVentas ===
        "function"
    ) {

        renderizarVentas();

    }

}


function configurarPanel() {

    const actualizar =
        document.getElementById(
            "btnActualizar"
        );

    const cerrarDetalle =
        document.getElementById(
            "cerrarDetalle"
        );

    const cerrarEditor =
        document.getElementById(
            "cerrarEditor"
        );

    const cancelarEdicion =
        document.getElementById(
            "btnCancelarEdicion"
        );

    const guardarCambios =
        document.getElementById(
            "btnGuardarCambios"
        );

    const botonCerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );


    if (actualizar) {

        actualizar.addEventListener(
            "click",
            actualizarPanel
        );

    }


    if (cerrarDetalle) {

        cerrarDetalle.addEventListener(
            "click",
            cerrarDetallePedido
        );

    }


    if (cerrarEditor) {

        cerrarEditor.addEventListener(
            "click",
            cerrarEditorPedido
        );

    }


    if (cancelarEdicion) {

        cancelarEdicion.addEventListener(
            "click",
            cerrarEditorPedido
        );

    }


    if (guardarCambios) {

        guardarCambios.addEventListener(
            "click",
            guardarCambiosPedido
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


    if (
        typeof configurarFiltrosVentas ===
        "function"
    ) {

        configurarFiltrosVentas();

    }


    actualizarPanel();

}


document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await cargarComponentesPanel();

        configurarPanel();

    }
);