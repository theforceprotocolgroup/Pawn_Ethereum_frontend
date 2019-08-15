/* eslint-disable no-alert */
import Browser from './browser'

const parseQuery = function (decode = true) {
    var query = window.location.search;
    query = query.substring(1);
    let queryObj = {};
    if (query) {
        let queryList = query.split('&');
        if (queryList.length) {
            queryList.forEach(function (param) {
                let tmp = param.split("=");
                tmp[1] = tmp[1] ? tmp[1] : '';
                queryObj[tmp[0]] = decode ? decodeURIComponent(tmp[1]) : tmp[1];
            });
        }
    }
    return queryObj;
};

const makeQueryStr = function (param, encode = true) {
    let queryStr = "";
    Object.keys(param).forEach(function (key) {
        let value = typeof param[key] === 'undefined' || param[key] === null ? '' : param[key];
        queryStr += (value !== null && value !== undefined) ? ((queryStr.length == 0 ? "?" : "&") + key + '=' + (encode ? encodeURIComponent(value) : value)) : '';
    });
    return queryStr;
};

const initFontSize = function (maxWidth = 750) {
    let _viewportWidth
    let lock = false
    let _htmlNode = document.getElementsByTagName('html')[0]
    let _scrollWidth = window.innerWidth || screen.availWidth || document.documentElement.scrollWidth
    let _scrollHeight = (screen.height > 0) ? (window.innerHeight >= screen.height || window.innerHeight == 0) ? screen.height : window.innerHeight : window.innerHeight

    _viewportWidth = _scrollHeight > _scrollWidth ? _scrollWidth : _scrollHeight
    _htmlNode.style.fontSize = '100px';
    if (_viewportWidth < 150 || _viewportWidth > 640) {
        setTimeout(function () {
            !lock && initFontSize()
            lock = true
        }, 200)
    } else {
        _htmlNode.style.fontSize = _viewportWidth / maxWidth * 100 + 'px'
    }
}

const parseUrl = function () {
    if (!url) {
        url = window.location.href;
    }

    let temp = url.split('#');

    temp[0] = temp[0].split('?');

    let query = {};
    let queryStr = temp[0][1];

    if (queryStr) {
        queryStr = queryStr.split('&');
        $(queryStr).each(function (index, item) {
            let _temp = item.split('=');
            query[_temp[0]] = decodeURIComponent(_temp[1]);
        });
    }

    return query;
}

const debounce = function (func, wait, immediate) {
    let timeout;
    return function () {
        let context = this, args = arguments;
        let later = function () {
            timeout = null;
            if (!immediate) func.apply(context, args);
        };
        let callNow = immediate && !timeout;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
        if (callNow) func.apply(context, args);
    };
}

const appendQuery = function (url, query) {
    if (query == '') return url;
    return (url + '&' + query).replace(/[&?]{1,2}/, '?')
}

const isFunction = function (value) {
    return type(value) == "function"
};

const setTitle = function (title) {
    document.title = title;
    if (Browser.isWechat()) {
        let ifr = document.createElement('iframe');
        ifr.src = "/favicon.ico";
        ifr.style.display = "none";
        var load = function () {
            setTimeout(function () {
                ifr.parentNode.removeChild(ifr);
                load = null;
            }, 0);
        };
        ifr.addEventListener('load', load);
        document.getElementsByTagName('body')[0].appendChild(ifr);
    }
};
const getEleComputedStyle = function (_ele, _style) {
    let stlyeStr = getComputedStyle(_ele)[_style];
    return stlyeStr ? parseFloat(stlyeStr) : null;
}

const thousandBitSeparator = function (num) {
    return num && (num
        .toString().indexOf('.') != -1 ? num.toString().replace(/(\d)(?=(\d{3})+\.)/g, function ($0, $1) {
        return $1 + ",";
    }) : num.toString().replace(/(\d)(?=(\d{3}))/g, function ($0, $1) {
        return $1 + ",";
    }));
}

export default {
    debounce,
    initFontSize,
    parseUrl,
    appendQuery,
    isFunction,
    setTitle,
    makeQueryStr,
    getEleComputedStyle,
    thousandBitSeparator
}
