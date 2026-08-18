let pedidoEditando = null;
let productosEditando = [];

function abrirEditorPedido(pedido) {

    if (!pedido) return;

    pedidoEditando = pedido;

    productosEditando = Array.isArray(pedido.productos)
        ? pedido.productos.map(producto => ({
            productoId: Number(producto.productoId),
            nombre: producto.nombre,
            precio: Number(producto.precio) || 0,
            categoria: producto.categoria || "",
            cantidad: Number(producto.cantidad) || 0,
            acompanamientos: {
                ...(producto.acompanamientos || {})
            }
        }))
        : [];

    const editor = document.getElementById("editorPedido");
    const numero = document.getElementById("editorNumero");
    const cliente = document.getElementById("editarCliente");
    const mesa = document.getElementById("editarMesa");

    if (!editor) return;

    if (numero) {
        numero.textContent =
            pedido.numero ||
            pedido.id ||
            "—";
    }

    if (cliente) {
        cliente.value =
            pedido.cliente || "";
    }

    if (mesa) {
        mesa.value =
            pedido.mesa || "";
    }

    editor.hidden = false;

    renderizarProductosEditor();
    actualizarTotalEditor();

    editor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function renderizarProductosEditor() {

    const contenedor =
        document.getElementById(
            "editorListaProductos"
        );

    if (!contenedor) return;

    if (!productosEditando.length) {

        contenedor.innerHTML = `
            <div class="sin-productos-editor">
                <strong>No hay productos en el pedido</strong>
                <p>Agrega un producto para continuar.</p>
            </div>
        `;

        actualizarTotalEditor();

        return;
    }

    contenedor.innerHTML =
        productosEditando.map(
            (producto, index) => {

                const tieneAcompanamiento =
                    producto.categoria === "broaster" &&
                    !producto.nombre.startsWith("Porción");

                return `
                    <article
                        class="editor-producto"
                        data-producto-id="${producto.productoId}"
                    >

                        <div class="editor-producto-info">

                            <h4>
                                ${producto.nombre}
                            </h4>

                            <span>
                                S/ ${producto.precio.toFixed(2)}
                            </span>

                        </div>

                        <div class="editor-producto-control">

                            <button
                                type="button"
                                onclick="cambiarCantidadEditor(${index}, -1)"
                                aria-label="Disminuir cantidad"
                            >
                                −
                            </button>

                            <strong>
                                ${producto.cantidad}
                            </strong>

                            <button
                                type="button"
                                onclick="cambiarCantidadEditor(${index}, 1)"
                                aria-label="Aumentar cantidad"
                            >
                                +
                            </button>

                        </div>

                        ${
                            tieneAcompanamiento
                                ? renderizarAcompanamientosEditor(
                                    producto,
                                    index
                                )
                                : ""
                        }

                        <div class="editor-producto-subtotal">

                            <span>
                                Subtotal
                            </span>

                            <strong>
                                S/ ${
                                    (
                                        producto.precio *
                                        producto.cantidad
                                    ).toFixed(2)
                                }
                            </strong>

                        </div>

                        <button
                            type="button"
                            class="btn-eliminar-producto-editor"
                            onclick="eliminarProductoEditor(${index})"
                        >
                            🗑️ ELIMINAR
                        </button>

                    </article>
                `;
            }
        ).join("");
}

function renderizarAcompanamientosEditor(
    producto,
    index
) {

    if (
        typeof acompanamientosMenu ===
        "undefined"
    ) {
        return "";
    }

    if (!producto.acompanamientos) {
        producto.acompanamientos = {};
    }

    return `
        <div class="editor-acompanamientos">

            <strong>
                🍽️ ACOMPAÑAMIENTO
            </strong>

            ${acompanamientosMenu.map(
                ([icono, nombre, tipo]) => {

                    const cantidad =
                        Number(
                            producto.acompanamientos[tipo]
                        ) || 0;

                    return `
                        <div class="editor-acompanamiento">

                            <span>
                                ${icono} ${nombre}
                            </span>

                            <div class="editor-mini-control">

                                <button
                                    type="button"
                                    onclick="cambiarAcompanamientoEditor(
                                        ${index},
                                        '${tipo}',
                                        -1
                                    )"
                                >
                                    −
                                </button>

                                <strong>
                                    ${cantidad}
                                </strong>

                                <button
                                    type="button"
                                    onclick="cambiarAcompanamientoEditor(
                                        ${index},
                                        '${tipo}',
                                        1
                                    )"
                                >
                                    +
                                </button>

                            </div>

                        </div>
                    `;
                }
            ).join("")}

        </div>
    `;
}

function cambiarCantidadEditor(
    index,
    cambio
) {

    const producto =
        productosEditando[index];

    if (!producto) return;

    producto.cantidad =
        Math.max(
            0,
            Number(producto.cantidad) +
            Number(cambio)
        );

    ajustarAcompanamientosEditor(
        producto
    );

    if (producto.cantidad <= 0) {

        productosEditando.splice(
            index,
            1
        );

    }

    renderizarProductosEditor();
    actualizarTotalEditor();
}

function cambiarAcompanamientoEditor(
    index,
    tipo,
    cambio
) {

    const producto =
        productosEditando[index];

    if (!producto) return;

    if (
        producto.categoria !== "broaster" ||
        producto.nombre.startsWith("Porción")
    ) {
        return;
    }

    if (!producto.acompanamientos) {
        producto.acompanamientos = {};
    }

    const cantidadProducto =
        Number(producto.cantidad) || 0;

    if (cantidadProducto <= 0) {
        return;
    }

    const actual =
        Number(
            producto.acompanamientos[tipo]
        ) || 0;

    const nuevaCantidad =
        Math.max(
            0,
            actual + Number(cambio)
        );

    const totalActual =
        Object.values(
            producto.acompanamientos
        ).reduce(
            (total, cantidad) =>
                total +
                Number(cantidad || 0),
            0
        );

    const nuevoTotal =
        totalActual -
        actual +
        nuevaCantidad;

    if (
        nuevoTotal >
        cantidadProducto
    ) {
        return;
    }

    producto.acompanamientos[tipo] =
        nuevaCantidad;

    renderizarProductosEditor();
}

function ajustarAcompanamientosEditor(
    producto
) {

    if (!producto.acompanamientos) {
        return;
    }

    const limite =
        Number(producto.cantidad) || 0;

    let total =
        Object.values(
            producto.acompanamientos
        ).reduce(
            (suma, cantidad) =>
                suma +
                Number(cantidad || 0),
            0
        );

    if (total <= limite) {
        return;
    }

    const tipos =
        Object.keys(
            producto.acompanamientos
        );

    for (
        let i = tipos.length - 1;
        i >= 0 && total > limite;
        i--
    ) {

        const tipo = tipos[i];

        const actual =
            Number(
                producto.acompanamientos[tipo]
            ) || 0;

        const reducir =
            Math.min(
                actual,
                total - limite
            );

        producto.acompanamientos[tipo] =
            actual - reducir;

        total -= reducir;
    }
}

function eliminarProductoEditor(index) {

    if (
        !productosEditando[index]
    ) {
        return;
    }

    productosEditando.splice(
        index,
        1
    );

    renderizarProductosEditor();
    actualizarTotalEditor();
}

function abrirSelectorProductos() {

    const selector =
        document.getElementById(
            "selectorProductos"
        );

    if (!selector) return;

    selector.hidden = false;

    renderizarProductosDisponibles();

    selector.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });
}

function cerrarSelectorProductos() {

    const selector =
        document.getElementById(
            "selectorProductos"
        );

    if (selector) {
        selector.hidden = true;
    }
}

function renderizarProductosDisponibles() {

    const contenedor =
        document.getElementById(
            "listaProductosDisponibles"
        );

    if (!contenedor) return;

    if (
        typeof menu === "undefined" ||
        !Array.isArray(menu)
    ) {

        contenedor.innerHTML = `
            <p>
                No se pudieron cargar los productos.
            </p>
        `;

        return;
    }

    contenedor.innerHTML =
        menu.map(
            producto => `
                <button
                    type="button"
                    class="producto-disponible"
                    onclick="agregarProductoEditor(${producto.id})"
                >

                    <span>
                        ${producto.nombre}
                    </span>

                    <strong>
                        S/ ${Number(
                            producto.precio
                        ).toFixed(2)}
                    </strong>

                </button>
            `
        ).join("");
}

function agregarProductoEditor(
    productoId
) {

    if (
        typeof menu === "undefined" ||
        !Array.isArray(menu)
    ) {
        return;
    }

    const producto =
        menu.find(
            item =>
                Number(item.id) ===
                Number(productoId)
        );

    if (!producto) return;

    const existente =
        productosEditando.find(
            item =>
                Number(item.productoId) ===
                Number(producto.id)
        );

    if (existente) {

        existente.cantidad++;

    } else {

        productosEditando.push({

            productoId:
                Number(producto.id),

            nombre:
                producto.nombre,

            precio:
                Number(producto.precio) || 0,

            categoria:
                producto.categoria,

            cantidad:
                1,

            acompanamientos:
                {}

        });
    }

    renderizarProductosEditor();
    actualizarTotalEditor();

    cerrarSelectorProductos();
}

function calcularTotalEditor() {

    return productosEditando.reduce(
        (total, producto) =>
            total +
            (
                Number(producto.precio) || 0
            ) *
            (
                Number(producto.cantidad) || 0
            ),
        0
    );
}

function actualizarTotalEditor() {

    const elemento =
        document.getElementById(
            "editorTotal"
        );

    if (!elemento) return;

    elemento.textContent =
        `S/ ${calcularTotalEditor().toFixed(2)}`;
}

function obtenerPedidoEditado() {

    const cliente =
        document
            .getElementById(
                "editarCliente"
            )
            ?.value
            .trim() || "";

    const mesa =
        document
            .getElementById(
                "editarMesa"
            )
            ?.value
            .trim() || "";

    return {

        ...pedidoEditando,

        cliente,

        mesa,

        productos:
            productosEditando.map(
                producto => ({
                    ...producto,
                    cantidad:
                        Number(
                            producto.cantidad
                        ) || 0,
                    precio:
                        Number(
                            producto.precio
                        ) || 0
                })
            ),

        total:
            Number(
                calcularTotalEditor().toFixed(2)
            )
    };
}

function guardarCambiosPedido() {

    if (!pedidoEditando) {
        return;
    }

    const cliente =
        document
            .getElementById(
                "editarCliente"
            )
            ?.value
            .trim() || "";

    const mesa =
        document
            .getElementById(
                "editarMesa"
            )
            ?.value
            .trim() || "";

    if (!cliente) {

        alert(
            "Ingresa el nombre del cliente."
        );

        return;
    }

    if (!mesa) {

        alert(
            "Ingresa el número de mesa."
        );

        return;
    }

    if (!productosEditando.length) {

        alert(
            "El pedido debe tener al menos un producto."
        );

        return;
    }

    const pedidoActualizado =
        obtenerPedidoEditado();

    const pedidos =
        obtenerPedidosGuardados();

    const indice =
        pedidos.findIndex(
            pedido =>
                identificarPedido(
                    pedido
                ) ===
                identificarPedido(
                    pedidoActualizado
                )
        );

    if (indice === -1) {

        alert(
            "No se encontró el pedido para actualizar."
        );

        return;
    }

    pedidos[indice] =
        pedidoActualizado;

    guardarPedidosGuardados(
        pedidos
    );

    pedidoEditando =
        pedidoActualizado;

    alert(
        "Pedido actualizado correctamente."
    );

    cerrarEditorPedido();

    if (
        typeof actualizarPanel ===
        "function"
    ) {

        actualizarPanel();

    }
}

function obtenerPedidosGuardados() {

    try {

        const datos =
            localStorage.getItem(
                "pedidos"
            );

        const pedidos =
            datos
                ? JSON.parse(datos)
                : [];

        return Array.isArray(pedidos)
            ? pedidos
            : [];

    } catch (error) {

        console.error(
            "Error leyendo pedidos:",
            error
        );

        return [];
    }
}

function guardarPedidosGuardados(
    pedidos
) {

    localStorage.setItem(
        "pedidos",
        JSON.stringify(pedidos)
    );
}

function identificarPedido(
    pedido
) {

    if (
        pedido?.id !== undefined &&
        pedido?.id !== null
    ) {

        return `id:${pedido.id}`;
    }

    if (
        pedido?.numero !== undefined &&
        pedido?.numero !== null
    ) {

        return `numero:${pedido.numero}`;
    }

    if (
        pedido?.fecha &&
        pedido?.hora
    ) {

        return `fecha:${pedido.fecha}|hora:${pedido.hora}`;
    }

    return "";
}

function cerrarEditorPedido() {

    const editor =
        document.getElementById(
            "editorPedido"
        );

    if (editor) {
        editor.hidden = true;
    }

    cerrarSelectorProductos();

    pedidoEditando = null;
    productosEditando = [];
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const agregar =
            document.getElementById(
                "btnAgregarProducto"
            );

        const cerrarSelector =
            document.getElementById(
                "cerrarSelectorProductos"
            );

        if (agregar) {

            agregar.addEventListener(
                "click",
                abrirSelectorProductos
            );

        }

        if (cerrarSelector) {

            cerrarSelector.addEventListener(
                "click",
                cerrarSelectorProductos
            );

        }

    }
);