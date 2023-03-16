<template>
  <theme>
    <view slot="theme" class="all">
      <house-header
        :headTypeTwo="headTitle"
        :clearTenantId="clearTenantId"
      ></house-header>
      <view v-if="loading" class="loading-style">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view v-else-if="htmlData && !loading">
        <video
          class="video"
          id="videoBox"
          :show-fullscreen-btn="true"
          :autoplay="true"
          :loop="loop"
          :src="htmlData"
        >
          <!-- <view class="backBox" @click="goback">
            <u-icon name="arrow-left" color="#ffffff" size="40"></u-icon
          ></view> -->
        </video>
      </view>
      <view class="no-data" v-else>
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
import { hjtHeClick, detailById, isStudy } from "@/api/service"
export default {
  data() {
    return {
      htmlData: "",
      heResourceId: "",
      id: "",
      loading: true,
      headTitle: "",
      clearTenantId: false
    }
  },
  onLoad(option) {
    this.clearTenantId = this.$Route.query.clearTenantId
    if (option) {
      this.id = option.id
      this.heResourceId = option.heResourceId
      this.detail(this.id)
      this.increase(this.id)
    }
  },
  methods: {
    /* 进入页面十秒便已学习 */
    toStudy(id) {
      setTimeout(() => {
        isStudy(id)
      }, 10000)
    },
    /* 添加点击数 */
    increase(id) {
      hjtHeClick(id)
    },
    detail(id) {
      detailById(id)
        .then(res => {
          this.loading = false
          if (res.code === 200 && res.data) {
            this.htmlData = res.data.content
            this.headTitle = res.data.title
            if (this.heResourceId) {
              this.toStudy(this.heResourceId)
            }
          }
        })
        .catch(e => {
          this.loading = false
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
.video {
  width: 100%;
}
.backBox {
  position: absolute;
  top: 30rpx;
  left: 5%;
  padding: 10px;
  background: red;
}
</style>
