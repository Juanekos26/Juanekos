const url = 'https://athabvryuqyxdavelqpo.supabase.co/rest/v1/administradores?select=id,nombre,email,activo,rol,imagen,avatar_url&limit=1';
const key = 'sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt';
fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } })
.then(res => res.json())
.then(console.log);
