import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { history } from "./_helpers/history";
import AppRoutes from "./AppRoutes";
import "./App.global.scss";
import store from "./_store/store";
import { useDispatch } from "react-redux";
import { setReplyList } from "./_store/reply.slice";
import { setLocDrawerOpen } from "./_store/makePin.slice";
import { setIsLogined, setIsLoginLoading } from "./_store/auth.slice";
import axioswrapper from "./utils/Axios";
import { localStorageUtil } from "./utils/LocalStorage";
import getUserAgent from "./utils/UserAgent";
import { setMainFeedList } from "./_store/feed.slice";
import { setBackpressedCount, resetBackpressedCount } from "./_store/etc.slice";
import { setPhotoCameraPermission } from "./_store/permission.slice";
import { openImgLoadWindowModifyProfile } from "./pages/MyPage/ModifyProfile";
import { openImgLoadWindowUploadImg } from "./components/Input/UploadImg/UploadImg";
import { setCenter } from "./components/Map/SwipeMap/SwipeMap";

function App() {
  history.navigate = useNavigate();
  history.location = useLocation();
  const dispatch = useDispatch();

  useEffect(() => {
    window.addEventListener("message", (event) => {
      getMessage(event);
    });

    document.addEventListener("message", (event) => {
      getMessage(event);
    });
  }, []);

  const getMessage = (event) => {
    const myState = store.getState();

    if (typeof event.data === "object") {
      return;
    }

    let data;

    try {
      data = JSON.parse(event.data);
    } catch (error) {
      return;
    }

    if (data.type === "isRealDeleteFeed") {
      const memberId = localStorageUtil.get("memberId");
      const feedData = myState.feed;

      // 0번: 취소, 1번: 게시물 삭제
      if (data.result === 1) {
        const payload = {
          feedId: feedData.tobeDeleteFeedItem.id,
        };

        axioswrapper
          .Axios("POST", "feed/delete", payload)
          .then((response) => {
            console.log("피드 삭제 성공!");

            // 피드 삭제 후 페이지 이동, 데이터 업데이트
            if (history.location.pathname === "/") {
              // 메인(홈) 피드 리스트일 때
              axioswrapper
                .Axios("GET", `feed/list?memberId=${memberId}`)
                .then((response) => {
                  dispatch(setMainFeedList(response.data.data.lists));
                })
                .catch((error) => {
                  console.log("메인 피드 목록 조회 실패", error);
                });
            } else if (history.location.pathname.includes("/feed/detail/")) {
              // 피드 상세일 때
              history.navigate(-1);
            }
          })
          .catch((error) => {
            console.log("피드 삭제 에러", error);
          });
      }
    } else if (data.type === "isRealDeleteComment") {
      const replyData = myState.reply;
      // 0번: 댓글 삭제, 1번: 취소
      if (data.result === 0) {
        const payload = {
          replyId: replyData.tobeDeleteReplyItem.replyId,
        };

        axioswrapper
          .Axios("POST", "reply/delete", payload)
          .then((response) => {
            const newCommentList = replyData.replyList.filter(
              (listItem) => listItem !== replyData.tobeDeleteReplyItem
            );

            dispatch(setReplyList(newCommentList));
          })
          .catch((error) => {
            console.log("reply/delete error", error);
          });
      }
    } else if (data.type === "gpsPermissonCheck") {
      // 위도 경도 정보가 없으면 default 서울시청
      const locationInfo = {
        open: true,
        lat: data.result.lat,
        lng: data.result.lng,
      };
      dispatch(setLocDrawerOpen(locationInfo));

      if (data.result.whareCalled === "swpieMap") {
        setCenter(data.result.lat, data.result.lng);
      }
    } else if (data.type === "kakaoLoginAndroid") {
      const payload = {
        authorizationCode: data.result.accessToken,
        userAgent: getUserAgent(),
      };

      dispatch(setIsLoginLoading(true));
      axioswrapper
        .Axios("POST", `auth/kakao-login`, payload)
        .then((response) => {
          localStorageUtil.set("loginType", "kakao");
          localStorageUtil.set("loginAuth", response.data.data.memberDto.auth);

          dispatch(setIsLogined(response.data.data.isLogined));
          dispatch(setIsLoginLoading(false));

          if (response.data.data.memberDto.isLogined) {
            history.navigate(`/`);
          } else {
            history.navigate(`/join`);
          }
        })
        .catch((error) => {
          console.log("error", error);

          localStorageUtil.set("loginType", "");
          localStorageUtil.set("loginAuth", "");

          dispatch(setIsLogined(false));
          dispatch(setIsLoginLoading(false));
        })
        .finally(() => {
          dispatch(setIsLoginLoading(false));
        });
    } else if (data.type === "backBtnPressed") {
      if (getUserAgent() === "android" && history.location.pathname === "/") {
        dispatch(setBackpressedCount(myState.etc.backpressedCount + 1));

        if (myState.etc.backpressedCount === 2) {
          dispatch(setBackpressedCount(0));
          window.ReactNativeWebView?.postMessage(
            JSON.stringify({ type: "exitApp" })
          );
        } else {
          // 뒤로가기를 누르면 앱이 종료할 것인지 물어봐야 함 3초카운트 시작
          // 3초내에 아무 동작하지않으면 종료안한것
          // back버튼을 한번더 눌러서 count == 2값이 되면 앱 종료
          setTimeout(() => {
            dispatch(resetBackpressedCount());
          }, 3000);

          window.ReactNativeWebView?.postMessage(
            JSON.stringify({
              type: "isRealExitApp",
              value: myState.etc.backpressedCount + 1,
            })
          );
        }
      } else {
        window.history.back();
      }
    } else if (data.type === "checkPhotoCameraPermission") {
      const value = JSON.parse(event?.data).value;
      dispatch(setPhotoCameraPermission(value));

      if (value === "GRANTED") {
        if (myState.permission.whereCallFrom === "ModifyProfile") {
          openImgLoadWindowModifyProfile();
        } else if (myState.permission.whereCallFrom === "UploadImg") {
          openImgLoadWindowUploadImg();
        }
      }
    }
  };

  return (
    <>
      <AppRoutes />
    </>
  );
}

export default App;
