const a = new Date();
console.log(a.toLocaleDateString('es-PE', {timeZone: 'America/Lima'}));
console.log(a.toLocaleTimeString('es-PE', {timeZone: 'America/Lima', hour:'2-digit', minute:'2-digit', hour12:true}));
