const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');
css += `
/* =======================================
   MENU DEL DIA OVERRIDES PART 2
========================================== */
body.admin-light .admin-menu-dia-card {
    background: #ffffff !important;
    border-color: #cbd5e0 !important;
}
body.admin-light .admin-menu-dia-card h2,
body.admin-light .admin-menu-dia-card h3 {
    color: #1a2a3a !important;
}
body.admin-light .admin-menu-dia-card p,
body.admin-light .admin-menu-dia-card span {
    color: #4a5568 !important;
}
`;
fs.writeFileSync('Css/admin/admin-light-theme.css', css);
