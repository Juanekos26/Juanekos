/* =====================================================
   JUANEKO'S - DESTACADOS Y PORTADA DINÁMICOS
   CAMBIO AUTOMÁTICO SEGÚN HORARIO
===================================================== */

const destacadosContainer =
    document.getElementById("destacados-dinamicos");

const destacadosDescripcion =
    document.getElementById("destacados-descripcion");

const heroImagen =
    document.getElementById("hero-imagen");

const horarioIcono =
    document.getElementById("horario-icono");

const horarioTitulo =
    document.getElementById("horario-titulo");

const horarioFrase =
    document.getElementById("horario-frase");

const horarioHora =
    document.getElementById("horario-hora");


/* =====================================================
   CONTENIDO SEGÚN HORARIO
===================================================== */

const contenido = {

    /* =============================================
       FUERA DE HORARIO
       00:00 - 10:59
    ============================================= */

    general: {

        horario: "🌙 FUERA DE HORARIO",

        rango: "12:00 a. m. – 10:59 a. m.",

        imagen: "Imagenes/hero.jpg",

        frase:
            "En este momento estamos fuera de horario.",

        descripcion:
            "Nuestro horario de atención comienza a las 11:00 a. m.",

        icono: "🌙",

        destacados: [

            {
                imagen: "Imagenes/DestacadoBroaster.png",
                alt: "Broaster crujiente",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/DestacadoCevicheria.png",
                alt: "Cevichería Juaneko's",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/DestacadoChicha.png",
                alt: "Chicha y maracuyá",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/DestacadoDelivery.png",
                alt: "Delivery Juaneko's",
                enlace: "Html/Contacto.html"
            }

        ]
    },


    /* =============================================
       CEVICHERÍA
       11:00 - 15:59
    ============================================= */

    cevicheria: {

        horario: "☀️ HORARIO DE CEVICHERÍA",

        rango: "11:00 a. m. – 3:59 p. m.",

        imagen: "Imagenes/Cevichería.png",

        frase:
            "Pescado fresco, sabor peruano y platos preparados al momento.",

        descripcion:
            "Es hora de disfrutar nuestra cevichería.",

        icono: "🐟",

        destacados: [

            {
                imagen: "Imagenes/DestacadoCevicheria.png",
                alt: "Cevichería Juaneko's",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/DestacadoChicha.png",
                alt: "Chicha y maracuyá",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/Destacado Delivery.png",
                alt: "Delivery Juaneko's",
                enlace: "Html/Contacto.html"
            }

        ]
    },


    /* =============================================
       BROASTER
       16:00 - 23:59
    ============================================= */

    broaster: {

        horario: "🌆 HORARIO DE BROASTER",

        rango: "4:00 p. m. – 11:59 p. m.",

        imagen: "Imagenes/Broaster.png",

        frase:
            "Pollo crujiente, dorado y preparado al momento.",

        descripcion:
            "La noche se disfruta mejor con nuestro broaster.",

        icono: "🔥",

        destacados: [

            {
                imagen: "Imagenes/DestacadoBroaster.png",
                alt: "Broaster crujiente",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/DestacadoChicha.png",
                alt: "Chicha y maracuyá",
                enlace: "Html/Menu.html"
            },

            {
                imagen: "Imagenes/DestacadoDelivery.png",
                alt: "Delivery Juaneko's",
                enlace: "Html/Contacto.html"
            }

        ]
    }

};


/* =====================================================
   OBTENER HORARIO ACTUAL
===================================================== */

function obtenerHorario() {

    const hora = new Date().getHours();

    if (hora >= 11 && hora < 16) {

        return contenido.cevicheria;

    }

    if (hora >= 16 && hora < 24) {

        return contenido.broaster;

    }

    return contenido.general;
}


/* =====================================================
   MOSTRAR CONTENIDO
===================================================== */

function mostrarDestacados() {

    if (!destacadosContainer) {

        console.error(
            "No se encontró #destacados-dinamicos"
        );

        return;
    }

    const actual = obtenerHorario();


    /* =============================================
       PORTADA
    ============================================= */

    if (heroImagen) {

        heroImagen.src = actual.imagen;

        heroImagen.alt = actual.frase;

        /*
         * Si una imagen no existe,
         * mostramos hero.jpg como respaldo.
         */

        heroImagen.onerror = function () {

            console.warn(
                "No se pudo cargar:",
                actual.imagen
            );

            this.onerror = null;

            this.src = "Imagenes/hero.jpg";
        };
    }


    /* =============================================
       HORARIO
    ============================================= */

    if (horarioIcono) {

        horarioIcono.textContent =
            actual.icono;
    }

    if (horarioTitulo) {

        horarioTitulo.textContent =
            actual.horario;
    }

    if (horarioFrase) {

        horarioFrase.textContent =
            actual.frase;
    }

    if (horarioHora) {

        horarioHora.textContent =
            actual.rango;
    }


    /* =============================================
       DESCRIPCIÓN
    ============================================= */

    if (destacadosDescripcion) {

        destacadosDescripcion.textContent =
            actual.descripcion;
    }


    /* =============================================
       LIMPIAR DESTACADOS
    ============================================= */

    destacadosContainer.innerHTML = "";


    /* =============================================
       CREAR TARJETAS
    ============================================= */

    actual.destacados.forEach(item => {

        const tarjeta =
            document.createElement("a");

        tarjeta.href = item.enlace;

        tarjeta.className =
            "destacado-card";

        tarjeta.setAttribute(
            "aria-label",
            item.alt
        );

        tarjeta.innerHTML = `
            <img
                class="destacado-imagen"
                src="${item.imagen}"
                alt="${item.alt}"
                loading="lazy"
            >
        `;

        const imagen =
            tarjeta.querySelector("img");

        /*
         * Respaldo si una imagen de destacado
         * no encuentra el archivo.
         */

        imagen.onerror = function () {

            console.warn(
                "No se pudo cargar:",
                item.imagen
            );

            this.onerror = null;

            this.style.display = "none";
        };

        destacadosContainer.appendChild(
            tarjeta
        );

    });

}


/* =====================================================
   INICIAR
===================================================== */

if (
    document.readyState === "loading"
) {

    document.addEventListener(
        "DOMContentLoaded",
        mostrarDestacados
    );

} else {

    mostrarDestacados();

}


/* =====================================================
   ACTUALIZAR CADA MINUTO
===================================================== */

setInterval(
    mostrarDestacados,
    60000
);