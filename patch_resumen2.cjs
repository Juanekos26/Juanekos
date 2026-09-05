const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

// Fix the last div (comparativa) to have 'resumen-box resumen-comparativa'
html = html.replace(/<div style=" border-radius: 20px; padding: 24px 20px; text-align: center; ">/, '<div class="resumen-box resumen-comparativa" style="border-radius: 20px; padding: 24px 20px; text-align: center;">');

// Save HTML
fs.writeFileSync('Admin/panel-resumen.html', html);

let modernCss = fs.readFileSync('Css/admin/admin-modern.css', 'utf8');

// Add default dark mode styles for .resumen-box
modernCss += `
/* Base dark mode for resumen boxes */
.resumen-box {
    background: #10233f;
    border: 1px solid rgba(255, 255, 255, 0.05);
}
@media (min-width: 1200px) {
    .resumen-comparativa {
        grid-column: span 2;
    }
    /* To balance out the grid, if we have:
       Row 2: Group (2), Cevicheria (1), Broaster (1) = 4
       Row 3: Ventas Totales (1), Pedidos Totales (1), Group (2) = 4
       Row 4: Comparativa (2) - Let's center it or put it nicely
    */
    .resumen-comparativa {
        grid-column: 2 / 4; /* center it in the middle of the 4 columns */
    }
}
`;
fs.writeFileSync('Css/admin/admin-modern.css', modernCss);

let lightCss = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');
lightCss += `
/* LIGHT THEME FOR RESUMEN BOXES */
body.admin-light .resumen-box {
    background: #ffffff !important;
    border: 1px solid #cbd5e0 !important;
    box-shadow: 0 4px 6px rgba(0,0,0,0.02) !important;
}
body.admin-light .resumen-box strong, 
body.admin-light .resumen-box h3 {
    color: #1a2a3a !important;
}
body.admin-light .resumen-box span, 
body.admin-light .resumen-box p {
    color: #4a5568 !important;
}
`;
fs.writeFileSync('Css/admin/admin-light-theme.css', lightCss);
