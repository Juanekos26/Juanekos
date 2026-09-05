const fs = require('fs');
let js = fs.readFileSync('Js/admin.js', 'utf8');

const regex = /async function verificarAdministradorSesion\(\) \{[\s\S]*?return false;\n\}/;

const fastPathFunc = `async function verificarAdministradorSesion() {
  const sb = window.juanekosSupabase;
  if (!sb) return false;
  const { data: { session }, error } = await sb.auth.getSession();
  if (error || !session?.user) return false;

  const cachedRol = sessionStorage.getItem('juanekos_panel_rol');
  const hasSession = sessionStorage.getItem(CLAVE_SESION_ADMIN) === 'true';

  // Fast Path: If we already have the role in sessionStorage, return immediately to unlock UI
  if (cachedRol && ['admin','mesero'].includes(cachedRol) && hasSession) {
      window.juanekosRolPanel = cachedRol;
      // Fetch details in background so it doesn't block the UI rendering
      sb.from('administradores')
        .select('id,nombre,email,activo,rol')
        .eq('id', session.user.id)
        .eq('activo', true)
        .maybeSingle()
        .then(({data, error: adminError}) => {
            if (!adminError && data && ['admin','mesero'].includes(data.rol)) {
                window.juanekosPerfilPanel = data;
                window.juanekosRolPanel = data.rol;
                sessionStorage.setItem('juanekos_panel_rol', data.rol);
                if (typeof aplicarPermisosRolPanel === 'function') aplicarPermisosRolPanel();
            } else {
                sb.auth.signOut().then(() => {
                    sessionStorage.removeItem('juanekos_panel_rol');
                    sessionStorage.removeItem(CLAVE_SESION_ADMIN);
                    window.location.href = 'login.html';
                });
            }
        });
      return true;
  }

  // Slow Path (First time login / missing cache)
  const { data, error: adminError } = await sb
    .from('administradores')
    .select('id,nombre,email,activo,rol')
    .eq('id', session.user.id)
    .eq('activo', true)
    .maybeSingle();

  if (!adminError && data && ['admin','mesero'].includes(data.rol)) {
    window.juanekosPerfilPanel = data;
    window.juanekosRolPanel = data.rol;
    sessionStorage.setItem('juanekos_panel_rol', data.rol);
    sessionStorage.setItem(CLAVE_SESION_ADMIN, 'true');
    return true;
  }
  try { await sb.auth.signOut(); } catch (_) {}
  sessionStorage.removeItem('juanekos_panel_rol');
  sessionStorage.removeItem(CLAVE_SESION_ADMIN);
  return false;
}`;

js = js.replace(regex, fastPathFunc);
fs.writeFileSync('Js/admin.js', js);
