<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="靠墙静蹲"></house-header>
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
            <view class="text" v-if="presentData.equipment">
              <view class="round"></view>
              <view class="title">
                {{ presentData.equipment }}
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
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
export default {
  data() {
    return {
      presentData: {
        url: "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/jkzp%E9%9D%A0%E5%A2%99%E9%9D%99%E8%B9%B2.png",
        action: "动作要求：大腿与地面接近平行",
        equipment: "设备要求：墙壁"
      },
      timer1: null,
      minutes: 0,
      seconds: 0,
      minute: "00",
      second: "00",
      show: true,
      multipleData: ""
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
      let s = 0
      if (this.minutes) {
        s = this.minutes * 60 + this.seconds
      } else {
        s = this.seconds
      }
      this.show = true
      if (this.timer1) {
        clearInterval(this.timer1)
        this.multipleData.evaluationContent.push({
          value: Number(s),
          type: 1
        })
        this.timer1 = null
        this.$Router.push({
          path: "/twoMinuteStep",
          query: {
            data: this.multipleData
          }
        })
      }
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
</style>
