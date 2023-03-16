<template>
  <view class="all" slot="theme">
    <house-header :headTypeTwo="title"></house-header>
    <view class="img-view">
      <image
        class="img-css"
        mode="widthFix"
        :src="
          cover
            ? cover
            : 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F26%2Fc8%2F69%2F26c869bc8428113a454b0207e42f339f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647237544&t=7a2a8c8effd13e9d1492574bd58d6f70'
        "
      />

      <u-button
        size="default"
        shape="circle"
        class="button-position"
        :custom-style="customStyle"
        hover-class="none"
        @click.stop="goToRichTextComponent()"
        >查看详情</u-button
      >
    </view>
    <!-- <view>
      <image
        @click="goToRichTextComponent"
        mode="aspectFit"
        :src="
          cover
            ? cover
            : 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F26%2Fc8%2F69%2F26c869bc8428113a454b0207e42f339f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647237544&t=7a2a8c8effd13e9d1492574bd58d6f70'
        "
      />
    </view> -->
  </view>
</template>
<script>
import diseaseList from "@/home-sub-pages/pages/vajra-district/chronic-disease/js/chronic-disease.js"
export default {
  data() {
    return {
      title: "慢病",
      cover: "",
      id: "",
      customStyle: {
        width: "180rpx",
        fontSize: "28rpx",
        height: "64rpx",
        backgroundImage: "linear-gradient(to right, #e1f3f1, #87ccc5)",
        color: "#fff"
      }
    }
  },
  onLoad() {
    this.id = diseaseList[0].id
    this.title = diseaseList[0].title
    this.cover = diseaseList[0].cover
  },
  methods: {
    goToRichTextComponent() {
      console.log("去吧")
      this.$Router.push({
        path: "/vajraDistrictDetails",
        query: {
          id: this.id
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
  .img-view {
    width: 100%;
    // height: 100%;
    text-align: center;
    position: relative;
    padding: 30rpx 20rpx auto;
    .img-css {
      width: 92%;
      //   height: 100%;
      // height: 240px;
      border-radius: 5px;

      overflow: hidden;
    }
    .button-position {
      position: absolute;
      left: 100rpx;
      bottom: 48rpx;
    }
  }
}
</style>
