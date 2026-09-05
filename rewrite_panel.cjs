const fs = require('fs');

let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

// I will extract the Header and the <section id="estadisticasPanel">...
// and completely replace the middle part.
// The middle part starts after: <div class="resumen-header-full"...> ... </div>
// and ends before: <section id="estadisticasPanel"

let p1 = html.indexOf('<!-- PARTE 1:');
let p2 = html.indexOf('<section');

if (p1 > -1 && p2 > -1) {
    let before = html.substring(0, p1);
    let after = html.substring(p2);
    
    let gridHtml = `    <div class="ventas-resumen">
        <!-- Ventas de hoy -->
        <div class="resumen-box" style="border-radius: 20px; padding: 20px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(212, 160, 23, 0.1); border: 1px solid rgba(212, 160, 23, 0.2); display: flex; align-items: center; justify-content: center; color: #d4a017; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-wallet"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">VENTAS DE HOY</span>
            <strong id="ventasHoy" style="color: var(--text-main, #ffffff); font-size: 1.35rem; font-weight: 800; display: block; margin-bottom: 4px;">S/ 0.00</strong>
            <span id="pedidosHoySub" style="color: var(--text-muted, #7a8ba3); font-size: 0.8rem; font-weight: 500;">0 pedidos</span>
        </div>

        <!-- Pedidos Hoy Cevicheria -->
        <div class="resumen-box" style="border-radius: 20px; padding: 20px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2); display: flex; align-items: center; justify-content: center; color: #f97316; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-fish"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS CEVICHERÍA (HOY)</span>
            <strong id="pedidosHoyCevicheriaTop" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
        </div>

        <!-- Pedidos Hoy Broaster -->
        <div class="resumen-box" style="border-radius: 20px; padding: 20px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; justify-content: center;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); display: flex; align-items: center; justify-content: center; color: #eab308; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-drumstick-bite"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS BROASTER (HOY)</span>
            <strong id="pedidosHoyBroasterTop" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
        </div>

        <!-- Tarjeta Comparativa final -->
        <div class="resumen-box resumen-comparativa" style="border-radius: 20px; padding: 24px 20px; text-align: center;">
            <h3 style="color: var(--text-main, #ffffff); font-size: 1.1rem; font-weight: 800; margin: 0 0 4px 0; font-family: 'Playfair Display', serif;">Comparativa</h3>
            <p style="color: var(--text-muted, #7a8ba3); font-size: 0.75rem; margin: 0 0 16px 0;">Cevichería vs Broaster (Hoy)</p>
            
            <div style="height: 140px; position: relative; margin-bottom: 16px;">
                <canvas id="resumenDoughnutChart"></canvas>
                <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;">
                    <strong id="totalVentasDoughnut" style="color: var(--text-main, #ffffff); font-size: 0.9rem; font-weight: 800; display: block;">S/ 0</strong>
                </div>
            </div>
            <div style="display: flex; justify-content: space-between; font-size: 0.75rem; padding: 0 10px;">
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="width: 10px; height: 10px; background: #3b82f6; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: var(--text-muted, #7a8ba3);">Cev.</span> <strong id="porcentajeCevicheria" style="color: var(--text-main, #ffffff);">0%</strong>
                </div>
                <div style="display: flex; align-items: center; gap: 4px;">
                    <span style="width: 10px; height: 10px; background: #eab308; border-radius: 50%; display: inline-block;"></span>
                    <span style="color: var(--text-muted, #7a8ba3);">Bro.</span> <strong id="porcentajeBroaster" style="color: var(--text-main, #ffffff);">0%</strong>
                </div>
            </div>
        </div>

        <!-- Tarjeta Cevicheria -->
        <button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="cevicheria" style="width: 100%; border-radius: 20px; padding: 22px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.05); background: transparent;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(249, 115, 22, 0.1); border: 1px solid rgba(249, 115, 22, 0.2); display: flex; align-items: center; justify-content: center; color: #f97316; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-fish"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">CEVICHERÍA</span>
            <strong id="ventasCevicheria" style="color: var(--text-main, #ffffff); font-size: 1.6rem; font-weight: 800; display: block; margin-bottom: 4px;">S/ 0.00</strong>
            <span id="pedidosCevicheria" style="color: var(--text-muted, #7a8ba3); font-size: 0.85rem; font-weight: 500; margin-bottom: 8px;">0 pedidos</span>
            <span style="color: #f97316; font-size: 0.8rem; font-weight: 600;">Ver gráfico diario →</span>
        </button>

        <!-- Tarjeta Broaster -->
        <button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="broaster" style="width: 100%; border-radius: 20px; padding: 22px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.05); background: transparent;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); display: flex; align-items: center; justify-content: center; color: #eab308; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-drumstick-bite"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">BROASTER</span>
            <strong id="ventasBroaster" style="color: var(--text-main, #ffffff); font-size: 1.6rem; font-weight: 800; display: block; margin-bottom: 4px;">S/ 0.00</strong>
            <span id="pedidosBroaster" style="color: var(--text-muted, #7a8ba3); font-size: 0.85rem; font-weight: 500; margin-bottom: 8px;">0 pedidos</span>
            <span style="color: #eab308; font-size: 0.8rem; font-weight: 600;">Ver gráfico diario →</span>
        </button>

        <!-- PARTE 2: Ventas Totales -->
        <button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="ventas" style="width: 100%; border-radius: 20px; padding: 22px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.05); background: transparent;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(212, 160, 23, 0.1); border: 1px solid rgba(212, 160, 23, 0.2); display: flex; align-items: center; justify-content: center; color: #d4a017; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-chart-column"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">VENTAS TOTALES</span>
            <strong id="ventasTotales" style="color: var(--text-main, #ffffff); font-size: 1.6rem; font-weight: 800; display: block; margin-bottom: 4px;">S/ 0.00</strong>
            <span id="pedidosTotalesCount" style="color: var(--text-muted, #7a8ba3); font-size: 0.85rem; font-weight: 500; margin-bottom: 8px;">0 pedidos</span>
            <span style="color: #d4a017; font-size: 0.8rem; font-weight: 600;">Ver estadísticas →</span>
        </button>

        <!-- Pedidos Totales -->
        <button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="pedidos" style="width: 100%; border-radius: 20px; padding: 22px 20px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; transition: transform 0.2s; border: 1px solid rgba(255,255,255,0.05); background: transparent;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(59, 130, 246, 0.1); border: 1px solid rgba(59, 130, 246, 0.2); display: flex; align-items: center; justify-content: center; color: #3b82f6; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-clipboard"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.75rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS TOTALES</span>
            <strong id="pedidosTotales" style="color: var(--text-main, #ffffff); font-size: 1.8rem; font-weight: 800; display: block; margin-bottom: 8px;">0</strong>
            <span style="color: #3b82f6; font-size: 0.8rem; font-weight: 600;">Ver estadísticas →</span>
        </button>

        <!-- Pendientes -->
        <button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="pendientes" style="width: 100%; border-radius: 20px; padding: 20px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); background: transparent;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(234, 179, 8, 0.1); border: 1px solid rgba(234, 179, 8, 0.2); display: flex; align-items: center; justify-content: center; color: #eab308; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-hourglass-half"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS PENDIENTES</span>
            <strong id="pedidosPendientes" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block;">0</strong>
        </button>

        <!-- Cancelados -->
        <button type="button" class="resumen-card-interactiva resumen-box" data-estadistica="cancelados" style="width: 100%; border-radius: 20px; padding: 20px 16px; text-align: center; display: flex; flex-direction: column; align-items: center; cursor: pointer; border: 1px solid rgba(255,255,255,0.05); background: transparent;">
            <div style="width: 56px; height: 56px; border-radius: 50%; background: rgba(239, 68, 68, 0.1); border: 1px solid rgba(239, 68, 68, 0.2); display: flex; align-items: center; justify-content: center; color: #ef4444; font-size: 1.3rem; margin-bottom: 12px;">
                <i class="fa-solid fa-xmark"></i>
            </div>
            <span style="color: var(--text-muted, #7a8ba3); font-size: 0.72rem; font-weight: 700; letter-spacing: 0.5px; display: block; margin-bottom: 6px;">PEDIDOS CANCELADOS</span>
            <strong id="pedidosCancelados" style="color: var(--text-main, #ffffff); font-size: 1.5rem; font-weight: 800; display: block; margin-bottom: 4px;">0</strong>
            <div style="display: flex; gap: 12px; font-size: 0.75rem; font-weight: 600; color: var(--text-muted, #7a8ba3);">
               <span style="display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-fish" style="color:#f97316"></i> <span id="canceladosCev">0</span></span>
               <span style="display: flex; align-items: center; gap: 4px;"><i class="fa-solid fa-drumstick-bite" style="color:#eab308"></i> <span id="canceladosBro">0</span></span>
            </div>
        </button>

    </div>
</div>
`;
    
    // Write new file
    fs.writeFileSync('Admin/panel-resumen.html', before + gridHtml + after);
    console.log("HTML successfully updated");
} else {
    console.log("Failed to find replacement markers.");
}
