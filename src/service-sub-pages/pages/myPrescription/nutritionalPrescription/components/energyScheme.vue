<template>
  <view class="sportsAdviceBox">
    <view class="title">
      <!-- <view class="titleLine"></view> -->
      <view class="titleName">阶段目标</view>
    </view>
    <view class="titleView">
      <view
        class="titleItem"
        v-for="(item, index) in titleViewList"
        :key="index"
      >
        <view>
          <text>{{ item.value }}</text>
          <text>{{ getUnit(item.unit) }}</text>
        </view>
        <view>{{ item.name }}</view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    freq: {
      type: Object,
      default: null
    }
  },
  data() {
    return {
      titleViewList: []
    }
  },
  watch: {
    freq: {
      deep: true,
      handler(val) {
        this.titleViewList = []
        for (var i in val) {
          this.titleViewList.push(val[i])
        }
      }
    }
  },
  created() {},
  methods: {
    //单位转换
    getUnit(unit) {
      if (unit == "g") {
        return "克"
      }
      if (unit == "kg") {
        return "千克"
      }
      if (unit == "grain") {
        return "粒"
      }
      if (unit == "cal") {
        return "卡"
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.sportsAdviceBox {
  .title {
    display: flex;
    align-items: center;
    margin-bottom: 10px;
    .titleLine {
      width: 6px;
      height: 18px;
      border-radius: 4px;
      margin-right: 10px;
      background: var(--theme-color-dark-blue);
    }
    .titleName {
      font-size: 30rpx;
      font-weight: bolder;
      color: var(--text-color-main);
    }
  }
  .titleView {
    margin: auto;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    .titleItem {
      width: 49%;
      border-radius: 10px;
      padding: 10px 5px;
      margin: 2% 0 0 0;
      background: var(--bg-color-second);
      view:first-child {
        text-align: center;
        padding-bottom: 5px;
        color: var(--text-color-main);
        text:first-child {
          font-size: 32rpx;
          font-weight: bolder;
          padding-right: 2px;
        }
        text:nth-child(2) {
          font-size: 24rpx;
          font-weight: bolder;
        }
      }
      view:nth-child(2) {
        text-align: center;
        color: var(--text-color-grey);
      }
    }
  }
}
</style>
