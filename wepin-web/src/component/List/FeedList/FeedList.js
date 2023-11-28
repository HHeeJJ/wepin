import React from 'react';
import styles from './FeedList.module.scss';
import FeedListItem from './FeedListItem';

function FeedList(props) {
    const {feedList, myIsFollow} = props;

    return (
        <div className={styles.feedListWrap}>
            <ul className={styles.feedList}>
                {feedList?.map((feedItem) => {
                    return <FeedListItem key={feedItem.feedId} feedItem={feedItem} myIsFollow={myIsFollow} />;
                })}
            </ul>
        </div>
    );
}

export default FeedList;
