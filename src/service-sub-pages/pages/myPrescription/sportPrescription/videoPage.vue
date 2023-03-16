<template>
  <view class="videoPage">
    <video
      class="video"
      id="videoBox"
      v-if="videoShow"
      :show-fullscreen-btn="true"
      :controls="false"
      :autoplay="true"
      :enable-progress-gesture="false"
      :show-center-play-btn="false"
      :loop="loop"
      :src="videoData.action.actionDisplayLink"
      @timeupdate="videoTimeUpdateEvent($event)"
    >
      <heartRate
        class="heartRate"
        v-if="haveEquipment === 'true'"
        @playwhichone="playwhichone"
      ></heartRate>
      <u-icon
        @click="goback"
        class="backBox"
        name="arrow-left"
        color="#ffffff"
        size="40"
        v-if="!showactionTime || restTimePopSHow"
      ></u-icon>
      <view class="centerBox">
        <view
          class="controls-left"
          v-if="!showactionTime"
          @click="previousVideo"
          ><u-icon name="arrow-left" color="#ffffff" size="30"></u-icon
        ></view>
        <view class="controls-right" v-if="!showactionTime" @click="nextVideo"
          ><u-icon name="arrow-right" color="#ffffff" size="30"></u-icon
        ></view>
      </view>
      <view v-if="showactionTime">
        <cover-view class="countDown" v-if="!restTimePopSHow"
          >{{ actionTime }}
        </cover-view>
        <cover-view class="restCountDown" v-if="restTimePopSHow">
          <cover-view>休息一下吧</cover-view>
          <cover-view>{{ restTime }}</cover-view>
        </cover-view>
      </view>
      <view class="bottomBox" v-if="!showactionTime">
        <view class="controlsBox">
          <u-icon
            class="controls"
            v-if="playShow && !showactionTime"
            name="pause"
            @click="pause"
            color="#ffffff"
            size="45"
          ></u-icon>
          <u-icon
            class="controls"
            v-if="!playShow && !showactionTime"
            @click="play"
            name="play-right-fill"
            color="#ffffff"
            size="38"
          ></u-icon>
        </view>
        <view class="bottomCenterBox">
          <countdown-timer
            ref="countdown"
            class="countdownBox"
            @finish="onFinish"
            @start="onStart"
            :time="getVideoPlayTime()"
          >
          </countdown-timer>
          <cover-view class="videoTitle">{{
            videoData.action.actionName
          }}</cover-view>
        </view>
      </view>
      <u-modal
        v-model="finishModalShow"
        :show-title="false"
        confirm-text="去打卡"
        @confirm="confirmGoBack"
      >
        <view class="slot-content">视频播放结束。</view>
      </u-modal>
      <u-modal
        ref="uModalrevert"
        v-model="backModalShow"
        :show-title="false"
        :async-close="true"
        confirm-text="确定"
        @confirm="revert"
      >
        <view class="nextActionModal-content">
          <view class="head">
            <view class="title">请选择退出理由</view>
            <u-icon
              name="close"
              class="close-css"
              @click="revertCancel()"
            ></u-icon>
          </view>
          <view class="radioGroup">
            <u-radio-group v-model="value" :wrap="true">
              <u-radio
                @change="revertRadioChange"
                v-for="(item, index) in nextActionReasonlist"
                :key="index"
                :name="item.name"
                :disabled="item.disabled"
              >
                {{ item.name }}
              </u-radio>
            </u-radio-group>
          </view>
        </view>
      </u-modal>
      <u-modal
        ref="uModal"
        v-model="nextActionModalShow"
        :show-title="false"
        confirm-text="跳过"
        cancel-text="取消"
        :async-close="true"
        :show-cancel-button="true"
        @confirm="nextActionConfirm"
      >
        <view class="nextActionModal-content">
          <view class="head">
            <view class="title">请选择跳过理由</view>
            <u-icon
              name="close"
              class="close-css"
              @click="nextActionCancel()"
            ></u-icon>
          </view>
          <view class="radioGroup">
            <u-radio-group v-model="value" :wrap="true">
              <u-radio
                @change="nextActionRadioChange"
                v-for="(item, index) in nextActionReasonlist"
                :key="index"
                :name="item.name"
                :disabled="item.disabled"
              >
                {{ item.name }}
              </u-radio>
            </u-radio-group>
          </view>
        </view>
      </u-modal>
      <u-toast ref="uToast" />
    </video>
    <view v-else>
      <u-loading mode="circle" size="34" :show="!videoShow"></u-loading>
    </view>
    <view class="empty" v-if="dataShow">
      <x-icon iconName="service-no-data"></x-icon>
    </view>
  </view>
</template>
<script>
import heartRate from "./components/heartRate.vue"
import countdownTimer from "@/components/countdown-timer/countdown-timer"
import {feedback} from "@/api/service"
export default {
  components: {
    countdownTimer,
    heartRate
  },
  data() {
    return {
      //跳到下一个动作的理由
      nextActionReasonValue: "",
      //退出理由
      revertReasonValue: "",
      //跳过理由
      nextActionReasonlist: [
        {
          name: "动作太难",
          disabled: false
        },
        {
          name: "不想做了",
          disabled: false
        },
        {
          name: "临时有事",
          disabled: false
        }
      ],
      //默认是正常播放时退出
      SxitStatus: true,
      //跳过动作弹窗
      nextActionModalShow: false,
      //休息时间弹出
      restTimePopSHow: false,
      //视频结束弹窗
      finishModalShow: false,
      //中途返回弹窗
      backModalShow: false,
      //有无数据
      dataShow: false,
      //视频播放器显示
      videoShow: false,
      //运动处方当前阶段
      current: null,
      prescribeId: "",
      prescribeName: "",
      servicePackageUserId: "",
      //有无心率设备
      haveEquipment: "false",
      //是否播放心率音频
      playVideoIng: false,
      showactionTime: true,
      actionTime: 3,
      itemTime: 6,
      openScreen: true,
      playShow: true,
      timestamp: 3,
      loop: true,
      stagesName: "", //当前阶段名称
      //当前视频播放的索引
      videoIndex: 0,
      //请求最大索引长度
      maxStageIndexLength: 1,
      maxWeekIndexLength: 0,
      maxVideoIndexLength: 0,
      maxWatchVideoTimes: 0,
      nowWatchVideoTimes: null,
      videoData: {},
      videoList: [],
      allVideoList: {},
      allTime: 0,
      autoShow: true,
      restTime: null, //休息时间
      viewingDuration: 0 //观看时长
    }
  },
  onReady() {
    uni.setStorageSync("pageVideo", "video")
    this.videoCtx = uni.createVideoContext("videoBox")
    this.videoCtx.requestFullScreen()
  },
  onLoad() {
    this.current = this.$Route.query.current
    this.prescribeId = this.$Route.query.prescribeId
    this.prescribeName = this.$Route.query.prescribeName
    this.haveEquipment = this.$Route.query.haveEquipment
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
    if (this.current) {
      this.getVideoList()
      this.intervalId = setInterval(this.reckonByTime, 1000)
    }
  },
  onUnload() {
    uni.closeBluetoothAdapter({
      success(res) {
        console.log(res)
      }
    })
  },
  watch: {
    videoIndex: {
      immediate: true,
      deep: true,
      handler(val) {
        //当前播放视频的赋值
        if (
          JSON.stringify(this.allVideoList) !== "{}" &&
          this.maxWatchVideoTimes !== this.nowWatchVideoTimes
        ) {
          if (val == this.maxVideoIndexLength) {
            this.videoIndex = 0
          }
          if (val < 0) {
            this.videoIndex = 0
          }
          this.resetVideoData()
        }
      }
    },
    restTime: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val === 1 && val) {
          setTimeout(() => {
            clearInterval(this.intervalRestTime)
            this.judgeSxitStatus(true)
            this.restTimePopSHow = false
            this.actionTime = 3
            this.showactionTime = true
            this.changeActionuCountDownTime()
          }, 500)
        }
      }
    }
  },
  methods: {
    //计时
    reckonByTime() {
      this.viewingDuration++
    },
    //休息时间倒计时
    restCountdown() {
      //是休息时间时退出
      this.judgeSxitStatus(false)
      this.restTime--
    },
    videoTimeUpdateEvent(e) {
      this.allTime = e.detail.duration
    },
    getVideoPlayTime() {
      let result = 0
      // 设定的时候，是一组x次  ”count“是单位次的值
      if (this.videoData.countTime.unit === "count") {
        result =
          Number(this.videoData.count) *
          Number(this.videoData.countTime.value) *
          Number(this.allTime)
      } else {
        result =
          Number(this.videoData.count) * Number(this.videoData.countTime.value)
      }
      return result
    },
    //重新赋值
    resetVideoData() {
      this.videoData = this.allVideoList[0].actionLibDetailList[this.videoIndex]
      this.maxWatchVideoTimes = this.allVideoList[0].times
    },
    //获取视频
    getVideoList() {
      let stages = this.$store.state.server.allPrevieVideoArr
      this.allVideoList = stages[this.current].details
      this.maxVideoIndexLength = this.allVideoList[0].actionLibDetailList.length
      this.stagesName = stages[this.current].stageName
      this.videoShow = true
      this.resetVideoData()
      this.changeActionuCountDownTime()
    },
    //开始3秒倒计时音频
    startFirstAudio(src, loop, innerAudioTimes) {
      if (this.autoShow) {
        this.innerAudioContext = uni.createInnerAudioContext()
        this.innerAudioContext.autoplay = true
        this.innerAudioContext.loop = loop
        this.innerAudioContext.src = src
        this.innerAudioContext.sessionCategory = "soloAmbient"
        this.innerAudioContext.onPlay(() => {
          // console.log("开始播放")
        })
        this.innerAudioContext.onTimeUpdate(() => {
          if (innerAudioTimes) {
            if (Math.floor(this.innerAudioContext.currentTime) === 0) {
              this.actionTime = 3
            }
            if (Math.floor(this.innerAudioContext.currentTime) === 1) {
              this.actionTime = 2
            }
            if (Math.floor(this.innerAudioContext.currentTime) === 2) {
              this.actionTime = 1
            }
            if (Math.floor(this.innerAudioContext.currentTime) === 3) {
              this.actionTime = "开始"
              this.playShow = true
            }
          }
        })
        this.innerAudioContext.onPause(() => {
          // console.log("暂停播放")
        })
        this.innerAudioContext.onEnded(() => {
          // console.log(innerAudioTimes, "自然播放结束")
          if (innerAudioTimes) {
            this.endActionTime()
          }
        })
        this.innerAudioContext.onError(res => {
          console.log(res.errMsg)
          console.log(res.errCode)
        })
      }
    },
    //整套每个视频播放的倒计时
    firstcountDownPlay() {
      this.showactionTime = true
      this.actionTime = 3
      this.changeActionuCountDownTime()
    },
    //开始播放视频
    play() {
      this.videoCtx.play()
      if (this.SxitStatus) {
        this.$refs.countdown.start()
      } else {
        this.intervalRestTime = setInterval(this.restCountdown, 1000)
      }
      this.playShow = true
      this.innerAudioContext.play()
      this.intervalId = setInterval(this.reckonByTime, 1000)
    },
    //暂停播放视频
    pause() {
      this.videoCtx.pause()
      this.playShow = false
      this.innerAudioContext.pause()
      console.log(this.SxitStatus, "this.SxitStatus")
      if (this.SxitStatus) {
        this.$refs.countdown.pause()
      } else {
        clearInterval(this.intervalRestTime)
      }
      clearInterval(this.intervalId)
    },
    // 进入全屏状态
    getIntoScreen() {
      this.videoCtx = uni.createVideoContext("videoBox")
      this.videoCtx.requestFullScreen()
      this.openScreen = true
    },
    // 退出全屏状态
    quitFullScreen() {
      this.videoCtx = uni.createVideoContext("videoBox")
      this.videoCtx.exitFullScreen()
      this.openScreen = false
    },
    //返回上一页
    goback() {
      if (this.viewingDuration >= 5) {
        this.backModalShow = true
        this.pause()
      } else {
        this.innerAudioContext.stop()
        clearInterval(this.intervalId)
        uni.navigateBack({
          delta: 1
        })
      }
    },
    //中途退出
    revert() {
      this.$refs.uModalrevert.clearLoading()
      if (this.revertReasonValue) {
        this.clockIn(this.revertReasonValue, 4)
      } else {
        this.$refs.uToast.show({
          title: "请选择退出理由",
          type: "error",
          icon: false
        })
      }
    },
    //结束正中心的倒计时
    endActionTime() {
      this.showactionTime = false
      this.$nextTick(() => {
        this.$refs.countdown.start()
        this.startFirstAudio(
          "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/sports_bgm_03.mp3",
          true,
          false
        )
      })
    },
    onStart() {
      // this.startFirstAudio(
      //   "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/sports_bgm_03.mp3",
      //   true
      // )
      this.playVideoIng = true
    },
    //结束标题下面的倒计时
    onFinish() {
      this.playVideoIng = false
      // console.log(this.videoData, "第一个视频结束")
      this.showactionTime = true
      this.innerAudioContext.destroy()
      this.playShow = false
      this.videoIndex++
      if (this.videoIndex === this.maxVideoIndexLength) {
        this.nowWatchVideoTimes++
      }
      if (this.videoData.restTime.value > 1) {
        if (this.nowWatchVideoTimes === this.maxWatchVideoTimes) {
          this.showactionTime = false
          this.pause()
          this.finishModalShow = true
          this.autoShow = false
          this.videoIndex = 0
          clearInterval(this.intervalRestTime)
          this.judgeSxitStatus(true)
          // console.log("到达最后次数暂停")
        } else {
          this.restTimePopSHow = true
          this.restTime = this.videoData.restTime.value
          this.intervalRestTime = setInterval(this.restCountdown, 1000)
          // console.log("继续播放下一个视频")
        }
      } else {
        this.showactionTime = true
        this.actionTime = 3
        this.changeActionuCountDownTime()
        this.restTimeLater()
        // console.log("没有倒计时")
      }
    },
    //增加休息时间之后执行时间
    restTimeLater() {
      if (this.nowWatchVideoTimes === this.maxWatchVideoTimes) {
        this.showactionTime = false
        this.pause()
        this.finishModalShow = true
        this.autoShow = false
        this.videoIndex = 0
      }
    },
    //正中心倒计时剩余秒钟
    changeActionTime(i) {
      if (i === 2) {
        this.startFirstAudio(
          "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/1235411191619395584.mp3",
          false,
          true
        )
      }
    },
    changeActionuCountDownTime() {
      this.startFirstAudio(
        "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/1235411191619395584.mp3",
        false,
        true
      )
    },
    //上一个视频
    previousVideo() {
      this.innerAudioContext.destroy()
      this.firstcountDownPlay()
      this.videoIndex--
      this.playShow = true
    },
    //下一个视频
    nextVideo() {
      this.pause()
      this.nextActionModalShow = true
    },
    //关闭下一个动作弹窗
    nextActionCancel() {
      this.nextActionModalShow = false
    },
    //关闭退出弹窗
    revertCancel() {
      this.play()
      this.backModalShow = false
    },
    //点击跳过到下一个动作弹窗里面跳过按钮
    nextActionConfirm() {
      this.$refs.uModal.clearLoading()
      if (this.nextActionReasonValue) {
        this.clockIn(this.nextActionReasonValue, 3)
      } else {
        this.nextActionModalShow = true
        this.$refs.uToast.show({
          title: "请选择跳过理由",
          type: "error",
          icon: false
        })
      }
    },
    //执行下一个动作的方法
    GoNextAction() {
      this.intervalId = setInterval(this.reckonByTime, 1000)
      this.nextActionModalShow = false
      this.innerAudioContext.destroy()
      this.firstcountDownPlay()
      this.videoIndex++
      this.playShow = true
      if (this.videoIndex === this.maxVideoIndexLength) {
        this.nowWatchVideoTimes++
      }
      if (this.nowWatchVideoTimes === this.maxWatchVideoTimes) {
        this.showactionTime = false
        this.pause()
        this.finishModalShow = true
        this.autoShow = false
        this.videoIndex = 0
      }
    },
    confirmGoBack() {
      this.quitFullScreen()
      this.$Router.replace({
        name: "feedback",
        params: {
          prescribeId: this.prescribeId,
          twoInputShow: true,
          servicePackageUserId: this.servicePackageUserId,
          viewingDuration: this.viewingDuration,
          stagesName: this.stagesName,
          recordType: 1
        }
      })
    },
    // 选择跳过动作理由
    nextActionRadioChange(e) {
      console.log(e, "nextActionReasonValue")
      this.nextActionReasonValue = e
    },
    //选择退出理由
    revertRadioChange(e) {
      console.log(e, "revertReasonValue")
      this.revertReasonValue = e
    },
    //打卡接口方法
    clockIn(ReasonValue, recordType) {
      this.feel = ""
      //跳过了
      if (recordType === 3) {
        this.feel = '"' + this.videoData.action.actionName + '"' + "的训练"
      }
      //未完成
      if (recordType === 4) {
        this.feel =
          '"' +
          this.stagesName +
          '"' +
          "训练,进行" +
          Math.ceil(Number(this.viewingDuration) / 60) +
          "分钟左右,因" +
          ReasonValue +
          "导致无法完成所有训练。"
      }
      let obj = {
        prescribeId: this.prescribeId,
        recordType: recordType,
        content: {
          value: Math.ceil(Number(this.viewingDuration) / 60),
          feedbackContent: {
            feel: this.feel,
            badSymptom: ""
          }
        }
      }
      feedback(obj).then(res => {
        if (res.code === 200) {
          this.$refs.uToast.show({
            title: "提交成功",
            type: "primary"
          })
          if (recordType === 3) {
            this.GoNextAction()
          }
          if (recordType === 4) {
            this.innerAudioContext.stop()
            uni.navigateBack({
              delta: 2
            })
          }
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: "error"
          })
        }
      })
    },
    //判断退出状态
    judgeSxitStatus(i) {
      this.SxitStatus = i
    },
    //判断播放心率状态音频
    playwhichone(value) {
      console.log(value, "哪一个")
    }
  }
}
</script>
<style lang="scss" scoped>
.videoPage {
  width: 100%;
  height: 100%;
  .video {
    width: 100%;
    .backBox {
      position: absolute;
      top: 30rpx;
      left: 5%;
    }
    .centerBox {
      width: 100%;
      min-height: 40px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      position: absolute;
      bottom: calc(50% - 20px);
      .controls-left {
        margin-left: 6%;
        padding: 12px;
      }
      .controls-right {
        margin-right: 6%;
        padding: 12px;
      }
    }
    .countDown {
      width: 100px;
      line-height: 50px;
      text-align: center;
      position: absolute;
      top: calc(50% - 25px);
      left: calc(50% - 50px);
      color: #ffffff;
      font-size: 90rpx;
      font-weight: 800;
    }
    .restCountDown {
      width: 200px;
      line-height: 50px;
      text-align: center;
      position: absolute;
      top: calc(50% - 25px);
      left: calc(50% - 100px);
      color: #ffffff;
      font-size: 70rpx;
      font-weight: 800;
    }
    .bottomBox {
      width: 100%;
      display: flex;
      align-items: center;
      position: absolute;
      bottom: 10px;
      .controlsBox {
        width: 20%;
        text-align: center;
        border-radius: 50%;
      }
      .bottomCenterBox {
        .countdownBox {
          font-size: 44rpx;
          color: #ffff;
          font-weight: bold;
        }
        .videoTitle {
          font-size: 36rpx;
          color: #ffffff;
          font-weight: bold;
        }
      }
    }
  }
}
.heartRate {
  position: absolute;
  right: 20px;
  top: 20px;
}
.empty {
  width: 230px;
  height: 170px;
  margin: 30px auto auto auto;
  text-align: center;
}
.slot-content {
  color: var(--text-color-main);
  line-height: 100px;
  text-align: center;
}
.nextActionModal-content {
  .head {
    width: 100%;
    display: flex;
    .title {
      padding: 15px 0;
      margin: auto;
      font-size: 32rpx;
      font-weight: bolder;
    }
    .close-css {
      padding: 5px;
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
  .radioGroup {
    width: 100px;
    margin: 12px auto 15px auto;
  }
}
</style>
