import axios from "axios";
import { localStorageUtil } from "../utils/LocalStorage";
import { tokenValidate } from "../utils/TokenValidate";
import { history } from "../_helpers/history";

// 사용방법
// request : 'GET', 'POST', 'PUT', 'DELETE'
// url : (ex. auth/kakao-login) REACT_APP_WEB_URL은 생략
// payload :
// ex. {
//    name: 'jinkyeong',
//    code: 'abcde',
//    ...
// }
function Axios(request, url, payload = "") {
  const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

  if (
    localStorageUtil.get("expireAt") &&
    tokenValidate.validate(localStorageUtil.get("expireAt"))
  ) {
    return reIssueToken(axiosInstance).then((response) => {
      if (response.data.code === "I999") {
        console.log("refreshToken expiration!!");
        localStorageUtil.allClear();
        history.navigate("/login");
      }

      setLocalStorage(response);

      return axiosInstance.request({
        method: request,
        url: `${process.env.REACT_APP_API_URL}/${url}`,
        data: JSON.stringify(payload),
        headers: {
          Authorization: "Bearer " + localStorageUtil.get("accessToken"),
        },
      });
    });
  } else {
    return axiosInstance.request({
      method: request,
      url: `${process.env.REACT_APP_API_URL}/${url}`,
      data: JSON.stringify(payload),
      headers: {
        Authorization: "Bearer " + localStorageUtil.get("accessToken"),
      },
    });
  }
}

function reIssueToken() {
  const axiosInstance = axios.create({
    headers: {
      "Content-Type": "application/json",
    },
  });

  return axiosInstance.request({
    method: "POST",
    url: `${process.env.REACT_APP_API_URL}` + "/auth/token-re-issue",
    data: JSON.stringify({
      refreshToken: localStorageUtil.get("refreshToken"),
    }),
  });
}

function setLocalStorage(response) {
  if (response.data.data.expiresIn) {
    const date = new Date();
    date.setTime(date.getTime() + response.data.data.expiresIn * 1000);
    localStorageUtil.set("expireAt", date);
  }

  localStorageUtil.set("accessToken", response.data.data.accessToken);
  localStorageUtil.set("refreshToken", response.data.data.refreshToken);
}

export default { Axios };
