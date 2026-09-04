const carta = [
    {
        imagen: "../Imagenes/Carta/Cevicheria1.png",
        alt: "Carta de cevichería página 1",
        tipo: "cevicheria"
    },
    {
        imagen: "../Imagenes/Carta/Cevicheria2.png",
        alt: "Carta de cevichería página 2",
        tipo: "cevicheria"
    },
    {
        imagen: "../Imagenes/Carta/Broaster1.png",
        alt: "Carta de broaster página 1",
        tipo: "broaster"
    },
    {
        imagen: "../Imagenes/Carta/Broaster2.png",
        alt: "Carta de broaster página 2",
        tipo: "broaster"
    }
];

const enlacesCarta = {
    cevicheria: "https://canva.link/1z9tdcughc854qs",
    broaster: "https://canva.link/tzrou0k1y7fmtlh"
};

const contenedor = document.getElementById("carta-dinamica");
const enlaces = document.getElementById("enlaces-carta");
const etiqueta = document.getElementById("carta-etiqueta");
const titulo = document.getElementById("carta-titulo");
const descripcion = document.getElementById("carta-descripcion");
const estado = document.getElementById("carta-estado");

function obtenerTipo() {

    const hora = new Date().getHours();

    if (hora >= 11 && hora < 16) return "cevicheria";
    if (hora >= 16 && hora < 24) return "broaster";

    return "general";
}

function actualizarEncabezado(tipo) {

    const datos = {

        cevicheria: [
            "🐟 CARTA DE CEVICHERÍA",
            "CEVICHERÍA JUANEKO'S",
            "Disfruta nuestros platos de cevichería preparados al momento.",
            "🐟 Cevichería · 11:00 a. m. – 3:59 p. m."
        ],

        broaster: [
            "🍗 CARTA DE BROASTER",
            "BROASTER JUANEKO'S",
            "Pollo crujiente, dorado y preparado al momento.",
            "🍗 Broaster · 4:00 p. m. – 11:59 p. m."
        ],

        general: [
            "🌙 FUERA DE HORARIO",
            "CARTA COMPLETA",
            "Consulta nuestras cartas de cevichería y broaster.",
            "🌙 Fuera de horario · Mostrando ambas cartas"
        ]

    };

    const d = datos[tipo];

    etiqueta.textContent = d[0];
    titulo.textContent = d[1];
    descripcion.textContent = d[2];
    estado.textContent = d[3];
}

function mostrarEnlaces(tipo) {

    if (!enlaces) return;

    const boton = (tipo, texto, icono) => `
        <a
            href="${enlacesCarta[tipo]}"
            class="carta-boton ${tipo}"
            target="_blank"
            rel="noopener noreferrer"
        >
            <span>${icono}</span>
            ${texto}
        </a>
    `;

    if (tipo === "cevicheria") {

        enlaces.innerHTML =
            boton(
                "cevicheria",
                "Ver carta de Cevichería",
                "🐟"
            );

        return;
    }

    if (tipo === "broaster") {

        enlaces.innerHTML =
            boton(
                "broaster",
                "Ver carta de Broaster",
                "🍗"
            );

        return;
    }

    enlaces.innerHTML = `
        <div class="carta-enlaces-titulo">
            📖 CONSULTA NUESTRAS CARTAS
        </div>

        <div class="carta-botones">
            ${boton(
                "cevicheria",
                "Ver carta de Cevichería",
                "🐟"
            )}

            ${boton(
                "broaster",
                "Ver carta de Broaster",
                "🍗"
            )}
        </div>
    `;
}

function mostrarCarta() {

    if (!contenedor) return;

    const tipo = obtenerTipo();

    actualizarEncabezado(tipo);
    mostrarEnlaces(tipo);

    const lista = tipo === "general"
        ? carta
        : carta.filter(item => item.tipo === tipo);

    contenedor.innerHTML = lista.map(item => `
        <article class="carta-item">
            <img
                src="${item.imagen}"
                alt="${item.alt}"
                loading="lazy"
            >
        </article>
    `).join("");
}

document.addEventListener(
    "DOMContentLoaded",
    mostrarCarta
);

setInterval(
    mostrarCarta,
    60000
);