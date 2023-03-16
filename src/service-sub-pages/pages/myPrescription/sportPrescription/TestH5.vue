<template>
  <view>
    <web-view :src="url"></web-view>
  </view>
</template>

<script>
import { ACCESS_TOKEN } from "@/const/storage-key"
export default {
  data() {
    return {
      url: ""
    }
  },
  onLoad(option) {
    let token = uni.getStorageSync(ACCESS_TOKEN)
    let tenantId = uni.getStorageSync("tenantId")
    let apiIp = process.env.VUE_APP_BASE_API_IP
    if (apiIp.includes("weixin2-api")) {
      this.url =
        "https://wxdev.techgather.net/hjt-doctor/index.html#/exercise-prescription?token=" +
        token +
        "&prescribeId=" +
        option.prescribeId +
        "&servicePackageUserId=" +
        option.servicePackageUserId +
        "&tenantId=" +
        tenantId
    }
    console.log(this.url, "url")
  }
}
</script>
