const fs = require('fs');
let content = fs.readFileSync('Js/panel/panel-ventas.js', 'utf8');

const regexLimpiar = /function limpiarFiltrosPedidos\(\) \{[\s\S]*?renderizarVentas\(\);\s*\}/;

const newLimpiar = `function limpiarFiltrosPedidos() {
    const fecha = document.getElementById("filtroFecha");
    const estado = document.getElementById("filtroEstado");
    const buscador = document.getElementById("buscarPedido");

    if (fecha) fecha.value = "";
    if (estado) estado.value = "";
    if (buscador) buscador.value = "";
    
    // Reset category tab to "todos"
    const tabs = document.querySelectorAll('.tab-categoria-pedido');
    tabs.forEach(t => {
        t.classList.remove('active');
        t.style.background = 'transparent';
        t.style.border = '1px solid rgba(255,255,255,0.05)';
        t.style.color = 'var(--text-muted, #7a8ba3)';
        t.style.fontWeight = '700';
    });
    const tabTodos = document.querySelector('.tab-categoria-pedido[data-categoria="todos"]');
    if (tabTodos) {
        tabTodos.classList.add('active');
        tabTodos.style.background = 'rgba(212,160,23,0.15)';
        tabTodos.style.border = '1px solid rgba(212,160,23,0.3)';
        tabTodos.style.color = '#d4a017';
        tabTodos.style.fontWeight = '800';
        window.categoriaPedidoActiva = 'todos';
    }

    renderizarVentas();
}`;

content = content.replace(regexLimpiar, newLimpiar);
fs.writeFileSync('Js/panel/panel-ventas.js', content);
console.log('limpiar.js patched');
