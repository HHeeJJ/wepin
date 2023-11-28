function getUserAgent() {
    const ua = navigator.userAgent.toLowerCase();
    let device = '';

    if (ua.indexOf('android') > -1) {
        device = 'android';
    } else if (ua.indexOf('iphone') > -1 || ua.indexOf('ipad') > -1 || ua.indexOf('ipod') > -1) {
        device = 'ios';
    } else if (ua.indexOf('chrome') > -1 || ua.indexOf('safari') > -1) {
        device = 'web';
    }

    return device;
}

export default getUserAgent;
