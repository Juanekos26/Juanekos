const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

// Replace the overly specific input rule
css = css.replace(
    'body.admin-light input[style*="background"],\nbody.admin-light select[style*="background"],\nbody.admin-light textarea[style*="background"] {',
    'body.admin-light input,\nbody.admin-light select,\nbody.admin-light textarea {'
);

css = css.replace(
    'body.admin-light #panelInsumos input,\nbody.admin-light #panelInsumos select,\nbody.admin-light #panelUtensilios input,\nbody.admin-light #panelUtensilios select {',
    'body.admin-light #panelInsumos input,\nbody.admin-light #panelInsumos select,\nbody.admin-light #panelUtensilios input,\nbody.admin-light #panelUtensilios select, body.admin-light .admin-modal input, body.admin-light .admin-modal select {'
);

fs.writeFileSync('Css/admin/admin-light-theme.css', css);
