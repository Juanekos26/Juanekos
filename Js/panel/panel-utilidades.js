/* =====================================================
   JUANEKO'S
   UTILIDADES DEL PANEL ADMINISTRATIVO
===================================================== */


/* =====================================================
   CONFIGURACIÓN
===================================================== */

const CLAVE_PEDIDOS_PANEL = "juanekos_pedidos";


/* =====================================================
   OBTENER PEDIDOS
===================================================== */

function obtenerPedidos() {

    try {

        const datos =
            localStorage.getItem(
                CLAVE_PEDIDOS_PANEL
            );

        if (!datos) {
            return [];
        }

        const pedidos =
            JSON.parse(datos);

        return Array.isArray(pedidos)
            ? pedidos
            : [];

    } catch (error) {

        console.error(
            "Error al obtener pedidos:",
            error
        );

        return [];

    }

}


/* =====================================================
   COMPATIBILIDAD
===================================================== */

function obtenerPedidosPanel() {

    return obtenerPedidos();

}


/* =====================================================
   GUARDAR PEDIDOS
===================================================== */

function guardarPedidosPanel(pedidos) {

    if (!Array.isArray(pedidos)) {
        return false;
    }

    try {

        localStorage.setItem(
            CLAVE_PEDIDOS_PANEL,
            JSON.stringify(pedidos)
        );

        return true;

    } catch (error) {

        console.error(
            "Error al guardar pedidos:",
            error
        );

        return false;

    }

}


/* =====================================================
   BUSCAR PEDIDO
===================================================== */

function buscarPedidoPanel(id) {

    return obtenerPedidos().find(
        pedido =>
            Number(pedido.id) ===
            Number(id)
    ) || null;

}


/* =====================================================
   NORMALIZAR ESTADO
===================================================== */

function normalizarEstado(estado) {

    const valor =
        String(
            estado || "abierto"
        )
        .trim()
        .toLowerCase();

    switch (valor) {

        case "abierto":
        case "pendiente":
        case "en espera":
        case "en espera de pago":
            return "pendiente";

        case "cerrado":
        case "finalizado":
        case "finalizada":
        case "completado":
        case "completada":
            return "cerrado";

        case "cancelado":
        case "cancelada":
            return "cancelado";

        default:
            return valor || "pendiente";

    }

}


/* =====================================================
   TOTAL DEL PEDIDO
===================================================== */

function obtenerTotalPedido(pedido) {

    if (!pedido) {
        return 0;
    }

    const total =
        Number(
            pedido.total
        );

    if (
        Number.isFinite(total) &&
        total >= 0
    ) {
        return total;
    }

    if (
        !Array.isArray(
            pedido.productos
        )
    ) {
        return 0;
    }

    return pedido.productos.reduce(
        (total, producto) => {

            const precio =
                Number(
                    producto.precio || 0
                );

            const cantidad =
                Number(
                    producto.cantidad || 0
                );

            return total +
                precio *
                cantidad;

        },
        0
    );

}


/* =====================================================
   ESTADOS
===================================================== */

function pedidoEstaPendiente(pedido) {

    return (
        normalizarEstado(
            pedido?.estado
        ) === "pendiente"
    );

}


function pedidoEstaCancelado(pedido) {

    return (
        normalizarEstado(
            pedido?.estado
        ) === "cancelado"
    );

}


function pedidoEstaCerrado(pedido) {

    return (
        normalizarEstado(
            pedido?.estado
        ) === "cerrado"
    );

}


/* =====================================================
   FECHA ACTUAL
===================================================== */

function obtenerFechaActual() {

    return new Date()
        .toLocaleDateString(
            "es-PE",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric"
            }
        );

}


/* =====================================================
   FECHA DEL PEDIDO
===================================================== */

function obtenerFechaPedido(pedido) {

    if (!pedido) {
        return "";
    }


    if (pedido.fecha) {

        return String(
            pedido.fecha
        );

    }


    if (pedido.fechaCreacion) {

        const fecha =
            new Date(
                pedido.fechaCreacion
            );

        if (!isNaN(fecha.getTime())) {

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


    if (pedido.timestamp) {

        const fecha =
            new Date(
                Number(
                    pedido.timestamp
                )
            );

        if (!isNaN(fecha.getTime())) {

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


/* =====================================================
   PRECIO
===================================================== */

function formatearPrecio(valor) {

    return `S/ ${Number(
        valor || 0
    ).toFixed(2)}`;

}


/* =====================================================
   ESCAPAR HTML
===================================================== */

function escaparHTML(valor) {

    return String(
        valor ?? ""
    )
    .replace(
        /&/g,
        "&amp;"
    )
    .replace(
        /</g,
        "&lt;"
    )
    .replace(
        />/g,
        "&gt;"
    )
    .replace(
        /"/g,
        "&quot;"
    )
    .replace(
        /'/g,
        "&#039;"
    );

}


/* =====================================================
   ESTADO VISUAL
===================================================== */

function generarEstadoHTML(estado) {

    const estadoNormalizado =
        normalizarEstado(
            estado
        );

    let texto =
        "PENDIENTE";


    if (
        estadoNormalizado ===
        "cerrado"
    ) {

        texto =
            "CERRADO";

    }


    if (
        estadoNormalizado ===
        "cancelado"
    ) {

        texto =
            "CANCELADO";

    }


    return `
        <span
            class="estado-pedido estado-${escaparHTML(
                estadoNormalizado
            )}"
        >
            ${texto}
        </span>
    `;

}


/* =====================================================
   CONFIRMAR
===================================================== */

function confirmarAccion(mensaje, opciones = {}) {

    const modal = document.getElementById("adminConfirmModal");
    const texto = document.getElementById("adminConfirmMensaje");
    const titulo = document.getElementById("adminConfirmTitulo");
    const aceptar = document.getElementById("adminConfirmAceptar");
    const cancelar = document.getElementById("adminConfirmCancelar");

    if (!modal || !texto || !aceptar || !cancelar) {
        return Promise.resolve(window.confirm(mensaje));
    }

    texto.textContent = mensaje || "¿Deseas continuar?";
    titulo.textContent = opciones.titulo || "Confirmar acción";
    aceptar.textContent = opciones.aceptar || "Confirmar";
    aceptar.classList.toggle("admin-btn-peligro", opciones.tipo === "peligro");
    modal.hidden = false;
    document.body.classList.add("admin-modal-open");

    return new Promise(resolve => {
        const cerrar = resultado => {
            modal.hidden = true;
            document.body.classList.remove("admin-modal-open");
            aceptar.removeEventListener("click", confirmar);
            cancelar.removeEventListener("click", rechazar);
            modal.querySelectorAll("[data-modal-cancelar]").forEach(el => el.removeEventListener("click", rechazar));
            document.removeEventListener("keydown", teclado);
            resolve(resultado);
        };
        const confirmar = () => cerrar(true);
        const rechazar = () => cerrar(false);
        const teclado = event => {
            if (event.key === "Escape") rechazar();
            if (event.key === "Enter") confirmar();
        };

        aceptar.addEventListener("click", confirmar);
        cancelar.addEventListener("click", rechazar);
        modal.querySelectorAll("[data-modal-cancelar]").forEach(el => el.addEventListener("click", rechazar));
        document.addEventListener("keydown", teclado);
        setTimeout(() => cancelar.focus(), 0);
    });
}


/* =====================================================
   MENSAJE
===================================================== */

function mostrarMensaje(mensaje, tipo = "info") {

    const region = document.getElementById("adminToastRegion");

    if (!region) {
        console.info(mensaje);
        return;
    }

    const toast = document.createElement("div");
    toast.className = `admin-toast admin-toast-${tipo}`;
    toast.setAttribute("role", "status");
    toast.innerHTML = `<span class="admin-toast-dot" aria-hidden="true"></span><p>${escaparHTML(mensaje || "")}</p>`;
    region.appendChild(toast);

    requestAnimationFrame(() => toast.classList.add("visible"));

    setTimeout(() => {
        toast.classList.remove("visible");
        setTimeout(() => toast.remove(), 220);
    }, 3200);
}

function debouncePanel(fn, espera = 180) {
    let temporizador;
    return (...args) => {
        clearTimeout(temporizador);
        temporizador = setTimeout(() => fn(...args), espera);
    };
}


/* =====================================================
   ACTUALIZAR TODO EL PANEL
===================================================== */

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


/* =====================================================
   FECHA DEL FILTRO
===================================================== */

function convertirFechaFiltro(
    fechaISO
) {

    if (!fechaISO) {
        return "";
    }

    const partes =
        String(
            fechaISO
        ).split("-");

    if (
        partes.length !== 3
    ) {
        return "";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;

}


/* =====================================================
   CONVERTIR FECHA
===================================================== */

function convertirFecha(fecha) {

    const partes =
        String(
            fecha || ""
        ).split("/");

    if (
        partes.length !== 3
    ) {
        return 0;
    }

    return new Date(
        Number(partes[2]),
        Number(partes[1]) - 1,
        Number(partes[0])
    ).getTime();

}


/* =====================================================
   ACTUALIZACIÓN AUTOMÁTICA
===================================================== */

window.addEventListener(
    "storage",
    event => {

        if (
            event.key ===
            CLAVE_PEDIDOS_PANEL
        ) {

            actualizarPanel();

        }

    }
);