/* Pedido rápido desde la página de ubicación */
document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("formulario-pedido");
    if (!form) return;
    form.addEventListener("submit", event => {
        event.preventDefault();
        const nombre = document.getElementById("nombre")?.value.trim() || "";
        const producto = document.getElementById("producto")?.value.trim() || "";
        const telefono = document.getElementById("telefono")?.value.trim() || "";
        const direccion = document.getElementById("direccion")?.value.trim() || "";
        const descripcion = document.getElementById("descripcion")?.value.trim() || "";
        if (!nombre || !producto || !telefono || !direccion) return;
        const texto = `Hola Juaneko's 👋 Quiero realizar un pedido.\n\nCliente: ${nombre}\nProducto: ${producto}\nTeléfono: ${telefono}\nDirección: ${direccion}\nDetalle: ${descripcion || "Sin observaciones"}`;
        window.open(`https://wa.me/51959713018?text=${encodeURIComponent(texto)}`, "_blank", "noopener,noreferrer");
    });
});
