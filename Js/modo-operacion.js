/* JUANEKO'S · MODO GLOBAL DE OPERACIÓN (SUPABASE) */
(() => {
  const MODOS_VALIDOS = ['automatico', 'prueba', 'cevicheria', 'broaster', 'cerrado'];
  window.JUANEKOS_MODO_OPERACION = window.JUANEKOS_MODO_OPERACION || 'automatico';
  let canal = null;

  function normalizar(modo) {
    return MODOS_VALIDOS.includes(modo) ? modo : 'automatico';
  }

  function obtenerHoraPeru() {
    const formatter = new Intl.DateTimeFormat('es-PE', {
        timeZone: 'America/Lima',
        hour12: false,
        hour: '2-digit'
    });
    return parseInt(formatter.format(new Date()), 10);
  }

  function categoriasAutomaticas() {
    const hora = obtenerHoraPeru();
    if (hora < 11) return [];
    if (hora < 16) return ['menu-dia', 'cevicheria', 'bebidas'];
    return ['broaster', 'bebidas'];
  }

  function categoriasPorModo(modo = window.JUANEKOS_MODO_OPERACION) {
    const actual = normalizar(modo);
    if (actual === 'prueba') return ['menu-dia', 'cevicheria', 'broaster', 'bebidas'];
    if (actual === 'cevicheria') return ['menu-dia', 'cevicheria', 'bebidas'];
    if (actual === 'broaster') return ['broaster', 'bebidas'];
    if (actual === 'cerrado') return [];
    return categoriasAutomaticas();
  }

  async function cargar() {
    const sb = window.juanekosSupabase;
    if (!sb) return window.JUANEKOS_MODO_OPERACION;
    try {
      const { data, error } = await sb
        .from('configuracion_sistema')
        .select('modo_operacion')
        .eq('id', 1)
        .maybeSingle();
      if (error) throw error;
      window.JUANEKOS_MODO_OPERACION = normalizar(data?.modo_operacion);
      window.dispatchEvent(new CustomEvent('juanekos:modo-operacion-actualizado', {
        detail: { modo: window.JUANEKOS_MODO_OPERACION }
      }));
    } catch (error) {
      console.warn('Modo de operación: usando horario automático.', error);
      window.JUANEKOS_MODO_OPERACION = 'automatico';
    }
    return window.JUANEKOS_MODO_OPERACION;
  }

  async function guardar(modo) {
    const sb = window.juanekosSupabase;
    const nuevo = normalizar(modo);
    if (!sb) throw new Error('Supabase no está disponible.');
    const { data: { user } } = await sb.auth.getUser();
    const { error } = await sb
      .from('configuracion_sistema')
      .update({ modo_operacion: nuevo, updated_by: user?.id || null, updated_at: new Date().toISOString() })
      .eq('id', 1);
    if (error) throw error;
    window.JUANEKOS_MODO_OPERACION = nuevo;
    window.dispatchEvent(new CustomEvent('juanekos:modo-operacion-actualizado', { detail: { modo: nuevo } }));
    return nuevo;
  }

  function iniciarRealtime() {
    const sb = window.juanekosSupabase;
    if (!sb || canal) return;
    canal = sb
      .channel('juanekos-modo-operacion')
      .on('postgres_changes', {
        event: 'UPDATE', schema: 'public', table: 'configuracion_sistema', filter: 'id=eq.1'
      }, payload => {
        const modo = normalizar(payload.new?.modo_operacion);
        window.JUANEKOS_MODO_OPERACION = modo;
        window.dispatchEvent(new CustomEvent('juanekos:modo-operacion-actualizado', { detail: { modo } }));
      })
      .subscribe();
  }

  window.juanekosCargarModoOperacion = cargar;
  window.juanekosGuardarModoOperacion = guardar;
  window.juanekosObtenerModoOperacion = () => normalizar(window.JUANEKOS_MODO_OPERACION);
  window.juanekosObtenerCategoriasActivas = () => categoriasPorModo();
  window.juanekosIniciarRealtimeModo = iniciarRealtime;
})();
