<template>
  <web-view :src="url"></web-view>
</template>
<script>
export default {
  data() {
    return {
      url: ""
    }
  },
  onLoad() {
    this.url = decodeURI(this.$Route.query.url)
    console.log(this.url)
  }
}
</script>
