import {Alert, Platform, Linking} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

// ios check
const checkCameraPermission = () => {
  return check(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  )
    .then(result => {
      if (result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '카메라에 접근할 수 없습니다. 설정 > 개인정보 보호 및 보안 > 카메라 > wepin을 허용해주세요.'
            : '카메라에 접근할 수 없습니다. 카메라 설정을 켜주세요.',
        );
      } else if (result === RESULTS.DENIED) {
        // Alert.alert(
        //   '사용자가 카메라에 접근을 거부했지만, 나중에 허용할 수 있습니다.',
        // );
      } else if (result === RESULTS.LIMITED) {
        // Alert.alert('권한이 부여되지만 제한이 있습니다.');
      } else if (result === RESULTS.GRANTED) {
        // Alert.alert('권한이 부여되었습니다.');
      } else if (result === RESULTS.BLOCKED) {
        // Linking.openSettings();
        Alert.alert(
          Platform.OS === 'ios'
            ? '카메라에 접근이 거부되었습니다. 해당 기능을 사용하시려면 설정 > wepin > 카메라를 허용해주세요.'
            : '카메라에 접근이 거부되었습니다. 해당 기능을 사용하시려면 카메라 설정을 켜주세요.',
        );
      }
      return result;
    })
    .catch(error => {
      console.log('checkCameraPermission fail', error);
    });
};

const requestCameraPermission = () => {
  return request(
    Platform.OS === 'ios' ? PERMISSIONS.IOS.CAMERA : PERMISSIONS.ANDROID.CAMERA,
  )
    .then(result => {
      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '카메라에 접근이 거부되었습니다. 해당 기능을 사용하시려면 설정 > wepin > 카메라를 허용해주세요.'
            : '카메라에 접근이 거부되었습니다. 해당 기능을 사용하시려면 카메라 설정을 켜주세요.',
        );
      }
      return result;
    })
    .catch(error => {
      console.log('request PERMISSIONS.CAMERA fail', error);
    });
};

export default {checkCameraPermission, requestCameraPermission};
