<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view class="contents" v-if="!dataShow">
        <view class="tabs-css">
          <view class="title">
            <!-- <view class="titleLine"></view> -->
            <!-- <view class="titleName">处方内容</view> -->
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
        </view>
        <view class="form-css"></view>
        <view class="stageBox">
          <view class="stageView">
            <view
              class="stageContentBox"
              v-if="tabsObj.details[0].treatmentPurpose.length > 0"
            >
              <view class="name">阶段目的</view>
              <view
                class="smallTitle"
                v-for="(i, aindex) in tabsObj.details[0].treatmentPurpose"
                :key="aindex"
              >
                <view class="roundDot"></view>
                <view class="objective">{{ i }}</view></view
              >
            </view>
            <view class="stageContentBox programmeBox">
              <view class="name">阶段方案</view>
              <view
                class="programme"
                v-for="(b, bindex) in tabsObj.details[0].treatmentCourseList"
                :key="bindex"
              >
                <view class="programmeTitle">{{ b.name }}</view>
                <view class="programmeView" v-if="b.recoveryEquipment">
                  <view>
                    <text class="textName">治疗设备</text>
                    <text>
                      &emsp;
                      {{ b.recoveryEquipment[0].name }}</text
                    >
                  </view>
                  <view
                    ><text class="textName">推荐参数</text>
                    <text>
                      &emsp;
                      {{ b.recoveryEquipment[0].parameter }}
                    </text></view
                  >
                </view>
                <view class="programmeView" v-if="b.proposal">
                  <view class="textName">指导建议 </view>
                  <view>{{ b.proposal }}</view>
                </view>
                <!-- <view class="programmeView">
                  <text class="textName">治疗频率</text>
                  <text class="pdr">每日{{ b.count }}次</text>
                  <text class="pdr"
                    >每次{{ b.countTime.value
                    }}{{ timeUnit[b.countTime.unit] }}</text
                  >
                  <text class="pdr"
                    >每{{ timeUnit[b.timeRound[0].unit]
                    }}{{ b.timeRound[0].value }}日</text
                  >
                  <text class="pdr">{{ b.quantitationNumbers }}日一个疗程</text>
                  <text class="pdr"
                    >总共{{ b.treatmentCourseNumbers }}疗程</text
                  >
                </view> -->
                <view>
                  <view class="textName">注意事项和禁忌症 </view>
                  <view class="fscolor">{{ b.taboo }}</view>
                </view>
              </view>
            </view>
          </view>
        </view>
        <view class="form-css"></view>
        <view class="startSportBtn" @click="clockIn">
          <view>打卡</view>
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
import { getExercisePrescription } from "@/api/service"
export default {
  data() {
    return {
      headTitle: "",
      tabsObj: {},
      scrollTop: 0,
      rehabilitationList: [],
      tabsList: [],
      current: 0,
      //有无数据
      dataShow: false,
      loading: true,
      timeUnit: {
        d: "日",
        w: "周",
        M: "月",
        y: "年",
        h: "小时",
        m: "分钟",
        s: "秒"
      }
    }
  },
  onLoad() {
    this.headTitle = this.$Route.query.title
    this.prescribeId = this.$Route.query.id
    this.servicePackageUserId = this.$Route.query.servicePackageId
    this.getRehabilitationList(this.servicePackageUserId, this.prescribeId)
  },
  methods: {
    //获取
    getRehabilitationList(servicePackageUserId, prescribeId) {
      this.loading = true
      getExercisePrescription(servicePackageUserId, prescribeId).then(res => {
        if (res.code === 200) {
          this.loading = false
          if (res.data) {
            this.rehabilitationList = res.data.stages
            if (this.rehabilitationList) {
              this.rehabilitationList.forEach(item => {
                this.tabsList.push({ name: item.stageName })
              })
              this.tabsObj = this.rehabilitationList[0]
            } else {
              this.dataShow = true
            }
            this.stagesName = this.rehabilitationList[0].stageName
          } else {
            this.dataShow = true
          }
        } else {
          this.loading = false
          this.dataShow = true
          console.log("视频数据获取失败")
        }
      })
    },
    tabsChange(index) {
      this.show = false
      this.current = index
      this.tabsObj = this.rehabilitationList[index]
      uni.pageScrollTo({
        duration: 100, //过渡时间
        scrollTop: 0 //到达距离顶部的top值
      })
      this.stagesName = this.rehabilitationList[index].stageName
    },
    clockIn() {
      this.$Router.push({
        name: "feedback",
        params: {
          prescribeId: this.prescribeId,
          twoInputShow: false,
          stagesName: this.stagesName,
          recordType: 2
        }
      })
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
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-main);
  .tabs-css {
    position: fixed;
    overflow-x: scroll;
    width: 100%;
    z-index: 20;
    background: var(--bg-color-main);
    // height: 120px;
  }
  .contents {
    width: 100%;
    margin: auto;
    background: var(--bg-color-main);
    .title {
      width: 90%;
      // margin: 20px auto;
	  height: 20rpx;
      display: flex;
	  justify-content: space-evenly;
      align-items: center;
      .titleLine {
        width: 6px;
        height: 18px;
        border-radius: 4px;
        margin-right: 10px;
        background: var(--theme-color-dark-blue);
      }
      .titleName {
        font-size: 34rpx;
        font-weight: bolder;
        color: var(--text-color-main);
      }
    }
    .stageBox {
      width: 90%;
      margin: 15px auto;
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
          .programme {
            background: var(--bg-color-second);
            padding: 15px;
            margin-bottom: 15px;
            .programmeTitle {
              font-size: 28rpx;
              font-weight: bolder;
              margin-bottom: 15px;
              color: var(--text-color-main);
            }
            .textName {
              font-size: 28rpx;
              font-weight: bolder;
              padding-right: 10px;
              margin-bottom: 5px;
              color: var(--text-color-main);
            }
            .programmeView {
              display: flex;
              flex-wrap: wrap;
              margin-bottom: 10px;
              color: var(--text-color-grey);
              view:first-child {
                padding-right: 15px;
                margin-bottom: 5px;
              }
              .pdr {
                padding-right: 5px;
              }
            }
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
        }
      }
    }
    .fscolor {
      color: var(--text-color-grey);
    }
    .form-css {
      width: 100%;
      height: 120rpx;
      background: var(--bg-color-main);
    }
    .startSportBtn {
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
      width: 100%;
      background: var(--bg-color-main);
      view {
        width: 90%;
        line-height: 45px;
        margin: 20px auto;
        border-radius: 30px;
        background: cornflowerblue;
        color: #ffff;
        font-size: 34rpx;
        text-align: center;
      }
    }
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
