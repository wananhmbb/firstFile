<template>
  <!--  <scroll-view-->
  <!--    :show-scrollbar="showScrollbar"-->
  <!--    scroll-y="true"-->
  <!--    class="large rich-text-component"-->
  <!--    @scrolltolower="scrolltolower"-->
  <!--    @scroll="onScroll"-->
  <!--    lower-threshold="150"-->
  <!--    :style="{ height: height }"-->
  <!--  >-->
  <!--    <view class="box">-->
  <!--      &lt;!&ndash; 瀑布流布局列表 &ndash;&gt;-->
  <!--      <view class="waterfallBox">-->
  <!--        <view class="waterfallItem" :style="{ columnCount: column }">-->
  <!--          <slot name="item"></slot>-->
  <!--        </view>-->
  <!--      </view>-->
  <!--    </view>-->
  <!--  </scroll-view>-->
  <view class="box">
    <!-- 瀑布流布局列表 -->
    <view class="waterfallBox">
      <view class="waterfallItem" :style="{'column-count': column}">
        <slot name="item"></slot>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  name: "x-waterfall",
  props: {
    column: {
      type: Number,
      default: 2
    }
  },
  data() {
    return {
      showScrollbar: false
    }
  },
  onShow() {},
  onLoad() {},
  methods: {}
}
</script>
<style scoped lang="scss">
//瀑布流
page {
  width: 100%;
  height: 100%;
}
.box {
  width: 100%;
  height: 100%;
  box-sizing: border-box;
  .waterfallBox {
    box-sizing: border-box;
    padding: 3%;
    .waterfallItem {
      column-gap: 4%;
    }
  }
}
</style>
