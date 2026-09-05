const url = 'https://athabvryuqyxdavelqpo.supabase.co/rest/v1/?apikey=sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt';
fetch(url)
.then(res => res.json())
.then(data => {
    if(data.components && data.components.schemas) {
        console.log(Object.keys(data.components.schemas));
    } else {
        console.log("No schemas found. Full keys:", Object.keys(data));
    }
});
