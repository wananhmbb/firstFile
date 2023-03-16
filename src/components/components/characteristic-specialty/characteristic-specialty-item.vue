<template>
  <view class="large" @click="toMallList()">
    <image class="image-box" :src="itemData.image" mode="scaleToFill"></image>
    <view class="title-box">
      <view class="title">{{ itemData.title }}</view>
      <view class="zone">
        <text class="text">专区</text>
        <x-icon iconName="characteristic-right"></x-icon>
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
    serveBackgroundItem: {
      type: String,
      default: "var(--bg-color-secondhome)"
    },
    isBuy: {
      type: Boolean,
      default: true
    },
    referrerId: {
      type: String,
      default: ""
    }
  },
  methods: {
    toMallList() {
      this.$Router.push({
        path: "/goodsList",
        query: {
          headTypeTwo: this.itemData.title,
          categoryList: JSON.stringify(this.itemData.categoryList)
          // categoryId: "742",
          // text: {
          //   cateId: "742"
          // }
        }
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
    width: 38%;
    position: absolute;
    top: 50%;
    right: 18rpx;
    transform: translateY(-50%);
    .title {
      font-size: 30rpx;

      font-weight: bold;
      color: var(--bg-color-main);
      line-height: 38rpx;
    }
    .zone {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      .text {
        font-size: 30rpx;
        color: var(--bg-color-main);
        line-height: 38rpx;
      }
    }
  }
}
</style>
