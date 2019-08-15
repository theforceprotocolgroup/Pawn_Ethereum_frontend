<template>
  <div>
    <scroll :probeType="probeType" :listenScroll="listenScroll" class="common-page">
      <div class="asset">
        <div class="loading" v-if="!isLoad">Loading...</div>
        <div class="asset-top" v-if="isLoad">
          <div class="asset-top-info">
            <i class="asset-top-info-icon"></i>
            <div class="user-info">
              <span class="phone">{{account | formatName}}</span>
            </div>
          </div>
          <p class="asset-top-num">
            {{total | decimals_symbol(currency)|decimals_4(2,total)}}
            <!-- <label class="asset-top-num-small">{{currency}}</label> -->
          </p>
        </div>
        <template v-if="isLoad">
          <ul class="asset-bottom">
            <li
              class="asset-bottom-content"
              @click="toDetail(item.tokenSymbol,ercBalance[index],item.decimal,item.logoUrl )"
              v-for="(item,index) in list"
              :key="item.index"
            >
              <img :src="item.logoUrl" class="asset-bottom-content-icon" />
              <p class="asset-bottom-content-detail">
                <label class="name">{{item.tokenSymbol}}</label>
                <i class="other"></i>
                <label class="num">{{ercBalance[index] | chainBalanceConvert(item.decimal)}}</label>
              </p>
            </li>
          </ul>
          <div v-if="list===null">
            <no-data></no-data>
          </div>
        </template>
      </div>
    </scroll>
    <bottom tab="asset"></bottom>
  </div>
</template>

<script>
import BigNumber from "../assets/js/bignumber";

import service from "../assets/js/commonService";
import Scroll from "./children/scroll_init.vue";
import LoadingMore from "../components/loading-more/loading-more.vue";
import NoData from "../components/NoData.vue";
import Bottom from "./children/footer";
import ercStake from "../assets/js/ercContract";

export default {
  components: {
    Scroll,
    LoadingMore,
    NoData,
    Bottom
  },
  data() {
    return {
      isLoad: false,
      list: null,
      phone: null,
      countryCode: null,
      total: null,
      currency: null,
      account: null,
      hasMore: false,
      // loadingTitle: '下拉加载更多',
      pullup: true,
      probeType: 3,
      pageNo: 0,
      pageSize: 20,
      isLoading: true,
      listenScroll: true,
      ercBalance: []
    };
  },
  created() {
    this.account = window.ethereum.selectedAddress;
    service.myAsset({ account: window.ethereum.selectedAddress }).then(rep => {
      if (rep.status === 200) {
        this.isLoad = true;
        this.list = rep.data.tokenList;
        let arr = rep.data.tokenList.map(item => {
          return item.tokenContract;
        });
        this.getBalance(arr);
      }
    });
  },
  methods: {
    toDetail(coinType, coinAmount, decimal, logoUrl) {
      console.log(coinType);
      this.$router.push({
        path: "/transaction",
        query: {
          name: coinType,
          num: coinAmount,
          decimal: decimal,
          logoUrl: logoUrl
        }
      });
    },
    getBalance(list) {
      let arr = [];
      list.forEach(item => {
        arr.push(
          ercStake.ercStake.checkBalance(item, window.ethereum.selectedAddress)
        );
      });
      Promise.all(arr).then(res => {
        console.log("=======", res);
        this.ercBalance = res;
        this.totalComputed();
      });
    },
    totalComputed() {
      console.log(this.ercBalance);
      this.list.forEach((item, index) => {
        this.total +=
          item.quotesUSD *
          this.chainBalanceConvert(this.ercBalance[index], item.decimal);
      });
    },
    chainBalanceConvert(input, decimal) {
      let res;
      if (input) {
        let pow = new BigNumber(10).exponentiatedBy(decimal);
        let num = new BigNumber(input).dividedBy(pow).toFixed(4);
        res = Number(num.toString());
      } else {
        res = Number(0);
      }
      return res;
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
  background: #f5f6f7;
}

.asset {
  background: #f5f6f7;

  .loading {
    padding-top: 200px;
    text-align: center;
    font-size: 30px;
    color: #333;
  }

  &-top {
    background: url("../assets/img/assetBg.jpg") no-repeat center;
    background-size: cover;
    color: #fff;

    &-info {
      text-align: center;
      padding-top: 66px;
      margin-bottom: 30px;
      display: flex;
      align-items: center;
      justify-content: center;

      &-icon {
        width: 22px;
        height: 27px;
        background: url("../assets/img/usertx.png") no-repeat center;
        background-size: cover;
        display: inline-block;
      }

      .user-info {
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: flex-start;

        .phone {
          color: #b7c1eb;
          font-size: 26px;
          margin-left: 20px;
          text-align: center;
        }
      }
    }

    &-num {
      font-size: 48px;
      text-align: center;
      color: #fff;
      padding-bottom: 80px;

      &-small {
        font-size: 40px;
      }
    }
  }

  &-bottom {
    margin-top: 32px;
    margin-left: 28px;
    margin-right: 28px;

    &-content {
      margin-bottom: 20px;
      position: relative;

      &-icon {
        position: absolute;
        bottom: 26px;
        left: 20px;
        width: 50px;
        height: 50px;
        /*background: url("../assets/img/USDTIcon.png") no-repeat center;*/
        /*background-size: contain;*/
        z-index: 2;
      }

      &-detail {
        background: #fff;
        border-radius: 15px;
        height: 107px;
        line-height: 107px;
        padding-left: 100px;
        padding-right: 20px;

        .name {
          color: #111e4b;
          font-size: 30px;
          font-weight: 400;
        }

        .num {
          color: #0c1e48;
          font-size: 32px;
          font-weight: 400;
          float: right;
          margin-right: 20px;
        }

        .other {
          float: right;
          width: 12px;
          height: 24px;
          background: url("../assets/img/arrow.png") no-repeat center;
          background-size: contain;
          display: inline-block;
          margin-right: 10px;
          margin-top: 40px;
        }
      }
    }
  }
}
</style>
