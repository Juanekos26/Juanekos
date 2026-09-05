const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

css += `
/* ESTADISTICAS BUTTON FIXES */
body.admin-light #btnFiltrarEstadisticasPersonalizadas {
    background: #3182ce !important; /* Nice blue */
    color: #ffffff !important;
}

body.admin-light #estadisticasFechaInicio,
body.admin-light #estadisticasFechaFin {
    background: #ffffff !important;
    color: #1a2a3a !important;
    border: 1px solid #cbd5e0 !important;
}

body.admin-light #estadisticasPanel > div[style*="background"] {
    background: #ffffff !important;
    border-color: #cbd5e0 !important;
}

body.admin-light #estadisticasPanel label,
body.admin-light #estadisticasPanel span {
    color: #4a5568 !important;
}
`;

fs.writeFileSync('Css/admin/admin-light-theme.css', css);
