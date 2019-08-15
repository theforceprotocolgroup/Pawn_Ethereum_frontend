<template>
  <div>
    <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../../assets/img/return_back.png" alt class="image-center" />
      </span>
      借币
    </div>
    <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page">
      <!-- header -->
      <div class="container">
        <!-- 借币信息 -->
        <section class="container__section">
          <header>
            <span class="line"></span>
            <span>借币信息</span>
          </header>
          <ul class="list-box">
            <li class="card-box" v-for="(item,index) in riskControl" :key="item.index">
              <div class="clearfix">
                <span class="card-box-title float-left">{{item.title}}</span>
                <span
                  class="card-box-value float-right"
                  :class="{blue:item.type}"
                  @click="toJumpContract(item.type)"
                >
                  <span v-if="index<4">{{borrowInfo[item.value]}}</span>
                  <span
                    v-else
                  >{{borrowInfo[item.value] |decimals_symbol}} {{borrowInfo['borrowTokenType']}}</span>
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- 质押说明 -->
        <section class="container__section">
          <header>
            <span class="line"></span>
            <span>质押说明</span>
          </header>
          <ul class="list-box">
            <li class="card-box" v-for="(item,index) in lendInstruct" :key="item.index">
              <div class="clearfix">
                <span class="card-box-title float-left">{{item.title}}</span>
                <span
                  class="card-box-value float-right"
                  :class="{blue:item.type}"
                  @click="toJumpTrading(item.type)"
                >
                  <span v-if="index<1">{{pledgeInfo[item.value]}}</span>
                  <span v-else>{{pledgeInfo[item.value]}}%</span>
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- 实际支付 -->
        <section class="container__section">
          <div class="actual-payment">
            <span>实际支付：</span>
            <span>{{actualPayment|decimals_symbol}}</span>
          </div>
        </section>

        <!-- 立即借币 -->

        <section class="container__section">
          <div class="confirm-button">
            <div class="prototcol">
              <span class="check-icon" @click="checkValue = !checkValue">
                <img
                  v-if="checkValue"
                  src="../../assets/img/borrow/selected.svg"
                  width="13px"
                  alt
                  srcset
                />
                <img v-else src="../../assets/img/borrow/unselect.svg" width="15px" alt srcset />
              </span>
              <span>阅读并同意</span>
              <span class="blue" @click="toProtocol">《借币协议》</span>
            </div>
            <div
              class="lend-button"
              :style="{background:checkValue?'#5170eb':'#9ea7b8'}"
              @click="immediateLend"
            >立即借币</div>
          </div>
        </section>
      </div>
    </scroll>
    <tips :show-flag="tips.showTips" :content="tips.tipsContent" @hidetips="tips.showTips=false"></tips>
    <pop
      :content="popContent"
      :show="showPop"
      :status="resStatus"
      @sure="confirmPop"
      @cancel="closePop"
    ></pop>
  </div>
</template>

<script>
import bottom from "@/components/children/footer";
import Scroll from "@/components/children/scroll_init.vue";
import tips from "@/components/children/tips";
import pop from "@/components/children/web3pop";
import ercContract from "@/assets/js/ercContract";

import Api from "@/assets/js/commonService";
export default {
  name: "LendDetail",
  components: {
    bottom,
    Scroll,
    tips,
    pop
  },
  props: ["paramsBaseData"],
  data() {
    return {
      probeType: 3,
      listenScroll: true,
      // 弹框
      tips: {
        tipsContent: "",
        showTips: false
      },
      // pop
      popContent: "借币中",
      showPop: false,
      resStatus: 0,

      // 借币信息
      riskControl: [
        {
          title: "借币种类",
          value: "borrowTokenType",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "借币数量",
          value: "borrowCount",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "日利率",
          value: "borrowDailyRate",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "借款期限",
          value: "borrowDateLine",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "利息",
          value: "borrowfeeRate",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "交易手续费",
          value: "borrowPoundage",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "还款总额",
          value: "reimbursementTotal",
          type: 0 // 0 不能跳转| 1 跳转
        }
      ],
      // 借币说明
      lendInstruct: [
        {
          title: "质押币种",
          value: "pledgeTokenType",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "质押率",
          value: "minRate",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "补充线",
          value: "alarmRate",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "平仓线",
          value: "maxRate",
          type: 0 // 0 不能跳转| 1 跳转
        }
      ],
      checkValue: false,

      // basedata
      baseData: "",
      actualPayment: "10.01.BTC",
      // 质押说明
      pledgeInfo: {
        pledgeTokenType: "",
        minRate: "",
        alarmRate: "",
        maxRate: ""
      },
      // 借币信息
      borrowInfo: {
        borrowTokenType: "",
        borrowCount: "",
        borrowDailyRate: "",
        borrowfeeRate: "",
        borrowDateLine: "",
        borrowPoundage: "",
        reimbursementTotal: ""
      },
      // web3js 请求
      isCallback: true,
      AmountError: false
    };
  },
  mounted() {
    this.baseData = JSON.parse(this.paramsBaseData);
    console.log(this.baseData);
    this.getBaseData();
  },
  methods: {
    /**
     * @description 弹框
     *
     */
    showTip(_msg) {
      if (_msg) {
        //防止出现黑点
        this.tips.tipsContent = _msg;
        this.tips.showTips = true;
      }
    },
    /**
     * @description pop弹框
     *
     */
    closePop() {
      this.showPop = false;
    },
    confirmPop() {
      this.showPop = false;
    },
    statusPop() {
      this.showPop = true;
    },
    /**
     * @description 页面数据传参初始化
     * @param {Object}
     */
    dataInit(res) {
      // 借币信息
      this.borrowInfo.borrowTokenType = this.baseData.lendTokenType;
      this.borrowInfo.borrowCount = this.baseData.lendNumber;
      this.borrowInfo.borrowDailyRate = this.baseData.dailyRate;
      this.borrowInfo.borrowDateLine = this.baseData.dateLine;
      // 请求数据
      this.borrowInfo.borrowfeeRate = res.profitAmount;
      this.borrowInfo.borrowPoundage = res.totalFeeAmount;
      this.borrowInfo.reimbursementTotal = res.repaymentAmount;

      // 质押说明
      this.pledgeInfo.pledgeTokenType = this.baseData.pledgeTokenType;
      // 请求数据
      this.pledgeInfo.minRate = res.defaultLine;
      this.pledgeInfo.alarmRate = res.marginLine;
      this.pledgeInfo.maxRate = res.closeLine;

      this.actualPayment = res.pledgeAmount;
    },
    // api 调用
    /**
     * @description 获取页面基础数据
     */
    getBaseData() {
      Api.calcValue({
        borrowedSymbol: this.baseData.lendTokenType,
        borrowedAmount: this.baseData.lendNumber,
        interestRate: parseFloat(this.baseData.dailyRate),
        days: parseFloat(this.baseData.dateLine),
        pledgeSymbol: this.baseData.pledgeTokenType
      }).then(res => {
        if (res.status === 200) {
          this.dataInit(res.data);
          console.log(res);
        } else {
          this.showTip(res.msg);
        }
      });
    },
    /**
     * @description 立即借币
     */
    immediateLend() {
      if (this.checkValue) {
        // this.$router.push("/main/lend-status");
        this.toBorrow();
      } else {
        this.showTip("请阅读并同意《借币协议》", "middle");
      }
    },
    /**
     * @description 后退
     */
    toBack() {
      this.$router.back();
    },
    /**
     * @description 跳转协议
     */
    toProtocol() {
      this.$router.push("/protocol");
    },
    /**
     * @description 跳转交易hash
     */
    toJumpTrading(value) {
      console.log(value);
    },
    /**
     * @description 跳转合约地址
     */
    toJumpContract(value) {
      console.log(value);
    },
    // web3js
    toBorrow() {
      if (this.borrowInfo.borrowCount < 1) {
        this.showTip("请输入大于1的借币数量");
        return false;
      }
      this.isCallback = false;
      let currAccountName = window.ethereum.selectedAddress;
      if (!currAccountName) {
        this.showTip("Please Login MetaMask!");
        return;
      }
      Api.createBorrowOrder({
        account: currAccountName,
        borrowedSymbol: this.borrowInfo.borrowTokenType,
        borrowedAmount: Number(this.borrowInfo.borrowCount),
        interestRate: Number(parseFloat(this.borrowInfo.borrowDailyRate)),
        days: parseFloat(this.borrowInfo.borrowDateLine),
        pledgeSymbol: this.pledgeInfo.pledgeTokenType,
        pledgeAmount: Number(this.actualPayment)
      }).then(rep => {
        if (rep.status === 200) {
          this.statusPop();
          this.showPop = true;
          this.callContract(rep);
        } else {
          this.showTip(rep.msg);
        }
      });
    },
    /**
     *  @description approve
     * params {tokenAddress, fromAddress_, needAmount,loading,ending}
     */
    callContract(rep) {
      let self = this;
      console.log(rep);
      ercContract.ercStake.approve(
        rep.data.tokenGive,
        window.ethereum.selectedAddress,
        rep.data.amountGive,
        function(transactionHash) {
          self.isCallback = true;
          self.showPop = true;
          self.resStatus = 0;
        },
        function(err, success) {
          if (err) {
            //approve 失败
            self.resStatus = 110;
            console.log("Approve error: ", err);
            return;
          }
          if (success) {
            //to call borrow;
            self.showPop = true;
            self.resStatus = 1;
            ercContract.ercStake
              .borrow_(
                rep.data.tokenGet,
                rep.data.amountGet,
                rep.data.tokenGive,
                rep.data.amountGive,
                rep.data.lendingCycle,
                rep.data.pledgeRate,
                rep.data.interestRate,
                rep.data.feeRate
              )
              .then(receipt => {
                if (receipt.events.Borrow) {
                  console.log("contract.methods.borrow.receipt: ", receipt);
                  //https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#id23
                  let respHash = receipt.events.Borrow.returnValues.hash;
                  let txHash = receipt.transactionHash;
                  let orderNumber = rep.data.orderNumber;
                  console.log("borrow respHash: ", respHash);
                  console.log("borrow txHash: ", txHash);

                  if (respHash === receipt.borrowContext.orderHash) {
                    // window.success("success");
                    Api.borrow({
                      nonce: receipt.borrowContext.nonce,
                      orderHash: respHash,
                      txId: txHash,
                      orderNumber: orderNumber,
                      account: window.ethereum.selectedAddress
                    }).then(rep => {
                      if (rep.status === 200) {
                        console.log(rep);
                        self.resStatus = 2;
                        setTimeout(() => {
                          self.showPop = false;
                          self.$router.push(`/order?list=${orderNumber}`);
                        }, 2000);
                      } else {
                        window.error(rep.msg);
                      }
                    });
                  } else {
                    self.resStatus = 110;
                    console.log(
                      "hash不同，分别为" + repHash + ":" + _this.orderHash
                    );
                    window.error("orderHash different:" + repHash);
                  }
                }
              })
              .catch(function(err) {
                self.resStatus = 110;
                console.log("borror error: ", err);
                //交易失败处理
              });
          }
        }
      );
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/style.scss";
@import "../../assets/scss/color.scss";

.common-page {
  position: fixed;
  top: 100px;
  bottom: 0px;
  left: 0;
  right: 0;
  background: #f5f6f7;
}
.header {
  position: fixed;
  z-index: 110;
  top: 0;
  left: 0;
  right: 0;
  height: 100px;
  line-height: 100px;
  font-size: 36px;
  text-align: center;
  font-family: PingFangSC-Semibold;
  background: #fff;
  border-bottom: 1px solid #e2e2e2;
  font-weight: 600;
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
.container {
  &__header {
    background: url("../../assets/img/lend/bg.png");
    background-size: cover;
    &__content {
      padding: 30px;
      h2 {
        height: 44px;
        font-size: 32px;
        font-family: PingFangSC-Light;
        font-weight: 300;
        color: rgba(249, 249, 249, 1);
        line-height: 44px;
      }
      h1 {
        height: 118px;
        font-size: 98px;
        font-family: HelveticaNeue-Medium;
        font-weight: 500;
        color: rgba(249, 249, 249, 1);
        line-height: 120px;
      }
    }
    &__footer-cell {
      display: flex;
      height: 128px;

      background: rgba(107, 132, 233, 0.2);
      font-size: 12px;
      font-family: PingFangSC-Light;
      font-weight: 300;
      color: rgba(249, 249, 249, 1);
      .cell-box {
        flex: 1;
        padding: 25px;
        line-height: 40px;
        h2 {
          color: rgba(249, 249, 249, 1);
          font-size: 24px;
        }
        h1 {
          color: #fff;
          font-size: 44px;
        }
      }
    }
  }
  &__section {
    header {
      padding: 30px 50px;
      height: 50px;
      line-height: 50px;
      font-size: 36px;
      font-family: PingFangSC-Medium;
      font-weight: 500;
      color: rgba(51, 51, 51, 1);
      line-height: 50px;
      .line {
        display: inline-block;
        width: 8px;
        height: 30px;
        background: #5170eb;
      }
    }
    .list-box {
      padding: 30px 50px;
      background: #fff;
      .card-box {
        line-height: 100px;
        font-size: 30px;
        font-family: PingFangSC-Medium;
        font-weight: 500;
        color: rgba(158, 167, 184, 1);
        border-bottom: 1px solid #dedede;
        &:last-child {
          border: 0;
        }
        &-title {
          color: rgba(158, 167, 184, 1);
        }
        &-value {
          color: rgba(102, 102, 102, 1);
        }
      }
    }
    .actual-payment {
      padding: 100px 50px;
      span {
        &:nth-of-type(1) {
          font-size: 30px;
          font-family: PingFangSC-Medium;
          font-weight: 500;
          color: rgba(51, 51, 51, 1);
          line-height: 42px;
        }
        &:nth-of-type(2) {
          font-size: 48px;
          font-family: PingFangHK-Medium;
          font-weight: 500;
          color: rgba(235, 81, 81, 1);
          line-height: 66px;
        }
      }
    }
    .confirm-button {
      text-align: center;
      .prototcol {
        padding-left: 30px;
        height: 90px;
        line-height: 90px;
        background: #fff;
        text-align: left;
        .check-icon {
          display: inline-block;
          padding: 5px;
          width: 20px;
          height: 90px;
          img {
            vertical-align: middle;
            text-align: center;
          }
        }
        input {
          width: 50px;
          height: 50px;
          background: #333;
        }
      }
      .lend-button {
        height: 100px;
        line-height: 100px;
        color: #fff;
        font-size: 35px;
      }
    }
  }
}
</style>