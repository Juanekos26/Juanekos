/* ========================================
   IMPRESIÓN DE PEDIDOS
======================================== */


function imprimirPedidoPanel(id) {

    const pedido =
        buscarPedidoPanel(id);


    if (!pedido) {

        mostrarMensaje(
            "No se encontró el pedido."
        );

        return;

    }


    const productos =
        Array.isArray(
            pedido.productos
        )
            ? pedido.productos
            : [];


    const productosHTML =
        productos.map(
            producto => {

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
                    <tr>

                        <td>
                            ${escaparHTML(
                                producto.nombre
                            )}
                        </td>

                        <td>
                            ${cantidad}
                        </td>

                        <td>
                            ${formatearPrecio(
                                precio
                            )}
                        </td>

                        <td>
                            ${formatearPrecio(
                                subtotal
                            )}
                        </td>

                    </tr>
                `;

            }
        ).join("");


    const ventana =
        window.open(
            "",
            "_blank",
            "width=850,height=700"
        );


    if (!ventana) {

        mostrarMensaje(
            "El navegador bloqueó la ventana de impresión."
        );

        return;

    }


    ventana.document.write(`

        <!DOCTYPE html>

        <html lang="es">

        <head>

            <meta charset="UTF-8">

            <title>
                Pedido #${escaparHTML(
                    pedido.id
                )}
            </title>

            <style>

                * {
                    box-sizing: border-box;
                }

                body {

                    margin: 0;

                    padding: 30px;

                    font-family:
                        Arial,
                        sans-serif;

                    color: #111;

                }

                .comprobante {

                    max-width: 760px;

                    margin: auto;

                }

                header {

                    text-align: center;

                    margin-bottom: 25px;

                }

                h1 {

                    margin: 0;

                    font-size: 26px;

                }

                h2 {

                    margin: 5px 0;

                    font-size: 20px;

                }

                .datos {

                    display: grid;

                    grid-template-columns:
                        repeat(2, 1fr);

                    gap: 10px;

                    margin-bottom: 25px;

                }

                .dato {

                    padding: 10px;

                    border: 1px solid #ddd;

                }

                .dato span {

                    display: block;

                    font-size: 11px;

                    color: #666;

                    margin-bottom: 4px;

                }

                .dato strong {

                    font-size: 14px;

                }

                table {

                    width: 100%;

                    border-collapse:
                        collapse;

                }

                th,
                td {

                    padding: 10px;

                    border-bottom:
                        1px solid #ddd;

                    text-align: left;

                }

                th {

                    background: #eee;

                }

                .total {

                    margin-top: 25px;

                    text-align: right;

                    font-size: 20px;

                    font-weight: bold;

                }

                .estado {

                    margin-top: 15px;

                    text-align: right;

                    font-weight: bold;

                }

                footer {

                    margin-top: 40px;

                    text-align: center;

                    font-size: 12px;

                    color: #666;

                }

                @media print {

                    body {

                        padding: 0;

                    }

                }

            </style>

        </head>


        <body>

            <main class="comprobante">


                <header>

                    <h1>
                        JUANEKO'S
                    </h1>

                    <h2>
                        COMPROBANTE DE PEDIDO
                    </h2>

                    <strong>
                        Pedido #${escaparHTML(
                            pedido.id
                        )}
                    </strong>

                </header>


                <section class="datos">


                    <div class="dato">

                        <span>
                            CLIENTE
                        </span>

                        <strong>
                            ${escaparHTML(
                                pedido.cliente ||
                                "-"
                            )}
                        </strong>

                    </div>


                    <div class="dato">

                        <span>
                            MESA
                        </span>

                        <strong>
                            ${escaparHTML(
                                pedido.mesa ||
                                "-"
                            )}
                        </strong>

                    </div>


                    <div class="dato">

                        <span>
                            FECHA
                        </span>

                        <strong>
                            ${escaparHTML(
                                pedido.fecha ||
                                "-"
                            )}
                        </strong>

                    </div>


                    <div class="dato">

                        <span>
                            HORA
                        </span>

                        <strong>
                            ${escaparHTML(
                                pedido.hora ||
                                "-"
                            )}
                        </strong>

                    </div>


                </section>


                <table>

                    <thead>

                        <tr>

                            <th>
                                Producto
                            </th>

                            <th>
                                Cant.
                            </th>

                            <th>
                                Precio
                            </th>

                            <th>
                                Subtotal
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        ${productosHTML}

                    </tbody>

                </table>


                <div class="total">

                    TOTAL:
                    ${formatearPrecio(
                        pedido.total
                    )}

                </div>


                <div class="estado">

                    ESTADO:
                    ${obtenerTextoEstado(
                        pedido.estado
                    )}

                </div>


                <footer>

                    JUANEKO'S

                    <br>

                    Sabor que une,
                    tradición que perdura.

                </footer>


            </main>


            <script>

                window.onload = function() {

                    window.print();

                };

            <\/script>

        </body>

        </html>

    `);


    ventana.document.close();

}

