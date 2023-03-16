<template>
  <view class="main">
    <view class="item" v-for="(v, i) in recordData" :key="i">
      <img
        src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/jkzpbasicquestion.jpg"
      />
      <view class="title">
        <text class="text">运动测评</text>
        <view style="margin-top: 3px">{{ v.createTime }}</view>
        <view class="button-position" @click.stop="godDetail(v)">查看结果</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: ["recordData"],
  data() {
    return {}
  },
  methods: {
    godDetail(v) {
      this.$emit("popup", v)
      //   console.log(v, 1234)
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  .item {
    display: flex;
    background-color: var(--bg-color-main);
    border-radius: 5px;
    padding: 15px;
    margin-bottom: 15px;

    img {
      width: 120px;
      height: 90px;
      border-radius: 5px;
      margin-right: 15px;
    }

    .title {
      flex: 1;
      position: relative;

      .button-position {
        position: absolute;
        bottom: 0rpx;
        right: 0rpx;
        color: var(--text-color-white);
        height: 32px;
        padding: 0 20px;
        line-height: 32px;
        text-align: center;
        border-radius: 16px;
        background: var(--theme-color-linear);
      }

      .text {
        font-size: 16px;
        font-weight: 600;
        color: var(--text-color-main);
      }
    }
  }
}
</style>
