import {readable, writable} from "svelte/store";
import {expireCookie} from "./cookie-store";

export const base_url = readable(`${window.location.origin}/api`);
export const hasKeys = writable(true);

export const checkApiKeys = async () => {
    const url = `${window.location.origin}/api`
    const response = await fetch(`${url}/keys/hasapikeys`);

    if (!response.ok)
        expireCookie('jwt');
    else {
        const data = await response.json();

        setTimeout(() => {
        if (!data.hasKeys)
            hasKeys.set(false);
        else
            hasKeys.set(true);
        }, 1500);
    }
}