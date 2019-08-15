<template>
  <div class="trans">
    <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../assets/img/return_back.png" alt class="image-center" />
      </span>
      交易记录
    </div>
    <p class="trans-top">
      <span class="trans-top-icon">
        <img :src="iconSrc" alt />
      </span>
      <label class="trans-top-name">{{this.coinType}}</label>
      <span class="trans-top-num">{{coinAmount | chainBalanceConvert(decimal)}}</span>
    </p>
    <ul class="trans-bottom" v-if="list.length">
      <li class="trans-bottom-li" v-for="item in list" :key="item.index">
        {{item.ts | datefmt('YYYY-MM-DD HH:mm')}}
        <span class="red" v-show="item.amount>=0">
          +{{item.amount}}
          <label class="small">{{coinType}}</label>
        </span>
        <span class="green" v-show="item.amount<0">
          {{item.amount }}
          <label class="small">{{coinType}}</label>
        </span>
      </li>
    </ul>
    <ul class="trans-bottom" v-else>
      <li class="trans-bottom-li center">暂无数据</li>
    </ul>
  </div>
</template>

<script>
import service from "../assets/js/commonService";
import config from "../assets/js/config";

export default {
  data() {
    return {
      flag: false,
      list: [],
      coinType: "",
      coinAmount: "",
      decimal: "",
      iconSrc: "",
      account: ""
    };
  },
  created() {
    this.coinType = this.$route.query.name;
    this.coinAmount = this.$route.query.num;
    this.decimal = this.$route.query.decimal;
    // let local_config = JSON.parse(config.getItem("config"))[this.coinType];
    this.iconSrc = this.$route.query.logoUrl;
    // this.account = local_config.account;
    this.getList();
  },
  methods: {
    toBack() {
      this.$router.back();
    },
    getList() {
      let that = this;
      service
        .getTradeFlow({
          account: this.account,
          symbol: this.coinType
        })
        .then(rep => {
          if (rep.status === 200) {
            let list = rep.data.page.content;
            if (list.length > 0) {
              that.flag = true;
              that.list = list;
            } else {
              that.flag = false;
            }
          } else {
            // alert(rep.msg);
          }
        });
    }
  }
};
</script>

<style scoped lang="scss">
@import "../assets/scss/base";

.header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 1000;
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
.trans {
  margin-top: 100px;
  &-top {
    background: #f5f6f7;
    height: 100px;
    line-height: 100px;
    padding: 0 30px;
    &-icon {
      width: 61px;
      height: 61px;
      img {
        width: 61px;
        height: 61px;
        vertical-align: middle;
        text-align: center;
      }
    }
    &-name {
      color: #111e4b;
      font-size: 30px;
      margin-left: 18px;
      font-weight: bold;
    }
    &-num {
      float: right;
      color: #0c1e48;
      font-size: 32px;
      font-weight: bold;
      margin-right: 30px;
    }
  }
  &-bottom {
    font-weight: bold;
    padding: 0 30px;
    &-li {
      height: 90px;
      line-height: 90px;
      border-bottom: 1px solid #e0e0e0;
      color: #9297a8;
      font-size: 26px;

      .red {
        color: #e84a55;
        float: right;
        font-size: 30px;
      }
      .green {
        color: #52ae14;
        float: right;
        font-size: 30px;
      }
    }
    .center {
      text-align: center !important;
    }
  }
}
</style>
