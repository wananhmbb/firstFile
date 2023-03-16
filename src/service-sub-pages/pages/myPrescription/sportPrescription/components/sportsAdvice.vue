<template>
  <view class="sportsAdviceBox">
    <view class="title">
      <view class="titleLine"></view>
      <view class="titleName">运动建议</view>
    </view>
    <view class="titleView">
      <view
        class="titleItem"
        v-for="(item, index) in titleViewList"
        :key="index"
      >
        <view>
          <text class="name">{{ item.min }}-{{ item.max }}</text>
          <text class="name">{{ getUnit[item.unit] }}</text>
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
      titleViewList: [],
      getUnit: {
        m: "分钟",
        bpm: "bpm",
        d: "日"
      }
    }
  },
  watch: {
    freq: {
      deep: true,
      handler(val) {
        for (var i in val) {
          this.titleViewList.push(val[i])
        }
      }
    }
  },
  methods: {}
}
</script>
<style lang="scss" scoped>
.sportsAdviceBox {
  width: 90%;
  margin: 10px auto;
  .title {
    display: flex;
    align-items: center;
    .titleLine {
      width: 6px;
      height: 18px;
      border-radius: 4px;
      margin-right: 10px;
      background: var(--theme-color-dark-blue);
    }
    .titleName {
      font-size: 34rpx;
      font-weight: bolder;
      color: var(--text-color-main);
    }
  }
  .titleView {
    margin-top: 10px;
    justify-content: space-between;
    display: flex;
    flex-wrap: wrap;
    .titleItem {
      width: 49%;
      padding: 15px 5px;
      margin: 2% 0 0 0;
      background: var(--bg-color-second);
      view:first-child {
        text-align: center;
        padding-bottom: 5px;
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
  .name {
    color: var(--text-color-main);
  }
}
</style>