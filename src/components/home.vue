<template>
  <div class="home-container">
    <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page">
      <div class="home">
        <p class="home-banner">
          <img src="../assets/img/home/banner.png" class="banner" />
        </p>
        <div class="user-content" @click.stop.prevent="toAsset">
          <div class="home-user">
            <i class="home-user-icon"></i>
            <div class="home-user-user">
              <span class="home-user-user-phone blackLight">
                <template v-if="isLoading === true">
                  <loading-inline></loading-inline>
                </template>
                <template v-if="isLoading === false">{{account | formatName()}}</template>
              </span>
            </div>
          </div>
          <p class="home-user">
            <i class="home-user-arrow"></i>
          </p>
        </div>
        <div class="home-body">
          <p class="home-body-title">
            <span class="slid"></span>
            <label class="recommend">{{$t('text.recommend')}}</label>
            <span class="more" @click.prevent="loadMore">{{$t('text.forMore')}}</span>
          </p>
          <detail :list="orderList" from="home" v-if="hasData"></detail>

          <div class="order-no" v-if="!hasData">
            <i class="order-no-icon"></i>
            <label class="order-no-text">{{$t('text.noContent')}}</label>
          </div>
        </div>
        <tips
          :show-flag="tips.showTips"
          :content="tips.tipsContent"
          @hidetips="tips.showTips=false"
        ></tips>
      </div>
    </scroll>
    <bottom tab="home"></bottom>
  </div>
</template>

<script>
import service from "../assets/js/commonService";
import appBanner from "./children/banner";
import detail from "./children/detail";
import bottom from "./children/footer";
import tips from "./children/tips";
import ercStake from "../assets/js/ercContract";
import config from "../assets/js/config";
import LoadingInline from "./loading-inline/Loading.vue";
import Scroll from "../components/children/scroll_init.vue";

export default {
  components: {
    appBanner,
    detail,
    bottom,
    tips,
    LoadingInline,
    Scroll
  },
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      
      orderList: [],
      countryCode: null,
      account: "",
      phone: null,
      currency: null,
      total: 0,
      borrowed: null,
      loaned: null,
      imgSrc: "",
      tokens: null, //进入资产页面的参数
      tips: {
        tipsContent: "",
        showTips: false
      },
      pageStart: 0,
      num: 5,
      hasData: false,
      localName: "",
      isLoading: true,
      Itimer: null,
      onceAgain: false
    };
  },
  created() {
    // 进入应用后保存账号  需要后台返回是否有预留邮箱
    this.onceAgain =
      localStorage.getItem("onceAgain") === "true" ? true : false;
    if (this.onceAgain) {
      localStorage.setItem(
        "onceAgain",
        Math.floor(Math.random() * 10) > 5 ? "true" : ""
      );
    }

    // console.log(this.ercStakeInit);
    let that = this;
    this.localName = window.ethereum.selectedAddress;

    function time() {
      let local_Name = window.ethereum.selectedAddress;
      if (local_Name !== null && local_Name !== "undefined") {
        that.localName = window.ethereum.selectedAddress;
        if (that.Itimer) {
          clearInterval(that.Itimer);
          that.isLoading = false;
          that.getAsset();
          that.getOrderList();
        }
        return false;
      }
      console.log("account not found!");
    }

    time();
    this.Itimer = setInterval(time, 1000);

    if (this.localName) {
      this.isLoading = false;
    }

    if (config.getItem("config")) {
      // 避免多次请求
      return false;
    } else {
      service.getBorrowConfig().then(rep => {
        if (rep.status === 200) {
          let borrowed = rep.data.tokens.borrowed;
          let pledge = rep.data.tokens.pledge;
          for (let num in borrowed) {
            let item = borrowed[num];
            for (let key in item) {
              config.coinsInfo[item.symbol] = item;
            }
          }
          for (let num in pledge) {
            let item = pledge[num];
            for (let key in item) {
              config.coinsInfo[item.symbol] = item;
            }
          }
          config.coinsInfo.data = true;
          sessionStorage.setItem("config", JSON.stringify(config.coinsInfo));
        }
      });
    }

    that.getAsset();
    that.getOrderList();
  },
  methods: {
    getOrderList() {
      service
        .getOrderList({
          page: this.pageStart,
          size: this.num,
          account: this.localName
        })
        .then(rep => {
          if (rep.status === 200) {
            this.orderList = rep.data.content;
            if (this.orderList.length) {
              this.hasData = true;
            }
          } else {
            this.showTip(rep.msg);
            this.hasData = false;
          }
        });
    },
    showTip(_msg) {
      if (_msg) {
        //防止出现黑点
        this.tips.tipsContent = _msg;
        this.tips.showTips = true;
      }
    },
    loadMore() {
      this.$router.push({ path: "loadmore" });
    },
    toAsset() {
      this.$router.push({
        name: "asset",
        query: {
          list: JSON.stringify(this.tokens),
          phone: this.phone,
          total: this.total,
          currency: this.currency,
          account: this.account,
          countryCode: this.countryCode
        }
      });
    },
    getAsset() {
      service
        .myAsset({
          account: this.localName
        })
        .then(rep => {
          if (rep.status === 200) {
            this.countryCode = rep.data.countryCode;
            if (rep.data.account && rep.data.account !== null) {
              this.account = rep.data.account;
            } else {
              this.account = this.localName;
            }
            this.phone = rep.data.phone;
            this.currency = rep.data.currency;
            this.total = rep.data.total;
            this.tokens = rep.data.tokens;
          } else {
            this.showTip(rep.msg);
          }
        });
    },
  }
};
</script>

<style scoped lang="scss">
.noData {
  height: 100vh;
}

.common-page {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
}

.home {
  background: #f5f6f7;
  padding-bottom: 150px;
  /*height: 100vh;*/
  &-banner {
    padding: 30px 30px 0;
    width: 690px;
    height: 310px;
    background: #fff;
    border: none;
    overflow: hidden;
    .loadingIng {
      background: #dcdcdc !important;
      height: 174px;
    }
    .banner {
      width: 100%;
    }
  }

  .user-content {
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: 0 25px;
    margin-bottom: 26px;
    background: #fff;
    .home-user {
      height: 105px;
      line-height: 105px;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: 10px 0;
      &-icon {
        display: inline-block;
        vertical-align: middle;
        width: 23px;
        height: 28px;
        background: url("../assets/img/icon.png") no-repeat center;
        background-size: contain;
      }
      &-user {
        display: flex;
        flex-direction: column;
        align-items: flex-start;
        justify-content: center;
        &-phone {
          margin-left: 10px;
          color: #697d91;
          height: 40px;
          line-height: 40px;
          display: inline-block;
        }
        .blackLight {
          color: #0c1e48;
        }
      }

      &-total {
        font-size: 16px; /*no*/
        font-weight: 400;
        color: #0c1e48;
      }
      &-name {
        font-size: 12px;
        vertical-align: bottom;
        color: #0c1e48;
      }
      &-arrow {
        width: 12px;
        height: 23px;
        background: url("../assets/img/arrow.png") no-repeat center;
        background-size: contain;
        display: inline-block;
        margin-left: 8px;
      }
    }
  }
  &-body {
    &-title {
      padding: 0 25px;
      height: 76px;
      line-height: 76px;
      background: #fff;
      .slid {
        background: #5b7bff;
        width: 7px;
        height: 30px;
        display: inline-block;
      }
      .recommend {
        color: #111e4b;
        font-size: 30px;
        margin-left: 15px;
      }
      .more {
        color: #758799;
        font-size: 26px;
        float: right;
      }
    }
    .order-no {
      display: flex;
      align-items: center;
      justify-content: center;
      flex-direction: column;

      &-icon {
        width: 458px;
        height: 264px;
        background: url("../assets/img/no.png") no-repeat center;
        background-size: contain;
        display: block;
        margin-top: 130px;
      }
      &-text {
        color: #5684ff;
        font-size: 30px;
        margin-top: 68px;
        display: block;
      }
    }
  }
}
</style>
