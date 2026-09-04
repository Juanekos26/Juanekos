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
        precio: 22,
        imagen_url: "../Imagenes/Ceviche/CevicheChicharonPota.png"
    },

    {
        id: 2,
        categoria: "cevicheria",
        nombre: "Ceviche con chicharrón de pescado",
        precio: 25,
        imagen_url: "../Imagenes/Ceviche/CevicheChicharonPescado.png"
    },

    {
        id: 3,
        categoria: "cevicheria",
        nombre: "Ceviche solo",
        precio: 19,
        imagen_url: "../Imagenes/Ceviche/CevicheSolo.png"
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
        precio: 15,
        imagen_url: "../Imagenes/Ceviche/ChicharronPota.png"
    },

    {
        id: 7,
        categoria: "cevicheria",
        nombre: "Arroz con mariscos",
        precio: 22,
        imagen_url: "../Imagenes/Ceviche/ArrozMarisco.png"
    },

    {
        id: 8,
        categoria: "cevicheria",
        nombre: "Chaufa con mariscos",
        precio: 20,
        imagen_url: "../Imagenes/Ceviche/ChaufaMarisco.png"
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
        precio: 10,
        imagen_url: "../Imagenes/Broaster/BroasterEntrePierna.png"
    },

    {
        id: 15,
        categoria: "broaster",
        nombre: "Pecho de Broaster",
        precio: 15,
        imagen_url: "../Imagenes/Broaster/BroasterPecho.png"
    },

    {
        id: 16,
        categoria: "broaster",
        nombre: "Pierna Completa de Broaster",
        precio: 15,
        imagen_url: "../Imagenes/Broaster/BroasterPiernaCompleta.png"
    },

    {
        id: 17,
        categoria: "broaster",
        nombre: "Ala con Pecho de Broaster",
        precio: 13,
        imagen_url: "../Imagenes/Broaster/BroasterAla.png"
    },

    {
        id: 18,
        categoria: "broaster",
        nombre: "Porción de Chaufa",
        precio: 6,
        imagen_url: "../Imagenes/Broaster/PorcionChaufa.png"
    },

    {
        id: 19,
        categoria: "broaster",
        nombre: "Porción de Papa",
        precio: 6,
        imagen_url: "../Imagenes/Broaster/PorcionPapa.png"
    },

    {
        id: 26,
        categoria: "broaster",
        nombre: "Salchipapa",
        precio: 10,
        imagen_url: "../Imagenes/Broaster/Salchipapa.png"
    },

    {
        id: 27,
        categoria: "broaster",
        nombre: "Broaster Salchipapa",
        precio: 13,
        imagen_url: "../Imagenes/Broaster/BroasterSalchipapa.png"
    },


    /* BEBIDAS */

    {
        id: 20,
        categoria: "bebidas",
        nombre: "Chicha - Vaso",
        precio: 2,
        imagen_url: "../Imagenes/Bebida/VasoChicha.jpg"
    },

    {
        id: 21,
        categoria: "bebidas",
        nombre: "Chicha - Medio Litro",
        precio: 5,
        imagen_url: "../Imagenes/Bebida/MedioLitroChicha.jpg"
    },

    {
        id: 22,
        categoria: "bebidas",
        nombre: "Chicha - Litro",
        precio: 9,
        imagen_url: "../Imagenes/Bebida/LitroChicha.jpg"
    },

    {
        id: 23,
        categoria: "bebidas",
        nombre: "Maracuyá - Vaso",
        precio: 2,
        imagen_url: "../Imagenes/Bebida/VasoMaracuya.jpg"
    },

    {
        id: 24,
        categoria: "bebidas",
        nombre: "Maracuyá - Medio Litro",
        precio: 5,
        imagen_url: "../Imagenes/Bebida/MedioLitroMaracuya.jpg"
    },

    {
        id: 25,
        categoria: "bebidas",
        nombre: "Maracuyá - Litro",
        precio: 9,
        imagen_url: "../Imagenes/Bebida/LitroMaracuya.jpg"
    },

    /* PLATOS PRINCIPALES Y CRIOLLOS */

    {
        id: 28,
        categoria: "criollo",
        nombre: "Lomo Saltado",
        descripcion: "Lomo de res, cebolla, tomate, papas fritas",
        precio: 25,
        imagen_url: "../Imagenes/Platos/lomo_saltado.jpg"
    },

    {
        id: 29,
        categoria: "criollo",
        nombre: "Ají de Gallina",
        descripcion: "Ají de gallina, papas, huevo y aceituna",
        precio: 25,
        imagen_url: "../Imagenes/Platos/aji_de_gallina.jpg"
    },

    {
        id: 30,
        categoria: "cevicheria",
        nombre: "Ceviche Mixto",
        descripcion: "Ceviche mixto, pescado, mariscos, camote y choclo",
        precio: 25,
        imagen_url: "../Imagenes/Platos/ceviche_mixto.jpg"
    },

    {
        id: 31,
        categoria: "entradas",
        nombre: "Papa a la Huancaina",
        descripcion: "Papa a la Huancaína, Papa huancaína",
        precio: 25,
        imagen_url: "../Imagenes/Platos/papa_huancaina.jpg"
    },

    {
        id: 32,
        categoria: "criollo",
        nombre: "Arroz con Pollo",
        descripcion: "Arroz con Pollo",
        precio: 25,
        imagen_url: "../Imagenes/Platos/arroz_con_pollo.jpg"
    },

    {
        id: 33,
        categoria: "criollo",
        nombre: "Tallarines Rojos",
        descripcion: "Tallarines Rojos, Tallarines, salsa y presas",
        precio: 25,
        imagen_url: "../Imagenes/Platos/tallarines_rojos.jpg"
    },

    {
        id: 34,
        categoria: "entradas",
        nombre: "Causa Rellena",
        descripcion: "Lomo de res o pollo, cebolla, tomate, papas fritas",
        precio: 25,
        imagen_url: "../Imagenes/Platos/causa_rellena.jpg"
    },

    {
        id: 35,
        categoria: "entradas",
        nombre: "Causa Rellena",
        descripcion: "Causa de atún o pollo, cebolla, tomate, palta",
        precio: 25,
        imagen_url: "../Imagenes/Platos/causa_rellena.jpg"
    }

];




/* =====================================================
   IMÁGENES LOCALES DEL CATÁLOGO
   Se usan cuando Supabase no tiene imagen_url.
===================================================== */

const IMAGENES_LOCALES_PRODUCTOS = {
    "lomo saltado": "../Imagenes/Platos/lomo_saltado.jpg",
    "ají de gallina": "../Imagenes/Platos/aji_de_gallina.jpg",
    "aji de gallina": "../Imagenes/Platos/aji_de_gallina.jpg",
    "ceviche mixto": "../Imagenes/Platos/ceviche_mixto.jpg",
    "papa a la huancaina": "../Imagenes/Platos/papa_huancaina.jpg",
    "papa a la huancaína": "../Imagenes/Platos/papa_huancaina.jpg",
    "arroz con pollo": "../Imagenes/Platos/arroz_con_pollo.jpg",
    "tallarines rojos": "../Imagenes/Platos/tallarines_rojos.jpg",
    "causa rellena": "../Imagenes/Platos/causa_rellena.jpg",
    "ceviche con chicharrón de pota": "../Imagenes/Ceviche/CevicheChicharonPota.png",
    "ceviche con chicharron de pota": "../Imagenes/Ceviche/CevicheChicharonPota.png",
    "ceviche con chicharrón de pescado": "../Imagenes/Ceviche/CevicheChicharonPescado.png",
    "ceviche con chicharron de pescado": "../Imagenes/Ceviche/CevicheChicharonPescado.png",
    "arroz con mariscos": "../Imagenes/Ceviche/ArrozMarisco.png",
    "ceviche solo": "../Imagenes/Ceviche/CevicheSolo.png",
    "chicharrón de pota": "../Imagenes/Ceviche/ChicharronPota.png",
    "chicharron de pota": "../Imagenes/Ceviche/ChicharronPota.png",
    "chaufa con mariscos": "../Imagenes/Ceviche/ChaufaMarisco.png",
    "entre pierna de broaster": "../Imagenes/Broaster/BroasterEntrePierna.png",
    "pecho de broaster": "../Imagenes/Broaster/BroasterPecho.png",
    "pierna completa de broaster": "../Imagenes/Broaster/BroasterPiernaCompleta.png",
    "ala con pecho de broaster": "../Imagenes/Broaster/BroasterAla.png",
    "salchipapa": "../Imagenes/Broaster/Salchipapa.png",
    "broaster salchipapa": "../Imagenes/Broaster/BroasterSalchipapa.png",
    "porción de chaufa": "../Imagenes/Broaster/PorcionChaufa.png",
    "porcion de chaufa": "../Imagenes/Broaster/PorcionChaufa.png",
    "porción de papa": "../Imagenes/Broaster/PorcionPapa.png",
    "porcion de papa": "../Imagenes/Broaster/PorcionPapa.png",
    "chicha - vaso": "../Imagenes/Bebida/VasoChicha.jpg",
    "chicha - medio litro": "../Imagenes/Bebida/MedioLitroChicha.jpg",
    "chicha - litro": "../Imagenes/Bebida/LitroChicha.jpg",
    "maracuyá - vaso": "../Imagenes/Bebida/VasoMaracuya.jpg",
    "maracuya - vaso": "../Imagenes/Bebida/VasoMaracuya.jpg",
    "maracuyá - medio litro": "../Imagenes/Bebida/MedioLitroMaracuya.jpg",
    "maracuya - medio litro": "../Imagenes/Bebida/MedioLitroMaracuya.jpg",
    "maracuyá - litro": "../Imagenes/Bebida/LitroMaracuya.jpg",
    "maracuya - litro": "../Imagenes/Bebida/LitroMaracuya.jpg"
};

function normalizarNombreImagenProducto(nombre) {
    return String(nombre || "")
        .trim()
        .toLowerCase()
        .replace(/\s+/g, " ");
}

function normalizarRutaImagenProducto(ruta) {
    const valor = String(ruta || "").trim();
    if (!valor) return "";
    if (/^(https?:)?\/\//i.test(valor) || valor.startsWith("data:") || valor.startsWith("blob:")) return valor;
    if (valor.startsWith("../") || valor.startsWith("./") || valor.startsWith("/")) return valor;
    // Las rutas guardadas en Supabase como Broaster/..., Bebida/... se usan desde Html/Menu.html.
    return `../${valor.replace(/^\/+/, "")}`;
}

function obtenerImagenProducto(producto) {
    if (producto?.imagen_url) return normalizarRutaImagenProducto(producto.imagen_url);
    const nombre = normalizarNombreImagenProducto(producto?.nombre);
    return IMAGENES_LOCALES_PRODUCTOS[nombre] || "../Imagenes/Portada/hero.jpg";
}


/* =====================================================
   MENÚ DEL DÍA DINÁMICO
   Solo se muestra durante el turno de cevichería.
===================================================== */

function sincronizarMenuDelDiaEnCatalogo() {
    if (!Array.isArray(menu)) return;

    for (let i = menu.length - 1; i >= 0; i--) {
        if (menu[i]?.categoria === "menu-dia" || menu[i]?.esMenuDia) {
            menu.splice(i, 1);
        }
    }

    if (typeof obtenerMenuDiaHoy !== "function") return;

    obtenerMenuDiaHoy(false).forEach(item => {
        menu.push({
            id: String(item.id),
            categoria: "menu-dia",
            tipo: item.tipo,
            nombre: item.nombre,
            precio: Number(item.precio) || 0,
            descripcion: item.descripcion || "",
            imagen_url: item.imagen_url || "",
            fecha: item.fecha,
            esMenuDia: true
        });
    });
}


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
            String(producto.id) === String(id)
    );

}


/* =====================================================
   OBTENER CATEGORÍAS SEGÚN HORARIO
===================================================== */

function obtenerCategoriasPorHorario() {

    if (typeof window.juanekosObtenerCategoriasActivas === "function") {
        return window.juanekosObtenerCategoriasActivas();
    }

    const hora = new Date().getHours();
    if (hora < 11) return [];
    if (hora < 16) return ["menu-dia", "cevicheria", "bebidas"];
    return ["broaster", "bebidas"];
}



/* =====================================================
   CREAR ACOMPAÑAMIENTO
===================================================== */

function crearAcompanamiento(index, icono, nombre, tipo) {
    return `
        <div class="acompanamiento-item">
            <span>${icono} ${nombre}</span>
            <div class="mini-controles">
                <button type="button" onclick="cambiarAcompanamiento(${index}, '${tipo}', -1)" aria-label="Disminuir ${nombre}">−</button>
                <span id="${tipo}-${index}">0</span>
                <button type="button" onclick="cambiarAcompanamiento(${index}, '${tipo}', 1)" aria-label="Aumentar ${nombre}">+</button>
            </div>
        </div>
    `;
}

/* =====================================================
   GENERAR ACOMPAÑAMIENTOS
===================================================== */

function generarAcompanamientos(index) {
    return `
        <div class="acompanamientos-box">
            <strong>🍽️ ACOMPAÑAMIENTO</strong>
            ${acompanamientosMenu.map(([icono, nombre, tipo]) => crearAcompanamiento(index, icono, nombre, tipo)).join("")}
        </div>
    `;
}

function escaparHTMLMenu(valor) {
    return String(valor ?? "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#039;");
}

/* =====================================================
   CREAR PRODUCTO
===================================================== */

function crearProductoHTML(producto, index) {
    const cantidad = typeof obtenerCantidadProducto === "function" ? obtenerCantidadProducto(index) : 0;
    const acompanamientoHTML = producto.categoria === "broaster" && !producto.nombre.startsWith("Porción")
        ? generarAcompanamientos(index) : "";

    const isMenuDia = producto.categoria === "menu-dia";
    const badgeText = isMenuDia ? (producto.tipo === "entrada" ? "Entrada" : "Segundo") : 
                      (producto.categoria === "cevicheria" ? "Cevichería" : 
                       producto.categoria === "broaster" ? "Broaster" : "Bebida");
                       
    // Usa una imagen genérica si no hay URL (como es normal en el array estático)
    const imagenUrl = obtenerImagenProducto(producto);

    return `
        <article class="producto-card" data-producto-id="${producto.id}" data-categoria="${producto.categoria}" data-nombre="${escaparHTMLMenu(producto.nombre).toLowerCase()}">
            <div class="producto-img-container">
                <img src="${imagenUrl}" alt="${escaparHTMLMenu(producto.nombre)}" loading="lazy">
                <span class="producto-badge">${badgeText}</span>
            </div>
            <div class="producto-info">
                <h3>${escaparHTMLMenu(producto.nombre)}</h3>
                ${producto.descripcion ? `<p class="producto-desc">${escaparHTMLMenu(producto.descripcion)}</p>` : `<p class="producto-desc"></p>`}
                
                <div class="producto-footer">
                    <span class="producto-precio">S/ ${Number(producto.precio).toFixed(2)}</span>
                    <div class="cantidad-controles">
                        <button class="cantidad-btn" type="button" onclick="cambiar(${index}, -1)" aria-label="Disminuir cantidad">−</button>
                        <span class="cantidad-valor" id="cant-${index}">${cantidad}</span>
                        <button class="cantidad-btn" type="button" onclick="cambiar(${index}, 1)" aria-label="Aumentar cantidad">+</button>
                    </div>
                </div>
                ${acompanamientoHTML}
            </div>
        </article>
    `;
}

/* =====================================================
   RENDERIZAR PRODUCTOS
===================================================== */

function renderProductos() {

    if (typeof sincronizarMenuDelDiaEnCatalogo === "function") {
        sincronizarMenuDelDiaEnCatalogo();
    }

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

                <i class="fa-solid fa-store-slash" style="font-size: 3rem; color: var(--accent); margin-bottom: 10px;"></i>

                <h3>
                    FUERA DE HORARIO
                </h3>

                <p>
                    En este momento no estamos
                    atendiendo pedidos.
                </p>

                <small>
                    11:00 a. m. - 3:59 p. m.: Cevichería<br>
                    4:00 p. m. - 11:59 p. m.: Broaster
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

    const renderProducto = producto => {
        const index = menu.findIndex(item => String(item.id) === String(producto.id));

        if (
            producto.categoria === "broaster" &&
            !producto.nombre.startsWith("Porción") &&
            typeof inicializarAcompanamientos === "function"
        ) {
            inicializarAcompanamientos(index);
        }

        return crearProductoHTML(producto, index);
    };

    const menuDia = productos.filter(producto => producto.categoria === "menu-dia");
    const productosFijos = productos.filter(producto => producto.categoria !== "menu-dia");

    // Orden visual personalizado para Broaster.
    // Mantiene el resto del catálogo en su orden actual y coloca:
    // Pierna Completa -> Salchipapa -> Porción de Chaufa -> Porción de Papa.
    const ordenBroaster = [
        "ala con pecho de broaster",
        "entre pierna de broaster",
        "pecho de broaster",
        "pierna completa de broaster",
        "salchipapa",
        "broaster salchipapa",
        "porción de chaufa",
        "porcion de chaufa",
        "porción de papa",
        "porcion de papa"
    ];

    productosFijos.sort((a, b) => {
        if (a.categoria !== "broaster" || b.categoria !== "broaster") return 0;
        const nombreA = String(a.nombre || "").trim().toLowerCase();
        const nombreB = String(b.nombre || "").trim().toLowerCase();
        const posA = ordenBroaster.indexOf(nombreA);
        const posB = ordenBroaster.indexOf(nombreB);
        const ordenA = posA === -1 ? 999 : posA;
        const ordenB = posB === -1 ? 999 : posB;
        return ordenA - ordenB;
    });

    let html = "";

    if (menuDia.length) {
        const entradas = menuDia.filter(producto => producto.tipo === "entrada");
        const segundos = menuDia.filter(producto => producto.tipo !== "entrada");

        const grupo = (titulo, icono, items) => items.length ? `
            <section class="menu-dia-grupo">
                <div class="menu-dia-grupo-titulo"><span>${icono}</span><h3>${titulo}</h3></div>
                <div class="menu-dia-grupo-grid">${items.map(renderProducto).join("")}</div>
            </section>` : "";

        html += `
            <section class="menu-dia-seccion">
                <div class="menu-dia-hero">
                    <span>Disponible solo hoy · turno cevichería</span>
                    <h2>Menú del día</h2>
                    <p>Entradas y segundos preparados para hoy. Disponibles de 11:00 a. m. a 3:59 p. m.</p>
                </div>
                ${grupo("Entradas", "🥗", entradas)}
                ${grupo("Segundos", "🍛", segundos)}
            </section>`;
    }

    html += productosFijos.map(renderProducto).join("");
    contenedor.innerHTML = html;


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

async function cargarCatalogoSupabase() {
    const sb = window.juanekosSupabase;
    if (!sb) return false;
    try {
        const { data, error } = await sb
            .from("productos")
            .select("id,nombre,descripcion,precio,categoria,imagen_url,disponible,activo,hora_inicio,hora_fin")
            .eq("activo", true)
            .eq("disponible", true)
            .order("categoria")
            .order("nombre");
        if (error) throw error;
        if (Array.isArray(data) && data.length) {
            menu.splice(0, menu.length, ...data.map(p => ({
                id: String(p.id),
                categoria: p.categoria === "bebida" ? "bebidas" : p.categoria,
                nombre: p.nombre,
                descripcion: p.descripcion || "",
                precio: Number(p.precio) || 0,
                imagen_url: p.imagen_url || "",
                hora_inicio: p.hora_inicio,
                hora_fin: p.hora_fin
            })));
        }
        if (typeof cargarMenuDiaSupabase === "function") {
            await cargarMenuDiaSupabase(fechaISOJuanekos(), false);
        }
        sincronizarMenuDelDiaEnCatalogo();
        if (typeof inicializarCantidades === "function") inicializarCantidades();
        if (typeof renderProductos === "function") renderProductos();
        if (typeof renderizarCarrito === "function") renderizarCarrito();
        if (typeof actualizarTotal === "function") actualizarTotal();
        return true;
    } catch (error) {
        console.error("No se pudo cargar el catálogo online:", error);
        sincronizarMenuDelDiaEnCatalogo();
        if (typeof inicializarCantidades === "function") inicializarCantidades();
        if (typeof renderProductos === "function") renderProductos();
        if (typeof renderizarCarrito === "function") renderizarCarrito();
        if (typeof actualizarTotal === "function") actualizarTotal();
        return false;
    }
}

async function iniciarMenu() {
    if (typeof window.juanekosCargarModoOperacion === "function") {
        await window.juanekosCargarModoOperacion();
        window.juanekosIniciarRealtimeModo?.();
    }
    await cargarCatalogoSupabase();
    if (typeof inicializarCantidades === "function") inicializarCantidades();
    if (typeof renderProductos === "function") renderProductos();
    if (typeof renderizarCarrito === "function") renderizarCarrito();
}

window.addEventListener("juanekos:modo-operacion-actualizado", () => {
    if (typeof renderProductos === "function") renderProductos();
    if (typeof renderizarCarrito === "function") renderizarCarrito();
});

window.addEventListener("juanekos:menu-dia-actualizado", () => {
    sincronizarMenuDelDiaEnCatalogo();
    if (typeof inicializarCantidades === "function") inicializarCantidades();
    if (typeof renderProductos === "function") renderProductos();
    if (typeof renderizarCarrito === "function") renderizarCarrito();
});


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