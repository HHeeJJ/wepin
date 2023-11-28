import React, {useEffect, useState} from 'react';
import PreviewMap from '../Map/PreviewMap';
import {useSelector, useDispatch} from 'react-redux';
import {Button, Drawer, FormControl, InputLabel, TextField, TextareaAutosize} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import DriveFileRenameOutlineIcon from '@mui/icons-material/DriveFileRenameOutline';
import LoginOutlinedIcon from '@mui/icons-material/LoginOutlined';
import {setMakePinStep, setPinInfo, resetMakePin} from '../../_store/makePin.slice';
import {resetSch} from '../../_store/search.slice';
import MakePinHeader from './MakePinHeader';
import axioswrapper from '../../utils/Axios';
import {history} from '../../_helpers/history';
import {localStorageUtil} from '../../utils/LocalStorage';
import {setMainFeedList, setUserFeedList} from '../../_store/feed.slice';

function PreviewMyPin(props) {
    const {makePinClose} = props;

    const dispatch = useDispatch();
    const {pinList, pinInfo} = useSelector((state) => state.makePin);

    const [loading, setLoading] = useState(false);
    const [activeButton, setActiveButton] = useState(false);

    const [myPinTitleValue, setMyPinTitleValue] = useState(pinInfo.title ? pinInfo.title : '');
    const [myPinDetailValue, setMyPinDetailValue] = useState(pinInfo.desc ? pinInfo.desc : '');

    const memberId = localStorageUtil.get('memberId');

    // 핀 제목 작성 핸들러
    const handleNameChange = (e) => {
        const value = e.target.value;
        setMyPinTitleValue(value);
    };

    // 핀 내용 작성 핸들러
    const handleDetailChange = (e) => {
        const value = e.target.value;
        setMyPinDetailValue(value);
    };

    // 수정하기 버튼 클릭 이벤트
    const handleModifyPinList = () => {
        dispatch(setMakePinStep({current: 'makePinIndex', prev: 'makePinPreview'}));

        // 수정하기 클릭시 핀 제목, 내용 리덕스에 저장
        dispatch(setPinInfo({desc: myPinDetailValue, title: myPinTitleValue}));
    };

    // 핀만들기 취소(닫기)
    const handleCloseMakePin = () => {
        makePinClose();

        setTimeout(() => {
            dispatch(resetSch());
            dispatch(resetMakePin());
        }, 300);
    };

    // 스크롤 최상단으로 이동
    const scrollToTopOfDiv = () => {
        const divToScroll = document.querySelector('.contentsArea');
        if (divToScroll) {
            divToScroll.scrollTop = 0;
        }
    };

    // 피드 리스트 업데이트
    const updateFeedList = () => {
        if (history.location.pathname === '/') {
            //현재 페이지가 메인일 때
            axioswrapper
                .Axios('GET', `feed/list?memberId=${memberId}`)
                .then((response) => {
                    // console.log('메인 피드 목록 업로드 조회 성공', response.data.data);
                    dispatch(setMainFeedList(response.data.data.lists));

                    // 스크롤 최상단으로 이동
                    scrollToTopOfDiv();
                })
                .catch((error) => {
                    console.log('메인 피드 목록 업로드 실패', error);
                });
        } else if (history.location.pathname === `/feed/index/${memberId}`) {
            // 현재 페이지가 내 피드일 때
            axioswrapper
                .Axios('GET', `member/user-main?memberId=${memberId}&myId=${memberId}`)
                .then((response) => {
                    // console.log('유저 메인 피드 조회 성공', response.data);
                    dispatch(setUserFeedList(response.data.data));

                    // 스크롤 최상단으로 이동
                    scrollToTopOfDiv();
                })
                .catch((error) => {
                    console.log('유저 메인 피드 조회 실패', error);
                });
        } else {
            history.navigate('/');
        }
    };

    // 핀 게시하기 (게시물 등록)
    const submitMakePin = () => {
        setLoading(true);

        const payload = {
            desc: myPinDetailValue,
            img: pinInfo.img,
            memberId: localStorageUtil.get('memberId'),
            pinList: pinList,
            title: myPinTitleValue
        };

        axioswrapper
            .Axios('POST', 'feed/create', payload)
            .then((response) => {
                console.log('feed/create ok', response);
                handleCloseMakePin();
                updateFeedList();
                setLoading(false);
            })
            .catch((error) => {
                console.log('feed/create error', error);
                setLoading(false);
            });
    };

    useEffect(() => {
        // 핀-게시하기 버튼 활성화 여부
        if (myPinTitleValue && myPinDetailValue) {
            setActiveButton(true);
        } else {
            setActiveButton(false);
        }
    }, [myPinTitleValue, myPinDetailValue]);

    return (
        <>
            {/* 헤더 */}
            <MakePinHeader makePinClose={makePinClose} handleClickBackEvent={handleModifyPinList} />

            {/* 핀 미리보기 */}
            <div className="previewMyPinArea">
                <div className="mapArea">
                    <PreviewMap />
                    <Button
                        component="label"
                        variant="contained"
                        startIcon={<DriveFileRenameOutlineIcon />}
                        color="medGray"
                        className="btnMyPinModify"
                        onClick={handleModifyPinList}
                    >
                        수정하기
                    </Button>
                </div>

                <div className="section">
                    <div className="formArea">
                        <FormControl>
                            <InputLabel shrink>핀 제목</InputLabel>
                            <TextField
                                size="small"
                                value={myPinTitleValue}
                                onChange={handleNameChange}
                                placeholder="핀 제목 작성"
                            />
                        </FormControl>
                        <FormControl>
                            <InputLabel>자세한 내용</InputLabel>
                            <TextareaAutosize
                                minRows={5}
                                maxRows={5}
                                value={myPinDetailValue}
                                onChange={handleDetailChange}
                                placeholder={
                                    '게시하려는 핀-의 내용을 작성해 주세요\n\n욕설 및 불쾌한 내용을 작성할 경우 신고와 이용이 제한 될 수 있어요'
                                }
                            />
                        </FormControl>
                    </div>

                    <div className="fixedBottomBtnArea">
                        <LoadingButton
                            variant="contained"
                            fullWidth={true}
                            size="large"
                            loading={loading} // 로딩중 유무
                            loadingPosition="start"
                            startIcon={<LoginOutlinedIcon />}
                            disabled={!activeButton}
                            onClick={submitMakePin}
                        >
                            핀-게시하기
                        </LoadingButton>
                    </div>
                </div>
            </div>

            {loading && <div className="preventPageClickArea"></div>}
        </>
    );
}

export default PreviewMyPin;
