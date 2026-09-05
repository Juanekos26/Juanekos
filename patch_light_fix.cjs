const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

// Replace the generic div override to NOT target .admin-modal or its backdrop
css = css.replace(
    'body.admin-light #panelInsumos div[style*="background"],\nbody.admin-light #panelUtensilios div[style*="background"] {',
    'body.admin-light #panelInsumos div[style*="background"]:not(.admin-modal),\nbody.admin-light #panelUtensilios div[style*="background"]:not(.admin-modal) {'
);

css = css.replace(
    'body.admin-light [id^="panel"] div[style*="background"] {',
    'body.admin-light [id^="panel"] div[style*="background"]:not(.admin-modal):not(.admin-modal-backdrop) {'
);

// Fix the admin modal background so it stays a backdrop
css += `
/* PRESERVE MODAL BACKDROP */
body.admin-light .admin-modal {
    background: rgba(0, 0, 0, 0.4) !important;
    border: none !important;
    box-shadow: none !important;
}
`;

fs.writeFileSync('Css/admin/admin-light-theme.css', css);
