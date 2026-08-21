(function(){
  const KEY='juanekos_admin_config_v1';
  const DEFAULTS={autoRefresh:false,refreshSeconds:30,statsDays:14,compact:false,theme:'dark'};
  let timer=null;
  function cargar(){ try{return {...DEFAULTS,...JSON.parse(localStorage.getItem(KEY)||'{}')}}catch{return {...DEFAULTS}} }
  function aplicar(cfg){
    document.body.classList.toggle('admin-compacto',!!cfg.compact);
    const tema=cfg.theme==='system'?(matchMedia('(prefers-color-scheme: light)').matches?'light':'dark'):cfg.theme;
    document.body.classList.toggle('admin-light',tema==='light');
    document.documentElement.dataset.adminTheme=tema;
    if(timer) clearInterval(timer);
    if(cfg.autoRefresh){ timer=setInterval(()=>{ if(typeof refrescarPanelPrincipal==='function') refrescarPanelPrincipal(); },Number(cfg.refreshSeconds||30)*1000); }
    const stats=document.getElementById('estadisticasDias'); if(stats){stats.value=String(cfg.statsDays||14); if(typeof renderizarPanelEstadisticas==='function') renderizarPanelEstadisticas();}
  }
  window.configurarPanelPreferencias=function(){
    if(!document.getElementById('cfgAutoRefresh')) return;
    const cfg=cargar();
    cfgAutoRefresh.checked=!!cfg.autoRefresh; cfgRefreshSeconds.value=String(cfg.refreshSeconds); cfgStatsDays.value=String(cfg.statsDays); cfgCompact.checked=!!cfg.compact; if(window.cfgTheme) cfgTheme.value=cfg.theme||'dark';
    if(!btnGuardarConfiguracionPanel.dataset.configurado){btnGuardarConfiguracionPanel.addEventListener('click',()=>{const n={autoRefresh:cfgAutoRefresh.checked,refreshSeconds:Number(cfgRefreshSeconds.value),statsDays:Number(cfgStatsDays.value),compact:cfgCompact.checked,theme:window.cfgTheme?.value||'dark'};localStorage.setItem(KEY,JSON.stringify(n));aplicar(n);if(typeof mostrarMensaje==='function')mostrarMensaje('Preferencias guardadas.','exito');});btnGuardarConfiguracionPanel.dataset.configurado='1';}
    if(!btnRestaurarConfiguracionPanel.dataset.configurado){btnRestaurarConfiguracionPanel.addEventListener('click',()=>{localStorage.setItem(KEY,JSON.stringify(DEFAULTS));window.configurarPanelPreferencias();aplicar(DEFAULTS);if(typeof mostrarMensaje==='function')mostrarMensaje('Preferencias restauradas.','exito');});btnRestaurarConfiguracionPanel.dataset.configurado='1';}
    aplicar(cfg);
  };
  document.addEventListener('DOMContentLoaded',()=>setTimeout(()=>{const cfg=cargar();aplicar(cfg)},800));
})();
