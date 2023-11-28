import React from 'react';
import {history} from '../../../_helpers/history';
import styles from './FeedList.module.scss';

function FeedListItem(props) {
    const {feedItem, myIsFollow} = props;

    const onClickFeedDetail = (flag = '') => {
        const stateData = {
            feedId: feedItem.feedId,
            isFollow: myIsFollow,
            flag: flag
        };
        history.navigate(`/feed/detail/${stateData.feedId}`, {state: {stateData}});
    };

    return (
        <li key={feedItem.feedId} onClick={() => onClickFeedDetail()}>
            <div className={styles.previewMap}>
                <img src={feedItem.imgUrl} alt={feedItem.title} />
            </div>
            <div className={styles.pinInfo}>
                <strong className={styles.subject}>{feedItem.title}</strong>
                <span className={styles.count}>{feedItem.pinCnt}핀</span>
            </div>
        </li>
    );
}

export default FeedListItem;
