<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="医嘱"></house-header>
      <view class="content">{{ advice }}</view>
    </view>
  </theme>
</template>
<script>
export default {
  data() {
    return {
      advice: ""
    }
  },
  onLoad() {
    this.advice = this.$Route.query.advice
  }
}
</script>

<style lang="scss" scoped>
.content {
  width: 92%;
  height: 400rpx;
  margin: 32rpx auto;
  background: var(--bg-color-second);
  padding: 20rpx 4%;
  border-radius: 10rpx;
  color: var(--text-color-main);
}
</style>
