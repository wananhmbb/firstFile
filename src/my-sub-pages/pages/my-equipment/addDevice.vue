<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="我的设备"></house-header>
      <view class="content">
        <view class="headBox">
          <view class="title">添加设备</view>
          <view class="explain">请选择你需要添加的设备</view>
        </view>
        <view class="equipmentBox">
          <view
            class="itemBox"
            v-for="(item, index) in equipmentList"
            :key="index"
            @click="goEquipmentDetails(item)"
          >
            <view class="image-box">
              <image :src="item.images"> </image>
            </view>
            <view class="itemBoxTitle">{{ item.name }}</view>
          </view>
        </view>
      </view>
    </view>
  </theme>
</template>
<script>
import { getFacilityList } from "@/api/myEquipment.js"
export default {
  data() {
    return {
      equipmentList: []
    }
  },
  onLoad() {
    this.getEquipmentList()
  },
  methods: {
    getEquipmentList() {
      getFacilityList().then(res => {
        if (res.code === 200) {
          this.equipmentList = res.data
        }
      })
    },
    goEquipmentDetails(item) {
      this.$Router.push({
        name: "myEquipmentDetails",
        params: {
          equipmentDetailsId: item.id
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
  .content {
    width: 95%;
    margin: auto;
    .headBox {
      padding: 15px 0 10px 0;
      border-bottom: 1px solid #eeeff0;
      .title {
        font-size: 36rpx;
        color: var(--text-color-main);
        font-weight: 600;
        margin-bottom: 5px;
      }
      .explain {
        color: var(--text-color-grey);
      }
    }
    .equipmentBox {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      margin-top: 15px;
      .itemBox {
        display: flex;
        justify-content: space-evenly;
        align-items: center;
        width: 48.5%;
        background: var(--bg-color-main);
        padding: 20px 0;
        border-radius: 5px;
        margin-bottom: 11px;
        .image-box {
          width: 100rpx;
          height: 100rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .itemBoxTitle {
          font-size: 30rpx;
          color: var(--text-color-main);
        }
      }
    }
  }
}
</style>
