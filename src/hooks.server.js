import { BACKEND_URL } from '$env/static/private';
import { rest, refresh, authentication, readItems } from '@directus/sdk';
import { backend, generate_headers, token_refresh_procedure } from "./lib/server/backend"

const refresh_margin = 60 * 5;

export async function handle({ event, resolve }) {

    const requestedPath = event.url.pathname;
    const cookies = event.cookies;

    const auth_token = cookies.get('auth_token');
    const auth_refresh_token = cookies.get('auth_refresh_token');
    const auth_expires_at = cookies.get('auth_expires_at');

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