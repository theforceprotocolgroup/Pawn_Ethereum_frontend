import axios from 'axios';
import config from '../../js/config';

const DEFAULT_TIMEOUT = 30000;
const SERVER_URL = '/bbd';

axios.defaults.timeout = 30000;
axios.defaults.headers.post['Content-Type'] = 'application/json; charset=UTF-8';

export default {
    postS(path, param = {}) {
        let deferred = $.Deferred();
        $.ajax({
            url: SERVER_URL + path,
            data: JSON.stringify(param.data),
            type: 'POST',
            dataType: 'JSON',
            contentType: 'application/json; charset=UTF-8',
            async: true,
            timeout: DEFAULT_TIMEOUT,
            xhrFields: {
                withCredentials: false //允许跨域请求
            },
            crossDomain: true,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("X-Auth-Token", config.getItem_local('token'));
            },
            success: function (rep, textStatus, request) {

                if (rep.error) {
                    // 报错了
                    deferred.rejectWith(this, ['Server exception, please try again later']);
                } else {
                    if (rep.status === 400000) {//对后端清除服务，或者cookies失效时，退出登录的处理
                        localStorage.removeItem('token');

                        window.location.href = '/#/login';
                    }
                    // 正确
                    deferred.resolveWith(this, [rep]);


                }
            },
            error: function (xhr, type) {
                deferred.rejectWith(this, ['Network exception, please try again later']);
            }
        });

        return deferred.promise();
    },

    // 同上
    getS(path, param = {}, showError = true) {
        let deferred = $.Deferred();

        let queryString = '?';
        if (param && param.data && Object.keys(param.data).length) {
            Object.keys(param.data).forEach((str) => {
                queryString += str + '=' + param.data[str] + '&'
            });
            queryString = queryString.substr(0, queryString.length - 1);


        }
        let getUrl = SERVER_URL + path;
        if (queryString && queryString != '?') {
            getUrl = getUrl + queryString;
        }
        $.ajax({
            url: getUrl,
            type: 'GET',
            headers: {
                'accept-language': 'zh-CN'
            },
            // contentType: 'multipart/form-data',
            contentType: 'application/json; charset=UTF-8',
            async: param.async || true,
            timeout: param.timeout || DEFAULT_TIMEOUT,
            xhrFields: {
                withCredentials: false
            },
            crossDomain: true,
            beforeSend: function (XMLHttpRequest) {
                XMLHttpRequest.setRequestHeader("X-Auth-Token", config.getItem_local('token'));
            },
            success(rep, textStatus, request) {
                if (rep.status === 400000) {//对后端清除服务，或者cookies失效时，退出登录的处理
                    localStorage.removeItem('token');
                    window.location.href = '/#/login';
                }
                deferred.resolveWith(this, [rep]);
            },
            error(xhr, type) {
                deferred.rejectWith(this, ['Network exception, please try again later']);
            },
        });

        return deferred.promise();
    },
    // 只用于处理 图片code码接口
    postImgCode(path, param = {}) {
        let deferred = $.Deferred();

        $.ajax({
            url: SERVER_URL + path,
            data: JSON.stringify(param.data),
            type: 'POST',
            dataType: 'JSON',
            headers: {
                'accept-language': 'zh-CN'
            },
            contentType: 'application/json; charset=UTF-8',
            async: true,
            timeout: DEFAULT_TIMEOUT,
            xhrFields: {
                withCredentials: false
            },
            crossDomain: true,
            success: function (rep, textStatus, request) {
                if (rep.error) {
                    deferred.rejectWith(this, ['Server exception, please try again later']);
                } else {
                    deferred.resolveWith(this, [rep]);
                }
            },
            error: function (xhr, type) {
                deferred.rejectWith(this, ['Network exception, please try again later']);
            }
        });

        return deferred.promise();
    },
};