<template>
  <theme>
    <view class="all" slot="theme">
      <house-header
        :headTypeTwo="title"
        :getIndex="getIndex"
        :clearTenantId="clearTenantId"
      ></house-header>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <richTextComponent
        v-else-if="content"
        class="health-education-rich-text-content"
        :htmlData="content"
        height="88vh"
      ></richTextComponent>
      <view v-else class="no-data">
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
import { hjtHeClick, detailFreeById, detailById, isStudy } from "@/api/service"
export default {
  data() {
    return {
      heResourceId: null,
      id: null,
      title: "",
      content: "",
      getIndex: null,
      loading: true,
      clearTenantId: false
    }
  },
  onLoad(options) {
    this.getIndex = this.$Route.query.getIndex
    this.clearTenantId = this.$Route.query.clearTenantId
    if (options.tenantId) {
      this.tenantId = options.tenantId
      this.heResourceId = options.heResourceId
      this.id = options.id
      this.title = decodeURIComponent(options.title)
    } else {
      this.heResourceId = options.heResourceId
      this.id = options.id
      this.title = decodeURIComponent(options.title)
      this.tenantId = uni.getStorageSync("tenantId")
    }
    if (this.heResourceId && this.heResourceId !== "undefined") {
      this.saveTenantId().then(() => {
        this.detail(this.heResourceId)
        this.increase(this.heResourceId)
      })
    } else {
      this.saveTenantId().then(() => {
        this.detailFree(this.id)
        this.increase(this.id)
      })
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage"]
    })
  },
  onShareAppMessage(res) {
    let tenantId = uni.getStorageSync("tenantId")
    return {
      title: "核联医",
      path:
        "/service-sub-pages/pages/healthEducation/details?tenantId=" +
        tenantId +
        "&heResourceId=" +
        this.heResourceId +
        "&id=" +
        this.id +
        "&title=" +
        this.title, //若无path 默认跳转分享页
      imageUrl: "", //若无imageUrl 截图当前页面
      // 成功的回调
      success: res => {},
      // 失败的回调
      fail: res => {},
      // 无论成功与否的回调
      complete: res => {}
    }
  },
  methods: {
    //租户id存本地
    saveTenantId() {
      return new Promise(resolve => {
        this.$store.commit("getenants", this.tenantId)
        resolve("success")
      })
    },
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
    /* 免费详情 */
    detailFree(id) {
      detailFreeById(id)
        .then(res => {
          this.loading = false
          if (res.code == 200 && res.data) {
            this.content = res.data.content
          }
        })
        .catch(e => {
          this.loading = false
        })
    },
    /* 学习详情 */
    detail(id) {
      detailById(id)
        .then(res => {
          this.loading = false
          if (res.code == "200" && res.data) {
            this.content = res.data.content
            this.toStudy(this.id)
          }
        })
        .catch(e => {
          this.loading = false
        })
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  min-height: 100vh;
  background: var(--bg-color-main);

  .no-data {
    display: flex;
    justify-content: center;
    align-items: center;
    height: 70vh;
  }
}
.health-education-rich-text-content {
  /deep/ scroll-view {
    width: 100%;
    background-color: var(--bg-color-main);

    rich-text,
    text {
      line-height: 60rpx;
      color: var(--text-color-main);
    }
  }
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
</style>
