/* JUANEKO'S · LOGIN ADMIN CON SUPABASE AUTH */
const CLAVE_SESION_ADMIN = 'juanekos_admin_sesion';

async function verificarAdministradorSesion() {
  const sb = window.juanekosSupabase;
  if (!sb) return false;
  const { data: { session }, error } = await sb.auth.getSession();
  if (error || !session?.user) return false;

  const { data, error: adminError } = await sb
    .from('administradores')
    .select('id,activo')
    .eq('id', session.user.id)
    .eq('activo', true)
    .maybeSingle();

  return !adminError && !!data;
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
        .select('id,activo')
        .eq('id', data.user.id)
        .eq('activo', true)
        .maybeSingle();

      if (adminError || !admin) {
        await sb.auth.signOut();
        if (mensaje) mensaje.textContent = 'Esta cuenta no tiene permisos de administrador.';
        return;
      }

      sessionStorage.setItem(CLAVE_SESION_ADMIN, 'true');
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
