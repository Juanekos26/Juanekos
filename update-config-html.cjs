const fs = require('fs');

const html = `<section class="config-admin-section" style="padding: 0; background: transparent; border: none;">
  <div style="background: linear-gradient(135deg, #122a4a, #0e203a); border-radius: 24px; padding: 32px 24px; text-align: left; border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 10px 30px rgba(0,0,0,0.4); margin-bottom: 24px;">
    <span style="color: #d4a017; font-size: 0.8rem; font-weight: 800; letter-spacing: 4px; display: block; margin-bottom: 8px;">SISTEMA Y PERFIL</span>
    <h2 style="color: #ffffff; font-size: 2.2rem; font-weight: 900; margin: 0 0 8px 0; font-family: 'Playfair Display', serif;">Configuración Global</h2>
    <p style="color: #7a8ba3; font-size: 1rem; margin: 0;">Gestiona las preferencias visuales, notificaciones y tu perfil de administrador. Los cambios en el perfil se sincronizan en tiempo real.</p>
  </div>

  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px; margin-bottom: 24px;">
    
    <!-- Perfil Global -->
    <article style="background: #10233f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 20px;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
        <small style="color: #d4a017; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;">GLOBAL</small>
        <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin: 4px 0 0 0;">Perfil del Administrador</h3>
      </div>
      
      <div style="display: flex; gap: 16px; align-items: center;">
        <div style="position: relative;">
          <img id="cfgAdminImagePreview" src="https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" style="width: 80px; height: 80px; border-radius: 50%; object-fit: cover; border: 3px solid #d4a017; box-shadow: 0 4px 12px rgba(0,0,0,0.3);">
          <label for="cfgAdminImage" style="position: absolute; bottom: -5px; right: -5px; background: #2a3b5c; width: 32px; height: 32px; border-radius: 50%; display: grid; place-items: center; color: #fff; cursor: pointer; border: 2px solid #10233f; transition: background 0.2s;" title="Cambiar foto">
            <i class="fa-solid fa-camera" style="font-size: 0.8rem;"></i>
          </label>
          <input type="file" id="cfgAdminImage" accept="image/*" style="display: none;">
        </div>
        <div style="flex: 1;">
          <label style="display: block; color: #9fb0c6; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">Nombre visible</label>
          <input type="text" id="cfgAdminName" placeholder="Tu nombre" style="width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 10px; outline: none; font-size: 0.95rem;">
        </div>
      </div>
    </article>

    <!-- Objetivos y Negocio -->
    <article style="background: #10233f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 20px;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
        <small style="color: #3b82f6; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;">RENDIMIENTO</small>
        <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin: 4px 0 0 0;">Objetivos del Negocio</h3>
      </div>
      
      <div>
        <label style="display: block; color: #9fb0c6; font-size: 0.8rem; font-weight: 700; margin-bottom: 6px;">Meta de Ventas Diaria (S/)</label>
        <input type="number" id="cfgDailyGoal" placeholder="Ej. 1500" value="1000" style="width: 100%; padding: 10px 14px; background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.1); color: #fff; border-radius: 10px; outline: none; font-size: 0.95rem;">
        <small style="color: #7a8ba3; font-size: 0.75rem; display: block; margin-top: 6px;">Sirve para medir el progreso en los gráficos principales.</small>
      </div>
    </article>

    <!-- UI y Apariencia -->
    <article style="background: #10233f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 20px;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
        <small style="color: #f97316; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;">INTERFAZ LOCAL</small>
        <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin: 4px 0 0 0;">Apariencia y Visualización</h3>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Modo Visual</h4>
          <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Esquema de colores del panel.</p>
        </div>
        <select id="cfgTheme" style="padding: 8px 12px; background: #081827; color: #ffffff; border: 1px solid #2b415c; border-radius: 8px; font-weight: 700; outline: none; appearance: none; cursor: pointer;">
          <option value="dark">Modo Oscuro</option>
          <option value="light">Modo Claro</option>
          <option value="system">Automático (Sistema)</option>
        </select>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Vista Compacta</h4>
          <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Optimiza el espacio en pantalla.</p>
        </div>
        <label class="switch"><input id="cfgCompact" type="checkbox"><span></span></label>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Animaciones</h4>
          <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Transiciones fluidas en la UI.</p>
        </div>
        <label class="switch"><input id="cfgAnimations" type="checkbox" checked><span></span></label>
      </div>
    </article>

    <!-- Notificaciones -->
    <article style="background: #10233f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 20px;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
        <small style="color: #eab308; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;">ALERTAS LOCALES</small>
        <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin: 4px 0 0 0;">Notificaciones y Sonidos</h3>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Sonido de Pedidos</h4>
          <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Alerta audible al recibir órdenes.</p>
        </div>
        <label class="switch"><input id="cfgSound" type="checkbox" checked><span></span></label>
      </div>

      <div style="display: flex; justify-content: space-between; align-items: center;">
        <div>
          <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Notificaciones Push</h4>
          <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Alertas en el sistema operativo.</p>
        </div>
        <button type="button" id="btnRequestNotifications" style="background: rgba(255,255,255,0.1); border: 1px solid rgba(255,255,255,0.2); color: #fff; padding: 6px 12px; border-radius: 8px; font-size: 0.8rem; cursor: pointer;">Habilitar</button>
      </div>
    </article>

    <!-- Sincronización -->
    <article style="background: #10233f; border: 1px solid rgba(255,255,255,0.05); border-radius: 24px; padding: 24px; box-shadow: 0 10px 20px rgba(0,0,0,0.2); display: flex; flex-direction: column; gap: 20px; grid-column: 1 / -1;">
      <div style="border-bottom: 1px solid rgba(255,255,255,0.05); padding-bottom: 12px;">
        <small style="color: #2ecc71; font-weight: 800; font-size: 0.75rem; letter-spacing: 1px;">SISTEMA</small>
        <h3 style="color: #ffffff; font-size: 1.2rem; font-weight: 800; margin: 4px 0 0 0;">Actualización de Datos</h3>
      </div>
      
      <div style="display: flex; flex-wrap: wrap; gap: 24px;">
        <div style="flex: 1; min-width: 250px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Refresco Automático</h4>
            <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Obtener datos sin recargar la página.</p>
          </div>
          <label class="switch"><input id="cfgAutoRefresh" type="checkbox"><span></span></label>
        </div>

        <div style="flex: 1; min-width: 250px; display: flex; justify-content: space-between; align-items: center;">
          <div>
            <h4 style="color: #e9f1fa; font-size: 0.95rem; margin: 0 0 4px 0;">Frecuencia</h4>
            <p style="color: #7a8ba3; font-size: 0.8rem; margin: 0;">Intervalo de actualización en segundos.</p>
          </div>
          <select id="cfgRefreshSeconds" style="padding: 8px 12px; background: #081827; color: #ffffff; border: 1px solid #2b415c; border-radius: 8px; font-weight: 700; outline: none; appearance: none; cursor: pointer;">
            <option value="15">15 segundos</option>
            <option value="30">30 segundos</option>
            <option value="60">1 minuto</option>
            <option value="120">2 minutos</option>
          </select>
        </div>
      </div>
    </article>
  </div>

  <div style="display: flex; gap: 16px; justify-content: flex-end; padding-top: 16px; border-top: 1px solid rgba(255,255,255,0.05);">
    <button id="btnRestaurarConfiguracionPanel" style="background: rgba(255,255,255,0.05); color: #7a8ba3; border: 1px solid rgba(255,255,255,0.1); padding: 14px 24px; border-radius: 12px; font-weight: 700; cursor: pointer; transition: all 0.2s;" type="button">
      Restaurar
    </button>
    <button id="btnGuardarConfiguracionPanel" style="background: linear-gradient(135deg, #d4a017, #b38600); color: #0f1c2e; border: none; padding: 14px 32px; border-radius: 12px; font-weight: 800; font-size: 1rem; cursor: pointer; box-shadow: 0 6px 20px rgba(212,160,23,0.35); display: flex; align-items: center; gap: 8px; transition: transform 0.2s;" type="button">
      <i class="fa-solid fa-floppy-disk"></i> Guardar Cambios
    </button>
  </div>
</section>`;
fs.writeFileSync('./Admin/panel-configuracion.html', html);
