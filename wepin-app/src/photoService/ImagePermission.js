import {Alert, Platform, Linking} from 'react-native';
import {check, PERMISSIONS, RESULTS, request} from 'react-native-permissions';

const checkImagePermission = () => {
  return check(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : getPermissionFromSpecificAPIVersion(),
  )
    .then(result => {
      if (result === RESULTS.UNAVAILABLE) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '사진에 접근할 수 없습니다. 설정 > 개인정보 보호 및 보안 > 사진 > wepin을 허용해주세요.'
            : '사진에 접근할 수 없습니다. 사진 설정을 켜주세요.',
        );
      } else if (result === RESULTS.DENIED) {
        // Alert.alert(
        //   '사용자가 사진에 접근을 거부했지만, 나중에 허용할 수 있습니다.',
        // );
      } else if (result === RESULTS.LIMITED) {
        // Alert.alert('권한이 부여되지만 제한이 있습니다.');
      } else if (result === RESULTS.GRANTED) {
        // Alert.alert('권한이 부여되었습니다.');
      } else if (result === RESULTS.BLOCKED) {
        // Linking.openSettings();
        Alert.alert(
          Platform.OS === 'ios'
            ? '사진 접근이 거부되었습니다. 해당 기능을 사용하시려면 설정 > wepin > 사진 접근을 허용해주세요.'
            : '앨범 접근이 거부되었습니다. 해당 기능을 사용하시려면 앨범 설정을 켜주세요.',
        );
      }
      return result;
    })
    .catch(error => {
      console.log('checkImagePermission fail', error);
    });
};

const requestImagePermission = () => {
  return request(
    Platform.OS === 'ios'
      ? PERMISSIONS.IOS.PHOTO_LIBRARY
      : getPermissionFromSpecificAPIVersion(),
  )
    .then(result => {
      if (result === RESULTS.BLOCKED) {
        Alert.alert(
          Platform.OS === 'ios'
            ? '사진 접근이 거부되었습니다. 해당 기능을 사용하시려면 설정 > wepin > 사진 접근을 허용해주세요.'
            : '앨범 접근이 거부되었습니다. 해당 기능을 사용하시려면 앨범 설정을 켜주세요.',
        );
      }
      return result;
    })
    .catch(error => {
      console.log(
        'request PERMISSIONS.PHOTO_LIBRARY.READ_MEDIA_IMAGES fail',
        error,
      );
    });
};

// android api check
const getPermissionFromSpecificAPIVersion = () => {
  if (Platform.Version >= 33) {
    return PERMISSIONS.ANDROID.READ_MEDIA_IMAGES;
  } else {
    return PERMISSIONS.ANDROID.READ_EXTERNAL_STORAGE;
  }
};

export default {checkImagePermission, requestImagePermission};
