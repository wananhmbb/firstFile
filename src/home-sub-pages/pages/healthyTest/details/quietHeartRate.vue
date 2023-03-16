<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="安静心率"></house-header>
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
          <view class="main">
            <text class="text">倒计时</text>
            <view class="time">
              <view class="minutes">
                {{ minuteTime }}
              </view>
              <view class="colon"> : </view>
              <view class="minutes">
                {{ secondTime }}
              </view>
            </view>
            <view class="btn">
              <view
                :class="['start', show1 ? 'starting' : 'bg']"
                @click="countDown"
                >开始</view
              >

              <view class="start countdowns" v-if="show1"></view>
            </view>
            <view>
              <view class="text ipt mar">
                <view> 心率 </view>
                <view class="title"> 次/分 </view>
              </view>
              <u-input
                v-model="value"
                :custom-style="ipnCustomStyle"
                type="number"
                border
                placeholder="请输入"
              />
            </view>
            <view class="btnTime">
              <view
                class="overburden"
                v-if="overburden"
                @click="handOverburden"
              ></view>
              <u-button
                shape="circle"
                :custom-style="customStyle"
                type="primary"
                @click="sub"
                >下一步
              </u-button>
            </view>
          </view>
        </view>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
export default {
  data() {
    return {
      presentData: {
        url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E9%9D%99%E5%AE%89%E5%BF%83%E7%8E%87.png",
        action:
          "动作要求：请您静坐3min，用手指腹侧触摸颈部气管外侧的凹陷中，感受颈动脉的搏动"
      },
      timer2: null,
      minuteTime: "03",
      secondTime: "00",
      show1: false,
      cdTime: 0,
      time: 180000,
      value: "",
      customStyle: {
        background: "var(--bg-color-grey)",
        color: "var(--text-color-white)",
        fontSize: "16px"
      },
      ipnCustomStyle: {
        color: "var(--text-color-main)"
      },
      //按钮覆盖层
      overburden: true,
      multipleData: {}
    }
  },
  methods: {
    //未开始倒计时提交
    handOverburden() {
      this.$refs.uToast.show({
        title: "请开始倒计时并等待计时完成!",
        type: "error",
        icon: true
      })
    },
    //提交
    sub() {
      if (!this.value) {
        this.$refs.uToast.show({
          title: "请输入次数!",
          type: "error",
          icon: true
        })
        return
      }
      this.multipleData.evaluationContent.push({
        value: Number(this.value),
        type: 3
      })
      this.$Router.push({
        path: "/sitAndReach",
        query: {
          data: this.multipleData
        }
      })
      // console.log("静坐心率", this.value)
    },
    /*清空倒计时*/
    clearStartTime() {
      return new Promise((res, rel) => {
        clearInterval(this.timer2)
        this.timer2 = null
        res()
      })
    },
    formatSeconds(t) {
      let mi = 60,
        hh = mi * 60,
        dd = hh * 24
      let d = this.formatBit(Math.floor(t / dd)),
        h = this.formatBit(Math.floor((t - d * dd) / hh)),
        m = this.formatBit(Math.floor((t - d * dd - h * hh) / mi)),
        s = this.formatBit(Math.floor(t - d * dd - h * hh - m * mi))
      // let tstr = d + '天' + h + '小时' + m + "分" + s + '秒';
      this.minuteTime = m
      this.secondTime = s
    },
    initTime(time) {
      this.clearStartTime().then(() => {
        this.cdTime = Math.floor(time / 1000)
        this.timer2 = setInterval(() => {
          this.cdTime--
          this.formatSeconds(this.cdTime)
          // console.log(this.cdStr);
          if (this.cdTime <= 0) {
            clearInterval(this.timer2)
            this.overburden = false
            this.customStyle.background = "var(--theme-color-dark-blue)"
            // this.show1 = false
            // this.bg = "var(--theme-color-dark-blue)"
            // this.$emit("bwCountdown")
          }
        }, 1000)
      })
    },
    formatBit(v) {
      v = Number(v)
      return v > 9 ? v : "0" + v
    },
    //开始倒计时
    countDown() {
      this.show1 = true
      this.bg = "var(--text-color-grey)"
      this.initTime(this.time)
    }
    //倒计时重置
    // reset() {
    //   this.show1 = false
    //   this.bg = "var(--theme-color-dark-blue)"
    //   this.minuteTime = this.num == 3 ? "03" : "02"
    // }
  },
  onLoad(options) {
    this.multipleData = this.$Route.query.data
  },
  onUnload() {
    if (this.timer2) {
      clearTimeout(this.timer2)
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

      .starting {
        background: #cfdff1;
        border: 6px solid #eef2f7;
        box-shadow: 0 0 0 6px rgba(207, 223, 241, 0.1);
      }

      .countdowns {
        position: absolute;
        z-index: 99;
      }

      .end {
        background: #f2bf4d;
        border: 6px solid #fae7bd;
        box-shadow: 0 0 0 6px rgba(242, 191, 77, 0.1);
      }
    }

    .text {
      color: var(--text-color-grey);
      margin-bottom: 5px;
    }

    .mar {
      margin-top: 15px;
    }

    .ipt {
      display: flex;
      justify-content: space-between;
    }

    .btnTime {
      margin-top: 20px;
      position: relative;
    }

    .overburden {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      background-color: transparent;
      z-index: 12;
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
</style>
