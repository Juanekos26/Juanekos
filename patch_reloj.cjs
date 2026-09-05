const fs = require('fs');
let js = fs.readFileSync('Js/panel/panel.js', 'utf8');

const target = `    const reloj = document.getElementById("adminReloj");
    if (reloj) {
        const pintarReloj = () => {
            reloj.textContent = new Date().toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true });
        };
        pintarReloj();
        setInterval(pintarReloj, 30000);
    }`;

const replacement = `    const reloj = document.getElementById("adminReloj");
    const fecha = document.getElementById("adminFecha");
    if (reloj || fecha) {
        const pintarReloj = () => {
            const now = new Date();
            if (reloj) reloj.textContent = now.toLocaleTimeString("es-PE", { hour: "2-digit", minute: "2-digit", hour12: true });
            if (fecha) fecha.textContent = now.toLocaleDateString("es-PE", { day: '2-digit', month: 'short', year: 'numeric' });
        };
        pintarReloj();
        setInterval(pintarReloj, 10000); // 10s
    }`;

js = js.replace(target, replacement);
fs.writeFileSync('Js/panel/panel.js', js);
