import {writable} from "svelte/store";

export const jwtToken = writable(getCookie('jwt'));
export const cookie_notice_accepted = writable(getCookie('cookie_notice_accepted'));

export const updateCookieStore = () => {
    jwtToken.set(getCookie('jwt'));
    cookie_notice_accepted.set(getCookie('cookie_notice_accepted'));
}

export const expireCookie = (cname) => {
    let cookies = ` ${document.cookie}`.split(";");

    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0] === ` ${cname}`) {
            document.cookie = `${cookie[0]}=${cookie[1]}; max-age=0`;
        }
    }
    jwtToken.set(getCookie(cname));
}

export function getCookie(cname) {
    let cookies = ` ${document.cookie}`.split(";");
    for (let i = 0; i < cookies.length; i++) {
        let cookie = cookies[i].split("=");
        if (cookie[0] === ` ${cname}`) {
            return cookie[1];
        }
    }
    return undefined;
}