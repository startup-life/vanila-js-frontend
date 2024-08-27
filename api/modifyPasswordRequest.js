import { getCookie, getServerUrl } from '../utils/function.js';

const changePassword = async (userId, password) => {
    return fetch(`${getServerUrl()}/users/${userId}/password`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json',
            session: getCookie('session'),
            userid: userId,
        },
        body: JSON.stringify({
            password,
        }),
    });
};

export default changePassword;
