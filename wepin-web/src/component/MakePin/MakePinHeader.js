import React, {useState, useEffect} from 'react';
import {useSelector, useDispatch} from 'react-redux';
import IconButton from '../Button/IconButton/IconButton';
import {setMakePinStep, resetMakePin} from '../../_store/makePin.slice';
import {resetSch} from '../../_store/search.slice';

function MakePinHeader(props) {
    const {makePinClose, handleClickBackEvent} = props;

    const dispatch = useDispatch();
    const {makePinStep} = useSelector((state) => state.makePin);

    const [headerBackBtn, setHeaderBackBtn] = useState(false);

    // 뒤로가기 버튼 클릭 이벤트
    const handlePrevStep = () => {
        if (makePinStep.current === 'makePInSearch') {
            dispatch(setMakePinStep({current: 'makePinIndex', prev: 'makePInSearch'}));
        } else if (makePinStep.current === 'makePinPreview') {
            handleClickBackEvent();
        }
    };

    // 핀만들기 취소(닫기)
    const handleCloseMakePin = () => {
        makePinClose();

        setTimeout(() => {
            dispatch(resetSch());
            dispatch(resetMakePin());
        }, 300);
    };

    useEffect(() => {
        if (makePinStep.current === 'makePInSearch' || makePinStep.current === 'makePinPreview') {
            setHeaderBackBtn(true);
        } else {
            setHeaderBackBtn(false);
        }
    }, [makePinStep]);

    return (
        <>
            {/* 상단 타이틀 영역 */}
            <div className="modalTitleArea">
                <div className="titleWrap">
                    {headerBackBtn && (
                        <IconButton
                            name="back"
                            width="24"
                            height="24"
                            onClick={handlePrevStep}
                            className="btnBack"
                        />
                    )}

                    <h2 className="title">내 핀 만들기</h2>
                    <IconButton
                        name="close_b"
                        width="24"
                        height="24"
                        onClick={handleCloseMakePin}
                        className="btnClose"
                    />
                </div>
            </div>
        </>
    );
}

export default MakePinHeader;
