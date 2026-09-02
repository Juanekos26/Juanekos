/* =========================================
JUANEKO'S
ARCHIVO PRINCIPAL
========================================= */

document.addEventListener(
"DOMContentLoaded",
() => {

    /*
     * La carta se renderiza solamente
     * cuando existe #productos.
     */

    if (
        typeof renderProductos === "function"
    ) {

        renderProductos();

    }

}

);