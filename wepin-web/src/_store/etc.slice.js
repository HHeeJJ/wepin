import {createSlice} from '@reduxjs/toolkit';

const etcSlice = createSlice({
    name: 'etc',
    initialState: {
        appVersion: '',
        backpressedCount: 0
    },
    reducers: {
        setAppVersion: (state, action) => {
            state.appVersion = action.payload;
        },
        setBackpressedCount: (state, action) => {
            state.backpressedCount = action.payload;
        },
        resetBackpressedCount: (state) => {
            if (state.backpressedCount <= 2) {
                state.backpressedCount = 0;
            }
        }
    }
});

export const {setAppVersion, setBackpressedCount, resetBackpressedCount} = etcSlice.actions;
export default etcSlice.reducer;
