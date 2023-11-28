import {createSlice} from '@reduxjs/toolkit';

const name = 'search';
const initialState = {
    schProcess: '',
    schKeyword: '',
    schList: []
};

const searchSlice = createSlice({
    name,
    initialState,
    reducers: {
        setSchProcess: (state, action) => {
            return {
                ...state,
                schProcess: action.payload
            };
        },
        setSchKeyword: (state, action) => {
            state.schKeyword = action.payload;
        },
        setSchList: (state, action) => {
            state.schList = action.payload;
        },
        resetSch: (state, action) => {
            return initialState;
        }
    }
});

export const {setSchProcess, setSchKeyword, setSchList, resetSch} = searchSlice.actions;
export default searchSlice.reducer;
