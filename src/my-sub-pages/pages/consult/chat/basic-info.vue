<template>
  <theme>
    <view slot="theme">
      <view class="content">
        <house-header headTypeTwo="问医详情"></house-header>
        <div class="time">
          咨询时间：
          <span class="time-info">{{ basicInfo.time }}</span>
        </div>
        <div class="text">
          问题描述：
          <div class="text-title">
            {{ basicInfo.data }}
          </div>
        </div>
        <div class="img-wrap" v-show="basicInfo.images.length">
          <div class="img-title">图片列表:</div>
          <div class="img">
            <img
              v-for="(item, index) in basicInfo.images"
              :key="item"
              class="cur-img"
              :src="item"
              @click="imgPreview(index)"
            />
          </div>
        </div>
      </view>
    </view>
  </theme>
</template>

<script>
export default {
  name: "basic-info",
  data() {
    return {
      basicInfo: {}
    }
  },
  methods: {
    imgPreview(index) {
      const _this = this
      uni.previewImage({ current: index, urls: _this.basicInfo.images })
    }
  },
  onLoad() {
    this.basicInfo = this.$Route.query.val
  }
}
</script>

<style scoped lang="scss">
.content {
  background: var(--bg-color-second);
  height: 100vh;
  overflow: auto;
  .time {
    font-size: 30rpx;
    line-height: 30rpx;
    background: var(--bg-color-main);
    color: var(--text-color-main);
    line-height: 36rpx;
    padding: 38rpx 30rpx;
    margin-bottom: 20rpx;
    .time-info {
      font-size: 28rpx;
      font-family: PingFangSC-Regular, PingFang SC;
      color: var(--text-color-grey);
    }
  }
  .text {
    margin-top: 10rpx;
    line-height: 50rpx;
    font-size: 30rpx;
    padding: 38rpx 30rpx;
    box-sizing: border-box;
    color: var(--text-color-main);
    background: var(--bg-color-main);
    margin-bottom: 20rpx;
    .text-title {
      color: var(--text-color-grey);
      line-height: 52rpx;
    }
  }
  .img-wrap {
    background: var(--bg-color-main);
    padding: 38rpx 30rpx;
    box-sizing: border-box;
    .img-title {
      color: var(--text-color-main);
      font-size: 30rpx;
    }
    .img {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-wrap: wrap;
      margin-top: 30rpx;
    }
    .cur-img {
      display: inline-block;
      width: 180rpx;
      height: 180rpx;
      border-radius: 15rpx;
      margin: 0 30rpx 30rpx 0;
    }
  }
}
</style>
