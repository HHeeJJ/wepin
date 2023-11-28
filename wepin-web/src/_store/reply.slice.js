import {createSlice} from '@reduxjs/toolkit';

const replySlice = createSlice({
    name: 'reply',
    initialState: {
        replyList: [],
        tobeDeleteReplyItem: {}
    },
    reducers: {
        setReplyList: (state, action) => {
            return {
                ...state,
                replyList: action.payload
            };
        },
        setTobeDeletedReplyItem: (state, action) => {
            return {
                ...state,
                tobeDeleteReplyItem: action.payload
            };
        },
        addReply: (state, action) => {
            return {
                ...state,
                replyList: [...state.replyList, action.payload]
            };
        }
    }
});

export const {setReplyList, setTobeDeletedReplyItem, addReply} = replySlice.actions;
export default replySlice.reducer;
