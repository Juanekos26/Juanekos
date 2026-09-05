const fs = require('fs');
const file = 'Css/admin/admin-modern.css';
let css = fs.readFileSync(file, 'utf8');

// We will replace the .resumen-dashboard grid stuff
css = css.replace(/@media \(min-width: 768px\) \{\s*\.resumen-dashboard \{[\s\S]*?\}\s*\}/, '');
css = css.replace(/@media \(min-width: 1200px\) \{\s*\.resumen-dashboard \{[\s\S]*?\}\s*\}/, '');

fs.writeFileSync(file, css);
