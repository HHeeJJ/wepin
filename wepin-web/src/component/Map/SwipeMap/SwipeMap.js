import React, {useState, useRef, useEffect} from 'react';
import {useDispatch, useSelector} from 'react-redux';
import {setPlaceInfo, setMapDragOn, setLocDrawerOpen} from '../../../_store/makePin.slice';
import Icon from '../../Icon/Icon';
import './SwipeMap.scss';
import IconButton from '../../Button/IconButton/IconButton';
import getUserAgent from '../../../utils/UserAgent';

let myMapState = null;
export const setCenter = (lat, lng) => {
    myMapState.setCenter(new window.Tmapv3.LatLng(lat, lng)); // 지도 센터 포지션으로 이동
};

function SwipeMap(props) {
    const dispatch = useDispatch();
    const {placeInfo, mapDragOn, locDrawerOpen} = useSelector((state) => state.makePin);

    const [myMap, setMyMap] = useState(null);
    myMapState = myMap;

    const [latitude, setLatitude] = useState(locDrawerOpen.lat); // 위도
    const [longitude, setLongitude] = useState(locDrawerOpen.lng); // 경도

    const mapRef = useRef(null);

    let newRoadAddr = null;
    let jibunAddr = null;

    // 리버스 지오코딩 요청 함수
    function loadGetLonLatFromAddress(lat, lng) {
        //  TData 객체 생성
        const tData = new window.Tmapv3.extension.TData();

        const optionObj = {
            coordType: 'WGS84GEO', // 응답좌표 타입 옵션 설정 입니다.
            addressType: 'A10' // 주소타입 옵션 설정 입니다.
        };

        const params = {
            onComplete: (response) => {
                loadGetonComplete(response, lat, lng);
            }, // 데이터 로드가 성공적으로 완료
            onProgress: loadGetonProgress, // 데이터 로드 중
            onError: loadGetonError // 데이터 로드가 실패
        };

        //  TData 객체의 리버스지오코딩 함수
        tData.getAddressFromGeoJson(lat, lng, optionObj, params);
    }

    // 리버스 지오코딩
    function loadGetonComplete(response, lat, lng) {
        const responseData = response._responseData;

        // json에서 주소 파싱
        const arrResult = responseData.addressInfo;

        // 법정동 마지막 문자
        const lastLegal = arrResult.legalDong.charAt(arrResult.legalDong.length - 1);

        // 새주소
        newRoadAddr = arrResult.city_do + ' ' + arrResult.gu_gun + ' ';

        if (arrResult.eup_myun === '' && (lastLegal === '읍' || lastLegal === '면')) {
            // 읍면
            newRoadAddr += arrResult.legalDong;
        } else {
            newRoadAddr += arrResult.eup_myun;
        }
        newRoadAddr += ' ' + arrResult.roadName + ' ' + arrResult.buildingIndex;

        // 구주소
        jibunAddr =
            arrResult.city_do +
            ' ' +
            arrResult.gu_gun +
            ' ' +
            arrResult.legalDong +
            ' ' +
            arrResult.ri +
            ' ' +
            arrResult.bunji;

        const updatePlaceInfoState = {
            ...placeInfo,
            addr: newRoadAddr,
            addrStreet: jibunAddr,
            lat: parseFloat(lat),
            lng: parseFloat(lng)
        };
        dispatch(setPlaceInfo(updatePlaceInfoState));
    }

    // 리버스 지오코딩 데이터 로드중
    function loadGetonProgress() {}

    // 리버스 지오코딩 데이터 로드 중 에러
    function loadGetonError() {}

    useEffect(() => {
        // Tmap API가 window 객체에서 사용 가능한지 확인
        if (!window.Tmapv3) {
            console.error('Tmap API가 로드되지 않았습니다.');
            return;
        }

        setMyMap(
            new window.Tmapv3.Map(mapRef.current, {
                center: new window.Tmapv3.LatLng(latitude, longitude),
                width: '100%',
                height: '100%',
                zoom: 16
            })
        );
        loadGetLonLatFromAddress(latitude, longitude);

        return () => {
            // Cleanup any resources if necessary
            setMyMap(null);
        };
    }, []);

    useEffect(() => {
        if (myMap !== null) {
            myMap.on('DragStart', function (evt) {
                // 드래그 시작

                dispatch(setMapDragOn(true));
            });

            myMap.on('DragEnd', function (evt) {
                // 드래그 후에 손가락 놓았을때 이벤트
                const center = evt._target._transform._center;

                dispatch(setMapDragOn(false));
                loadGetLonLatFromAddress(center.lat, center.lng);
            });
        }
    }, [myMap]);

    // 맵의 우측 하단 현재 위치로 설정 버튼 클릭 (현재 위치로 지도 이동)
    const handleCurrentLocation = () => {
        const ua = getUserAgent();

        if (ua === 'web') {
            myMap.setCenter(new window.Tmapv3.LatLng('37.563451240211606', '126.97546362876933')); // 지도 센터 포지션으로 이동
        } else {
            window.ReactNativeWebView?.postMessage(JSON.stringify({type: 'gpsPermissonCheck', whareCalled: 'swpieMap'}));
        }
    };

    return (
        <div id="swipeMap">
            <div className={`centerPos ${mapDragOn ? 'dragOn' : ''}`}>
                <span className="txt">지도를 움직여 위치를 설정하세요</span>
                <Icon name="wepin_marker" width="41" height="53" fill="#297FFF" />
            </div>
            <div id="map_div" ref={mapRef}></div>
            <IconButton name="current_gps" width="56" height="56" fill="#297FFF" className="btnCurrentPos"
                        onClick={handleCurrentLocation}/>
        </div>
    );
}

export default SwipeMap;
