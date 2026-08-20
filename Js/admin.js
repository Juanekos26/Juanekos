/* JUANEKO'S · LOGIN ADMIN CON SUPABASE AUTH */
const CLAVE_SESION_ADMIN = 'juanekos_admin_sesion';

async function verificarAdministradorSesion() {
  const sb = window.juanekosSupabase;
  if (!sb) return false;
  const { data: { session }, error } = await sb.auth.getSession();
  if (error || !session?.user) return false;

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
    return true;
  }
  try { await sb.auth.signOut(); } catch (_) {}
  sessionStorage.removeItem('juanekos_panel_rol');
  return false;
}

function configurarLogin() {
  const formulario = document.getElementById('loginForm');
  const mensaje = document.getElementById('loginMensaje');
  if (!formulario) return;

  formulario.addEventListener('submit', async (event) => {
    event.preventDefault();
    const email = document.getElementById('usuario')?.value.trim() || '';
    const clave = document.getElementById('clave')?.value || '';
    if (!email || !clave) {
      if (mensaje) mensaje.textContent = 'Completa el correo y la contraseña.';
      return;
    }

    if (mensaje) mensaje.textContent = 'Verificando acceso...';
    const sb = window.juanekosSupabase;
    if (!sb) {
      if (mensaje) mensaje.textContent = 'No se pudo iniciar Supabase.';
      return;
    }

    try {
      const { data, error } = await sb.auth.signInWithPassword({ email, password: clave });
      if (error || !data?.user) {
        if (mensaje) mensaje.textContent = 'Correo o contraseña incorrectos.';
        return;
      }

      const { data: admin, error: adminError } = await sb
        .from('administradores')
        .select('id,nombre,email,activo,rol')
        .eq('id', data.user.id)
        .eq('activo', true)
        .maybeSingle();

      if (adminError || !admin) {
        await sb.auth.signOut();
        if (mensaje) mensaje.textContent = 'Esta cuenta no tiene permisos de administrador.';
        return;
      }

      window.juanekosPerfilPanel = admin;
      if (!['admin','mesero'].includes(admin.rol)) {
        await sb.auth.signOut();
        if (mensaje) mensaje.textContent = 'Esta cuenta no tiene un rol autorizado.';
        return;
      }
      window.juanekosRolPanel = admin.rol;
      sessionStorage.setItem(CLAVE_SESION_ADMIN, 'true');
      sessionStorage.setItem('juanekos_panel_rol', window.juanekosRolPanel);
      if (mensaje) mensaje.textContent = 'Acceso correcto. Ingresando...';
      window.location.href = 'panel.html';
    } catch (error) {
      console.error(error);
      if (mensaje) mensaje.textContent = 'No se pudo conectar con Supabase.';
    }
  });
}

async function cerrarSesion() {
  try { await window.juanekosSupabase?.auth.signOut(); } catch (_) {}
  sessionStorage.removeItem(CLAVE_SESION_ADMIN);
  sessionStorage.removeItem('juanekos_panel_rol');
  window.location.href = 'login.html';
}

async function sesionAdminActiva() {
  return verificarAdministradorSesion();
}

async function protegerPanel() {
  const activa = await verificarAdministradorSesion();
  if (!activa) window.location.href = 'login.html';
  return activa;
}


function obtenerRolPanel() {
  const rol = window.juanekosRolPanel || window.juanekosPerfilPanel?.rol || sessionStorage.getItem('juanekos_panel_rol');
  return ['admin','mesero'].includes(rol) ? rol : null;
}


function esAdministradorGeneral() { return obtenerRolPanel() === 'admin'; }
function esMeseroPanel() { return obtenerRolPanel() === 'mesero'; }
function esCocinaPanel() { return false; }

document.addEventListener('DOMContentLoaded', async () => {
  const pagina = window.location.pathname.toLowerCase();
  if (pagina.endsWith('/login.html') || pagina.endsWith('login.html')) {
    const activa = await verificarAdministradorSesion();
    if (activa) {
      window.location.href = 'panel.html';
      return;
    }
    configurarLogin();
    return;
  }
  if (pagina.includes('/admin/')) await protegerPanel();
});
