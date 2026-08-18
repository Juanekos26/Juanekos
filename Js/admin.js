/* =====================================================
   JUANEKO'S
   ADMINISTRACIÓN - LOGIN Y SESIÓN
===================================================== */

const CLAVE_SESION_ADMIN =
    "juanekos_admin_sesion";


/* =====================================================
   CONFIGURAR LOGIN
===================================================== */

function configurarLogin() {

    const formulario =
        document.getElementById("loginForm");

    const mensaje =
        document.getElementById("loginMensaje");

    if (!formulario) {
        return;
    }


    formulario.addEventListener(
        "submit",
        async (event) => {

            event.preventDefault();


            const usuario =
                document
                    .getElementById("usuario")
                    ?.value
                    .trim() || "";


            const clave =
                document
                    .getElementById("clave")
                    ?.value || "";


            /* =========================================
               VALIDAR CAMPOS
            ========================================= */

            if (!usuario || !clave) {

                if (mensaje) {

                    mensaje.textContent =
                        "Completa todos los campos.";

                }

                return;
            }


            if (mensaje) {

                mensaje.textContent =
                    "Verificando acceso...";

            }


            /* =========================================
               CONECTAR CON API
            ========================================= */

            try {

                const respuesta =
                    await fetch(
                        "/api/login",
                        {
                            method: "POST",

                            headers: {
                                "Content-Type":
                                    "application/json"
                            },

                            body: JSON.stringify({
                                usuario: usuario,
                                clave: clave
                            })
                        }
                    );


                const resultado =
                    await respuesta.json();


                /* =====================================
                   LOGIN INCORRECTO
                ===================================== */

                if (
                    !respuesta.ok ||
                    !resultado.success
                ) {

                    if (mensaje) {

                        mensaje.textContent =
                            resultado.message ||
                            "Usuario o contraseña incorrectos.";

                    }


                    document
                        .getElementById("clave")
                        ?.focus();


                    return;
                }


                /* =====================================
                   LOGIN CORRECTO
                ===================================== */

                sessionStorage.setItem(
                    CLAVE_SESION_ADMIN,
                    "true"
                );


                if (mensaje) {

                    mensaje.textContent =
                        "Acceso correcto. Ingresando...";

                }


                /* =====================================
                   IR AL PANEL
                ===================================== */

                setTimeout(
                    () => {

                        window.location.href =
                            "panel.html";

                    },
                    500
                );

            } catch (error) {

                console.error(
                    "Error de conexión:",
                    error
                );


                if (mensaje) {

                    mensaje.textContent =
                        "No se pudo conectar con el servidor.";

                }

            }

        }
    );

}


/* =====================================================
   CERRAR SESIÓN
===================================================== */

function cerrarSesion() {

    sessionStorage.removeItem(
        CLAVE_SESION_ADMIN
    );


    window.location.href =
        "login.html";
}


/* =====================================================
   COMPROBAR SESIÓN
===================================================== */

function sesionAdminActiva() {

    return (
        sessionStorage.getItem(
            CLAVE_SESION_ADMIN
        ) === "true"
    );

}


/* =====================================================
   PROTEGER PANEL
===================================================== */

function protegerPanel() {

    if (!sesionAdminActiva()) {

        window.location.href =
            "login.html";

    }

}


/* =====================================================
   INICIALIZACIÓN
===================================================== */

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const pagina =
            window.location.pathname
                .toLowerCase();


        /* =============================================
           LOGIN
        ============================================= */

        if (
            pagina.endsWith(
                "/login.html"
            ) ||
            pagina.endsWith(
                "login.html"
            )
        ) {

            configurarLogin();

            return;
        }


        /* =============================================
           PANEL
        ============================================= */

        if (
            pagina.endsWith(
                "/panel.html"
            ) ||
            pagina.endsWith(
                "panel.html"
            )
        ) {

            protegerPanel();

            return;
        }

    }
);