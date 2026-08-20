/* JUANEKO'S · UTILIDADES PANEL + SUPABASE */
const CLAVE_PEDIDOS_PANEL = "juanekos_pedidos";
let pedidosPanelCache = [];
let cargaPedidosEnCurso = null;

function obtenerPedidos() {
    if (pedidosPanelCache.length) return pedidosPanelCache;
    try {
        const datos = JSON.parse(localStorage.getItem(CLAVE_PEDIDOS_PANEL) || "[]");
        pedidosPanelCache = Array.isArray(datos) ? datos : [];
    } catch (_) { pedidosPanelCache = []; }
    return pedidosPanelCache;
}
function obtenerPedidosPanel(){ return obtenerPedidos(); }

function guardarCachePedidosPanel(pedidos) {
    pedidosPanelCache = Array.isArray(pedidos) ? pedidos : [];
    try { localStorage.setItem(CLAVE_PEDIDOS_PANEL, JSON.stringify(pedidosPanelCache)); } catch(_) {}
    return true;
}

async function cargarPedidosSupabaseAdmin() {
    const sb = window.juanekosSupabase;
    if (!sb) return obtenerPedidos();
    if (cargaPedidosEnCurso) return cargaPedidosEnCurso;
    cargaPedidosEnCurso = (async () => {
        const { data, error } = await sb.rpc('listar_pedidos_admin');
        if (error) { console.error('No se pudieron cargar los pedidos:', error); return obtenerPedidos(); }
        guardarCachePedidosPanel(Array.isArray(data) ? data : []);
        return pedidosPanelCache;
    })().finally(() => { cargaPedidosEnCurso = null; });
    return cargaPedidosEnCurso;
}

async function persistirPedidoAdmin(pedido) {
    const sb = window.juanekosSupabase;
    if (!sb) throw new Error('Supabase no está disponible');
    const { error } = await sb.rpc('guardar_pedido_admin', { p_pedido: pedido });
    if (error) throw error;
    return true;
}

async function eliminarPedidoSupabaseAdmin(pedido) {
    const sb = window.juanekosSupabase;
    if (!sb) throw new Error('Supabase no está disponible');
    const uuid = pedido?.uuid;
    if (!uuid) throw new Error('El pedido no tiene UUID de Supabase');
    const { error } = await sb.rpc('eliminar_pedido_admin', { p_uuid: uuid });
    if (error) throw error;
    return true;
}

function guardarPedidosPanel(pedidos) {
    if (!Array.isArray(pedidos)) return false;
    const anteriores = [...obtenerPedidos()];
    guardarCachePedidosPanel(pedidos);

    // Compatibilidad: cualquier módulo antiguo que llame esta función sigue
    // guardando localmente; los cambios se sincronizan en segundo plano.
    const nuevosIds = new Set(pedidos.map(p => String(p.uuid || p.id)));
    pedidos.forEach(p => persistirPedidoAdmin(p).catch(err => console.error('Sincronización pedido:', err)));
    anteriores.filter(p => !nuevosIds.has(String(p.uuid || p.id)))
        .forEach(p => eliminarPedidoSupabaseAdmin(p).catch(err => console.error('Eliminación pedido:', err)));
    return true;
}

function buscarPedidoPanel(id) {
    return obtenerPedidos().find(p => String(p.id) === String(id) || String(p.uuid) === String(id)) || null;
}

async function iniciarPedidosRealtimeAdmin() {
    await cargarPedidosSupabaseAdmin();
    if (typeof actualizarPanel === 'function') actualizarPanel();
    const sb = window.juanekosSupabase;
    if (!sb || window.__juanekosPedidosRealtime) return;
    window.__juanekosPedidosRealtime = sb.channel('juanekos-admin-pedidos')
      .on('postgres_changes', { event:'*', schema:'public', table:'pedidos' }, async () => {
          await cargarPedidosSupabaseAdmin();
          if (typeof actualizarPanel === 'function') actualizarPanel();
      })
      .on('postgres_changes', { event:'*', schema:'public', table:'detalle_pedido' }, async () => {
          await cargarPedidosSupabaseAdmin();
          if (typeof actualizarPanel === 'function') actualizarPanel();
      }).subscribe();
}

document.addEventListener('DOMContentLoaded', iniciarPedidosRealtimeAdmin);

/* =====================================================
   NORMALIZAR ESTADO
===================================================== */

function normalizarEstado(estado) {

    const valor = String(estado || "inicio")
        .trim()
        .toLowerCase();

    switch (valor) {
        case "abierto":
        case "nuevo":
        case "iniciado":
        case "inicio":
            return "inicio";

        case "pendiente":
        case "en espera":
        case "en espera de pago":
        case "preparando":
        case "en preparación":
        case "en preparacion":
            return "pendiente";

        case "listo":
        case "lista":
        case "preparado":
        case "preparada":
            return "listo";

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
            return "inicio";
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
    return ["inicio", "pendiente", "listo"].includes(
        normalizarEstado(pedido?.estado)
    );
}

function pedidoEstaEnInicio(pedido) {
    return normalizarEstado(pedido?.estado) === "inicio";
}

function pedidoEstaListo(pedido) {
    return normalizarEstado(pedido?.estado) === "listo";
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
    const estadoNormalizado = normalizarEstado(estado);
    const textos = {
        inicio: "INICIO",
        pendiente: "PENDIENTE",
        listo: "LISTO",
        cerrado: "CERRADO",
        cancelado: "CANCELADO"
    };

    return `
        <span class="estado-pedido estado-${escaparHTML(estadoNormalizado)}">
            ${textos[estadoNormalizado] || "INICIO"}
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

function normalizarFechaComparable(valor) {
    if (!valor) return "";

    const texto = String(valor).trim();

    // input[type=date] y fechas ISO: YYYY-MM-DD
    let m = texto.match(/^(\d{4})-(\d{1,2})-(\d{1,2})/);
    if (m) {
        return `${m[1]}-${String(m[2]).padStart(2, "0")}-${String(m[3]).padStart(2, "0")}`;
    }

    // Formato peruano guardado por toLocaleDateString: D/M/YYYY o DD/MM/YYYY
    m = texto.match(/^(\d{1,2})[\/-](\d{1,2})[\/-](\d{4})$/);
    if (m) {
        return `${m[3]}-${String(m[2]).padStart(2, "0")}-${String(m[1]).padStart(2, "0")}`;
    }

    const fecha = new Date(texto);
    if (!Number.isNaN(fecha.getTime())) {
        const y = fecha.getFullYear();
        const mth = String(fecha.getMonth() + 1).padStart(2, "0");
        const d = String(fecha.getDate()).padStart(2, "0");
        return `${y}-${mth}-${d}`;
    }

    return "";
}

function convertirFechaFiltro(fechaISO) {
    const canonica = normalizarFechaComparable(fechaISO);
    if (!canonica) return "";
    const [anio, mes, dia] = canonica.split("-");
    return `${dia}/${mes}/${anio}`;
}

function fechaPedidoCoincide(pedido, fechaISO) {
    const seleccionada = normalizarFechaComparable(fechaISO);
    if (!seleccionada || !pedido) return false;

    const desdeFecha = normalizarFechaComparable(pedido.fecha);
    if (desdeFecha) return desdeFecha === seleccionada;

    if (pedido.timestamp) {
        const fecha = new Date(Number(pedido.timestamp));
        if (!Number.isNaN(fecha.getTime())) {
            const canonica = normalizarFechaComparable(
                `${fecha.getFullYear()}-${fecha.getMonth() + 1}-${fecha.getDate()}`
            );
            return canonica === seleccionada;
        }
    }

    return false;
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