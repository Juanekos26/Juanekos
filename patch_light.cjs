const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

// 1. Sidebar Nav Btn Background
css = css.replace(
    'body.admin-light .sidebar-nav .nav-btn {\n    color: #4a5568 !important;\n}',
    'body.admin-light .sidebar-nav .nav-btn {\n    background: transparent !important;\n    color: #4a5568 !important;\n}'
);

// 2. Sidebar Footer
css += `
/* SIDEBAR FOOTER (Cerrar Sesión Area) */
body.admin-light .sidebar-footer {
    background: #ffffff !important;
    border-top: 1px solid #e1e8f0 !important;
}
body.admin-light .sidebar-footer span {
    color: #4a5568 !important;
}
`;

// 3. Modals and Forms
css += `
/* MODALS & FORMS OVERRIDES */
body.admin-light .admin-modal-card {
    background: #ffffff !important;
    border: 1px solid #e1e8f0 !important;
    box-shadow: 0 10px 25px rgba(0,0,0,0.1) !important;
}
body.admin-light .admin-modal-card h2,
body.admin-light .admin-modal-card h3 {
    color: #1a2a3a !important;
}
body.admin-light .admin-modal-card label,
body.admin-light .editor-campo label {
    color: #4a5568 !important;
}
body.admin-light .admin-modal-card button#btnCerrarModalProducto,
body.admin-light .admin-modal-card button[id^="btnCerrar"] {
    color: #1a2a3a !important;
}
/* Overriding inline styles in modals/inputs */
body.admin-light input[style*="background"],
body.admin-light select[style*="background"],
body.admin-light textarea[style*="background"] {
    background: #f7fafc !important;
    color: #1a2a3a !important;
    border-color: #cbd5e0 !important;
}
`;

// 4. MODO OPERACIÓN
css += `
/* MODO OPERACION PANELS */
body.admin-light .modo-status-card,
body.admin-light .admin-modo-card,
body.admin-light .admin-modo-field,
body.admin-light .admin-modo-info,
body.admin-light .panel-herramientas,
body.admin-light .ventas-header {
    background: #ffffff !important;
    border-color: #e1e8f0 !important;
    box-shadow: 0 2px 5px rgba(0,0,0,0.02) !important;
    color: #1a2a3a !important;
}
body.admin-light .modo-status-card .status-info span,
body.admin-light .admin-modo-info span {
    color: #4a5568 !important;
}
body.admin-light .modo-status-card .status-info strong,
body.admin-light .admin-modo-info strong,
body.admin-light .admin-modo-field span {
    color: #1a2a3a !important;
}
body.admin-light .modo-status-card .status-icon i {
    color: #4a5568 !important;
}
`;

// 5. INSUMOS / UTENSILIOS / MENU DEL DIA
css += `
/* OTHER PANELS (Insumos, Utensilios, Menú del día) */
body.admin-light .item-inventario,
body.admin-light .menu-dia-item {
    background: #ffffff !important;
    border: 1px solid #e1e8f0 !important;
}
body.admin-light .item-inventario:hover,
body.admin-light .menu-dia-item:hover {
    background: #f7fafc !important;
}
body.admin-light .item-inventario strong,
body.admin-light .menu-dia-item h4 {
    color: #1a2a3a !important;
}
body.admin-light .item-inventario span,
body.admin-light .menu-dia-item p {
    color: #4a5568 !important;
}

/* FIXING INLINE COLOR="FFF" IN LIGHT MODE */
body.admin-light [style*="color: #fff"], 
body.admin-light [style*="color: #ffffff"], 
body.admin-light [style*="color: rgba(255,255,255"] {
    color: #1a2a3a !important;
}
`;

fs.writeFileSync('Css/admin/admin-light-theme.css', css);
