<template>
  <div>
    <rich-text-component height="100%" :html-data="extra"></rich-text-component>
  </div>
</template>
<script>
import richTextComponent from "@/components/components/rich-text-component.vue"

export default {
  components: {
    richTextComponent
  },
  data() {
    return {
      extra: "<h>我没有</h><h>我没有</h><h>我没有</h>"
    }
  }
}
</script>
