<template>
  <view class="box">
    <u-cell-group :border="border">
      <u-cell-item
        bg-color="var(--bg-color-mian)"
        :border="border"
        :border-bottom="border"
        :title="leftTitle"
        :title-style="titleStyle"
        :arrow="false"
      ></u-cell-item>
    </u-cell-group>
    <view class="organizationBox">
      <view class="topBox">
        <view
          class="topBoxItem"
          @click="goHome(topItem.id)"
          v-for="(topItem, index) in topBoxList"
          :key="index"
        >
          <view class="organizationName">{{ topItem.name }}</view>
          <image :src="topItem.cover"></image>
        </view>
      </view>
      <view class="bottomBox">
        <view
          class="bottomBoxItem"
          v-for="(bottomItem, index) in bottomBoxList"
          :key="index"
          @click="goHome(bottomItem.id)"
        >
          <view class="organizationName">{{ bottomItem.name }}</view>
          <image :src="bottomItem.cover"></image>
        </view>
        <view
          class="bottomBoxItem"
          @click="more"
          v-if="bottomBoxList.length > 0"
        >
          <image
            src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/1669447641515.png"
          ></image>
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
export default {
  props: {
    tenantRecommendList: {
      type: Array
    }
  },
  data() {
    return {
      border: false,
      leftTitle: "入驻机构",
      titleStyle: {
        fontSize: "34rpx",
        fontWeight: 600,
        color: "var(--text-color-main)",
        lineLeight: " 25px"
      },
      topBoxList: [],
      bottomBoxList: []
    }
  },
  created() {
    let tenantRecommendList = this.tenantRecommendList
    this.topBoxList = tenantRecommendList.slice(0, 2)
    this.bottomBoxList = tenantRecommendList.slice(2, 4)
  },
  methods: {
    goHome(tenantId) {
      this.$store.commit("getenants", tenantId)
      uni.switchTab({
        url: "/pages/tabbar/index/index"
      })
    },
    more() {
      this.$refs.uToast.show({
        title: "敬请期待",
        type: "primary"
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.box {
  margin-bottom: 10px;
  .organizationBox {
    width: 95%;
    margin: 5px auto 10px auto;
    .topBox {
      display: flex;
      justify-content: space-between;
      .topBoxItem {
        width: 48%;
        height: 295rpx;
        border-radius: 10px;
        position: relative;
        image {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
    .bottomBox {
      margin-top: 4%;
      display: flex;
      justify-content: space-between;
      .bottomBoxItem {
        width: 31%;
        height: 220rpx;
        border-radius: 10px;
        position: relative;
        image {
          width: 100%;
          height: 100%;
          border-radius: 10px;
        }
      }
    }
    .organizationName {
      position: absolute;
      top: 20px;
      left: 15rpx;
      font-weight: bold;
      font-size: 32rpx;
    }
  }
}
</style>
