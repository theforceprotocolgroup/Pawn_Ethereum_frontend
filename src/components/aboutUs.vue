<template>
  <div class="introduce">
    <div class="header">
      <span class="icon-arrow" @click="toBack">
        <img src="../assets/img/return_back.png" alt class="image-center" />
      </span>
      关于我们
    </div>
    <img src="../assets/img/logo.png" alt class="logo" />
    <p class="content">{{ $t('text.appIntroduce') }}</p>
    <p class="price">{{$t('text.priceReference')}}</p>
    <p>https://block.cc/</p>
    <p>{{$t('text.priceUpdateTips')}}</p>
  </div>
</template>

<script>
export default {
  name: "introduce",
  data() {
    return {
      msg: "Welcome to Your Vue.js App"
    };
  },
  methods: {
    tologin() {
      this.$router.push({ path: "login" });
    },
    toBack() {
      this.$router.back();
    }
  }
};
</script>

<style scoped lang="scss">
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
      margin-bottom: 0px;
      width: 20px;
    }
  }
}
.introduce {
  margin-top: 190px;
  text-align: center;
  .logo {
    width: 120px;
    height: 180px;
  }
  p {
    text-align: left;
    padding: 0 30px;
  }
  .content {
    margin-top: 80px;
  }
  .content-1 {
    margin-top: 50px;
  }
  .price {
    margin-top: 100px;
  }
  .btn {
    position: fixed;
    bottom: 100px;
    left: 37%;
    display: inline-block;
    width: 200px;
    height: 50px;
    line-height: 50px;
    border-radius: 10px;
    color: #fff;
    text-align: center;
    background: rgba(90, 112, 243, 255);
    margin-top: 100px;
  }
}
</style>
