import React from 'react';
import styles from './Comment.module.scss';
import {Avatar} from '@mui/material';
import {history} from '../../_helpers/history';
import {appUtils} from '../../utils/AppUtils';

function CommentItem(props) {
    const {commentDeleteClick, listItem, isVisibleDeleteText} = props;

    // 사용자 메인 피드 보기
    const moreUserFeed = () => {
        history.navigate(`/feed/index/${listItem.memberId}`);
    };

    return (
        <div className={styles.commentList}>
            <Avatar src={listItem.avatarSrc} className={styles.avatar} onClick={moreUserFeed} />
            <div className={styles.txtArea}>
                <strong className={styles.userName} onClick={moreUserFeed}>
                    {listItem.name}
                    <span className={styles.date}>{appUtils.nowDateToYYYYMMDD(listItem.createdAt)}</span>
                </strong>
                <p>{listItem.comment}</p>

                {isVisibleDeleteText && (
                    <button
                        type="button"
                        className={styles.btnComment}
                        onClick={() => commentDeleteClick(listItem)}
                    >
                        댓글 삭제
                    </button>
                )}
            </div>
        </div>
    );
}

export default CommentItem;
