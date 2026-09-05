const fs = require('fs');
let html = fs.readFileSync('Admin/panel-resumen.html', 'utf8');

const regexComparativa = /<div style="display: flex; flex-direction: column; gap: 10px; margin-bottom: 16px;">[\s\S]*?<div style="border-top: 1px solid rgba\(255,255,255,0\.06\); padding-top: 12px;">[\s\S]*?<\/div>/;

const newComparativa = `
        <div style="height: 180px; position: relative; margin-bottom: 16px;">
            <canvas id="resumenDoughnutChart"></canvas>
            <div style="position: absolute; top: 50%; left: 50%; transform: translate(-50%, -50%); pointer-events: none;">
                <strong id="totalVentasDoughnut" style="color: #ffffff; font-size: 1.1rem; font-weight: 800; display: block;">S/ 0</strong>
                <span style="color: #7a8ba3; font-size: 0.7rem; font-weight: 700;">Total</span>
            </div>
        </div>
        <div style="display: flex; justify-content: space-between; font-size: 0.85rem; padding: 0 10px;">
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 12px; height: 12px; background: #3b82f6; border-radius: 50%; display: inline-block;"></span>
                <span style="color: #7a8ba3;">Cevichería</span> <strong id="porcentajeCevicheria" style="color: #ffffff;">0%</strong>
            </div>
            <div style="display: flex; align-items: center; gap: 6px;">
                <span style="width: 12px; height: 12px; background: #eab308; border-radius: 50%; display: inline-block;"></span>
                <span style="color: #7a8ba3;">Broaster</span> <strong id="porcentajeBroaster" style="color: #ffffff;">0%</strong>
            </div>
        </div>
`;

html = html.replace(regexComparativa, newComparativa);
fs.writeFileSync('Admin/panel-resumen.html', html);
