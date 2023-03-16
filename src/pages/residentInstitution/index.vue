<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeOne="华西健康"></house-header>
      <view class="content">
        <view class="searchBox">
          <u-search
            @click="goSearchPage"
            placeholder="搜索机构"
            v-model="keyword"
            shape="round"
            :show-action="false"
            :clearabled="false"
            :disabled="true"
            border-color="var(--theme-color-dark-blue)"
            bg-color="var(--bg-color-main)"
          >
          </u-search>
        </view>
        <view class="doubleBox"></view>
        <view class="swiperBox">
          <u-swiper :current="0" :list="swiperList" :height="height"></u-swiper>
        </view>
        <view class="residentInstitutionBox">
          <organization
            v-if="tenantRecommendList.length > 0"
            :tenantRecommendList="tenantRecommendList"
          ></organization>
        </view>
        <servicePackageList
          :bgColor="bgColor"
          :leftTitle="leftTitle"
          class="servicePackage-box"
        ></servicePackageList>
        <healthEducation
          :isNeedTenantId="false"
          :title="'最新科普'"
        ></healthEducation>
      </view>
    </view>
  </theme>
</template>

<script>
import servicePackageList from "@/components/components/service-package-list/service-package-list.vue"
import organization from "./components/organization.vue"
import { getBannerList, getTenantRecommend } from "@/api/tabbar-index.js"
import healthEducation from "@/components/components/health-education/health-education.vue"
import { TEAM_ID } from "@/const/storage-key"
export default {
  components: {
    servicePackageList,
    organization,
    healthEducation
  },
  data() {
    return {
      leftTitle: "特色服务",
      keyword: "",
      swiperList: [],
      height: "320",
      bgColor: "var(--bg-color-main)",
      tenantRecommendList: []
    }
  },
  onLoad() {
    this.getBannerList()
    this.getTenantRecommendList()
    uni.setStorageSync(TEAM_ID, "1") //默认是1
  },
  methods: {
    goSearchPage() {
      this.$Router.push({
        name: "searchOrganization",
        params: {
          keyword: this.keyword
        }
      })
    },
    // 获取banner的图片列表
    getBannerList() {
      getBannerList("1", false)
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
              let arr = res.data
              arr.forEach(item => {
                item.image = item.cover
              })
              this.swiperList = arr
            } else {
              this.swiperList = []
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    },
    getTenantRecommendList() {
      getTenantRecommend()
        .then(res => {
          if (res.code === 200) {
            this.tenantRecommendList = res.data
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  min-height: 100vh;
  background: var(--bg-color-home);
}
.content {
  .searchBox {
    height: 82rpx;
    position: fixed;
    left: 0;
    right: 0;
    width: 95%;
    margin: auto auto;
    background: var(--bg-color-main);
    z-index: 100;
    padding-top: 5px;
  }
  .doubleBox {
    z-index: 100;
    margin: auto auto;
    width: 100%;
    height: 80rpx;
  }
  .swiperBox {
    width: 95%;
    margin: 8px auto auto;
  }
  .servicePackage-box {
    background: var(--bg-color-fdfdfd);
  }
}
</style>
<style lang="scss">
.swiperBox {
  swiper {
    height: 280rpx !important;
    border-radius: 23rpx;
    overflow: hidden;
  }
  /deep/ .u-swiper-image {
    height: 280rpx !important;
    padding: 0 !important;
  }

  /deep/ .u-swiper-indicator {
    bottom: 0 !important;
  }
  swiper {
    background: rgba(00, 00, 00, 0) !important;
  }
  .u-indicator-item-round {
    background: var(--text-color-grey) !important;
  }
  /deep/.u-indicator-item-round-active {
    background: var(--theme-color-dark-blue) !important;
  }
  /deep/ .u-swiper-wrap {
    height: 320rpx !important;
  }
}
</style>
