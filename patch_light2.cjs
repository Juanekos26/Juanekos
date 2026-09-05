const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

css += `
/* BADGES IN MODO OPERACION */
body.admin-light .admin-modo-badge {
    background: #edf2f7 !important;
    color: #4a5568 !important;
    border-color: #cbd5e0 !important;
}
body.admin-light .admin-modo-badge.cevicheria {
    background: #ebf8ff !important;
    color: #2b6cb0 !important;
}
body.admin-light .admin-modo-badge.broaster {
    background: #fffff0 !important;
    color: #d69e2e !important;
}
body.admin-light .admin-modo-badge.prueba {
    background: #faf5ff !important;
    color: #6b46c1 !important;
}
body.admin-light .admin-modo-badge.cerrado {
    background: #fff5f5 !important;
    color: #c53030 !important;
}
/* SPECIFIC OVERRIDES FOR .admin-modo-guardar */
body.admin-light .admin-modo-guardar {
    background: #3182ce !important;
    color: #ffffff !important;
}
`;
fs.writeFileSync('Css/admin/admin-light-theme.css', css);
