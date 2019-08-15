<template>
  <div class="login">
    <header class="header-container">
      <img src="../assets/img/return_back.png" alt @click="toBack" />
    </header>
    <div v-if="hasEmail">
      <section class="text-container">
        <h1>验证邮箱</h1>
      </section>
      <ul class="login-content">
        <li class="login-content-li">
          <input
            type="text"
            class="enter"
            :placeholder="$t('tips.enterEmail')"
            v-model="form.email"
            v-on:input="checkValid"
          />
        </li>
        <li class="login-content-li">
          <input
            type="number"
            class="enter"
            :placeholder="$t('tips.enterEmailCaptcha')"
            v-model="form.captchaCode"
            v-on:input="checkValid"
            oninput="if(value.length>6)value=value.slice(0,6)"
          />
          <span class="send" @click="getTextCode" v-if="!isShowCountDown">{{$t('tips.sendCaptcha')}}</span>
          <span class="send blue" v-if="isShowCountDown">{{ smscodeTextCount }}</span>
        </li>
      </ul>
      <p class="login-btn" :class="{'blue-bg':isFormValid}" @click="toSubmit">提交</p>
    </div>

    <div v-else>
      <section class="text-container">
        <h1>{{onceAgain?'设置新邮箱':'设置邮箱'}}</h1>
      </section>
      <ul class="login-content">
        <li class="login-content-li">
          <input
            type="text"
            class="enter"
            :placeholder="$t('tips.enterEmail')"
            v-model="form.email"
            v-on:input="checkValid"
          />
        </li>
        <li class="login-content-li">
          <input
            type="number"
            class="enter"
            :placeholder="$t('tips.enterEmailCaptcha')"
            v-model="form.captchaCode"
            v-on:input="checkValid"
            oninput="if(value.length>6)value=value.slice(0,6)"
          />
          <span class="send" @click="getTextCode" v-if="!isShowCountDown">{{$t('tips.sendCaptcha')}}</span>
          <span class="send blue" v-if="isShowCountDown">{{ smscodeTextCount }}</span>
        </li>
      </ul>
      <p class="login-btn" :class="{'blue-bg':isFormValid}" @click="toConfirm">确定</p>
    </div>

    <tips :show-flag="tips.showTips" :content="tips.tipsContent" @hidetips="tips.showTips=false"></tips>
  </div>
</template>

<script>
var betweenTime = 0;
var tagTime = 0;
var num = 0;
document.addEventListener("visibilitychange", function() {
  // 用户离开了当前页面
  if (document.visibilityState === "hidden") {
    tagTime = Date.now();
  }
  // 用户打开或回到页面
  if (document.visibilityState === "visible") {
    var betweenMs = Date.now() - tagTime;
    var betweenTime = Math.floor(betweenMs / 1000);
    num = betweenTime;
  }
});

import tips from "./children/tips";
import service from "../assets/js/commonService";
import utils from "@/utils/index";
export default {
  name: "SettingEmail",
  components: {
    tips
  },
  data() {
    return {
      tips: {
        tipsContent: "",
        showTips: false
      },

      form: {
        captchaCode: "",
        email: ""
      },

      hasEmail: false,
      onceAgain: false,

      isFormValid: false,
      waitTime: 60,
      isShowCountDown: false,
      smscodeTextCount: "验证码信息！！"
    };
  },
  mounted() {
    this.hasEmail = localStorage.getItem("email") ? true : false;
    this.onceAgain =
      localStorage.getItem("onceAgain") === "true" ? true : false;
    if (this.hasEmail) {
      localStorage.setItem("onceAgain", true);
      this.form.email = localStorage.getItem("email");
    }
  },
  methods: {
    toBack() {
      this.$router.back();
    },
    showTip(_msg) {
      if (_msg) {
        //防止出现黑点
        this.tips.tipsContent = _msg;
        this.tips.showTips = true;
      }
    },
    toSubmit() {
      if (this.checkValid()) {
        let rep = {
          status: 200
        };
        if (rep.status === 200) {
          this.showTip("验证成功");
          setTimeout(() => {
            localStorage.removeItem("email");
            this.$router.go(0);
          }, 2000);
        } else {
          this.showTip(rep.msg || rep.desc);
        }
      }

      //     if (this.checkValid()) {
      //     service
      //       .signup({
      //         email: this.form.email,
      //         code: this.form.captchaCode
      //       })
      //       .then(rep => {
      //         if (rep.status === 200) {
      //           this.hasEmail =  false
      //         } else {
      //           this.showTip(rep.msg || rep.desc);
      //         }
      //       });
      //   }
    },
    toConfirm() {
      if (this.checkValid()) {
        service
          .getBindEmail({
            email: this.form.email,
            account: window.ethereum.selectedAddress,
            code: this.form.captchaCode
          })
          .then(rep => {
            if (rep.status === 200) {
              this.showTip("设置成功");
              setTimeout(() => {
                localStorage.setItem("email", this.form.email);
                localStorage.setItem("onceAgain", true);
                this.$router.push({
                  path: "/account"
                });
              }, 2000);
            } else {
              this.showTip(rep.msg || rep.desc);
            }
          });
      }
    },
    checkValid() {
      if (utils.regex.email.test(this.form.email) && this.form.captchaCode) {
        this.isFormValid = true;
      } else {
        this.isFormValid = false;
      }
      return this.isFormValid;
    },
    getTextCode() {
      if (!utils.regex.email.test(this.form.email)) {
        this.showTip(this.$t("tips.enterEmailCaptcha"));
        return;
      }

      if (utils.regex.email.test(this.form.email)) {
        this.showTip(this.$t("tips.captchaSent"));
        this.isShowCountDown = true;

        service
          .getEmailCode({
            email: this.form.email,
            account: window.ethereum.selectedAddress
          })
          .then(rep => {
            if (rep.status !== 200) {
              this.showTip(rep.msg);
            } else {
              this.showTip(this.$t("tips.captchaSent"));
              this.isShowCountDown = true;
              //倒计时
              this.smscodeTextCount = this.waitTime + "s";
              this.waitTime--;
              this.backInterval = setInterval(() => {
                if (this.waitTime <= 0) {
                  clearInterval(this.backInterval);
                  this.isShowCountDown = false;
                  this.waitTime = 60;
                  num = 0;
                  return false;
                }
                if (num > 0) {
                  if (this.waitTime > num) {
                    this.waitTime = this.waitTime - num;
                    num = 0;
                  } else {
                    this.waitTime = 0;
                  }
                }
                this.smscodeTextCount = this.waitTime + "s";
                this.waitTime--;
              }, 1000);
            }
          });
      }
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/base";
@import "../assets/scss/color";

.login {
  display: flex;
  align-items: left;
  justify-content: center;
  flex-direction: column;
  padding: 0 60px;
  .header-container {
    margin-top: 40px;
    height: 80px;
    text-align: left;
    img {
      width: 25px;
      vertical-align: middle;
      text-align: center;
    }
  }
  .text-container {
    margin-top: 40px;
    height: 200px;
    line-height: 200px;
    font-size: 30px;
  }
  &-content {
    width: 90%;

    .weui-cells:before {
      border-top: none;
    }

    .weui-cells {
      font-size: 28px !important;
      .weui-cell {
        .weui-cell__hd {
          .weui-label {
            .area {
              width: 110px;
              text-align: center;
              color: #485063;
              font-size: 30px;
              border-right: 1px solid #ddd;
              display: flex;
              align-items: center;

              .arrow {
                width: 0;
                height: 0;
                border-width: 10px 8px 0;
                border-style: solid;
                border-color: #485063 transparent transparent; /*灰 透明 透明 */
                display: inline-block;
                margin-left: 8px;
              }
            }
          }
        }

        .weui-cell__ft {
          .weui-vcode-btn {
            border-left: none;
            color: #5a6ff3;
            font-size: 28px;
          }
        }
      }
    }

    &-li {
      list-style: none;
      padding: 60px 0 0 0;
      border-bottom: 1px solid #dcdcdc;
      height: 50px;
      display: flex;
      align-items: center;
      justify-content: flex-start;

      .area {
        width: 110px;
        text-align: center;
        color: #485063;
        font-size: 30px;
        border-right: 1px solid #ddd;
        display: flex;
        align-items: center;

        .arrow {
          width: 0;
          height: 0;
          border-width: 10px 8px 0;
          border-style: solid;
          border-color: #485063 transparent transparent; /*灰 透明 透明 */
          display: inline-block;
          margin-left: 8px;
        }
      }

      .enter {
        background: none;
        width: 425px;
        border: none;
        height: 50px;
        line-height: 50px;
        color: #333; /**c8ceda*/
        font-size: 30px;
      }

      .verifyCode {
        width: 125px;
        height: 52px;
        font-size: 30px;
        margin-bottom: 15px;
        float: right;
      }

      .phone {
        padding-left: 18px;
      }

      .send {
        display: inline-block;
        width: 200px;
        color: #5a6ff3;
        font-size: 28px;
        float: right;
      }
    }
  }

  &-loginTips {
    font-size: 30px;
    color: #0c1e48;
  }

  &-btn {
    width: 90%;
    height: 90px;
    line-height: 90px;
    margin-top: 90px;
    border-radius: 50px;
    background: rgb(160, 167, 185);
    text-align: center;
    color: #fff;
    margin-bottom: 40px;
    font-size: 30px;
  }

  .right {
    background: #5a70f3 !important;
  }

  .btn-content {
    display: flex;
    align-items: center;
    justify-content: center;

    .blue {
      color: #5a70f3;
      font-size: 28px;
    }
  }
}

input::-webkit-input-placeholder {
  font-size: 28px;
}

input:-moz-placeholder {
  font-size: 28px;
}

input::-moz-placeholder {
  font-size: 28px;
}

input:-ms-input-placeholder {
  font-size: 28px;
}

.blue-bg {
  background: #5a70f3;
  color: #fff;
}
</style>
