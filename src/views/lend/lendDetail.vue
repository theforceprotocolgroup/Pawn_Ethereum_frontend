<template>
  <div>
    <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../../assets/img/return_back.png" alt class="image-center" />
      </span>
      出借
    </div>
    <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page">
      <!-- header -->
      <div class="container">
        <section class="container__header text-center">
          <div class="container__header__content">
            <h2>日利率</h2>
            <h1>{{railyRate}}%</h1>
          </div>
          <div class="container__header__footer-cell">
            <div class="cell-box">
              <h2>借币数量({{tokenType}})</h2>
              <h1>{{lendNumber}}</h1>
            </div>
            <div class="cell-box">
              <h2>预期收益({{tokenType}})</h2>
              <h1>{{profitAmount|decimals_symbol}}</h1>
            </div>
            <div class="cell-box">
              <h2>借款期限({{dateLineType|dateLineFormater}})</h2>
              <h1>{{dateLine}}</h1>
            </div>
          </div>
        </section>
        <!-- 出借说明 -->
        <section class="container__section">
          <header>
            <span class="line"></span>
            <span>出借说明</span>
          </header>
          <ul class="list-box">
            <li class="card-box" v-for="item in lendInstruct" :key="item.index">
              <div class="clearfix">
                <span class="card-box-title float-left">{{item.title}}</span>
                <span
                  class="card-box-value float-right"
                  :class="{blue:item.type}"
                  @click="toJumpTrading(lendInstructInfo[item.value])"
                >
                  <span v-if="item.type">{{lendInstructInfo[item.value] | formatName|formatName}}</span>
                  <span v-else>{{lendInstructInfo[item.value]}}</span>
                </span>
              </div>
            </li>
          </ul>
        </section>
        <!-- 风险控制 -->
        <section class="container__section">
          <header>
            <span class="line"></span>
            <span>风险控制</span>
          </header>
          <ul class="list-box">
            <li class="card-box" v-for="(item,index) in riskControl" :key="item.index">
              <div class="clearfix">
                <span class="card-box-title float-left">{{item.title}}</span>
                <span
                  class="card-box-value float-right"
                  :class="{blue:item.type}"
                  @click="toJumpContract(riskControlInfo[item.value])"
                >
                  <span v-if="item.type">{{riskControlInfo[item.value] | formatName}}</span>
                  <span v-else>
                    <span v-if="index<2">{{riskControlInfo[item.value]}}</span>
                    <span v-else>{{riskControlInfo[item.value]}}%</span>
                  </span>
                </span>
              </div>
            </li>
          </ul>
        </section>

        <!-- 实际支付 -->
        <section class="container__section">
          <div class="actual-payment">
            <span>实际支付：</span>
            <span>{{actualPayment}}</span>
          </div>
        </section>

        <!-- 立即出借 -->

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
              <span class="blue" @click="toProtocol">《出借协议》</span>
            </div>
            <div
              class="lend-button"
              :style="{background:checkValue?'#5170eb':'#9ea7b8'}"
              @click="immediateBorrow"
            >立即出借</div>
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
import pop from "@/components/children/web3pop";
import tips from "@/components/children/tips";

import Api from "@/assets/js/commonService";
import ercContract from "@/assets/js/ercContract";

import config from "@/assets/js/config";
import { floorFix } from "@/assets/js/filter.js";
import BigNumber from "@/assets/js/bignumber";

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
      //  提示框
      tips: {
        tipsContent: "",
        showTips: false
      },

      // pop
      popContent: "借币中",
      showPop: false,
      resStatus: 0,

      // 出借说明
      lendInstruct: [
        {
          title: "订单说明",
          value: "instruct",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "计息规则",
          value: "interestRule",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "还款规则",
          value: "alsoRule",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "交易哈希",
          value: "txHash",
          type: 1 // 0 不能跳转| 1 跳转
        }
      ],
      // 风险控制
      riskControl: [
        {
          title: "质押资产",
          value: "pledgeAmount",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "合约地址",
          value: "contractAddress",
          type: 1 // 0 不能跳转| 1 跳转
        },
        {
          title: "当前质押率",
          value: "currentPledgeLine",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "补充线",
          value: "marginLine",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "平仓线",
          value: "closeLine",
          type: 0 // 0 不能跳转| 1 跳转
        },
        {
          title: "交易手续费",
          value: "feeRate",
          type: 0 // 0 不能跳转| 1 跳转
        }
      ],
      checkValue: false,
      // basedata
      lendNumber: "",
      profitAmount: "",
      railyRate: "",
      tokenType: "",
      dateLineType: "",
      dateLine: "",

      baseData: "",
      isCallback: false,
      actualPayment: "10.01.BTC",
      // 出借说明
      lendInstructInfo: {
        instruct: "Kcash钱包",
        interestRule: "成交次日计息",
        alsoRule: "借贷期限+1日",
        txHash: ""
      },
      // 风险控制
      riskControlInfo: {
        pledgeAmount: "",
        contractAddress: "",
        currentPledgeLine: "",
        closeLine: "",
        marginLine: "",
        feeRate: ""
      }
    };
  },
  filters: {
    dateLineFormater: function(value) {
      switch (value) {
        case "DAYS":
          return "天";
          break;
        default:
          return "月";
          break;
      }
    }
  },
  mounted() {
    this.baseData = JSON.parse(this.paramsBaseData);
    this.getBaseData();
  },
  methods: {
    /**
     * @description 提示框
     */
    showTip(_msg) {
      if (_msg) {
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
      // 基础信息
      this.lendNumber = this.baseData.borrowedAmount;
      this.railyRate = this.baseData.interestRate;
      this.tokenType = this.baseData.borrowedSymbol;
      this.dateLineType = this.baseData.borrowedSymbol;
      this.dateLine = this.baseData.days;
      this.profitAmount = res.profitAmount;

      // 出借说明
      this.lendInstructInfo.txHash = res.txHash;

      // 风险控制
      this.riskControlInfo.pledgeAmount =
        this.baseData.pledgeAmount + this.baseData.pledgeSymbol;

      this.riskControlInfo.contractAddress = res.contractAddress;
      this.riskControlInfo.currentPledgeLine = res.currentPledgeLine;
      this.riskControlInfo.closeLine = res.closeLine;
      this.riskControlInfo.marginLine = res.marginLine;
      this.riskControlInfo.feeRate = this.baseData.feeRate;
      // 请求数据
      this.actualPayment = res.reallyLoanedAmount;
    },
    // api 调用
    /**
     * @description 获取页面基础数据
     */
    getBaseData() {
      Api.getLendDetail({
        orderNumber: this.baseData.orderNumber,
        account: window.ethereum.selectedAddress
      }).then(res => {
        if (res.status === 200) {
          console.log(res);
          this.dataInit(res.data);
        } else {
          this.showTip(res.msg);
        }
      });
    },
    /**
     * @description 立即出借
     */
    immediateBorrow() {
      if (this.checkValue) {
        this.isCallback = false;
        Api.getLendConfig({
          orderNumber: this.baseData.orderNumber
        }).then(rep => {
          console.log(rep);
          if (rep.status === 200) {
            this.statusPop();
            this.showPop = true;
            this.callContract(rep);
          } else {
            this.showTip(rep.msg);
          }
        });
        //borrower, hash, token, feeAmount, totalAmount, order_id
        // this.$router.push("/main/lend-status");
      } else {
        this.showTip("请阅读并同意《出借协议》");
      }
    },
    /**
     *  @description approve
     * params {tokenAddress, fromAddress_, needAmount,loading,ending}
     */
    callContract(rep) {
      let self = this;
      console.log(rep);
      ercContract.ercStake.approve(
        rep.data.borrowContract,
        window.ethereum.selectedAddress,
        rep.data.totalAmount,
        function(transactionHash) {
          console.log("loading...", transactionHash);
        },
        function(err, success) {
          if (err) {
            //approve 失败
            console.log("Approve error: ", err);
            return;
          }
          if (success) {
            let orderData = {
              borrower: self.baseData.initiator,
              hash: self.baseData.orderHash,
              token: self.baseData.borrowedAccount,
              feeAmount: rep.data.feeAmount,
              totalAmount: rep.data.totalAmount
            };
            console.log(orderData);
            //to call borrow;
            self.isCallback = true;
            self.resStatus = 0;
            ercContract.ercStake
              .lend_(
                orderData.borrower,
                orderData.hash,
                orderData.token,
                orderData.feeAmount,
                orderData.totalAmount
              )
              .then(receipt => {
                console.log(receipt);
                if (receipt.events.Lend) {
                  self.resStatus = 3;
                  console.log("contract.methods.borrow.receipt: ", receipt);
                  //https://web3js.readthedocs.io/en/v1.2.0/web3-eth-contract.html#id23
                  let orderNumber = self.baseData.orderNumber;
                  let respHash = receipt.events.Lend.returnValues.txId;
                  let txHash = receipt.transactionHash;
                  console.log("borrow respHash: ", respHash);
                  console.log("borrow txHash: ", txHash);
                  if (respHash === self.lendInstructInfo.txHash) {
                    Api.lend({
                      account: window.ethereum.selectedAddress,
                      txId: txHash,
                      orderNumber: orderNumber
                    }).then(rep => {
                      if (rep.status === 200) {
                        self.resStatus = 4;
                        setTimeout(() => {
                          self.showPop = false;
                          self.$router.push(`/order?list=${orderNumber}`);
                        }, 2000);
                      } else {
                        this.showTip(res.msg)
                      }
                    });
                  } else {
                    self.resStatus = 110;
                    console.log(
                      "hash不同，分别为" + repHash + ":" + _this.orderHash
                    );
                  }
                }
              })
              .catch(function(err) {
                self.resStatus = 110;
                console.log("lend error: ", err);
                //交易失败处理
              });
          }
        }
      );
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
      window.open(`https://rinkeby.etherscan.io/tx/${value}`);
    },
    /**
     * @description 跳转合约地址
     */
    toJumpContract(value) {
      window.open(`https://rinkeby.etherscan.io/address/${value}`);
    }
  }
};
</script>

<style lang="scss" scoped>
@import "../../assets/scss/style.scss";
@import "../../assets/scss/color.scss";

.common-page {
  position: fixed;
  top: 120px;
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
  height: 120px;
  line-height: 120px;
  font-size: 36px;
  text-align: center;
  font-family: PingFangSC-Semibold;
  font-weight: 600;
  border-bottom: 1px solid #e2e2e2;
  background: #fff;
  color: #0c1e48;
  .icon-arrow {
    position: inherit;
    top: 0;
    left: 0;
    right: 0;
    width: 80px;
    height: 120px;
    img {
      margin-bottom: 50px;
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