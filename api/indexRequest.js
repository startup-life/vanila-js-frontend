import { getServerUrl, getCookie } from '../utils/function.js';

const getPosts = (offset, limit) => {
    return fetch(`${getServerUrl()}/posts?offset=${offset}&limit=${limit}`, {
        headers: {
            session: getCookie('session'),
            userId: getCookie('userId'),
        },
        noCORS: true,
    });
};

export default getPosts;
