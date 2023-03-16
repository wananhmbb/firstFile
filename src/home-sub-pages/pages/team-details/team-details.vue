<template>
  <theme>
    <view slot="theme" class="all">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view v-if="loading" class="loading-style">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <richTextComponent
        :htmlData="htmlData"
        v-else-if="htmlData && !loading"
      ></richTextComponent>
      <view class="no-data" v-else>
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
import { getBannerDetails } from "@/api/tabbar-index.js"
export default {
  data() {
    return {
      htmlData: "",
      id: "",
      loading: true,
      headTitle: ""
    }
  },
  onLoad(option) {
    if (option.id) {
      this.id = option.id
      this.getTeamDetails()
    } else {
      this.loading = false
      console.error("in team-details. 上个页面传入的id为空，停止初始化")
    }
  },
  methods: {
    getTeamDetails() {
      this.loading = true
      getBannerDetails(this.id)
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            this.htmlData = res.data.paratext
            this.headTitle = res.data.title
          } else {
            this.$util.Tips({
              title: res.message
            })
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  min-height: 100vh;
  background: var(--bg-color-second);
}
.loading-style {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0);

  width: 45vw;
  padding: 3% 4%;
  height: 200rpx;

  z-index: 100;
  border-radius: 20rpx;
  text-align-last: center;
  line-height: 150rpx;
  vertical-align: middle;
}
.no-data {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 150rpx;
  width: 70vm;
  .no-data-text {
    width: 100%;
    text-align: center;
    margin-top: 30rpx;
    color: var(--text-color-grey);
  }
}
</style>
