function actualizarResumen() {
    const pedidos = obtenerPedidos();
    const hoy = obtenerFechaActual();

    const pedidosHoy = pedidos.filter(
        pedido => obtenerFechaPedido(pedido) === hoy
    );

    const ventasHoy = pedidosHoy
        .filter(pedido => normalizarEstado(pedido.estado) !== "cancelado")
        .reduce(
            (total, pedido) =>
                total + obtenerTotalPedido(pedido),
            0
        );

    const ventasTotales = pedidos
        .filter(pedido => normalizarEstado(pedido.estado) !== "cancelado")
        .reduce(
            (total, pedido) =>
                total + obtenerTotalPedido(pedido),
            0
        );

    const pedidosPendientes = pedidos.filter(
        pedido => pedidoEstaPendiente(pedido)
    );

    const pedidosCancelados = pedidos.filter(
        pedido => pedidoEstaCancelado(pedido)
    );

    actualizarElemento(
        "ventasHoy",
        `S/ ${ventasHoy.toFixed(2)}`
    );

    actualizarElemento(
        "pedidosHoy",
        pedidosHoy.length
    );

    actualizarElemento(
        "ventasTotales",
        `S/ ${ventasTotales.toFixed(2)}`
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

    configurarBotonesEstadisticas();
}

function obtenerFechaPedido(pedido) {
    if (!pedido) {
        return "";
    }

    if (pedido.fecha) {
        return String(pedido.fecha);
    }

    if (pedido.fechaCreacion) {
        const fecha = new Date(pedido.fechaCreacion);

        if (!isNaN(fecha)) {
            return fecha.toLocaleDateString(
                "es-PE",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );
        }
    }

    if (pedido.id) {
        const fecha = new Date(Number(pedido.id));

        if (!isNaN(fecha)) {
            return fecha.toLocaleDateString(
                "es-PE",
                {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                }
            );
        }
    }

    return "";
}

function actualizarElemento(id, valor) {
    const elemento =
        document.getElementById(id);

    if (elemento) {
        elemento.textContent = valor;
    }
}

function configurarBotonesEstadisticas() {
    const botones =
        document.querySelectorAll(
            "[data-estadistica]"
        );

    botones.forEach(boton => {
        if (boton.dataset.estadisticaConfigurado) {
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

        boton.dataset.estadisticaConfigurado =
            "true";
    });
}

function mostrarEstadistica(tipo) {
    const contenedor =
        document.getElementById(
            "estadisticasPanel"
        );

    if (!contenedor) {
        return;
    }

    const pedidos = obtenerPedidos();

    let titulo = "";
    let encabezado = "";
    let formato = "numero";

    if (tipo === "ventas") {
        titulo = "Ventas por día";
        encabezado = "VENTAS";
        formato = "dinero";
    }

    if (tipo === "pedidos") {
        titulo = "Pedidos por día";
        encabezado = "PEDIDOS";
    }

    if (tipo === "pendientes") {
        titulo = "Pedidos pendientes por día";
        encabezado = "PENDIENTES";
    }

    if (tipo === "cancelados") {
        titulo = "Pedidos cancelados por día";
        encabezado = "CANCELADOS";
    }

    const agrupados =
        agruparPedidosPorDia(
            pedidos,
            tipo
        );

    const fechas =
        Object.keys(agrupados).sort(
            (a, b) => convertirFecha(a) - convertirFecha(b)
        );

    let filas = "";

    fechas.forEach(fecha => {
        const valor = agrupados[fecha];

        const valorMostrar =
            formato === "dinero"
                ? `S/ ${Number(valor).toFixed(2)}`
                : valor;

        filas += `
            <tr>
                <td>${fecha}</td>
                <td>${valorMostrar}</td>
            </tr>
        `;
    });

    if (!filas) {
        filas = `
            <tr>
                <td colspan="2">
                    No hay datos registrados.
                </td>
            </tr>
        `;
    }

    contenedor.hidden = false;

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

        <div class="tabla-estadisticas-contenedor">

            <table class="tabla-estadisticas">

                <thead>
                    <tr>
                        <th>FECHA</th>
                        <th>${encabezado}</th>
                    </tr>
                </thead>

                <tbody>
                    ${filas}
                </tbody>

            </table>

        </div>
    `;

    const cerrar =
        document.getElementById(
            "cerrarEstadisticas"
        );

    if (cerrar) {
        cerrar.addEventListener(
            "click",
            () => {
                contenedor.hidden = true;
            }
        );
    }
}

function agruparPedidosPorDia(
    pedidos,
    tipo
) {
    const resultado = {};

    pedidos.forEach(pedido => {
        const fecha =
            obtenerFechaPedido(pedido);

        if (!fecha) {
            return;
        }

        const estado =
            normalizarEstado(
                pedido.estado
            );

        if (
            tipo === "ventas" &&
            estado === "cancelado"
        ) {
            return;
        }

        if (
            tipo === "pendientes" &&
            !pedidoEstaPendiente(pedido)
        ) {
            return;
        }

        if (
            tipo === "cancelados" &&
            estado !== "cancelado"
        ) {
            return;
        }

        if (!resultado[fecha]) {
            resultado[fecha] = 0;
        }

        if (tipo === "ventas") {
            resultado[fecha] +=
                obtenerTotalPedido(pedido);
        } else {
            resultado[fecha]++;
        }
    });

    return resultado;
}

function convertirFecha(fecha) {
    const partes = String(fecha).split("/");

    if (partes.length !== 3) {
        return 0;
    }

    return new Date(
        Number(partes[2]),
        Number(partes[1]) - 1,
        Number(partes[0])
    );
}