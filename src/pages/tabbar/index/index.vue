<template>
  <theme>
    <view class="all" slot="theme">
      <view class="header" v-show="navflag"
        ><house-header
          :headTypeOne="headTypeOne"
          :changeTenantIconShow="changeTenantIconShow"
        ></house-header
      ></view>

      <!-- banner图 -->
      <view class="swiper-box"
        ><u-swiper
          :mode="bannermode"
          :current="0"
          :list="list"
          :height="height"
          @click="goBannerDetails"
        ></u-swiper
      ></view>

      <!-- 运动，商城。。。 -->
      <view class="vajraDistrictBox" v-if="havetenantId"
        ><vajraDistrict :vajraDistrictList="vajraDistrictList"></vajraDistrict
      ></view>

      <!-- 健康服务包 -->
      <characteristicSpecialty
        :bgColor="bgColor"
        :leftTitle="leftTitle"
        class="servicePackage-box"
        v-if="havetenantId"
      />
      <!--      <servicePackageList-->
      <!--        :bgColor="bgColor"-->
      <!--        :leftTitle="leftTitle"-->
      <!--        class="servicePackage-box"-->
      <!--        v-if="havetenantId"-->
      <!--      ></servicePackageList>-->
      <!-- 健康教育 -->
      <healthEducation
        ref="healthEducation"
        title="健康科普"
        :isNeedTenantId="true"
        v-if="havetenantId"
      ></healthEducation>
      <u-tabbar
        :border-top="true"
        bg-color="var(--bg-color-main)"
        active-color="var(--text-color-main)"
        :list="tabbarList"
      ></u-tabbar>
    </view>
  </theme>
</template>

<script>
import {getDictionaries} from "@/api/vajra-district"
import {tabbarList} from "@/utils/tabbar/tabbarList"
import {TEAM_ID} from "@/const/storage-key"
import {getBannerList, getBannerSeverPageInfo} from "@/api/tabbar-index.js"
import characteristicSpecialty from "@/components/components/characteristic-specialty/characteristic-specialty-list.vue"
//import servicePackageList from "@/components/components/service-package-list/service-package-list.vue"
import healthEducation from "@/components/components/health-education/health-education.vue"
import vajraDistrict from "@/components/components/vajra-district/index.vue"
import {getAreaCategoryList} from "@/api/vajra-district.js"
import {getDoctorMessage} from "@/utils/getWebSocketMessage.js"
import {getTenantList} from "@/api/login"
export default {
  data() {
    return {
      leftTitle: "特色专科",
      resourceId: null,
	  bannermode:'rect',//图片只有一张不显示指示器
      tabbarList,
      bgColor: "var(--bg-color-main)",
      height: "428",
      code: "",
      // showTab: false,
      list: [],
      motion: "motion",
      loading: true,
      vajraDistrictList: [],
      tenantId: null,
      havetenantId: false,
      changeTenantIconShow: false,
      headTypeOne: "查询中...",
      tenantIdChangeValue: false,
      navbarH: null, //导航栏高度
      navflag: true //导航栏显示开关
    }
  },
  watch: {
    message: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tabbarList[2].isDot = val
      }
    },
    "$store.state.theme.tenantId": {
      immediate: true,
      deep: true,
      handler(newval, oldval) {
        if (oldval !== undefined) {
          if (newval == oldval) {
            this.tenantIdChangeValue = false
          } else {
            this.havetenantId = false
            // this.showTab = false
            this.tenantIdChangeValue = true
          }
          this.list = []
          this.vajraDistrictList = []
        } else {
          this.tenantIdChangeValue = false
        }
      }
    }
  },
  computed: {
    message() {
      return this.$store.state.theme.message
    }
  },
  components: {
    // servicePackageList,
    characteristicSpecialty,
    healthEducation,
    vajraDistrict
  },
  onLoad(option) {
    if (option.tenantId) {
      this.tenantId = option.tenantId
      this.$store.commit("getenants", this.tenantId)
    }
    if (option.scene) {
      const scene = decodeURIComponent(option.scene)
      this.tenantId = scene.split("=")[1]
      this.$store.commit("getenants", this.tenantId)
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage", "shareTimeline"]
    })
    if (!this.tenantIdChangeValue) {
      let tenantId = uni.getStorageSync("tenantId")
      this.tenantId = tenantId ? tenantId : "0"
      this.saveTenantId().then(() => {
        this.havetenantId = true
        this.setStorageTeamId()
        this.getBannerList()
        this.areaCategoryList()
      })
      // console.log(this.tenantIdChangeValue, "刷新一次")
    }
  },
  onShow() {
    //获取导航栏 胶囊位置信息
    const demo = uni.getMenuButtonBoundingClientRect()
    // this.Navheight = demo.height + "px"
    // this.NavpaddingTop = demo.top + "px"
    //设备信息
    wx.getSystemInfo({
      success: e => {
        this.navbarH =
          e.statusBarHeight + demo.height + (demo.top - e.statusBarHeight) * 2
        // console.log(e.statusBarHeight + demo.height + (demo.top-e.statusBarHeight)*2,150000)
      }
    })

    if (this.tenantIdChangeValue) {
      // console.log(this.tenantIdChangeValue, "每次都刷新")
      let tenantId = uni.getStorageSync("tenantId")
      this.tenantId = tenantId ? tenantId : "0"
      this.saveTenantId().then(() => {
        this.havetenantId = true
        this.setStorageTeamId()
        this.getBannerList()
        this.areaCategoryList()
      })
    }
    if (this.$store.state.user.isLogin) {
      this.$store.dispatch("getServicePackageInfo")
    }
    this.getTenantInfo()
    this.tenantIdChangeValue = false
  },

  onShareAppMessage(res) {
    let tenantId = uni.getStorageSync("tenantId")
    return {
      title: "核联医",
      path: "/pages/tabbar/index/index?tenantId=" + tenantId, //若无path 默认跳转分享页
      imageUrl:
        "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/dff07901ff6ee94335d1687373c4bf5.jpg", //若无imageUrl 截图当前页面
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
    //获取租户信息列表
    getTenantInfo() {
      getTenantList().then(res => {
        if (res.code === 200) {
          if (res.data.length > 1) {
            this.changeTenantIconShow = true
          }
          if (res.data.length > 0) {
            let tenantName = res.data.filter(item => item.id == this.tenantId)
            this.headTypeOne = tenantName[0].name
          }
        }
      })
    },
    //获取字典list
    getDictionariesList() {
      getDictionaries("wx_app_static_data").then(res => {
        if (res.code === 200) {
          let vajraDistrictDictionaries = res.data
          this.$store.commit(
            "getVajraDistrictDictionaries",
            vajraDistrictDictionaries
          )
        }
      })
    },
    //获取金刚区list
    areaCategoryList() {
      uni.closeSocket()
      getAreaCategoryList().then(res => {
        if (res.code === 200) {
          getDoctorMessage(false)
          this.vajraDistrictList = res.data
          this.getDictionariesList()
        }
      })
    },
    // 前往banner详情
    goBannerDetails(index) {
      const item = this.list[index]
      if (this.isRichTextBannerType(item)) {
        this.richTextBannerTypeDetails(item)
      } else if (this.isServicePackageBannerType(item)) {
        this.servicePackageBannerDetails(item)
      } else if (this.isgoWeChatOfficialAccount(item)) {
        this.goWeChatOfficialAccount(item)
      } else {
        this.$util.Tips({
          title: "暂未开放，敬请期待"
        })
      }
    },
    isRichTextBannerType(item) {
      return item.type === 0
    },
    isServicePackageBannerType(item) {
      return item.type === 5
    },
    isgoWeChatOfficialAccount(item) {
      // return item.type === 2
    },
    richTextBannerTypeDetails(item) {
      this.$Router.push({
        path: "/teamDetails",
        query: {
          id: item.id
        }
      })
    },
    goWeChatOfficialAccount(item) {
      this.$Router.push({
        path: "/goWeChatOfficialAccount",
        query: {
          url: item.url
        }
      })
    },
    /**
     * 获取banner跳转服务包信息
     * @param item
     * @return {Promise<void>}
     */
    async servicePackageBannerDetails(item) {
      const errorHandler = () => {
        this.$util.Tips({
          title: "加载失败请重试"
        })
      }
      try {
        const response = await getBannerSeverPageInfo(item.resourceId)
        const {code, data, message} = response
        if (code == "200") {
          uni.navigateTo({
            url: `pages/shopping-mall/goods_details/index?id=${
              item.resourceId
            }&useDirection=${JSON.stringify(
              data.useDirection
            )}&healthTips=${JSON.stringify(data.healthTips)}&servicePackageId=${
              data.servicePackageId
            }`
          })
        } else {
          errorHandler()
          console.error(
            `banner goto servicePackage error, code ${code} error message ${message}`
          )
        }
      } catch (e) {
        errorHandler()
        console.error("banner goto servicePackage catch error:")
        console.error(e)
      }
    },
    // 判断是否已经设置了团队id
    hasTeamId() {
      const teamId = uni.getStorageSync(TEAM_ID)
      if (teamId) {
        return true
      } else {
        return false
      }
    },
    setStorageTeamId() {
      let hasTeamId = this.hasTeamId()
      if (!hasTeamId) {
        uni.setStorageSync(TEAM_ID, "1") //默认是1
      }
    },
    // 获取banner的图片列表
    getBannerList() {
      getBannerList(uni.getStorageSync(TEAM_ID), true)
        .then(res => {
          if (res.code === 200) {
            if (res.data && res.data.length > 0) {
				if(res.data.length == 1){
					this.bannermode = 'none'
				}
              let arr = res.data
              arr.forEach(item => {
                item.image = item.cover
              })
              this.list = arr
            } else {
              this.list = []
            }
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  //监听滚动条
  onPageScroll(e) {
    // console.log(e,this.navbarH)
    // if (!this.navflag) {
    //   if (230 <= e.scrollTop) {
    //     this.navflag = true
    //   } else {
    //     this.navflag = false
    //   }
    // } else {
    //   if (e.scrollTop <= this.navbarH) {
    //     this.navflag = false
    //   }
    // }
  }
}
</script>

<style lang="scss" scoped>
.all {
  min-height: 100vh;
  background: var(--bg-color-home);
}
.header {
  // outline: 1px solid red;
  transition: all 5s linear;
  // position: sticky;
  // top: 0;
}

.icon-font {
  width: 96rpx;
  height: 96rpx;
  border-radius: 50%;
  margin-bottom: 20rpx;
  margin: 0 auto;
}

.swiper-box {
  width: 100%;
  // height: 428rpx;
  height: 460rpx;
  margin: 0 auto;
  border-radius: 16rpx;
}
.u-skeleton {
  height: 428rpx;
}

.servicePackage-box {
  background: var(--bg-color-fdfdfd);
}
.imag {
  width: 100%;
}
</style>
<style lang="scss">
/deep/ .u-swiper-wrap {
  height: 460rpx !important;
  position: relative;
}
.swiper-box {
  swiper {
    height: 460rpx !important;
    // border-radius: 23rpx;
    overflow: hidden;
  }
  /deep/ .u-swiper-image {
    height: 460rpx !important;
    padding: 0 !important;
    clip-path: ellipse(150% 100% at 50% 0%);
  }

  /deep/ .u-swiper-indicator {
    padding: 0rpx 0 !important;
    width: auto !important;
    background-color: #ffffff;
    position: absolute;
    left: 50% !important;
    transform: translateX(-50%);
    z-index: 999;
    border-radius: 10px;
    bottom: 50rpx !important;
  }
  swiper {
    background: rgba(00, 00, 00, 0) !important;
  }
  .u-indicator-item-rect {
    width: 35rpx !important;
    height: 10rpx !important;
    // background: var(--text-color-grey) !important;
    background-color: transparent !important;
    margin: 0 !important;
    border-radius: 10rpx;
  }
  /deep/.u-indicator-item-rect-active {
    width: 35rpx !important;
    height: 10rpx !important;
    background: var(--theme-color-dark-purple) !important;
    border-radius: 10rpx;
  }
}
</style>
