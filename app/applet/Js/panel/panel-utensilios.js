/* =====================================================
   JUANEKO'S - PANEL DE GESTIÓN DE UTENSILIOS
===================================================== */

const CLAVE_UTENSILIOS = "juanekos_utensilios_admin_v2";

const UTENSILIOS_DEFAULT = [
    { id: 1, nombre: "Cuchillos de Cocina Pro", categoria: "Corte", cantidad: "8 Unidades", estado: "Excelente", ubicacion: "Cocina Principal" }
];

function obtenerUtensiliosGuardados() {
    try {
        const data = localStorage.getItem(CLAVE_UTENSILIOS);
        return data ? JSON.parse(data) : UTENSILIOS_DEFAULT;
    } catch (e) {
        return UTENSILIOS_DEFAULT;
    }
}

function guardarUtensilios(utensilios) {
    try {
        localStorage.setItem(CLAVE_UTENSILIOS, JSON.stringify(utensilios));
    } catch (e) {}
}

function renderizarPanelUtensilios() {
    const contenedor = document.getElementById("panelUtensilios");
    if (!contenedor) return;

    const utensilios = obtenerUtensiliosGuardados();
    const textoLibre = utensilios.map(u => `${u.nombre} - ${u.cantidad} - ${u.estado}`).join('\n');

    contenedor.innerHTML = `
        <div class="admin-modo-wrapper" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="admin-modo-header-modern" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                <div class="header-texts">
                    <span class="admin-etiqueta-modern"><i class="fa-solid fa-kitchen-set"></i> Menaje y Equipamiento</span>
                    <h2>Lista de Utensilios</h2>
                    <p>Escribe o edita tus utensilios en formato de texto libre y conviértelos al instante en tarjetas visuales llamativas.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;" class="utensilios-grid-layout">
                <!-- Panel de Entrada de Texto -->
                <div style="background: var(--bg-card, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">📝 Editor de Texto Rápido</h3>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Un ítem por línea</span>
                    </div>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
                        Escribe el utensilio, cantidad y estado separándolos con guiones (ej: <b>Cuchillos Pro - 8 Unidades - Excelente</b>).
                    </p>
                    <textarea id="textoUtensiliosLibre" rows="10" style="width: 100%; padding: 14px; border: 1px solid var(--border-color); border-radius: 10px; font-family: inherit; font-size: 0.95rem; resize: vertical; outline: none; background: rgba(0,0,0,0.02);" placeholder="Cuchillos Pro - 8 Unidades - Excelente">${textoLibre}</textarea>
                    <button type="button" class="btn-primary-modern" onclick="guardarUtensiliosDesdeTexto()" style="width: 100%; justify-content: center; padding: 12px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Convertir y Visualizar Tarjetas
                    </button>
                </div>

                <!-- Panel de Visualización Llamativa -->
                <div style="background: var(--bg-card, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">✨ Vista Visual Atractiva</h3>
                        <button type="button" onclick="abrirModalUtensilio()" style="background: var(--accent); color: var(--sidebar-bg); border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                            <i class="fa-solid fa-plus"></i> Añadir
                        </button>
                    </div>

                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="buscarUtensilioInput" placeholder="Buscar utensilio visual..." oninput="filtrarUtensiliosTarjetas(this.value)" style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid var(--border-color); font-size:0.9rem; outline:none;">
                    </div>

                    <div id="tarjetasUtensiliosGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; max-height: 400px; overflow-y: auto; padding-right: 4px;">
                        ${utensilios.map(item => `
                            <div class="utensilio-card-item" style="background: linear-gradient(135deg, #f8fafd, #ffffff); border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; position: relative; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <span style="font-weight: 800; font-size: 1rem; color: #0f172a;">${item.nombre}</span>
                                    <span style="font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: #e6f7ff; color: #1890ff; border: 1px solid #91d5ff;">
                                        ${item.estado || 'Excelente'}
                                    </span>
                                </div>
                                <div style="font-size: 0.9rem; font-weight: 600; color: #0284c7; display: flex; align-items: center; gap: 6px;">
                                    <i class="fa-solid fa-boxes-stacked"></i> ${item.cantidad}
                                </div>
                                <div style="font-size: 0.8rem; color: #64748b; display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
                                    <span>${item.categoria || 'General'}</span>
                                    <div style="display: flex; gap: 6px;">
                                        <button onclick="editarUtensilio(${item.id})" style="background: none; border: none; color: #0284c7; cursor: pointer; padding: 2px 4px;" title="Editar"><i class="fa-solid fa-pen"></i></button>
                                        <button onclick="eliminarUtensilio(${item.id})" style="background: none; border: none; color: #dc2626; cursor: pointer; padding: 2px 4px;" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Utensilio Individual -->
        <div id="modalUtensilio" class="admin-modal" style="display:none; position:fixed; inset:0; z-index:9999; background: rgba(0,0,0,0.5); align-items:center; justify-content:center;">
            <div style="background:#fff; width:100%; max-width:420px; border-radius:14px; padding:24px; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <h3 id="modalUtensilioTitulo" style="margin-top:0; color:#0f172a;">Nuevo Utensilio</h3>
                <form id="formUtensilio" onsubmit="guardarUtensilioSubmit(event)" style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">
                    <input type="hidden" id="utensilioId">
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-weight:600; font-size:0.85rem;">Nombre</label>
                        <input type="text" id="utensilioNombre" required placeholder="Ej. Cuchillos Pro" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-weight:600; font-size:0.85rem;">Categoría</label>
                        <input type="text" id="utensilioCategoria" placeholder="Ej. Corte" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <label style="font-weight:600; font-size:0.85rem;">Cantidad</label>
                            <input type="text" id="utensilioCantidad" required placeholder="Ej. 8 Unidades" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <label style="font-weight:600; font-size:0.85rem;">Estado</label>
                            <select id="utensilioEstado" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;">
                                <option value="Excelente">Excelente</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Requiere revisión">Requiere revisión</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                        <button type="button" onclick="cerrarModalUtensilio()" style="padding:10px 16px; border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button type="submit" style="padding:10px 20px; background:var(--accent); color:var(--sidebar-bg); border:none; border-radius:8px; cursor:pointer; font-weight:700;">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
        <style>
            @media (max-width: 900px) {
                .utensilios-grid-layout {
                    grid-template-columns: 1fr !important;
                }
            }
        </style>
    `;
}

function guardarUtensiliosDesdeTexto() {
    const textarea = document.getElementById("textoUtensiliosLibre");
    if (!textarea) return;
    const lineas = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
    const nuevosUtensilios = lineas.map((linea, index) => {
        const partes = linea.split('-').map(p => p.trim());
        return {
            id: index + 1,
            nombre: partes[0] || `Utensilio ${index + 1}`,
            cantidad: partes[1] || "1 Unid",
            estado: partes[2] || "Excelente",
            categoria: "General"
        };
    });
    guardarUtensilios(nuevosUtensilios);
    renderizarPanelUtensilios();
    if (typeof mostrarMensaje === 'function') mostrarMensaje("¡Utensilios convertidos y visualizados con éxito!", "exito");
}

function abrirModalUtensilio(id = null) {
    const modal = document.getElementById("modalUtensilio");
    const titulo = document.getElementById("modalUtensilioTitulo");
    const form = document.getElementById("formUtensilio");
    if (!modal) return;

    form.reset();
    document.getElementById("utensilioId").value = "";

    if (id) {
        titulo.textContent = "Editar Utensilio";
        const utensilios = obtenerUtensiliosGuardados();
        const item = utensilios.find(i => i.id === id);
        if (item) {
            document.getElementById("utensilioId").value = item.id;
            document.getElementById("utensilioNombre").value = item.nombre;
            document.getElementById("utensilioCategoria").value = item.categoria || "";
            document.getElementById("utensilioCantidad").value = item.cantidad;
            document.getElementById("utensilioEstado").value = item.estado || "Excelente";
        }
    } else {
        titulo.textContent = "Nuevo Utensilio";
    }

    modal.style.display = "flex";
}

function cerrarModalUtensilio() {
    const modal = document.getElementById("modalUtensilio");
    if (modal) modal.style.display = "none";
}

function guardarUtensilioSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("utensilioId").value;
    const nombre = document.getElementById("utensilioNombre").value.trim();
    const categoria = document.getElementById("utensilioCategoria").value.trim() || "General";
    const cantidad = document.getElementById("utensilioCantidad").value.trim();
    const estado = document.getElementById("utensilioEstado").value;

    let utensilios = obtenerUtensiliosGuardados();

    if (id) {
        utensilios = utensilios.map(i => i.id == id ? { ...i, nombre, categoria, cantidad, estado } : i);
    } else {
        const nuevoId = utensilios.length > 0 ? Math.max(...utensilios.map(i => i.id)) + 1 : 1;
        utensilios.push({ id: nuevoId, nombre, categoria, cantidad, estado });
    }

    guardarUtensilios(utensilios);
    cerrarModalUtensilio();
    renderizarPanelUtensilios();
    if (typeof mostrarMensaje === 'function') mostrarMensaje("Utensilio guardado correctamente", "exito");
}

function eliminarUtensilio(id) {
    if (!confirm("¿Estás seguro de eliminar este utensilio?")) return;
    let utensilios = obtenerUtensiliosGuardados();
    utensilios = utensilios.filter(i => i.id !== id);
    guardarUtensilios(utensilios);
    renderizarPanelUtensilios();
    if (typeof mostrarMensaje === 'function') mostrarMensaje("Utensilio eliminado", "exito");
}

function editarUtensilio(id) {
    abrirModalUtensilio(id);
}

function filtrarUtensiliosTarjetas(query) {
    const q = query.toLowerCase();
    const cards = document.querySelectorAll(".utensilio-card-item");
    cards.forEach(card => {
        const texto = card.textContent.toLowerCase();
        card.style.display = texto.includes(q) ? "" : "none";
    });
}

window.renderizarPanelUtensilios = renderizarPanelUtensilios;
window.guardarUtensiliosDesdeTexto = guardarUtensiliosDesdeTexto;
window.abrirModalUtensilio = abrirModalUtensilio;
window.cerrarModalUtensilio = cerrarModalUtensilio;
window.guardarUtensilioSubmit = guardarUtensilioSubmit;
window.eliminarUtensilio = eliminarUtensilio;
window.editarUtensilio = editarUtensilio;
window.filtrarUtensiliosTarjetas = filtrarUtensiliosTarjetas;
