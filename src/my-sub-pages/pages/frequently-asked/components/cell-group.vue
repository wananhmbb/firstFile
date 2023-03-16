<template>
  <view>
    <u-cell-group>
      <u-cell-item
        v-for="(item, index) in cellGroupList"
        :key="index"
        @click="check(item)"
        :title="item.problem"
        hover-class="cell-hover-class"
      ></u-cell-item>
    </u-cell-group>
  </view>
</template>
<script>
export default {
  props: {
    cellGroupList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },
  data() {
    return {}
  },
  onLoad() {},
  methods: {
    check(item) {
      this.$Router.push({
        name: "frequentlyAskedDetail",
        params: {
          problem: item.problem,
          answer: item.answer
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  height: 100vh;
  background: var(--bg-color-second);
}
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.loading-box {
  width: 100vw;
  height: 80vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
.empty {
  margin-top: 150px;
  text-align: center;
}
</style>
