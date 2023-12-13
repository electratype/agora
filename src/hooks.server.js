import { BACKEND_URL } from '$env/static/private';
import { createDirectus, rest, refresh, withToken, authentication, readItems } from '@directus/sdk';

const backend = createDirectus(BACKEND_URL).with(rest()).with(authentication());

const refresh_margin = 60 * 5;

export async function handle({ event, resolve }) {

    const requestedPath = event.url.pathname;
    const cookies = event.cookies;

    const auth_token = cookies.get('auth_token');
    const auth_refresh_token = cookies.get('auth_refresh_token');
    const auth_expires_at = cookies.get('auth_expires_at');

    console.log(auth_expires_at)

    const expires_in = get_expires_in(auth_expires_at);

    console.log("Expires in mins:", expires_in / 60)

    if (requestedPath.includes("/login")) {
        const response = await resolve(event);
        return response;
    }

    if (!auth_token || expires_in < 0) {

        console.log("HERE")

        return new Response(null, {
            status: 300,
            headers: { location: '/login' }
        })

    }

    if (expires_in < refresh_margin) {
        let data = await token_refresh_procedure(auth_token, auth_refresh_token);

        cookies.set("auth_token", data.access_token);
        cookies.set("auth_refresh_token", data.refresh_token);
        cookies.set("auth_expires_at", data.expires_at);
    }


    const response = await resolve(event);
    return response;
}

// Returns token expiration in seconds
function get_expires_in(auth_expires_at) {
    return (new Date(parseInt(auth_expires_at)) - new Date()) / 1000;
}

async function token_refresh_procedure(access_token, refresh_token) {

    var data;

    try {

        var response = await fetch(`${BACKEND_URL}/auth/refresh`, {
            method: 'POST',
            headers: {
                "Accept": 'application/json',
                "Content-Type": "application/json",
                "Authorization": `Bearer ${access_token}`
            },
            body: JSON.stringify({ refresh_token: refresh_token }),
        });
        data = await response.json();

    } catch (e) {

        console.log(e)

    }

    var expires = new Date(Date.now() + data.data.expires);

    return { access_token: data.data.access_token, refresh_token: data.data.refresh_token, expires_at: expires.getTime() }
}