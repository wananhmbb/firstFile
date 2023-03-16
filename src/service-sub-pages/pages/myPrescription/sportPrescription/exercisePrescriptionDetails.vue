<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view class="contents" v-if="!dataShow">
        <sportsAdvice :freq="freq" />
        <view class="title">
          <view class="titleLine"></view>
          <view class="titleName">训练内容</view>
        </view>
        <u-tabs
          bg-color="var(--bg-color-second)"
          :list="tabsList"
          :current="current"
          @change="tabsChange"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
          :is-scroll="true"
        ></u-tabs>
        <view class="stageBox">
          <view class="stageView">
            <view class="stageContentBox">
              <view class="name">所需器材</view>
              <u-tag
                v-for="(i, aindex) in tabsVideo.details[0].instrumentIds"
                :key="aindex"
                class="tag"
                :text="i"
                type="primary"
              />
            </view>
            <view class="stageContentBox">
              <view class="name">运动目的</view>
              <view
                class="smallTitle"
                v-for="(i, bindex) in tabsVideo.details[0].actionPurpose"
                :key="bindex"
              >
                <view class="roundDot"></view>
                <view class="objective">{{ i }}</view></view
              >
            </view>
            <view class="stageContentBox" v-if="tabsVideo.details[0].guide">
              <view class="name">指导处方</view>
              <view class="smallTitle">
                <view class="roundDot"></view>
                <view class="objective">{{ tabsVideo.details[0].guide }}</view>
              </view>
            </view>
            <view
              class="stageContentBox"
              v-if="tabsVideo.details[0].actionLibDetailList"
            >
              <view class="name">功能动作</view>
              <view class="smallTitle">
                <view class="roundDot"></view>
                <view class="objective"
                  >每日{{ tabsVideo.details[0].groupUnit.value }}次 每次{{
                    tabsVideo.details[0].times
                  }}遍</view
                >
              </view>
              <u-read-more
                close-text="查看更多"
                show-height="170"
                :shadow-style="shadowStyle"
                :toggle="true"
                color="var(--text-color-grey)"
              >
                <view
                  class="videoImgeBox"
                  v-for="(i, cindex) in tabsVideo.details[0]
                    .actionLibDetailList"
                  :key="cindex"
                  @click="goKeyPointsOfExercise(item, i, cindex)"
                >
                  <view class="cover">
                    <image :src="i.action.cover"></image>
                  </view>
                  <view class="actionName">{{ i.action.actionName }}</view>
                </view>
              </u-read-more>
            </view>
          </view>
        </view>
        <view class="form-css"></view>
        <view class="BtnBox">
          <view class="startSportBtn" @click="startSport()">开始运动</view>
          <view class="startSportBtn" @click="clockIn">查看记录</view>
        </view>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
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
import sportsAdvice from "@/service-sub-pages/pages/myPrescription/sportPrescription/components/sportsAdvice"
import {getExercisePrescription} from "@/api/service"
export default {
  components: {
    sportsAdvice
  },
  data() {
    return {
      shadowStyle: {
        backgroundImage:
          "linear-gradient(-180deg, rgba(255, 255, 255, 0) 0%, #fff 80%)",
        textAlign: "center"
      },
      headTitle: "",
      freq: {},
      tabsVideo: {},
      videoList: [],
      tabsList: [],
      current: 0,
      //有无数据
      dataShow: false,
      loading: true
    }
  },
  onLoad() {
    this.headTitle = this.$Route.query.title
    this.prescribeId = this.$Route.query.id
    this.servicePackageUserId = this.$Route.query.servicePackageId
    this.getExercisePrescriptionList(
      this.servicePackageUserId,
      this.prescribeId
    )
  },
  methods: {
    // goTestH5() {
    //   this.$Router.push({
    //     name: "TestH5",
    //     params: {
    //       prescribeId: this.prescribeId,
    //       servicePackageUserId: this.servicePackageUserId
    //     }
    //   })
    // },
    //获取数据
    getExercisePrescriptionList(servicePackageUserId, prescribeId) {
      this.loading = true
      getExercisePrescription(servicePackageUserId, prescribeId).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.loading = false
            if (res.data.freq) {
              this.freq = res.data.freq
              this.freq.hr.name = "运动目标心率"
              this.freq.runFreq.name = "每周推荐运动天数"
              this.freq.runDuration.name = "每日运动时长"
              this.freq.runTotal.name = "每周总计运动时长"
            }
            this.videoList = res.data.stages
            if (this.videoList) {
              this.videoList.forEach(item => {
                this.tabsList.push({name: item.stageName})
              })
              this.tabsVideo = this.videoList[0]
              this.$store.commit("all_Previe_Video_Arr", this.videoList)
            } else {
              this.dataShow = true
            }
          } else {
            this.loading = false
            this.dataShow = true
          }
          console.log(this.videoList, "查看数据")
        } else {
          console.log("视频数据获取失败")
        }
      })
    },
    goKeyPointsOfExercise(item, i, cindex) {
      //存现在点击进去一个阶段的所有视频在vuex
      let nowPrevieVideoArr = this.tabsVideo.details[0].actionLibDetailList
      this.$store.commit("now_Previe_Video_Arr", nowPrevieVideoArr)
      // console.log(nowPrevieVideoArr, i, cindex, "sy")
      this.$Router.push({
        name: "keyPointsOfExercise",
        params: {
          videoIndex: cindex
        }
      })
    },
    startSport() {
      // this.$Router.push({
      //   name: "videoPage",
      //   params: {
      //     prescribeId: this.prescribeId,
      //     twoInputShow: true,
      //     servicePackageUserId: this.servicePackageUserId,
      //     prescribeName: this.headTitle,
      //     current: this.current
      //   }
      // })
      uni.closeBluetoothAdapter({
        success(res) {
          console.log(res)
        }
      })
      this.$Router.push({
        name: "connectingBluetooth",
        params: {
          prescribeId: this.prescribeId,
          servicePackageUserId: this.servicePackageUserId,
          prescribeName: this.headTitle,
          current: this.current
        }
      })
    },
    clockIn() {
      this.$Router.push({
        name: "feedback",
        params: {
          prescribeId: this.prescribeId,
          twoInputShow: true,
          servicePackageUserId: this.servicePackageUserId,
          prescribeName: this.headTitle,
          tabListOnlyOne: true
        }
      })
    },
    tabsChange(index) {
      this.current = index
      this.tabsVideo = this.videoList[index]
      console.log(this.tabsVideo, "index")
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
/deep/.u-flex {
  justify-content: center !important;
}
/deep/.u-content__showmore-wrap {
  padding: 26rpx 0;
  background-image: none !important;
}
/deep/.u-mode-light-primary {
  margin: 5px 5px 5px 0 !important;
}
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-main);
  .contents {
    width: 100%;
    margin: auto;
    background: var(--bg-color-main);
    .BtnBox {
      width: 100%;
      padding: 10px 2.5% 20px 2.5%;
      margin: auto;
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      background: var(--bg-color-main);
      .startSportBtn {
        width: 48%;
        line-height: 90rpx;
        border-radius: 30px;
        background: cornflowerblue;
        color: #ffff;
        font-size: 34rpx;
        text-align: center;
      }
    }
    .title {
      width: 90%;
      margin: auto;
      display: flex;
      align-items: center;
      margin-bottom: 10px;
      .titleLine {
        width: 6px;
        height: 18px;
        border-radius: 4px;
        margin-right: 10px;
        background: var(--theme-color-dark-blue);
      }
      .titleName {
        color: var(--text-color-main);
        font-size: 34rpx;
        font-weight: bolder;
      }
    }
    .stageBox {
      width: 90%;
      margin: 25px auto;
      .stageView {
        width: 95%;
        margin: auto;
        .stageContentBox {
          .name {
            font-size: 30rpx;
            font-weight: bolder;
            margin: 15px 0 15px 0;
            color: var(--text-color-main);
          }
          .smallTitle {
            display: flex;
            align-items: center;
            margin: 15px 0 15px 0;
            .roundDot {
              width: 8px;
              height: 8px;
              background: var(--theme-color-dark-blue);
              margin-right: 8px;
              border-radius: 50%;
            }
            .objective {
              color: var(--text-color-grey);
            }
          }

          .tag {
            margin-right: 10px;
          }
          .videoImgeBox {
            background: var(--bg-color-second);
            display: flex;
            align-items: center;
            padding: 12px;
            margin-bottom: 10px;
            .cover {
              position: relative;
              width: 45%;
              height: 130rpx;
              image {
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
              }
            }
            .actionName {
              width: 42%;
              margin: 0 auto;
              font-size: 30rpx;
              text-indent: 0;
            }
          }
        }
      }
    }
  }
  .form-css {
    width: 100%;
    height: 85px;
    background: var(--bg-color-main);
  }
  .empty {
    width: 230px;
    height: 170px;
    margin: 30px auto auto auto;
    text-align: center;
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
}
</style>
