import React from 'react';
import {useSelector} from 'react-redux';
import {Drawer} from '@mui/material';
import './MakePin.scss';
import MakeMyPin from '../../components/MakePin/MakeMyPin';
import PreviewMyPin from '../../components/MakePin/PreviewMyPin';

function MakePin(props) {
    const {makePinOpen, makePinClose} = props;

    const {makePinStep} = useSelector((state) => state.makePin);

    return (
        <>
            {/* 내 핀 만들기 */}
            <Drawer anchor="right" open={makePinOpen} id="makePinContents">
                <div className="contentsWrap">
                    {makePinStep.current !== 'makePinPreview' ? (
                        <>
                            {/* 핀 추가 */}
                            <MakeMyPin makePinClose={makePinClose} />
                        </>
                    ) : (
                        <>
                            {/* 핀-미리보기 */}
                            <PreviewMyPin makePinClose={makePinClose} />
                        </>
                    )}
                </div>
            </Drawer>
        </>
    );
}

export default MakePin;
