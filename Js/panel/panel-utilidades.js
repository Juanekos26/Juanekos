/* ========================================
   JUANEKO'S
   UTILIDADES DEL PANEL ADMINISTRATIVO
======================================== */


/* ========================================
   FORMATO DE PRECIO
======================================== */

function formatearPrecio(valor) {

    return `S/ ${(Number(valor) || 0).toFixed(2)}`;

}


/* ========================================
   ESCAPAR HTML
======================================== */

function escaparHTML(valor) {

    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");

}


/* ========================================
   OBTENER PEDIDOS
======================================== */

function obtenerPedidosPanel() {

    if (
        typeof obtenerPedidosGuardados !==
        "function"
    ) {

        console.error(
            "No se encontró obtenerPedidosGuardados()."
        );

        return [];

    }

    const pedidos =
        obtenerPedidosGuardados();

    return Array.isArray(pedidos)
        ? pedidos
        : [];

}


/* ========================================
   BUSCAR PEDIDO
======================================== */

function buscarPedidoPanel(id) {

    const pedidos =
        obtenerPedidosPanel();

    return pedidos.find(
        pedido =>
            Number(pedido.id) === Number(id)
    ) || null;

}


/* ========================================
   FECHA DEL FILTRO
======================================== */

function convertirFechaFiltro(fecha) {

    if (!fecha) {
        return "";
    }

    const partes =
        String(fecha).split("-");

    if (partes.length !== 3) {
        return "";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* ========================================
   ESTADOS
======================================== */

function obtenerTextoEstado(estado) {

    const estados = {

        abierto:
            "ABIERTO",

        preparacion:
            "EN PREPARACIÓN",

        listo:
            "LISTO",

        cerrado:
            "CERRADO",

        cancelado:
            "CANCELADO"

    };

    return (
        estados[estado] ||
        "ABIERTO"
    );

}


function normalizarEstado(estado) {

    const estadosValidos = [
        "abierto",
        "preparacion",
        "listo",
        "cerrado",
        "cancelado"
    ];

    const estadoNormalizado =
        String(
            estado || "abierto"
        ).toLowerCase();

    return estadosValidos.includes(
        estadoNormalizado
    )
        ? estadoNormalizado
        : "abierto";

}


function obtenerClaseEstado(estado) {

    const clases = {

        abierto:
            "estado-abierto",

        preparacion:
            "estado-preparacion",

        listo:
            "estado-listo",

        cerrado:
            "estado-cerrado",

        cancelado:
            "estado-cancelado"

    };

    return (
        clases[estado] ||
        "estado-abierto"
    );

}


function generarEstadoHTML(estado) {

    const estadoNormalizado =
        normalizarEstado(estado);

    return `
        <span
            class="estado-badge ${obtenerClaseEstado(
                estadoNormalizado
            )}"
        >
            ${obtenerTextoEstado(
                estadoNormalizado
            )}
        </span>
    `;

}


/* ========================================
   SUBTOTAL
======================================== */

function calcularSubtotalProducto(
    producto
) {

    const cantidad =
        Number(
            producto?.cantidad
        ) || 0;

    const precio =
        Number(
            producto?.precio
        ) || 0;

    return cantidad * precio;

}


/* ========================================
   TOTAL
======================================== */

function calcularTotalProductos(
    productos
) {

    if (
        !Array.isArray(productos)
    ) {
        return 0;
    }

    const total =
        productos.reduce(
            (
                suma,
                producto
            ) => {

                return (
                    suma +
                    calcularSubtotalProducto(
                        producto
                    )
                );

            },
            0
        );

    return Number(
        total.toFixed(2)
    );

}


/* ========================================
   CANTIDAD TOTAL DE PRODUCTOS
======================================== */

function obtenerCantidadProductos(
    productos
) {

    if (
        !Array.isArray(productos)
    ) {
        return 0;
    }

    return productos.reduce(
        (
            total,
            producto
        ) => {

            return (
                total +
                (
                    Number(
                        producto?.cantidad
                    ) || 0
                )
            );

        },
        0
    );

}


/* ========================================
   CLONAR PEDIDO
======================================== */

function clonarPedidoPanel(
    pedido
) {

    if (!pedido) {
        return null;
    }

    try {

        return JSON.parse(
            JSON.stringify(pedido)
        );

    } catch (error) {

        console.error(
            "Error al clonar pedido:",
            error
        );

        return null;

    }

}


/* ========================================
   CONFIRMAR
======================================== */

function confirmarAccion(
    mensaje
) {

    return window.confirm(
        mensaje
    );

}


/* ========================================
   MENSAJE
======================================== */

function mostrarMensaje(
    mensaje
) {

    window.alert(
        mensaje
    );

}