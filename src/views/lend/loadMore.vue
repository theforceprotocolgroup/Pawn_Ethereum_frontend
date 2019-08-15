<template>
  <div class="home">
    <div class="header">
      <span class="icon-arrow"></span>
      出借
    </div>
    <div class="home-body">
      <ul class="home-body-sort">
        <li class="home-body-sort-li" @click.stop.prevent="sortBy('interest')">
          {{$t('borrow.annualInterest')}}
          <i :class="[interest_asc===true?'sort-up':'sort-down']"></i>
        </li>
        <li class="home-body-sort-li" @click.stop.prevent="sortBy('borrowedAmount')">
          {{$t('borrow.tokenAmount')}}
          <i :class="[borrowedAmount_asc===true?'sort-up':'sort-down']"></i>
        </li>
        <li class="home-body-sort-li" @click.stop.prevent="sortBy('days')">
          {{$t('borrow.loanTerm')}}
          <i :class="[days_asc===true?'sort-up':'sort-down']"></i>
        </li>
      </ul>
      <scroll
        ref="scroll"
        class="page-content"
        :data="orderList"
        :pullup="pullup"
        @scrollToEnd="loadMore"
      >
        <detail :list="orderList" from="more" :has-more="hasMore" :title="loadingTitle"></detail>
      </scroll>
    </div>
    <bottom tab="lend"></bottom>
    <tips :show-flag="tips.showTips" :content="tips.tipsContent" @hidetips="tips.showTips=false"></tips>
  </div>
</template>

<script>
import detail from "@/components/children/detail";
import bottom from "@/components/children/footer";
import service from "@/assets/js/commonService";
import tips from "@/components/children/tips";
import config from "@/assets/js/config";
import Scroll from "@/components/children/scroll_init.vue";

export default {
  data() {
    return {
      orderList: [],
      hasData: false,

      tips: {
        tipsContent: "",
        showTips: false
      },
      interest_asc: true,
      borrowedAmount_asc: true,
      days_asc: true,

      pageNo: 0,
      pageSize: 20,
      hasMore: false,
      pullup: true,
      probeType: 3,
      listenScroll: true,
      loadingTitle: "下拉加载更多",
      sortparam: "",
      isLoading: true
    };
  },
  components: {
    detail,
    bottom,
    tips,
    Scroll
  },
  mounted() {
    this.sort("");
  },
  methods: {
    showTip(_msg) {
      if (_msg) {
        //防止出现黑点
        this.tips.tipsContent = _msg;
        this.tips.showTips = true;
      }
    },
    loadMore() {
      if (!this.hasMore) {
        this.loadingTitle = "暂无更多数据";
        return;
      }
      this.pageNo++;
      this.sort(this.sortparam);
    },
    sortBy(type) {
      this.orderList = [];
      let sortparam = "";
      this.pageNo = 0;
      if (type === "interest") {
        //年化利率
        this.interest_asc = !this.interest_asc;
        let sort_info = this.interest_asc ? "asc" : "desc";
        sortparam = `interestRate,${sort_info}`;
      } else if (type === "borrowedAmount") {
        this.borrowedAmount_asc = !this.borrowedAmount_asc;
        let sort_info = this.borrowedAmount_asc ? "asc" : "desc";
        sortparam = `borrowedAmount,${sort_info}`;
      } else if (type === "days") {
        this.days_asc = !this.days_asc;
        let sort_info = this.days_asc ? "asc" : "desc";
        sortparam = `days,${sort_info}`;
      } else {
        this.interest_asc = true;
        this.borrowedAmount_asc = true;
        this.days_asc = true;
        sortparam = "";
      }
      this.sort(sortparam);
      this.sortparam = sortparam;
    },
    sort(sortparam) {
      service
        .getOrderList({
          account: window.ethereum.selectedAddress,
          sort: sortparam,
          page: this.pageNo,
          size: this.pageSize
        })
        .then(
          rep => {
            this.isLoading = false;
            if (rep.status === 200) {
              let curr_list = rep.data.content;
              if (curr_list.length > 0) {
                this.orderList.push(...curr_list);
              }
              if (rep.data.last) {
                this.hasMore = false;
                this.loadingTitle = "";
              } else {
                this.hasMore = true;
                this.loadingTitle = "下拉加载更多";
              }
            } else {
              this.showTip(rep.msg);
            }
          },
          function(error) {}
        );
    }
  }
};
</script>


<style scoped lang="scss">
@import "../../assets/scss/base";

.noData {
  height: 100vh;
}

.page-content {
  position: fixed;
  top: 203px;
  bottom: 130px;
  left: 0;
  right: 0;
  background: #f5f6f7;
}
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
  border-bottom: 1px solid #e2e2e2;
  font-weight: 600;
  background: #fff;
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

.home {
  background: #f5f6f7;
  padding-bottom: 150px;

  &-body {
    &-sort {
      display: flex;
      height: 103px;
      align-items: center;
      justify-content: center;
      background: #fff;
      border-bottom: 1px solid #e0e0e0;
      position: fixed;
      top: 100px;
      left: 0;
      right: 0;
      z-index: 99;

      &-li {
        color: #97a0ac;
        font-size: 28px;
        width: 216px;
        text-align: center;
        display: flex;
        align-items: center;
        justify-content: center;

        i {
          width: 14px;
          height: 21px;
          background: url("../../assets/img/normal.png") no-repeat center;
          background-size: contain;
          display: inline-block;
          margin-left: 5px;
        }

        .sort-up {
          background: url("../../assets/img/shang@2x.png") no-repeat center;
          background-size: contain;
        }

        .sort-down {
          background: url("../../assets/img/xia@2x.png") no-repeat center;
          background-size: contain;
        }
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
        background: url("../../assets/img/no.png") no-repeat center;
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
