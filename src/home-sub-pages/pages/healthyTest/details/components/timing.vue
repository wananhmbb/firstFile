<template>
  <view class="main">
    <view class="content" v-if="!(num == 3 || num == 4)">
      <view class="ipt" v-show="num == 2">
        <view class="text">性别</view>
        <view class="sex">
          <u-input
            v-model="form.sex"
            type="select"
            placeholder="请选择"
            :custom-style="ipnCustomStyle"
            border
            @click="sexShow = true"
          />
          <l-picker
            mode="selector"
            v-model="sexShow"
            :range="selector"
            @confirm="confirmSex"
            @cancel="sexShow = false"
          ></l-picker>
        </view>
        <view class="text mar">年龄</view>
        <u-input
          v-model="form.age"
          type="select"
          placeholder="请选择"
          :custom-style="ipnCustomStyle"
          border
          @click="pickTimeshow = true"
        />
        <l-picker
          mode="time"
          v-model="pickTimeshow"
          :params="params"
          @confirm="confirmTime"
          :end-year="endyear"
          @cancel="pickTimeshow = false"
        >
        </l-picker>
      </view>
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
    <view class="content" v-else>
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
        <view :class="['start', show1 ? 'starting' : 'bg']" @click="countDown"
          >开始</view
        >

        <view class="start countdowns" v-if="show1"></view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { SquatAgainstTheWall, OneLegStandingBalance } from "@/utils/healthy"
export default {
  props: ["num", "endyear"],
  options: { styleIsolation: "shared" },
  data() {
    return {
      bg: "var(--theme-color-dark-blue)",
      timer1: null,
      minutes: 0,
      seconds: 0,
      minute: "00",
      second: "00",
      show: true,
      timer2: null,
      minuteTime: "00",
      secondTime: "00",
      show1: false,
      cdTime: 0,
      appraise: "",
      ipnCustomStyle: {
        color: "var(--text-color-main)"
      },
      //输入框
      form: {
        sex: "",
        age: ""
      },
      //性别
      sexShow: false,
      selector: ["男", "女"],
      //年龄
      pickTimeshow: false,
      params: {
        year: true,
        month: true,
        day: true
      },
      time: 1000
    }
  },
  mounted() {
    this.minuteTime = this.num == 3 ? "03" : "02"
    this.time = this.num == 3 ? 180000 : 120000
    this.$bus.$on("reset", res => {
      this.reset()
    })
  },
  methods: {
    //开始计时
    begin() {
      if (this.num == 2) {
        if (!this.form.sex) {
          this.$refs.uToast.show({
            title: "请选择性别!",
            type: "error",
            icon: true
          })
          return
        } else if (!this.form.age) {
          this.$refs.uToast.show({
            title: "请选择年龄!",
            type: "error",
            icon: true
          })
          return
        }
      }
      this.show = false
      this.timer1 = setInterval(this.startTimer, 1000)
    },
    // 结束计时
    pause() {
      this.show = true
      if (this.timer1) {
        clearInterval(this.timer1)
        this.evaluate(this.num)
        this.$emit("end", this.appraise)
        this.timer1 = null
        this.minutes = 0
        this.seconds = 0
        this.minute = "00"
        this.second = "00"
        this.form.sex = ""
        this.form.age = ""
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
    },
    //倒计时
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
            this.$emit("bwCountdown")
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
    },
    //倒计时重置
    reset() {
      this.show1 = false
      this.bg = "var(--theme-color-dark-blue)"
      this.minuteTime = this.num == 3 ? "03" : "02"
    },
    //评分
    evaluate(e) {
      let s = 0
      if (this.minutes) {
        s = this.minutes * 60 + this.seconds
      } else {
        s = this.seconds
      }
      if (e == 2) {
        this.form.value = s
        this.appraise = SquatAgainstTheWall(this.form)
      } else if (e == 5) {
        this.appraise = OneLegStandingBalance(s)
      }
    },
    confirmSex(e) {
      // console.log(e);
      if (e[0] == 0) {
        this.form.sex = "男"
      } else {
        this.form.sex = "女"
      }
    },
    confirmTime(e) {
      let str = e.year + "-" + e.month + "-" + e.day
      let a = this.ages(str)
      this.form.age = String(a)
    },
    ages(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var Y = new Date().getFullYear()
        return Y - r[1]
      }
      return "输入的日期错误！"
    }
  },
  onUnload() {
    if (this.timer1) {
      clearTimeout(this.timer1)
      this.timer1 = null
    }
    if (this.timer2) {
      clearTimeout(this.timer2)
      this.timer2 = null
    }
  }
}
</script>

<style scoped lang="scss">
/deep/.u-icon__icon {
  color: var(--bg-color-main) !important;
}
.main {
  padding: 15px;
  background-color: var(--bg-color-main);
  flex: 1;
}

.text {
  color: var(--text-color-grey);
  margin-bottom: 5px;
}

.ipt {
  margin-bottom: 15px;

  .mar {
    margin-top: 15px;
  }

  .title {
    color: var(--text-color-grey);
    font-size: 16px;
  }
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
    margin: auto;
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
</style>
