const cantidades = [];
const acompanamientos = {};
const indicaciones = {};

const CLAVE_PEDIDO_TEMPORAL = "juanekos_pedido_temporal";

function leerPedidoTemporal() {
    try {
        const raw = localStorage.getItem(CLAVE_PEDIDO_TEMPORAL);
        if (raw === null) {
            return { items: [], cliente: "", mesa: "" };
        }
        const datos = JSON.parse(raw || "null");
        return datos && typeof datos === "object" ? datos : { items: [], cliente: "", mesa: "" };
    } catch (_) {
        return { items: [], cliente: "", mesa: "" };
    }
}

function guardarPedidoTemporal() {
    if (!Array.isArray(menu)) return;

    const anterior = leerPedidoTemporal();
    const items = [];

    menu.forEach((producto, index) => {
        const cantidad = Number(cantidades[index]) || 0;
        if (cantidad <= 0) return;

        items.push({
            productoId: String(producto.id),
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            cantidad,
            acompanamientos: { ...(acompanamientos[index] || crearAcompanamientosVacios()) },
            indicaciones: indicaciones[index] || ""
        });
    });

    const clienteEl = document.getElementById("cliente");
    const mesaEl = document.getElementById("mesa");
    const observacionesEl = document.getElementById("observaciones");

    const estado = {
        items,
        cliente: clienteEl ? clienteEl.value : (anterior.cliente || ""),
        mesa: mesaEl ? mesaEl.value : (anterior.mesa || ""),
        observaciones: observacionesEl ? observacionesEl.value : (anterior.observaciones || "")
    };

    try {
        localStorage.setItem(CLAVE_PEDIDO_TEMPORAL, JSON.stringify(estado));
        window.dispatchEvent(new CustomEvent('juanekos:pedido-actualizado', { detail: estado }));
    } catch (_) {}
}

function normalizarTexto(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9]/g, "");
}

function restaurarPedidoTemporal() {
    if (!Array.isArray(menu) || menu.length === 0) return;
    const estado = leerPedidoTemporal();
    const porId = new Map((estado.items || []).map(item => [String(item.productoId || item.id || ''), item]));
    const porNombreNormalizado = new Map((estado.items || []).filter(item => item.nombre).map(item => [normalizarTexto(item.nombre), item]));

    menu.forEach((producto, index) => {
        const guardado = porId.get(String(producto.id)) || 
                         porId.get(String(producto.productoId || '')) ||
                         porNombreNormalizado.get(normalizarTexto(producto.nombre)) ||
                         (estado.items || []).find(item => normalizarTexto(item.nombre).includes(normalizarTexto(producto.nombre)) || normalizarTexto(producto.nombre).includes(normalizarTexto(item.nombre)));

        cantidades[index] = guardado ? Math.max(0, Number(guardado.cantidad) || 0) : 0;
        acompanamientos[index] = {
            ...crearAcompanamientosVacios(),
            ...(guardado?.acompanamientos || {})
        };
        indicaciones[index] = guardado?.indicaciones || "";
    });

    const cliente = document.getElementById("cliente");
    const mesa = document.getElementById("mesa");
    const observaciones = document.getElementById("observaciones");
    if (cliente && !cliente.value && estado.cliente) cliente.value = estado.cliente;
    if (mesa && !mesa.value && estado.mesa) mesa.value = estado.mesa;
    if (observaciones && !observaciones.value && estado.observaciones) observaciones.value = estado.observaciones;
}

function vaciarPedidoTemporal() {
    try { localStorage.removeItem(CLAVE_PEDIDO_TEMPORAL); } catch (_) {}
}

const TIPOS_ACOMPANAMIENTO = [
    "chaufaCompleto",
    "papaEnsalada",
    "papaChaufa",
    "papaSola",
    "chaufaSola"
];

function inicializarCantidades() {
    if (!Array.isArray(menu)) return;

    restaurarPedidoTemporal();

    menu.forEach((_, index) => {
        if (typeof cantidades[index] !== "number") cantidades[index] = 0;
        if (typeof indicaciones[index] !== "string") indicaciones[index] = "";
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

    guardarPedidoTemporal();
    actualizarCantidadVisual(index);
    actualizarTotal();
    
    if (document.getElementById('cartItems') && typeof renderizarCarrito === 'function') {
        renderizarCarrito();
    }
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

    guardarPedidoTemporal();
    actualizarAcompanamientos(index);
    actualizarTotal();
    
    if (document.getElementById('cartItems') && typeof renderizarCarrito === 'function') {
        renderizarCarrito();
    }
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
                const card = document.querySelector(`.producto-card[data-index="${index}"]`)
                    || document.getElementById(`cant-${index}`)?.closest('.producto-card')
                    || document.querySelector(`.pedido-producto[data-index="${index}"]`);
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
    const estado = leerPedidoTemporal();
    if (estado && Array.isArray(estado.items) && estado.items.length > 0) {
        return estado.items.filter(item => Number(item.cantidad) > 0).map((item, idx) => {
            const menuIndex = Array.isArray(menu) 
                ? menu.findIndex(p => String(p.id) === String(item.productoId || item.id) || normalizarTexto(p.nombre) === normalizarTexto(item.nombre))
                : -1;
            return {
                productoId: String(item.productoId || item.id || idx),
                nombre: item.nombre || 'Producto',
                precio: Number(item.precio) || 0,
                categoria: item.categoria || (menuIndex >= 0 ? menu[menuIndex].categoria : 'general'),
                cantidad: Number(item.cantidad) || 1,
                index: menuIndex >= 0 ? menuIndex : (item.index !== undefined ? item.index : idx),
                acompanamientos: item.acompanamientos || (menuIndex >= 0 ? obtenerAcompanamientos(menuIndex) : crearAcompanamientosVacios()),
                indicaciones: item.indicaciones || (menuIndex >= 0 ? indicaciones[menuIndex] : "")
            };
        });
    }

    if (!Array.isArray(menu)) return [];

    return menu.reduce((productos, producto, index) => {
        const cantidad = obtenerCantidadProducto(index);
        if (cantidad <= 0) return productos;

        productos.push({
            productoId: String(producto.id || index),
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            categoria: producto.categoria,
            cantidad: cantidad,
            index: index,
            acompanamientos: obtenerAcompanamientos(index),
            indicaciones: indicaciones[index] || ""
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
        indicaciones[index] = "";
        actualizarCantidadVisual(index);
        actualizarAcompanamientos(index);
    });

    const cliente = document.getElementById("cliente");
    const mesa = document.getElementById("mesa");

    if (cliente) cliente.value = "";
    if (mesa) mesa.value = "";

    vaciarPedidoTemporal();
    actualizarTotal();
}

/* =====================================================
   NUEVAS FUNCIONES DE CARRITO Y FILTRO
===================================================== */

function renderizarCarrito() {
    const cartItemsContainer = document.getElementById('cartItems');
    const badge = document.getElementById('cart-badge-header');
    const stepCountEl = document.getElementById('cart-step1-count');
    const productos = obtenerProductosPedido();
    const totalItems = productos.reduce((suma, item) => suma + Number(item.cantidad || 0), 0);

    if (badge) badge.textContent = totalItems;
    if (stepCountEl) stepCountEl.textContent = `(${totalItems})`;
    if (!cartItemsContainer) return;

    if (productos.length === 0) {
        cartItemsContainer.innerHTML = `
            <div class="pedido-vacio">
                <i class="fa-solid fa-basket-shopping"></i>
                <h3>Aún no agregaste productos</h3>
                <p>Regresa al menú y elige tus platos favoritos.</p>
                <div style="display:flex; gap:10px; justify-content:center; flex-wrap:wrap;">
                    <a href="Menu.html" class="pedido-volver-menu">Ver menú</a>
                </div>
            </div>`;
        return;
    }

    const nombresAcomp = {
        chaufaCompleto: 'Chaufa completo',
        papaEnsalada: 'Papa + ensalada',
        papaChaufa: 'Papa + chaufa',
        papaSola: 'Papa sola',
        chaufaSola: 'Chaufa sola'
    };

    cartItemsContainer.innerHTML = productos.map(item => {
        const producto = menu?.[item.index];
        const imagen = typeof obtenerImagenProducto === 'function' && producto
            ? obtenerImagenProducto(producto)
            : '../Imagenes/hero.jpg';

        const acompHTML = item.categoria === 'broaster' && producto && esProductoConAcompanamiento(producto)
            ? `<div class="pedido-acompanamientos">
                <span class="pedido-acompanamientos-titulo">Acompañamientos</span>
                ${TIPOS_ACOMPANAMIENTO.map(tipo => `
                    <div class="pedido-acomp-fila">
                        <span>${nombresAcomp[tipo]}</span>
                        <div class="mini-controles">
                            <button type="button" onclick="cambiarAcompanamiento(${item.index}, '${tipo}', -1)">−</button>
                            <strong id="pedido-${tipo}-${item.index}">${Number(item.acompanamientos?.[tipo] || 0)}</strong>
                            <button type="button" onclick="cambiarAcompanamiento(${item.index}, '${tipo}', 1)">+</button>
                        </div>
                    </div>`).join('')}
              </div>`
            : '';

        const subtotal = (Number(item.precio) * Number(item.cantidad)).toFixed(2);
        const indicacionActual = item.indicaciones || "";

        return `
            <article class="pedido-producto-nuevo" data-index="${item.index}">
                <div class="pedido-fila-1">
                    <img class="pedido-img-grande" src="${imagen}" alt="${item.nombre}" onerror="this.src='../Imagenes/hero.jpg'">
                    <h3 class="pedido-titulo-grande" title="${item.nombre}">${item.nombre}</h3>
                    <button class="pedido-btn-eliminar" onclick="eliminarProductoPedido(${item.index !== undefined ? item.index : `'${item.productoId}'`})" aria-label="Eliminar">
                        <i class="fa-solid fa-trash-can"></i>
                    </button>
                </div>
                
                <div class="pedido-fila-2">
                    <div class="pedido-precios-wrapper">
                        <div class="pedido-precio-unidad">
                            <span>PRECIO UN.</span>
                            <strong>S/ ${Number(item.precio).toFixed(2)}</strong>
                        </div>
                        <div class="pedido-precio-total">
                            <span>TOTAL</span>
                            <strong>S/ ${subtotal}</strong>
                        </div>
                    </div>
                    <div class="pedido-controles-wrapper">
                        <div class="pedido-stepper-nuevo">
                            <button type="button" class="pedido-step-btn-nuevo" onclick="cambiar(${item.index}, -1)" aria-label="Disminuir">−</button>
                            <div class="pedido-step-qty-nuevo">
                                <strong>${item.cantidad}</strong>
                            </div>
                            <button type="button" class="pedido-step-btn-nuevo" onclick="cambiar(${item.index}, 1)" aria-label="Aumentar">+</button>
                        </div>
                    </div>
                </div>
                
                <div class="pedido-fila-3">
                    <label class="pedido-campo-cocina">
                        <span class="pedido-campo-cocina-label"><i class="fa-solid fa-pen-to-square"></i> Indicaciones para cocina:</span>
                        <input type="text" class="pedido-input-cocina" placeholder="Ej: poco picante, ají y cremas aparte, bien frito..." 
                               value="${indicacionActual}"
                               onchange="actualizarIndicaciones(${item.index}, this.value)">
                    </label>
                </div>
                
                ${acompHTML}
            </article>`;
    }).join('');
}

window.actualizarIndicaciones = function(index, valor) {
    indicaciones[index] = valor;
    guardarPedidoTemporal();
};

function restaurarDemoScreenshot() {
    localStorage.removeItem(CLAVE_PEDIDO_TEMPORAL);
    cantidades.length = 0;
    inicializarCantidades();
    actualizarTotal();
}
window.restaurarDemoScreenshot = restaurarDemoScreenshot;

function eliminarProductoPedido(identifier) {
    const estado = leerPedidoTemporal();
    if (estado && Array.isArray(estado.items)) {
        estado.items = estado.items.filter((item, idx) => {
            const match = (item.index !== undefined && Number(item.index) === Number(identifier)) ||
                          (idx === Number(identifier)) ||
                          (String(item.productoId || item.id) === String(identifier)) ||
                          (normalizarTexto(item.nombre) === normalizarTexto(identifier));
            return !match;
        });
        try {
            localStorage.setItem(CLAVE_PEDIDO_TEMPORAL, JSON.stringify(estado));
            window.dispatchEvent(new CustomEvent('juanekos:pedido-actualizado', { detail: estado }));
        } catch (_) {}
    }

    if (Array.isArray(menu)) {
        menu.forEach((producto, idx) => {
            const match = (typeof identifier === 'number' && idx === identifier) ||
                          (String(producto.id) === String(identifier)) ||
                          (normalizarTexto(producto.nombre) === normalizarTexto(identifier));
            if (match) {
                cantidades[idx] = 0;
                acompanamientos[idx] = crearAcompanamientosVacios();
                indicaciones[idx] = "";
                actualizarCantidadVisual(idx);
                actualizarAcompanamientos(idx);
            }
        });
    }

    guardarPedidoTemporal();
    actualizarTotal();
    
    if (document.getElementById('cartItems') && typeof renderizarCarrito === 'function') {
        renderizarCarrito();
    }
}
window.eliminarProductoPedido = eliminarProductoPedido;

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

    const cliente = document.getElementById("cliente");
    const mesa = document.getElementById("mesa");
    const observaciones = document.getElementById("observaciones");
    cliente?.addEventListener("input", guardarPedidoTemporal);
    mesa?.addEventListener("input", guardarPedidoTemporal);
    observaciones?.addEventListener("input", guardarPedidoTemporal);
});

window.addEventListener("storage", (e) => {
    if (e.key === CLAVE_PEDIDO_TEMPORAL) {
        inicializarCantidades();
        actualizarTotal();
        if (typeof renderProductos === "function") renderProductos();
        if (typeof renderizarCarrito === "function") renderizarCarrito();
    }
});

window.addEventListener("juanekos:pedido-actualizado", () => {
    inicializarCantidades();
    actualizarTotal();
    if (typeof renderProductos === "function") renderProductos();
    if (typeof renderizarCarrito === "function") renderizarCarrito();
});
