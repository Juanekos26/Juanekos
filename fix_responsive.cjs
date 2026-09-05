const fs = require('fs');
let file = 'Css/admin/admin-layout-fix.css';
let css = fs.readFileSync(file, 'utf8');

css += `
@media (max-width: 600px) {
    #adminProfileName {
        display: none !important;
    }
}
`;
fs.writeFileSync(file, css);
