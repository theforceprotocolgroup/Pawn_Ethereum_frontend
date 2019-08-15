<template>
  <div class="loading" v-if="hasMore">
    <img src="./loading.gif">
    <p class="desc">{{$t('text.loading')}}</p>
  </div>
</template>
<script type="text/ecmascript-6">
  export default {
    props: {
      title: {
        type: String,
        default: '正在载入...'
      },
      hasMore: {
        type: Boolean,
        default: false
      },
    }
  }
</script>
<style scoped lang="scss">
  .loading {
    width: 100%;
    text-align: center;
    padding: 10px;
    img {
      width: 24px;
      height: 24px;
    }
    .desc {
      line-height: 20px;
      font-size: 12px;
      color: #999;
    }
  }
</style>
