const fs = require('fs');
let content = fs.readFileSync('Js/panel/panel-ventas.js', 'utf8');

const regexEstado = /if\s*\(estadoSeleccionado\)\s*\{\s*pedidos\s*=\s*pedidos\.filter\(\s*pedido\s*=>\s*normalizarEstado\(\s*pedido\.estado\s*\)\s*===\s*estadoSeleccionado\s*\);\s*\}/;

const filterLogicNew = `    if (estadoSeleccionado) {
        pedidos = pedidos.filter(pedido => normalizarEstado(pedido.estado) === estadoSeleccionado);
    }

    // Filtrar por categoría
    if (window.categoriaPedidoActiva && window.categoriaPedidoActiva !== 'todos') {
        pedidos = pedidos.filter(pedido => {
            let esCev = false;
            let esBros = false;
            const productos = Array.isArray(pedido.productos) ? pedido.productos : [];
            productos.forEach(item => {
                const nombre = String(item.nombre || "").toLowerCase();
                const keywordsCev = ["ceviche", "pota", "tiradito", "chilcano", "causa", "parihuela", "leche", "marisco", "mariscos", "chaufa", "duo", "dúo", "trio", "trío", "pescado"];
                const isCevItem = keywordsCev.some(k => nombre.includes(k));
                if (isCevItem) esCev = true;
                else esBros = true;
            });
            
            if (window.categoriaPedidoActiva === 'cevicheria') return esCev;
            if (window.categoriaPedidoActiva === 'broaster') return esBros || (!esCev && !esBros);
            return true;
        });
    }`;

content = content.replace(regexEstado, filterLogicNew);

const regexEvents = /function\s+configurarFiltrosVentas\(\)\s*\{\s*const\s+fecha\s*=\s*document\.getElementById\(\s*"filtroFecha"\s*\);/;

const eventsNew = `function configurarFiltrosVentas() {
    window.categoriaPedidoActiva = 'todos';
    const tabs = document.querySelectorAll('.tab-categoria-pedido');
    tabs.forEach(tab => {
        tab.addEventListener('click', () => {
            tabs.forEach(t => {
                t.classList.remove('active');
                t.style.background = 'transparent';
                t.style.border = '1px solid rgba(255,255,255,0.05)';
                t.style.color = 'var(--text-muted, #7a8ba3)';
                t.style.fontWeight = '700';
            });
            tab.classList.add('active');
            tab.style.background = 'rgba(212,160,23,0.15)';
            tab.style.border = '1px solid rgba(212,160,23,0.3)';
            tab.style.color = '#d4a017';
            tab.style.fontWeight = '800';
            window.categoriaPedidoActiva = tab.dataset.categoria;
            renderizarVentas();
        });
    });

    const fecha = document.getElementById("filtroFecha");`;

content = content.replace(regexEvents, eventsNew);

fs.writeFileSync('Js/panel/panel-ventas.js', content);
console.log('Patched again');
