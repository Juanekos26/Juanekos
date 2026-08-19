/* JUANEKO'S · CONEXIÓN SUPABASE */
(() => {
  const URL = 'https://athabvryuqyxdavelqpo.supabase.co';
  const KEY = 'sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt';

  if (!window.supabase?.createClient) {
    console.error('Supabase JS no está cargado.');
    return;
  }

  const cliente = window.supabase.createClient(URL, KEY, {
    auth: { persistSession: true, autoRefreshToken: true, detectSessionInUrl: true }
  });

  window.juanekosSupabase = cliente;
  window.JUANEKOS_SUPABASE_URL = URL;
  window.JUANEKOS_SUPABASE_KEY = KEY;

  window.juanekosFechaISO = function(fecha = new Date()) {
    const y = fecha.getFullYear();
    const m = String(fecha.getMonth() + 1).padStart(2, '0');
    const d = String(fecha.getDate()).padStart(2, '0');
    return `${y}-${m}-${d}`;
  };

  window.juanekosHoraSQL = function(fecha = new Date()) {
    return `${String(fecha.getHours()).padStart(2,'0')}:${String(fecha.getMinutes()).padStart(2,'0')}:${String(fecha.getSeconds()).padStart(2,'0')}`;
  };
})();
