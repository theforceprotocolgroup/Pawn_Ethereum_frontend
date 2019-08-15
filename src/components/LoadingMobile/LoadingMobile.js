
import './LoadingMobile.scss';

import $ from 'jquery';
import Vue from 'vue';

import html from './LoadingMobile.html';

$('body').append(html);

let vm = new Vue({
  el: '#compLoadingMobile',
  components: {},
  created() {

  },
  mounted() {
    this.$module = $(this.$refs.module);
  },
  data() {
    return {
      timeId: null,
      $module: null,
      isShow: false
    };
  },
  methods: {
    show() {
      this.isShow = true;
    },
    hide() {
      this.isShow = false;
    }
  }
});

let loading = function () {
  vm.show();
};

let unloading = function () {
  vm.hide();
};

window.loading = loading;
window.unloading = unloading;

/**
 * loading
 * @returns {*}
 */
export default loading;