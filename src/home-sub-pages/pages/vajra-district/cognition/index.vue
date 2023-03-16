<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="认知"></house-header>
      <view class="img-view">
        <image
          class="img-css"
          src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/Brain%20Training%E6%8E%A8%E4%BB%8B%E6%9D%90%E6%96%99/Brain-Training-hjt-1.png"
          mode="aspectFill"
        />
        <u-button
          size="default"
          shape="circle"
          class="button-position"
          :custom-style="customStyle"
          hover-class="none"
          @click.stop="godDetail()"
          >查看详情</u-button
        >
      </view>

      <vajraListItem :infoList="infoList"></vajraListItem>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import infoList from "@/home-sub-pages/pages/vajra-district/cognition/js/cognition.js"

import vajraListItem from "@/home-sub-pages/pages/vajra-district/nutrition/components/vajra_list_item.vue"
export default {
  components: {
    vajraListItem
  },
  data() {
    return {
      customStyle: {
        width: "180rpx",
        fontSize: "28rpx",
        height: "64rpx",
        backgroundImage: "linear-gradient(to right, #e1f3f1, #87ccc5)",
        color: "#fff"
      },
      infoList: infoList
    }
  },
  onLoad() {},
  methods: {
    godDetail() {
      this.$Router.push({
        path: "/vajraDistrictDetails",
        query: {
          id: "7503"
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
  .img-view {
    width: 100%;
    text-align: center;
    position: relative;

    .img-css {
      width: 92%;
      height: 388rpx;
      border-radius: 5px;
      margin: 30rpx 20rpx auto;
    }
    .button-position {
      position: absolute;
      left: 100rpx;
      bottom: 48rpx;
    }
  }
}
</style>
