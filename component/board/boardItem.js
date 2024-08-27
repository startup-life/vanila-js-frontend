import { padTo2Digits } from '../../utils/function.js';

const BoardItem = (
    postId,
    date,
    postTitle,
    hits,
    imgUrl,
    writer,
    commentCount,
    like
) => {
    // 파라미터 값이 없으면 리턴
    if (
        !date ||
        !postTitle ||
        hits === undefined ||
        like === undefined ||
        commentCount === undefined ||
        !imgUrl ||
        !writer
    ) {
        return null;
    }

    // 날짜 포맷 변경 YYYY-MM-DD hh:mm:ss
    const dateObj = new Date(date);
    const year = dateObj.getFullYear();
    const month = dateObj.getMonth() + 1;
    const day = dateObj.getDate();
    const hours = dateObj.getHours();
    const minutes = dateObj.getMinutes();
    const seconds = dateObj.getSeconds();

    const formattedDate = `${year}-${padTo2Digits(month)}-${padTo2Digits(day)} ${padTo2Digits(hours)}:${padTo2Digits(minutes)}:${padTo2Digits(seconds)}`;

    return `
    <a href="/html/board.html?id=${postId}">
        <div class="boardItem">
            <h2 class="title">${postTitle}</h2>
            <div class="info">
                <h3 class="views">좋아요 <b>${like}</b></h3>
                <h3 class="views">댓글 <b>${commentCount}</b></h3>
                <h3 class="views">조회수 <b>${hits}</b></h3>
                <p class="date">${formattedDate}</p>
            </div>
            <div class="writerInfo">
            <picture class="img">
                <img src="${`${imgUrl}`}" alt="img">
            </picture>
            <h2 class="writer">${writer}</h2>
        </div>
        </div>
    </a>
`;
};

export default BoardItem;
