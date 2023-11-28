import React, { useState } from "react";
import { FormControl, InputLabel, TextField } from "@mui/material";
import styles from "./Join.module.scss";
import { LoadingButton } from "@mui/lab";
import LoginOutlinedIcon from "@mui/icons-material/LoginOutlined";
import { appUtils } from "../../utils/AppUtils";
import axioswrapper from "../../utils/Axios";
import { localStorageUtil } from "../../utils/LocalStorage";
import makeName from "../../utils/MakeName";

function Join() {
  const [inputValue, setInputValue] = useState("");
  const [activeButton, setActiveButton] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isUserNameValid, setIsUserNameValid] = useState(false);
  const [inputValueHyperText, setInputValueHyperText] = useState(
    "영문, 숫자, 밑줄 및 마침표를 포함한 6자 이상 입력"
  );

  function submitLogin() {
    setLoading(true);

    if (appUtils.isValidUserName(inputValue)) {
      setIsUserNameValid(false);
    } else {
      setInputValueHyperText(
        "영문, 숫자, 밑줄 및 마침표를 포함한 6자 이상 입력"
      );
      setIsUserNameValid(true);
      setLoading(false);
      return;
    }

    axioswrapper
      .Axios("GET", `auth/nickname-check?nickname=${inputValue}`)
      .then((response) => {
        // 이미 존재하는 아이디인지 체크
        if (response.data.data.isExist) {
          setIsUserNameValid(true);
          setInputValueHyperText("동일한 계정이 존재합니다.");
        } else {
          const loginType = localStorageUtil.get("loginType");
          if (loginType === "kakao") {
            kakaoSignUp();
          } else if (loginType === "apple") {
            appleSignUp();
          }
        }
        setLoading(false);
      })
      .catch((error) => {
        console.log("nickname check error", error);
        setLoading(false);
      });
  }

  const kakaoSignUp = () => {
    const payload = {
      email: localStorageUtil.get("email"),
      name: localStorageUtil.get("userName"),
    };
    axioswrapper
      .Axios("POST", "auth/kakao-sign-up", payload)
      .then((response) => {
        localStorageUtil.set("loginType", "kakao");
        localStorageUtil.set("loginAuth", response.data.data.memberDto.auth);

        history.navigate("/");
      })
      .catch((error) => {
        console.log("kakao sign up error", error);
      });
  };

  const appleSignUp = () => {
    const payload = {
      email: localStorageUtil.get("email"),
      appleToken: localStorageUtil.get("appleToken"),
      name: makeName(),
    };

    axioswrapper
      .Axios("POST", "auth/apple-sign-up", payload)
      .then((response) => {
        localStorageUtil.set("loginAuth", response.data.data.memberDto.auth);
        history.navigate("/");
      })
      .catch((error) => {
        console.log("apple sign up error", error);
      });
  };

  const handleChange = (event) => {
    const inputValue = event.target.value;
    setInputValue(inputValue);

    if (inputValue.length >= 6) {
      setActiveButton(true);
    } else {
      setActiveButton(false);
    }
  };

  return (
    <div id={styles.join}>
      <div className={styles.joinWrap}>
        <form>
          <FormControl className={styles.fieldWrap}>
            <InputLabel shrink>계정 입력</InputLabel>
            <TextField
              placeholder="개인 피드의 사용할 계정 입력"
              value={inputValue}
              onChange={handleChange}
              helperText={inputValueHyperText}
              error={isUserNameValid} // 유효성검사 통과 여부
            />
          </FormControl>
          <div className={styles.bottomBtnArea}>
            <LoadingButton
              variant="contained"
              fullWidth={true}
              size="large"
              loading={loading} // 로딩중 유무
              loadingPosition="start"
              startIcon={<LoginOutlinedIcon />}
              onClick={submitLogin}
              disabled={!activeButton}
            >
              입력하고 핀-하러가기
            </LoadingButton>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Join;
