<template>
  <theme>
    <view class="all" slot="theme">
      <house-header class="head-two" :headTypeTwo="title"></house-header>
      <view>
        <cellList :receiveCellList="cellListValue"></cellList>
      </view>
      <view class="out" @click="loginOut">退出登录</view>
      <u-toast ref="uToast"></u-toast>
    </view>
  </theme>
</template>
<script>
import { cellList } from "@/components/components/cell-list/cell-list"
import {
  ACCESS_TOKEN,
  REFRESH_TOKEN,
  EXPIRES_IN,
  USER_INFO,
  WeChat_INFO
} from "@/const/storage-key"
import { logout } from "@/api/user"
export default {
  components: {
    cellList
  },
  data() {
    return {
      title: "",
      cellListValue: [
        {
          name: "personal-data",
          title: "个人资料"
        },
        {
          name: "address-management",
          title: "地址管理"
        }
      ]
    }
  },
  onLoad() {
    this.title = this.$Route.query.title
  },
  methods: {
    loginOut() {
      logout().then(res => {
        if (res.code == 200) {
          uni.setStorageSync(ACCESS_TOKEN, "")
          uni.setStorageSync(REFRESH_TOKEN, "")
          uni.setStorageSync(EXPIRES_IN, "")
          uni.setStorageSync(USER_INFO, "")
          uni.setStorageSync(WeChat_INFO, "")
          this.$refs.uToast.show({
            title: "退出成功",
            type: "success",
            duration: 1000
          })
          this.$store.commit("IS_LOGIN")
          setTimeout(() => {
            uni.switchTab({ url: "/pages/tabbar/index/index" })
          }, 1000)
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  height: 100vh;
  background: var(--bg-color-second);
}
.out {
  position: absolute;
  bottom: 100rpx;
  width: 100%;
  height: 100rpx;
  line-height: 100rpx;
  text-align: center;
  color: var(--text-color-red);
  font-size: 32rpx;
  background: var(--bg-color-main);
}
</style>
