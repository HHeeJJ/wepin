import {configureStore} from '@reduxjs/toolkit';
import authReducer from './auth.slice';
import replyReducer from './reply.slice';
import makiPinReducer from './makePin.slice';
import searchReducer from './search.slice';
import feedReducer from './feed.slice';
import etcReducer from './etc.slice';
import permissionReducer from './permission.slice';
import reportReducer from './report.slice';

const store = configureStore({
    reducer: {
        auth: authReducer,
        reply: replyReducer,
        makePin: makiPinReducer,
        search: searchReducer,
        feed: feedReducer,
        etc: etcReducer,
        permission: permissionReducer,
        report: reportReducer
    }
});

export default store;
