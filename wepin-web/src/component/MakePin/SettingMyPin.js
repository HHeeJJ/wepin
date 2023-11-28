import React from 'react';
import {useSelector, useDispatch} from 'react-redux';
import PlaceList from '../List/PlaceList/PlaceList';
import {Button} from '@mui/material';
import {setMakePinStep} from '../../_store/makePin.slice';

function SettingMyPin(props) {
    const dispatch = useDispatch();
    const {pinList} = useSelector((state) => state.makePin);
    const {setIsSearchFocus} = props;

    const nextStep = () => {
        dispatch(setMakePinStep({current: 'makePinPreview', prev: 'makePinIndex'}));
    };

    return (
        <div className="section flex-jcsb">
            {/* 핀 목록 */}
            <PlaceList setIsSearchFocus={setIsSearchFocus} />

            <div className="fixedBottomBtnArea">
                <Button
                    variant="contained"
                    fullWidth={true}
                    size="large"
                    onClick={nextStep}
                    disabled={pinList.length < 1}
                >
                    다음
                </Button>
            </div>
        </div>
    );
}

export default SettingMyPin;
