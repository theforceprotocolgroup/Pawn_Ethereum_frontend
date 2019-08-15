import './Toast.scss';

import Vue from 'vue';
import html from './Toast.html';

$('body').append(html);

const TIMEOUT = 3000;
const TIMEOUT_ERROR = 5000;

let vm = new Vue({
    el: '#compToast',
    components: {},
    mounted() {
        this.$module = $(this.$refs.module);
    },
    data() {
        return {
            timeId: null,
            $module: null,
            isShow: false,
            transition: 'fade',
            type: 'warning',
            content: '',
            timeout: TIMEOUT,
            callback() {
            }
        };
    },
    methods: {
        show() {
            this.isShow = true;
            this.$module.addClass('slide-fade-enter-active');
            if (this.timeId) {
                window.clearTimeout(this.timeId);
            }
            // 不消失
            if (this.timeout === -1) {
                return;
            }
            this.timeId = setTimeout(() => {
                this.hide();
                if (typeof this.callback === 'function') {
                    this.callback();
                }
            }, this.timeout);
        },
        hide() {
            this.isShow = false;
            this.$module.removeClass('slide-fade-enter-active');
        }
    }
});

let toast = function (msgOrConfig, callback, timeout) {

    let config = {};

    if (typeof msgOrConfig === 'string') {
        config.content = msgOrConfig;
        config.callback = callback;
        config.timeout = timeout;
    } else {
        config = msgOrConfig;
        if (config.type === 'error' && !config.timeout) {
            config.timeout = TIMEOUT_ERROR;
        }
    }

    let option = {
        transition: config.transition || 'fade',
        type: config.type || 'warning',
        content: config.content,
        timeout: config.timeout || TIMEOUT,
        callback: config.callback
    };
    $.map(option, (value, key) => {
        vm[key] = value;
    });

    vm.show();

};

window.toast = toast;

window.success = function (msgOrConfig, callback, timeout) {
    let config = {};
    if (typeof msgOrConfig === 'string') {
        config.type = 'success';
        config.content = msgOrConfig;
        config.callback = callback;
        config.timeout = timeout;
    } else {
        config = $.extend({
            type: 'success'
        }, msgOrConfig);
    }
    toast(config);
};

window.warning = function (msgOrConfig, callback, timeout) {
    let config = {};
    if (typeof msgOrConfig === 'string') {
        config.type = 'warning';
        config.content = msgOrConfig;
        config.callback = callback;
        config.timeout = timeout;
    } else {
        config = $.extend({
            type: 'warning'
        }, msgOrConfig);
    }
    toast(config);
};

window.error = function (msgOrConfig, callback, timeout) {
    let config = {};
    if (typeof msgOrConfig === 'string') {
        config.type = 'error';
        config.content = msgOrConfig;
        config.callback = callback;
        config.timeout = timeout || TIMEOUT_ERROR;
    } else {
        config = $.extend({
            type: 'error'
        }, msgOrConfig);
    }
    toast(config);
};
export default toast;