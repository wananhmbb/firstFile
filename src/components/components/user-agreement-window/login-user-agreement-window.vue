<template>
  <view class="population" @click="closeWindow" v-if="open">
    <view class="contact">
      <view class="html-box">
        <richTextComponent :htmlData="htmlData"></richTextComponent>
      </view>
    </view>
  </view>
</template>
<script>
import richTextComponent from "@/components/components/rich-text-component.vue"
export default {
  data() {
    return {
      // name: "我已经阅读本同意书， 项目内容慎重考虑",
      // checked: false,
      // disabled: false,
      htmlData: ""
    }
  },
  props: {
    open: {
      type: Boolean,
      default: false
    }
  },
  components: {
    richTextComponent
  },
  methods: {
    // checkboxChange() {
    //   this.checked = !this.checked
    // }
    closeWindow() {
      this.$emit("close", true)
    }
  }
}
</script>
<style scoped>
.population {
  background: rgba(00, 00, 00, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 10;
  width: 100vw;
  height: 100vh;
}
.contact {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-color-main);
  width: 80vw;
  max-height: 60vh;
  z-index: 11;
}
.html-box {
  width: 96%;
  padding: 3% 2%;
  height: 60vh;
  overflow: auto;
}
</style>
