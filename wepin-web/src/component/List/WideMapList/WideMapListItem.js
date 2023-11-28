import React, {useEffect, useState} from 'react';
import {useDispatch} from 'react-redux';
import Map from '../../Map/Map';
import styles from './WideMapList.module.scss';
import Icon from '../../Icon/Icon';
import FeedBottomButton from '../../Button/FeedBottomButton/FeedBottomButton';
import ProfileArea from '../../Profile/ProfileArea';
import {history} from '../../../_helpers/history';
import axioswrapper from '../../../utils/Axios';
import {localStorageUtil} from '../../../utils/LocalStorage';
import EllipsisText from '../../../utils/EllipsisText';
import {updateProfileFollowStatus} from '../../../_store/feed.slice';

function WideMapListItem(props) {
    const {feedItem} = props;

    const dispatch = useDispatch();

    const [myIsFollow, setMyIsFollow] = useState(feedItem.isFollow);
    const [likeOn, setLikeOn] = useState(feedItem.isLike);
    const [likeCount, setLikeCount] = useState(feedItem.likeCnt);

    const onClickLike = () => {
        const likeUrl = !likeOn ? 'like/create' : 'like/delete';

        const payload = {
            feedId: feedItem.id,
            memberId: localStorageUtil.get('memberId')
        };

        axioswrapper
            .Axios('POST', likeUrl, payload)
            .then((response) => {
                console.log(`${likeUrl} ok`, response);
                setLikeOn(!likeOn);
                setLikeCount(response.data.data.count);
            })
            .catch((error) => {
                console.log(`${likeUrl} error`, error);
            });
    };

    const onClickFollowBtn = () => {
        const followUrl = !myIsFollow ? 'follow/create' : 'follow/delete';

        const payload = {
            followerId: feedItem.memberId,
            followingId: localStorageUtil.get('memberId')
        };

        axioswrapper
            .Axios('POST', followUrl, payload)
            .then((response) => {
                console.log(`${followUrl} ok`, response);
                setMyIsFollow(!myIsFollow);

                // Feed 리덕스 팔로우 상태 업데이트
                dispatch(updateProfileFollowStatus(feedItem.memberId));
            })
            .catch((error) => {
                console.log(`${followUrl} error`, error);
            });
    };

    const onClickFeedDetail = (flag = '') => {
        const stateData = {
            feedId: feedItem.id,
            isFollow: feedItem.isFollow,
            flag: flag
        };
        history.navigate(`/feed/detail/${stateData.feedId}`, {state: {stateData}});
    };

    // 피드 내용 글자수 제한하여 자르기
    const {ellipsisedText, showMoreText} = EllipsisText(feedItem.desc, 50);

    useEffect(() => {
        setMyIsFollow(feedItem.isFollow);
        setLikeOn(feedItem.isLike);
        setLikeCount(feedItem.likeCnt);
    }, [feedItem]);

    return (
        <li className={styles.wideMapListItem}>
            <div className={styles.mapAreaWrap}>
                {/* 지도 노출 영역 */}
                <div className={styles.mapArea} onClick={() => onClickFeedDetail()}>
                    <Map imgUrl={feedItem.imgUrl} />
                </div>

                {/* 좋아요 */}
                <button type="button" className={styles.btnLike} onClick={onClickLike}>
                    <Icon name={likeOn ? 'like-on' : 'like'} width="20" height="20" fill="#FF4F4F" />
                    <span className={styles.num}>{likeCount}</span>
                </button>
            </div>
            <div className={styles.postDetailArea}>
                {/* 프로필 영역 */}
                <ProfileArea feedDTO={feedItem} onClickFollowBtn={onClickFollowBtn} />
                <div className={styles.txtAreaWrap} onClick={() => onClickFeedDetail()}>
                    <div className={styles.txtArea}>
                        {ellipsisedText}
                        {showMoreText && <span className={styles.btnMorePost}> 더보기</span>}
                    </div>
                </div>

                {/* 댓글 영역 */}
                <button type="button" className={styles.btnMoreComment} onClick={() => onClickFeedDetail()}>
                    댓글 {feedItem.replyCnt}개 모두보기
                </button>
            </div>

            {/* 피드 하단 버튼 영역 */}
            <FeedBottomButton
                onClickLike={onClickLike}
                likeOn={likeOn}
                onClickWriteComment={onClickFeedDetail}
            />
        </li>
    );
}

export default WideMapListItem;
