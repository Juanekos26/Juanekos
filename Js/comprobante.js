const CLAVE_COMPROBANTE = "juanekos_comprobante";

function imprimirPedido() {
    const cliente =
        document.getElementById("cliente")?.value.trim() || "";

    const mesa =
        document.getElementById("mesa")?.value.trim() || "";

    if (!cliente) {
        alert("Ingresa el nombre del cliente antes de imprimir.");
        document.getElementById("cliente")?.focus();
        return;
    }

    if (!mesa) {
        alert("Ingresa el número de mesa antes de imprimir.");
        document.getElementById("mesa")?.focus();
        return;
    }

    if (typeof obtenerPedidoActual !== "function") {
        alert("No se pudo obtener el pedido.");
        return;
    }

    const pedido = obtenerPedidoActual();

    if (!pedido.productos || pedido.productos.length === 0) {
        alert("Agrega al menos un producto antes de imprimir.");
        return;
    }

    const ahora = new Date();

    pedido.cliente = cliente;
    pedido.mesa = mesa;

    pedido.fecha = ahora.toLocaleDateString("es-PE", {
        day: "2-digit",
        month: "2-digit",
        year: "numeric"
    });

    pedido.hora = ahora.toLocaleTimeString("es-PE", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true
    });

    pedido.id = Date.now();

    try {
        sessionStorage.setItem(
            CLAVE_COMPROBANTE,
            JSON.stringify(pedido)
        );
    } catch (error) {
        console.error("Error al guardar comprobante:", error);
        alert("No se pudo preparar el comprobante.");
        return;
    }

    const ventana = window.open(
        "Comprobante.html",
        "_blank",
        "width=450,height=800"
    );

    if (!ventana) {
        alert(
            "No se pudo abrir el comprobante. Permite las ventanas emergentes."
        );
    }
}

function obtenerComprobante() {
    try {
        const datos =
            sessionStorage.getItem(CLAVE_COMPROBANTE);

        if (!datos) {
            return null;
        }

        return JSON.parse(datos);

    } catch (error) {
        console.error(
            "Error al leer comprobante:",
            error
        );

        return null;
    }
}

function generarProductosHTML(productos) {
    if (!Array.isArray(productos)) {
        return "";
    }

    const nombresAcompanamientos = {
        chaufaCompleto: "🍚 Chaufa completo",
        papaEnsalada: "🍟 Papa + ensalada",
        papaChaufa: "🍟 Papa + chaufa",
        papaSola: "🍟 Papa sola",
        chaufaSola: "🍚 Chaufa sola"
    };

    return productos.map(producto => {
        const cantidad =
            Number(producto.cantidad) || 0;

        const precio =
            Number(producto.precio) || 0;

        const subtotal =
            cantidad * precio;

        const acompanamientos =
            producto.acompanamientos || {};

        let acompanamientosHTML = "";

        Object.entries(
            nombresAcompanamientos
        ).forEach(([tipo, nombre]) => {

            const cantidadAcomp =
                Number(
                    acompanamientos[tipo]
                ) || 0;

            if (cantidadAcomp <= 0) {
                return;
            }

            acompanamientosHTML += `
                <div class="acompanamiento-linea">
                    <span>${nombre}</span>
                    <strong>× ${cantidadAcomp}</strong>
                </div>
            `;
        });

        return `
            <article class="producto-ticket">

                <div class="producto-principal">

                    <div class="producto-nombre">
                        <strong>
                            ${producto.nombre}
                        </strong>

                        <small>
                            S/ ${precio.toFixed(2)} c/u
                        </small>
                    </div>

                    <div class="producto-cantidad">
                        ${cantidad}
                    </div>

                    <div class="producto-subtotal">
                        S/ ${subtotal.toFixed(2)}
                    </div>

                </div>

                ${
                    acompanamientosHTML
                        ? `
                            <div class="acompanamientos-ticket">

                                <span>
                                    ACOMPAÑAMIENTOS
                                </span>

                                ${acompanamientosHTML}

                            </div>
                        `
                        : ""
                }

            </article>
        `;
    }).join("");
}

function cargarComprobante() {
    const pedido = obtenerComprobante();

    if (!pedido) {
        console.warn(
            "No existe información del comprobante."
        );
        return;
    }

    const cliente =
        document.getElementById("cliente");

    const mesa =
        document.getElementById("mesa");

    const fecha =
        document.getElementById("fecha");

    const hora =
        document.getElementById("hora");

    const productos =
        document.getElementById("productos");

    const cantidadProductos =
        document.getElementById(
            "cantidad-productos"
        );

    const total =
        document.getElementById("total");

    const numeroPedido =
        document.getElementById(
            "numero-pedido"
        );

    if (cliente) {
        cliente.textContent =
            pedido.cliente || "-";
    }

    if (mesa) {
        mesa.textContent =
            pedido.mesa || "-";
    }

    if (fecha) {
        fecha.textContent =
            pedido.fecha || "-";
    }

    if (hora) {
        hora.textContent =
            pedido.hora || "-";
    }

    if (numeroPedido) {
        numeroPedido.textContent =
            pedido.id
                ? `PEDIDO #${pedido.id}`
                : "PEDIDO";
    }

    if (productos) {
        productos.innerHTML =
            generarProductosHTML(
                pedido.productos
            );
    }

    const cantidadTotal =
        (pedido.productos || []).reduce(
            (total, producto) =>
                total +
                (Number(producto.cantidad) || 0),
            0
        );

    if (cantidadProductos) {
        cantidadProductos.textContent =
            cantidadTotal;
    }

    if (total) {
        total.textContent =
            `S/ ${Number(
                pedido.total || 0
            ).toFixed(2)}`;
    }
}

function configurarBotones() {
    const botonImprimir =
        document.getElementById(
            "btn-imprimir"
        );

    const botonCerrar =
        document.getElementById(
            "btn-cerrar"
        );

    if (botonImprimir) {
        botonImprimir.addEventListener(
            "click",
            () => {
                window.print();
            }
        );
    }

    if (botonCerrar) {
        botonCerrar.addEventListener(
            "click",
            () => {
                window.close();
            }
        );
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        if (
            document.getElementById(
                "numero-pedido"
            )
        ) {
            cargarComprobante();
            configurarBotones();
        }

    }
);