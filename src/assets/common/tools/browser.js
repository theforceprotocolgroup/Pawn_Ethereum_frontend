/**
 * 环境检测
 * 
 */
const IOS_REG=/os/i;
const IPHONE=/iphone/i;
const IPAD=/ipad/i;
const ANDROID_REG=/android/i;
const ANDROID_MOBILE=/android.*?mobile/i;
const OPENCOURSE_APP_REG=/(OpenCourse|vopen)/i;
var userAgent=navigator.userAgent;
var isIOS=function(){
    return IOS_REG.test(userAgent);
};
var isAndroid=function(){
    return ANDROID_REG.test(userAgent);
};
var isSafari=function(){
    return /Safari/i.test(userAgent);
};
var isAndroidMobile=function(){
    return ANDROID_MOBILE.test(userAgent);
};
var isAndroidPad=function(){
    return isAndroid() && !isAndroidMobile();
};
var isOpenApp=function(){
    return OPENCOURSE_APP_REG.test(userAgent);
};
var isMobile=function(){
    return isAndroid() || isIOS();
};
var isIPhone=function(){
    return IPHONE.test(userAgent);
};
var isIPad=function(){
    return IPAD.test(userAgent);
};
var isQQBrowser=function(){
    return userAgent.indexOf('mqqbrowser')>-1;
};
var isWechat=function(){
    return /MicroMessenger/i.test(userAgent);
};
var isWeibo=function(){
    return userAgent.indexOf('weibo')>-1;
};
var getAndroidVersion=function(){
    if(isAndroid()){
        let matched=userAgent.match(/Android (\d+).(\d+)/i);
        if(matched && matched[1]){
            return matched[1];
        }
    }
    return -1;
};
var getIOSVersion=function(){
    if(isIOS()){
        let matched=userAgent.match(/os (\d+)_(\d)+/i);
        if(matched && matched[1]){
            return matched[1];
        }
    }
    return -1;
};
var isYixin=function(){
    return /YiXin/i.test(userAgent);
};
var isQQ=function(){
    return /QQ\//i.test(userAgent);
};
var getYiXinVersion=function(){
    let isYiXin=navigator.userAgent.match(/YiXin\/(\d{4})/i);
    let yixinVersion=(isYiXin && isYiXin[1]) || 0;
    return yixinVersion;
};
module.exports={
    isIOS,
    isOpenApp,
    isAndroidMobile,
    isAndroidPad,
    isIPhone,
    isIPad,
    isMobile,
    isAndroid,
    isWeibo,
    isSafari,
    isYixin,
    isQQ,
    getIOSVersion,
    getYiXinVersion,
    isQQBrowser,
    isWechat
};