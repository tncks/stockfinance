const express = require('express');
const {createClient} = require('@supabase/supabase-js');
const supabaseUrl = process.env.MY_SUPABASE_URL;
const supabaseAnonKey = process.env.MY_SUPABASE_ANON_KEY;

const router = express.Router();

const supabase = createClient(supabaseUrl, supabaseAnonKey);

router.get('/google', async (req, res) => {
    // 프로덕션/개발 환경에 따른 서버 URL 설정
    const serverUrl = `http://49.50.132.4:3000`;

    const redirectTo = `${serverUrl}/api/v1/auth/google_callback`;

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
            // queryParams: {
            //     access_type: 'offline',
            //     prompt: 'consent',
            // },
        },
    });

    if (error) {
        console.error('Error signin in with Google:', error);
        return res.status(500).json({error: 'Internal server error 500'})
    }

    res.redirect(`https://stockfinance.vercel.app` /*data.url*/);
});


// Google OAuth 콜백 처리
router.get('/google_callback', async (req, res) => {
    try {
        console.log('Google 콜백 처리 시작');
        console.log('Query params:', req.query);

        const { code, state, error: oauthError } = req.query;
        const clientUrl = 'https://stockfinance.vercel.app';

        // OAuth 에러 체크
        if (oauthError) {
            console.error('OAuth 에러:', oauthError);
            return res.redirect(`${clientUrl}?error=${encodeURIComponent(oauthError)}`);
        }

        if (!code) {
            console.error('인증 코드가 없습니다');
            return res.redirect(`${clientUrl}?error=no_code`);
        }

        // Supabase에서 세션 교환
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('세션 교환 에러:', error);
            return res.redirect(`${clientUrl}?error=${encodeURIComponent(error.message)}`);
        }

        if (!data.session || !data.user) {
            console.error('세션 또는 사용자 정보가 없습니다');
            return res.redirect(`${clientUrl}?error=no_session_or_user`);
        }

        console.log('로그인 성공');
        console.log('사용자 정보:', {
            id: data.user.id,
            email: data.user.email,
            name: data.user.user_metadata?.full_name
        });

        // 성공 파라미터 구성
        const successParams = new URLSearchParams({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in.toString(),
            user_id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            avatar_url: data.user.user_metadata?.avatar_url || '',
            login_success: 'true'
        });

        const successUrl = `${clientUrl}?${successParams.toString()}`;
        res.redirect(successUrl);

    } catch (err) {
        console.error('콜백 처리 중 예상치 못한 에러:', err);
        const clientUrl = process.env.CLIENT_URL || 'https://stockfinance.vercel.app';
        res.redirect(`${clientUrl}?error=${encodeURIComponent(err.message)}`);
    }
});


module.exports = router;
