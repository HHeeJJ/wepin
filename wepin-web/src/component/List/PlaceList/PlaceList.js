import React, { useEffect, useRef, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import styles from "./PlaceList.module.scss";
import { Button } from "@mui/material";
import {
  setUpdatePinList,
  setChangeMainPin,
  setModifyPin,
  setMakePinStep,
} from "../../../_store/makePin.slice";
import Icon from "../../Icon/Icon";

function PlaceList(props) {
  const { setIsSearchFocus } = props;
  const [btnAddPinDisabled, setBtnAddPinDisabled] = useState(false);

  const dispatch = useDispatch();
  const { pinList } = useSelector((state) => state.makePin);

  const listScrollRef = useRef(null);

  // 대표 변경
  const handleChangeIsMain = (index) => {
    dispatch(setChangeMainPin({ index }));
  };

  // 삭제
  const deletePinList = (indexToDelete) => {
    if (pinList[indexToDelete].isMain === true) {
      window.alert("대표 장소는 삭제할 수 없습니다.");
    } else {
      const updatePinList = pinList.filter(
        (_, index) => index !== indexToDelete
      );
      dispatch(setUpdatePinList(updatePinList));
    }
  };

  // 수정
  const modifyPin = (index) => {
    const item = pinList[index];
    dispatch(setModifyPin(index));
  };

  const onClickAddMyPin = () => {
    setIsSearchFocus(true);
  };

  // 리스트가 업데이트될 때마다 스크롤을 맨 아래로 이동하는 함수
  const scrollToBottom = () => {
    listScrollRef.current.scrollTop = listScrollRef.current.scrollHeight;
  };

  useEffect(() => {
    scrollToBottom();

    // 핀 최대 갯수 30개 이상이면 핀 추가 목록 버튼 숨김처리
    if (pinList?.length >= 30) {
      setBtnAddPinDisabled(true);
    } else {
      setBtnAddPinDisabled(false);
    }
  }, [pinList]);

  return (
    <div className={styles.placeListWrap} ref={listScrollRef}>
      {pinList?.length > 0 && (
        <ol>
          {pinList.map((list, index) => (
            <li key={index}>
              <div className={styles.listNumber}>{index + 1}</div>
              <div>
                <div className={styles.addrInfo}>
                  <p className={styles.roadAddr}>
                    {list.name}
                    {list.isMain && <b className={styles.repIcon}>대표</b>}
                  </p>
                  <span className={styles.lotAddr}>
                    {list.addr + " " + list.addrDetail}
                  </span>
                </div>
                <div className={styles.btnArea}>
                  {!list.isMain && (
                    <Button
                      variant="outlined"
                      size="small"
                      className="roundBtn"
                      onClick={() => handleChangeIsMain(index)}
                    >
                      대표선택
                    </Button>
                  )}
                  <Button
                    color="lightGreyLightText"
                    size="small"
                    className="roundBtn"
                    onClick={() => modifyPin(index)}
                  >
                    수정
                  </Button>
                  <Button
                    color="lightGreyLightText"
                    size="small"
                    className="roundBtn"
                    onClick={() => deletePinList(index)}
                  >
                    삭제
                  </Button>
                </div>
              </div>
            </li>
          ))}
        </ol>
      )}

      {btnAddPinDisabled === false && (
        <button
          type="button"
          className={`btnAddPinList ${pinList?.length > 0 ? "c_gray" : ""}`}
          onClick={onClickAddMyPin}
        >
          <p>
            <strong>핀 목록 추가</strong>
            <span>
              위치를 설정하여 나만의 핀 목록을 만들어 보세요. (최대 30개)
            </span>
          </p>
        </button>
      )}
    </div>
  );
}

export default PlaceList;
