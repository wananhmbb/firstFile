<template>
  <view>
    <view :class="[headRegisterHeader ? 'head-register-box' : 'head-view']">
      <view
        class="head-box"
        :style="{ paddingTop: top + 'px' }"
        v-if="headTypeOne"
      >
        <view class="head-one" :style="{ lineHeight: height + 'px' }">
          <view v-if="headTypeOne === '华西健康'">{{ headTypeOne }}</view>
          <view @click="changeTenant()" class="changeTenanticonIcon" v-else>
            <view>{{ headTypeOne }}</view>
<!--            <view class="changeTenanticon" v-if="changeTenantIconShow">-->
<!--              <image-->
<!--                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/Switch%20tenants.png"-->
<!--              ></image>-->
<!--            </view>-->
          </view>
        </view>
      </view>

      <view
        class="head-box"
        :style="{ paddingTop: top + 'px' }"
        v-if="headTypeTwo"
      >
        <view
          class="head-two"
          :style="{ height: height + 'px', lineHeight: height + 'px' }"
        >
          <view
            v-if="
              headTypeTwo != '服务' &&
              headTypeTwo != '我的' &&
              headTypeTwo != ' '
            "
            @click="back()"
            class="iconView"
          >
            <u-icon name="arrow-left" color="var(--text-color-main)"></u-icon
          ></view>
          <view class="title-text">{{ headTypeTwo }}</view>
        </view>
      </view>

      <view
        class="head-box-bg"
        :style="{ paddingTop: top + 'px' }"
        v-if="headTypeThird"
      >
        <view class="head-third" :style="{ lineHeight: height + 'px' }">{{
          headTypeThird
        }}</view>
      </view>
      <view
        class="head-register-box"
        :style="{ paddingTop: top + 'px' }"
        v-if="headRegisterHeader"
      >
        <view
          class="head-register-header"
          :style="{ height: height + 'px', lineHeight: height + 'px' }"
        >
          <view
            v-if="headRegisterHeader != '服务' && headRegisterHeader != '我的'"
            @click="back()"
            class="iconView"
          >
            <u-icon name="arrow-left"></u-icon
          ></view>
          <view class="title-text">{{ headRegisterHeader }}</view>
        </view>
      </view>
    </view>
    <view :style="{ height: MescrollUniHight + 'px' }"></view>
  </view>
</template>

<script>
export default {
  data() {
    return {
      top: 0,
      left: 0,
      height: 0,
      MescrollUniHight: 0
    }
  },
  created() {
    //布局 不要改！！
    var obj = uni.getMenuButtonBoundingClientRect()
    this.top = obj.top
    this.left = obj.left
    this.height = obj.height
    this.MescrollUniHight = this.top + this.height + 5
    this.$store.commit("SET_MESCROLL_UNI_HEIGHT", this.MescrollUniHight)
    let _this = this
    const pages = getCurrentPages() // 获取加载的页面
    const currentPage = pages[pages.length - 1] // 获取当前页面的对象
    const url = currentPage.route // 当前页面url
    if (url === "my-sub-pages/pages/consult/chat/index") {
      uni.closeSocket()
      // console.log("sdoihds关闭")
    }
  },
  props: [
    "headTypeOne",
    "headTypeTwo",
    "headTypeThird",
    "headBackPath",
    "getIndex",
    "headRegisterHeader",
    "changeTenantIconShow",
    "clearTenantId",
    "backStep"
  ],
  methods: {
    //切换租户
    changeTenant() {
      // this.$Router.push({
      //   path: "/changeTenant"
      // })
    },
    back() {
      if (this.headBackPath) {
        uni.reLaunch({
          url: this.headBackPath
        })
      } else {
        this.noSpecifiesPath()
        if (this.clearTenantId === "true") {
          uni.removeStorageSync("tenantId")
        }
      }
    },
    //没有制定返回的path时
    noSpecifiesPath() {
      let pageNumber = getCurrentPages().length
      // console.log(this.backStep, "返回的步数")
      if (pageNumber > 1) {
        if (this.backStep) {
          uni.navigateBack({
            delta: this.backStep
          })
        } else {
          if (this.getIndex) {
            let pages = getCurrentPages()
            let prevPage = pages[pages.length - 2]
            prevPage.setData({
              getIndex: this.getIndex
            })
            uni.navigateBack({
              delta: 1
            })
            return
          }
          uni.navigateBack({
            delta: 1
          })
        }
      } else {
        uni.switchTab({
          url: "pages/tabbar/index/index"
        })
      }
    }
  }
}
</script>

<style lang="scss" scoped>
.head-view {
  width: 100%;
  position: fixed;
  top: 0;
  z-index: 9999;
  background: var(--bg-color-main);
}
.head-box {
  margin: auto;
  z-index: 1000;
}
.head-register-box {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9999;

  background: #fff;
}
.head-box-bg {
  width: 100%;
  margin: auto;
  z-index: 1000;
  background: var(--theme-color-dark-blue);
}
.head-one {
  display: flex;
  width: 95%;
  margin: auto auto 5px auto;
  font-size: 34rpx;
  font-weight: bold;
  color: var(--text-color-main);
  .changeTenanticonIcon {
    display: flex;
    align-items: center;
    .changeTenanticon {
      width: 40rpx;
      height: 35rpx;
      font-size: 0;
      margin-left: 4px;
      image {
        width: 100%;
        height: 100%;
      }
    }
  }
}
.head-two {
  width: 100%;
  display: flex;
  justify-content: center;
  background: var(--bg-color-main);
  font-size: 34rpx;
  font-weight: bold;
  margin-bottom: 5px;
}
.head-register-header {
  width: 100%;
  display: flex;
  justify-content: center;
  background: #fff;
  font-size: 34rpx;

  font-weight: bold;
  margin-bottom: 5px;
}
.iconView {
  width: 50px;
  position: absolute;
  left: 5px;
}
.head-third {
  width: 100%;
  padding-bottom: 5px;
  font-size: 34rpx;
  font-weight: bold;
  text-align: center;
  color: var(--text-color-white);
}
.title-text {
  width: 50%;
  text-align: center;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-color-main);
}
</style>
