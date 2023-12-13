import { BACKEND_URL } from '$env/static/private';
import { createDirectus, rest, login } from '@directus/sdk';
import { fail, redirect } from '@sveltejs/kit';

const backend = createDirectus(BACKEND_URL).with(rest());

export const actions = {

	authenticate: async ({ cookies, request}) => {

		var successful = false;

		const data = await request.formData();
		const email = data.get('email');
		const password = data.get('password');

		try {
			let response = await backend.request(login(email, password, {mode: "json"}));

			var expires= new Date(Date.now() + response.expires);

			cookies.set("auth_token", response.access_token);
			cookies.set("auth_refresh_token", response.refresh_token);
			cookies.set("auth_expires_at", expires.getTime());

			successful = true;

		} catch {
			console.log("Err0r")
		}

		if (successful) {
			throw redirect(301, "/");
		}
		
	}
};