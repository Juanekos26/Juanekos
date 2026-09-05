const fs = require('fs');
let html = fs.readFileSync('Admin/panel-estadisticas.html', 'utf8');

const comparativaHtml = `
      <article style="grid-column: 1 / -1; background: #10233f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); margin-top: 24px;">
        <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 16px; margin-bottom: 24px;">
          <small style="color: #d4a017; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;">Ventas por día - Azul=Cevicheria - Dorado=Broaster</small>
          <h3 style="color: #ffffff; font-size: 1.4rem; font-weight: 800; margin: 4px 0 0 0; text-transform: uppercase;">Comparativa Cevichería vs Broaster</h3>
        </div>
        <div id="graficoComparativoDias" style="height: 350px;"></div>
      </article>
`;

html = html.replace('</section>', comparativaHtml + '\n</section>');
fs.writeFileSync('Admin/panel-estadisticas.html', html);
