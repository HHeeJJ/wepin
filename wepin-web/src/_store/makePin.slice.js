import {createSlice} from '@reduxjs/toolkit';

const name = 'makePin';
const initialState = {
    makePinOpen: false,
    makePinStep: {
        current: 'makePinIndex',
        prev: null
    },
    makePinMode: {
        mode: 'write',
        index: null
    },
    pinInfo: {
        desc: '',
        img: '',
        memberId: '',
        title: ''
    },
    pinList: [],
    placeInfo: {
        // 지도에서 위치 설정하기
        addr: '', // 도로명 주소
        addrDetail: '', // 상세 주소
        addrStreet: '', // 지번 주소
        imgStringList: [], // 첨부 이미지 (스트링 변환)
        lat: '',
        lng: '',
        name: ''
    },
    mapDragOn: false, // 지도에서 위치 설정하기 > 위치 변경중 여부
    locDrawerOpen: {
        open: false, // 위치 설정 drawer open 여부
        lat: '',
        lng: ''
    }
};

const makePinSlice = createSlice({
    name,
    initialState,
    reducers: {
        setMakePinOpen: (state, action) => {
            return {
                ...state,
                makePinOpen: action.payload
            };
        },
        setMakePinStep: (state, action) => {
            return {
                ...state,
                makePinStep: action.payload
            };
        },
        setMakePinMode: (state, action) => {
            return {
                ...state,
                makePinMode: action.payload
            };
        },
        setPinInfo: (state, action) => {
            const {desc, img, title} = action.payload;

            state.pinInfo.desc = desc;
            state.pinInfo.img = img;
            state.pinInfo.title = title;
        },
        setPinList: (state, action) => {
            return {
                ...state,
                pinList: [...state.pinList, action.payload]
            };
        },
        setUpdatePinList: (state, action) => {
            return {
                ...state,
                pinList: action.payload
            };
        },
        setPlaceInfo: (state, action) => {
            return {
                ...state,
                placeInfo: action.payload
            };
        },
        setResetPlaceInfo: (state, action) => {
            state.placeInfo = initialState.placeInfo;
            state.makePinMode = initialState.makePinMode;
        },
        setMapDragOn: (state, action) => {
            state.mapDragOn = action.payload;
        },
        setLocDrawerOpen: (state, action) => {
            state.locDrawerOpen = action.payload;
        },
        setChangeMainPin: (state, action) => {
            const {index} = action.payload;
            state.pinList = state.pinList.map((item, i) => ({
                ...item,
                isMain: i === index
            }));
        },
        setModifyPin: (state, action) => {
            const index = action.payload;
            const locDrawerOpenState = state.locDrawerOpen;
            const placeInfoState = state.placeInfo;
            const pinListState = state.pinList[index];
            const makePinModeState = state.makePinMode;

            // 드로어 오픈
            locDrawerOpenState.open = true;
            locDrawerOpenState.lat = pinListState.lat;
            locDrawerOpenState.lng = pinListState.lng;

            // 기존 입력 정보 세팅
            placeInfoState.addr = pinListState.addr;
            placeInfoState.addrDetail = pinListState.addrDetail;
            placeInfoState.addrStreet = pinListState.addrStreet;
            placeInfoState.imgStringList = pinListState.imgStringList;
            placeInfoState.lat = pinListState.lat;
            placeInfoState.lng = pinListState.lng;
            placeInfoState.name = pinListState.name;

            // 입력폼 수정에 맞게 세팅
            makePinModeState.mode = 'modify';
            makePinModeState.index = index;
        },
        resetMakePin: (state, action) => {
            return initialState;
        }
    }
});

export const {
    setMakePinOpen,
    setMakePinStep,
    setMakePinMode,
    setPinInfo,
    setPinList,
    setUpdatePinList,
    setPlaceInfo,
    setResetPlaceInfo,
    setMapDragOn,
    setLocDrawerOpen,
    setChangeMainPin,
    setModifyPin,
    resetMakePin
} = makePinSlice.actions;
export default makePinSlice.reducer;
