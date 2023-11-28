import React, {useState, useRef, useEffect} from 'react';
import mainPinIcon from '../../assets/images/icon/wepin_marker_b.png';
import subPinIcon from '../../assets/images/icon/small_pin_b.png';

function Tmap(props) {
    const {pinList, openPinDetailDrawer, receivePinData} = props;

    const mapRef = useRef(null);
    const [myMap, setMyMap] = useState(null);
    const [centerLat, setCenterLat] = useState(37.5652045);
    const [centerLng, setCenterLng] = useState(126.98702028);

    const myPinMap = new Map();
    let currentMainPinId = '';

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
            myMap.on('DragEnd', function (evt) {
                // 드래그 후에 손가락 놓았을때 이벤트
            });
        }
    }, [myMap]);

    useEffect(() => {
        if (pinList.length === 0 && myMap === null) {
            return;
        }

        const tampTmapPinList = [];

        let tampTmapPin;
        pinList.forEach((pin) => {
            // pinData를 tmapMarker에 담아서 객체 생성 후 Map에 저장
            if (pin.isMain) {
                tampTmapPin = makeMaker(mainPinIcon, pin, true, mainPinIconSize);
                myPinMap.set(pin.id, tampTmapPin);
                myMap.setCenter(new window.Tmapv3.LatLng(pin.lat, pin.lng));
            } else {
                tampTmapPin = makeMaker(subPinIcon, pin, false, subPinIconSize);
                myPinMap.set(pin.id, tampTmapPin);
            }

            tampTmapPinList.push(tampTmapPin);
        });

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
    }, [pinList]);

    const sendPinData = (data) => {
        receivePinData(data);
    };

    const onClickPin = (evt) => {
        const pinData = evt.pinData;
        sendPinData(pinData);
        myMap.setCenter(new window.Tmapv3.LatLng(pinData.lat, pinData.lng)); // 지도 센터 포지션으로 이동

        // 이전 메인 pin 아이콘 처리
        if (myPinMap.has(currentMainPinId)) {
            myPinMap.get(currentMainPinId).setMap(null);
            myPinMap.set(
                currentMainPinId,
                makeMaker(subPinIcon, myPinMap.get(currentMainPinId).pinData, false, subPinIconSize)
            );
        }

        // 현재 클릭된 pin 아이콘 처리
        myPinMap.set(
            pinData.id,
            makeMaker(mainPinIcon, myPinMap.get(pinData.id).pinData, true, mainPinIconSize)
        );
        currentMainPinId = pinData.id;

        // 하단 drawer 오픈
        openPinDetailDrawer();
    };

    const makeMaker = (pinIconUrl = '', pinData, isMainPin, iconSize) => {
        const myPin = new window.Tmapv3.Marker({
            position: new window.Tmapv3.LatLng(pinData.lat, pinData.lng),
            map: myMap,
            icon: pinIconUrl,
            iconSize: new window.Tmapv3.Size(iconSize.width, iconSize.height)
        });

        myPin.pinData = pinData;
        myPin.isMainPin = isMainPin;

        if (isMainPin) {
            currentMainPinId = pinData.id;
        }

        myPin.on('Click', onClickPin);
        return myPin;
    };

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

    return <div id="map_div" ref={mapRef} style={{width: '100%', height: '400px'}}></div>;
}

export default Tmap;
