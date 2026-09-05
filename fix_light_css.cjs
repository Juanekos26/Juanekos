const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-light-theme.css', 'utf8');

css = css.replace(
    'body.admin-light .resumen-box span, \nbody.admin-light .resumen-box p {\n    color: #4a5568 !important;\n}',
    'body.admin-light .resumen-box span[style*="color: var"], \nbody.admin-light .resumen-box p {\n    color: #4a5568 !important;\n}'
);

fs.writeFileSync('Css/admin/admin-light-theme.css', css);
