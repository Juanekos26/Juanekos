const fs = require('fs');
let code = fs.readFileSync('./Js/panel/panel-configuracion.js', 'utf8');

// Replace the DOMContentLoaded getSession with getUser for fresh metadata
code = code.replace(
    /const { data: { session } } = await sb.auth.getSession\(\);\s*if \(session\?\.user\) {/g,
    "const { data: { user } } = await sb.auth.getUser();\n            if (user) {"
);

code = code.replace(
    /const metadata = session\.user\.user_metadata \|\| \{\};/g,
    "const metadata = user.user_metadata || {};"
);

// Also update it in window.configurarPanelPreferencias
code = code.replace(
    /const { data: { session } } = await sb\.auth\.getSession\(\);\s*const user = session\?\.user;/g,
    "const { data: { user } } = await sb.auth.getUser();"
);

fs.writeFileSync('./Js/panel/panel-configuracion.js', code);
