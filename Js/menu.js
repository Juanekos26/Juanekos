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
    const elemento =
        document.getElementById("total");

    if (!elemento) return;

    elemento.textContent =
        calcularTotalPedido().toFixed(2);
}

function obtenerDatosCliente() {
    return {
        cliente:
            document
                .getElementById("cliente")
                ?.value
                .trim() || "",

        mesa:
            document
                .getElementById("mesa")
                ?.value
                .trim() || ""
    };
}

function obtenerProductosPedido() {
    if (!Array.isArray(menu)) {
        return [];
    }

    return menu.reduce(
        (productos, producto, index) => {

            const cantidad =
                obtenerCantidadProducto(index);

            if (cantidad <= 0) {
                return productos;
            }

            productos.push({
                productoId:
                    producto.id,

                nombre:
                    producto.nombre,

                precio:
                    Number(producto.precio) || 0,

                categoria:
                    producto.categoria,

                cantidad:
                    cantidad,

                acompanamientos:
                    obtenerAcompanamientos(index)
            });

            return productos;

        },
        []
    );
}

function obtenerPedidoActual() {
    const datos =
        obtenerDatosCliente();

    const productos =
        obtenerProductosPedido();

    return {
        cliente:
            datos.cliente,

        mesa:
            datos.mesa,

        productos:
            productos,

        total:
            calcularTotalPedido()
    };
}

function limpiarPedido() {
    if (!Array.isArray(menu)) {
        return;
    }

    menu.forEach((_, index) => {

        cantidades[index] = 0;

        acompanamientos[index] =
            crearAcompanamientosVacios();

    });

    const cliente =
        document.getElementById(
            "cliente"
        );

    const mesa =
        document.getElementById(
            "mesa"
        );

    if (cliente) {
        cliente.value = "";
    }

    if (mesa) {
        mesa.value = "";
    }

    if (
        typeof renderProductos ===
        "function"
    ) {
        renderProductos();
    }

    actualizarTotal();
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        inicializarCantidades();
        actualizarTotal();

    }
);