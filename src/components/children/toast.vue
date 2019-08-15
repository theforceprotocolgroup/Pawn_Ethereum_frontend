<template>
  <div class="pop">
    <p class="pop-text">{{text}}</p>
  </div>
</template>

<script>
  export default {
    props: {
      text: {
        type: String,
        default: '',
      }
    },
    data() {
      return {
        content: this.text
      }
    }
  }
</script>

<style scoped lang="scss">
  .pop {
    position: fixed;
    width: 100%;
    height: 100%;
    bottom: 0;
    left: 0;
    z-index: 100;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: rgba(0,0,0,0.5);
    &-text {
      background: rgba(0,0,0,0.8);
      border-radius: 8px;
      padding: 15px 25px;
      font-size: 26px;
      color: #fff;
      font-weight: 400;
      z-index: 101;
    }
  }
</style>
