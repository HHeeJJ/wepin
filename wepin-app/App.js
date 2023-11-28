import React, { useState, useRef, useEffect } from "react";
import { RESULTS } from "react-native-permissions";
import {
  View,
  ActionSheetIOS,
  Platform,
  SafeAreaView,
  Linking,
  BackHandler,
  Alert,
} from "react-native";
import { WebView } from "react-native-webview";
import ActionSheetModal from "./src/ActionSheetModal";
import permissions from "./src/gpsService/GpsPermisson";
import cameraPermissions from "./src/photoService/CameraPermission";
import ImagePermissions from "./src/photoService/ImagePermission";
import Geolocation from "react-native-geolocation-service";
import SplashScreen from "react-native-splash-screen";
import VersionNumber from "react-native-version-number";
import Toast from "react-native-toast-message";

function App() {
  let webview = useRef();
  const [uri, setUri] = useState("https://wepin.store");
  const [isModalVisible, setModalVisible] = useState(false);
  const [modelItemList, setMdelItemList] = useState([]);
  const [modalType, setModalType] = useState("");

  useEffect(() => {
    setTimeout(() => {
      SplashScreen.hide();
    }, 1500);

    const backAction = () => {
      webview.current.postMessage(
        JSON.stringify({
          type: "backBtnPressed",
          result: true,
        })
      );

      return true;
    };

    const backHandler = BackHandler.addEventListener(
      "hardwareBackPress",
      backAction
    );

    return () => backHandler.remove();
  }, []);

  const getCameraPermission = async () => {
    return await cameraPermissions
      .checkCameraPermission()
      .then(async (response) => {
        console.log("checkPhotoCameraPermission ok", response);
        if (response === RESULTS.DENIED) {
          return await cameraPermissions
            .requestCameraPermission()
            .then((response) => {
              console.log("requestPhotoCameraPermission ok", response);
              if (
                response === RESULTS.GRANTED ||
                response === RESULTS.LIMITED
              ) {
                return true;
              } else {
                return false;
              }
            })
            .catch((error) => {
              console.log("requestPhotoCameraPermission error", error);
            });
        } else if (
          response === RESULTS.GRANTED ||
          response === RESULTS.LIMITED
        ) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("requestCameraPermission error", error);
      });
  };

  const getPhotoPermission = async () => {
    return await ImagePermissions.checkImagePermission()
      .then(async (response) => {
        console.log("checkImagePermission ok", response);
        if (response === RESULTS.DENIED) {
          return await ImagePermissions.requestImagePermission()
            .then((response) => {
              console.log("requestImagePermission ok", response);
              if (
                response === RESULTS.GRANTED ||
                response === RESULTS.LIMITED
              ) {
                return true;
              } else {
                return false;
              }
            })
            .catch((error) => {
              console.log("requestImagePermission error", error);
            });
        } else if (
          response === RESULTS.GRANTED ||
          response === RESULTS.LIMITED
        ) {
          return true;
        } else {
          return false;
        }
      })
      .catch((error) => {
        console.log("requestImagePermission error", error);
      });
  };

  const getCameraPhotoPermission = async () => {
    const resultCameraPermission = await getCameraPermission();
    const resultPhotoPermission = await getPhotoPermission();

    console.log(
      "getCameraPermission, getPhotoPermission end",
      resultCameraPermission,
      resultPhotoPermission
    );

    if (resultCameraPermission && resultPhotoPermission) {
      console.log("권한이 허용되었습니다.");

      webview.current.postMessage(
        JSON.stringify({
          type: "checkPhotoCameraPermission",
          value: "GRANTED",
        })
      );
    } else {
      console.log("권한이 허용되지 않았습니다.");

      webview.current.postMessage(
        JSON.stringify({
          type: "checkPhotoCameraPermission",
          value: "BLOCKED",
        })
      );
    }
  };

  const closeModel = (type, selectedOption, selectedItem) => {
    console.log("closeModel", selectedOption, selectedItem);
    setModalVisible(false);

    if (type === "isRealDeleteFeed") {
      webview.current.postMessage(
        JSON.stringify({
          type: "isRealDeleteFeed",
          result: selectedOption,
        })
      );
    }
  };

  const openModel = (type, modelItemList, whareCalled = "") => {
    setModalVisible(true);
    setMdelItemList(modelItemList);
    setModalType(type);
  };

  const onShouldStartLoadWithRequest = (event) => {
    console.log(
      "onShouldStartLoadWithRequest",
      event.url,
      Linking.canOpenURL(event.url)
    );

    if (event.url.includes("intent") && Platform.OS === "android") {
      return false;
    }

    return true;
  };

  const onHandleMessage = (event) => {
    console.log("handleOnMessage", event.nativeEvent.data);
    const data = JSON.parse(event.nativeEvent.data);

    if (data.type === "isRealDeleteFeed") {
      if (Platform.OS === "ios") {
        ActionSheetIOS.showActionSheetWithOptions(
          {
            options: ["취소", "게시물 삭제"],
            cancelButtonIndex: 0,
            destructiveButtonIndex: 1,
          },
          (buttonIndex) => {
            webview.current.postMessage(
              JSON.stringify({ type: "isRealDeleteFeed", result: buttonIndex })
            );
          }
        );
      } else {
        openModel("isRealDeleteFeed", ["취소", "게시물 삭제"]);
      }
    } else if (data.type === "isRealDeleteComment") {
      // 0번: 댓글 삭제, 1번: 취소
      Alert.alert(
        "‘댓글 삭제’ 알림",
        "댓글 삭제 하면 작성한 내용이 \n삭제됩니다.",
        [
          {
            text: "삭제",
            onPress: () => {
              console.log("삭제");
              webview.current.postMessage(
                JSON.stringify({
                  type: "isRealDeleteComment",
                  result: 0,
                })
              );
            },
            style: "destructive",
          },
          {
            text: "유지하기",
            onPress: () => console.log("유지하기"),
            //style: 'cancel',
          },
        ],
        {
          cancelable: true,
          onDismiss: () => {},
        }
      );
    } else if (data.type === "gpsPermissonCheck") {
      permissions
        .checkLocationPermission()
        .then((response) => {
          console.log("checkLocationPermission ok", response);
          if (response === RESULTS.DENIED) {
            permissions
              .requestLocationPermission()
              .then((response) => {
                console.log("requestLocationPermission ok", response);
                if (response === RESULTS.GRANTED) {
                  Geolocation.getCurrentPosition(
                    (position) => {
                      console.log(
                        "Geolocation.getCurrentPosition ok",
                        position
                      );

                      webview.current.postMessage(
                        JSON.stringify({
                          type: "gpsPermissonCheck",
                          result: {
                            permissionResult: response,
                            lat: position.coords.latitude,
                            lng: position.coords.longitude,
                            whareCalled: data.whareCalled,
                          },
                        })
                      );
                    },
                    (error) => {
                      console.log("getCurrentPosition error", error);
                    },
                    {
                      enableHighAccuracy: true,
                      timeout: 15000,
                      maximumAge: 10000,
                    }
                  );
                } else {
                  webview.current.postMessage(
                    JSON.stringify({
                      type: "gpsPermissonCheck",
                      result: {
                        permissionResult: response,
                        lat: "37.566670",
                        lng: "126.978480",
                        whareCalled: data.whareCalled,
                      },
                    })
                  );
                }
              })
              .catch((error) => {
                console.log("requestLocationPermission error", error);
              });
          } else if (response === RESULTS.GRANTED) {
            Geolocation.getCurrentPosition(
              (position) => {
                console.log("Geolocation.getCurrentPosition ok", position);
                webview.current.postMessage(
                  JSON.stringify({
                    type: "gpsPermissonCheck",
                    result: {
                      permissionResult: response,
                      lat: position.coords.latitude,
                      lng: position.coords.longitude,
                      whareCalled: data.whareCalled,
                    },
                  })
                );
              },
              (error) => {
                console.log("getCurrentPosition error", error);
              },
              { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 }
            );
          } else {
            webview.current.postMessage(
              JSON.stringify({
                type: "gpsPermissonCheck",
                result: {
                  permissionResult: response,
                  lat: "37.566670",
                  lng: "126.978480",
                  whareCalled: data.whareCalled,
                },
              })
            );
          }
        })
        .catch((error) => {
          console.log("checkLocationPermission error", error);
        });
    } else if (data.type === "kakaoLoginAndroid") {
      login()
        .then((response) => {
          console.log("login ok", response);
          webview.current.postMessage(
            JSON.stringify({
              type: "kakaoLoginAndroid",
              result: response,
            })
          );
        })
        .catch((error) => {
          console.log("kakao-login error", error);
        });
    } else if (data.type === "exitApp") {
      BackHandler.exitApp();
    } else if (data.type === "isRealExitApp") {
      if (data.value === 2) {
        BackHandler.exitApp();
      }

      Toast.show({
        type: "success",
        text1: "앱을 종료하시려면 한번 더 클릭해주세요.",
      });
    } else if (data.type === "checkPhotoCameraPermission") {
      console.log("퍼미션 체크를 시작하겠다.");
      getCameraPhotoPermission();
    } else if (data.type === "isRealDeleteMember") {
      Alert.alert(
        "‘회원탈퇴’ 알림", // 첫번째 text: 타이틀 제목
        "회원탈퇴 시 작성한 게시물과 팔로우,\n팔로워가 전부 삭제됩니다.", // 두번째 text: 그 밑에 작은 제목
        [
          // 버튼 배열
          {
            text: "탈퇴하기", // 버튼 제목
            onPress: () => {
              console.log("탈퇴하기");
              webview.current.postMessage(
                JSON.stringify({
                  type: "isRealDeleteMember",
                  result: true,
                })
              );
            }, //onPress 이벤트시 콘솔창에 로그를 찍는다
            style: "destructive",
          },
          {
            text: "회원유지",
            onPress: () => console.log("회원유지"),
            //style: 'cancel',
          },
        ],
        {
          cancelable: true, // 안드로이드에서 Alert 박스 바깥 영역을 터치하거나 Back 버튼을 눌렀을 때 Alert가 닫히도록 설정할 수 있다
          onDismiss: () => {}, // Alert 닫힐 때 호출되는 함수
        }
      );
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <SafeAreaView style={{ flex: 1 }}>
        <WebView
          ref={(ref) => (webview.current = ref)}
          source={{ uri }}
          style={{ flex: 1 }}
          javaScriptEnabled={true}
          javaScriptCanOpenWindowsAutomatically={true}
          setSupportMultipleWindows={true}
          domStorageEnabled={true}
          originWhitelist={[
            "intent",
            "http",
            "https",
            "kakaolink",
            "kakaomap",
            "nmap",
            "tmap",
          ]}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          onMessage={onHandleMessage}
        />

        <ActionSheetModal
          isVisible={isModalVisible}
          closeModel={closeModel}
          itemList={modelItemList}
          type={modalType}
        />

        <Toast position="bottom" />
      </SafeAreaView>
    </View>
  );
}

export default App;
