import React, {useEffect, useRef, useState} from 'react';
import {useSelector} from 'react-redux';
import wepinIcon from '../../assets/images/icon/wepin_marker_b.png';

function BasicMap(props) {
    const [myMap, setMyMap] = useState(null);

    const mapRef = useRef(null);

    const {lat, lng} = useSelector((state) => state.makePin.placeInfo);

    useEffect(() => {
        // Tmap API가 window 객체에서 사용 가능한지 확인
        if (!window.Tmapv3) {
            console.error('Tmap API가 로드되지 않았습니다.');
            return;
        }

        setMyMap(
            new window.Tmapv3.Map(mapRef.current, {
                center: new window.Tmapv3.LatLng(lat, lng),
                width: '100%',
                height: '100%',
                zoom: 16
            })
        );

        return () => {
            // Cleanup any resources if necessary
            setMyMap(null);
        };
    }, []);

    useEffect(() => {
        if (myMap !== null) {
            new window.Tmapv3.Marker({
                position: new window.Tmapv3.LatLng(lat, lng),
                map: myMap,
                icon: wepinIcon,
                iconSize: new window.Tmapv3.Size(41, 53)
            });
        }
    }, [myMap]);

    return <div id="map_div" ref={mapRef} style={{width: '100%', height: '100%'}}></div>;
}

export default BasicMap;
