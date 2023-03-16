<template>
  <view>
    <view class="closeHeartRateBox" v-if="getHeartRateValue === '连接断开'">{{
      getHeartRateValue
    }}</view>
    <view class="heartRateBox" v-else>
      <view> {{ getHeartRateValue }}</view>
      <view class="sub">bpm</view>
    </view>
  </view>
</template>

<script>
export default {
  name: "heartRate",
  data() {
    return {
      getHeartRateValue: 0
    }
  },
  watch: {
    "$store.state.heartRate.heartRateValue": {
      immediate: true,
      deep: true,
      handler(value) {
        this.getHeartRateValue = value
        console.log(value, "监听到的心率值")
      }
    }
  },
  created() {},
  methods: {}
}
</script>

<style lang="scss" scoped>
.heartRateBox {
  width: 80px;
  height: 80px;
  border: 1px solid #fff;
  border-radius: 50%;
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  .sub {
    padding-top: 5px;
    // font-size: 12px;
  }
}
.closeHeartRateBox {
  width: 80px;
  height: 80px;
  line-height: 80px;
  border: 1px solid #fff;
  border-radius: 50%;
  text-align: center;
  color: #fff;
}
</style>
