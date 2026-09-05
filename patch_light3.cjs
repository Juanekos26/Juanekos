const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

css += `
/* =======================================
   INSUMOS & UTENSILIOS OVERRIDES
========================================== */
body.admin-light #panelInsumos > div,
body.admin-light #panelUtensilios > div,
body.admin-light #panelInsumos div[style*="background"],
body.admin-light #panelUtensilios div[style*="background"] {
    background: #ffffff !important;
    color: #1a2a3a !important;
    border-color: #cbd5e0 !important;
}

body.admin-light #panelInsumos table th,
body.admin-light #panelUtensilios table th {
    background: #edf2f7 !important;
    color: #2d3748 !important;
    border-bottom: 2px solid #cbd5e0 !important;
}

body.admin-light #panelInsumos table td,
body.admin-light #panelUtensilios table td {
    color: #4a5568 !important;
    border-bottom: 1px solid #e2e8f0 !important;
}

body.admin-light #modalInsumo > div:nth-child(1),
body.admin-light #modalUtensilio > div:nth-child(1) {
    background: #ffffff !important;
}

body.admin-light #modalInsumo label,
body.admin-light #modalUtensilio label,
body.admin-light #modalInsumo h3,
body.admin-light #modalUtensilio h3 {
    color: #1a2a3a !important;
}

body.admin-light #panelInsumos h2,
body.admin-light #panelInsumos h3,
body.admin-light #panelUtensilios h2,
body.admin-light #panelUtensilios h3 {
    color: #1a2a3a !important;
}

body.admin-light #panelInsumos p,
body.admin-light #panelUtensilios p,
body.admin-light #panelInsumos label,
body.admin-light #panelUtensilios label {
    color: #4a5568 !important;
}

body.admin-light #panelInsumos input,
body.admin-light #panelInsumos select,
body.admin-light #panelUtensilios input,
body.admin-light #panelUtensilios select {
    background: #f7fafc !important;
    color: #1a2a3a !important;
    border-color: #cbd5e0 !important;
}

/* =======================================
   MENU DEL DIA OVERRIDES
========================================== */
body.admin-light .menu-dia-form {
    background: #ffffff !important;
    border: 1px solid #cbd5e0 !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.05) !important;
}
body.admin-light .menu-dia-form-title h3 {
    color: #1a2a3a !important;
}
body.admin-light .admin-menu-dia-toolbar label,
body.admin-light .menu-dia-form label,
body.admin-light .menu-dia-form label span {
    color: #4a5568 !important;
}
body.admin-light .menu-dia-admin-item {
    background: #ffffff !important;
    border: 1px solid #cbd5e0 !important;
}
body.admin-light .menu-dia-admin-item-main h4 {
    color: #1a2a3a !important;
}
body.admin-light .menu-dia-admin-item-main p {
    color: #4a5568 !important;
}
body.admin-light .menu-dia-upload-box,
body.admin-light .menu-dia-preview-box {
    background: #f7fafc !important;
    border-color: #cbd5e0 !important;
}
body.admin-light .menu-dia-upload-box small {
    color: #718096 !important;
}
body.admin-light .menu-dia-admin-item-img {
    border-color: #cbd5e0 !important;
}
body.admin-light .menu-dia-admin-item-main > strong {
    color: #d69e2e !important;
}

/* FORCE GLOBALS FOR ANY DARK MODE TEXT ON LIGHT THEME */
body.admin-light * {
    scrollbar-color: #cbd5e0 #f7fafc;
}
body.admin-light ::-webkit-scrollbar-track {
    background: #f7fafc;
}
body.admin-light ::-webkit-scrollbar-thumb {
    background: #cbd5e0;
}
body.admin-light .admin-modal {
    background: rgba(0,0,0,0.3) !important; /* Lighter backdrop */
}
`;
fs.writeFileSync('Css/admin/admin-light-theme.css', css);
