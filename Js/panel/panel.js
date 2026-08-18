/* ========================================
   PANEL PRINCIPAL
======================================== */


function actualizarPanel() {

    actualizarResumen();

    renderizarVentas();

}


/* ========================================
   CONFIGURACIÓN
======================================== */

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


    const cerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );


    /* ================================
       ACTUALIZAR
    ================================= */

    if (actualizar) {

        actualizar.addEventListener(
            "click",
            actualizarPanel
        );

    }


    /* ================================
       CERRAR DETALLE
    ================================= */

    if (cerrarDetalle) {

        cerrarDetalle.addEventListener(
            "click",
            cerrarDetallePedido
        );

    }


    /* ================================
       CERRAR EDITOR
    ================================= */

    if (cerrarEditor) {

        cerrarEditor.addEventListener(
            "click",
            cerrarEditorPedido
        );

    }


    /* ================================
       CANCELAR EDICIÓN
    ================================= */

    if (cancelarEdicion) {

        cancelarEdicion.addEventListener(
            "click",
            cerrarEditorPedido
        );

    }


    /* ================================
       GUARDAR
    ================================= */

    if (guardarCambios) {

        guardarCambios.addEventListener(
            "click",
            guardarCambiosPedido
        );

    }


    /* ================================
       SESIÓN
    ================================= */

    if (cerrarSesion) {

        cerrarSesion.addEventListener(
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


    configurarFiltrosVentas();

    actualizarPanel();

}


/* ========================================
   INICIAR
======================================== */

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