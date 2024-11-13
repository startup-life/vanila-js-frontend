import { getServerUrl, getCookie } from '../utils/function.js';

export const deleteComment = (postId, commentId) => {
    const result = fetch(
        `${getServerUrl()}/posts/${postId}/comments/${commentId}`,
        {
            method: 'DELETE',
            headers: {
                'Authorization': `Bearer ${getCookie('accessToken')}`,
            },
        },
    );
    return result;
};

export const updateComment = (postId, commentId, commentContent) => {
    const result = fetch(
        `${getServerUrl()}/posts/${postId}/comments/${commentId}`,
        {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${getCookie('accessToken')}`,
            },
            body: JSON.stringify(commentContent),
        },
    );
    return result;
};
