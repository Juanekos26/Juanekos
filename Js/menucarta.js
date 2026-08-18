/* =====================================================
   JUANEKO'S - MENÚ DINÁMICO POR HORARIO
===================================================== */


/* =====================================================
   MODO DE PRUEBA
===================================================== */

/*
   null = horario automático real.

   Para probar manualmente:
   "broaster"
   "cevicheria"
   "cerrado"

   IMPORTANTE:
   Para publicar en Vercel debe quedar en null.
*/

const MODO_PRUEBA = null;


/* =====================================================
   MENÚ
===================================================== */

const menu = [

    /* CEVICHERÍA */

    {
        id: 1,
        categoria: "cevicheria",
        nombre: "Ceviche con chicharrón de pota",
        precio: 22
    },

    {
        id: 2,
        categoria: "cevicheria",
        nombre: "Ceviche con chicharrón de pescado",
        precio: 25
    },

    {
        id: 3,
        categoria: "cevicheria",
        nombre: "Ceviche solo",
        precio: 19
    },

    {
        id: 4,
        categoria: "cevicheria",
        nombre: "Chilcano",
        precio: 10
    },

    {
        id: 5,
        categoria: "cevicheria",
        nombre: "Chilcano con chicharrón",
        precio: 15
    },

    {
        id: 6,
        categoria: "cevicheria",
        nombre: "Chicharrón de pota",
        precio: 15
    },

    {
        id: 7,
        categoria: "cevicheria",
        nombre: "Arroz con mariscos",
        precio: 22
    },

    {
        id: 8,
        categoria: "cevicheria",
        nombre: "Chaufa con mariscos",
        precio: 20
    },

    {
        id: 9,
        categoria: "cevicheria",
        nombre: "Parihuela",
        precio: 24
    },

    {
        id: 10,
        categoria: "cevicheria",
        nombre: "Leche de tigre",
        precio: 12
    },

    {
        id: 11,
        categoria: "cevicheria",
        nombre: "Leche con chicharrón",
        precio: 15
    },

    {
        id: 12,
        categoria: "cevicheria",
        nombre: "Dúo",
        precio: 22
    },

    {
        id: 13,
        categoria: "cevicheria",
        nombre: "Trío",
        precio: 25
    },


    /* BROASTER */

    {
        id: 14,
        categoria: "broaster",
        nombre: "Entre Pierna de Broaster",
        precio: 10
    },

    {
        id: 15,
        categoria: "broaster",
        nombre: "Pecho de Broaster",
        precio: 15
    },

    {
        id: 16,
        categoria: "broaster",
        nombre: "Pierna Completa de Broaster",
        precio: 15
    },

    {
        id: 17,
        categoria: "broaster",
        nombre: "Ala con Pecho de Broaster",
        precio: 12
    },

    {
        id: 18,
        categoria: "broaster",
        nombre: "Porción de Chaufa",
        precio: 6
    },

    {
        id: 19,
        categoria: "broaster",
        nombre: "Porción de Papa",
        precio: 6
    },


    /* BEBIDAS */

    {
        id: 20,
        categoria: "bebidas",
        nombre: "Chicha - Vaso",
        precio: 2
    },

    {
        id: 21,
        categoria: "bebidas",
        nombre: "Chicha - Medio Litro",
        precio: 5
    },

    {
        id: 22,
        categoria: "bebidas",
        nombre: "Chicha - Litro",
        precio: 9
    },

    {
        id: 23,
        categoria: "bebidas",
        nombre: "Maracuyá - Vaso",
        precio: 2
    },

    {
        id: 24,
        categoria: "bebidas",
        nombre: "Maracuyá - Medio Litro",
        precio: 5
    },

    {
        id: 25,
        categoria: "bebidas",
        nombre: "Maracuyá - Litro",
        precio: 9
    }

];


/* =====================================================
   ACOMPAÑAMIENTOS
===================================================== */

const acompanamientosMenu = [

    ["🍚", "Chaufa completo", "chaufaCompleto"],

    ["🍟", "Papa + Ensalada", "papaEnsalada"],

    ["🍟", "Papa + Chaufa", "papaChaufa"],

    ["🍟", "Papa Sola", "papaSola"],

    ["🍚", "Chaufa Sola", "chaufaSola"]

];


/* =====================================================
   OBTENER PRODUCTO
===================================================== */

function obtenerProductoPorId(id) {

    return menu.find(
        producto =>
            producto.id === Number(id)
    );

}


/* =====================================================
   OBTENER CATEGORÍAS SEGÚN HORARIO
===================================================== */

function obtenerCategoriasPorHorario() {

    /* =========================
       MODO PRUEBA
    ========================= */

    if (MODO_PRUEBA === "broaster") {

        return [
            "broaster",
            "bebidas"
        ];

    }

    if (MODO_PRUEBA === "cevicheria") {

        return [
            "cevicheria",
            "bebidas"
        ];

    }

    if (MODO_PRUEBA === "cerrado") {

        return [];

    }


    /* =========================
       HORARIO REAL
    ========================= */

    const hora = new Date().getHours();


    /*
       12:00 a. m. - 10:59 a. m.
       FUERA DE HORARIO
    */

    if (hora < 11) {

        return [];

    }


    /*
       11:00 a. m. - 3:59 p. m.
       CEVICHERÍA + BEBIDAS
    */

    if (hora < 16) {

        return [
            "cevicheria",
            "bebidas"
        ];

    }


    /*
       4:00 p. m. - 11:59 p. m.
       BROASTER + BEBIDAS
    */

    return [
        "broaster",
        "bebidas"
    ];

}


/* =====================================================
   CREAR ACOMPAÑAMIENTO
===================================================== */

function crearAcompanamiento(
    index,
    icono,
    nombre,
    tipo
) {

    return `
        <div class="acompanamiento-opcion">

            <span>
                ${icono} ${nombre}
            </span>

            <div class="mini-controles">

                <button
                    type="button"
                    onclick="cambiarAcompanamiento(${index}, '${tipo}', -1)"
                    aria-label="Disminuir ${nombre}"
                >
                    −
                </button>

                <span id="${tipo}-${index}">
                    0
                </span>

                <button
                    type="button"
                    onclick="cambiarAcompanamiento(${index}, '${tipo}', 1)"
                    aria-label="Aumentar ${nombre}"
                >
                    +
                </button>

            </div>

        </div>
    `;

}


/* =====================================================
   GENERAR ACOMPAÑAMIENTOS
===================================================== */

function generarAcompanamientos(index) {

    return `
        <div class="acompanamiento">

            <strong>
                🍽️ ACOMPAÑAMIENTO
            </strong>

            ${acompanamientosMenu
                .map(
                    ([icono, nombre, tipo]) =>
                        crearAcompanamiento(
                            index,
                            icono,
                            nombre,
                            tipo
                        )
                )
                .join("")
            }

        </div>
    `;

}


/* =====================================================
   CREAR PRODUCTO
===================================================== */

function crearProductoHTML(
    producto,
    index
) {

    const cantidad =
        typeof obtenerCantidadProducto === "function"
            ? obtenerCantidadProducto(index)
            : 0;


    const acompanamientoHTML =
        producto.categoria === "broaster" &&
        !producto.nombre.startsWith("Porción")

            ? generarAcompanamientos(index)

            : "";


    return `
        <article
            class="producto"
            data-producto-id="${producto.id}"
        >

            <div class="info">

                <h3>
                    ${producto.nombre}
                </h3>

                <p>
                    S/ ${Number(
                        producto.precio
                    ).toFixed(2)}
                </p>

                <small>
                    Selecciona la cantidad
                </small>

                ${acompanamientoHTML}

            </div>


            <div class="controles">

                <button
                    type="button"
                    onclick="cambiar(${index}, -1)"
                    aria-label="Disminuir cantidad"
                >
                    −
                </button>

                <span id="cant-${index}">
                    ${cantidad}
                </span>

                <button
                    type="button"
                    onclick="cambiar(${index}, 1)"
                    aria-label="Aumentar cantidad"
                >
                    +
                </button>

            </div>

        </article>
    `;

}


/* =====================================================
   RENDERIZAR PRODUCTOS
===================================================== */

function renderProductos() {

    const contenedor =
        document.getElementById("productos");


    if (!contenedor) {

        return;

    }


    const categorias =
        obtenerCategoriasPorHorario();


    const productos =
        menu.filter(
            producto =>
                categorias.includes(
                    producto.categoria
                )
        );


    /* =========================
       FUERA DE HORARIO
    ========================= */

    if (!productos.length) {

        contenedor.innerHTML = `

            <div class="menu-fuera-horario">

                <span>🌙</span>

                <h3>
                    FUERA DE HORARIO
                </h3>

                <p>
                    En este momento no estamos
                    atendiendo pedidos.
                </p>

                <small>
                    Nuestro horario es de
                    11:00 a. m. a 11:59 p. m.
                </small>

            </div>

        `;


        if (
            typeof actualizarTotal === "function"
        ) {

            actualizarTotal();

        }

        return;

    }


    /* =========================
       CREAR PRODUCTOS
    ========================= */

    contenedor.innerHTML =
        productos
            .map(producto => {

                const index =
                    menu.findIndex(
                        item =>
                            item.id ===
                            producto.id
                    );


                if (
                    producto.categoria === "broaster" &&
                    !producto.nombre.startsWith("Porción")
                ) {

                    if (
                        typeof inicializarAcompanamientos ===
                        "function"
                    ) {

                        inicializarAcompanamientos(
                            index
                        );

                    }

                }


                return crearProductoHTML(
                    producto,
                    index
                );

            })
            .join("");


    /* =========================
       ACTUALIZAR ACOMPAÑAMIENTOS
    ========================= */

    if (
        typeof acompanamientos !== "undefined"
    ) {

        Object.keys(
            acompanamientos
        ).forEach(index => {

            if (
                typeof actualizarAcompanamientos ===
                "function"
            ) {

                actualizarAcompanamientos(
                    index
                );

            }

        });

    }


    /* =========================
       ACTUALIZAR TOTAL
    ========================= */

    if (
        typeof actualizarTotal === "function"
    ) {

        actualizarTotal();

    }

}


/* =====================================================
   INICIAR
===================================================== */

function iniciarMenu() {

    if (
        typeof inicializarCantidades ===
        "function"
    ) {

        inicializarCantidades();

    }

    renderProductos();

}


/* =====================================================
   CARGAR AL ABRIR
===================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        iniciarMenu
    );

} else {

    iniciarMenu();

}


/* =====================================================
   ACTUALIZAR CADA MINUTO
===================================================== */

setInterval(
    renderProductos,
    60000
);