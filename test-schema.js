const url = 'https://athabvryuqyxdavelqpo.supabase.co/rest/v1/?apikey=sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt';
fetch(url)
.then(res => res.json())
.then(data => console.log(Object.keys(data.definitions || data.components?.schemas || {})));
