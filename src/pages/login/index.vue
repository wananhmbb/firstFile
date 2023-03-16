<template>
  <theme>
    <view class="all" slot="theme">
      <view class="head"></view>
      <view class="login-box">
        <modelShowChart />
      </view> </view
  ></theme>
</template>

<script>
import modelShowChart from "./model-show-chart"

export default {
  data() {
    return {
      phoneNumber: "",
      serviceShow: "",

      show: false,

      loading: false
    }
  },
  components: {
    modelShowChart
  },

  onLoad() {
    this.$store.commit("SET_IS_LOGIN_PAGE", true)
  },
  onHide() {
    this.$store.commit("SET_IS_LOGIN_PAGE", false)
  },
  onUnload() {
    this.$store.commit("SET_IS_LOGIN_PAGE", false)
  },
  methods: {}
}
</script>

<style scoped lang="scss">
.all {
  z-index: 99999;
  height: 100vh;
  background: #fff;
  .head {
    height: 120rpx;
    width: 100%;
  }
  .login-box {
    height: 85%;
  }
}
</style>
