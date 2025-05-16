export function useGoogleLogin() {
  const clientId = '485462016495-9pq20k1g2lc3aghfo1fkqhi00moeeeu0.apps.googleusercontent.com'
  const redirectUri = 'http://localhost'

  const scope = ['openid', 'email', 'profile'].join(' ')

const login = () => {
    const oauthUrl = new URL('https://accounts.google.com/o/oauth2/v2/auth');
    oauthUrl.searchParams.set('client_id', clientId);
    oauthUrl.searchParams.set('redirect_uri', 'myapp://'); // Use your custom protocol here
    oauthUrl.searchParams.set('response_type', 'token');
    oauthUrl.searchParams.set('scope', scope);
    oauthUrl.searchParams.set('prompt', 'consent');

    const loginWindow = window.open(oauthUrl.toString(), '_blank', 'width=500,height=600');

    if (!loginWindow) {
        console.error('Popup blocked or failed to open.');
        return;
    }

    // Polling mechanism to detect the redirect and extract the access token
    const pollTimer = setInterval(() => {
        try {
            const url = loginWindow.location.href;
            if (url.startsWith('myapp://')) {  // This checks if it's using your custom protocol
                const token = new URL(url).searchParams.get('access_token');
                if (token) {
                    clearInterval(pollTimer);
                    loginWindow.close();
                    console.log('Access Token:', token);
                }
            }
        } catch (e) {

        }
    }, 500);
}


  return { login }
}
