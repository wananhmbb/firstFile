<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="我的卡劵"></house-header>
      <view class="tabs-css">
        <u-tabs
          bg-color="var(--bg-color-main)"
          :is-scroll="false"
          :list="groupTabList"
          :current="currentTabIndex"
          @change="onTabChanged"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
        ></u-tabs>
      </view>
      <view>
        <mescroll-uni
          @down="downCallback"
          @up="upCallback"
          :down="downOption"
          :up="upOption"
          :top="MescrollTop"
          @init="initScroll"
          ref="mescrollRef"
        >
          <toBeUsed v-if="currentTabIndex == 0" :cardList="cardList"></toBeUsed>
          <used v-if="currentTabIndex == 1" :cardList="cardList"></used>
        </mescroll-uni>
      </view>
      <view class="btnbox">
        <view class="btn">
          <u-button
            type="primary"
            shape="circle"
            throttle-time="3000"
            @click="modalShow = true"
            >兑换优惠券</u-button
          >
        </view>
      </view>
      <view class="empty" v-if="!cardList || cardList.length == 0">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
      <view
        class="loading-box"
        v-if="loading"
        :style="{ top: MescrollTop - 70 + 'rpx' }"
      >
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <u-popup
        v-model="modalShow"
        mode="center"
        border-radius="14"
        width="70%"
        :closeable="true"
        @close="close"
      >
        <view class="formitem">
          <view class="titleStyle">兑换优惠券</view>
          <u-form :model="form" ref="uForm" :error-type="errorType">
            <u-form-item prop="code">
              <u-input v-model="form.code" placeholder="请输入兑换码" />
            </u-form-item>
          </u-form>
        </view>
        <view class="button">
          <u-button type="primary" shape="circle" @click="exchange">
            兑换
          </u-button>
        </view>
      </u-popup>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import { toBeUsed } from "./components/toBeUsed"
import { used } from "./components/used"
import { getMyToBeUsedCardList, exchangeCoupon } from "@/api/myCard.js"
export default {
  components: {
    toBeUsed,
    used
  },
  data() {
    return {
      MescrollTop: "",
      mark: false,
      pageNum: 0,
      pageSize: 10,
      downOption: {
        use: true,
        offset: 40, // 下拉刷新时的偏移位置
        textSuccess: "加载成功",
        textOutOffset: "释放更新",
        auto: false,
        fps: 10 // 节流设置
      },
      upOption: {
        use: true,
        auto: true,
        bgColor: "var(--bg-color-second)",
        textColor: "var(--text-color-grey",
        textNoMore: "已全部加载",
        noMoreSize: 10,
        offset: 0,
        empty: {
          warpId: null,
          icon: null,
          tip: "暂无相关数据~",
          btntext: "",
          btnClick: null,
          supportTap: false
        }
      },
      cardList: [],
      dataSize: null,
      modalShow: false,
      currentTabIndex: 0,
      groupTabList: [{ name: "待使用" }, { name: "已使用" }],
      loading: true,
      errorType: ["toast"],
      form: {
        code: ""
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入兑换码",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ]
      }
    }
  },
  onLoad() {
    this.currentTabIndex = 0
    // this.getToBeUsed(1, 10, "usable")
    var obj = uni.getMenuButtonBoundingClientRect()
    let top = obj.top
    let height = obj.height
    this.MescrollTop = top + height + 5 + 160
  },
  methods: {
    //获取评估问卷
    getToBeUsed(pageNum, pageSize, type) {
      getMyToBeUsedCardList(pageNum, pageSize, type).then(res => {
        if (res.code === 200) {
          this.loading = false
          var newlist = res.data
          if (newlist) {
            this.mescroll.lockUpScroll(false)
            this.dataSize = Number(res.data.total)
            let list =
              pageNum === 1 ? [] : JSON.parse(JSON.stringify(this.cardList))
            this.cardList = !this.mark
              ? [...list, ...res.data.list]
              : this.cardList
            this.mark = Number(res.data.total) < 10
            if (this.mark) {
              this.mescroll.showNoMore()
              // this.mescroll.endSuccess(Number(res.data.total), false)
            } else {
              this.mescroll.endSuccess(Number(res.data.total), true)
            }
          } else {
            this.mescroll.lockUpScroll(true)
            this.mescroll.showNoMore()
            this.mescroll.endUpScroll(true)
          }
        }
      })
    },
    //兑换
    exchange() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          console.log("验证通过")
          exchangeCoupon(this.form.code).then(res => {
            console.log(res, "兑换")
            if (res.code === 200) {
              this.$refs.uToast.show({
                title: "兑换成功,稍后到账",
                type: "success"
              })
              this.modalShow = false
              if (this.currentTabIndex === 0) {
                this.downCallback()
              } else {
                this.onTabChanged(0)
              }
            } else {
              this.$refs.uToast.show({
                title: res.msg,
                type: "error"
              })
            }
          })
        } else {
          console.log("验证失败")
        }
      })
    },
    //切换tabs
    onTabChanged(index) {
      this.loading = true
      this.cardList = []
      this.currentTabIndex = index
      this.mark = false
      this.downCallback()
    },
    initScroll(mescroll) {
      this.mescroll = mescroll
    },
    downCallback() {
      this.mescroll.endDownScroll()
      this.pageNum = 1
      if (this.currentTabIndex === 0) {
        this.getToBeUsed(this.pageNum, 10, "usable")
      }
      if (this.currentTabIndex === 1) {
        this.getToBeUsed(this.pageNum, 10, "unusable")
      }
    },
    upCallback() {
      this.mescroll.endErr()
      this.pageNum++
      if (this.currentTabIndex === 0) {
        this.getToBeUsed(this.pageNum, 10, "usable")
      }
      if (this.currentTabIndex === 1) {
        this.getToBeUsed(this.pageNum, 10, "unusable")
      }
    },
    close() {
      this.form.code = ""
    }
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-mode-center-box {
  background: var(--bg-color-second) !important;
}
/deep/.mescroll-uni-fixed {
  bottom: 90px !important;
}
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.model-box {
  /deep/.u-model {
    border-radius: 30rpx;
    overflow: hidden;
  }
}
.titleStyle {
  text-align: center;
  font-size: 32rpx;
  color: var(--text-color-main);
  font-weight: bolder;
  padding: 0 0 30px 0;
}
.formitem {
  width: 80%;
  margin: auto;
  padding: 30px 0;
  .delete {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
  }
  /deep/ .u-form-item__message {
    padding: 0 !important;
  }
  /deep/ .u-input__input {
    color: var(--text-color-main);
  }
}
.button {
  width: 90%;
  padding: 20px;
  margin: auto;
}
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
}
.btnbox {
  width: 100%;
  min-height: 90px;
  background: var(--bg-color-second);
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 210;
}
.btn {
  padding: 20px 5%;
}
.loading-box {
  width: 100vw;
  margin: 40px auto auto;
  text-align: center;
  line-height: 80vh;
  position: fixed;
  bottom: 100px;
  left: 0;
  background: var(--bg-color-second);
  z-index: 201;
}
.tabs-css {
  overflow-x: scroll;
  width: 100%;
  z-index: 20;
  background: var(--bg-color-main);
}
.form-css {
  width: 100%;
  height: 200px;
  background: var(--bg-color-second);
}
.empty {
  width: 100%;
  height: 100%;
  text-align: center;
  z-index: 200;
  position: fixed;
  background: var(--bg-color-second);
  padding-top: 150px;
}
</style>
