<template>
  <view class="Box">
    <view class="card" v-for="(item, index) in cardList" :key="index">
      <image
        class="img"
        src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E7%BC%96%E7%BB%84%203%402x.png"
      >
      </image>
      <view class="leftBox">
        <text>¥</text>
        <text>{{ item.money }}</text>
      </view>
      <view class="rightBox">
        <view class="righthalf">
          <view class="title">{{ item.name }}</view>
          <view>使用门槛：无限制</view>
          <view>使用期限：永久</view>
        </view>
      </view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    cardList: {
      type: Array
    }
  },
  data() {
    return {}
  }
}
</script>
<style lang="scss" scoped>
.Box {
  width: 90%;
  margin: auto;
  padding-top: 20px;
}
.card {
  display: flex;
  width: 100%;
  height: 106px;
  margin-bottom: 15px;
  position: relative;
  flex-direction: column;
  justify-content: center;
  .img {
    width: 100%;
    height: 104px;
  }
  .leftBox {
    width: 35%;
    font-weight: 600;
    text-align: center;
    color: #e32e21;
    position: absolute;
    text:first-child {
      font-size: 16px;
    }
    text:nth-child(2) {
      font-size: 38rpx;
    }
  }
  .rightBox {
    position: absolute;
    right: 0;
    margin: 0 auto;
    width: 65%;
    padding-left: 25px;
    .righthalf {
      view {
        padding-bottom: 5px;
        font-size: 14px;
        color: var(--text-color-grey);
      }
      .title {
        color: #333;
        font-size: 16px;
        font-weight: 600;
      }
    }
  }
}
</style>
