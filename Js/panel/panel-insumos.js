/* =====================================================
   JUANEKO'S - PANEL DE GESTIÓN DE INSUMOS
===================================================== */

const CLAVE_INSUMOS = "juanekos_insumos_admin_v1";

const INSUMOS_DEFAULT = [
    { id: 1, nombre: "Limón Sutil", categoria: "Verduras / Frutas", cantidad: "4 Sacos", stock: "Adecuado", proveedor: "Mercado Central" },
    { id: 2, nombre: "Pescado Perico / Pota", categoria: "Mariscos / Pescados", cantidad: "25 kg", stock: "Adecuado", proveedor: "Terminal Pesquero" },
    { id: 3, nombre: "Papa Amarilla", categoría: "Tubérculos", cantidad: "6 Sacos", stock: "Bajo", proveedor: "Mayorista Huaycán" },
    { id: 4, nombre: "Aceite Vegetal", categoria: "Abarrotes", cantidad: "4 Baldes", stock: "Adecuado", proveedor: "Distribuidora Lima" },
    { id: 5, nombre: "Arroz Extra", categoria: "Abarrotes", cantidad: "10 Sacos", stock: "Adecuado", proveedor: "Distribuidora Lima" },
    { id: 6, nombre: "Pollo Fresco", categoria: "Carnes / Aves", cantidad: "30 kg", stock: "Adecuado", proveedor: "Avícola San Fernando" },
    { id: 7, nombre: "Ají Limo", categoria: "Verduras", cantidad: "3 kg", stock: "Adecuado", proveedor: "Mercado Central" },
    { id: 8, nombre: "Choclo tierno", categoria: "Verduras", cantidad: "150 Unidades", stock: "Adecuado", proveedor: "Mercado Central" }
];

function obtenerInsumosGuardados() {
    try {
        const data = localStorage.getItem(CLAVE_INSUMOS);
        return data ? JSON.parse(data) : INSUMOS_DEFAULT;
    } catch (e) {
        return INSUMOS_DEFAULT;
    }
}

function guardarInsumos(insumos) {
    try {
        localStorage.setItem(CLAVE_INSUMOS, JSON.stringify(insumos));
    } catch (e) {}
}

function renderizarPanelInsumos() {
    const contenedor = document.getElementById("panelInsumos");
    if (!contenedor) return;

    const insumos = obtenerInsumosGuardados();

    contenedor.innerHTML = `
        <div class="admin-modo-wrapper">
            <div class="admin-modo-header-modern">
                <div class="header-texts">
                    <span class="admin-etiqueta-modern"><i class="fa-solid fa-boxes-stacked"></i> Gestión de Inventario</span>
                    <h2>Lista de Insumos</h2>
                    <p>Controla el stock, cantidades y abastecimiento diario para cocina y cevichería.</p>
                </div>
                <button type="button" class="btn-primary-modern" onclick="abrirModalInsumo()">
                    <i class="fa-solid fa-plus"></i> Nuevo Insumo
                </button>
            </div>

            <div class="admin-modo-form-card">
                <div class="modo-form-header">
                    <h3>Inventario Actual (${insumos.length} insumos registrados)</h3>
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="buscarInsumoInput" placeholder="Buscar insumo..." oninput="filtrarInsumosTabla(this.value)" style="padding:8px 12px; border-radius:6px; border:1px solid var(--border-color); font-size:0.9rem; outline:none;">
                    </div>
                </div>

                <div class="table-responsive" style="overflow-x: auto;">
                    <table class="admin-table" style="width:100%; border-collapse: collapse; text-align: left;">
                        <thead>
                            <tr style="border-bottom: 2px solid var(--border-color); color: var(--text-muted); font-size: 0.85rem; text-transform: uppercase;">
                                <th style="padding: 12px;">Insumo</th>
                                <th style="padding: 12px;">Categoría</th>
                                <th style="padding: 12px;">Cantidad / Stock</th>
                                <th style="padding: 12px;">Estado</th>
                                <th style="padding: 12px;">Proveedor</th>
                                <th style="padding: 12px; text-align: right;">Acciones</th>
                            </tr>
                        </thead>
                        <tbody id="tablaInsumosBody">
                            ${insumos.map(item => `
                                <tr style="border-bottom: 1px solid var(--border-color); transition: background 0.2s;" data-id="${item.id}">
                                    <td style="padding: 14px 12px; font-weight: 700; color: var(--text-main);">${item.nombre}</td>
                                    <td style="padding: 14px 12px; color: var(--text-muted);">${item.categoria}</td>
                                    <td style="padding: 14px 12px; font-weight: 600; color: var(--text-main);">${item.cantidad}</td>
                                    <td style="padding: 14px 12px;">
                                        <span class="badge-stock ${item.stock === 'Bajo' ? 'badge-bajo' : 'badge-ok'}" style="padding: 4px 10px; border-radius: 12px; font-size: 0.78rem; font-weight: 700; background: ${item.stock === 'Bajo' ? '#fffbe6' : '#f6ffed'}; color: ${item.stock === 'Bajo' ? '#faad14' : '#52c41a'}; border: 1px solid ${item.stock === 'Bajo' ? '#ffe58f' : '#b7eb8f'};">
                                            ${item.stock}
                                        </span>
                                    </td>
                                    <td style="padding: 14px 12px; color: var(--text-muted);">${item.proveedor || 'General'}</td>
                                    <td style="padding: 14px 12px; text-align: right;">
                                        <button onclick="editarInsumo(${item.id})" title="Editar" style="background: rgba(0,119,182,0.1); border: none; color: #0077b6; width: 32px; height: 32px; border-radius: 6px; cursor: pointer; margin-right: 6px;"><i class="fa-solid fa-pen"></i></button>
                                        <button onclick="eliminarInsumo(${item.id})" title="Eliminar" style="background: rgba(220,53,69,0.1); border: none; color: #dc3545; width: 32px; height: 32px; border-radius: 6px; cursor: pointer;"><i class="fa-solid fa-trash"></i></button>
                                    </td>
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>

        <!-- Modal Insumo -->
        <div id="modalInsumo" class="admin-modal" style="display:none; position:fixed; inset:0; z-index:9999; background: rgba(0,0,0,0.5); align-items:center; justify-content:center;">
            <div style="background:#fff; width:100%; max-width:450px; border-radius:12px; padding:24px; box-shadow:0 10px 30px rgba(0,0,0,0.2);">
                <h3 id="modalInsumoTitulo" style="margin-top:0; color:var(--text-main);">Nuevo Insumo</h3>
                <form id="formInsumo" onsubmit="guardarInsumoSubmit(event)" style="display:flex; flex-direction:column; gap:16px; margin-top:16px;">
                    <input type="hidden" id="insumoId">
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-weight:600; font-size:0.9rem;">Nombre del Insumo</label>
                        <input type="text" id="insumoNombre" required placeholder="Ej. Limón Sutil" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; outline:none;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-weight:600; font-size:0.9rem;">Categoría</label>
                        <select id="insumoCategoria" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; background:#fff;">
                            <option value="Verduras / Frutas">Verduras / Frutas</option>
                            <option value="Mariscos / Pescados">Mariscos / Pescados</option>
                            <option value="Tubérculos">Tubérculos</option>
                            <option value="Abarrotes">Abarrotes</option>
                            <option value="Carnes / Aves">Carnes / Aves</option>
                            <option value="Bebidas / Insumos">Bebidas / Insumos</option>
                        </select>
                    </div>
                    <div style="display:flex; gap:12px;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; font-size:0.9rem;">Cantidad / Medida</label>
                            <input type="text" id="insumoCantidad" required placeholder="Ej. 5 Sacos" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; outline:none;">
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:6px;">
                            <label style="font-weight:600; font-size:0.9rem;">Nivel de Stock</label>
                            <select id="insumoStock" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; background:#fff;">
                                <option value="Adecuado">Adecuado</option>
                                <option value="Bajo">Bajo</option>
                                <option value="Crítico">Crítico</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; flex-direction:column; gap:6px;">
                        <label style="font-weight:600; font-size:0.9rem;">Proveedor</label>
                        <input type="text" id="insumoProveedor" placeholder="Ej. Mercado Central" style="padding:10px; border:1px solid var(--border-color); border-radius:6px; outline:none;">
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                        <button type="button" onclick="cerrarModalInsumo()" style="padding:10px 16px; border:1px solid var(--border-color); background:#f8f9fa; border-radius:6px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button type="submit" style="padding:10px 20px; background:var(--accent); color:var(--sidebar-bg); border:none; border-radius:6px; cursor:pointer; font-weight:700;">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
    `;
}

function abrirModalInsumo(id = null) {
    const modal = document.getElementById("modalInsumo");
    const titulo = document.getElementById("modalInsumoTitulo");
    const form = document.getElementById("formInsumo");
    if (!modal) return;

    form.reset();
    document.getElementById("insumoId").value = "";

    if (id) {
        titulo.textContent = "Editar Insumo";
        const insumos = obtenerInsumosGuardados();
        const item = insumos.find(i => i.id === id);
        if (item) {
            document.getElementById("insumoId").value = item.id;
            document.getElementById("insumoNombre").value = item.nombre;
            document.getElementById("insumoCategoria").value = item.categoria;
            document.getElementById("insumoCantidad").value = item.cantidad;
            document.getElementById("insumoStock").value = item.stock;
            document.getElementById("insumoProveedor").value = item.proveedor || "";
        }
    } else {
        titulo.textContent = "Nuevo Insumo";
    }

    modal.style.display = "flex";
}

function cerrarModalInsumo() {
    const modal = document.getElementById("modalInsumo");
    if (modal) modal.style.display = "none";
}

function guardarInsumoSubmit(e) {
    e.preventDefault();
    const id = document.getElementById("insumoId").value;
    const nombre = document.getElementById("insumoNombre").value.trim();
    const categoria = document.getElementById("insumoCategoria").value;
    const cantidad = document.getElementById("insumoCantidad").value.trim();
    const stock = document.getElementById("insumoStock").value;
    const proveedor = document.getElementById("insumoProveedor").value.trim();

    let insumos = obtenerInsumosGuardados();

    if (id) {
        insumos = insumos.map(i => i.id == id ? { ...i, nombre, categoria, cantidad, stock, proveedor } : i);
    } else {
        const nuevoId = insumos.length > 0 ? Math.max(...insumos.map(i => i.id)) + 1 : 1;
        insumos.push({ id: nuevoId, nombre, categoria, cantidad, stock, proveedor });
    }

    guardarInsumos(insumos);
    cerrarModalInsumo();
    renderizarPanelInsumos();
    if (typeof mostrarMensaje === 'function') mostrarMensaje("Insumo guardado correctamente", "exito");
}

function eliminarInsumo(id) {
    if (!confirm("¿Estás seguro de eliminar este insumo?")) return;
    let insumos = obtenerInsumosGuardados();
    insumos = insumos.filter(i => i.id !== id);
    guardarInsumos(insumos);
    renderizarPanelInsumos();
    if (typeof mostrarMensaje === 'function') mostrarMensaje("Insumo eliminado", "exito");
}

function editarInsumo(id) {
    abrirModalInsumo(id);
}

function filtrarInsumosTabla(query) {
    const q = query.toLowerCase();
    const filas = document.querySelectorAll("#tablaInsumosBody tr");
    filas.forEach(fila => {
        const texto = fila.textContent.toLowerCase();
        fila.style.display = texto.includes(q) ? "" : "none";
    });
}

window.renderizarPanelInsumos = renderizarPanelInsumos;
window.abrirModalInsumo = abrirModalInsumo;
window.cerrarModalInsumo = cerrarModalInsumo;
window.guardarInsumoSubmit = guardarInsumoSubmit;
window.eliminarInsumo = eliminarInsumo;
window.editarInsumo = editarInsumo;
window.filtrarInsumosTabla = filtrarInsumosTabla;
