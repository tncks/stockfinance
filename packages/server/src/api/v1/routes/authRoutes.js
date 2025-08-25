const express = require('express');
const {createClient} = require('@supabase/supabase-js');
const jwt = require('jsonwebtoken');
const JWT_SECRET = process.env.JWT_SECRET;
const supabaseUrl = process.env.MY_SUPABASE_URL;
const supabaseAnonKey = process.env.MY_SUPABASE_ANON_KEY;

const router = express.Router();

const supabase = createClient(supabaseUrl, supabaseAnonKey);



router.get('/google', async (req, res) => {
    // 프로덕션/개발 환경에 따른 서버 URL 설정
    const serverUrl = `http://49.50.132.4:3000`;

    const redirectTo = `${serverUrl}/api/v1/auth/google_callback`;

    const clientURLFromRequest = req.query.redirect_uri;

    const {data, error} = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
            redirectTo,
            state: clientURLFromRequest
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

    res.redirect(data.url);
});


// Google OAuth 콜백 처리
router.get('/google_callback', async (req, res) => {

    const { code, state, error: oauthError } = req.query;
    const clientURL = state || `https://stockfinance.vercel.app`;

    try {
        console.log('Google 콜백 처리 시작');
        console.log('Query params:', req.query);

        // OAuth 에러 체크
        if (oauthError) {
            console.error('OAuth 에러:', oauthError);
            return res.redirect(`${clientURL}?error=${encodeURIComponent(oauthError)}`);
        }

        if (!code) {
            console.error('인증 코드가 없습니다');
            return res.redirect(`${clientURL}?error=no_code`);
        }

        // Supabase에서 세션 교환
        const { data, error } = await supabase.auth.exchangeCodeForSession(code);

        if (error) {
            console.error('세션 교환 에러:', error);
            return res.redirect(`${clientURL}?error=${encodeURIComponent(error.message)}`);
        }

        if (!data.session || !data.user) {
            console.error('세션 또는 사용자 정보가 없습니다');
            return res.redirect(`${clientURL}?error=no_session_or_user`);
        }

        console.log('로그인 성공');
        // console.log('사용자 정보:', {
        //     id: data.user.id,
        //     email: data.user.email,
        //     name: data.user.user_metadata?.full_name
        // });

        // JWT 발급
        const token = jwt.sign(
            { id: data.user.id, email: data.user.email },
            JWT_SECRET,
            { expiresIn: "6h" }
        );

        // 성공 파라미터 구성
        const successParams = new URLSearchParams({
            access_token: data.session.access_token,
            refresh_token: data.session.refresh_token,
            expires_in: data.session.expires_in.toString(),
            user_id: data.user.id,
            email: data.user.email || '',
            name: data.user.user_metadata?.full_name || data.user.user_metadata?.name || '',
            avatar_url: data.user.user_metadata?.avatar_url || '',
            login_success: 'true',
            authToken: token
        });

        const successUrl = `${clientURL}?${successParams.toString()}`;
        res.redirect(successUrl);

    } catch (err) {
        console.error('콜백 처리 중 예상치 못한 에러:', err);
        const clientURL = state || 'https://stockfinance.vercel.app';
        res.redirect(`${clientURL}?error=${encodeURIComponent(err.message)}`);
    }
});



// 소셜 로그인 처리 완료 후 토큰 발급
// 실제로는 구글 OAuth callback 에서 사용자 정보 받아서 처리해야 함
//router.get('/google/callback', (req, res) => {
  // DO SOMETHING ..

  //   // (안쓸듯->) 팝업 창 닫고 프론트엔드로 토큰 전달
  //   res.send(`
  //   <script>
  //     window.opener.postMessage(, "*");
  //     window.close();
  //   </script>
  // `); //(참고용블럭)
//});



// 토큰 검증 API
router.get('/verify', (req, res) => {
    const authHeader = req.headers['Authorization'];
    if (!authHeader) return res.status(401).json({ error: "No token" });

    const token = authHeader.split(' ')[1];
    if (!token) return res.status(401).json({ error: "Invalid token" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        // DB에서 사용자 정보 조회했다고 가정
        const user = {'test_dev_code':202}
        res.json(user);
    } catch (err) {
        return res.status(403).json({ error: "Token expired or invalid" });
    }
});



module.exports = router;
