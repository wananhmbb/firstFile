<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="单腿站立平衡"></house-header>
      <view class="main-content">
        <view class="present">
          <view class="main">
            <img :src="presentData.url" mode="widthFix" />
            <view class="text">
              <view class="round"></view>
              <view class="title">
                {{ presentData.action }}
              </view>
            </view>
          </view>
        </view>
        <view class="kong"></view>
        <view class="submit">
          <text class="text">计时</text>
          <view class="time">
            <view class="minutes">
              {{ minute }}
            </view>
            <view class="colon"> : </view>
            <view class="minutes">
              {{ second }}
            </view>
          </view>
          <view class="btn">
            <view class="start bg" v-if="show" @click="begin"> 开始 </view>
            <view class="start end" v-else @click="pause"> 结束 </view>
          </view>
        </view>
      </view>
      <view class="model-box">
        <u-popup mode="bottom" v-model="showUp" height="550px">
          <view class="upmain">
            <view class="picBox">
              <img
                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/img_result_bg%402x.png"
              />
            </view>
            <view class="box">
              <view class="title"></view>
              <scroll-view scroll-y="true" style="height: 350px">
                <view class="contentBox">
                  <view class="resultName">本次测评结果</view>
                  <view class="result">
                    <view class="">
                      <text class="text">安静心率</text>
                      <text class="num">{{ form.type3.value }}次/分</text>
                    </view>
                    <view :class="getType3Color[form.type3.evaluationResult]">
                      {{ form.type3.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">坐位体前屈</text>
                      <text class="num">{{ form.type.value }}cm</text>
                    </view>
                    <view :class="getTypeColor[form.type.evaluationResult]">
                      {{ form.type.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">靠墙静蹲</text>
                      <text class="num">{{ form.type1.value }}秒</text>
                    </view>
                    <view :class="getType1Color[form.type1.evaluationResult]">
                      {{ form.type1.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">两分钟踏步</text>
                      <text class="num">{{ form.type2.value }}次</text>
                    </view>
                    <view :class="getType2Color[form.type2.evaluationResult]">
                      {{ form.type2.evaluationResult }}
                    </view>
                  </view>
                  <view class="result">
                    <view class="">
                      <text class="text">单腿平衡</text>
                      <text class="num">{{ form.type4.value }}秒</text>
                    </view>
                    <view :class="getType4Color[form.type4.evaluationResult]">
                      {{ form.type4.evaluationResult }}
                    </view>
                  </view>
                </view>
                <view class="name">推荐服务包</view>
                <servicePackageListItem
                  :serveBackgroundItem="serveBackgroundItem"
                  :itemData="goodsData"
                ></servicePackageListItem>
                <view class="form-css"></view>
              </scroll-view>
              <view class="basicInfo">
                <u-button type="primary" shape="circle" @click="Ikonw"
                  >我知道了</u-button
                >
              </view>
            </view>
          </view>
        </u-popup>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import { healthTotalScore, getServicePackData } from "@/api/service"
import servicePackageListItem from "@/components/components/service-package-list/service_package_list_item.vue"

export default {
  components: {
    // eslint-disable-next-line vue/no-unused-components
    servicePackageListItem
  },
  data() {
    return {
      getTypeColor: {
        优秀: "blue",
        很好: "blue",
        好: "yellow",
        一般: "yellow",
        需改进: "red"
      },
      getType1Color: {
        高: "blue",
        中: "yellow",
        低: "red"
      },
      getType2Color: {
        强: "blue",
        标准: "yellow",
        弱: "red"
      },
      getType3Color: {
        运动员: "blue",
        非常好: "blue",
        良好: "yellow",
        较好: "yellow",
        平均: "yellow",
        较差: "red",
        差: "red"
      },
      getType4Color: {
        良好: "blue",
        中等: "yellow",
        中等以下: "yellow",
        差: "red"
      },
      presentData: {
        url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E5%8D%95%E8%85%BF%E5%B9%B3%E8%A1%A1.png",
        action:
          "动作要求：站立位，双手放松放在身体两侧，缓慢抬起右腿离开地面，保持身体平衡，避免晃动"
      },
      timer1: null,
      minutes: 0,
      seconds: 0,
      minute: "00",
      second: "00",
      show: true,
      multipleData: "",
      goodsData: {
        id: "",
        image: "",
        storeName: "",
        storeInfo: [
          {
            useDirection: ""
          }
        ],
        productOrderInfo: {
          teamName: "",
          useDirection: "", //可以为空
          healthTips: "", //可以为空
          servicePackageId: ""
        }
      },
      showUp: false,
      serveBackgroundItem: "var(--bg-color-secondhome)",
      form: {}
    }
  },
  methods: {
    //开始计时
    begin() {
      this.show = false
      this.timer1 = setInterval(this.startTimer, 1000)
    },
    // 结束计时
    pause() {
      uni.showLoading({
        title: "加载中",
        mask: true
      })
      let s = 0
      if (this.minutes) {
        s = this.minutes * 60 + this.seconds
      } else {
        s = this.seconds
      }
      if (this.timer1) {
        clearInterval(this.timer1)
        this.multipleData.evaluationContent.push({
          value: Number(s),
          type: 4
        })
        this.timer1 = null
        healthTotalScore(this.multipleData).then(res => {
          if (res.code == 200) {
            let e = res.data
            let data = JSON.parse(e.evaluationContent)
            data.map(v => {
              if (v.type == 0) {
                this.form.type = v
              } else if (v.type == 1) {
                this.form.type1 = v
              } else if (v.type == 2) {
                this.form.type2 = v
              } else if (v.type == 3) {
                this.form.type3 = v
              } else if (v.type == 4) {
                this.form.type4 = v
              }
            })
            this.getUpData(e)
          }
        })
      }
    },
    //获取弹窗数据
    async getUpData(e) {
      let res = await getServicePackData(e.productId)
      if (res.code == 200) {
        this.goodsData.id = e.productId
        this.goodsData.image = res.data.productInfo.image
        this.goodsData.storeName = res.data.productInfo.storeName
        let text = JSON.parse(res.data.productInfo.storeInfo)
        this.goodsData.storeInfo[0].useDirection = text[0].useDirection
        this.goodsData.productOrderInfo.servicePackageId = e.servicePackageId
        this.showUp = true
        this.show = true
        setTimeout(function () {
          uni.hideLoading()
        }, 100)
      }
    },
    Ikonw() {
      this.showUp = false
      uni.navigateBack({
        delta: 6
      })
    },
    //计时
    startTimer() {
      this.seconds += 1
      if (this.seconds >= 60) {
        this.seconds = 0
        this.minutes = this.minutes + 1
      }
      if (this.minutes >= 60) {
        this.minutes = 0
        this.seconds = 0
        this.minute = "00"
        this.second = "00"
      }
      this.minute = this.minutes < 10 ? "0" + this.minutes : this.minutes
      this.second = this.seconds < 10 ? "0" + this.seconds : this.seconds
    }
  },
  onLoad(options) {
    this.multipleData = this.$Route.query.data
  },
  onUnload() {
    if (this.timer1) {
      clearTimeout(this.timer1)
      this.timer1 = null
    }
  }
}
</script>

<style lang="scss" scoped>
.large {
  background: var(--bg-color-main);
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.main-content {
  flex: 1;
  background-color: var(--bg-color-second);
  // display: flex;
  // flex-direction: column;

  .present {
    width: 100%;

    .main {
      padding: 15px;
      background-color: var(--bg-color-main);

      img {
        height: 206px;
        width: 100%;
      }

      .text {
        display: flex;
        align-items: center;
        margin-top: 15px;

        .round {
          width: 8px;
          height: 8px;
          background-color: var(--theme-color-dark-blue);
          border-radius: 4px;
          margin-right: 5px;
        }

        .title {
          flex: 1;
          color: var(--text-color-main);
        }
      }
    }
  }

  .submit {
    padding: 15px;
    background-color: var(--bg-color-main);
    flex: 1;

    .text {
      color: var(--text-color-grey);
      margin-bottom: 5px;
    }

    .time {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 46px;
      color: var(--text-color-main);

      .colon {
        font-size: 46px;
        margin: 0 20px;
        position: relative;
        top: -5px;
      }

      .minutes {
        background-color: var(--bg-color-second);
        width: 77px;
        line-height: 77px;
        text-align: center;
      }
    }

    .btn {
      display: flex;
      align-items: center;
      justify-content: center;
      font-size: 24px;
      margin-top: 30px;
      position: relative;

      .start {
        color: var(--text-color-white);
        width: 90px;
        height: 90px;
        text-align: center;
        line-height: 75px;
        border-radius: 45px;
      }

      .bg {
        // background: var(--theme-color-dark-blue);
        // box-shadow: 0 0 20px var(--theme-color-dark-blue);
        background: #4d99f2;
        border: 6px solid #bcdafa;
        box-shadow: 0 0 0 6px rgba(77, 153, 242, 0.1);
      }

      .end {
        background: #f2bf4d;
        border: 6px solid #fae7bd;
        box-shadow: 0 0 0 6px rgba(242, 191, 77, 0.1);
      }
    }
  }

  .kong {
    background-color: var(--bg-color-second);
    height: 15px;
  }

  .bottom {
    flex: 1;
    display: flex;
  }
}
//弹窗
/deep/.u-mode-center-box {
  background-color: transparent !important;
}

.model-box {
  /deep/ .u-drawer-content {
    width: 100%;
    background-color: transparent !important;
  }
}

.upmain {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: space-around;
  overflow: hidden;
  .picBox {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
    img {
      width: 100%;
      height: 100%;
    }
  }

  .box {
    width: 100%;
    height: 100%;
    background: var(--bg-color-main);
    margin-top: 120px;
    border-radius: 10px;
    .title {
      padding-bottom: 15px;
      margin-top: 90px;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .name {
      margin-top: 20px;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .resultName {
      margin-bottom: 12px;
      text-align: center;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .result {
      color: var(--text-color-main);
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 5px 35px;
      font-size: 16px;

      .num {
        margin-left: 10px;
        font-size: 14px;
        color: var(--text-color-grey);
      }

      .text {
        display: inline-block;
      }

      .red {
        border: 1px solid #ff7874;
        padding: 2px 5px;
        border-radius: 5px;
        color: #ff7874;
      }

      .blue {
        border: 1px solid #68a0ff;
        padding: 2px 5px;
        border-radius: 5px;
        color: #68a0ff;
      }

      .yellow {
        border: 1px solid #faac4e;
        padding: 2px 5px;
        border-radius: 5px;
        color: #faac4e;
      }

      .green {
        border: 1px solid #4dd4b8;
        padding: 2px 5px;
        border-radius: 5px;
        color: #4dd4b8;
      }
    }
  }
}
.contentBox {
  color: var(--text-color-main);
  text-align: center;
}
.form-css {
  width: 100%;
  height: 85px;
  background: var(--bg-color-main);
}
.basicInfo {
  position: fixed;
  z-index: 999;
  left: 0;
  right: 0;
  bottom: 0;
  padding: 40rpx 5%;
  background: var(--bg-color-main);
}
</style>
