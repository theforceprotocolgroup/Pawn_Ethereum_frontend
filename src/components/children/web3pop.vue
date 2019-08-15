<template>
  <div class="pop" :class="{flex:isShow}">
    <div class="pop-pop">
      <img src="../../assets/img/loading.gif" alt srcset />
      <p class="pop-pop-text">{{status|statusIcon}}</p>
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
    },
    status: {
      type: Number,
      default: 0
    }
  },
  watch: {
    show(flag) {
      this.isShow = flag;
      if (!flag) {
        this.$emit("cancel");
      }
    },
    status(value) {
      if (value === 110) {
        let self = this;
        setTimeout(() => {
          self.$emit("cancel");
        }, 2000);
      }
    }
  },
  data() {
    return {
      text: this.content,
      isShow: this.show
    };
  },
  filters: {
    statusIcon: function(value) {
      switch (value) {
        case 0:
          return "授权中";
          break;
        case 1:
          return "借币中";
          break;
        case 2:
          return "借币成功";
          break;
        case 3:
          return "出借中";
          break;
        case 4:
          return "出借成功";
          break;
        case 5:
          return "补仓中";
          break;
        case 6:
          return "补仓成功";
          break;
        case 110:
          return "失败了";
          break;
        default:
          break;
      }
    }
  }
};
</script>

<style scoped lang="scss">
.flex {
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
    width: 50%;
    text-align: center;
    img {
      padding-top: 50px;
      width: 100px;
      vertical-align: middle;
      text-align: center;
    }
    &-text {
      height: 100px;
      padding: 50px 25px;
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
