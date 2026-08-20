export default function handler(req, res) {
  res.status(410).json({ success: false, message: 'Login migrado a Supabase Auth.' });
}
