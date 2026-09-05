const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

css += `
/* MODO OPERACION MODERN FIXES */
body.admin-light .admin-modo-wrapper .admin-modo-form-card,
body.admin-light .admin-modo-wrapper .modo-info-box,
body.admin-light .admin-modo-wrapper .select-wrapper-modern select,
body.admin-light .admin-modo-wrapper .admin-modo-header-modern {
    background: #ffffff !important;
    border-color: #cbd5e0 !important;
    color: #1a2a3a !important;
}

body.admin-light .admin-modo-wrapper .modo-info-box i,
body.admin-light .admin-modo-wrapper .select-arrow,
body.admin-light .admin-modo-wrapper p {
    color: #4a5568 !important;
}

body.admin-light .admin-modo-wrapper h2,
body.admin-light .admin-modo-wrapper h3,
body.admin-light .admin-modo-wrapper label {
    color: #1a2a3a !important;
}

body.admin-light .admin-modo-wrapper .btn-outline-gold {
    border-color: #d69e2e !important;
    color: #d69e2e !important;
}
`;
fs.writeFileSync('Css/admin/admin-light-theme.css', css);
