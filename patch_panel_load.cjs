const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel.js', 'utf8');

const targetStr = `    const rol = typeof obtenerRolPanel === 'function' ? obtenerRolPanel() : null;
    if (!rol) return;
    if (rol === 'admin' && typeof window.juanekosCargarModoOperacion === "function") await window.juanekosCargarModoOperacion();
    if (typeof cargarCatalogoSupabase === "function") await cargarCatalogoSupabase();
    if (typeof cargarPedidosSupabaseAdmin === "function") await cargarPedidosSupabaseAdmin();
    if (rol === 'admin' && typeof cargarMenuDiaSupabase === "function") await cargarMenuDiaSupabase(fechaISOJuanekos(), true);
    await cargarComponentesPanel();
    configurarPanel();
    aplicarPermisosRolPanel();

    // Vista inicial exclusiva: nunca mezclar Registro con Inventario.
    const destinoInicial = rol === 'mesero' ? 'panelPedidos' : 'panelResumen';
    const botonInicial = document.querySelector(\`.sidebar-nav .nav-btn[data-target="\${destinoInicial}"]\`);
    if (typeof mostrarSeccion === 'function') mostrarSeccion(destinoInicial, botonInicial);`;

const newStr = `    const rol = typeof obtenerRolPanel === 'function' ? obtenerRolPanel() : null;
    if (!rol) return;
    
    aplicarPermisosRolPanel();

    const destinoInicial = rol === 'mesero' ? 'panelPedidos' : 'panelResumen';
    const botonInicial = document.querySelector(\`.sidebar-nav .nav-btn[data-target="\${destinoInicial}"]\`);
    if (typeof mostrarSeccion === 'function') mostrarSeccion(destinoInicial, botonInicial);

    const promesas = [
        cargarComponentesPanel(),
        (typeof cargarCatalogoSupabase === "function" ? cargarCatalogoSupabase() : Promise.resolve()),
        (typeof cargarPedidosSupabaseAdmin === "function" ? cargarPedidosSupabaseAdmin() : Promise.resolve())
    ];

    if (rol === 'admin') {
        if (typeof window.juanekosCargarModoOperacion === "function") promesas.push(window.juanekosCargarModoOperacion());
        if (typeof cargarMenuDiaSupabase === "function") promesas.push(cargarMenuDiaSupabase(fechaISOJuanekos(), true));
    }

    await Promise.all(promesas);

    configurarPanel();
    
    if (typeof mostrarSeccion === 'function') mostrarSeccion(destinoInicial, botonInicial);`;

js = js.replace(targetStr, newStr);
fs.writeFileSync('Js/panel/panel.js', js);
