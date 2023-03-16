<template>
  <theme>
    <view class="all" slot="theme">
      <view class="fill-top-box" :style="{ paddingTop: top + 'px' }">
        <view
          v-if="servicePackageList.length > 1"
          :style="{ lineHeight: height + 'px' }"
          class="title-text"
          @click="openMask"
        >
          <view class="titleIcon">
            <image
              :src="
                openShow
                  ? 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/arrow-up.png'
                  : 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/arrow-down.png'
              "
            ></image>
          </view>
          <view class="text">{{ headerTitle }}</view>
        </view>
        <view
          :style="{ lineHeight: height + 'px' }"
          class="title-text"
          v-if="
            servicePackageList.length < 1 || servicePackageList.length === 1
          "
          ><text class="text">{{ headerTitle }}</text></view
        >
      </view>
      <view class="box" :style="{ paddingTop: MescrollUniHight + 'px' }">
        <buyServicePackageComponent
          ref="ServiceStepsList"
          v-if="servicePackage === 0"
          :projectList="projectList"
          :expireTime="expireTime"
          :servicePackageId="servicePackageId"
          :medicalCardId="medicalCardId"
          :stopTime="stopTime"
          :experience="experience"
          :status="status"
          :tenantName="tenantName"
          @onGrandfather="onGrandfather"
        ></buyServicePackageComponent>
        <notBuyServicePackageComponent
          @click="closeMask"
          class="not-buy-server"
          v-if="servicePackage === 1"
        ></notBuyServicePackageComponent>
      </view>
      <view class="emply" v-if="servicePackage === 2">
        <image
          src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/ipImage/404.png"
        ></image>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <u-popup
        v-model="mask"
        mode="bottom"
        height="45%"
        border-radius="20"
        @close="closeMask"
      >
        <view class="popupBox">
          <view class="popupBtnBox">
            <view class="title">切换服务包</view>
            <u-icon
              name="close"
              @click="closeMask"
              color="var(--text-color-main)"
            ></u-icon>
          </view>
          <view class="maskBox"></view>
          <view
            v-for="(item, index) in servicePackageList"
            :key="index"
            class="storeBox"
            @click="setSelectedServicePackage(item, index)"
          >
            <view class="storeBoxView-one">
              <view
                :class="
                  selectedServicePackage === index
                    ? 'storeBoxView-first '
                    : 'storeBoxView-first1'
                "
              >
                <u-icon name="checkbox-mark" color="#ffffff" size="28"></u-icon>
              </view>
            </view>
            <view class="storeBoxView-two">
              <view>{{ item.name }}</view>
            </view>
          </view>
        </view>
      </u-popup>
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
import buyServicePackageComponent from "./components/buy-service-package-component.vue"
import notBuyServicePackageComponent from "./components/not-buy-service-package-component.vue"
import { tabbarList } from "@/utils/tabbar/tabbarList"
export default {
  data() {
    return {
      openShow: false,
      mask: false,
      tabbarList,
      servicePackage: null,
      projectList: [],
      expireTime: "",
      stopTime: "",
      experience: false,
      tenantName: "",
      servicePackageId: null, //服务包id
      medicalCardId: null,
      status: null,
      loading: true,
      servicePackageList: [],
      selectedServicePackage: 0,
      isShow: false,
      top: 0,
      left: 0,
      height: 0,
      MescrollUniHight: 0,
      headerTitle: "服务",
      serverImgList: [
        {
          moduleLink: "JKDA",
          img: "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/service/SpecialistArchives.png"
        },
        {
          moduleLink: "JKCF",
          img: "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/service/electronicPrescription.png"
        },
        {
          moduleLink: "JKSF",
          img: "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/service/follow-up.png"
        },
        {
          moduleLink: "JKCP",
          img: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E7%BC%96%E7%BB%84%209%402x.png"
        },
        {
          moduleLink: "JKJY",
          img: "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/service/HealthEducation.png"
        },
        {
          moduleLink: "JKJC",
          img: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E7%BC%96%E7%BB%84%2010%402x.png"
        }
      ]
    }
  },
  components: {
    buyServicePackageComponent,
    notBuyServicePackageComponent
  },
  onHide() {
    this.isShow = false
  },
  onLoad() {
    var obj = uni.getMenuButtonBoundingClientRect()
    this.top = obj.top
    this.left = obj.left
    this.height = obj.height + 5
    this.MescrollUniHight = this.top + this.height + 5
  },
  onShow() {
    this.isShow = true
    if (this.$store.state.user.isLogin) {
      this.$store.dispatch("getServicePackageInfo")
    }
  },
  watch: {
    "$store.state.server.servicePackageList": {
      immediate: true,
      deep: true,
      handler(value) {
        this.servicePackageList = value
        if (value && value.length > 0) {
          this.headerTitle =
            this.servicePackageList[this.selectedServicePackage].name
        } else {
          this.headerTitle = "服务"
        }
      }
    },
    selectedServicePackage: {
      immediate: true,
      handler(val) {
        this.$store.commit("SET_SERVICE_PACKAGE_INDEX", val)
        this.$store.commit(
          "SET_SERVICE_PACKAGE_INFO",
          this.servicePackageList[val]
        )
        if (this.servicePackageList && this.servicePackageList.length > 0) {
          this.headerTitle = this.servicePackageList[val].name
        }
      }
    },
    "$store.state.server.servicePackageInfo": {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.loading = false
          if (val.id) {
            this.medicalCardId = val.medicalCardId
            this.servicePackageId = val.id
            this.projectList = val.projectList
            this.status = val.status
            this.stopTime = val.stopTime
            this.experience = val.experience
            this.tenantName = val.tenantName
            if (this.projectList) {
              this.projectList.forEach(item => {
                this.serverImgList.forEach(i => {
                  if (item.moduleLink === i.moduleLink) {
                    item.img = i.img
                  }
                })
              })
              this.expireTime = val.expireTime
            }
          }
          this.$nextTick(() => {
            if (this.isShow) {
              this.$refs.ServiceStepsList.whenServiceTabShow()
            }
          })
        } else {
          this.loading = false
        }
      }
    },
    "$store.state.server.servicePackage": {
      immediate: true,
      handler(val) {
        // console.log(val, "是否购买包")
        this.servicePackage = val
      }
    },
    openShow: {
      handler(val) {
        if (val == true) {
          this.mask = true
        } else {
          this.mask = false
        }
      }
    },
    message: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tabbarList[2].isDot = val
      }
    }
  },
  computed: {
    message() {
      return this.$store.state.theme.message
    }
  },
  methods: {
    onGrandfather(e) {
      if (e) this.$store.dispatch("getServicePackageInfo")
      this.$forceUpdate()
    },
    openMask() {
      this.openShow = !this.openShow
    },
    closeMask() {
      this.openShow = false
    },
    setSelectedServicePackage(item, index) {
      this.selectedServicePackage = index
      this.headerTitle = item.name
      this.closeMask()
    }
  }
}
</script>

<style lang="scss" scoped>
.fill-top-box {
  color: var(--text-color-main);
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;
  background: var(--bg-color-main);
}
.box {
  overflow: scroll;
}
/deep/.u-drawer-bottom {
  background-color: var(--bg-color-main) !important;
}
.all {
  height: 100vh;
  background: var(--bg-color-second);
}
.not-buy-server {
  height: 80vh;
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
.emply {
  width: 160px;
  height: 151px;
  margin: 150px auto auto auto;
  image {
    width: 100%;
    height: 100%;
  }
}
.title-text {
  padding-right: 10px;
  width: 95%;
  margin: auto;
  font-size: 34rpx;
  font-weight: bold;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-color-main);
  vertical-align: middle;
  display: flex;
  align-items: center;
  .text {
    width: 55%;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    margin-left: 8px;
  }
  .titleIcon {
    width: 40rpx;
    height: 40rpx;
    font-size: 0;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.popupBox {
  background: var(--bg-color-main);
}
.popupBtnBox {
  background: var(--bg-color-main);
  z-index: 10;
  display: flex;
  line-height: 45px;
  padding: 0 3%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  width: 100%;
  .title {
    color: var(--text-color-main);
    font-size: 36rpx;
    margin: auto;
    font-weight: bold;
  }
}
.maskBox {
  background: var(--bg-color-main);
  width: 100%;
  height: 45px;
}
.storeBox {
  width: 90%;
  margin: auto;
  display: flex;
  align-items: center;
  padding: 15px 0 10px 0;
  color: var(--text-color-main);
  .storeBoxView-first {
    width: 25px;
    line-height: 25px;
    border-radius: 50%;
    background: var(--theme-color-dark-blue);
    text-align: center;
    border: none;
  }
  .storeBoxView-first1 {
    width: 25px;
    line-height: 25px;
    border-radius: 50%;
    background: var(--bg-color-main);
    text-align: center;
    border: 1px solid var(--text-color-grey);
  }
  .storeBoxView-one {
    width: 12%;
  }
  .storeBoxView-two {
    width: 88%;
  }
}
</style>
