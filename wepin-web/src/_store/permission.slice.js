import {createSlice} from '@reduxjs/toolkit';
import {useRef} from 'react';

const permissionSlice = createSlice({
    name: 'permission',
    initialState: {
        photoCameraPermission: '',
        whereCallFrom: ''
    },
    reducers: {
        setPhotoCameraPermission: (state, action) => {
            state.photoCameraPermission = action.payload;
        },
        setWhereCallFrom: (state, action) => {
            state.whereCallFrom = action.payload;
        }
    }
});

export const {setPhotoCameraPermission, setWhereCallFrom} = permissionSlice.actions;
export default permissionSlice.reducer;
