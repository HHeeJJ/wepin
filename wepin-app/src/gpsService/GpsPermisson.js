import {Alert, Platform} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

// ios check
const checkLocationPermission = () => {
  return check(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  )
    .then(result => {
      if (result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '위치 서비스가 OFF상태입니다. 설정 > 개인정보 보호 및 보안 > 위치 서비스를 켜주세요.'
            : '위치 서비스가 OFF상태입니다. 위치 서비스를 켜주세요.',
        );
      } else if (result === RESULTS.DENIED) {
        // Alert.alert(
        //   '사용자가 위치 권한을 거부했지만, 나중에 허용할 수 있습니다.',
        // );
      } else if (result === RESULTS.LIMITED) {
        Alert.alert('권한이 부여되지만 제한이 있습니다.');
      } else if (result === RESULTS.GRANTED) {
        // Alert.alert('권한이 부여되었습니다.');
      } else if (result === RESULTS.BLOCKED) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '권한이 거부되었으며 현재 위치를 사용하려면 설정 > wepin > 위치 설정을 체크해주세요.'
            : '권한이 거부되었으며 현재 위치를 사용하려면 설정 > 애플리케이션 > wepin > 권한 > 위치 설정을 체크해주세요.',
        );
      }
      return result;
    })
    .catch(error => {
      console.log('checkLocationPermission fail', error);
    });
};

const requestLocationPermission = () => {
  return request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
      : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
  )
    .then(result => {
      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '권한이 거부되었으며 현재 위치를 사용하려면 설정 > wepin > 위치 설정을 체크해주세요.'
            : '권한이 거부되었으며 현재 위치를 사용하려면 설정 > 애플리케이션 > wepin > 권한 > 위치 설정을 체크해주세요.',
        );
      }
      return result;
    })
    .catch(error => {
      console.log('request ERMISSIONS.IOS.LOCATION_WHEN_IN_USE fail', error);
    });
};

export default {checkLocationPermission, requestLocationPermission};
