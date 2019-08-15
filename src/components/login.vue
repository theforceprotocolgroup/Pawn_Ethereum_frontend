<template>
    <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page">
        <div class="login">
            <img src="../assets/img/logoNo.png" alt="" class="logo">
            <ul class="login-content">
                <li class="login-content-li">
                    <span class="area" @click="changeArea">+{{form.countryCode}} <i class="arrow"></i></span>
                    <input type="number" class="enter phone" :placeholder="$t('tips.enterPhoneNumber')"
                           v-model="form.phone"
                           v-on:input="checkValid">
                </li>
                <li class="login-content-li">
                    <input type="text" class="enter" :placeholder="$t('tips.enterPictureCode')" v-model="form.captcha"
                           v-on:input="checkValid">
                    <img :src="imgSrc" alt="" class="verifyCode" @click="getCaptcha">
                </li>
                <li class="login-content-li">
                    <input type="number" class="enter" :placeholder="$t('tips.enterCaptcha')" v-model="form.code"
                           v-on:input="checkValid"
                           oninput="if(value.length>6)value=value.slice(0,6)">
                    <span class="send" @click="getTextCode" v-if="!isShowCountDown">{{$t('tips.sendCaptcha')}}</span>
                    <span class="send blue" v-if="isShowCountDown">{{ smscodeTextCount }}</span>
                </li>
            </ul>
            <p class="login-btn" @click="toLogin" :class="{right:isFormValid}">{{$t('text.loginOrRegister')}}</p>
            <i class="login-loginTips" @click="changeLanguage">{{$t('text.changeLanguage')}}</i>
            <tips :show-flag="tips.showTips" :content="tips.tipsContent" @hidetips="tips.showTips=false"></tips>
        </div>
    </scroll>
</template>

<script>
    import service from '../assets/js/commonService';
    import tips from './children/tips';
    import Scroll from '../components/children/scroll_init.vue'
    import ercStake from '../assets/js/ercContract';

    export default {
        name: 'login',
        data() {
            return {
                probeType: 3,
                listenScroll: true,
                accountName: null,
                imgSrc: '',
                sessionId: '',
                form: {
                    captcha: '',
                    phone: '',
                    countryCode: 86
                },

                tips: {
                    tipsContent: '',
                    showTips: false
                },

                isFormValid: false,
                waitTime: 60,
                isShowCountDown: false,
                smscodeTextCount: "验证码信息！！",
            }
        },
        components: {
            tips, Scroll
        },
        mounted() {
            this.getCaptcha();
            this.setCurrentArea();
            this.accountName = window.ethereum.selectedAddress;
        },
        methods: {
            showTip(_msg) {
                if (_msg) { //防止出现黑点
                    this.tips.tipsContent = _msg;
                    this.tips.showTips = true;
                }
            },
            setCurrentArea() {
                this.form.countryCode = this.$route.query.kAreaNow || '86';
            },
            toLogin() {
                if (this.checkValid()) {
                    service.signup({
                        "countryCode": this.form.countryCode,
                        "phone": this.form.phone,
                        "code": this.form.code
                    }).then(rep => {
                        if (rep.status === 200) {
                            localStorage.setItem('phone', this.form.phone);
                            this.$router.push({
                                path: '/home'
                            });
                        } else {
                            this.showTip(rep.msg || rep.desc);
                        }
                    });
                }
            },
            getCaptcha() {
                this.sessionId = this.getSessionId();
                service.getcaptcha({sessionId: this.sessionId}).then(rep => {
                    if (rep.status === 200) {
                        this.imgSrc = 'data:image/jpg;base64,' + rep.data.captcha;
                    } else {
                        this.showTip(rep.msg);
                    }
                });
            },
            checkValid() {
                if (this.form.phone && this.form.captcha && this.form.code) {
                    this.isFormValid = true;
                } else {
                    this.isFormValid = false;
                }
                return this.isFormValid;
            },
            getTextCode() {
                if (this.form.phone === '') {
                    this.showTip(this.$t('tips.enterPhoneNumber'));
                    return;
                }
                if (this.form.captcha === '') {
                    this.showTip(this.$t('tips.enterCaptcha'));
                    return;
                }

                if (this.form.phone && this.form.captcha) {
                    service.getverifycode({
                        "countryCode": this.form.countryCode,
                        "phone": this.form.phone,
                        "sessionId": this.sessionId,
                        "captcha": this.form.captcha
                    }).then(rep => {
                        if (rep.status !== 200) {
                            this.showTip(rep.msg);
                        } else {
                            this.showTip(this.$t('tips.captchaSent'));
                            this.isShowCountDown = true;
                            //倒计时
                            this.smscodeTextCount = this.waitTime + 's';
                            // this.waitTime&#45;&#45;;
                            this.backInterval = setInterval(() => {
                                if (this.waitTime <= 0) {
                                    clearInterval(this.backInterval);
                                    this.isShowCountDown = false;
                                    this.waitTime = 60;
                                    // this.isSend = false;
                                    return false;
                                }
                                this.smscodeTextCount = this.waitTime + 's';
                                // this.waitTime&#45;&#45;;
                            }, 1000);
                        }
                    });
                }
            },
            getSessionId() {
                let arr = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9", "A", "B", "C", "D", "E", "F", "G", "H", "I", "J", "K", "L", "M", "N", "O", "P", "Q", "R", "S", "T", "U", "V", "W", "X", "Y", "Z"],
                    num = "";
                for (let i = 0; i < 32; i++) {
                    num += arr[parseInt(Math.random() * 36)];
                }
                return num.toLowerCase();
            },
            changeLanguage() {
                if (this.$i18n.locale === 'en-us') {
                    this.$i18n.locale = 'zh-cn';
                    localStorage.setItem('lang', this.$i18n.locale)
                } else {
                    this.$i18n.locale = 'en-us';
                    localStorage.setItem('lang', this.$i18n.locale)
                }
            },
            changeArea() {
                //该功能暂时被禁
                // this.$router.push({path: '/chooseAere'});
            }
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/base";

    .common-page {
        position: fixed;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        overflow: hidden;
    }

    .login {
        display: flex;
        align-items: center;
        justify-content: center;
        flex-direction: column;

        .logo {
            width: 120px;
            height: 120px;
            margin-top: 56px;
            margin-bottom: 120px;
        }

        &-content {
            width: 80%;

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
            width: 80%;
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
</style>
