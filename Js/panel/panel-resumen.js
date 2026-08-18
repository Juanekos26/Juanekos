/* =====================================================
   JUANEKO'S
   PANEL RESUMEN + ESTADÍSTICAS
===================================================== */


/* =====================================================
   ACTUALIZAR RESUMEN
===================================================== */

function actualizarResumen() {

    const pedidos =
        obtenerPedidos();

    const hoy =
        obtenerFechaActual();


    /* =================================================
       PEDIDOS DE HOY
    ================================================= */

    const pedidosHoy =
        pedidos.filter(
            pedido =>
                obtenerFechaPedido(pedido) === hoy
        );


    /* =================================================
       VENTAS DE HOY
       NO CUENTA CANCELADOS
    ================================================= */

    const ventasHoy =
        pedidosHoy
            .filter(
                pedido =>
                    !pedidoEstaCancelado(pedido)
            )
            .reduce(
                (total, pedido) =>
                    total +
                    obtenerTotalPedido(pedido),
                0
            );


    /* =================================================
       VENTAS TOTALES
       NO CUENTA CANCELADOS
    ================================================= */

    const ventasTotales =
        pedidos
            .filter(
                pedido =>
                    !pedidoEstaCancelado(pedido)
            )
            .reduce(
                (total, pedido) =>
                    total +
                    obtenerTotalPedido(pedido),
                0
            );


    /* =================================================
       ESTADOS
    ================================================= */

    const pedidosPendientes =
        pedidos.filter(
            pedido =>
                pedidoEstaPendiente(pedido)
        );


    const pedidosCancelados =
        pedidos.filter(
            pedido =>
                pedidoEstaCancelado(pedido)
        );


    /* =================================================
       MOSTRAR INFORMACIÓN
    ================================================= */

    actualizarElemento(
        "ventasHoy",
        formatearPrecio(ventasHoy)
    );


    actualizarElemento(
        "pedidosHoy",
        pedidosHoy.length
    );


    actualizarElemento(
        "ventasTotales",
        formatearPrecio(ventasTotales)
    );


    actualizarElemento(
        "pedidosTotales",
        pedidos.length
    );


    actualizarElemento(
        "pedidosPendientes",
        pedidosPendientes.length
    );


    actualizarElemento(
        "pedidosCancelados",
        pedidosCancelados.length
    );


    /* =================================================
       CONFIGURAR BOTONES
    ================================================= */

    configurarBotonesEstadisticas();

}


/* =====================================================
   ACTUALIZAR ELEMENTO
===================================================== */

function actualizarElemento(
    id,
    valor
) {

    const elemento =
        document.getElementById(id);

    if (!elemento) {
        return;
    }

    elemento.textContent =
        valor;

}


/* =====================================================
   BOTONES DE ESTADÍSTICAS
===================================================== */

function configurarBotonesEstadisticas() {

    const botones =
        document.querySelectorAll(
            "[data-estadistica]"
        );


    botones.forEach(
        boton => {

            if (
                boton.dataset
                    .estadisticaConfigurado ===
                "true"
            ) {
                return;
            }


            boton.addEventListener(
                "click",
                () => {

                    mostrarEstadistica(
                        boton.dataset.estadistica
                    );

                }
            );


            boton.dataset
                .estadisticaConfigurado =
                "true";

        }
    );

}


/* =====================================================
   MOSTRAR ESTADÍSTICA
===================================================== */

function mostrarEstadistica(
    tipo
) {

    const contenedor =
        document.getElementById(
            "estadisticasPanel"
        );


    if (!contenedor) {
        return;
    }


    const pedidos =
        obtenerPedidos();


    let titulo =
        "Estadísticas";

    let encabezado =
        "VALOR";

    let formato =
        "numero";


    /* =================================================
       CONFIGURAR TIPO
    ================================================= */

    switch (tipo) {

        case "ventas":

            titulo =
                "Ventas por día";

            encabezado =
                "VENTAS";

            formato =
                "dinero";

            break;


        case "pedidos":

            titulo =
                "Pedidos por día";

            encabezado =
                "PEDIDOS";

            break;


        case "pendientes":

            titulo =
                "Pedidos pendientes por día";

            encabezado =
                "PENDIENTES";

            break;


        case "cancelados":

            titulo =
                "Pedidos cancelados por día";

            encabezado =
                "CANCELADOS";

            break;

    }


    /* =================================================
       AGRUPAR
    ================================================= */

    const agrupados =
        agruparPedidosPorDia(
            pedidos,
            tipo
        );


    const fechas =
        Object.keys(
            agrupados
        ).sort(
            (a, b) =>
                convertirFecha(a) -
                convertirFecha(b)
        );


    let filas =
        "";


    fechas.forEach(
        fecha => {

            const valor =
                agrupados[fecha];


            const valorMostrar =
                formato === "dinero"
                    ? formatearPrecio(valor)
                    : valor;


            filas += `
                <tr>

                    <td>
                        ${escaparHTML(
                            fecha
                        )}
                    </td>

                    <td>
                        ${escaparHTML(
                            valorMostrar
                        )}
                    </td>

                </tr>
            `;

        }
    );


    /* =================================================
       SIN DATOS
    ================================================= */

    if (!filas) {

        filas = `
            <tr>

                <td
                    colspan="2"
                    class="estadisticas-sin-datos"
                >
                    No hay datos registrados.
                </td>

            </tr>
        `;

    }


    /* =================================================
       MOSTRAR PANEL
    ================================================= */

    contenedor.hidden =
        false;


    contenedor.innerHTML = `

        <div class="estadisticas-header">

            <div>

                <span class="admin-etiqueta">
                    ESTADÍSTICAS
                </span>

                <h3>
                    ${titulo}
                </h3>

            </div>


            <button
                type="button"
                id="cerrarEstadisticas"
                class="btn-cerrar-detalle"
                aria-label="Cerrar estadísticas"
            >
                ✕
            </button>

        </div>


        <div
            class="tabla-estadisticas-contenedor"
        >

            <table
                class="tabla-estadisticas"
            >

                <thead>

                    <tr>

                        <th>
                            FECHA
                        </th>

                        <th>
                            ${encabezado}
                        </th>

                    </tr>

                </thead>


                <tbody>

                    ${filas}

                </tbody>

            </table>

        </div>

    `;


    /* =================================================
       CERRAR
    ================================================= */

    const cerrar =
        document.getElementById(
            "cerrarEstadisticas"
        );


    if (cerrar) {

        cerrar.addEventListener(
            "click",
            () => {

                contenedor.hidden =
                    true;

            }
        );

    }

}


/* =====================================================
   AGRUPAR PEDIDOS POR DÍA
===================================================== */

function agruparPedidosPorDia(
    pedidos,
    tipo
) {

    const resultado =
        {};


    pedidos.forEach(
        pedido => {

            const fecha =
                obtenerFechaPedido(
                    pedido
                );


            if (!fecha) {
                return;
            }


            const estado =
                normalizarEstado(
                    pedido.estado
                );


            /* =========================================
               VENTAS
            ========================================= */

            if (
                tipo === "ventas" &&
                estado === "cancelado"
            ) {
                return;
            }


            /* =========================================
               PENDIENTES
            ========================================= */

            if (
                tipo === "pendientes" &&
                !pedidoEstaPendiente(
                    pedido
                )
            ) {
                return;
            }


            /* =========================================
               CANCELADOS
            ========================================= */

            if (
                tipo === "cancelados" &&
                estado !== "cancelado"
            ) {
                return;
            }


            if (
                !resultado[fecha]
            ) {

                resultado[fecha] =
                    0;

            }


            /* =========================================
               VENTAS = DINERO
               RESTO = CANTIDAD
            ========================================= */

            if (
                tipo === "ventas"
            ) {

                resultado[fecha] +=
                    obtenerTotalPedido(
                        pedido
                    );

            } else {

                resultado[fecha]++;

            }

        }
    );


    return resultado;

}