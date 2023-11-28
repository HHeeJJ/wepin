import {localStorageUtil} from './LocalStorage';

export const appUtils = {
    /* 영문, 숫자, 마침표, 밑줄 */
    isValidUserName: (userName) => {
        return /^[A-Za-z0-9._]+$/.test(userName) || userName === '';
    },
    /* 대소문자 구분없이 동일한 문자열인지 체크 */
    isSameIgnoreCase: (prev, next) => {
        return prev.toLowerCase() === next.toLowerCase();
    },
    /**
     * yyyy-mm-dd
     * @param isoString
     */
    dateFormatTypeDash: (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
        const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
        const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);

        return `${ye}-${mo}-${da}`;
    },
    /**
     * yyyy년 mm월 dd일
     * @param isoString
     */
    nowDateToYYYYMMDD: (isoString) => {
        if (!isoString) return '';
        const d = new Date(isoString);
        const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(d);
        const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(d);
        const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(d);
        //const dd = new Intl.DateTimeFormat('ko-KR', {weekday: 'short'}).format(d);

        return `${ye}년 ${mo}월 ${da}일`;
    }
};

// 퍼미션 결과
export const RESULTS = Object.freeze({
    UNAVAILABLE: 'UNAVAILABLE',
    BLOCKED: 'BLOCKED',
    DENIED: 'DENIED',
    GRANTED: 'GRANTED',
    LIMITED: 'LIMITED'
});

// 카메라, 앨범/사진첩 퍼미션
export const getImagePermission = async () => {
    const webview = window.ReactNativeWebView;
    if (!webview) return;

    const permission = localStorageUtil.get('photoPermission');
    const camera = localStorageUtil.get('CAMERA');
    const photo = localStorageUtil.get('PHOTO');

    // 카메라 접근 권한 허용 여부 확인
    // if (!camera || camera !== RESULTS.GRANTED) {
    webview.postMessage(
        JSON.stringify({
            type: 'CAMERA'
        })
    );
    // }

    // 앨범/사진첩 접근 권한 허용 여부 확인
    // if (!photo || photo !== RESULTS.GRANTED) {
    webview.postMessage(
        JSON.stringify({
            type: 'PHOTO'
        })
    );
    // }

    // 카메라, 앨범/사진첩 접근 권한이 허용여부 로컬스토리지에 담기
    if (camera && photo) {
        if (camera === RESULTS.GRANTED && photo === RESULTS.GRANTED) {
            localStorageUtil.set('photoPermission', true);
        } else {
            localStorageUtil.set('photoPermission', false);
        }
    } else {
        localStorageUtil.set('photoPermission', false);
    }
};
