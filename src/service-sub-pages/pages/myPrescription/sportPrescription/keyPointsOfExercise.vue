<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="运动要点说明"></house-header>
      <view v-if="!dataShow">
        <video
          class="video"
          id="videoBox"
          :show-fullscreen-btn="true"
          :controls="false"
          :autoplay="true"
          :enable-progress-gesture="false"
          :show-center-play-btn="false"
          :loop="true"
          :src="src"
        ></video>
        <view class="titleName">当前动作: &ensp;{{ titleName }}</view>
        <view class="textBox" v-if="actionTips">
          <view class="textTitle">动作要领</view>
          <view class="textContent">{{
            actionTips ? actionTips : "暂无"
          }}</view>
        </view>
        <!-- <view class="textBox">
          <view class="textTitle">动作目的</view>
          <view class="textContent">{{ actionPurpose }}</view>
        </view> -->
        <view class="textBox">
          <view class="textTitle">动作频次</view>
          <view class="textContent">{{ actionFrequency }}</view>
        </view>
        <view class="textBox">
          <view class="textTitle">休息时间</view>
          <view class="textContent">{{ restTime }}</view>
        </view>
        <view class="bottomBox">
          <view class="bottomView">
            <view class="one" @click="previous" v-if="videoIndex != 0">
              <u-icon name="arrow-left" size="30"></u-icon>
              <text class="bottomBoxName">{{ previousName }}</text>
            </view>
          </view>
          <view class="bottomView two"
            >{{ videoIndex + 1 }}/{{ videoTotal }}</view
          >
          <view class="bottomView">
            <view
              class="three"
              @click="next"
              v-if="videoIndex != nowPrevieVideoArr.length - 1"
            >
              <text class="bottomBoxName">{{ nextName }}</text>
              <u-icon name="arrow-right" size="30"></u-icon>
            </view>
          </view>
        </view>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view class="empty" v-if="dataShow">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
export default {
  data() {
    return {
      nowPrevieVideoArr: [],
      videoIndex: 1,
      loading: true,
      dataShow: false,
      src: "",
      titleName: "",
      actionEssentials: "",
      actionPurpose: "",
      actionTips: "",
      actionFrequency: "",
      restTime: "",
      videoTotal: "",
      previousName: "",
      nextName: "",
      unitDict: {
        count: "次",
        group: "组",
        s: "秒"
      }
    }
  },
  onReady() {
    this.videoCtx = uni.createVideoContext("videoBox")
  },
  watch: {
    videoIndex: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val < 0) {
          this.videoIndex = this.nowPrevieVideoArr.length - 1
        }
        if (val > this.nowPrevieVideoArr.length - 1) {
          this.videoIndex = 0
        }
        if (this.nowPrevieVideoArr.length > 0) {
          this.getNowPrevieVideoArr()
        }
      }
    }
  },
  onLoad() {
    this.videoIndex = Number(this.$Route.query.videoIndex)
    if (this.$store.state.server.nowPrevieVideoArr) {
      this.nowPrevieVideoArr = this.$store.state.server.nowPrevieVideoArr
      this.loading = false
      this.getNowPrevieVideoArr()
    } else {
      this.loading = false
      this.dataShow = true
    }
  },
  methods: {
    getNowPrevieVideoArr() {
      let nowVideo = this.nowPrevieVideoArr[this.videoIndex]
      console.log(nowVideo, "nowVideo")
      this.src = nowVideo.action.actionDisplayLink
      this.titleName = nowVideo.action.actionName
      this.actionEssentials = "nihao"
      this.actionPurpose = nowVideo.action.actionPurpose
      this.actionTips = nowVideo.action.actionTips
      this.actionFrequency =
        nowVideo.count +
        this.unitDict[nowVideo.minimumUnit.unit] +
        " " +
        nowVideo.countTime.value +
        this.unitDict[nowVideo.countTime.unit]
      this.restTime = nowVideo.restTime.value + nowVideo.restTime.unit
      this.videoTotal = this.nowPrevieVideoArr.length
      if (
        this.videoIndex >= 0 &&
        this.videoIndex < this.nowPrevieVideoArr.length - 1
      ) {
        this.nextName =
          this.nowPrevieVideoArr[this.videoIndex + 1].action.actionName
      }
      if (this.videoIndex > 0) {
        this.previousName =
          this.nowPrevieVideoArr[this.videoIndex - 1].action.actionName
      }
    },
    previous() {
      this.videoIndex--
    },
    next() {
      this.videoIndex++
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  .video {
    width: 100%;
    height: 200px;
  }
  .titleName {
    font-size: 30rpx;
    padding: 10px 0 10px 2.5%;
    border-bottom: 1px solid var(--bd-color-main);
    color: var(--text-color-grey);
  }
  .textBox {
    width: 95%;
    margin: auto;
    margin-bottom: 20px;
    .textTitle {
      font-size: 34rpx;
      font-weight: bolder;
      padding: 15px 0 10px 0;
    }
    .textContent {
      color: var(--text-color-grey);
    }

    :last-child {
      margin-bottom: 100rpx;
    }
  }
  .bottomBox {
    background-color: var(--bg-color-main);
    width: 100%;
    height: 90rpx;
    display: flex;
    justify-content: space-between;
    position: fixed;
    bottom: 0;
    border-top: 1px solid var(--bd-color-main);
    padding: 5px 0;
    .bottomView {
      width: 33%;
      .one {
        display: flex;
        text-align: left;
      }
      .three {
        display: flex;
        text-align: right;
      }
      .bottomBoxName {
        flex: none;
        max-width: 210rpx;
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        word-break: break-all;
        display: -webkit-box;
        -webkit-box-orient: vertical;
        -webkit-line-clamp: 1;
      }
    }
    .two {
      text-align: center;
    }
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
  .empty {
    width: 230px;
    height: 170px;
    margin: 30px auto auto auto;
    text-align: center;
  }
}
</style>
