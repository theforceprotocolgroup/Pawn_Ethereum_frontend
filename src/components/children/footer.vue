<template>
  <ul class="footer">
    <li class="footer-li" @click="toHome" :class="{checked:name==='home'}">
      <i class="footer-li-icon i1"></i>
      <label class="footer-li-name">{{$t('title.home')}}</label>
    </li>
    <li class="footer-li" @click="toLendPage" :class="{checked:name==='lend'}">
      <i class="footer-li-icon i2"></i>
      <label class="footer-li-name">{{$t('title.lend')}}</label>
    </li>
    <li class="footer-li" @click="tpBorrowCoinPage" :class="{checked:name==='borrow'}">
      <i class="footer-li-icon i3"></i>
      <label class="footer-li-name">{{$t('title.borrow')}}</label>
    </li>
    <li class="footer-li" @click="toAssetPage" :class="{checked:name==='asset'}">
      <i class="footer-li-icon i5"></i>
      <label class="footer-li-name">{{$t('title.wallet')}}</label>
    </li>
    <li class="footer-li" @click="toAccountPage" :class="{checked:name==='myAccount'}">
      <i class="footer-li-icon i4"></i>
      <label class="footer-li-name">{{$t('title.mine')}}</label>
    </li>
  </ul>
</template>

<script>
export default {
  props: {
    tab: {
      type: String,
      default: "home"
    }
  },
  data() {
    return {
      name: this.tab
    };
  },
  mounted() {
    this.name = this.tab;
  },

  methods: {
    toHome() {
      this.$router.push({ path: "home" });
    },
    toLendPage() {
      this.$router.push({ path: "loadmore" });
    },
    tpBorrowCoinPage() {
      this.$router.push({ path: "borrow" });
    },
    toAssetPage() {
      this.$router.push({ path: "asset" });
    },
    toAccountPage() {
      this.$router.push({ path: "account" });
    }
  }
};
</script>

<style scoped lang="scss">
.footer {
  height: 100px;
  border-top: 1px solid #efeff4;
  background: #fff;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-around;
  padding: 15px 0;

  .checked {
    .footer-li-icon {
      background: url("../../assets/img/i1_ok.png") no-repeat center;
      background-size: contain;
    }

    .i2 {
      background: url("../../assets/img/i2_ok.png") no-repeat center;
      background-size: contain;
    }

    .i3 {
      background: url("../../assets/img/i3_ok.png") no-repeat center;
      background-size: contain;
    }

    .i4 {
      background: url("../../assets/img/i4_ok.png") no-repeat center;
      background-size: contain;
    }
    .i5 {
      background: url("../../assets/img/i6_ok.png") no-repeat center;
      background-size: contain;
    }

    .footer-li-name {
      color: #465062;
    }
  }

  &-li {
    display: flex;
    align-items: center;
    flex-direction: column;

    &-icon {
      width: 47px;
      height: 47px;
      background: url("../../assets/img/i1.png") no-repeat center;
      background-size: contain;
    }

    .i2 {
      background: url("../../assets/img/i2.png") no-repeat center;
      background-size: contain;
    }

    .i3 {
      background: url("../../assets/img/i3.png") no-repeat center;
      background-size: contain;
    }

    .i4 {
      background: url("../../assets/img/i4.png") no-repeat center;
      background-size: contain;
    }
    .i5 {
      background: url("../../assets/img/i6.png") no-repeat center;
      background-size: contain;
    }

    &-name {
      font-size: 20px;
      color: #757e97;
      margin-top: 10px;
    }
  }
}
</style>
