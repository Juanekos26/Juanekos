const { createClient } = require('@supabase/supabase-js');
const sb = createClient('https://athabvryuqyxdavelqpo.supabase.co', 'sb_publishable_PkkjTE9mxnt_loTQnfXbVg_V57S0MVt');
sb.from('administradores').select('*').limit(1).then(console.log).catch(console.error);
