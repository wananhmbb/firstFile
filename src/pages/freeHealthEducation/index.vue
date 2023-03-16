<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <view>
        <healthEducationTabs
          :current="current"
          :TabList="TabList"
          @tabOnChanged="tabOnChanged"
        />
        <healthEducationScrollView
          height="calc(100vh - 260rpx)"
          v-if="selectResourceList.length > 0 && !loading"
          :selectResourceList="selectResourceList"
          :current="current"
          :currentIndex="currentIndex"
          :loading="loading"
        />
        <view v-if="selectResourceList.length === 0 && !loading" class="empty">
          <x-icon iconName="service-no-data"></x-icon>
        </view>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import healthEducationTabs from "@/pages/freeHealthEducation/healthEducationTabs"
import healthEducationScrollView from "@/pages/freeHealthEducation/healthEducationScrollView.vue"
//import healthEducationScrollView from "@/service-sub-pages/pages/healthEducation/healthEducationScrollView.vue"
//import healthEducationView from "@/components/components/health-education/health-education-view.vue"

import {hjtHeDetail, hjtHeFreeList} from "@/api/service"
export default {
  components: {
    // healthEducationView,
    healthEducationTabs,
    healthEducationScrollView
  },
  data() {
    return {
      initFinished: false,
      TabList: [],
      latestTab: 0,
      current: 0,
      currentIndex: 0,
      resourceList: [],
      selectResourceList: [],
      servicePackageId: null,
      title: "",
      loading: true,
      emptyText: "暂无数据"
    }
  },
  onLoad() {
    this.title = this.$Route.query.headTitle
    this.servicePackageId = this.$Route.query.servicePackageId

    this.initContentList().then(() => {
      this.initFinished = true
      this.selectResourceList = this.resourceList[0]
    })
  },
  onHide() {
    this.latestTab = this.current
    this.current = 0
  },
  onShow() {
    this.current = this.latestTab
    this.currentIndex = this.latestTab

    if (this.initFinished) {
      this.initContentList().then(() => {
        this.selectResourceList = this.resourceList[this.current]
      })
    }
  },
  methods: {
    async initContentList() {
      this.resourceList = []
      // console.log("没有登录", this.$store.state.user.isLogin)
      await this.freshFreeEducation()
      this.selectResourceList = this.resourceList[this.current]
    },
    // isFromMyService() {
    //   return this.servicePackageId
    // },
    // freshHeLearningTasks() {
    //   return hjtHeDetail(this.servicePackageId)
    //     .then(res => {
    //       if (res.code === 200) {
    //         if (res.data && res.data.length > 0) {
    //           let learningTasksList = []
    //           res.data.forEach(item => {
    //             if( item.resourceList) {
    //               item.resourceList.forEach(i => {
    //                 learningTasksList.push(i)
    //               })
    //             }
    //           })
    //           this.resourceList.unshift(learningTasksList)
    //         } else {
    //           this.resourceList.unshift([])
    //         }
    //       } else {
    //         this.resourceList.unshift([])
    //       }
    //     })
    //     .catch(() => {
    //       this.resourceList.unshift([])
    //     })
    // },
    freshFreeEducation() {
      return hjtHeFreeList()
        .then(res => {
          this.loading = false
          if (res.code == "200") {
            if (res.data) {
              res.data.map(item => {
                if (!this.initFinished) {
                  this.TabList.push({name: item.cateName})
                }
                this.resourceList.push(item.resourceList)
              })
            }
          }
        })
        .catch(() => {
          this.loading = false
        })
    },
    tabOnChanged(index) {
      this.current = index
      this.currentIndex = index
      this.selectResourceList = this.resourceList[this.current]
      uni.pageScrollTo({
        duration: 100, //过渡时间
        scrollTop: 0 //到达距离顶部的top值
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  min-height: 100vh;
  background: var(--bg-color-main);
}
///deep/.u-tab-bar {
//  background: var(--theme-color-dark-blue) !important;
//}
.scroll-box {
  height: 100%;
}
.health-education-scroll-view {
  height: calc(100vh - 260rpx);
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
