const fs = require('fs');
let content = fs.readFileSync('Js/panel/panel-utilidades.js', 'utf8');

const regex = /const \{ error \} = await sb\.rpc\('eliminar_pedido_admin', \{ p_uuid: uuid \}\);/g;
const newDel = `    let err = null;
    try {
        const res = await sb.from('pedidos').delete().eq('id', uuid);
        if (res.error) err = res.error;
    } catch (e) {
        err = e;
    }
    if (err) throw err;`;

content = content.replace(regex, newDel);
fs.writeFileSync('Js/panel/panel-utilidades.js', content);
console.log('patched delete');
