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
        "https://wxdev.techgather.net/hjt-doctor/index.html#/fill-built-in-gauge?token=" +
        token +
        "&surveyId=" +
        option.surveyId +
        "&followUpId=" +
        option.followUpId +
        "&projectId=" +
        option.projectId +
        "&servicePackageUserId=" +
        option.servicePackageUserId +
        "&tenantId=" +
        tenantId
    } else if (apiIp.includes("weixin2-demo-api")) {
      this.url =
        "https://wxdev.techgather.net/hjt-doctor-demo/index.html#/fill-built-in-gauge?token=" +
        token +
        "&surveyId=" +
        option.surveyId +
        "&followUpId=" +
        option.followUpId +
        "&projectId=" +
        option.projectId +
        "&servicePackageUserId=" +
        option.servicePackageUserId +
        "&tenantId=" +
        tenantId
    } else if (apiIp.includes("hjt/")) {
      this.url =
        "https://hjt.hxqdjk.com/hjt-doctor/index.html#/fill-built-in-gauge?token=" +
        token +
        "&surveyId=" +
        option.surveyId +
        "&followUpId=" +
        option.followUpId +
        "&projectId=" +
        option.projectId +
        "&servicePackageUserId=" +
        option.servicePackageUserId +
        "&tenantId=" +
        tenantId
    }
    console.log(this.url, "url")
  }
}
</script>
