(function() {
  const KEY_LOCAL = 'juanekos_admin_config_local_v2';
  
  const DEFAULTS = {
    autoRefresh: false,
    refreshSeconds: 30,
    compact: false,
    theme: 'dark',
    soundEnabled: true,
    animationsEnabled: true,
    dailyGoal: 1000,
    lowStockAlert: 10
  };

  let timer = null;
  let canalSync = null;

  function cargarLocal() {
    try {
      return { ...DEFAULTS, ...JSON.parse(localStorage.getItem(KEY_LOCAL) || '{}') };
    } catch {
      return { ...DEFAULTS };
    }
  }

  function aplicarUI(cfg) {
    document.body.classList.toggle('admin-compacto', !!cfg.compact);
    const tema = cfg.theme === 'system' ? (matchMedia('(prefers-color-scheme: light)').matches ? 'light' : 'dark') : cfg.theme;
    document.body.classList.toggle('admin-light', tema === 'light');
    document.documentElement.dataset.adminTheme = tema;
    
    if (cfg.animationsEnabled === false) {
      document.body.classList.add('admin-no-animations');
    } else {
      document.body.classList.remove('admin-no-animations');
    }

    if (timer) clearInterval(timer);
    if (cfg.autoRefresh) {
      timer = setInterval(() => {
        if (typeof refrescarPanelPrincipal === 'function') refrescarPanelPrincipal();
      }, Number(cfg.refreshSeconds || 30) * 1000);
    }
    window.juanekosAdminLocalConfig = cfg;
  }

  function actualizarPerfilGlobal(nombre, avatar) {
    const headerImg = document.getElementById('adminProfileImg');
    if (headerImg && avatar) {
      headerImg.src = avatar;
    }
    const profileContainer = document.querySelector('.topbar-profile');
    if (profileContainer) {
      profileContainer.title = nombre || 'Administrador';
    }
    const nameEl = document.getElementById('adminProfileName');
    if (nameEl && nombre) {
      nameEl.textContent = nombre;
    }
    
    const preview = document.getElementById('cfgAdminImagePreview');
    if (preview && avatar) {
      preview.src = avatar;
    }
    const nameInput = document.getElementById('cfgAdminName');
    if (nameInput && nombre && nameInput.value === '') {
      nameInput.value = nombre;
    }
  }

  window.configurarPanelPreferencias = async function() {
    if (!document.getElementById('btnGuardarConfiguracionPanel')) return;
    
    const cfg = cargarLocal();
    aplicarUI(cfg);

    const sb = window.juanekosSupabase;
    if (!sb) return;

    // Obtener datos del admin desde la sesión actual
    const { data: { user } } = await sb.auth.getUser();
    if (user) {
        const metadata = user.user_metadata || {};
        const nombre = metadata.full_name || window.juanekosPerfilPanel?.nombre || 'Administrador';
        const avatar = metadata.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
        actualizarPerfilGlobal(nombre, avatar);
    }

    // Set local inputs
    const setBool = (id, val) => { const el = document.getElementById(id); if (el) el.checked = !!val; };
    const setVal = (id, val) => { const el = document.getElementById(id); if (el) el.value = val; };
    
    setBool('cfgAutoRefresh', cfg.autoRefresh);
    setVal('cfgRefreshSeconds', cfg.refreshSeconds);
    setBool('cfgCompact', cfg.compact);
    setVal('cfgTheme', cfg.theme);
    setBool('cfgSound', cfg.soundEnabled);
    setBool('cfgAnimations', cfg.animationsEnabled);
    setVal('cfgDailyGoal', cfg.dailyGoal);
    setVal('cfgLowStock', cfg.lowStockAlert);

    // Variables temporales de imagen
    let fileImage = null;
    let base64Preview = null;

    const elInputImg = document.getElementById('cfgAdminImage');
    const elPreview = document.getElementById('cfgAdminImagePreview');

    if (elInputImg && !elInputImg.dataset.configurado) {
      elInputImg.addEventListener('change', function(e) {
        const file = e.target.files[0];
        if (file) {
          fileImage = file;
          const reader = new FileReader();
          reader.onload = function(evt) {
            base64Preview = evt.target.result;
            if(elPreview) elPreview.src = base64Preview;
          };
          reader.readAsDataURL(file);
        }
      });
      elInputImg.dataset.configurado = '1';
    }

                btnNotif.addEventListener('click', () => {
                    Notification.requestPermission().then(perm => {
                        if (perm === 'granted') {
                            btnNotif.textContent = 'Habilitado';
                            btnNotif.style.background = '#2ecc71';
                            btnNotif.style.borderColor = '#2ecc71';
                            btnNotif.style.color = '#000';
                            btnNotif.disabled = true;
                        }
                    });
                });
            }
        }
        btnNotif.dataset.configurado = '1';
    }

    const btnGuardar = document.getElementById('btnGuardarConfiguracionPanel');
    if (btnGuardar && !btnGuardar.dataset.configurado) {
      btnGuardar.addEventListener('click', async () => {
        btnGuardar.disabled = true;
        const originalText = btnGuardar.innerHTML;
        btnGuardar.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Guardando...';

        try {
            // Guardar configuración local
            const elAutoRefresh = document.getElementById('cfgAutoRefresh');
            const elRefreshSeconds = document.getElementById('cfgRefreshSeconds');
            const elCompact = document.getElementById('cfgCompact');
            const elTheme = document.getElementById('cfgTheme');
            const elSound = document.getElementById('cfgSound');
            const elAnimations = document.getElementById('cfgAnimations');
            const elDailyGoal = document.getElementById('cfgDailyGoal');
            const elLowStock = document.getElementById('cfgLowStock');

            const newLocalCfg = {
                autoRefresh: elAutoRefresh ? elAutoRefresh.checked : false,
                refreshSeconds: elRefreshSeconds ? Number(elRefreshSeconds.value) : 30,
                compact: elCompact ? elCompact.checked : false,
                theme: elTheme ? elTheme.value : 'dark',
                soundEnabled: elSound ? elSound.checked : true,
                animationsEnabled: elAnimations ? elAnimations.checked : true,
                dailyGoal: elDailyGoal ? Number(elDailyGoal.value) : 1000,
                lowStockAlert: elLowStock ? Number(elLowStock.value) : 10
            };
            localStorage.setItem(KEY_LOCAL, JSON.stringify(newLocalCfg));
            aplicarUI(newLocalCfg);

            // Guardar perfil global (Base de datos & Auth)
            const nombre = document.getElementById('cfgAdminName')?.value.trim() || 'Administrador';
            let avatarFinalUrl = elPreview.src;

            if (user) {
                if (fileImage) {
                    // Subir a bucket productos
                    const fileName = `avatar_admin_${user.id}_${Date.now()}.png`;
                    const { error: uploadErr } = await sb.storage.from('productos').upload(fileName, fileImage, {
                        cacheControl: '3600',
                        upsert: false
                    });
                    if (!uploadErr) {
                        const { data: { publicUrl } } = sb.storage.from('productos').getPublicUrl(fileName);
                        avatarFinalUrl = publicUrl;
                    }
                } else if (base64Preview) {
                     avatarFinalUrl = base64Preview;
                }

                // Actualizar metadata del usuario
                await sb.auth.updateUser({
                    data: { full_name: nombre, avatar_url: avatarFinalUrl }
                });

                // Intentar actualizar la tabla 'administradores' (si RLS lo permite)
                try {
                    await sb.from('administradores').update({ nombre: nombre }).eq('id', user.id);
                } catch(e) {}

                actualizarPerfilGlobal(nombre, avatarFinalUrl);

                // Emitir evento Realtime a otros clientes
                if (canalSync) {
                    canalSync.send({
                        type: 'broadcast',
                        event: 'profile_updated',
                        payload: { admin_id: user.id, nombre, avatar: avatarFinalUrl }
                    });
                }
            }

            if (typeof mostrarMensaje === 'function') mostrarMensaje('Preferencias y perfil guardados.', 'exito');

        } catch (e) {
            console.error(e);
            if (typeof mostrarMensaje === 'function') mostrarMensaje('Error al guardar.', 'error');
            else alert('Error al guardar.');
        } finally {
            btnGuardar.disabled = false;
            btnGuardar.innerHTML = originalText;
        }
      });
      btnGuardar.dataset.configurado = '1';
    }

    const btnRestaurar = document.getElementById('btnRestaurarConfiguracionPanel');
    if (btnRestaurar && !btnRestaurar.dataset.configurado) {
      btnRestaurar.addEventListener('click', () => {
        localStorage.setItem(KEY_LOCAL, JSON.stringify(DEFAULTS));
        aplicarUI(DEFAULTS);
        setBool('cfgAutoRefresh', DEFAULTS.autoRefresh);
        setVal('cfgRefreshSeconds', DEFAULTS.refreshSeconds);
        setBool('cfgCompact', DEFAULTS.compact);
        setVal('cfgTheme', DEFAULTS.theme);
        setBool('cfgSound', DEFAULTS.soundEnabled);
        setBool('cfgAnimations', DEFAULTS.animationsEnabled);
        setVal('cfgDailyGoal', DEFAULTS.dailyGoal);
        setVal('cfgLowStock', DEFAULTS.lowStockAlert);
        if (typeof mostrarMensaje === 'function') mostrarMensaje('Valores locales restaurados.', 'exito');
      });
      btnRestaurar.dataset.configurado = '1';
    }
  };

  function inicializarSincronizacionRealtime() {
    const sb = window.juanekosSupabase;
    if (!sb || canalSync) return;

    canalSync = sb.channel('admin-profile-sync');
    
    canalSync.on('broadcast', { event: 'profile_updated' }, (payload) => {
        const evt = payload.payload;
        actualizarPerfilGlobal(evt.nombre, evt.avatar);
    }).subscribe();
  }

  document.addEventListener('DOMContentLoaded', () => {
      setTimeout(async () => {
        const cfg = cargarLocal();
        aplicarUI(cfg);
        
        // Cargar perfil global desde la sesión
        const sb = window.juanekosSupabase;
        if (sb) {
            const { data: { user } } = await sb.auth.getUser();
            if (user) {
                const metadata = user.user_metadata || {};
                const nombre = metadata.full_name || window.juanekosPerfilPanel?.nombre || 'Administrador';
                const avatar = metadata.avatar_url || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80';
                actualizarPerfilGlobal(nombre, avatar);
                inicializarSincronizacionRealtime();
            }
        }
      }, 800);
  });
})();
