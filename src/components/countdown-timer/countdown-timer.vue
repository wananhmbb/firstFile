<template>
  <view class="case">
    <cover-view v-if="timeData.day > 0">{{ timeData.day }}:</cover-view>
    <cover-view v-if="timeData.hour > 0">{{ timeData.hour }}:</cover-view>
    <cover-view>{{ timeData.minute }}:</cover-view>
    <cover-view>{{ timeData.second }}</cover-view>
  </view>
</template>

<script>
export default {
  props: {
    // 倒计时时长（单位：毫秒）
    time: {
      type: Number,
      default: 0
    },

    // 是否自动
    autoStart: {
      type: Boolean,
      default: false
    }
  },
  data() {
    return {
      timer: null,
      timeData: {
        remain: 0,
        day: 0,
        hour: 0,
        minute: 0,
        second: 0
      }
    }
  },
  watch: {
    time() {
      this.reset()
    }
  },
  methods: {
    format(data) {
      if (data >= 10) {
        return data
      } else {
        return "0" + data
      }
    },
    // 设置timeData
    updateTimeData() {
      let t = this.timeData.remain
      // let w1 = "0" + t
      this.timeData.day = this.format(Math.floor(t / 60 / 60 / 24))
      this.timeData.hour = this.format(Math.floor((t / 60 / 60) % 24))
      this.timeData.minute = this.format(Math.floor((t / 60) % 60))
      this.timeData.second = this.format(parseInt(Math.floor(t % 60)))
    },

    // 开启倒计时
    startTimer() {
      if (this.timer) {
        clearInterval(this.timer)
      }
      if (this.timeData.remain < 1) {
        return
      }
      this.timer = setInterval(() => {
        this.timeData.remain -= 1
        this.updateTimeData()
        if (this.timeData.remain < 1) {
          this.pause()
          this.$emit("finish")
        }
      }, 1000)
    },

    // 重置倒计时
    reset() {
      this.timeData.remain = this.time
      this.updateTimeData()
      if (this.autoStart) {
        this.start()
      }
    },

    // 暂停倒计时
    pause() {
      if (this.timer) {
        clearInterval(this.timer)
        this.timer = null
      }
    },

    // 开始倒计时
    start() {
      if (this.timer) {
        return
      }
      this.startTimer()
      this.$emit("start")
    }
  },
  created() {
    this.reset()
  },
  beforeDestroy() {
    this.pause()
  }
}
</script>
<style>
.case {
  display: flex;
}
</style>
