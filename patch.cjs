const fs = require('fs');

// Add "Alerta de Stock Bajo" to DEFAULTS
let js = fs.readFileSync('Js/panel/panel-configuracion.js', 'utf8');
js = js.replace('dailyGoal: 1000', 'dailyGoal: 1000,\n    lowStockAlert: 10');
js = js.replace("setVal('cfgDailyGoal', cfg.dailyGoal);", "setVal('cfgDailyGoal', cfg.dailyGoal);\n    setVal('cfgLowStock', cfg.lowStockAlert);");
js = js.replace("const elDailyGoal = document.getElementById('cfgDailyGoal');", "const elDailyGoal = document.getElementById('cfgDailyGoal');\n            const elLowStock = document.getElementById('cfgLowStock');");
js = js.replace("dailyGoal: elDailyGoal ? Number(elDailyGoal.value) : 1000", "dailyGoal: elDailyGoal ? Number(elDailyGoal.value) : 1000,\n                lowStockAlert: elLowStock ? Number(elLowStock.value) : 10");
js = js.replace("setVal('cfgDailyGoal', DEFAULTS.dailyGoal);", "setVal('cfgDailyGoal', DEFAULTS.dailyGoal);\n        setVal('cfgLowStock', DEFAULTS.lowStockAlert);");
fs.writeFileSync('Js/panel/panel-configuracion.js', js);

// Add to panel-configuracion.html
let html = fs.readFileSync('Admin/panel-configuracion.html', 'utf8');
const newOption = `
        <div style="flex: 1; min-width: 250px; display: flex; justify-content: space-between; align-items: center; margin-top: 24px;">
          <div>
            <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Alerta de Stock Bajo</h4>
            <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Unidades mínimas para alertar.</p>
          </div>
          <input type="number" id="cfgLowStock" placeholder="Ej. 10" value="10" style="width: 80px; padding: 8px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 8px; outline: none; text-align: center;">
        </div>`;

html = html.replace('</select>\n        </div>\n      </div>\n    </article>', '</select>\n        </div>' + newOption + '\n      </div>\n    </article>');
fs.writeFileSync('Admin/panel-configuracion.html', html);
