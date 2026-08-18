/* ========================================
   EDITOR DE PEDIDOS
======================================== */

let pedidoEnEdicion = null;


/* ========================================
   EDITAR PEDIDO
======================================== */

function editarPedidoPanel(id) {

    const pedido =
        buscarPedidoPanel(id);


    if (!pedido) {

        mostrarMensaje(
            "No se encontró el pedido."
        );

        return;

    }


    const estado =
        normalizarEstado(
            pedido.estado
        );


    if (
        estado === "cerrado" ||
        estado === "cancelado"
    ) {

        mostrarMensaje(
            "Este pedido no puede editarse."
        );

        return;

    }


    pedidoEnEdicion =
        clonarPedidoPanel(
            pedido
        );


    const editor =
        document.getElementById(
            "editorPedido"
        );


    const numero =
        document.getElementById(
            "editorNumero"
        );


    const cliente =
        document.getElementById(
            "editarCliente"
        );


    const mesa =
        document.getElementById(
            "editarMesa"
        );


    if (
        !editor ||
        !numero ||
        !cliente ||
        !mesa
    ) {

        return;

    }


    numero.textContent =
        `#${pedido.id}`;


    cliente.value =
        pedido.cliente || "";


    mesa.value =
        pedido.mesa || "";


    renderizarProductosEditor();


    editor.hidden = false;


    editor.scrollIntoView({
        behavior: "smooth",
        block: "start"
    });

}


/* ========================================
   RENDERIZAR PRODUCTOS
======================================== */

function renderizarProductosEditor() {

    const contenedor =
        document.getElementById(
            "editorListaProductos"
        );


    if (
        !contenedor ||
        !pedidoEnEdicion
    ) {

        return;

    }


    const productos =
        Array.isArray(
            pedidoEnEdicion.productos
        )
            ? pedidoEnEdicion.productos
            : [];


    if (!productos.length) {

        contenedor.innerHTML = `
            <div class="editor-sin-productos">

                No hay productos en este pedido.

            </div>
        `;

        actualizarTotalEditor();

        return;

    }


    contenedor.innerHTML =
        productos.map(
            (
                producto,
                index
            ) => {

                const cantidad =
                    Number(
                        producto.cantidad || 0
                    );


                const precio =
                    Number(
                        producto.precio || 0
                    );


                const subtotal =
                    cantidad * precio;


                return `
                    <article
                        class="editor-producto"
                    >

                        <div
                            class="editor-producto-info"
                        >

                            <strong>
                                ${escaparHTML(
                                    producto.nombre
                                )}
                            </strong>

                            <small>
                                ${formatearPrecio(
                                    precio
                                )} por unidad
                            </small>

                        </div>


                        <div
                            class="editor-producto-controles"
                        >

                            <button
                                type="button"
                                data-editor-accion="menos"
                                data-index="${index}"
                            >
                                −
                            </button>


                            <strong>
                                ${cantidad}
                            </strong>


                            <button
                                type="button"
                                data-editor-accion="mas"
                                data-index="${index}"
                            >
                                +
                            </button>


                            <span>
                                ${formatearPrecio(
                                    subtotal
                                )}
                            </span>


                            <button
                                type="button"
                                class="editor-eliminar"
                                data-editor-accion="eliminar"
                                data-index="${index}"
                                title="Eliminar producto"
                            >
                                🗑️
                            </button>

                        </div>

                    </article>
                `;

            }
        ).join("");


    configurarAccionesEditor();

    actualizarTotalEditor();

}


/* ========================================
   CAMBIAR CANTIDAD
======================================== */

function cambiarCantidadEditor(
    index,
    cantidad
) {

    if (!pedidoEnEdicion) {
        return;
    }


    const producto =
        pedidoEnEdicion.productos?.[
            index
        ];


    if (!producto) {
        return;
    }


    producto.cantidad =
        Math.max(
            0,
            Number(
                producto.cantidad || 0
            ) + Number(cantidad)
        );


    if (
        producto.cantidad <= 0
    ) {

        pedidoEnEdicion.productos
            .splice(index, 1);

    }


    recalcularPedidoEditor();

    renderizarProductosEditor();

}


/* ========================================
   ELIMINAR
======================================== */

function eliminarProductoEditor(
    index
) {

    if (!pedidoEnEdicion) {
        return;
    }


    const producto =
        pedidoEnEdicion.productos?.[
            index
        ];


    if (!producto) {
        return;
    }


    const confirmar =
        confirmarAccion(
            `¿Eliminar "${producto.nombre}" del pedido?`
        );


    if (!confirmar) {
        return;
    }


    pedidoEnEdicion.productos
        .splice(index, 1);


    recalcularPedidoEditor();

    renderizarProductosEditor();

}


/* ========================================
   ACCIONES EDITOR
======================================== */

function configurarAccionesEditor() {

    const botones =
        document.querySelectorAll(
            "[data-editor-accion]"
        );


    botones.forEach(
        boton => {

            boton.onclick = () => {

                const accion =
                    boton.dataset.editorAccion;


                const index =
                    Number(
                        boton.dataset.index
                    );


                if (
                    accion === "mas"
                ) {

                    cambiarCantidadEditor(
                        index,
                        1
                    );

                }


                if (
                    accion === "menos"
                ) {

                    cambiarCantidadEditor(
                        index,
                        -1
                    );

                }


                if (
                    accion === "eliminar"
                ) {

                    eliminarProductoEditor(
                        index
                    );

                }

            };

        }
    );

}


/* ========================================
   RECALCULAR
======================================== */

function recalcularPedidoEditor() {

    if (!pedidoEnEdicion) {
        return;
    }


    pedidoEnEdicion.total =
        calcularTotalProductos(
            pedidoEnEdicion.productos
        );

}


/* ========================================
   TOTAL
======================================== */

function actualizarTotalEditor() {

    const elemento =
        document.getElementById(
            "editorTotal"
        );


    if (!elemento) {
        return;
    }


    const total =
        pedidoEnEdicion
            ? calcularTotalProductos(
                pedidoEnEdicion.productos
            )
            : 0;


    elemento.textContent =
        formatearPrecio(
            total
        );

}


/* ========================================
   GUARDAR
======================================== */

function guardarCambiosPedido() {

    if (!pedidoEnEdicion) {

        mostrarMensaje(
            "No hay ningún pedido en edición."
        );

        return;

    }


    const cliente =
        document.getElementById(
            "editarCliente"
        );


    const mesa =
        document.getElementById(
            "editarMesa"
        );


    if (!cliente || !mesa) {
        return;
    }


    const nombre =
        cliente.value.trim();


    const numeroMesa =
        mesa.value.trim();


    if (!nombre) {

        mostrarMensaje(
            "Ingresa el nombre del cliente."
        );

        cliente.focus();

        return;

    }


    if (!numeroMesa) {

        mostrarMensaje(
            "Ingresa el número de mesa."
        );

        mesa.focus();

        return;

    }


    pedidoEnEdicion.cliente =
        nombre;


    pedidoEnEdicion.mesa =
        numeroMesa;


    recalcularPedidoEditor();


    if (
        typeof actualizarPedido !==
        "function"
    ) {

        mostrarMensaje(
            "No se encontró actualizarPedido()."
        );

        return;

    }


    const resultado =
        actualizarPedido(
            pedidoEnEdicion
        );


    if (!resultado) {

        mostrarMensaje(
            "No se pudieron guardar los cambios."
        );

        return;

    }


    mostrarMensaje(
        `Pedido #${pedidoEnEdicion.id} actualizado correctamente.`
    );


    const id =
        pedidoEnEdicion.id;


    cerrarEditorPedido();


    actualizarPanel();


    mostrarDetallePedido(
        id
    );

}


/* ========================================
   CERRAR EDITOR
======================================== */

function cerrarEditorPedido() {

    const editor =
        document.getElementById(
            "editorPedido"
        );


    if (editor) {
        editor.hidden = true;
    }


    pedidoEnEdicion = null;

}


/* ========================================
   AGREGAR PRODUCTO
======================================== */

function agregarProductoEditor(
    producto
) {

    if (
        !pedidoEnEdicion ||
        !producto
    ) {

        return;

    }


    if (
        !Array.isArray(
            pedidoEnEdicion.productos
        )
    ) {

        pedidoEnEdicion.productos = [];

    }


    const existente =
        pedidoEnEdicion.productos.find(
            item =>
                Number(
                    item.productoId
                ) === Number(
                    producto.id
                )
        );


    if (existente) {

        existente.cantidad =
            Number(
                existente.cantidad || 0
            ) + 1;

    } else {

        pedidoEnEdicion.productos.push({

            productoId:
                producto.id,

            nombre:
                producto.nombre,

            precio:
                Number(
                    producto.precio
                ) || 0,

            categoria:
                producto.categoria || "",

            cantidad:
                1,

            acompanamientos:
                {}

        });

    }


    recalcularPedidoEditor();

    renderizarProductosEditor();

}