<template>
  <div class="pop" :class="{show:isShow}">
    <div class="pop-pop">
      <p class="pop-pop-text">{{text}}</p>
      <div class="pop-pop-btns">
        <span class="pop-pop-btns-ok" @click="sure">{{$t('tips.confirmDlg')}}</span>
        <span class="pop-pop-btns-cancel" @click="cancel">{{$t('tips.cancelDlg')}}</span>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  props: {
    content: {
      type: String,
      default: ""
    },
    show: {
      type: Boolean,
      default: false
    }
  },
  watch: {
    show(flag) {
      console.log(flag);
      this.isShow = flag;
    }
  },
  data() {
    return {
      text: this.content,
      isShow: this.show
    };
  },
  methods: {
    sure() {
      this.$emit("sure");
    },
    cancel() {
      this.isShow = false;
      this.$emit("cancel");
    }
  }
};
</script>

<style scoped lang="scss">
.show {
  display: flex !important;
}

.pop {
  position: fixed;
  width: 100%;
  height: 100%;
  bottom: 0;
  left: 0;
  z-index: 100;
  display: none;
  align-items: center;
  justify-content: center;
  background-color: rgba(0, 0, 0, 0.5);

  &-pop {
    background: #fff;
    border-radius: 13px;
    width: 75%;

    &-text {
      padding: 100px 25px;
      text-align: center;
      font-size: 26px;
      color: #0c1e48;
      font-weight: 400;
    }

    &-btns {
      height: 90px;
      border-top: 1px solid #e7e7e7;

      &-ok,
      &-cancel {
        display: inline-block;
        width: 49.5%;
        text-align: center;
        line-height: 90px;
        float: left;
        font-size: 30px;
        font-weight: 400;
        color: #465062;
      }

      &-cancel {
        float: right;
        border-left: 1px solid #e7e7e7;
      }
    }
  }
}
</style>
