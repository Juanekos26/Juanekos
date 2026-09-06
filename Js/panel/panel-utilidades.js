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

async function persistirPedidoAdminDirecto(pedido) {
    const sb = window.juanekosSupabase;
    if (!sb) throw new Error('Supabase no está disponible');
    const pedidoUuid = String(pedido?.uuid || '').trim();
    if (!/^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(pedidoUuid)) {
        throw new Error('El pedido no contiene UUID válido de Supabase');
    }

    const productos = Array.isArray(pedido?.productos) ? pedido.productos.filter(x => Number(x?.cantidad || 0) > 0) : [];
    const total = productos.reduce((s,p) => s + Number(p.precio || 0) * Number(p.cantidad || 0), 0);
    const mesaNumerica = Number(String(pedido?.mesa ?? '').replace(/[^0-9]/g,'')) || null;
    const payloadPedido = {
        cliente_nombre: String(pedido?.cliente || '').trim(),
        mesa: mesaNumerica,
        estado: normalizarEstado(pedido?.estado),
        subtotal: Number(total.toFixed(2)),
        total: Number(total.toFixed(2)),
        updated_at: new Date().toISOString()
    };

    const upd = await sb.from('pedidos').update(payloadPedido).eq('id', pedidoUuid).select('id').maybeSingle();
    if (upd.error) throw upd.error;
    if (!upd.data) throw new Error('Supabase no confirmó la actualización del pedido');

    const actuales = await sb.from('detalle_pedido').select('id').eq('pedido_id', pedidoUuid);
    if (actuales.error) throw actuales.error;
    const idsDetalle = (actuales.data || []).map(x => x.id).filter(Boolean);
    if (idsDetalle.length) {
        const delA = await sb.from('detalle_acompanamientos').delete().in('detalle_pedido_id', idsDetalle);
        if (delA.error) throw delA.error;
    }
    const delD = await sb.from('detalle_pedido').delete().eq('pedido_id', pedidoUuid);
    if (delD.error) throw delD.error;

    const mapaNombres = {
        chaufaCompleto:'Chaufa completo', papaEnsalada:'Papa + Ensalada', papaChaufa:'Papa + Chaufa',
        papaSola:'Papa sola', chaufaSola:'Chaufa sola'
    };
    for (const prod of productos) {
        const ref = String(prod?.productoId || '').trim();
        const esUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(ref);
        let producto_id = null, menu_dia_id = null;
        if (esUuid) {
            const pr = await sb.from('productos').select('id').eq('id',ref).maybeSingle();
            if (!pr.error && pr.data) producto_id = ref;
            else {
                const md = await sb.from('menu_dia').select('id').eq('id',ref).maybeSingle();
                if (!md.error && md.data) menu_dia_id = ref;
            }
        }
        const cantidad = Math.max(1, Number(prod?.cantidad || 1));
        const precio = Math.max(0, Number(prod?.precio || 0));
        const ins = await sb.from('detalle_pedido').insert({
            pedido_id: pedidoUuid, producto_id, menu_dia_id,
            nombre_producto: String(prod?.nombre || 'Producto'), categoria: String(prod?.categoria || '') || null,
            cantidad, precio_unitario: precio, subtotal: Number((cantidad*precio).toFixed(2))
        }).select('id').single();
        if (ins.error) throw ins.error;
        const extras=[];
        for (const [key,nombre] of Object.entries(mapaNombres)) {
            const cant = Number(prod?.acompanamientos?.[key] || 0);
            if (cant > 0) extras.push({detalle_pedido_id:ins.data.id,nombre_acompanamiento:nombre,cantidad:cant});
        }
        if (extras.length) {
            const ex = await sb.from('detalle_acompanamientos').insert(extras);
            if (ex.error) throw ex.error;
        }
    }
    return true;
}

async function persistirPedidoAdmin(pedido) {
    const sb = window.juanekosSupabase;
    if (!sb) throw new Error('Supabase no está disponible');

    // V12: el guardado de un pedido DEBE ser atómico. No usamos el guardado directo
    // por varias tablas porque podía actualizar pedidos.total y fallar después en
    // detalle_pedido, dejando el pedido inconsistente.
    const { data, error } = await sb.rpc('guardar_pedido_admin', { p_pedido: pedido });
    if (error) {
        console.error('guardar_pedido_admin:', error);
        const detalle = error.message || error.details || error.hint || 'Error desconocido de Supabase';
        throw new Error(detalle);
    }
    if (!data || data.ok !== true) {
        throw new Error('Supabase no confirmó el guardado completo del pedido');
    }
    return data;
}

async function eliminarPedidoSupabaseAdmin(pedido) {
    const sb = window.juanekosSupabase;
    if (!sb) throw new Error('Supabase no está disponible');
    const uuid = pedido?.uuid;
    if (!uuid) throw new Error('El pedido no tiene UUID de Supabase');
        let err = null;
    try {
        const res = await sb.from('pedidos').delete().eq('id', uuid);
        if (res.error) err = res.error;
    } catch (e) {
        err = e;
    }
    if (err) throw err;
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


async function cargarPedidoIndividualAdmin(id) {
    const sb = window.juanekosSupabase;
    if (!sb || id == null || String(id).trim() === '') return null;

    const valor = String(id).trim();
    const esUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(valor);

    let consulta = sb.from('pedidos').select('*').limit(1);
    if (esUuid) {
        consulta = consulta.eq('id', valor);
    } else {
        const numero = Number(valor);
        if (!Number.isFinite(numero)) return null;
        consulta = consulta.eq('numero_pedido', numero);
    }

    const { data: filas, error } = await consulta;
    if (error) {
        console.error('No se pudo cargar el pedido individual:', error);
        throw error;
    }
    if (!filas?.[0]) return null;

    const p = filas[0];
    const { data: detalles, error: detError } = await sb
        .from('detalle_pedido')
        .select('*')
        .eq('pedido_id', p.id)
        .order('created_at', { ascending: true });

    if (detError) {
        console.error('No se pudo cargar el detalle del pedido:', detError);
        throw detError;
    }

    const productos = [];
    for (const d of (detalles || [])) {
        const { data: extras, error: extrasError } = await sb
            .from('detalle_acompanamientos')
            .select('nombre_acompanamiento,cantidad')
            .eq('detalle_pedido_id', d.id);

        if (extrasError) {
            console.error('No se pudieron cargar los acompañamientos:', extrasError);
        }

        const acomp = {};
        (extras || []).forEach(a => {
            const key = ({
                'Chaufa completo':'chaufaCompleto',
                'Papa + Ensalada':'papaEnsalada',
                'Papa + Chaufa':'papaChaufa',
                'Papa sola':'papaSola',
                'Chaufa sola':'chaufaSola'
            })[a.nombre_acompanamiento];
            if (key) acomp[key] = Number(a.cantidad || 0);
        });

        productos.push({
            detalleId: d.id,
            productoId: d.producto_id || d.menu_dia_id,
            nombre: d.nombre_producto,
            categoria: d.categoria,
            cantidad: Number(d.cantidad || 0),
            precio: Number(d.precio_unitario || 0),
            subtotal: Number(d.subtotal || 0),
            acompanamientos: acomp
        });
    }

    const fechaObj = p.fecha ? new Date(`${p.fecha}T12:00:00`) : null;
    const pedido = {
        uuid: p.id,
        id: Number(p.numero_pedido),
        cliente: p.cliente_nombre,
        telefono: p.cliente_telefono,
        mesa: p.mesa,
        estado: p.estado,
        subtotal: Number(p.subtotal || 0),
        total: Number(p.total || 0),
        observaciones: p.observaciones || '',
        fecha: fechaObj && !Number.isNaN(fechaObj.getTime()) ? fechaObj.toLocaleDateString('es-PE', {timeZone: 'America/Lima'}) : String(p.fecha || ''),
        fechaISO: p.fecha,
        hora: p.hora || '',
        timestamp: p.created_at ? new Date(p.created_at).getTime() : Date.now(),
        productos
    };

    const actuales = obtenerPedidos().filter(x => String(x.uuid) !== String(pedido.uuid));
    actuales.push(pedido);
    actuales.sort((a,b) => Number(b.id || 0) - Number(a.id || 0));
    guardarCachePedidosPanel(actuales);
    return pedido;
}
window.cargarPedidoIndividualAdmin = cargarPedidoIndividualAdmin;

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
    const configs = {
        inicio: { texto: "INICIO", icono: "fa-clock", clase: "estado-inicio" },
        pendiente: { texto: "PENDIENTE", icono: "fa-hourglass-half", clase: "estado-pendiente" },
        listo: { texto: "LISTO", icono: "fa-bell-concierge", clase: "estado-listo" },
        cerrado: { texto: "PAGADO (CERRADO)", icono: "fa-circle-check", clase: "estado-cerrado" },
        cancelado: { texto: "ANULADO", icono: "fa-ban", clase: "estado-cancelado" }
    };
    const c = configs[estadoNormalizado] || configs.inicio;

    return `
        <span class="estado-pedido ${c.clase}">
            <i class="fa-solid ${c.icono}" style="margin-right: 5px;" aria-hidden="true"></i>
            ${c.texto}
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