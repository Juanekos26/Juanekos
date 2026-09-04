/* =====================================================
   JUANEKO'S - PANEL DE GESTIÓN DE UTENSILIOS
===================================================== */

const CLAVE_UTENSILIOS = "juanekos_utensilios_admin_v1";

const UTENSILIOS_DEFAULT = [
    { id: 1, nombre: "Cuchillos de Cocina Pro", categoria: "Corte / Preparación", cantidad: "8 Unidades", estado: "Excelente", ubicacion: "Cocina Principal" },
    { id: 2, nombre: "Tablas de Picar (Polietileno)", categoria: "Preparación", cantidad: "6 Unidades", estado: "Bueno", ubicacion: "Zona Cevichería" },
    { id: 3, nombre: "Ollas Grandes para Parihuela", categoria: "Cocción", cantidad: "4 Unidades", estado: "Excelente", ubicacion: "Cocina Caliente" },
    { id: 4, nombre: "Sartenes para Broaster", categoria: "Fritura", cantidad: "5 Unidades", estado: "Bueno", ubicacion: "Estación Broaster" },
    { id: 5, nombre: "Escurridores de Papas", categoria: "Fritura", cantidad: "6 Unidades", estado: "Bueno", ubicacion: "Estación Broaster" },
    { id: 6, nombre: "Licuadoras Industriales", categoria: "Electrodomésticos", cantidad: "2 Unidades", estado: "Requiere revisión", ubicacion: "Barra / Bebidas" },
    { id: 7, nombre: "Espumaderas de Acero", categoria: "Utensilios", cantidad: "10 Unidades", estado: "Excelente", ubicacion: "Cocina Principal" },
    { id: 8, nombre: "Platos Hondos para Ceviche", categoria: "Vajilla", cantidad: "45 Unidades", estado: "Bueno", ubicacion: "Almacén Vajilla" }
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

    contenedor.innerHTML = `
        <div class="admin-modo-wrapper">
            <div class="admin-modo-header-modern">
                <div class="header-texts">
                    <span class="admin-etiqueta-modern"><i class="fa-solid fa-kitchen-set"></i> Equipamiento y Menaje</span>
                    <h2>Lista de Utensilios</h2>
                    <p>Monitoreo de herramientas de cocina, menaje, vajilla y equipos operativos.</p>
                </div>
                <button type="button" class="btn-primary-modern" onclick="abrirModalUtensilio()">
                    <i class="fa-solid fa-plus"></i> Nuevo Utensilio
                </button>
            </div>

            <div class="admin-modo-form-card">
                <div class="modo-form-header">
                    <h3>Inventario de Utensilios (${utensilios.length} ítems registrados)</h3>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="buscarUtensilioInput" placeholder="Buscar utensilio..." oninput="filtrarUtensiliosTabla(this.value)" style="padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:0.9rem; outline:none;">
                    </div>
                </div>

                <div class="table-responsive" style="overflow-x: auto;">
                    <table class="admin-table" style="width:100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">
                                <th style="padding: 12px;">Utensilio / Equipo</th>
                                <th style="padding: 12px;">Categoría</th>
                                <th style="padding: 12px;">Cantidad</th>
                                <th style="padding: 12px;">Estado</th>
                                <th style="padding: 12px;">Ubicación</th>
                                <th style="padding: 12px; text-align: right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaUtensiliosBody">
                            ${utensilios.map(item => `
                                <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.2s;" data-id="${item.id}">
                                    <td style="padding: 14px 12px; font-weight: 700; color: var(--text-main);">${item.nombre}</td>
                                    <td style="padding: 14px 12px; color: var(--text-muted);">${item.categoria}</td>
                                    <td style="padding: 14px 12px; font-weight: 600; color: var(--text-main);">${item.cantidad}</td>
                                    <td style="padding: 14px 12px;">
                                        <span class="badge-stock" style="padding: 4px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; background: ${item.estado === 'Excelente' ? '#f6ffed' : item.estado === 'Bueno' ? '#e6f7ff' : '#fffbe6'}; color: ${item.estado === 'Excelente' ? '#52c41a' : item.estado === 'Bueno' ? '#1890ff' : '#faad14'}; border: 1px solid ${item.estado === 'Excelente' ? '#b7eb8f' : item.estado === 'Bueno' ? '#91d5ff' : '#ffe58f'};">
                                            ${item.estado}
                                        </span>
                                    </td>
                                    <td style="padding: 14px 12px; color: var(--text-muted);">${item.ubicacion || 'General'}</td>
                                    <td style="padding: 14px 12px; text-align: right;">
                                        <button onclick="editarUtensilio(${item.id})" title="Editar" style="background: rgba(0,119,182,0.1); border: none; color: #0077b6; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; margin-right: 6px;"><i class="fa-solid fa-pen"></i></button>
                                        <button onclick="eliminarUtensilio(${item.id})" title="Eliminar" style="background: rgba(220,53,69,0.1); border: none; color: #dc3545; width: 32px; height: 32px; border-radius: 6px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Utensilio -->
        <div id="modalUtensilio" class="admin-modal" style="display:none; position:fixed; inset:0; z-index:9999; background: rgba(0,0,0,0.5); align-items:center; justify-content:center;">
            <div style="background:#fff; width:100%; max-width:450px; border-radius:12px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                <h3 id="modalUtensilioTitulo" style="margin-top:0; color:var(--text-main);">Nuevo Utensilio</h3>
                <form id="formUtensilio" onsubmit="guardarUtensilioSubmit(event)" style="display:flex; flex-direction:column; gap:16px; margin-top:16px;">
                    <input type="hidden" id="utensilioId">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-weight:600; font-size:0.9rem;">Nombre del Utensilio / Equipo</label>
                        <input type="text" id="utensilioNombre" required placeholder="Ej. Cuchillos Pro" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; outline:none;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-weight:600; font-size:0.9rem;">Categoría</label>
                        <select id="utensilioCategoria" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; background:#fff;">
                            <option value="Corte / Preparación">Corte / Preparación</option>
                            <option value="Cocción">Cocción</option>
                            <option value="Fritura">Fritura</option>
                            <option value="Electrodomésticos">Electrodomésticos</option>
                            <option value="Utensilios">Utensilios</option>
                            <option value="Vajilla">Vajilla</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; font-size:0.9rem;">Cantidad</label>
                            <input type="text" id="utensilioCantidad" required placeholder="Ej. 5 Unidades" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; outline:none;">
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; font-size:0.9rem;">Estado</label>
                            <select id="utensilioEstado" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; background:#fff;">
                                <option value="Excelente">Excelente</option>
                                <option value="Bueno">Bueno</option>
                                <option value="Requiere revisión">Requiere revisión</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-weight:600; font-size:0.9rem;">Ubicación</label>
                        <input type="text" id="utensilioUbicacion" placeholder="Ej. Cocina Principal" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; outline:none;">
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                        <button type="button" onclick="cerrarModalUtensilio()" style="padding:10px 16px; border:1px solid var(--border-color); background:#f8f9fa; border-radius:6px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button type="submit" style="padding:10px 20px; background:var(--accent); color:var(--sidebar-bg); border:none; border-radius:6px; cursor:pointer; font-weight:700;">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
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
            document.getElementById("utensilioCategoria").value = item.categoria;
            document.getElementById("utensilioCantidad").value = item.cantidad;
            document.getElementById("utensilioEstado").value = item.estado;
            document.getElementById("utensilioUbicacion").value = item.ubicacion || "";
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
    const categoria = document.getElementById("utensilioCategoria").value;
    const cantidad = document.getElementById("utensilioCantidad").value.trim();
    const estado = document.getElementById("utensilioEstado").value;
    const ubicacion = document.getElementById("utensilioUbicacion").value.trim();

    let utensilios = obtenerUtensiliosGuardados();

    if (id) {
        utensilios = utensilios.map(i => i.id == id ? { ...i, nombre, categoria, cantidad, estado, ubicacion } : i);
    } else {
        const nuevoId = utensilios.length > 0 ? Math.max(...utensilios.map(i => i.id)) + 1 : 1;
        utensilios.push({ id: nuevoId, nombre, categoria, cantidad, estado, ubicacion });
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

function filtrarUtensiliosTabla(query) {
    const q = query.toLowerCase();
    const filas = document.querySelectorAll("#tablaUtensiliosBody tr");
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(q) ? "" : "none";
    });
}

window.renderizarPanelUtensilios = renderizarPanelUtensilios;
window.abrirModalUtensilio = abrirModalUtensilio;
window.cerrarModalUtensilio = cerrarModalUtensilio;
window.guardarUtensilioSubmit = guardarUtensilioSubmit;
window.eliminarUtensilio = eliminarUtensilio;
window.editarUtensilio = editarUtensilio;
window.filtrarUtensiliosTabla = filtrarUtensiliosTabla;
