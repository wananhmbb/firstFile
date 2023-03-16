<template>
  <view class="contact">
    <view class="no-service-package">
      <x-icon iconName="service-pack-not-purchased"></x-icon>
      <!-- <image src="https://s4.ax1x.com/2022/02/12/HwhMlD.png"></image> -->
      <!-- <view>您当前还未购买健康服务</view> -->
    </view>
	<!-- 服务包列表 -->
    <!-- <view class="server-pageage-list-box">
      <servicePackageList
        :leftTitle="leftTitle"
        serveBackgroundItem="var(--bg-color-main)"
      ></servicePackageList>
    </view> -->
  </view>
</template>
<script>
import servicePackageList from "@/components/components/service-package-list/service-package-list.vue"
export default {
  data() {
    return {
      leftTitle: "服务包推荐"
    }
  },
  components: {
    servicePackageList
  },
  methods: {}
}
</script>
<style scoped lang="scss">
.contact {
  width: 100%;
  background: var(--bg-color-second);
  display: flex;
  align-items: center;
  // position: relative;
}
.server-pageage-list-box {
  background: var(--bg-color-second);
}
.no-service-package {
  width: 100%;
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: var(--bg-color-second);
  padding: 14% 0;
  text-align: center;
  // outline: 1px solid red ;
  // image {
  //   width: 400rpx;
  //   height: 242rpx;
  // }
  view {
    text-align: center;
    font-size: 28rpx;
    font-weight: 400;
    color: var(--text-color-grey);
    line-height: 40rpx;
    margin-top: 30rpx;
  }
}
</style>
