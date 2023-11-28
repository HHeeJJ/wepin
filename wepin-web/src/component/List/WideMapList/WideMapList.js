import React, {useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import styles from './WideMapList.module.scss';
import WideMapListItem from './WideMapListItem';
import axioswrapper from '../../../utils/Axios';
import {localStorageUtil} from '../../../utils/LocalStorage';
import {setMainFeedList} from '../../../_store/feed.slice';
import Spinner from '../../Icon/Spinner';

function WideMapList() {
    const dispatch = useDispatch();
    const {mainFeedList} = useSelector((state) => state.feed);

    useEffect(() => {
        const myMemberId = localStorageUtil.get('memberId');

        axioswrapper
            .Axios('GET', `feed/list?memberId=${myMemberId}&size=50`)
            .then((response) => {
                console.log('피드 목록 조회 성공', response.data.data);
                dispatch(setMainFeedList(response.data.data.lists));
            })
            .catch((error) => {
                console.log('feed/list error', error);
            });
    }, []);

    return (
        <div className={styles.wideMapList}>
            <ul>
                {mainFeedList?.isLoading && (
                    <li className={styles.listLoading}>
                        <Spinner />
                    </li>
                )}
                {mainFeedList?.lists?.map((feedItem, idx) => (
                    <WideMapListItem key={idx} feedItem={feedItem} />
                ))}
            </ul>
        </div>
    );
}

export default WideMapList;
