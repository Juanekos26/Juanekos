const fs = require('fs');
let content = fs.readFileSync('Js/pedido.js', 'utf8');

const regex = /const fh = obtenerFechaHora\(\);\s*const pedido = \{\s*uuid: data\.id,\s*id: Number\(data\.numero_pedido\),\s*cliente: actual\.cliente,\s*mesa,\s*productos: actual\.productos,\s*total: Number\(data\.total \|\| actual\.total \|\| 0\),\s*fecha: fh\.fecha, hora: fh\.hora, timestamp: fh\.timestamp,\s*estado: data\.estado \|\| 'inicio'\s*\};/g;

const newLogic = `
    const fh = obtenerFechaHora();
    // Si la base de datos nos devuelve la fecha (p.ej. data.fecha o data.created_at), la usamos para evitar desincronización
    const fechaServidor = data.fecha ? data.fecha : (data.created_at ? new Date(data.created_at).toLocaleDateString('es-PE', {timeZone: 'America/Lima'}) : fh.fecha);
    const horaServidor = data.hora ? data.hora : (data.created_at ? new Date(data.created_at).toLocaleTimeString('es-PE', {timeZone: 'America/Lima', hour:'2-digit', minute:'2-digit', hour12:true}) : fh.hora);
    const timestampServidor = data.created_at ? new Date(data.created_at).getTime() : fh.timestamp;
    
    const pedido = {
      uuid: data.id,
      id: Number(data.numero_pedido),
      cliente: actual.cliente,
      mesa,
      productos: actual.productos,
      total: Number(data.total || actual.total || 0),
      fecha: fechaServidor, hora: horaServidor, timestamp: timestampServidor,
      estado: data.estado || 'inicio'
    };
`;

content = content.replace(regex, newLogic);
fs.writeFileSync('Js/pedido.js', content);
console.log('pedido.js patched');
