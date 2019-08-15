export default {
  phoneReg: /^(\+86)?(((13[0-9])|(14[0-25-9])|(15[0-9])|(16[0-9])|(17[135-8])|(19[0-9])|(18[0-9]))\d{8})|((170[0-9])\d{7})$/,
  COUNT_TIMER: 60,
  smscodeText: '60s',
  waitTime: this.COUNT_TIMER,
  downloadUrl: 'https://www.kcash.com/download-zh.html?type=NOV_INV',
  downloadUrl_en: 'https://www.kcash.com/download.html?type=NOV_INV',
  shareUrl: 'https://activity.kcash.com/investFriends.html#/',//正式环境分享链接
  // shareUrl: 'http://activity.test-kcash.ak/investFriends.html#/index',//测试环境分享链接
  countDown: function () {
    //倒计时
    this.smscodeText = this.waitTime + 's';
    this.waitTime--;
    let that = this;
    let backInterval = setInterval(() => {
      if (this.waitTime <= 0) {
        clearInterval(backInterval);
        this.smscodeText = "重新获取验证码";
        this.waitTime = that.COUNT_TIMER;
        return false;
      }
      that.smscodeText = that.waitTime + 's';
      that.waitTime--;
    }, 1000);
  }
}
