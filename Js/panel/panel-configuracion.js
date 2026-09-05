(function() {
  const KEY = 'juanekos_admin_config_v1';
  const DEFAULTS = {
    autoRefresh: false,
    refreshSeconds: 30,
    statsDays: 31,
    compact: false,
    theme: 'dark',
    adminName: 'Administrador',
    adminImage: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    soundEnabled: true,
    animationsEnabled: true
  };
  let timer = null;
  let tempAdminImage = null;

  function cargar() {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY) || '{}') };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function aplicar(cfg) {
    // Tema y compacto
    document.body.classList.toggle('admin-compacto', !!cfg.compact);
    const tema = cfg.theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : cfg.theme;
    document.body.classList.toggle('admin-light', tema === 'light');
    document.documentElement.dataset.adminTheme = tema;
    
    // Animaciones
    if (cfg.animationsEnabled === false) {
      document.body.classList.add('admin-no-animations');
    } else {
      document.body.classList.remove('admin-no-animations');
    }

    // Auto-refresh
    if (timer) clearInterval(timer);
    if (cfg.autoRefresh) {
      timer = setInterval(() => {
        if (typeof refrescarPanelPrincipal === 'function') refrescarPanelPrincipal();
      }, Number(cfg.refreshSeconds || 30) * 1000);
    }
    
    // Config estadística global
    const stats = document.getElementById('estadisticasDias');
    if (stats) {
      stats.value = String(cfg.statsDays || 31);
      if (typeof renderizarPanelEstadisticas === 'function') renderizarPanelEstadisticas();
    }
    
    // Actualizar Header global
    const headerImg = document.getElementById('adminProfileImg');
    if (headerImg && cfg.adminImage) {
      headerImg.src = cfg.adminImage;
    }
    const profileContainer = document.querySelector('.topbar-profile');
    if (profileContainer && cfg.adminName) {
      profileContainer.title = cfg.adminName;
    }
    
    // Guardar para acceso global
    window.juanekosAdminConfig = cfg;
  }

  window.configurarPanelPreferencias = function() {
    if (!document.getElementById('cfgAutoRefresh')) return;
    const cfg = cargar();
    
    // Llenar inputs
    const elAutoRefresh = document.getElementById('cfgAutoRefresh');
    const elRefreshSeconds = document.getElementById('cfgRefreshSeconds');
    const elStatsDays = document.getElementById('cfgStatsDays');
    const elCompact = document.getElementById('cfgCompact');
    const elTheme = document.getElementById('cfgTheme');
    const elAdminName = document.getElementById('cfgAdminName');
    const elAdminImage = document.getElementById('cfgAdminImage');
    const elAdminImagePreview = document.getElementById('cfgAdminImagePreview');
    const elSound = document.getElementById('cfgSound');
    const elAnimations = document.getElementById('cfgAnimations');
    const btnGuardar = document.getElementById('btnGuardarConfiguracionPanel');
    const btnRestaurar = document.getElementById('btnRestaurarConfiguracionPanel');

    if(elAutoRefresh) elAutoRefresh.checked = !!cfg.autoRefresh;
    if(elRefreshSeconds) elRefreshSeconds.value = String(cfg.refreshSeconds || 30);
    if(elStatsDays) elStatsDays.value = String(cfg.statsDays || 31);
    if(elCompact) elCompact.checked = !!cfg.compact;
    if(elTheme) elTheme.value = cfg.theme || 'dark';
    if(elAdminName) elAdminName.value = cfg.adminName || '';
    if(elSound) elSound.checked = cfg.soundEnabled !== false;
    if(elAnimations) elAnimations.checked = cfg.animationsEnabled !== false;
    
    tempAdminImage = cfg.adminImage || DEFAULTS.adminImage;
    if(elAdminImagePreview) {
      elAdminImagePreview.src = tempAdminImage;
      elAdminImagePreview.style.display = 'block';
    }

    // Manejar subida de imagen
    if (elAdminImage && !elAdminImage.dataset.configurado) {
      elAdminImage.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          const reader = new FileReader();
          reader.onload = function(evt) {
            tempAdminImage = evt.target.result;
            if(elAdminImagePreview) {
               elAdminImagePreview.src = tempAdminImage;
               elAdminImagePreview.style.display = 'block';
            }
          };
          reader.readAsDataURL(file);
        }
      });
      elAdminImage.dataset.configurado = '1';
    }

    // Guardar
    if (btnGuardar && !btnGuardar.dataset.configurado) {
      btnGuardar.addEventListener('click', () => {
        const n = {
          autoRefresh: elAutoRefresh ? elAutoRefresh.checked : false,
          refreshSeconds: elRefreshSeconds ? Number(elRefreshSeconds.value) : 30,
          statsDays: elStatsDays ? Number(elStatsDays.value) : 31,
          compact: elCompact ? elCompact.checked : false,
          theme: elTheme ? elTheme.value : 'dark',
          adminName: elAdminName ? elAdminName.value : '',
          adminImage: tempAdminImage,
          soundEnabled: elSound ? elSound.checked : true,
          animationsEnabled: elAnimations ? elAnimations.checked : true
        };
        try {
          localStorage.setItem(KEY, JSON.stringify(n));
          aplicar(n);
          if (typeof mostrarMensaje === 'function') mostrarMensaje('Preferencias guardadas.', 'exito');
        } catch (e) {
          console.error(e);
          if (e.name === 'QuotaExceededError' || e.name === 'NS_ERROR_DOM_QUOTA_REACHED') {
            if (typeof mostrarMensaje === 'function') mostrarMensaje('Error: La imagen es muy grande. Sube una de menor peso.', 'error');
            else alert('Error: La imagen es muy grande. Sube una de menor peso.');
          } else {
            if (typeof mostrarMensaje === 'function') mostrarMensaje('Error al guardar preferencias.', 'error');
          }
        }
      });
      btnGuardar.dataset.configurado = '1';
    }

    // Restaurar
    if (btnRestaurar && !btnRestaurar.dataset.configurado) {
      btnRestaurar.addEventListener('click', () => {
        localStorage.setItem(KEY, JSON.stringify(DEFAULTS));
        tempAdminImage = DEFAULTS.adminImage;
        window.configurarPanelPreferencias();
        aplicar(DEFAULTS);
        if (typeof mostrarMensaje === 'function') mostrarMensaje('Preferencias restauradas.', 'exito');
      });
      btnRestaurar.dataset.configurado = '1';
    }

    aplicar(cfg);
  };

  document.addEventListener('DOMContentLoaded', () => setTimeout(() => {
    const cfg = cargar();
    aplicar(cfg);
  }, 800));
})();
