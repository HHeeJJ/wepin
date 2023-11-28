import {createSlice} from '@reduxjs/toolkit';
import {localStorageUtil} from '../utils/LocalStorage';

const memberId = localStorageUtil.get('memberId');
const name = 'feed';
const initialState = {
    mainFeedList: {
        isLoading: false,
        lists: []
    },
    userFeedList: [],
    tobeDeleteFeedItem: {}
};

const feedSlice = createSlice({
    name,
    initialState,
    reducers: {
        setMainFeedList: (state, action) => {
            return {
                ...state,
                mainFeedList: {
                    isLoading: false,
                    lists: action.payload
                }
            };
        },
        isMainFeedLoading: (state, action) => {
            return {
                ...state,
                mainFeedList: {
                    ...state.mainFeedList,
                    isLoading: true
                }
            };
        },
        setUserFeedList: (state, action) => {
            return {
                ...state,
                userFeedList: action.payload
            };
        },
        setTobeDeletedFeedItem: (state, action) => {
            return {
                ...state,
                tobeDeleteFeedItem: action.payload
            };
        },
        resetUserFeedList: (state, action) => {
            return initialState.userFeedList;
        },
        updateProfileFollowStatus: (state, action) => {
            const clickedId = action.payload;
            const updatedMainFeedList = state.mainFeedList.lists.map((item) => {
                if (item.memberId === clickedId) {
                    return {...item, isFollow: !item.isFollow};
                }
                return item;
            });
            state.mainFeedList = {
                ...state.mainFeedList,
                lists: updatedMainFeedList
            };
        }
    }
});

export const {
    setMainFeedList,
    isMainFeedLoading,
    setUserFeedList,
    setTobeDeletedFeedItem,
    resetUserFeedList,
    updateProfileFollowStatus
} = feedSlice.actions;
export default feedSlice.reducer;
