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
        const [contenedorId, archivo]
        of Object.entries(componentes)
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


/* ========================================
   ACTUALIZAR PANEL
======================================== */

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


    if (
        typeof actualizarPanelEstado ===
        "function"
    ) {

        actualizarPanelEstado();

    }

}


/* ========================================
   CONFIGURAR PANEL
======================================== */

function configurarPanel() {


    /* ------------------------------------
       ACTUALIZAR
    ------------------------------------ */

    const actualizar =
        document.getElementById(
            "btnActualizar"
        );


    if (
        actualizar &&
        !actualizar.dataset.configurado
    ) {

        actualizar.addEventListener(
            "click",
            actualizarPanel
        );

        actualizar.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       CERRAR DETALLE
    ------------------------------------ */

    const cerrarDetalle =
        document.getElementById(
            "cerrarDetalle"
        );


    if (
        cerrarDetalle &&
        !cerrarDetalle.dataset.configurado
    ) {

        cerrarDetalle.addEventListener(
            "click",
            cerrarDetallePedido
        );

        cerrarDetalle.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       CERRAR EDITOR
    ------------------------------------ */

    const cerrarEditor =
        document.getElementById(
            "cerrarEditor"
        );


    if (
        cerrarEditor &&
        !cerrarEditor.dataset.configurado
    ) {

        cerrarEditor.addEventListener(
            "click",
            cerrarEditorPedido
        );

        cerrarEditor.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       CANCELAR EDICIÓN
    ------------------------------------ */

    const cancelarEdicion =
        document.getElementById(
            "btnCancelarEdicion"
        );


    if (
        cancelarEdicion &&
        !cancelarEdicion.dataset.configurado
    ) {

        cancelarEdicion.addEventListener(
            "click",
            cerrarEditorPedido
        );

        cancelarEdicion.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       GUARDAR CAMBIOS
    ------------------------------------ */

    const guardarCambios =
        document.getElementById(
            "btnGuardarCambios"
        );


    if (
        guardarCambios &&
        !guardarCambios.dataset.configurado
    ) {

        guardarCambios.addEventListener(
            "click",
            guardarCambiosPedido
        );

        guardarCambios.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       CERRAR SESIÓN
    ------------------------------------ */

    const botonCerrarSesion =
        document.getElementById(
            "btnCerrarSesion"
        );


    if (
        botonCerrarSesion &&
        !botonCerrarSesion.dataset.configurado
    ) {

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

        botonCerrarSesion.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       AGREGAR PRODUCTO
    ------------------------------------ */

    const agregarProducto =
        document.getElementById(
            "btnAgregarProducto"
        );


    if (
        agregarProducto &&
        !agregarProducto.dataset.configurado
    ) {

        agregarProducto.addEventListener(
            "click",
            abrirSelectorProductos
        );

        agregarProducto.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       CERRAR SELECTOR PRODUCTOS
    ------------------------------------ */

    const cerrarProductos =
        document.getElementById(
            "cerrarSelectorProductos"
        );


    if (
        cerrarProductos &&
        !cerrarProductos.dataset.configurado
    ) {

        cerrarProductos.addEventListener(
            "click",
            cerrarSelectorProductos
        );

        cerrarProductos.dataset.configurado =
            "true";

    }


    /* ------------------------------------
       ESTADOS
    ------------------------------------ */

    if (
        typeof configurarEstados ===
        "function"
    ) {

        configurarEstados();

    }


    /* ------------------------------------
       FILTROS DE VENTAS
    ------------------------------------ */

    if (
        typeof configurarFiltrosVentas ===
        "function"
    ) {

        configurarFiltrosVentas();

    }


    /* ------------------------------------
       FILTROS DE PRODUCTOS
    ------------------------------------ */

    if (
        typeof configurarFiltrosProductos ===
        "function"
    ) {

        configurarFiltrosProductos();

    }


    /* ------------------------------------
       ACTUALIZAR
    ------------------------------------ */

    actualizarPanel();

}


/* ========================================
   INICIAR PANEL
======================================== */

document.addEventListener(
    "DOMContentLoaded",
    async () => {

        await cargarComponentesPanel();

        configurarPanel();

    }
);