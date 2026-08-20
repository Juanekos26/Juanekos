/* Formulario de contacto por WhatsApp */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formularioContacto");
    if (!form) return;
    form.addEventListener("submit", event => {
        event.preventDefault();
        const nombre = document.getElementById("nombre")?.value.trim() || "";
        const telefono = document.getElementById("telefono")?.value.trim() || "";
        const asunto = document.getElementById("asunto")?.value.trim() || "Consulta";
        const mensaje = document.getElementById("mensaje")?.value.trim() || "";
        if (!nombre || !mensaje) return;
        const texto = `Hola Juaneko's 👋\n\nNombre: ${nombre}\nTeléfono: ${telefono || "No indicado"}\nAsunto: ${asunto}\nMensaje: ${mensaje}`;
        window.open(`https://wa.me/51959713018?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    });
});
