function obtenerPedidosFiltrados() {

    let pedidos =
        obtenerPedidosPanel();

    const filtroFecha =
        document.getElementById(
            "filtroFecha"
        );

    const filtroEstado =
        document.getElementById(
            "filtroEstado"
        );

    const buscador =
        document.getElementById(
            "buscarPedido"
        );

    const fechaSeleccionada =
        filtroFecha?.value || "";

    const estadoSeleccionado =
        filtroEstado?.value || "";

    const textoBusqueda =
        buscador?.value
            ?.trim()
            .toLowerCase() || "";

    if (fechaSeleccionada) {

        const fecha =
            convertirFechaFiltro(
                fechaSeleccionada
            );

        pedidos =
            pedidos.filter(
                pedido =>
                    pedido.fecha === fecha
            );
    }

    if (estadoSeleccionado) {

        pedidos =
            pedidos.filter(
                pedido =>
                    (
                        pedido.estado ||
                        "abierto"
                    ) === estadoSeleccionado
            );
    }

    if (textoBusqueda) {

        pedidos =
            pedidos.filter(pedido => {

                const id =
                    String(
                        pedido.id || ""
                    ).toLowerCase();

                const cliente =
                    String(
                        pedido.cliente || ""
                    ).toLowerCase();

                const mesa =
                    String(
                        pedido.mesa || ""
                    ).toLowerCase();

                return (
                    id.includes(
                        textoBusqueda
                    ) ||
                    cliente.includes(
                        textoBusqueda
                    ) ||
                    mesa.includes(
                        textoBusqueda
                    )
                );
            });
    }

    return pedidos;
}

function generarFilaPedido(pedido) {

    const estado =
        pedido.estado || "abierto";

    const cerrado =
        estado === "cerrado";

    const cancelado =
        estado === "cancelado";

    const botonCerrar =
        cerrado || cancelado
            ? `
                <button
                    type="button"
                    class="btn-cerrar-pedido"
                    disabled
                >
                    ✓ ${obtenerTextoEstado(
                        estado
                    )}
                </button>
            `
            : `
                <button
                    type="button"
                    class="btn-cerrar-pedido"
                    data-accion="cerrar"
                    data-id="${escaparHTML(
                        pedido.id
                    )}"
                >
                    ✓ CERRAR
                </button>
            `;

    return `
        <tr>

            <td>
                #${escaparHTML(
                    pedido.id
                )}
            </td>

            <td>
                ${escaparHTML(
                    pedido.fecha || "-"
                )}
            </td>

            <td>
                ${escaparHTML(
                    pedido.hora || "-"
                )}
            </td>

            <td>
                ${escaparHTML(
                    pedido.cliente || "-"
                )}
            </td>

            <td>
                ${escaparHTML(
                    pedido.mesa || "-"
                )}
            </td>

            <td>
                <strong>
                    ${formatearPrecio(
                        pedido.total
                    )}
                </strong>
            </td>

            <td>
                <span
                    class="estado-pedido estado-${escaparHTML(
                        estado
                    )}"
                >
                    ${obtenerTextoEstado(
                        estado
                    )}
                </span>
            </td>

            <td>

                <div class="acciones-pedido">

                    <button
                        type="button"
                        class="btn-ver-pedido"
                        data-accion="ver"
                        data-id="${escaparHTML(
                            pedido.id
                        )}"
                    >
                        👁️ VER
                    </button>

                    ${botonCerrar}

                </div>

            </td>

        </tr>
    `;
}

function renderizarVentas() {

    const contenedor =
        document.getElementById(
            "listaVentas"
        );

    if (!contenedor) {
        return;
    }

    const pedidos =
        obtenerPedidosFiltrados();

    if (!pedidos.length) {

        contenedor.innerHTML = `
            <tr>

                <td
                    colspan="8"
                    class="sin-ventas"
                >
                    No se encontraron pedidos.
                </td>

            </tr>
        `;

        return;
    }

    const pedidosOrdenados =
        [...pedidos].sort(
            (a, b) =>
                Number(
                    b.timestamp || 0
                ) -
                Number(
                    a.timestamp || 0
                )
        );

    contenedor.innerHTML =
        pedidosOrdenados
            .map(
                generarFilaPedido
            )
            .join("");

    configurarAccionesPedidos();
}

function configurarAccionesPedidos() {

    const botones =
        document.querySelectorAll(
            "[data-accion]"
        );

    botones.forEach(
        boton => {

            boton.addEventListener(
                "click",
                () => {

                    const accion =
                        boton.dataset.accion;

                    const id =
                        boton.dataset.id;

                    if (
                        accion === "ver"
                    ) {
                        mostrarDetallePedido(
                            id
                        );
                    }

                    if (
                        accion === "cerrar"
                    ) {
                        cerrarPedidoPanel(
                            id
                        );
                    }
                }
            );
        }
    );
}

