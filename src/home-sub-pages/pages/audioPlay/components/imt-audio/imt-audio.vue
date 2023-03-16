<template>
  <view class="sliderBox">
    <u-slider
      v-model="slideWidth"
      @moving="moveing"
      @end="endMove"
      :disabled="loading"
      style="width: 524rpx"
      :block-width="34"
      block-color="#ffffff"
      :height="10"
      inactive-color="#c4c4c4"
      :unidirectionalDatatTransfer="true"
      active-color="#4381cf"
    ></u-slider>
    <view class="time">
      <view class="begin">{{ format(current) }}</view>
      <view class="end">{{ format(duration) }}</view>
    </view>
  </view>
</template>
<script>
export default {
  props: {
    src: String, //音频链接
    playbackRate: {
      type: Number,
      default: 1
    },
    autoplay: Boolean, //是否自动播放
    continue: Boolean, //播放完成后是否继续播放下一首，需定义@next事件
    control: {
      type: Boolean,
      default: false
    } //是否需要上一曲/下一曲按钮
  },
  data() {
    return {
      audio: uni.createInnerAudioContext(),
      current: 0, //当前进度(s)
      duration: 0, //总时长(s)
      paused: true, //是否处于暂停状态
      seek: false, //是否处于拖动状态
      slideWidth: 0,
      playbackRateNumber: 1
    }
  },
  created() {
    this.innerAudioContext = uni.createInnerAudioContext()
    this.innerAudioContext.autoplay = true
    this.innerAudioContext.src = this.src
    this.innerAudioContext.onPlay(() => {
      console.log("timelong : ", this.innerAudioContext.duration)
      setTimeout(() => {
        this.innerAudioContext.duration
        this.durationAudio = this.innerAudioContext.duration
      }, 10)
      this.$emit("onEnded", true)
      this.loading = false
      console.log(this.innerAudioContext, this.durationAudio, "开始播放")
    })
    this.innerAudioContext.onPause(() => {
      this.$emit("onEnded", false)
      console.log("暂停播放")
    })
    this.innerAudioContext.onError(res => {
      console.log(res.errMsg)
      console.log(res.errCode)
    })
    //微信基础库不同,必须监听这个,并且输出这个值,上面的 onTimeUpdate才会触发,不知道啥情况
    this.innerAudioContext.onCanplay(() => {
      console.log(this.innerAudioContext.duration, "音频能够播放了")
    })
    // if (this.src) {
    //   this.audio.src = this.src
    //   this.autoplay && this.play()
    // }
    // this.audio.obeyMuteSwitch = false
    //音频进度更新事件
    this.innerAudioContext.onTimeUpdate(() => {
      // console.log("音频进度条发生更新")
      if (!this.seek) {
        this.current = Math.ceil(this.innerAudioContext.currentTime)
        // console.log(this.current, "重新更新")
      }
      if (!this.duration) {
        this.duration = this.innerAudioContext.duration
      }
    })
    this.innerAudioContext.onEnded(() => {
      console.log("音频结束")
      this.$emit("onEnded", false)
      this.current = 0
    })
    // //音频播放事件
    // this.audio.onPlay(() => {
    //   console.log("音频播放")
    //   this.paused = false
    //   this.loading = false
    // })
    // //音频暂停事件
    // this.audio.onPause(() => {
    //   // setTimeout(() => {
    //   this.audio.playbackRate = this.playbackRateNumber
    //   // }, 300)
    //   console.log("音频暂停")
    //   this.paused = true
    // })
    // //音频结束事件
    // this.audio.onEnded(() => {
    //   console.log("音频结束")
    //   this.$emit("onEnded", false)
    //   if (this.continue) {
    //     this.next()
    //   } else {
    //     this.paused = true
    //     this.current = 0
    //   }
    // })
    // //音频完成更改进度事件
    this.innerAudioContext.onSeeked(() => {
      console.log("音频进度改变")
      this.seek = false
      this.$forceUpdate()
    })
    // //微信基础库不同,必须监听这个,并且输出这个值,上面的 onTimeUpdate才会触发,不知道啥情况
    // this.audio.onCanplay(() => {
    //   console.log(this.audio.duration, "音频能够播放了")
    // })

    // this.audio.onWaiting(() => {})
  },
  beforeDestroy() {
    this.innerAudioContext.destroy()
  },
  watch: {
    // src(src, old) {
    //   this.audio.src = src
    //   this.slideWidth = 0
    //   this.current = 0
    //   this.duration = 0
    //   if (old || this.autoplay) {
    //     this.play()
    //   }
    // },
    current(value) {
      if (this.duration > 0) {
        if (this.current === this.duration) {
          this.slideWidth = 100
          return
        }
        // this.slideWidth = parseInt(((parseInt(value) / parseInt(this.duration)) * 100).toFixed(2))
        this.slideWidth = Number(((value / this.duration) * 100).toFixed(4))
      }
    },
    playbackRate(newValue) {
      this.pause()
      this.innerAudioContext.playbackRate = newValue
      setTimeout(() => {
        this.play()
      }, 300)
      //   if (!this.paused) {
      //     console.log(newValue, oldValue, "newValue, oldValue")
      //     this.audio.pause()
      //     this.playbackRateNumber = newValue
      //     // this.audio.playbackRate = newValue
      //     setTimeout(() => {
      //       this.audio.play()
      //     }, 300)
      //     // this.audio.play()
      //     // this.audio.playbackRate(newValue)
      //   }
    }
  },
  methods: {
    //开始播放
    play() {
      this.innerAudioContext.play()
      this.loading = true
    },
    //暂停播放
    pause() {
      this.innerAudioContext.pause()
    },
    endMove() {
      this.play()
      const pr = (this.slideWidth / 100) * this.duration
      // this.current = pr
      this.current = 0
      console.log(this.current, "滑块接受")
      this.innerAudioContext.seek(pr)
    },
    moveing() {
      this.play()
      this.seek = true
      const pr = (this.slideWidth / 100) * this.duration
      this.current = pr
      console.log(this.seek)
    },
    // //返回prev事件
    // prev() {
    //   this.slideWidth = 0
    //   this.$emit("prev")
    // },
    // //返回next事件
    // next() {
    //   this.slideWidth = 0
    //   this.$emit("next")
    // },
    //格式化时长
    format(num) {
      return (
        "0".repeat(2 - String(Math.floor(num / 60)).length) +
        Math.floor(num / 60) +
        ":" +
        "0".repeat(2 - String(Math.floor(num % 60)).length) +
        Math.floor(num % 60)
      )
    }
    // //点击播放按钮
    // play() {
    //   this.audio.play()
    //   // this.loading = true
    // }
  }
}
</script>
<style scoped lang="scss">
.sliderBox {
  margin-top: 35px;
  .time {
    padding-top: 15px;
    display: flex;
    justify-content: space-between;
    font-size: 30rpx;
    font-weight: bold;
    .begin {
      color: var(--text-color-main);
    }
    .end {
      color: var(--text-color-grey);
    }
  }
}
</style>
