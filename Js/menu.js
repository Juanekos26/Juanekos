const cantidades = [];
const acompanamientos = {};
const indicaciones = {};

const CLAVE_PEDIDO_TEMPORAL = "juanekos_pedido_temporal";

function formatearNombreCliente(str) {
    if (!str) return '';
    return str.toLowerCase().replace(/(?:^|\s)\S/g, match => match.toUpperCase());
}

function formatearDescripcion(str) {
    if (!str) return '';
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

function leerPedidoTemporal() {
    try {
        const raw = localStorage.getItem(CLAVE_PEDIDO_TEMPORAL);
        if (raw === null) {
            return { items: [], cliente: "", mesa: "", observaciones: "" };
        }
        const datos = JSON.parse(raw || "null");
        return datos && typeof datos === "object" ? datos : { items: [], cliente: "", mesa: "", observaciones: "" };
    } catch (_) {
        return { items: [], cliente: "", mesa: "", observaciones: "" };
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
        cliente: clienteEl ? formatearNombreCliente(clienteEl.value) : (anterior.cliente || ""),
        mesa: mesaEl ? mesaEl.value : (anterior.mesa || ""),
        observaciones: observacionesEl ? formatearDescripcion(observacionesEl.value) : (anterior.observaciones || "")
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
                         porNombreNormalizado.get(normalizarTexto(producto.nombre));

        cantidades[index] = guardado ? Math.max(0, Number(guardado.cantidad) || 0) : 0;
        acompanamientos[index] = guardado?.acompanamientos ? {
            ...crearAcompanamientosVacios(),
            ...(guardado.acompanamientos || {})
        } : crearAcompanamientosVacios();
        indicaciones[index] = guardado?.indicaciones || "";
    });

    const cliente = document.getElementById("cliente");
    const mesa = document.getElementById("mesa");
    const observaciones = document.getElementById("observaciones");
    if (cliente && !cliente.value && estado.cliente) cliente.value = formatearNombreCliente(estado.cliente);
    if (mesa && !mesa.value && estado.mesa) mesa.value = estado.mesa;
    if (observaciones && !observaciones.value && estado.observaciones) observaciones.value = formatearDescripcion(estado.observaciones);
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
    const productos = obtenerProductosPedido();
    const total = productos.reduce(
        (suma, item) => suma + (Number(item.precio) || 0) * (Number(item.cantidad) || 0),
        0
    );
    return Number(total.toFixed(2));
}

function actualizarTotal() {
    const elemento = document.getElementById("total");
    if (elemento) {
        elemento.textContent = calcularTotalPedido().toFixed(2);
    }
    renderizarCarrito(); // Hook in to update cart visuals whenever total is calculated
}

function obtenerDatosCliente() {
    const clienteEl = document.getElementById("cliente");
    const mesaEl = document.getElementById("mesa");
    const observacionesEl = document.getElementById("observaciones");
    return {
        cliente: clienteEl ? formatearNombreCliente(clienteEl.value.trim()) : "",
        mesa: mesaEl ? mesaEl.value.trim() : "",
        observaciones: observacionesEl ? formatearDescripcion(observacionesEl.value.trim()) : ""
    };
}

function obtenerProductosPedido() {
    const categoriasActivas = typeof window.juanekosObtenerCategoriasActivas === 'function'
        ? window.juanekosObtenerCategoriasActivas()
        : null;

    const estado = leerPedidoTemporal();
    let itemsBase = [];

    if (estado && Array.isArray(estado.items) && estado.items.length > 0) {
        itemsBase = estado.items.filter(item => Number(item.cantidad) > 0).map((item, idx) => {
            const menuIndex = Array.isArray(menu) 
                ? menu.findIndex(p => String(p.id) === String(item.productoId || item.id) || normalizarTexto(p.nombre) === normalizarTexto(item.nombre))
                : -1;
            const categoria = item.categoria || (menuIndex >= 0 ? menu[menuIndex].categoria : 'general');
            return {
                productoId: String(item.productoId || item.id || idx),
                nombre: item.nombre || 'Producto',
                precio: Number(item.precio) || 0,
                categoria: categoria,
                cantidad: Number(item.cantidad) || 1,
                index: menuIndex >= 0 ? menuIndex : (item.index !== undefined ? item.index : idx),
                acompanamientos: item.acompanamientos || (menuIndex >= 0 ? obtenerAcompanamientos(menuIndex) : crearAcompanamientosVacios()),
                indicaciones: item.indicaciones || (menuIndex >= 0 ? indicaciones[menuIndex] : "")
            };
        });
    } else if (Array.isArray(menu)) {
        itemsBase = menu.reduce((productos, producto, index) => {
            const cantidad = obtenerCantidadProducto(index);
            if (cantidad <= 0) return productos;

            productos.push({
                productoId: String(producto.id || index),
                nombre: producto.nombre,
                precio: Number(producto.precio) || 0,
                categoria: producto.categoria || 'general',
                cantidad: cantidad,
                index: index,
                acompanamientos: obtenerAcompanamientos(index),
                indicaciones: indicaciones[index] || ""
            });

            return productos;
        }, []);
    }

    if (categoriasActivas && Array.isArray(categoriasActivas)) {
        itemsBase = itemsBase.filter(item => {
            const cat = String(item.categoria || '').toLowerCase();
            return categoriasActivas.includes(cat) || cat === 'general';
        });
    }

    return itemsBase;
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

        const esBroasterAcomp = item.categoria === 'broaster' && producto && esProductoConAcompanamiento(producto);

        const acompElegidosTexto = esBroasterAcomp
            ? TIPOS_ACOMPANAMIENTO
                .filter(tipo => Number(item.acompanamientos?.[tipo] || 0) > 0)
                .map(tipo => nombresAcomp[tipo])
                .join(', ') || 'No especificado'
            : '';

        const subtotal = (Number(item.precio) * Number(item.cantidad)).toFixed(2);
        const indicacionActual = item.indicaciones || "";

        const filaCocinaHTML = esBroasterAcomp ? `
                <div class="pedido-fila-3">
                    <div class="pedido-campo-cocina">
                        <span class="pedido-campo-cocina-label"><i class="fa-solid fa-utensils"></i> Acompañamiento del plato:</span>
                        <div class="pedido-input-cocina" style="display:flex; align-items:center; background:rgba(255,255,255,0.06); padding:10px 14px; border-radius:8px; color:var(--text-color, #fff); font-weight:600; font-size:0.95rem;">
                            ${acompElegidosTexto}
                        </div>
                    </div>
                </div>` : `
                <div class="pedido-fila-3">
                    <label class="pedido-campo-cocina">
                        <span class="pedido-campo-cocina-label"><i class="fa-solid fa-pen-to-square"></i> Indicaciones para cocina:</span>
                        <input type="text" class="pedido-input-cocina" placeholder="Ej: poco picante, ají y cremas aparte, bien frito..." 
                               value="${indicacionActual}"
                               onchange="actualizarIndicaciones(${item.index}, this.value)">
                    </label>
                </div>`;

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
                
                ${filaCocinaHTML}
            </article>`;
    }).join('');
}

window.actualizarIndicaciones = function(index, valor) {
    const formatted = formatearDescripcion(valor);
    indicaciones[index] = formatted;
    guardarPedidoTemporal();
    const inputEl = document.querySelector(`article[data-index="${index}"] .pedido-input-cocina`) ||
                    document.querySelector(`input[oninput*="actualizarIndicaciones(${index}"]`);
    if (inputEl && inputEl.value !== formatted) {
        const start = inputEl.selectionStart;
        const end = inputEl.selectionEnd;
        inputEl.value = formatted;
        if (document.activeElement === inputEl && start !== null) {
            inputEl.setSelectionRange(start, end);
        }
    }
};

function restaurarDemoScreenshot() {
    localStorage.removeItem(CLAVE_PEDIDO_TEMPORAL);
    cantidades.length = 0;
    inicializarCantidades();
    actualizarTotal();
}
window.restaurarDemoScreenshot = restaurarDemoScreenshot;

function eliminarProductoPedido(identifier) {
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

    const estado = leerPedidoTemporal();
    if (estado && Array.isArray(estado.items)) {
        estado.items = estado.items.filter((item, idx) => {
            const menuIndex = Array.isArray(menu) 
                ? menu.findIndex(p => String(p.id) === String(item.productoId || item.id) || normalizarTexto(p.nombre) === normalizarTexto(item.nombre))
                : -1;
            const match = (item.index !== undefined && Number(item.index) === Number(identifier)) ||
                          (menuIndex >= 0 && menuIndex === Number(identifier)) ||
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

    actualizarTotal();
    
    if (document.getElementById('cartItems') && typeof renderizarCarrito === 'function') {
        renderizarCarrito();
    }
}
window.eliminarProductoPedido = eliminarProductoPedido;

function normalizarParaBusqueda(str) {
    if (!str) return '';
    return String(str)
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .replace(/[^a-z0-9\s]/g, "")
        .replace(/\s+/g, " ")
        .trim();
}

window.filtrarMenu = function() {
    const input = document.getElementById("buscarPlato");
    const rawQuery = input ? input.value : "";
    const queryNorm = normalizarParaBusqueda(rawQuery);
    const queryTokens = queryNorm ? queryNorm.split(" ") : [];

    // Obtener la pestaña de categoría activa
    const activeTabBtn = document.querySelector(".categorias-tabs .tab-btn.active");
    let activeTab = 'todas';
    if (activeTabBtn) {
        const onclickAttr = activeTabBtn.getAttribute("onclick") || "";
        const match = onclickAttr.match(/'([^']+)'/);
        if (match) activeTab = match[1];
    }

    // Obtener las categorías permitidas por el modo de operación actual
    const categoriasActivas = typeof window.juanekosObtenerCategoriasActivas === 'function'
        ? window.juanekosObtenerCategoriasActivas()
        : ['menu-dia', 'cevicheria', 'broaster', 'bebidas'];

    const articulos = document.querySelectorAll("#productos .producto-card");

    articulos.forEach(art => {
        const categoria = (art.getAttribute("data-categoria") || "").toLowerCase();
        const nombreRaw = art.getAttribute("data-nombre") || art.querySelector("h3")?.textContent || "";
        const nombreNorm = normalizarParaBusqueda(nombreRaw);
        const nombreSinEspacios = normalizarTexto(nombreRaw);
        const querySinEspacios = queryNorm.replace(/\s+/g, "");

        // 1. Validar si está dentro del modo de operación activo
        const enModoActual = categoriasActivas.includes(categoria) || categoria === 'general';

        // 2. Validar si está dentro de la pestaña activa seleccionada
        const enTabActual = activeTab === 'todas' || categoria === activeTab || (activeTab === 'cevicheria' && categoria === 'menu-dia');

        // 3. Validar coincidencia con la búsqueda
        const coincideBusqueda = !queryNorm || 
            nombreSinEspacios.includes(querySinEspacios) || 
            queryTokens.every(token => nombreNorm.includes(token));

        if (enModoActual && enTabActual && coincideBusqueda) {
            art.style.display = "flex";
        } else {
            art.style.display = "none";
        }
    });

    // Controlar visibilidad de la sección de menú del día
    const menuDiaSeccion = document.querySelector(".menu-dia-seccion");
    if (menuDiaSeccion) {
        const visibleMenuDiaCards = menuDiaSeccion.querySelectorAll(".producto-card:not([style*='display: none'])");
        const permiteMenuDia = categoriasActivas.includes('menu-dia') || categoriasActivas.includes('cevicheria');
        const tabPermite = activeTab === 'todas' || activeTab === 'cevicheria';

        if (permiteMenuDia && tabPermite && visibleMenuDiaCards.length > 0) {
            menuDiaSeccion.style.display = "block";
        } else {
            menuDiaSeccion.style.display = "none";
        }
    }
};

window.filtrarCategoria = function(categoria) {
    const tabs = document.querySelectorAll(".tab-btn");
    tabs.forEach(t => t.classList.remove("active"));
    if (event && event.target) {
        event.target.classList.add("active");
    }

    // Re-aplicar el filtro completo respetando búsqueda y modo actual
    if (typeof filtrarMenu === "function") {
        filtrarMenu();
    }
};

document.addEventListener("DOMContentLoaded", () => {
    inicializarCantidades();
    actualizarTotal();

    const cliente = document.getElementById("cliente");
    const mesa = document.getElementById("mesa");
    const observaciones = document.getElementById("observaciones");
    
    if (cliente) {
        cliente.addEventListener("input", () => {
            const start = cliente.selectionStart;
            const end = cliente.selectionEnd;
            const val = cliente.value;
            const formatted = formatearNombreCliente(val);
            if (val !== formatted) {
                cliente.value = formatted;
                cliente.setSelectionRange(start, end);
            }
            guardarPedidoTemporal();
        });
    }

    if (observaciones) {
        observaciones.addEventListener("input", () => {
            const start = observaciones.selectionStart;
            const end = observaciones.selectionEnd;
            const val = observaciones.value;
            const formatted = formatearDescripcion(val);
            if (val !== formatted) {
                observaciones.value = formatted;
                observaciones.setSelectionRange(start, end);
            }
            guardarPedidoTemporal();
        });
    }

    mesa?.addEventListener("input", guardarPedidoTemporal);
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

window.addEventListener("juanekos:modo-operacion-actualizado", (e) => {
    const categoriasActivas = typeof window.juanekosObtenerCategoriasActivas === 'function'
        ? window.juanekosObtenerCategoriasActivas()
        : ['menu-dia', 'cevicheria', 'broaster', 'bebidas'];

    // Limpieza total de localStorage (juanekos_pedido_temporal) de productos que no correspondan a la categoría activa actual
    const estado = leerPedidoTemporal();
    if (estado && Array.isArray(estado.items)) {
        estado.items = estado.items.filter(item => {
            const menuIndex = Array.isArray(menu) 
                ? menu.findIndex(p => String(p.id) === String(item.productoId || item.id) || normalizarTexto(p.nombre) === normalizarTexto(item.nombre))
                : -1;
            const cat = String(item.categoria || (menuIndex >= 0 ? menu[menuIndex].categoria : 'general')).toLowerCase();
            return categoriasActivas.includes(cat) || cat === 'general';
        });

        try {
            localStorage.setItem(CLAVE_PEDIDO_TEMPORAL, JSON.stringify(estado));
            window.dispatchEvent(new CustomEvent('juanekos:pedido-actualizado', { detail: estado }));
        } catch (_) {}
    }

    // Limpieza total en memoria de cantidades, acompañamientos e indicaciones para productos fuera de la categoría activa
    if (Array.isArray(menu)) {
        menu.forEach((producto, index) => {
            const cat = String(producto.categoria || 'general').toLowerCase();
            const permitido = categoriasActivas.includes(cat) || cat === 'general';
            if (!permitido) {
                cantidades[index] = 0;
                acompanamientos[index] = crearAcompanamientosVacios();
                indicaciones[index] = "";
            }
        });
    }

    inicializarCantidades();
    actualizarTotal();
    if (typeof renderProductos === "function") renderProductos();
    if (typeof renderizarCarrito === "function") renderizarCarrito();
    if (typeof renderizarCarta === "function") renderizarCarta();
});
