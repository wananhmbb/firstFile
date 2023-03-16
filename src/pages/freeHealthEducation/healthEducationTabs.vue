<template>
  <u-tabs
    :list="TabList"
    :is-scroll="true"
    :current="current"
    @change="tabOnChanged"
    active-color="var(--text-color-main)"
    inactive-color="#9699a6"
    bg-color="var(--bg-color-main)"
  ></u-tabs>
</template>

<script>
export default {
  name: "healthEducationTabs",
  props: {
    TabList: {
      type: Array,
      default: () => {
        return []
      }
    },
    current: {
      type: Number,
      default: 0
    }
  },
  methods: {
    tabOnChanged(val) {
      this.$emit("tabOnChanged", val)
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
</style>
