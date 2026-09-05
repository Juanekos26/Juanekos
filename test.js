function generarRangoFechasResumen(fechaInicio, fechaFin) {
    const fechas = [];
    const dInicio = new Date(fechaInicio + "T00:00:00");
    const dFin = new Date(fechaFin + "T23:59:59");
    const dActual = new Date(dInicio);
    while (dActual <= dFin) {
        const dia = String(dActual.getDate()).padStart(2, '0');
        const mes = String(dActual.getMonth() + 1).padStart(2, '0');
        const anio = dActual.getFullYear();
        fechas.push(`${dia}/${mes}/${anio}`);
        dActual.setDate(dActual.getDate() + 1);
    }
    return fechas;
}
console.log(generarRangoFechasResumen('2026-09-01', '2026-09-05'));
