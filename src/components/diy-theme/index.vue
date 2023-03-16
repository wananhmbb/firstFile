<template>
  <view :class="theme">
    <!-- <image src="@/static/images/no-network.png"></image> -->
    <slot name="theme"></slot>
    <u-no-network tips="网络信号丢失" :image="images"></u-no-network>
    <!-- <u-modal
      v-model="show"
      :content="content"
      confirm-text="我知道了"
      @cancel="cancel"
    ></u-modal> -->
    <!-- <image src="@/static/images/no-network.png"></image> -->
  </view>
</template>
<script>
import { imageBase64 } from "@/const/image/no-network.js"
export default {
  computed: {
    theme() {
      return this.$store.state.theme.skin
    }
  },
  data() {
    return {
      show: false,
      content: "您的微信版本过低，某些功能将无法使用",
      images: imageBase64
    }
  },
  created() {
    // this.getUserSystem()
  },
  methods: {
    // 获取版本号
    getUserSystem() {
      let res = uni.getSystemInfoSync()

      let system = res.system.split(" ")
      let version = ""
      if (system[0] == "iOS") {
        version = this.compareversion(res.version, "7.0.4")
      } else {
        version = this.compareversion(res.version, "7.0.4")
      }
      if (version < 0) {
        this.show = true
      }
    },
    //判断版本号
    compareversion(v1, v2) {
      v1 = v1.split(".")
      v2 = v2.split(".")
      const len = Math.max(v1.length, v2.length)
      while (v1.length < len) {
        v1.push("0")
      }
      while (v2.length < len) {
        v2.push("0")
      }
      for (let i = 0; i < len; i++) {
        let num1 = parseInt(v1[i])
        let num2 = parseInt(v2[i])
        if (num1 > num2) {
          return 1
        } else if (num1 < num2) {
          return -1
        }
      }
      return 0
    },
    cancel() {
      this.show = false
    }
  }
}
</script>
<style></style>
