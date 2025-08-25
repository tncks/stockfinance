const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.MY_SUPABASE_URL;
const supabaseAnonKey = process.env.MY_SUPABASE_ANON_KEY;

const router = express.Router();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.get('/google', async (req, res) => {
    // 프로덕션/개발 환경에 따른 서버 URL 설정
        const serverUrl = process.env.SERVER_URL || (process.env.VERCEL_URL ? `https://${process.env.VERCEL_URL}` : `${req.protocol}://${req.get('host')}`);

   const redirectTo = `${serverUrl}/api/v1/callback/google`;

   const { data,error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
           redirectTo,
           // queryParams: {
           //     access_type: 'offline',
           //     prompt: 'consent',
           // },
       },
   });

   if(error) {
       console.error('Error signin in with Google:', error);
       return res.status(500).json({ error : 'Internal server error 500'})
   }

   res.redirect(data.url);
});

module.exports = router;
