<template>
  <view>
    <web-view
      :webview-styles="webviewStyles"
      src="https://mp.weixin.qq.com/s?__biz=MzkwNTI0NzQ4MQ==&mid=2247483732&idx=1&sn=383cd97fec63e126acb2ca7857e16744&chksm=c0fbeec2f78c67d419107a00675d4a5de82c5d46429a6e431eee4a5989398d1ee59046ad2960#rd"
    ></web-view>
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
      }
    }
  },
  onLoad(option) {
    this.url = option.url
  }
}
</script>
