const fs = require('fs');
let content = fs.readFileSync('Js/panel/panel-detalle.js', 'utf8');

const regexProductos = /function generarProductosDetalle\(productos\) \{[\s\S]*?\} \/\* ========================================/g;

const newProductos = `function generarProductosDetalle(productos) {
    if (!Array.isArray(productos) || !productos.length) {
        return \`
            <p class="sin-productos">
                No hay productos registrados.
            </p>
        \`;
    }
    return productos.map(producto => {
        const cantidad = Number(producto.cantidad || 0);
        const precio = Number(producto.precio || 0);
        const subtotal = cantidad * precio;
        
        let imagenSrc = producto.imagen_url || producto.imagen || '';
        // Si no hay imagen intentamos usar un placeholder elegante basado en su categoría
        if (!imagenSrc) {
            const nombreLower = String(producto.nombre || '').toLowerCase();
            const esCev = ["ceviche", "pota", "tiradito", "chilcano", "causa", "parihuela", "leche", "marisco"].some(k => nombreLower.includes(k));
            if (esCev) {
                imagenSrc = 'https://images.unsplash.com/photo-1599084993091-1cb5c0721cc6?q=80&w=200&auto=format&fit=crop';
            } else if (nombreLower.includes('broaster') || nombreLower.includes('pollo') || nombreLower.includes('alita')) {
                imagenSrc = 'https://images.unsplash.com/photo-1562967914-608f82629710?q=80&w=200&auto=format&fit=crop';
            } else {
                imagenSrc = 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?q=80&w=200&auto=format&fit=crop';
            }
        }

        return \`
            <article class="detalle-producto" style="display: flex; gap: 16px; padding: 16px; margin-bottom: 12px; background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.05); border-radius: 12px; align-items: center; transition: background 0.2s;">
                <div class="detalle-producto-img-container" style="width: 70px; height: 70px; border-radius: 10px; overflow: hidden; flex-shrink: 0; border: 1px solid rgba(255,255,255,0.1); background: rgba(0,0,0,0.3);">
                    <img src="\${imagenSrc}" alt="\${escaparHTML(producto.nombre)}" style="width: 100%; height: 100%; object-fit: cover;">
                </div>
                <div class="detalle-producto-info" style="flex: 1; min-width: 0;">
                    <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 4px;">
                        <strong style="color: #fff; font-size: 1rem; font-family: 'Playfair Display', serif; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; padding-right: 12px;">
                            \${escaparHTML(producto.nombre)}
                        </strong>
                        <strong class="detalle-producto-total" style="color: #d4a017; font-size: 1.1rem; flex-shrink: 0;">
                            \${formatearPrecio(subtotal)}
                        </strong>
                    </div>
                    <div style="display: flex; flex-wrap: wrap; gap: 12px; margin-bottom: 8px;">
                        <span style="color: var(--text-muted, #7a8ba3); font-size: 0.8rem; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-tag"></i> \${escaparHTML(producto.categoria || "-")}</span>
                        <span style="color: var(--text-muted, #7a8ba3); font-size: 0.8rem; display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-coins"></i> \${formatearPrecio(precio)} c/u</span>
                        <span style="color: #fff; font-size: 0.8rem; font-weight: 700; background: rgba(255,255,255,0.1); padding: 2px 8px; border-radius: 6px;">Cant: \${cantidad}</span>
                    </div>
                    \${generarAcompanamientosDetalle(producto.acompanamientos)}
                </div>
            </article>
        \`;
    }).join("");
}
/* ========================================`;

content = content.replace(regexProductos, newProductos);
fs.writeFileSync('Js/panel/panel-detalle.js', content);
console.log('patched');
