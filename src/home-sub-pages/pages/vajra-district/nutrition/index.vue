<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <vajra-list-item :infoList="infoList"></vajra-list-item>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import nutritionList from "@/home-sub-pages/pages/vajra-district/nutrition/js/nutrition.js"
import diseaseList from "@/home-sub-pages/pages/vajra-district/chronic-disease/js/chronic-disease.js"
import vajraListItem from "@/home-sub-pages/pages/vajra-district/nutrition/components/vajra_list_item.vue"
export default {
  components: {
    vajraListItem
  },
  data() {
    return {
      infoList: [],
      id: "",
      title: ""
    }
  },
  onLoad() {
    this.id = this.$Route.query.text.id
    this.title = this.$Route.query.text.title
    if (this.id === "783") {
      this.infoList = nutritionList
    } else if (this.id === "789") {
      this.infoList = diseaseList
    }
  },
  methods: {}
}
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);

  /deep/ .image-box {
    border: 1px solid #e5e5e5;
  }
}
</style>
