const CLAVE_SESION_ADMIN = "juanekos_admin_sesion";

function configurarLogin() {

    const formulario = document.getElementById("loginForm");
    const mensaje = document.getElementById("loginMensaje");

    if (!formulario) {
        return;
    }

    formulario.addEventListener("submit", async (event) => {

        event.preventDefault();

        const usuario =
            document.getElementById("usuario")?.value.trim() || "";

        const clave =
            document.getElementById("clave")?.value || "";

        if (!usuario || !clave) {

            mensaje.textContent =
                "Completa todos los campos.";

            return;
        }

        mensaje.textContent =
            "Verificando acceso...";

        try {

            const respuesta = await fetch("/api/login", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    usuario: usuario,
                    clave: clave
                })
            });

            const resultado = await respuesta.json();

            if (!respuesta.ok || !resultado.success) {

                mensaje.textContent =
                    resultado.message ||
                    "Usuario o contraseña incorrectos.";

                document
                    .getElementById("clave")
                    ?.focus();

                return;
            }

            sessionStorage.setItem(
                CLAVE_SESION_ADMIN,
                "true"
            );

            mensaje.textContent =
                "Acceso correcto. Ingresando...";

            setTimeout(() => {

                window.location.href =
                    "Admin.html";

            }, 500);

        } catch (error) {

            console.error(error);

            mensaje.textContent =
                "No se pudo conectar con el servidor.";

        }

    });

}

function cerrarSesion() {

    sessionStorage.removeItem(
        CLAVE_SESION_ADMIN
    );

    window.location.href =
        "Login.html";
}

function sesionAdminActiva() {

    return (
        sessionStorage.getItem(
            CLAVE_SESION_ADMIN
        ) === "true"
    );

}

function protegerPanel() {

    if (!sesionAdminActiva()) {

        window.location.href =
            "Login.html";

    }

}

document.addEventListener(
    "DOMContentLoaded",
    () => {

        const pagina =
            window.location.pathname.toLowerCase();

        if (pagina.includes("admin.html")) {

            protegerPanel();

        } else {

            configurarLogin();

        }

    }
);