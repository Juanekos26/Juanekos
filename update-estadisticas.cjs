const fs = require('fs');
let html = fs.readFileSync('./Admin/panel-estadisticas.html', 'utf8');

html = html.replace(/<div style="background: rgba\(0,0,0,0\.3\); padding: 16px 20px.*?<\/div>/s, `<div style="display: flex; gap: 16px; align-items: flex-end; flex-wrap: wrap;">
    <div style="background: rgba(0,0,0,0.3); padding: 16px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06);">
      <label style="display: block; color: #9fb0c6; font-size: 0.8rem; font-weight: 700; text-transform: uppercase; margin-bottom: 8px;">Filtro Rápido</label>
      <select id="estadisticasDias" style="width: 100%; padding: 12px 16px; background: #081827; color: #ffffff; border: 1px solid #2b415c; border-radius: 12px; font-weight: 700; cursor: pointer; outline: none;">
        <option value="7">Últimos 7 días</option>
        <option value="15">Últimos 15 días</option>
        <option value="30">Últimos 30 días</option>
        <option value="31" selected>Últimos 31 días (1 mes)</option>
      </select>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 16px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 8px;">
        <label style="display: block; color: #9fb0c6; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Fecha Específica</label>
        <div style="display: flex; gap: 8px; align-items: center;">
            <input type="date" id="estadisticasFechaInicio" style="background: #081827; border: 1px solid #2b415c; color: #fff; padding: 10px 12px; border-radius: 8px; outline: none; font-size: 0.9rem;">
            <span style="color: #7a8ba3;">al</span>
            <input type="date" id="estadisticasFechaFin" style="background: #081827; border: 1px solid #2b415c; color: #fff; padding: 10px 12px; border-radius: 8px; outline: none; font-size: 0.9rem;">
            <button type="button" id="btnFiltrarEstadisticasPersonalizadas" style="background: #d4a017; border: none; color: #0a1930; padding: 10px 16px; border-radius: 8px; font-weight: 800; cursor: pointer; transition: background 0.2s;">Filtrar</button>
        </div>
    </div>
    <div style="background: rgba(0,0,0,0.3); padding: 16px 20px; border-radius: 16px; border: 1px solid rgba(255,255,255,0.06); display: flex; flex-direction: column; gap: 8px;">
        <label style="display: block; color: #9fb0c6; font-size: 0.8rem; font-weight: 700; text-transform: uppercase;">Estilo de Gráfico</label>
        <div style="display: flex; gap: 6px;">
            <button type="button" id="btnChartTypeBarras" style="background: rgba(59,130,246,0.15); color: #60a5fa; border: 1px solid rgba(59,130,246,0.3); padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;" title="Barras"><i class="fa-solid fa-chart-simple"></i></button>
            <button type="button" id="btnChartTypeLineas" style="background: rgba(255,255,255,0.05); color: #7a8ba3; border: 1px solid rgba(255,255,255,0.1); padding: 10px 16px; border-radius: 8px; font-weight: 700; cursor: pointer; transition: all 0.2s;" title="Líneas"><i class="fa-solid fa-chart-line"></i></button>
        </div>
    </div>
  </div>`);

fs.writeFileSync('./Admin/panel-estadisticas.html', html);
