async function cargarComponentesPanel() {

    const componentes = {
        panelResumen: "panel-resumen.html",
        panelEstadisticas: "panel-estadisticas.html",
        panelModoOperacion: "panel-modo-operacion.html",
        panelConfiguracion: "panel-configuracion.html",
        panelPedidos: "panel-pedidos.html",
        panelMenuDia: "panel-menu-dia.html",
        panelDetalle: "panel-detalle.html",
        panelEstado: "panel-estado.html",
        panelEditar: "panel-editar.html",
        panelProductos: "panel-productos.html"
    };

    for (const [contenedorId, archivo] of Object.entries(componentes)) {

        const contenedor = document.getElementById(contenedorId);

        if (!contenedor) {
            continue;
        }

        try {
            const respuesta = await fetch(archivo);

            if (!respuesta.ok) {
                throw new Error(`No se pudo cargar ${archivo}`);
            }

            contenedor.innerHTML = await respuesta.text();

        } catch (error) {
            console.error(`Error cargando ${archivo}:`, error);
        }
    }
}

function refrescarPanelPrincipal() {

    if (typeof actualizarResumen === "function") {
        actualizarResumen();
    }

    if (typeof renderizarVentas === "function") {
        renderizarVentas();
    }
    if (typeof renderizarPanelEstadisticas === "function") {
        renderizarPanelEstadisticas();
    }
}

function configurarPanel() {

    const actualizar = document.getElementById("btnActualizar");
    const cerrarDetalle = document.getElementById("cerrarDetalle");
    const cerrarEditor = document.getElementById("cerrarEditor");
    const cancelarEdicion = document.getElementById("btnCancelarEdicion");
    const guardarCambios = document.getElementById("btnGuardarCambios");
    const botonCerrarSesion = document.getElementById("btnCerrarSesion");
    const agregarProducto = document.getElementById("btnAgregarProducto");
    const cerrarProductos = document.getElementById("cerrarSelectorProductos");

    if (actualizar && !actualizar.dataset.configurado) {
        actualizar.addEventListener("click", refrescarPanelPrincipal);
        actualizar.dataset.configurado = "true";
    }

    if (cerrarDetalle && !cerrarDetalle.dataset.configurado) {
        cerrarDetalle.addEventListener("click", cerrarDetallePedido);
        cerrarDetalle.dataset.configurado = "true";
    }

    if (cerrarEditor && !cerrarEditor.dataset.configurado) {
        cerrarEditor.addEventListener("click", cerrarEditorPedido);
        cerrarEditor.dataset.configurado = "true";
    }

    if (cancelarEdicion && !cancelarEdicion.dataset.configurado) {
        cancelarEdicion.addEventListener("click", cerrarEditorPedido);
        cancelarEdicion.dataset.configurado = "true";
    }

    if (guardarCambios && !guardarCambios.dataset.configurado) {
        guardarCambios.addEventListener("click", guardarCambiosPedido);
        guardarCambios.dataset.configurado = "true";
    }

    if (botonCerrarSesion && !botonCerrarSesion.dataset.configurado) {
        botonCerrarSesion.addEventListener("click", () => {
            if (typeof cerrarSesion === "function") {
                cerrarSesion();
            }
        });
        botonCerrarSesion.dataset.configurado = "true";
    }

    if (agregarProducto && !agregarProducto.dataset.configurado) {
        agregarProducto.addEventListener("click", abrirSelectorProductos);
        agregarProducto.dataset.configurado = "true";
    }

    if (cerrarProductos && !cerrarProductos.dataset.configurado) {
        cerrarProductos.addEventListener("click", cerrarSelectorProductos);
        cerrarProductos.dataset.configurado = "true";
    }

    if (typeof configurarEstados === "function") {
        configurarEstados();
    }

    if (typeof configurarFiltrosVentas === "function") {
        configurarFiltrosVentas();
    }

    if (typeof configurarFiltrosProductos === "function") {
        configurarFiltrosProductos();
    }

    if (typeof configurarRespaldoVentas === "function") {
        configurarRespaldoVentas();
    }

    if (typeof configurarMenuDiaAdmin === "function") {
        configurarMenuDiaAdmin();
    }

    if (typeof configurarModoOperacionAdmin === "function") {
        configurarModoOperacionAdmin();
    }

    if (typeof configurarPanelPreferencias === "function") {
        configurarPanelPreferencias();
    }

    refrescarPanelPrincipal();

    const irPedidos = document.getElementById("btnIrPedidos");
    if (irPedidos && !irPedidos.dataset.configurado) {
        irPedidos.addEventListener("click", () => {
            document.getElementById("panelPedidos")?.scrollIntoView({ behavior: "smooth", block: "start" });
        });
        irPedidos.dataset.configurado = "true";
    }

    const reloj = document.getElementById("adminReloj");
    if (reloj) {
        const pintarReloj = () => {
            reloj.textContent = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true });
        };
        pintarReloj();
        setInterval(pintarReloj, 30000);
    }
}

document.addEventListener("DOMContentLoaded", async () => {
    if (typeof verificarAdministradorSesion === "function") {
        const autorizado = await verificarAdministradorSesion();
        if (!autorizado) return;
    }
    if (typeof window.juanekosCargarModoOperacion === "function") await window.juanekosCargarModoOperacion();
    if (typeof cargarCatalogoSupabase === "function") await cargarCatalogoSupabase();
    if (typeof cargarPedidosSupabaseAdmin === "function") await cargarPedidosSupabaseAdmin();
    if (typeof cargarMenuDiaSupabase === "function") await cargarMenuDiaSupabase(fechaISOJuanekos(), true);
    await cargarComponentesPanel();
    configurarPanel();
});
