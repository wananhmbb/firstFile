<template>
  <view>
    <web-view :webview-styles="webviewStyles" :src="url"></web-view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      webviewStyles: {
        progress: {
          color: "#FF3333"
        }
      },
      url: ""
    }
  },
  onLoad(option) {
    let apiIp = process.env.VUE_APP_BASE_API_IP
    if (apiIp.includes("weixin2-api")) {
      this.url = "https://hxhjt-ch-test.sumian.com?token=" + option.token
    } else if (apiIp.includes("weixin2-demo-api")) {
      this.url = "https://hxhjt-ch-test.sumian.com?token=" + option.token
    } else if (apiIp.includes("hjt/")) {
      this.url = "https://hxhjt-ch.sumian.com?token=" + option.token
    }
    console.log(this.url, "url")
  }
}
</script>
