const fs = require('fs');
const file = 'Css/admin/admin-modern.css';
let css = fs.readFileSync(file, 'utf8');

css = css.replace(/@media \(min-width: 1200px\) \{[\s\S]*?\.resumen-comparativa \{[\s\S]*?grid-column: 1 \/ -1;[\s\S]*?\}[\s\S]*?\}/, '');

fs.writeFileSync(file, css);
