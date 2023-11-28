import React from 'react';
import {useSelector} from 'react-redux';
import LocationSearchGuide from '../Search/LocationSearchGuide';
import RealTimeSchList from '../Search/RealTimeSchList';
import LocationSearchResult from '../Search/LocationSearchResult';

function LocationSearch(props) {
    const {resetSearch} = props;
    const {schProcess} = useSelector((state) => state.search);

    return (
        <>
            {schProcess === 'result' ? (
                <>
                    {/* 위치 설정 검색 결과 */}
                    <LocationSearchResult resetSearch={resetSearch} />
                </>
            ) : schProcess === 'ing' ? (
                <>
                    {/* 위치 설정 검색 실시간 */}
                    <RealTimeSchList resetSearch={resetSearch} />
                </>
            ) : (
                <>
                    {/* 위치 설정 검색 안내 */}
                    <LocationSearchGuide />
                </>
            )}
        </>
    );
}

export default LocationSearch;
