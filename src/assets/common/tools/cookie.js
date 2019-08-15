let Cookie = {}, result;
Cookie.getCookie = function (key) {
    let result = new RegExp('(?:^|; )' + encodeURIComponent(key) + '=([^;]*)').exec(document.cookie);
    return result ? decodeURIComponent(result[1]) : null;
}
/**
 * [setCookie]
 * @Author   gaoerjun
 * @DateTime 2016-12-27 14:43:03
 * @param    {[string]}            key              [键]
 * @param    {[string|number]}     value            [值]
 * @param    {[json]}              options          [参数]
 *           {[number]}            options.raw      [是否转码]
 *           {[number]}            options.expires  [保存天数]
 *           {[number]}            options.path     [路径]
 *           {[number]}            options.domain   [域]
 *           {[number]}            options.secure   []
 * @return   {[type]}                               [description]
 */
Cookie.setCookie = function (key, value, options) {
    let days, time

    // Enforce object
    options = Object.assign({}, options);

    if (value === null || value === undefined) options.expires = -1;
    if (typeof options.expires == "undefined") {
        options.expires = 180;  // 默认180天
    }
    if (typeof options.expires === 'number') {
        days = (options.expires * 24 * 60 * 60 * 1000);
        time = options.expires = new Date();

        time.setTime(time.getTime() + days);
    }

    value = String(value);
    return (document.cookie = [
        encodeURIComponent(key), '=',
        options.raw ? value : encodeURIComponent(value),
        options.expires ? '; expires=' + options.expires.toUTCString() : '',
        options.path ? '; path=' + options.path : '',
        options.domain ? '; domain=' + options.domain : '',
        options.secure ? '; secure' : ''
    ].join(''));
}
export default Cookie;



