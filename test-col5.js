const url = 'https://athabvryuqyxdavelqpo.supabase.co/rest/v1/configuracion_sistema?select=admin_image,adminImage,logo,logo_url,imagen,imagen_admin,perfil&limit=1';
const key = 'sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt';
fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } })
.then(res => res.json())
.then(console.log);
