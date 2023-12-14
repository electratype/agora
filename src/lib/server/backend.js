import { BACKEND_URL } from '$env/static/private';
import { createDirectus, rest, refresh, withToken, authentication, readItems } from '@directus/sdk';

export const backend = createDirectus(BACKEND_URL).with(rest());

export function generate_url(path) {
    return `${BACKEND_URL}${path}`;
}

export function generate_headers(access_token) {
    return  {
        "Accept": 'application/json',
        "Content-Type": "application/json",
        "Authorization": `Bearer ${access_token}`
    }
}

export async function token_refresh_procedure(access_token, refresh_token) {

    var data;

    try {

        var response = await fetch(generate_url("/auth/refresh"), {
            method: 'POST',
            headers: generate_headers(access_token),
            body: JSON.stringify({ refresh_token: refresh_token }),
        });
        data = await response.json();

    } catch (e) {

        console.log(e)

    }

    var expires = new Date(Date.now() + data.data.expires);

    return { access_token: data.data.access_token, refresh_token: data.data.refresh_token, expires_at: expires.getTime() }
}