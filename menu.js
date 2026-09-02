const cantidades = [];
const acompanamientos = {};

const TIPOS_ACOMPANAMIENTO = [
    "chaufaCompleto",
    "papaEnsalada",
    "papaChaufa",
    "papaSola",
    "chaufaSola"
];

function inicializarCantidades() {
    if (!Array.isArray(menu)) return;

    menu.forEach((_, index) => {
        if (typeof cantidades[index] !== "number") {
            cantidades[index] = 0;
        }

        inicializarAcompanamientos(index);
    });
}

function obtenerCantidadProducto(index) {
    return Number(cantidades[index]) || 0;
}

function crearAcompanamientosVacios() {
    return TIPOS_ACOMPANAMIENTO.reduce(
        (resultado, tipo) => {
            resultado[tipo] = 0;
            return resultado;
        },
        {}
    );
}

function inicializarAcompanamientos(index) {
    if (!acompanamientos[index]) {
        acompanamientos[index] =
            crearAcompanamientosVacios();
    }
}

function cambiar(index, cantidad) {
    inicializarCantidades();

    const producto = menu?.[index];

    if (!producto) return;

    cantidades[index] = Math.max(
        0,
        obtenerCantidadProducto(index) +
        Number(cantidad)
    );

    if (esProductoConAcompanamiento(producto)) {
        ajustarAcompanamientos(index);
        actualizarAcompanamientos(index);
    }

    actualizarCantidadVisual(index);
    actualizarTotal();
}

function esProductoConAcompanamiento(producto) {
    return (
        producto?.categoria === "broaster" &&
        !producto.nombre.startsWith("Porción")
    );
}

function ajustarAcompanamientos(index) {
    inicializarAcompanamientos(index);

    const datos = acompanamientos[index];
    const limite = obtenerCantidadProducto(index);

    let total = Object.values(datos).reduce(
        (suma, cantidad) =>
            suma + Number(cantidad || 0),
        0
    );

    if (total <= limite) return;

    for (
        let i = TIPOS_ACOMPANAMIENTO.length - 1;
        i >= 0 && total > limite;
        i--
    ) {
        const tipo =
            TIPOS_ACOMPANAMIENTO[i];

        const reducir = Math.min(
            Number(datos[tipo] || 0),
            total - limite
        );

        datos[tipo] -= reducir;
        total -= reducir;
    }
}

function cambiarAcompanamiento(
    index,
    tipo,
    cantidad
) {
    inicializarAcompanamientos(index);

    if (
        !TIPOS_ACOMPANAMIENTO.includes(tipo)
    ) {
        return;
    }

    const cantidadProducto =
        obtenerCantidadProducto(index);

    if (
        Number(cantidad) > 0 &&
        cantidadProducto <= 0
    ) {
        return;
    }

    const datos =
        acompanamientos[index];

    const anterior =
        Number(datos[tipo]) || 0;

    const nuevo = Math.max(
        0,
        anterior + Number(cantidad)
    );

    const totalActual =
        Object.values(datos).reduce(
            (suma, valor) =>
                suma + Number(valor || 0),
            0
        );

    const totalNuevo =
        totalActual -
        anterior +
        nuevo;

    if (totalNuevo > cantidadProducto) {
        return;
    }

    datos[tipo] = nuevo;

    actualizarAcompanamientos(index);
    actualizarTotal();
}

function actualizarCantidadVisual(index) {
    const elemento =
        document.getElementById(
            `cant-${index}`
        );

    if (elemento) {
        elemento.textContent =
            obtenerCantidadProducto(index);
    }
}

function actualizarAcompanamientos(index) {
    inicializarAcompanamientos(index);

    const datos =
        acompanamientos[index];

    TIPOS_ACOMPANAMIENTO.forEach(tipo => {

        const elemento =
            document.getElementById(
                `${tipo}-${index}`
            );

        if (elemento) {
            elemento.textContent =
                Number(datos[tipo]) || 0;
        }

    });
}

function obtenerAcompanamientos(index) {
    inicializarAcompanamientos(index);

    return {
        ...acompanamientos[index]
    };
}


function totalAcompanamientosProducto(index) {
    const datos = obtenerAcompanamientos(index);
    return Object.values(datos).reduce((suma, valor) => suma + Number(valor || 0), 0);
}

function validarAcompanamientosObligatorios(mostrarAviso = true) {
    if (!Array.isArray(menu)) return true;

    for (let index = 0; index < menu.length; index++) {
        const producto = menu[index];
        const cantidad = obtenerCantidadProducto(index);
        if (cantidad <= 0 || !esProductoConAcompanamiento(producto)) continue;

        const elegidos = totalAcompanamientosProducto(index);
        if (elegidos !== cantidad) {
            if (mostrarAviso) {
                const faltan = Math.max(0, cantidad - elegidos);
                alert(`Selecciona ${faltan || cantidad} acompañamiento(s) para ${producto.nombre}. Debe haber un acompañamiento por cada unidad de broaster.`);
                const card = document.querySelector(`.producto-card[data-index="${index}"]`) || document.getElementById(`cant-${index}`)?.closest('.producto-card');
                card?.scrollIntoView({ behavior: 'smooth', block: 'center' });
            }
            return false;
        }
    }
    return true;
}
window.validarAcompanamientosObligatorios = validarAcompanamientosObligatorios;

function calcularTotalPedido() {
    if (!Array.isArray(menu)) {
        return 0;
    }

    const total =
        menu.reduce(
            (suma, producto, index) => {

                const precio =
                    Number(producto.precio) || 0;

                const cantidad =
                    obtenerCantidadProducto(index);

                return suma +
                    precio * cantidad;
            },
            0
        );

    return Number(
        total.toFixed(2)
    );
}

function actualizarTotal() {
    const elemento = document.getElementById("total");
    if (elemento) {
        elemento.textContent = calcularTotalPedido().toFixed(2);
    }
    renderizarCarrito(); // Hook in to update cart visuals whenever total is calculated
}

function obtenerDatosCliente() {
    return {
        cliente: document.getElementById("cliente")?.value.trim() || "",
        mesa: document.getElementById("mesa")?.value.trim() || ""
    };
}

function obtenerProductosPedido() {
    if (!Array.isArray(menu)) return [];

    return menu.reduce((productos, producto, index) => {
        const cantidad = obtenerCantidadProducto(index);
        if (cantidad <= 0) return productos;

        productos.push({
            productoId: producto.id,
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            categoria: producto.categoria,
            cantidad: cantidad,
            index: index, // para botones en el carrito
            acompanamientos: obtenerAcompanamientos(index)
        });

        return productos;
    }, []);
}

function obtenerPedidoActual() {
    const datos = obtenerDatosCliente();
    const productos = obtenerProductosPedido();

    return {
        cliente: datos.cliente,
        mesa: datos.mesa,
        productos: productos,
        total: calcularTotalPedido()
    };
}

function limpiarPedido() {
    if (!Array.isArray(menu)) return;

    menu.forEach((_, index) => {
        cantidades[index] = 0;
        acompanamientos[index] = crearAcompanamientosVacios();
        actualizarCantidadVisual(index);
        actualizarAcompanamientos(index);
    });

    const cliente = document.getElementById("cliente");
    const mesa = document.getElementById("mesa");

    if (cliente) cliente.value = "";
    if (mesa) mesa.value = "";

    actualizarTotal();
}

/* =====================================================
   NUEVAS FUNCIONES DE CARRITO Y FILTRO
===================================================== */

function renderizarCarrito() {
    const cartItemsContainer = document.getElementById('cartItems');
    const badge = document.getElementById('cart-badge-header');
    
    if (!cartItemsContainer) return;
    
    const productos = obtenerProductosPedido();
    let totalItems = 0;
    
    if (productos.length === 0) {
        cartItemsContainer.innerHTML = '<p class="cart-empty-msg">Tu carrito está vacío.</p>';
        if (badge) badge.textContent = 0;
        return;
    }
    
    let html = '';
    productos.forEach(item => {
        totalItems += item.cantidad;
        const subtotal = (item.precio * item.cantidad).toFixed(2);
        
        let extras = '';
        // Resumen de acompañamientos si los hay
        if (item.categoria === 'broaster') {
             const acomp = item.acompanamientos;
             const names = {
                 'chaufaCompleto': 'C. Completo',
                 'papaEnsalada': 'Papa+Ens.',
                 'papaChaufa': 'Papa+Chaufa',
                 'papaSola': 'Papa',
                 'chaufaSola': 'Chaufa'
             };
             let extrasArr = [];
             for(let key in acomp) {
                 if (acomp[key] > 0) extrasArr.push(`${acomp[key]}x ${names[key]}`);
             }
             if (extrasArr.length > 0) {
                 extras = `<div style="font-size:0.75rem; color:var(--texto-secundario); margin-top:2px;">${extrasArr.join(', ')}</div>`;
             }
        }
        
        html += `
            <div class="cart-item">
                <div class="cart-item-info">
                    <div class="cart-item-title">${item.nombre}</div>
                    <div class="cart-item-price">S/ ${item.precio.toFixed(2)} c/u</div>
                    ${extras}
                </div>
                <div class="mini-controles" style="flex-shrink:0;">
                    <button type="button" onclick="cambiar(${item.index}, -1)">−</button>
                    <span style="min-width:18px; text-align:center; font-size:0.85rem;">${item.cantidad}</span>
                    <button type="button" onclick="cambiar(${item.index}, 1)">+</button>
                </div>
                <div style="font-weight:bold; color:var(--color-dorado); font-size:0.9rem; margin-left:10px;">
                    S/ ${subtotal}
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = html;
    if (badge) badge.textContent = totalItems;
}

window.filtrarMenu = function() {
    const input = document.getElementById("buscarPlato");
    if (!input) return;
    const filter = input.value.toLowerCase();
    const articulos = document.querySelectorAll("#productos .producto-card");

    articulos.forEach(art => {
        const nombre = art.getAttribute("data-nombre");
        if (nombre.includes(filter)) {
            art.style.display = "flex";
        } else {
            art.style.display = "none";
        }
    });
};

window.filtrarCategoria = function(categoria) {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(t => t.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

    const articulos = document.querySelectorAll("#productos .producto-card");
    articulos.forEach(art => {
        if (categoria === "todas" || art.getAttribute("data-categoria") === categoria) {
            art.style.display = "flex";
        } else {
            art.style.display = "none";
        }
    });
    
    // Ocultar la sección entera del menú del día si no estamos en 'todas' o 'cevicheria'
    const menuDiaSeccion = document.querySelector(".menu-dia-seccion");
    if (menuDiaSeccion) {
        if (categoria === "todas" || categoria === "cevicheria") {
            menuDiaSeccion.style.display = "block";
        } else {
            menuDiaSeccion.style.display = "none";
        }
    }
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarCantidades();
    actualizarTotal();
});
/* =====================================================
   CARRITO LATERAL RESPONSIVO
===================================================== */
function toggleCartSidebar(forzarEstado) {
    const sidebar = document.getElementById('cartSidebar');
    const overlay = document.querySelector('.cart-overlay');
    if (!sidebar) return;
    const abrir = typeof forzarEstado === 'boolean' ? forzarEstado : !sidebar.classList.contains('open');

    if (abrir) {
        // Carrito y menú hamburguesa son mutuamente exclusivos en móvil.
        if (typeof window.cerrarMenuMovil === 'function') {
            window.cerrarMenuMovil();
        } else {
            document.querySelector('.nav')?.classList.remove('open');
            document.querySelector('.menu-toggle')?.classList.remove('open');
            document.querySelector('.menu-overlay')?.classList.remove('open');
        }
    }

    sidebar.classList.toggle('open', abrir);
    if (overlay) overlay.classList.toggle('open', abrir);
    document.body.classList.toggle('cart-abierto', abrir && window.innerWidth <= 1024);
    sidebar.setAttribute('aria-hidden', abrir ? 'false' : 'true');
    if (abrir) renderizarCarrito();
}
window.toggleCartSidebar = toggleCartSidebar;

window.addEventListener('keydown', e => { if (e.key === 'Escape') toggleCartSidebar(false); });
window.addEventListener('resize', () => {
    if (window.innerWidth > 1024) {
        const overlay = document.querySelector('.cart-overlay');
        if (overlay) overlay.classList.remove('open');
        document.body.classList.remove('cart-abierto');
    }
});

document.addEventListener('DOMContentLoaded', () => {
    inicializarCantidades();
    renderizarCarrito();
});
