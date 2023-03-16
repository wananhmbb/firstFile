<template>
  <view class="service-package-list-item">
    <view
      :class="isLarge ? 'large-name' : 'large'"
      :style="{ background: serveBackgroundItem }"
      v-for="(item, index) in infoList"
      :key="index"
    >
      <view class="image-box">
        <image
          mode="aspectFit"
          :src="
            item.cover
              ? item.cover
              : 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F26%2Fc8%2F69%2F26c869bc8428113a454b0207e42f339f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647237544&t=7a2a8c8effd13e9d1492574bd58d6f70'
          "
        ></image>
      </view>
      <view class="title-box">
        <view class="package-title">{{ item.title }}</view>
        <view class="package-description">{{ item.useDirection }}</view>

        <u-button
          size="default"
          type="primary"
          shape="circle"
          class="button-position"
          :custom-style="customStyle"
          @click.stop="godDetail(item.id, item.title)"
          >{{ item.id === "7441" ? "立即体验" : "查看详情" }}
        </u-button>
        <!-- <view></view> -->
      </view>
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      customStyle: {
        width: "156rpx",
        fontSize: "28rpx",
        lineHeight: "40rpx",
        height: "64rpx"
      }
    }
  },
  props: {
    infoList: {
      type: Array,
      default: function () {
        return []
      }
    },
    serveBackgroundItem: {
      type: String,
      default: "var(--bg-color-secondhome)"
    },
    isLarge: {
      type: Boolean,
      default: false
    }
  },
  watch: {},
  methods: {
    // 去详情页
    godDetail(id, storeName) {
      // console.log(id, storeName)
      if (id === "7441") {
        wx.navigateToMiniProgram({
          appId: "wxbe2f3e140684a515", //appid
          path: "/pages/login/login?env=pro&qrCodeId=0105200000", //path
          envVersion: "release", //开发版develop 开发版 trial 体验版 release 正式版
          success(res) {
            // console.log(res, "成功")
          }
        })
      } else if (id === "7501") {
        this.$Router.push({
          path: "/VajraToWebView",
          query: {
            url: "https://hjt.hxqdjk.com/hjt-doctor/iframe_copy/index.html?type=aged"
          }
        })
      } else if (id === "7502") {
        this.$Router.push({
          path: "/VajraToWebView",
          query: {
            url: "https://braintraining-lite.rplushealth.cn/#/pages/spread/huajiantong/huajiantong?type=children"
          }
        })
      } else if (id === "23" || id === "24") {
        this.$Router.push({
          path: "/sleepVideo",
          query: {
            id: id
          }
        })
      } else {
        this.$Router.push({
          path: "/vajraDistrictDetails",
          query: {
            id: id
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
.large {
  width: 92%;
  // margin: 0 auto;
  display: flex;
  padding: 30rpx 4%;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  border-radius: 16rpx;
  margin: 20rpx auto 0;
}
.large-name {
  width: 92%;
  margin: 0 auto;
  display: flex;
  padding: 30rpx 4%;
  justify-content: space-between;
  align-items: flex-start;
  position: relative;
  border-radius: 16rpx;
}
.button-position {
  position: absolute;
  bottom: 20rpx;
  right: 4%;
  font-weight: 400;
  color: var(--text-color-main);
}
.image-box {
  width: 38%;
  border-radius: 16rpx;
  height: 180rpx;
  overflow: hidden;
  image {
    width: 100%;
    height: 100%;
  }
}
.title-box {
  width: 58%;
  margin-bottom: 40rpx;
}
.package-title {
  color: var(--text-color-main);
  font-weight: 600;
  font-size: 18px;
}
.package-description {
  color: var(--text-color-grey);
  font-size: 24rpx;
  margin-top: 8rpx;
  padding-bottom: 24rpx;
}

.loading-box {
  width: 100vw;
  height: 100vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
.service-package-list-item {
  padding-bottom: 20rpx;
}
</style>
