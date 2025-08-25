const express = require('express');
const { createClient } = require('@supabase/supabase-js');
const supabaseUrl = process.env.MY_SUPABASE_URL;
const supabaseAnonKey = process.env.MY_SUPABASE_ANON_KEY;

const router = express.Router();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.get('/google', async (req, res) => {
   const redirectTo = 'https://stockfinance.vercel.app/';

   const { data,error } = await supabase.auth.signInWithOAuth({
       provider: 'google',
       options: {
           redirectTo,
       },
   });

   if(error) {
       console.error('Error signin in with Google:', error);
       return res.status(500).json({ error : 'Internal server error 500'})
   }

   res.redirect(data.url);
});

module.exports = router;
