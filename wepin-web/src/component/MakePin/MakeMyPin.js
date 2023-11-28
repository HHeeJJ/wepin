import React, {useEffect, useState, useRef} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import SearchInput from '../Input/SearchInput/SearchInput';
import LocationSearch from './LocationSearch';
import SettingMyPin from './SettingMyPin';
import Icon from '../Icon/Icon';
import {setMakePinStep, setLocDrawerOpen} from '../../_store/makePin.slice';
import {setSchProcess, setSchList, setSchKeyword, resetSch} from '../../_store/search.slice';
import getUserAgent from '../../utils/UserAgent';
import SetLocationDrawer from '../Drawer/SetLocationDrawer/SetLocationDrawer';
import MakePinHeader from './MakePinHeader';

function MakeMyPin(props) {
    const {makePinClose} = props;
    const timeoutRef = useRef(null);

    const dispatch = useDispatch();
    const {pinList, makePinStep, locDrawerOpen} = useSelector((state) => state.makePin);
    const {schProcess} = useSelector((state) => state.search);

    const [searchValue, setSearchValue] = useState('');
    const [isSearchFocus, setIsSearchFocus] = useState(false);

    const searchRef = useRef(null);

    // 위치 키워드 검색
    const searchAddress = (value) => {
        const searchKeyword = value;

        //  TData 객체 생성
        const tData = new window.Tmapv3.extension.TData();

        const optionObj = {
            page: 1,
            count: 20
        };

        const params = {
            onComplete: (response) => {
                const responseData = response._responseData.searchPoiInfo.pois.poi;
                dispatch(setSchKeyword(value));
                dispatch(setSchList(responseData));
                // console.log(responseData);
            }, // 데이터 로드가 성공적으로 완료
            onProgress: () => {}, // 데이터 로드 중
            onError: () => {} // 데이터 로드가 실패
        };

        if (searchKeyword) {
            // TData 객체의 자동완성 POI 검색 데이터 함수
            // https://tmapapi.sktelecom.com/main.html#webv2/docs/WebDocs.Tdata_getPOIDataFromSearchJson
            tData.getPOIDataFromSearchJson(searchKeyword, optionObj, params);
        }
    };

    // 위치 키워드 검색 초기화
    const resetSearch = () => {
        setSearchValue('');
        dispatch(resetSch());
    };

    // 위치 검색 실시간
    const handleInputChange = (value) => {
        if (value) {
            setSearchValue(value);

            dispatch(setSchProcess('ing'));

            // 이전에 설정된 타임아웃이 있다면 취소
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
            // 300ms 후에 TMAP API 호출
            timeoutRef.current = setTimeout(() => {
                searchAddress(value);
            }, 300);
        } else {
            resetSearch();
        }
    };

    // 위치 검색 결과 페이지로 이동
    const handlePressEnter = () => {
        dispatch(setSchProcess('result'));
    };

    // 현재 위치로 설정 Drawer 오픈 (지도에서 위치 설정하기)
    const handleCurrentLocation = () => {
        const ua = getUserAgent();

        // 핀 목록 추가 30개 제한
        if (pinList.length >= 30) {
            window.alert('핀 목록은 30개를 초과하여 등록할 수 없습니다.');
            return;
        }

        if (ua === 'web') {
            dispatch(setLocDrawerOpen({open: true, lat: '37.563451240211606', lng: '126.97546362876933'}));
        } else {
            window.ReactNativeWebView?.postMessage(
                JSON.stringify({type: 'gpsPermissonCheck', whareCalled: 'makeMyPin'})
            );
        }
    };

    // 지도에서 위치 설정하기 Drawer 닫기(취소)
    const handleLocDrawerClose = () => {
        dispatch(setLocDrawerOpen({open: false, lat: '', lng: ''}));
    };

    // 검색 Input focus 이벤트
    const handleOnFocusSearch = () => {
        dispatch(setMakePinStep({current: 'makePInSearch', prev: 'makePinIndex'}));
    };

    useEffect(() => {
        // 뒤로가기 이벤트 발생시 input value 초기화
        if (makePinStep.current === 'makePinIndex') {
            handleInputChange('');
        }
    }, [makePinStep.current]);

    useEffect(() => {
        if (isSearchFocus) {
            searchRef.current.focus();
            setTimeout(() => {
                setIsSearchFocus(false);
            }, [100]);
        }
    }, [isSearchFocus]);

    return (
        <>
            {/* 헤더 */}
            <MakePinHeader makePinClose={makePinClose} />

            {/* 핀 추가 */}
            <div className="makePinConArea">
                {/* 위치 설정 검색 영역 */}
                <div className="schLocArea">
                    <h3>위치 설정하기</h3>
                    <SearchInput
                        ref={searchRef}
                        onInputChange={handleInputChange}
                        handleOnFocus={handleOnFocusSearch}
                        pressEnterKey={handlePressEnter}
                        placeholder="건물명, 도로명 또는 지번으로 검색"
                        value={searchValue}
                    />

                    {schProcess === '' && (
                        <button
                            type="button"
                            className="btnSetCurrentLocation"
                            onClick={handleCurrentLocation}
                        >
                            <p>
                                <Icon name="gps" width="16" height="16" />
                                현재 위치로 설정
                            </p>
                            <Icon name="arr_right" width="14" height="14" />
                        </button>
                    )}
                </div>

                {schProcess === '' && <hr />}

                {makePinStep.current === 'makePInSearch' ? (
                    <>
                        {/* 위치 설정 검색 */}
                        <LocationSearch resetSearch={resetSearch} />
                    </>
                ) : (
                    <>
                        {/* 핀 목록 */}
                        <SettingMyPin setIsSearchFocus={setIsSearchFocus} />
                    </>
                )}
            </div>

            {/* 지도에서 위치 설정하기 */}
            <SetLocationDrawer isOpen={locDrawerOpen.open} onClose={handleLocDrawerClose} />
        </>
    );
}

export default MakeMyPin;
