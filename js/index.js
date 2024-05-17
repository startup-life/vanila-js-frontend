import BoardItem from '../components/board/boardItem.js';
import Header from '../components/header/header.js';
import { authCheck, getServerUrl, prependChild } from '../utils/function.js';
import { getPosts } from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '/public/image/profile/default.jpg';
const HTTP_NOT_AUTHORIZED = 401;
const SCROLL_THRESHOLD = 0.9;
const INITIAL_OFFSET = 5;
const ITEMS_PER_LOAD = 5;

// getBoardItem 함수
const getBoardItem = async (offset = 0, limit = 5) => {
    const response = await getPosts(offset, limit);
    if (!response.ok) {
        throw new Error('Failed to load post list.');
    }

    const data = await response.json();
    return data.data;
};

const setBoardItem = boardData => {
    const boardList = document.querySelector('.boardList');
    if (boardList && boardData) {
        const itemsHtml = boardData
            .map(data =>
                BoardItem(
                    data.post_id,
                    data.created_at,
                    data.post_title,
                    data.hits,
                    data.profileImagePath,
                    data.nickname,
                    data.comment_count,
                    data.like,
                ),
            )
            .join('');
        boardList.innerHTML += ` ${itemsHtml}`;
    }
};

// 스크롤 이벤트 추가
const addInfinityScrollEvent = () => {
    let offset = INITIAL_OFFSET,
        isEnd = false,
        isProcessing = false;

    window.addEventListener('scroll', async () => {
        const hasScrolledToThreshold =
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight * SCROLL_THRESHOLD;
        if (hasScrolledToThreshold && !isProcessing && !isEnd) {
            isProcessing = true;

            try {
                const newItems = await getBoardItem(offset, ITEMS_PER_LOAD);
                if (!newItems || newItems.length === 0) {
                    isEnd = true;
                } else {
                    offset += ITEMS_PER_LOAD;
                    setBoardItem(newItems);
                }
            } catch (error) {
                console.error('Error fetching new items:', error);
                isEnd = true;
            } finally {
                isProcessing = false;
            }
        }
    });
};

const init = async () => {
    try {
        const data = await authCheck();
        if (data.status === HTTP_NOT_AUTHORIZED) {
            window.location.href = '/html/login.html';
            return;
        }

        const profileImagePath =
            data.data.profileImagePath ?? DEFAULT_PROFILE_IMAGE;
        const fullProfileImagePath = `${getServerUrl()}${profileImagePath}`;
        prependChild(
            document.body,
            Header('Community', 0, fullProfileImagePath),
        );

        const boardList = await getBoardItem();
        setBoardItem(boardList);

        addInfinityScrollEvent();
    } catch (error) {
        console.error('Initialization failed:', error);
    }
};

init();

/*
import BoardItem from '../components/board/boardItem.js';
import Header from '../components/header/header.js';
import { authCheck, getServerUrl, prependChild } from '../utils/function.js';
import { getPosts } from '../api/indexRequest.js';

const DEFAULT_PROFILE_IMAGE = '/public/image/profile/default.jpg';
const HTTP_NOT_AUTHORIZED = 401;

// getBoardItem 함수
const getBoardItem = async (offset = 0, limit = 5) => {
    const response = await getPosts(offset, limit);
    if (!response.ok)
        return new Error('게시글 목록을 불러오는데 실패하였습니다.');

    const data = await response.json();
    const results = data.data;
    return results;
};

const setBoardItem = async boardData => {
    const boardList = document.querySelector('.boardList');
    if (boardList && boardData) {
        boardList.innerHTML = `${boardList.innerHTML} ${boardData
            .map(data => {
                return BoardItem(
                    data.post_id,
                    data.created_at,
                    data.post_title,
                    data.hits,
                    data.profileImagePath,
                    data.nickname,
                    data.comment_count,
                    data.like,
                );
            })
            .join('')}`;
    }
};

// 스크롤 이벤트 추가.
const addInfinityScrollEvent = () => {
    const limit = 5;
    let offset = 5,
        isEnd = false,
        isProcessing = false;

    window.addEventListener('scroll', async () => {
        // 90% 스크롤이 되었을 때 데이터 요청
        if (
            window.scrollY + window.innerHeight >=
            document.documentElement.scrollHeight * 0.9
        ) {
            if (isProcessing || isEnd) return;
            isProcessing = true;

            const newItems = await getBoardItem(offset, limit);
            if (!newItems || newItems.length === 0) {
                isEnd = true;
                return;
            }

            offset += limit;
            setBoardItem(newItems);
            isProcessing = false;
        }
    });
};

const init = async () => {
    const data = await authCheck();
    if (data.status === HTTP_NOT_AUTHORIZED) {
        window.location.href = '/html/login.html';
    }

    const profileImage =
        data.data.profileImagePath === undefined
            ? `${getServerUrl()}${DEFAULT_PROFILE_IMAGE}`
            : `${getServerUrl()}${data.data.profileImagePath}`;

    prependChild(document.body, Header('커뮤니티', 0, profileImage));

    const boardList = await getBoardItem();
    if (!boardList)
        return new Error('게시글 목록을 불러오는데 실패하였습니다.');

    setBoardItem(boardList);

    addInfinityScrollEvent();
};

init();
*/
