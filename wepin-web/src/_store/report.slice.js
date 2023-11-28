import {createSlice} from '@reduxjs/toolkit';

const reportSlice = createSlice({
    name: 'report',
    initialState: {
        reportDrawerOpen: false,
        beHiddenFeedItem: {}
    },
    reducers: {
        setReportDrawerOpen: (state, action) => {
            state.reportDrawerOpen = action.payload;
        },
        setBeHiddenFeedItem: (state, action) => {
            state.beHiddenFeedItem = action.payload;
        }
    }
});

export const {setReportDrawerOpen, setBeHiddenFeedItem} = reportSlice.actions;
export default reportSlice.reducer;
