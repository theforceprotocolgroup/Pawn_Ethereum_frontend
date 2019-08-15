<template>
  <div class="account-container">
    <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page">
      <div class="account">
        <div class="account-top">
          <div class="account-top-info">
            <i class="account-top-info-icon"></i>
            <div class="user-info">
              <label class="phone">{{ accountNamm|formatName }}</label>
            </div>
          </div>
          <div class="account-top-detail" @click="toAsset">
            <p class="account-top-detail-title">{{$t('profile.myAssets')}} （{{currency}}）</p>
            <p class="account-top-detail-total">{{total | decimals_symbol(currency) }}</p>
            <div class="account-top-detail-bottom">
              <div class="account-top-detail-bottom-content">
                <p class="account-top-detail-bottom-content-name">
                  {{$t('profile.myBorrowing')}}
                  （{{currency}}）
                </p>
                <p class="account-top-detail-bottom-content-num">
                  {{borrowed |
                  decimals_symbol(currency)}}
                </p>
              </div>
              <div class="account-top-detail-bottom-content">
                <p class="account-top-detail-bottom-content-name">
                  {{$t('profile.myLending')}}
                  （{{currency}}）
                </p>
                <p class="account-top-detail-bottom-content-num">
                  {{loaned |
                  decimals_symbol(currency)}}
                </p>
              </div>
            </div>
          </div>
        </div>
        <div class="account-bottom">
          <ul class="account-bottom-content">
            <li class="account-bottom-content-li" @click="toMyorderPage">
              <i class="account-bottom-content-li-icon"></i>
              <label class="account-bottom-content-li-name">{{$t('profile.myOrders')}}</label>
              <span class="account-bottom-content-li-other"></span>
            </li>
            <li class="account-bottom-content-li" @click="settingReceiveMessage">
              <i class="account-bottom-content-li-icon email"></i>
              <label
                class="account-bottom-content-li-name"
              >{{onceAgain?$t('text.resettingReceiveMessage'):$t('text.settingReceiveMessage')}}</label>
              <span class="account-bottom-content-li-other"></span>
            </li>
            <li class="account-bottom-content-li" @click="toAboutPage">
              <i class="account-bottom-content-li-icon about"></i>
              <label class="account-bottom-content-li-name">{{$t('profile.aboutUs')}}</label>
              <span class="account-bottom-content-li-other"></span>
            </li>
            <!-- <li class="account-bottom-content-li" @click="changeLanguage">
              <i class="account-bottom-content-li-icon language"></i>
              <label class="account-bottom-content-li-name">{{$t('text.changeLanguage')}}</label>
              <span class="account-bottom-content-li-other"></span>
            </li>-->
          </ul>
          <!-- <p class="account-bottom-btn" @click="showlDialog">{{$t('profile.logOut')}}</p> -->
        </div>
      </div>
    </scroll>

    <bottom tab="myAccount"></bottom>
    <!-- <pop :content="popContent" :show="showPop" @sure="loginOut" @cancel="closePop"></pop> -->
  </div>
</template>

<script>
import bottom from "./children/footer";
// import pop from './children/pop';
import service from "../assets/js/commonService";
import config from "../assets/js/config";
import Scroll from "../components/children/scroll_init.vue";
import ercStake from "../assets/js/ercContract";
export default {
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      accountNamm: "",
      name: null,
      countryCode: null,
      phone: null,
      currency: null,
      total: 0,
      borrowed: null,
      loaned: null,
      tokens: null,
      popContent: this.$t("profile.logOutTips"),
      showPop: false,
      onceAgain: localStorage.getItem("onceAgain") === "true" ? true : false
    };
  },
  components: {
    bottom,
    // pop,
    Scroll
  },
  mounted() {
    this.accountNamm = window.ethereum.selectedAddress;

    this.getAsset();
  },
  methods: {
    toMyorderPage() {
      this.$router.push({ path: "myorder" });
    },
    toAboutPage() {
      this.$router.push({ path: "about" });
    },
    changeLanguage() {
      if (this.$i18n.locale === "en-us") {
        this.$i18n.locale = "zh-cn";
        localStorage.setItem("lang", this.$i18n.locale);
      } else {
        this.$i18n.locale = "en-us";
        localStorage.setItem("lang", this.$i18n.locale);
      }
    },
    settingReceiveMessage() {
      this.$router.push("/setting-email");
    },
    getAsset() {
      service
        .getMineBaseData({ account: window.ethereum.selectedAddress })
        .then(rep => {
          if (rep.status === 200) {
            this.currency = rep.data.tokenSymbol;
            this.total = rep.data.totalBalance;
            this.borrowed = rep.data.totalBorrowed;
            this.loaned = rep.data.totalLoaned;
            localStorage.setItem("emial", rep.data.emial);
          }
        });
    },
    toAsset() {
      this.$router.push({
        name: "asset",
        query: {
          list: JSON.stringify(this.tokens),
          total: this.total,
          currency: this.currency,
          account: this.name,
        }
      });
    },
    showlDialog() {
      this.showPop = true;
    },
    closePop() {
      this.showPop = false;
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/base";

.common-page {
  position: fixed;
  top: 0;
  bottom: 130px;
  left: 0;
  right: 0;
}

.account {
  background: #fff;

  &-top {
    padding: 18px 28px 33px 28px;

    &-info {
      display: flex;
      align-items: center;
      justify-content: flex-start;
      margin-bottom: 15px;

      &-icon {
        width: 75px;
        height: 75px;
        background: url("../assets/img/user.png") no-repeat center;
        background-size: contain;
        margin-right: 10px;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;

        .phone {
          color: #111e4b;
          font-size: 26px;
        }
      }
    }

    &-detail {
      background: url("../assets/img/myBg.png") no-repeat center;
      background-size: cover;
      width: 695px;
      height: 345px;

      &-title {
        font-size: 24px;
        color: #fff;
        text-align: center;
        width: 100%;
        padding-top: 44px;
      }

      &-total {
        font-size: 52px;
        font-weight: bold;
        text-align: center;
        margin-top: 15px;
        color: #fff;
        margin-bottom: 25px;
      }

      &-bottom {
        padding: 20px 0;
        margin: 0 60px;
        border-top: #cccccc 1px solid;
        display: flex;
        align-items: center;
        justify-content: center;

        &-content {
          width: 50%;
          text-align: center;

          &-name {
            color: #fff;
            font-size: 22px;
          }

          &-num {
            font-size: 34px;
            font-weight: bold;
            margin-top: 5px;
            color: #fff;
          }
        }
      }
    }
  }

  &-bottom {
    border-top: #f5f6f7 20px solid;
    padding-left: 30px;

    &-content {
      &-li {
        height: 100px;
        line-height: 100px;
        /*padding: 30px 0;*/
        border-bottom: 1px solid #e0e0e0;
        /*display: flex;
                    align-items: center;
                    justify-content: flex-start;*/
        &-icon {
          width: 37px;
          height: 40px;
          background: url("../assets/img/orderImg.png") no-repeat center;
          background-size: contain;
          display: inline-block;
          vertical-align: middle;
        }

        .about {
          background: url("../assets/img/aboutUs.png") no-repeat center;
          background-size: contain;
        }

        .language {
          background: url("../assets/img/borrow/switch.png") no-repeat center;
          background-size: contain;
        }

        .email {
          background: url("../assets/img/borrow/email.png") no-repeat center;
          background-size: contain;
        }

        &-name {
          font-size: 30px;
          color: #0c1e48;
          margin-left: 26px;
        }

        &-other {
          width: 12px;
          height: 24px;
          background: url("../assets/img/arrow.png") no-repeat center;
          background-size: contain;
          display: inline-block;
          float: right;
          margin-right: 30px;
          margin-top: 40px;
        }
      }
    }

    &-btn {
      height: 88px;
      line-height: 88px;
      text-align: center;
      color: #5170ec;
      font-size: 30px;
      border: 1px solid #5170ec;
      border-radius: 50px;
      margin-right: 30px;
      margin-top: 90px;
    }
  }
}
</style>
