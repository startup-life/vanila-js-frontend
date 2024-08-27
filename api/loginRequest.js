import { getServerUrl } from '../utils/function.js';

export const userLogin = async (email, password) => {
    return fetch(`${getServerUrl()}/users/login`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            email,
            password,
        }),
    });
};

export const checkEmail = async (email) => {
    return fetch(`${getServerUrl()}/users/nickname/check?nickname=${email}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
};
