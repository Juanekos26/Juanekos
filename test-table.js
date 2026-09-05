const url = 'https://athabvryuqyxdavelqpo.supabase.co/rest/v1/restaurante?select=*&limit=1';
const key = 'sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt';
fetch(url, { headers: { 'apikey': key, 'Authorization': `Bearer ${key}` } })
.then(res => res.json())
.then(console.log);
