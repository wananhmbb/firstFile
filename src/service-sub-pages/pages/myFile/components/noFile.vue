<template>
  <view class="All">
    <view class="imgBox">
      <image
        src="https://dailydev.oss-cn-chengdu.aliyuncs.com/416/image-icon/no-data.png"
      mode="widthFix"></image>
    </view>
    <view class="text-css">{{ nickname }}你好！</view>
    <view>为了提供更好的服务，我们需要更多信息了解您的情况，请您如实填写</view>
    <view>
      <u-button type="primary" shape="circle" @click="goCreatFile"
        >创建健康档案</u-button
      >
    </view>
  </view>
</template>
<script>
import { USER_INFO } from "@/const/storage-key"
export default {
  data() {
    return {
      nickname: "",
	  
    }
  },
  created() {
    this.nickname = uni.getStorageSync(USER_INFO).nickname
  },
  methods: {
    goCreatFile() {
      this.$emit("changeEnable", true)
    }
  }
}
</script>
<style lang="scss" scoped>
.All {
  width: 90%;
  margin: auto;
  text-align: center;
  view:first-child {
    width: 60vw;
    // height: 166px;
    margin: 80rpx auto auto auto;

    image {
      width: 100%;
      height: auto;
    }
  }
  view:nth-child(2) {
    font-size: 18px;
    font-weight: 600;
    margin-top: 50px;
  }
  view:nth-child(3) {
    margin-top: 15px;
    color: var(--text-color-grey);
  }
  view:last-child {
    width: 90%;
    position: absolute;
    bottom: 40px;
  }
}
.text-css {
  color: var(--text-color-main);
}
// .imgBox {
//   width: 80vw;
//   height: 333rpx;
//   image {
//     width: 100%;
//     height: auto;
//   }
// }
</style>
