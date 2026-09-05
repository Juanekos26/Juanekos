const fs = require('fs');
const file = 'Css/admin/admin-layout-fix.css';
let css = fs.readFileSync(file, 'utf8');

css += `
/* FORZAR 4 COLUMNAS EN ESCRITORIO PARA EL PANEL RESUMEN */
@media (min-width: 1025px) {
    .resumen-dashboard {
        display: flex !important;
        flex-direction: column !important;
        width: 100% !important;
    }
    .resumen-header-full {
        width: 100% !important;
    }
    .ventas-resumen {
        display: grid !important;
        grid-template-columns: repeat(4, minmax(0, 1fr)) !important;
        gap: 16px !important;
        width: 100% !important;
    }
    .resumen-comparativa {
        grid-column: span 1 !important; /* Si quieres que solo ocupe 1 columna como las demas */
    }
}
`;
fs.writeFileSync(file, css);
