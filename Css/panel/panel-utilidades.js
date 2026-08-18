function formatearPrecio(valor) {
    return `S/ ${Number(valor || 0).toFixed(2)}`;
}

function escaparHTML(valor) {
    return String(valor ?? "")
        .replace(/&/g, "&amp;")
        .replace(/</g, "&lt;")
        .replace(/>/g, "&gt;")
        .replace(/"/g, "&quot;")
        .replace(/'/g, "&#039;");
}

function obtenerPedidosPanel() {
    if (typeof obtenerPedidosGuardados !== "function") {
        console.error(
            "No se encontró obtenerPedidosGuardados()."
        );

        return [];
    }

    return obtenerPedidosGuardados();
}

function convertirFechaFiltro(fecha) {
    if (!fecha) {
        return "";
    }

    const partes = fecha.split("-");

    if (partes.length !== 3) {
        return "";
    }

    return `${partes[2]}/${partes[1]}/${partes[0]}`;
}

function obtenerTextoEstado(estado) {
    const estados = {
        abierto: "ABIERTO",
        preparacion: "EN PREPARACIÓN",
        listo: "LISTO",
        cerrado: "CERRADO",
        cancelado: "CANCELADO"
    };

    return (
        estados[estado] ||
        String(estado || "abierto").toUpperCase()
    );
}

