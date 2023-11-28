import React, {useState, useRef, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import mainPinIcon from '../../assets/images/icon/wepin_marker_b.png';
import subPinIcon from '../../assets/images/icon/small_pin_b.png';
import {setPinInfo} from '../../_store/makePin.slice';

function Tmap(props) {
    const {pinList} = useSelector((state) => state.makePin);

    const dispatch = useDispatch();

    const mapRef = useRef(null);
    const [myMap, setMyMap] = useState(null);
    const [centerLat, setCenterLat] = useState(37.5652045);
    const [centerLng, setCenterLng] = useState(126.98702028);
    const [captureMap, setCaptureMap] = useState('');

    const myPinMap = new Map();
    const mapWidth = mapRef?.current?.clientWidth;
    const mapHeight = mapRef?.current?.clientHeight;

    // 핀 마커 사이즈 (메인핀)
    const mainPinIconSize = {
        width: 41,
        height: 53
    };

    // 핀 마커 사이즈 (서브핀)
    const subPinIconSize = {
        width: 24,
        height: 28
    };

    const makeMaker = (pinIconUrl = '', pinData, isMainPin, iconSize) => {
        const pinId = pinData.id ? pinData.id : pinData.uiSeq;

        const myPin = new window.Tmapv3.Marker({
            position: new window.Tmapv3.LatLng(pinData.lat, pinData.lng),
            map: myMap,
            icon: pinIconUrl,
            iconSize: new window.Tmapv3.Size(iconSize.width, iconSize.height)
        });

        myPin.pinData = pinData;
        myPin.isMainPin = isMainPin;

        return myPin;
    };

    // StaticMap Url을 base64로 변환
    function convertImageToBase64(fileUrl) {
        fetch(fileUrl)
            .then((response) => response.blob()) // 이미지를 Blob으로 변환
            .then((blob) => {
                const reader = new FileReader();
                reader.onloadend = () => {
                    // Blob을 base64로 변환한 문자열 출력
                    const base64String = reader.result;
                    setCaptureMap(base64String);
                };
                // Blob을 base64로 읽습니다.
                reader.readAsDataURL(blob);
            })
            .catch((error) => {
                console.error(error);
            });
    }

    useEffect(() => {
        // Tmap API가 window 객체에서 사용 가능한지 확인
        if (!window.Tmapv3) {
            console.error('Tmap API가 로드되지 않았습니다.');
            return;
        }

        setMyMap(
            new window.Tmapv3.Map(mapRef.current, {
                center: new window.Tmapv3.LatLng(centerLat, centerLng),
                width: '100%',
                height: '100%',
                zoom: 13
            })
        );

        return () => {
            setMyMap(null);
        };
    }, []);

    useEffect(() => {
        if (myMap !== null) {
            const tampTmapPinList = [];

            pinList.forEach((pin) => {
                const pinId = pin.id ? pin.id : pin.uiSeq;

                let tampTmapPin;
                // pinData를 tmapMarker에 담아서 객체 생성 후 Map에 저장
                if (pin.isMain) {
                    const iconSize = {
                        width: 41,
                        height: 53
                    };
                    tampTmapPin = makeMaker(mainPinIcon, pin, true, mainPinIconSize);
                    myPinMap.set(pinId, tampTmapPin);
                    myMap.setCenter(new window.Tmapv3.LatLng(pin.lat, pin.lng));
                } else {
                    const iconSize = {
                        width: 24,
                        height: 28
                    };
                    tampTmapPin = makeMaker(subPinIcon, pin, false, subPinIconSize);
                    myPinMap.set(pinId, tampTmapPin);
                }

                tampTmapPinList.push(tampTmapPin);
            });

            if (mapRef !== null) {
                // 지도 넓이, 높이 리사이즈
                myMap.resize(mapRef.current.clientWidth, mapRef.current.clientHeight);
            }

            const furthestWayPin = findLongerLine(tampTmapPinList);

            const furthestWayPinPos = new window.Tmapv3.LatLng(
                furthestWayPin.pinData.lat,
                furthestWayPin.pinData.lng
            );

            let mbounds = myMap.getBounds();

            if (!mbounds.contains(furthestWayPinPos)) {
                const intervalId = setInterval(() => {
                    mbounds = myMap.getBounds();
                    //console.log('5초마다 실행됩니다!', mbounds.contains(furthestWayPinPos));
                    if (mbounds.contains(furthestWayPinPos)) {
                        // 예를 들어, 3번 실행된 후에 작업을 종료
                        //console.log('작업을 종료합니다.');
                        clearInterval(intervalId); // setInterval 작업 종료
                    } else {
                        myMap.zoomOut();
                        //console.log('줌아웃', myMap.getZoom());
                    }
                }, 200);
            }

            setTimeout(() => {
                generateStaticMapURL();
            }, 2000);
        }

        if (myMap !== null && mapRef !== null) {
            //지도 넓이, 높이 리사이즈
            myMap.resize(mapRef.current.clientWidth, mapRef.current.clientHeight);
        }
    }, [myMap]);

    const findLongerLine = (tampTmapPinList) => {
        const mainPin = tampTmapPinList.find((item) => item.pinData.isMain);

        var distance = 0.0;
        var furthestWayPin = mainPin;

        for (var i = 0; i < tampTmapPinList.length; i++) {
            if (tampTmapPinList[i].pinData.isMain) {
                continue;
            }

            const newDistance = mainPin.getPosition().distanceTo(tampTmapPinList[i].getPosition());
            if (newDistance > distance) {
                distance = newDistance;
                furthestWayPin = tampTmapPinList[i];
            }
        }

        return furthestWayPin;
    };

    // StaticMap (지도를 이미지로 변환)
    const generateStaticMapURL = () => {
        const apiKey = process.env.REACT_APP_TMAP_API_KEY; // TMAP API 키
        const latitude = myMap.getCenter()._lat; // 중심 위도
        const longitude = myMap.getCenter()._lng; // 중심 경도
        const zoom = myMap.getZoom(); // 확대 수준
        const width = mapWidth || 375; // 이미지 너비
        const height = mapHeight || 295; // 이미지 높이
        const coordType = 'WGS84GEO'; // 좌표 유형 (WGS84GEO는 위도 경도를 의미)
        const format = 'PNG'; // 이미지 형식

        // 다중 마커 정보 설정
        const markers = [];
        pinList.forEach((pin) => {
            let staticMapPin = null;
            // pinData를 tmapMarker에 담아서 객체 생성 후 Map에 저장
            if (pin.isMain) {
                staticMapPin = {
                    symbol: 'm', // 마커 모양 (위치 표시 pin 형태)
                    color: '297FFF', // 마커 색상
                    coords: `${pin.lng},${pin.lat}`, // 좌표 (경도, 위도)
                    viewSize: 0.4 // 마커 크기(원래 크기의 1/2)
                };
            } else {
                staticMapPin = {
                    symbol: 't', // 마커 모양 (작은 점 형태의 pin)
                    color: '297FFF', // 마커 색상
                    coords: `${pin.lng},${pin.lat}`, // 좌표 (경도, 위도)
                    viewSize: 0.4 // 마커 크기(원래 크기의 1/2)
                };
            }
            markers.push(staticMapPin);
        });

        // 마커 정보를 문자열로 변환
        const markerParams = markers
            .map((marker) => {
                const symbolParam = marker.color
                    ? `pin-${marker.symbol}@${marker.color}`
                    : `pin-${marker.symbol}`;
                return `${symbolParam}(${marker.coords})viewSize:${marker.viewSize}`;
            })
            .join(',');

        // Static Map 서비스 URL 생성
        const staticMapURL = `https://apis.openapi.sk.com/tmap/staticMap?version=1&appKey=${apiKey}&coordType=${coordType}&width=${width}&height=${height}&zoom=${zoom}&format=${format}&longitude=${longitude}&latitude=${latitude}&markers=${markerParams}`;

        // 생성된 URL을 base64로 변환
        convertImageToBase64(staticMapURL);
    };

    useEffect(() => {
        // captureMap 리덕스에 저장
        if (captureMap) {
            dispatch(setPinInfo({img: captureMap}));
        }
    }, [captureMap]);

    return (
        <>
            <div id="map_div" ref={mapRef} style={{width: '100%', height: '100%'}}></div>
        </>
    );
}

export default Tmap;
