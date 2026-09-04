/* =====================================================
   JUANEKO'S - PANEL DE GESTIÓN DE INSUMOS
===================================================== */

const CLAVE_INSUMOS = "juanekos_insumos_admin_v2";

const INSUMOS_DEFAULT = [
    { id: 1, nombre: "Limón Sutil", categoria: "Verduras / Frutas", cantidad: "4 Sacos", stock: "Adecuado", proveedor: "Mercado Central" },
    { id: 2, nombre: "Pescado Perico / Pota", categoria: "Mariscos / Pescados", cantidad: "25 kg", stock: "Adecuado", proveedor: "Terminal Pesquero" },
    { id: 3, nombre: "Papa Amarilla", categoria: "Tubérculos", cantidad: "6 Sacos", stock: "Bajo", proveedor: "Mayorista Huaycán" },
    { id: 4, nombre: "Aceite Vegetal", categoria: "Abarrotes", cantidad: "4 Baldes", stock: "Adecuado", proveedor: "Distribuidora Lima" },
    { id: 5, nombre: "Arroz Extra", categoria: "Abarrotes", cantidad: "10 Sacos", stock: "Adecuado", proveedor: "Distribuidora Lima" },
    { id: 6, nombre: "Pollo Fresco", categoria: "Carnes / Aves", cantidad: "30 kg", stock: "Adecuado", proveedor: "Avícola San Fernando" },
    { id: 7, nombre: "Ají Limo", categoria: "Verduras", cantidad: "3 kg", stock: "Adecuado", proveedor: "Mercado Central" },
    { id: 8, nombre: "Choclo tierno", categoria: "Verduras", cantidad: "150 Unidades", stock: "Adecuado", proveedor: "Mercado Central" },
    { id: 9, nombre: "Culantro fresco", categoria: "Verduras", cantidad: "5 paquetes", stock: "Adecuado", proveedor: "Mercado Central" },
    { id: 10, nombre: "Camote amarillo", categoria: "Tubérculos", cantidad: "4 Sacos", stock: "Adecuado", proveedor: "Mayorista Huaycán" }
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
    const textoLibre = insumos.map(i => `${i.nombre} - ${i.cantidad} - ${i.stock}`).join('\n');

    contenedor.innerHTML = `
        <div class="admin-modo-wrapper" style="max-width: 1200px; margin: 0 auto; padding: 20px;">
            <div class="admin-modo-header-modern" style="display: flex; flex-direction: column; gap: 12px; margin-bottom: 24px;">
                <div class="header-texts">
                    <span class="admin-etiqueta-modern"><i class="fa-solid fa-boxes-stacked"></i> Inventario Inteligente</span>
                    <h2>Lista de Insumos</h2>
                    <p>Escribe o edita tus insumos en formato de texto libre y conviértelos al instante en tarjetas visuales llamativas.</p>
                </div>
            </div>

            <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 24px;" class="insumos-grid-layout">
                <!-- Panel de Entrada de Texto -->
                <div style="background: var(--bg-card, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">📝 Editor de Texto Rápido</h3>
                        <span style="font-size: 0.8rem; color: var(--text-muted);">Un ítem por línea</span>
                    </div>
                    <p style="margin: 0; font-size: 0.85rem; color: var(--text-muted); line-height: 1.4;">
                        Escribe el insumo, cantidad y estado separándolos con guiones (ej: <b>Limón Sutil - 4 Sacos - Adecuado</b>).
                    </p>
                    <textarea id="textoInsumosLibre" rows="10" style="width: 100%; padding: 14px; border: 1px solid var(--border-color); border-radius: 10px; font-family: inherit; font-size: 0.95rem; resize: vertical; outline: none; background: rgba(0,0,0,0.02);" placeholder="Limón Sutil - 4 Sacos - Adecuado&#10;Pescado Perico - 25 kg - Adecuado">${textoLibre}</textarea>
                    <button type="button" class="btn-primary-modern" onclick="guardarInsumosDesdeTexto()" style="width: 100%; justify-content: center; padding: 12px;">
                        <i class="fa-solid fa-wand-magic-sparkles"></i> Convertir y Visualizar Tarjetas
                    </button>
                </div>

                <!-- Panel de Visualización Llamativa -->
                <div style="background: var(--bg-card, #ffffff); border: 1px solid var(--border-color, #e2e8f0); border-radius: 16px; padding: 24px; box-shadow: 0 4px 20px rgba(0,0,0,0.05); display: flex; flex-direction: column; gap: 16px;">
                    <div style="display: flex; justify-content: space-between; align-items: center;">
                        <h3 style="margin: 0; font-size: 1.1rem; color: var(--text-main);">✨ Vista Visual Atractiva</h3>
                        <button type="button" onclick="abrirModalInsumo()" style="background: var(--accent); color: var(--sidebar-bg); border: none; padding: 6px 12px; border-radius: 6px; font-weight: 700; font-size: 0.85rem; cursor: pointer;">
                            <i class="fa-solid fa-plus"></i> Añadir
                        </button>
                    </div>
                    
                    <div style="display:flex; gap:10px; align-items:center;">
                        <input type="text" id="buscarInsumoInput" placeholder="Buscar insumo visual..." oninput="filtrarInsumosTarjetas(this.value)" style="width:100%; padding:10px 14px; border-radius:8px; border:1px solid var(--border-color); font-size:0.9rem; outline:none;">
                    </div>

                    <div id="tarjetasInsumosGrid" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(220px, 1fr)); gap: 14px; max-height: 400px; overflow-y: auto; padding-right: 4px;">
                        ${insumos.map(item => `
                            <div class="insumo-card-item" style="background: linear-gradient(135deg, #f8fafd, #ffffff); border: 1px solid #e2e8f0; border-radius: 12px; padding: 16px; display: flex; flex-direction: column; gap: 8px; position: relative; transition: transform 0.2s, box-shadow 0.2s;" onmouseover="this.style.transform='translateY(-2px)';this.style.boxShadow='0 8px 20px rgba(0,0,0,0.08)'" onmouseout="this.style.transform='translateY(0)';this.style.boxShadow='none'">
                                <div style="display: flex; justify-content: space-between; align-items: flex-start;">
                                    <span style="font-weight: 800; font-size: 1rem; color: #0f172a;">${item.nombre}</span>
                                    <span style="font-size: 0.72rem; font-weight: 700; padding: 3px 8px; border-radius: 20px; background: ${item.stock === 'Bajo' ? '#fffbe6' : '#f6ffed'}; color: ${item.stock === 'Bajo' ? '#d48806' : '#389e0d'}; border: 1px solid ${item.stock === 'Bajo' ? '#ffe58f' : '#b7eb8f'};">
                                        ${item.stock || 'Adecuado'}
                                    </span>
                                </div>
                                <div style="font-size: 0.9rem; font-weight: 600; color: #0284c7; display: flex; align-items: center; gap: 6px;">
                                    <i class="fa-solid fa-weight-scale"></i> ${item.cantidad}
                                </div>
                                <div style="font-size: 0.8rem; color: #64748b; display: flex; justify-content: space-between; align-items: center; margin-top: auto; padding-top: 8px; border-top: 1px dashed #e2e8f0;">
                                    <span>${item.categoria || 'General'}</span>
                                    <div style="display: flex; gap: 6px;">
                                        <button onclick="editarInsumo(${item.id})" style="background: none; border: none; color: #0284c7; cursor: pointer; padding: 2px 4px;" title="Editar"><i class="fa-solid fa-pen"></i></button>
                                        <button onclick="eliminarInsumo(${item.id})" style="background: none; border: none; color: #dc2626; cursor: pointer; padding: 2px 4px;" title="Eliminar"><i class="fa-solid fa-trash"></i></button>
                                    </div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        </div>

        <!-- Modal Insumo Individual -->
        <div id="modalInsumo" class="admin-modal" style="display:none; position:fixed; inset:0; z-index:9999; background: rgba(0,0,0,0.5); align-items:center; justify-content:center;">
            <div style="background:#fff; width:100%; max-width:420px; border-radius:14px; padding:24px; box-shadow:0 15px 35px rgba(0,0,0,0.2);">
                <h3 id="modalInsumoTitulo" style="margin-top:0; color:#0f172a;">Nuevo Insumo</h3>
                <form id="formInsumo" onsubmit="guardarInsumoSubmit(event)" style="display:flex; flex-direction:column; gap:14px; margin-top:14px;">
                    <input type="hidden" id="insumoId">
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-weight:600; font-size:0.85rem;">Nombre</label>
                        <input type="text" id="insumoNombre" required placeholder="Ej. Limón Sutil" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                    </div>
                    <div style="display:flex; flex-direction:column; gap:4px;">
                        <label style="font-weight:600; font-size:0.85rem;">Categoría</label>
                        <input type="text" id="insumoCategoria" placeholder="Ej. Verduras / Frutas" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                    </div>
                    <div style="display:flex; gap:10px;">
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <label style="font-weight:600; font-size:0.85rem;">Cantidad</label>
                            <input type="text" id="insumoCantidad" required placeholder="Ej. 4 Sacos" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; outline:none;">
                        </div>
                        <div style="flex:1; display:flex; flex-direction:column; gap:4px;">
                            <label style="font-weight:600; font-size:0.85rem;">Stock</label>
                            <select id="insumoStock" style="padding:10px; border:1px solid #cbd5e1; border-radius:8px; background:#fff;">
                                <option value="Adecuado">Adecuado</option>
                                <option value="Bajo">Bajo</option>
                            </select>
                        </div>
                    </div>
                    <div style="display:flex; justify-content:flex-end; gap:10px; margin-top:10px;">
                        <button type="button" onclick="cerrarModalInsumo()" style="padding:10px 16px; border:1px solid #cbd5e1; background:#f8fafc; border-radius:8px; cursor:pointer; font-weight:600;">Cancelar</button>
                        <button type="submit" style="padding:10px 20px; background:var(--accent); color:var(--sidebar-bg); border:none; border-radius:8px; cursor:pointer; font-weight:700;">Guardar</button>
                    </div>
                </form>
            </div>
        </div>
        <style>
            @media (max-width: 900px) {
                .insumos-grid-layout {
                    grid-template-columns: 1fr !important;
                }
            }
        </style>
    `;
}

function guardarInsumosDesdeTexto() {
    const textarea = document.getElementById("textoInsumosLibre");
    if (!textarea) return;
    const lineas = textarea.value.split('\n').map(l => l.trim()).filter(Boolean);
    const nuevosInsumos = lineas.map((linea, index) => {
        const partes = linea.split('-').map(p => p.trim());
        return {
            id: index + 1,
            nombre: partes[0] || `Insumo ${index + 1}`,
            cantidad: partes[1] || "1 Unid",
            stock: partes[2] || "Adecuado",
            categoria: "General"
        };
    });
    guardarInsumos(nuevosInsumos);
    renderizarPanelInsumos();
    if (typeof mostrarMensaje === 'function') mostrarMensaje("¡Insumos convertidos y visualizados con éxito!", "exito");
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
            document.getElementById("insumoCategoria").value = item.categoria || "";
            document.getElementById("insumoCantidad").value = item.cantidad;
            document.getElementById("insumoStock").value = item.stock || "Adecuado";
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
    const categoria = document.getElementById("insumoCategoria").value.trim() || "General";
    const cantidad = document.getElementById("insumoCantidad").value.trim();
    const stock = document.getElementById("insumoStock").value;

    let insumos = obtenerInsumosGuardados();

    if (id) {
        insumos = insumos.map(i => i.id == id ? { ...i, nombre, categoria, cantidad, stock } : i);
    } else {
        const nuevoId = insumos.length > 0 ? Math.max(...insumos.map(i => i.id)) + 1 : 1;
        insumos.push({ id: nuevoId, nombre, categoria, cantidad, stock });
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

function filtrarInsumosTarjetas(query) {
    const q = query.toLowerCase();
    const cards = document.querySelectorAll(".insumo-card-item");
    cards.forEach(card => {
        const texto = card.textContent.toLowerCase();
        card.style.display = texto.includes(q) ? "" : "none";
    });
}

window.renderizarPanelInsumos = renderizarPanelInsumos;
window.guardarInsumosDesdeTexto = guardarInsumosDesdeTexto;
window.abrirModalInsumo = abrirModalInsumo;
window.cerrarModalInsumo = cerrarModalInsumo;
window.guardarInsumoSubmit = guardarInsumoSubmit;
window.eliminarInsumo = eliminarInsumo;
window.editarInsumo = editarInsumo;
window.filtrarInsumosTarjetas = filtrarInsumosTarjetas;
