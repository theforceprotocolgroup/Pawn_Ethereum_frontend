<template>
  <div>
    <div class="header">
      <span class="icon-arrow"></span>
      借币
    </div>
    <div :probeType="probeType" :listenScroll="listenScroll" class="common-page">
      <div class="container">
        <section class="container__main">
          <ul class="container__main__list">
            <li
              class="container__main__list__card clearfix"
              v-for="item in cardData"
              :key="item.index"
              @click="toOperation(item)"
            >
              <div class="icon-box float-left">
                <img :src="item.iconUrl" alt class="image-center" />
              </div>
              <div class="info-box float-right">
                <div class="info clearfix">
                  <div class="info-title float-left display-inline-block">{{item.title}}</div>
                  <div class="info-arrow-right float-right display-inline-block">
                    <img src="../../assets/img/arrow.png" alt v-show="item.type" />
                  </div>
                  <div class="info-value float-right display-inline-block">
                    <span v-if="item.type">
                      <img :src="lendForm[item.tokenUrl]" alt v-show="item.tokenUrl" />
                      <!-- {{dateLineFormat(lendForm[item.value])}} -->
                      {{lendForm[item.value]}}
                    </span>

                    <input
                      class="lend-number"
                      type="number"
                      v-model="lendForm.lendNumber"
                      @blur="checkLendForm"
                      v-else
                    />
                  </div>
                </div>
                <div class="line"></div>
              </div>
            </li>
          </ul>

          <div
            class="container__main__button"
            :class="{'bg-blue':confirmStatus}"
            @click="confirmLend"
          >我要借币</div>
        </section>
        <!-- 借款期限组件 -->
        <div class="date" @click="closePopUp" v-show="isShowPopUpDateLine || isShowPopUpDailyRate">
          <ul class="date-content">
            <li class="date-content-title">{{popupTitle}}</li>
            <li
              class="date-content-days"
              :class="{'choose':isChooseIcon===item}"
              v-for="item in popupDataList"
              :key="item.index"
              @click="popUpChangeHandler(item)"
            >{{item}}</li>
          </ul>
        </div>
        <!-- 币种弹框 -->
        <div class="coin" v-show="tokenPopup">
          <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page-token">
            <ul class="coin-list">
              <li
                class="coin-list-li"
                v-for="item in coinPopupList"
                @click="tokenPopupChangeHandler(item)"
                :key="item.index"
              >
                <div class="coin-list-li-icon">
                  <img :src="item.logoUrl" />
                </div>
                <p class="coin-list-li-content">
                  <label class="coin-list-li-content-name">{{item.symbol}}</label>
                  <label class="coin-list-li-content-detail"></label>
                </p>
              </li>
            </ul>
          </scroll>
        </div>
        <!-- 提示框 -->
        <tips
          :show-flag="tips.showTips"
          :content="tips.tipsContent"
          @hidetips="tips.showTips=false"
        ></tips>
      </div>
    </div>
    <bottom tab="borrow"></bottom>
  </div>
</template>

<script>
import bottom from "@/components/children/footer";
import Scroll from "@/components/children/scroll_init.vue";
import tips from "@/components/children/tips";

import Api from "../../assets/js/commonService";

export default {
  components: {
    bottom,
    Scroll,
    tips
  },
  data() {
    return {
      // popup---start  配置
      popupDataList: [], // popup 数据
      popupTitle: "", //popup title
      isChooseIcon: false, // popup选中 icon显示
      // 借币期限
      dateLineList: [],
      dateLineType: "DAYS",
      isShowPopUpDateLine: false,
      // 日利率
      dailyRateList: ["0.44%", "1.44%", "2.44%", "3.44%", "4.44%"],
      isShowPopUpDailyRate: false,
      // popup---end

      // 提示框
      tips: {
        tipsContent: "",
        showTips: false
      },

      // tokenPopup 弹框  配置
      tokenPopup: false,
      coinPopupList: [],
      currentCoinType: "",

      probeType: 1,
      listenScroll: true,
      confirmStatus: false,
      lendForm: {
        lendTokenType: "",
        lendTokenTypeUrl: "",
        lendNumber: "",
        dailyRate: "",
        pledgeTokenType: "",
        pledgeTokenTypeUrl: "",
        dateLine: ""
      },
      cardData: [
        {
          iconUrl: require("../../assets/img/borrow/switch.png"),
          tokenUrl: "lendTokenTypeUrl",
          title: "我要借",
          value: "lendTokenType",
          type: true,
          path: "lendCoinType"
        },
        {
          iconUrl: require("../../assets/img/borrow/b2.png"),
          title: "借币数量",
          value: "lendNumber",
          type: false,
          path: ""
        },
        {
          iconUrl: require("../../assets/img/borrow/b3.png"),
          title: "日利率",
          value: "dailyRate",
          type: true,
          path: "interestRate"
        },
        {
          iconUrl: require("../../assets/img/borrow/b4.png"),
          tokenUrl: "pledgeTokenTypeUrl",
          title: "质押币种",
          value: "pledgeTokenType",
          type: true,
          path: "pledgeTokenType"
        },
        {
          iconUrl: require("../../assets/img/borrow/b5.png"),
          title: "借款期限",
          value: "dateLine",
          type: true,
          path: "dateLine"
        }
      ],
      // 接口数据
      configDataBase: null,
      pledgeTokenTypeList: null,
      lendCoinTypeList: null
    };
  },
  computed: {
    /**
     * @description 借贷期限加天
     */
    dateLineFormat(value) {
      let res;
      switch (this.dateLineType) {
        case "DAYS":
          res = value + "天";
          break;
        case "MOUTH":
          res = value + "月";
          break;
        default:
          res = value;
      }
      return res;
    }
  },
  mounted() {
    this.getBaseData();
  },
  methods: {
    /**
     * @description 初始数据格式化
     *
     */
    dataInit(res) {
      // this.configDataBase = res.data;
      this.dateLineType = res.data.periodUnit;
      if (res.data.dailyRate.length > 0) {
        this.dailyRateList = res.data.dailyRate.map(item => {
          return item + "%";
        });
      }
      if (res.data.period.length > 0) {
        this.dateLineList = res.data.period.map(item => {
          let res;
          switch (this.dateLineType) {
            case "DAYS":
              res = item + "天";
              break;
            case "MOUTH":
              res = item + "月";
              break;
            default:
              res = item;
          }
          return res;
        });
      }
      this.pledgeTokenTypeList = res.data.tokens.pledge;
      this.lendCoinTypeList = res.data.tokens.borrowed;
    },
    // api 请求
    /**
     * @description 获取基础数据
     *
     */
    getBaseData() {
      Api.getBorrowConfig().then(res => {
        if (res.status === 200) {
          this.dataInit(res);
        }
      });
    },
    /**
     * @description 操作类型
     * @params {Object} path
     */
    toOperation(item) {
      switch (item.path) {
        case "lendCoinType":
          console.log("我要借");
          this.tokenPopup = true;
          this.coinPopupList = this.lendCoinTypeList;
          this.currentCoinType = item.path;
          break;
        case "pledgeTokenType":
          console.log("质押币种");
          this.tokenPopup = true;
          this.coinPopupList = this.pledgeTokenTypeList;
          this.currentCoinType = item.path;
          break;
        case "dateLine":
          console.log("期限");
          this.popupDataList = this.dateLineList;
          this.popupTitle = "请选择借币期限";
          this.isShowPopUpDateLine = true;
          break;
        case "interestRate":
          console.log("利率");
          this.popupDataList = this.dailyRateList;
          this.popupTitle = "请选择日利率";
          this.isShowPopUpDailyRate = true;
          break;
        default:
          break;
      }
      // 操作完检测数据是否完全
      this.checkLendForm();
    },
    /**
     * @description 检查请求参数
     *
     */
    checkLendForm() {
      if (
        this.lendForm.lendTokenType &&
        this.lendForm.lendNumber &&
        this.lendForm.dailyRate &&
        this.lendForm.pledgeTokenType &&
        this.lendForm.dateLine
      ) {
        this.confirmStatus = true;
      } else {
        this.confirmStatus = false;
      }
    },
    /**
     * @description 确认借币
     *
     */
    confirmLend() {
      if (this.confirmStatus) {
        console.log("success");
        this.$router.push({
          path: "/borrow-detail",
          query: {
            paramsBaseData: JSON.stringify(this.lendForm)
          }
        });
      } else {
        this.showTip("请填写完所有内容");
      }
    },

    // popup 组件
    /**
     * @description 关闭popup组件
     *
     */
    closePopUp() {
      this.isShowPopUpDailyRate = false;
      this.isShowPopUpDateLine = false;
      this.checkLendForm();
    },
    /**
     * @description popup组件选择值
     * @param {String}
     *
     */
    popUpChangeHandler(value) {
      this.isChooseIcon = value;
      if (this.isShowPopUpDateLine) {
        this.lendForm.dateLine = value;
      }
      if (this.isShowPopUpDailyRate) {
        this.lendForm.dailyRate = value;
      }
      this.closePopUp();
    },
    /**
     * @description 选择币种
     *
     */
    tokenPopupChangeHandler(item) {
      switch (this.currentCoinType) {
        case "lendCoinType":
          this.lendForm.lendTokenType = item.symbol;
          this.lendForm.lendTokenTypeUrl = item.logoUrl;
          break;
        case "pledgeTokenType":
          this.lendForm.pledgeTokenType = item.symbol;
          this.lendForm.pledgeTokenTypeUrl = item.logoUrl;
          break;
        default:
          break;
      }
      this.tokenPopup = false;
      this.tokenPopup = false;
      this.checkLendForm();
    },
    /**
     * @description 提示框
     *
     */
    showTip(_msg) {
      if (_msg) {
        //防止出现黑点
        this.tips.tipsContent = _msg;
        this.tips.showTips = true;
      }
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/style.scss";
.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  line-height: 100px;
  font-size: 36px;
  text-align: center;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  background: #fff;
  border-bottom: 1px solid #e2e2e2;
  color: #0c1e48;
  .icon-arrow {
    position: inherit;
    top: 0;
    left: 0;
    right: 0;
    width: 80px;
    height: 100px;
    img {
      margin-bottom: 30px;
      width: 20px;
    }
  }
}
// 币种弹框
.common-page-token {
  position: fixed;
  top: 0px;
  bottom: 0px;
  left: 0;
  right: 0;
  z-index: 111;
  background: #f5f6f7;
}
.coin {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: #f5f6f7;
  &-list {
    padding: 30px;
    display: flex;
    align-items: center;
    justify-content: space-around;
    flex-wrap: wrap;
    overflow: hidden;
    &-li {
      width: 320px;
      height: 120px;
      display: flex;
      align-items: center;
      padding: 0 40px;
      background: #fff;
      border-radius: 15px;
      margin-bottom: 40px;
      box-shadow: 5px 5px 10px #ebeff6;
      box-sizing: border-box;

      &-icon {
        width: 50px;
        height: 50px;
        display: inline-block;
        img {
          width: 100%;
          height: 100%;
        }
      }

      &-content {
        margin-left: 20px;
        display: flex;
        align-items: flex-start;
        flex-direction: column;
        &-name {
          color: #111e4b;
          font-size: 30px;
        }
        &-detail {
          color: #909fae;
          font-size: 22px;
        }
      }
    }
  }
}

.common-page {
  position: fixed;
  top: 100px;
  bottom: 0px;
  left: 0;
  right: 0;
  background: #f5f6f7;
}
.container {
  &__main {
    padding-bottom: 100px;
    margin: 40px 30px;
    background: rgba(255, 255, 255, 1);
    box-shadow: 0px 9px 29px 0px rgba(204, 205, 206, 0.36);
    border-radius: 10px;
    &__list {
      padding: 30px 0;
      &__card {
        margin-top: 20px;
        height: 100px;
        .icon-box {
          width: 100px;
          text-align: center;
          line-height: 70px;
          img {
            width: 40px;
            height: 40px;
          }
        }
        .info-box {
          width: calc(100% - 100px);
          .info {
            line-height: 100px;
            font-size: 30px;
            &-title {
              font-family: PingFangSC-Regular;
              font-weight: 400;
              color: rgba(145, 151, 167, 1);
            }
            &-value {
              font-family: PingFangSC-Medium;
              font-weight: 500;
              color: rgba(12, 30, 72, 1);
              span {
                line-height: 55px;
                img {
                  margin-top: -10px;
                  width: 45px;
                  height: 45px;
                  vertical-align: middle;
                  text-align: center;
                }
              }
              .lend-number {
                height: 100px;
                line-height: 100px;
                text-align: right;
                font-weight: 500;
                font-size: 30px;
                color: rgba(12, 30, 72, 1);
                display: inline-block;
                border: 0;
                outline: none;
                background-color: #fff;
              }
            }
            &-arrow-right {
              width: 80px;
              height: 100px;
              line-height: 100px;
              text-align: center;
              img {
                margin-bottom: 30px;
                width: 20px;
              }
            }
          }
          .line {
            height: 0;
            border-bottom: 2px solid #e0e0e0;
          }
        }
      }
    }
    &__button {
      margin: 50px auto;
      width: 590px;
      height: 88px;
      background: rgba(158, 167, 184, 1);
      border-radius: 44px;
      text-align: center;
      line-height: 88px;
      font-size: 30px;
      font-family: PingFangSC-Regular;
      font-weight: 400;
      color: rgba(255, 255, 255, 1);
    }
  }
}

.popup-button {
  height: 80px;
  line-height: 80px;
  background-color: #f3f3f3;
  font-size: 30px;
}
.token-type-container {
  width: 500px;
  .token-type-list {
    padding: 20px;
    &__card {
      float: left;
      position: relative;
      margin: 15px;
      width: 200px;
      height: 80px;
      background: rgba(255, 255, 255, 1);
      box-shadow: 0px 9px 16px 0px rgba(195, 211, 246, 0.2);
      border-radius: 10px;
      .coin-logo {
        display: inline-block;
        margin-left: 22px;

        width: 40px;
        height: 40px;
        img {
          margin-top: 20px;
          width: 40px;
          height: 40px;
          vertical-align: middle;
          text-align: center;
        }
      }
      .shorthand {
        display: inline-block;
        margin-left: 10px;
        font-size: 26px;
        font-family: PingFangSC-Semibold;
        font-weight: 600;
        color: rgba(12, 30, 72, 1);
        line-height: 36px;
      }
      .whole-put-together {
        display: inline-block;
        margin-left: 80px;
        font-size: 20px;
        font-family: PingFangSC-Regular;
        font-weight: 400;
        color: rgba(140, 159, 173, 1);
        line-height: 36px;
      }
    }
  }
}

.bg-blue {
  background: #5170eb;
}

.date {
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: 130px;
  left: 0;
  z-index: 100;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);

  &-content {
    position: fixed;
    z-index: 1001;
    width: 100%;
    bottom: 110px;
    left: 0;
    text-align: center;

    &-title {
      background: #f7f7f7;
      color: #111e4b;
      font-size: 34px;
      height: 90px;
      line-height: 90px;
      border-top-right-radius: 12px;
      border-top-left-radius: 12px;
    }

    &-days {
      color: #111e4b;
      font-size: 36px;
      height: 115px;
      line-height: 115px;
      position: relative;
      background: #fff;
      border-bottom: 1px solid #f7f7f7;
    }

    .choose::after {
      content: "";
      width: 41px;
      height: 33px;
      display: block;
      line-height: 115px;
      position: absolute;
      right: 260px;
      bottom: 45px;
      background: url("../../assets/img/right.png") no-repeat center;
      background-size: contain;
    }
  }
}
</style>