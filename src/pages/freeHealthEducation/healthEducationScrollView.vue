<template>
  <scroll-view
    class="health-education-scroll-view"
    scroll-y="true"
    :style="{height: height}"
  >
    <health-education-view
      v-if="current === currentIndex && list.length > 0"
      :receiveResourceList="list"
      :receiveIndex="currentIndex"
    ></health-education-view>
  </scroll-view>
</template>

<script>
import healthEducationView from "@/components/components/health-education/health-education-view.vue"
export default {
  name: "healthEducationScrollView",
  components: {
    healthEducationView
  },
  data() {
    return {
      list: []
    }
  },
  props: {
    selectResourceList: {
      type: Array,
      default: () => {
        return []
      }
    },
    height: {
      type: String,
      default: "100%"
    },
    current: {
      type: Number,
      default: 0
    },
    currentIndex: {
      type: Number,
      default: 0
    }
  },
  watch: {
    selectResourceList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.list = []
        this.$forceUpdate()
        this.list = val
      }
    }
  }
}
</script>

<style scoped lang="scss">
//.health-education-scroll-view {
//  height: calc(100vh - 260rpx);
//}
</style>
