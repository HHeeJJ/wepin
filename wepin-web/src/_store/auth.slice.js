import {createSlice} from '@reduxjs/toolkit';

const authSlice = createSlice({
    name: 'auth',
    initialState: {
        accessToken: '',
        isLogined: false,
        isLoginLoading: false
    },
    reducers: {
        setAccessToken: (state, action) => {
            state.accessToken = action.payload;
        },
        setIsLogined: (state, action) => {
            state.isLogined = action.payload;
        },
        setIsLoginLoading: (state, action) => {
            state.isLoginLoading = action.payload;
        }
    }
});

export const {setAccessToken, setIsLogined, setIsLoginLoading} = authSlice.actions;
export default authSlice.reducer;
