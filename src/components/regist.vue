<template>
    <div class="login">
        <img src="../assets/img/logoNo.png" alt="" class="logo">
        <ul class="login-content">
            <li class="login-content-li">
                <span class="area">+186 <i class="arrow"></i></span>
                <input type="number" class="enter phone" :placeholder="$t('tips.enterPhoneNumber')">
            </li>
            <li class="login-content-li">
                <input type="number" class="enter" :placeholder="$t('tips.enterCode')">
                <img src="" alt="" class="verifyCode">
            </li>
            <li class="login-content-li">
                <input type="text" class="enter" :placeholder="$t('tips.enterCaptcha')">
                <span class="send">发送验证码</span>
            </li>
        </ul>
        <p class="login-btn">立即注册</p>
        <!--<div class="btn-content">-->
        <!--<span>忘记密码</span>-->
        <!--<span class="blue">立即注册</span>-->
        <!--</div>-->
    </div>
</template>

<script>
    export default {
        name: 'login',
        data() {
            return {}
        }
    }
</script>

<style scoped lang="scss">
    @import "../assets/scss/base";

    .login {
        text-align: center;
        padding: 0 60px;

        .logo {
            width: 120px;
            height: 120px;
            margin-top: 50px;
            margin-bottom: 125px;
        }

        &-content {

            &-li {
                list-style: none;
                padding: 13px 0;
                border-bottom: 1px solid #dcdcdc;
                height: 50px;
                display: flex;
                align-items: center;
                justify-content: flex-start;

                .area {
                    width: 125px;
                    text-align: center;
                    color: #333;
                    border-right: 1px solid #ddd;
                    display: flex;
                    align-items: center;

                    .arrow {
                        width: 0;
                        height: 0;
                        border-width: 10px 8px 0;
                        border-style: solid;
                        border-color: #333 transparent transparent; /*灰 透明 透明 */
                        display: inline-block;
                        margin-left: 5px;
                    }
                }

                .enter {
                    background: none;
                    width: 425px;
                    border: none;
                    height: 50px;
                    line-height: 50px;
                    color: #333;
                }

                .verifyCode {
                    width: 120px;
                    height: 35px;
                    border: 1px solid #ddd;
                }

                .phone {
                    padding-left: 18px;
                }

                .send {
                    color: rgba(166, 166, 171, 255);
                }
            }
        }

        &-btn {
            height: 90px;
            line-height: 90px;
            margin-top: 90px;
            border-radius: 50px;
            background: rgb(160, 167, 185);
            text-align: center;
            color: #fff;
            font-size: 16px; /*no*/
            margin-bottom: 45px;
        }

        .btn-content {
            display: flex;
            align-items: center;
            justify-content: space-between;

            .blue {
                color: blue;
            }
        }
    }
</style>
