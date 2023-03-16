<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="物流信息"></house-header>
      <view class="view-box">
        <view class="flex-box">
          <view>物流公司:</view>
          <view>{{ orderInfo.deliveryName }}</view>
        </view>
        <view class="flex-box">
          <view>物流单号:</view>
          <view>{{ orderInfo.deliveryId }}</view>
        </view>
      </view>
    </view>
  </theme>
</template>
<script>
import { getOrderInfoApi } from "@/api/order"
export default {
  name: "index",
  data() {
    return {
      orderId: "",
      orderInfo: {}
    }
  },
  onLoad() {
    this.orderId = this.$Route.query.orderId
    this.getLodisticsInfo()
  },
  methods: {
    getLodisticsInfo() {
      getOrderInfoApi(this.orderId)
        .then(res => {
          if (res.code === 200) {
            this.orderInfo = res.data
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style scoped lang="scss">
.large {
  background: var(--bg-color-secondhome);
  color: var(--text-color-grey);
  min-height: 100vh;
}
.flex-box {
  width: 80%;
  margin: 0 auto;
  padding: 20px 0 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  & :nth-child(2) {
    margin-left: 10px;
  }
}
</style>
