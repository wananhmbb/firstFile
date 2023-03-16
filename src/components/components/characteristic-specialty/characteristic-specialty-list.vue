<template>
  <view class="large">
    <view class="title">特色专科</view>
    <!-- 健康包列表的item -->
    <view
      v-if="productList && productList.length > 0"
      class="service-package-list-item"
    >
      <view v-for="(item, index) in productList" :key="index">
        <characteristicSpecialtyItem
          :serveBackgroundItem="serveBackgroundItem"
          :itemData="item"
          v-if="item.isOpen"
        ></characteristicSpecialtyItem>
        <noCharacteristicSpecialtyItem v-else  :itemData="item" />
      </view>
    </view>

    <view class="loading-box" v-if="show">
      <u-loading
        mode="circle"
        :show="show"
        size="100"
        color="var(--theme-color-dark-blue)"
      ></u-loading>
    </view>
  </view>
</template>
<script>
// import {
//   getCategoryList, // 获取分类列表
//   getProductsHotlist,
//   getProductsRecommendlist
// } from "@/api/store.js"
import characteristicSpecialtyItem from "@/components/components/characteristic-specialty/characteristic-specialty-item"
import noCharacteristicSpecialtyItem from "@/components/components/characteristic-specialty/no-characteristic-specialty-item"
export default {
  data() {
    return {
      title: "",
      productList: [
        {
          isOpen: true,
          title: "CT",
          image:
            "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/characteristicSpecialty/comingSoon.png",
    categoryList: ['742','743','744','750']
        },
        {
          isOpen: false,
          image:
            "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/characteristicSpecialty/pulmonaryNoduleArea.png"
        }
      ],
      show: false
    }
  },
  props: {
    bgColor: {
      type: String,
      default: ""
    },
    serveBackgroundItem: {
      type: String,
      default: "var(--bg-color-secondhome)"
    },
    leftTitle: {
      type: String,
      default: ""
    }
  },
  components: {
    characteristicSpecialtyItem,
    noCharacteristicSpecialtyItem
  },
  created() {},
  methods: {}
}
</script>
<style scoped lang="scss">
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
.large {
  margin-top: 20rpx;
  .title {
    padding: 26rpx 32rpx;
    width: auto;
    font-size: 18px;
    font-weight: 600;
    color: var(--text-color-main);
    line-leight: 25px;
  }
}
.service-package-list-item {
  height: 100%;
  padding: 3%;
  box-sizing: border-box;
  column-count: 2;
  column-gap: 3%;
}

.noCommodity {
  background-color: var(--bg-color-main);
  padding-bottom: 30rpx;
  margin-top: 172rpx;
}
.noCommodity .pictrue {
  position: relative;
  width: 414rpx;
  margin: 0 auto;
  height: 335rpx;
}
</style>
