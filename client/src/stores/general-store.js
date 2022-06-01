import {readable, writable} from "svelte/store";
import {expireCookie} from "./cookie-store";

export const base_url = readable(`${window.location.origin}/api`);
export const hasKeys = writable(true);

export async function checkApiKeys() {
    const url = `${window.location.origin}/api`
    const response = await fetch(`${url}/users/hasapikeys`);

    if (!response.ok)
        expireCookie('jwt');
    else {
        const data = await response.json();

        if (!data.hasKeys)
            hasKeys.set(false);
        else
            hasKeys.set(true);
    }
}