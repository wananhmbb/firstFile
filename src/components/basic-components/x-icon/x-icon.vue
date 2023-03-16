<template>
  <view
    ref="xIcon"
    :class="['x-icon', iconName, active, theme]"
    @click="setActive"
    @longpress="setActive"
    @tap="setActive"
    @touchstart="setActive"
    @touchcancel="setNotActive"
    @touchend="setNotActive"
    @touchmove="setNotActive"
    @tap.stop="setNotActive"
  ></view>
</template>

<script>
export default {
  name: "x-icon",
  props: {
    iconName: {
      type: String,
      default: ""
    }
  },
  computed: {
    theme() {
      return this.$store.state.theme.skin + "-theme"
    }
  },
  data() {
    return {
      active: ""
    }
  },
  methods: {
    setActive() {
      this.active = "active"
    },
    setNotActive() {
      this.active = ""
    }
  }
}
</script>

<style lang="scss" scoped>
@import "x-icon-index";
@import "x-icon-service";
@import "x-icon-login";
@import "x-icon-shopping-mall";
@import "x-icon-chat";
@import "x-icon-characteristic-specialty";
</style>
