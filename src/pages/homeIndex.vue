<template>
  <theme>
    <view class="all" slot="theme">
      <view class="content">
        <!-- <u-circle-progress
          active-color="#09BB07"
          :percent="percent"
          border-width="2"
          width="210"
        > -->
        <view class="u-progress-content">
          <x-icon iconName="logo" class="icon-font"></x-icon>
          <!--          <image-->
          <!--            src="https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/logo.png"-->
          <!--          ></image-->
        </view>
        <!-- </u-circle-progress> -->
      </view>
    </view>
  </theme>
</template>

<script>
import store from "@/store"

export default {
  data() {
    return {
      times: 1
    }
  },
  onLoad() {
    this.enterTime(this.times)
  },
  watch: {
    "$store.state.user.isLogin": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          store.dispatch("GET_IMPROVE_LIST")
        }
      }
    }
  },
  methods: {
    enterTime(times) {
      // let tenantId = uni.getStorageSync("tenantId")
      uni.setStorageSync("tenantId", 0)
      let timeStart = setInterval(
        function () {
          times--
          if (times === 0) {
            clearInterval(timeStart)
            uni.switchTab({
              url: "/pages/tabbar/index/index"
            })
            // if (tenantId) {
            //   uni.switchTab({
            //     url: "/pages/tabbar/index/index"
            //   })
            // } else {
            //   uni.reLaunch({
            //     url: "/pages/residentInstitution/index"
            //   })
            // }
          }
        },
        1000,
        times
      )
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  height: 100vh;
  .content {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: auto;
    margin-top: 42vh;
    .u-progress-content {
      padding: 8rpx 5rpx 2rpx 5rpx;
      width: 180rpx;
      height: 180rpx;
      border-radius: 50%;
      .icon-font {
        width: 100%;
        height: 100%;
      }
    }
  }
}
</style>
