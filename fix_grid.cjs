const fs = require('fs');
let css = fs.readFileSync('Css/admin/admin-modern.css', 'utf8');

// Replace the comparativa css
css = css.replace(
    /    \.resumen-comparativa \{\n        grid-column: 2 \/ 4; \/\* center it in the middle of the 4 columns \*\/\n    \}/g,
    '    .resumen-comparativa {\n        grid-column: 1 / -1;\n    }'
);

css = css.replace(
    /    \.resumen-comparativa \{\n        grid-column: span 2;\n    \}/g,
    ''
);

fs.writeFileSync('Css/admin/admin-modern.css', css);
