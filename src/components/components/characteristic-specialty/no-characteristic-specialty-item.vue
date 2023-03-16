<template>
  <view class="large" @click="noToList()">
    <image class="image-box" :src="itemData.image"></image>

    <view class="title-box">
      <view class="title">
        <text>敬请期待</text>
        <x-icon iconName="characteristic-right"></x-icon>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  name: "no-characteristic-specialty-item",
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {
          storeName: "",
          price: "",
          productOrderInfo: {}
        }
      }
    },
  },
  methods: {
    noToList() {
      this.$refs.uToast.show({
        title: "暂未开放，敬请期待",
        type: "primary"
      })
    }
  }
}
</script>

<style scoped lang="scss">
.large {
  width: 100%;
  height: 160rpx;
  border-radius: 30rpx;
  margin-bottom: 2vw;
  overflow: hidden;
  break-inside: avoid;

  position: relative;
  .image-box {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 0;
  }
  .title-box {
    width: 42%;
    position: absolute;
    top: 50%;
    right: 8%;
    transform: translateY(-50%);
    .title {
      font-size: 30rpx;
      font-weight: bold;
      color: var(--bg-color-main);
      line-height: 38rpx;
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    //.zone {
    //  width: 100%;
    //  display: flex;
    //  justify-content: space-between;
    //  align-items: center;
    //  .text {
    //    font-size: 30rpx;
    //    color: var(--bg-color-main);
    //    line-height: 38rpx;
    //  }
    //}
  }
}
</style>
