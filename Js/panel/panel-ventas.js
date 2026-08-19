/* ========================================
   GESTIÓN DE VENTAS / PEDIDOS
======================================== */

function obtenerPedidosFiltrados() {

    let pedidos =
        obtenerPedidosPanel();


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


    const fechaSeleccionada =
        filtroFecha?.value || "";


    const estadoSeleccionado =
        filtroEstado?.value || "";


    const textoBusqueda =
        buscador?.value
            ?.trim()
            .toLowerCase() || "";


    if (fechaSeleccionada) {
        pedidos = pedidos.filter(pedido => {
            if (typeof fechaPedidoCoincide === "function") {
                return fechaPedidoCoincide(pedido, fechaSeleccionada);
            }

            const fecha = convertirFechaFiltro(fechaSeleccionada);
            return String(pedido.fecha || "") === fecha;
        });
    }


    if (estadoSeleccionado) {

        pedidos =
            pedidos.filter(
                pedido =>
                    normalizarEstado(
                        pedido.estado
                    ) === estadoSeleccionado
            );

    }


    if (textoBusqueda) {

        pedidos =
            pedidos.filter(
                pedido => {

                    const id =
                        String(
                            pedido.id || ""
                        ).toLowerCase();


                    const cliente =
                        String(
                            pedido.cliente || ""
                        ).toLowerCase();


                    const mesa =
                        String(
                            pedido.mesa || ""
                        ).toLowerCase();


                    const productos =
                        Array.isArray(
                            pedido.productos
                        )
                            ? pedido.productos
                                .map(
                                    producto =>
                                        producto.nombre || ""
                                )
                                .join(" ")
                                .toLowerCase()
                            : "";


                    return (
                        id.includes(
                            textoBusqueda
                        ) ||
                        cliente.includes(
                            textoBusqueda
                        ) ||
                        mesa.includes(
                            textoBusqueda
                        ) ||
                        productos.includes(
                            textoBusqueda
                        )
                    );

                }
            );

    }


    return pedidos;

}


/* ========================================
   FILA DEL PEDIDO
======================================== */

function generarFilaPedido(pedido) {

    const estado =
        normalizarEstado(
            pedido.estado
        );


    const bloqueado =
        estado === "cerrado" ||
        estado === "cancelado";


    return `
        <tr>

            <td>
                <strong>
                    #${escaparHTML(pedido.id)}
                </strong>
            </td>


            <td>
                ${escaparHTML(
                    pedido.fecha || "-"
                )}
            </td>


            <td>
                ${escaparHTML(
                    pedido.hora || "-"
                )}
            </td>


            <td>
                ${escaparHTML(
                    pedido.cliente || "Sin nombre"
                )}
            </td>


            <td>
                <strong>
                    ${escaparHTML(
                        pedido.mesa || "-"
                    )}
                </strong>
            </td>


            <td>
                <strong>
                    ${formatearPrecio(
                        typeof obtenerTotalPedido === "function" ? obtenerTotalPedido(pedido) : pedido.total
                    )}
                </strong>
            </td>


            <td>

                <div class="acciones-pedido">

                    <button
                        type="button"
                        class="btn-ver-pedido"
                        data-accion="ver"
                        data-id="${escaparHTML(
                            pedido.id
                        )}"
                    >
                        Ver
                    </button>


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-editar-pedido-tabla"
                                    data-accion="editar"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Editar
                                </button>
                            `
                            : ""
                    }


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-estado-pedido-tabla"
                                    data-accion="estado"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Estado
                                </button>
                            `
                            : ""
                    }


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-cerrar-pedido"
                                    data-accion="cerrar"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Cerrar
                                </button>
                            `
                            : ""
                    }


                    ${
                        !bloqueado
                            ? `
                                <button
                                    type="button"
                                    class="btn-cancelar-pedido-tabla"
                                    data-accion="cancelar"
                                    data-id="${escaparHTML(
                                        pedido.id
                                    )}"
                                >
                                    Cancelar
                                </button>
                            `
                            : ""
                    }


                    <button
                        type="button"
                        class="btn-imprimir-pedido-tabla"
                        data-accion="imprimir"
                        data-id="${escaparHTML(pedido.id)}"
                        aria-label="Imprimir pedido ${escaparHTML(pedido.id)}"
                    >
                        Imprimir
                    </button>

                    <button
                        type="button"
                        class="btn-eliminar-pedido-tabla"
                        data-accion="eliminar"
                        data-id="${escaparHTML(pedido.id)}"
                        aria-label="Eliminar pedido ${escaparHTML(pedido.id)}"
                    >
                        Eliminar
                    </button>

                    ${generarEstadoHTML(
                        estado
                    )}

                </div>

            </td>

        </tr>
    `;

}


/* ========================================
   RENDERIZAR
======================================== */

function renderizarVentas() {

    const contenedor =
        document.getElementById(
            "listaVentas"
        );


    if (!contenedor) {
        return;
    }


    const pedidos =
        obtenerPedidosFiltrados();


    if (!pedidos.length) {

        contenedor.innerHTML = `
            <tr>
                <td
                    colspan="7"
                    class="sin-ventas"
                >
                    No se encontraron pedidos.
                </td>
            </tr>
        `;

        return;

    }


    const ordenados =
        [...pedidos].sort(
            (a, b) =>
                Number(
                    b.timestamp || 0
                ) -
                Number(
                    a.timestamp || 0
                )
        );


    contenedor.innerHTML =
        ordenados
            .map(
                generarFilaPedido
            )
            .join("");


    configurarAccionesPedidos();

}


/* ========================================
   ACCIONES
======================================== */

function configurarAccionesPedidos() {

    const botones =
        document.querySelectorAll(
            "[data-accion]"
        );


    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const accion =
                        boton.dataset.accion;


                    const id =
                        boton.dataset.id;


                    if (accion === "ver") {

                        if (
                            typeof mostrarDetallePedido ===
                            "function"
                        ) {

                            mostrarDetallePedido(id);

                        }

                        return;
                    }


                    if (accion === "editar") {

                        if (
                            typeof editarPedidoPanel ===
                            "function"
                        ) {

                            editarPedidoPanel(id);

                        }

                        return;
                    }


                    if (accion === "estado") {

                        if (
                            typeof cambiarEstadoPedidoPanel ===
                            "function"
                        ) {

                            cambiarEstadoPedidoPanel(id);

                        }

                        return;
                    }


                    if (accion === "cerrar") {

                        cerrarPedidoPanel(id);

                        return;
                    }


                    if (accion === "cancelar") {

                        if (
                            typeof cancelarPedidoPanel ===
                            "function"
                        ) {

                            cancelarPedidoPanel(id);

                        }

                        return;
                    }

                    if (accion === "imprimir") {
                        const pedido = buscarPedidoPanel(id);
                        if (pedido && typeof imprimirPedidoPanel === "function") {
                            imprimirPedidoPanel(pedido);
                        } else {
                            mostrarMensaje("No se pudo preparar la impresión.", "error");
                        }
                        return;
                    }

                    if (accion === "eliminar") {
                        eliminarPedidoPanel(id);
                        return;
                    }

                }
            );

        }
    );

}


/* ========================================
   CERRAR PEDIDO
======================================== */

async function cerrarPedidoPanel(id) {

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


    if (estado === "cerrado") {

        mostrarMensaje(
            "Este pedido ya está cerrado."
        );

        return;

    }


    if (estado === "cancelado") {

        mostrarMensaje(
            "Un pedido cancelado no puede cerrarse."
        );

        return;

    }


    const confirmar =
        await confirmarAccion(
            `¿Deseas cerrar el pedido #${pedido.id}?`
        );


    if (!confirmar) {
        return;
    }


    if (
        typeof cerrarPedido !==
        "function"
    ) {

        mostrarMensaje(
            "No se encontró cerrarPedido()."
        );

        return;

    }


    const resultado =
        cerrarPedido(id);


    if (!resultado) {

        mostrarMensaje(
            "No se pudo cerrar el pedido."
        );

        return;

    }


    mostrarMensaje(
        `Pedido #${pedido.id} cerrado correctamente.`
    );


    actualizarPanel();


    if (
        typeof mostrarDetallePedido ===
        "function"
    ) {

        mostrarDetallePedido(id);

    }

}


/* ========================================
   LIMPIAR FILTROS
======================================== */

function limpiarFiltrosPedidos() {

    const fecha =
        document.getElementById(
            "filtroFecha"
        );


    const estado =
        document.getElementById(
            "filtroEstado"
        );


    const buscador =
        document.getElementById(
            "buscarPedido"
        );


    if (fecha) {
        fecha.value = "";
    }


    if (estado) {
        estado.value = "";
    }


    if (buscador) {
        buscador.value = "";
    }


    renderizarVentas();

}


/* ========================================
   EVENTOS
======================================== */

function configurarFiltrosVentas() {

    const fecha =
        document.getElementById(
            "filtroFecha"
        );


    const estado =
        document.getElementById(
            "filtroEstado"
        );


    const buscador =
        document.getElementById(
            "buscarPedido"
        );


    const limpiar =
        document.getElementById(
            "btnLimpiarFiltros"
        );


    if (fecha) {

        fecha.addEventListener(
            "change",
            renderizarVentas
        );

    }


    if (estado) {

        estado.addEventListener(
            "change",
            renderizarVentas
        );

    }


    if (buscador) {

        buscador.addEventListener(
            "input",
            typeof debouncePanel === "function" ? debouncePanel(renderizarVentas, 150) : renderizarVentas
        );

    }


    if (limpiar) {

        limpiar.addEventListener(
            "click",
            limpiarFiltrosPedidos
        );

    }

}

/* ========================================
   ELIMINAR / RESPALDAR / IMPORTAR
======================================== */
async function eliminarPedidoPanel(id) {
    const pedido = buscarPedidoPanel(id);
    if (!pedido) return mostrarMensaje("No se encontró el pedido.", "error");
    const ok = await confirmarAccion(`¿Eliminar definitivamente el pedido #${id}? Esta acción no se puede deshacer.`, {
        titulo: "Eliminar pedido",
        aceptar: "Eliminar"
    });
    if (!ok) return;
    const nuevos = obtenerPedidosPanel().filter(p => Number(p.id) !== Number(id));
    if (!guardarPedidosPanel(nuevos)) return mostrarMensaje("No se pudo eliminar el pedido.", "error");
    cerrarDetallePedido?.();
    actualizarPanel();
    mostrarMensaje(`Pedido #${id} eliminado.`, "exito");
}

function construirRespaldoJuanekos() {
    const pedidos = obtenerPedidosPanel();
    const ventasValidas = pedidos.filter(p => !pedidoEstaCancelado(p));
    return {
        formato: "juanekos-backup",
        version: 2,
        exportadoEn: new Date().toISOString(),
        resumen: {
            pedidos: pedidos.length,
            ventas: Number(ventasValidas.reduce((s,p)=>s+obtenerTotalPedido(p),0).toFixed(2)),
            pendientes: pedidos.filter(pedidoEstaPendiente).length,
            cerrados: pedidos.filter(pedidoEstaCerrado).length,
            cancelados: pedidos.filter(pedidoEstaCancelado).length
        },
        pedidos,
        menuDelDia: typeof obtenerMenuDiaGuardado === "function" ? obtenerMenuDiaGuardado() : []
    };
}

function exportarDatosJSON() {
    const respaldo = construirRespaldoJuanekos();
    const blob = new Blob([JSON.stringify(respaldo, null, 2)], { type: "application/json;charset=utf-8" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    const fecha = new Date().toISOString().slice(0,10);
    a.href = url;
    a.download = `juanekos-ventas-${fecha}.json`;
    document.body.appendChild(a);
    a.click();
    a.remove();
    URL.revokeObjectURL(url);
    mostrarMensaje("Respaldo JSON generado correctamente.", "exito");
}

async function importarDatosJSON(archivo) {
    if (!archivo) return;
    try {
        const texto = await archivo.text();
        const json = JSON.parse(texto);
        const importados = Array.isArray(json) ? json : json?.pedidos;
        if (!Array.isArray(importados)) throw new Error("El archivo no contiene una lista de pedidos válida.");

        const ok = await confirmarAccion(`Se importarán ${importados.length} pedidos. Si un ID ya existe, se actualizará con la versión importada.`, {
            titulo: "Importar respaldo",
            aceptar: "Importar"
        });
        if (!ok) return;

        const mapa = new Map(obtenerPedidosPanel().map(p => [String(p.id), p]));
        importados.forEach((p, i) => {
            const id = p?.id ?? p?.numero ?? `importado-${Date.now()}-${i}`;
            mapa.set(String(id), { ...p, id: p?.id ?? id });
        });
        const combinados = [...mapa.values()];
        if (!guardarPedidosPanel(combinados)) throw new Error("El navegador no permitió guardar los datos.");

        let cantidadMenu = 0;
        if (Array.isArray(json?.menuDelDia) && typeof guardarMenuDiaGuardado === "function") {
            const mapaMenu = new Map((typeof obtenerMenuDiaGuardado === "function" ? obtenerMenuDiaGuardado() : []).map(item => [String(item.id), item]));
            json.menuDelDia.forEach((item, i) => {
                const id = item?.id ?? `menu-${Date.now()}-${i}`;
                mapaMenu.set(String(id), { ...item, id });
            });
            const menuCombinado = [...mapaMenu.values()];
            if (guardarMenuDiaGuardado(menuCombinado)) cantidadMenu = json.menuDelDia.length;
            if (typeof sincronizarMenuDelDiaEnCatalogo === "function") sincronizarMenuDelDiaEnCatalogo();
            if (typeof renderizarMenuDiaAdmin === "function") renderizarMenuDiaAdmin();
        }

        actualizarPanel();
        mostrarMensaje(`${importados.length} pedidos importados${cantidadMenu ? ` y ${cantidadMenu} platos del menú del día` : ""} correctamente.`, "exito");
    } catch (error) {
        console.error(error);
        mostrarMensaje(`No se pudo importar: ${error.message}`, "error");
    } finally {
        const input = document.getElementById("archivoImportarJSON");
        if (input) input.value = "";
    }
}

function configurarRespaldoVentas() {
    const exportar = document.getElementById("btnExportarJSON");
    const importar = document.getElementById("btnImportarJSON");
    const archivo = document.getElementById("archivoImportarJSON");
    if (exportar && !exportar.dataset.configurado) {
        exportar.addEventListener("click", exportarDatosJSON);
        exportar.dataset.configurado = "true";
    }
    if (importar && !importar.dataset.configurado) {
        importar.addEventListener("click", () => archivo?.click());
        importar.dataset.configurado = "true";
    }
    if (archivo && !archivo.dataset.configurado) {
        archivo.addEventListener("change", () => importarDatosJSON(archivo.files?.[0]));
        archivo.dataset.configurado = "true";
    }
}
