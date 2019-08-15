// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.

import Vue from 'vue'
import App from './App'
import router from './router'
import 'lib-flexible'

import VueI18n from 'vue-i18n'
import LangENUS from './assets/common/lang/en-us'
import LangZHCN from './assets/common/lang/zh-cn'

import * as filters from './assets/js/filter'
import VueWeui from 'weui';

import ercStake from './assets/js/ercContract';



Object.keys(filters).forEach(key => {
    Vue.filter(key, filters[key])
});


Vue.config.productionTip = false;

ercStake.ercStake.init();



Vue.use(VueI18n);

const i18n = new VueI18n({
    locale: localStorage.getItem('lang') || 'zh-cn',
    messages: {
        'en-us': LangENUS,
        'zh-cn': LangZHCN
    }
});



/* eslint-disable no-new */
new Vue({
    el: '#app',
    router,
    i18n,
    components: {
        App,
        VueWeui
    },
    template: '<App/>'
});