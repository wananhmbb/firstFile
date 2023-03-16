<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <view class="content">
        <view class="card" v-for="(item, index) in list" :key="index">
          <view v-if="item.survey">
            <view class="cardBox">
              <view class="title">{{ item.survey.name }}</view>
              <!-- <view
              class="details"
              v-if="!item.survey.hasAnswer && circumstances == 2"
              @click="goQuestionnaireDetailsOnlyRead(item)"
            >
              <view>查看详情</view>
              <view> <u-icon name="arrow-right"></u-icon></view>
            </view> -->
              <view
                class="details"
                v-if="!item.survey.hasAnswer && circumstances == 1"
                @click="goQuestionnaireDetails(item)"
              >
                <view>去填写</view>
                <view> <u-icon name="arrow-right"></u-icon></view>
              </view>
            </view>
            <view class="btnBox" v-if="item.survey.hasAnswer">
              <view class="btn" @click="goQuestionnaireDetailsOnlyRead(item)"
                >查看详情</view
              >
              <view class="btn1" @click="viewResults(item)">查看结果</view>
            </view>
          </view>
        </view>
        <view v-if="bothAdvice !== null" class="nullBox"></view>
        <view v-if="bothAdvice !== null" class="bothAdviceBox">
          <view class="title">医嘱:</view>
          <view class="text">{{ bothAdvice }}</view>
        </view>
      </view>
      <u-modal
        v-model="viewResultsShow"
        confirm-text="我知道了"
        :title="modelTitle"
        :title-style="titleStyle"
      >
        <view class="modalBox">
          <view v-if="type !== 'new'">分数:{{ !score ? "无" : score }}</view>
          <view v-for="(item, index) in resultList" :key="index"
            >{{ item.name }}:{{ item.value }}</view
          >
          <view>填写人:{{ !updateUser ? "无" : updateUser }}</view>
          <view>填写时间:{{ !updateDate ? "无" : updateDate }}</view>
          <view>医嘱:{{ !advice ? "无" : advice }}</view>
        </view>
      </u-modal>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view class="empty" v-if="list.length == 0 || !list">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
import { getQuestionnaireInfo, getHistoricalReport } from "@/api/service"
export default {
  data() {
    return {
      title: "",
      score: "",
      updateUser: "",
      bothAdvice: "",
      updateDate: "",
      advice: "",
      followUpId: "",
      servicePackageUserId: "",
      medicalCardId: "",
      list: [],
      loading: true,
      circumstances: null,
      viewResultsShow: false,
      modelTitle: "",
      titleStyle: {
        color: "var(--text-color-main)",
        width: "90%",
        margin: "auto"
      },
      resultList: [],
      type: ""
    }
  },
  onLoad() {
    this.title = this.$Route.query.title
    this.followUpId = this.$Route.query.followUpId
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
    this.medicalCardId = this.$Route.query.medicalCardId
    this.historicalReport(this.servicePackageUserId, this.followUpId)
  },
  methods: {
    historicalReport(servicePackageUserId, followUpId) {
      this.loading = true
      getHistoricalReport(servicePackageUserId, followUpId)
        .then(res => {
          if (res.code == 200) {
            this.loading = false
            this.circumstances = res.data.actionWay.code
            this.list = res.data.projects
            if (res.data.advice) {
              this.bothAdvice = res.data.advice
            } else {
              this.bothAdvice = null
            }
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "历史报告异常")
        })
    },
    goQuestionnaireDetailsOnlyRead(item) {
      if (item.type === "new") {
        this.$Router.push({
          name: "gaugePage",
          params: {
            projectId: item.id,
            surveyId: item.surveyId,
            followUpId: this.followUpId,
            showMask: true,
            servicePackageUserId: this.servicePackageUserId
          }
        })
      } else {
        this.$Router.push({
          // name: "questionnaireDetails",
          // params: {
          //   followUpId: this.followUpId,
          //   projectId: item.id,
          //   hasAnswer: item.survey.hasAnswer,
          //   surveyId: item.surveyId,
          //   servicePackageUserId: this.servicePackageUserId,
          //   title: item.survey.name,
          //   showMask: true
          // }
          name: "oldSurveyH5",
          params: {
            followUpId: this.followUpId,
            surveyId: item.surveyId,
            projectId: item.id,
            servicePackageUserId: this.servicePackageUserId
          }
        })
      }
    },
    goQuestionnaireDetails(item) {
      if (item.type === "new") {
        this.$Router.push({
          name: "gaugePage",
          params: {
            projectId: item.id,
            surveyId: item.surveyId,
            followUpId: this.followUpId,
            servicePackageUserId: this.servicePackageUserId,
            medicalCardId: this.medicalCardId,
            showMask: false
          }
        })
      } else {
        this.$Router.push({
          name: "questionnaireDetails",
          params: {
            followUpId: this.followUpId,
            projectId: item.id,
            hasAnswer: item.survey.hasAnswer,
            surveyId: item.surveyId,
            servicePackageUserId: this.servicePackageUserId,
            title: item.survey.name,
            medicalCardId: this.medicalCardId,
            showMask: false
          }
        })
      }
    },
    // viewAdvice() {
    //   this.$Router.push({
    //     name: "adviceDetails",
    //     params: {
    //       advice: this.bothAdvice
    //     }
    //   })
    // },
    getResult(obj, result) {
      let resultRule = JSON.parse(result)
      if (obj.rules) {
        obj.rules.forEach(item => {
          for (let a in resultRule.resultScoreMap) {
            if (item.code === a) {
              this.resultList.push({
                name: item.name,
                value: resultRule.resultScoreMap[a]
              })
            }
          }
        })
      }
      if (obj.totalReportRules) {
        obj.totalReportRules.forEach(item => {
          for (let b in resultRule.totalReportMap) {
            if (item.resultReportCode === b) {
              this.resultList.push({
                name: item.name,
                value: resultRule.totalReportMap[b]
              })
            }
          }
        })
      }
      if (obj.totalScoreRules) {
        obj.totalScoreRules.forEach(item => {
          for (let c in resultRule.totalScoreMap) {
            if (item.totalScoreCode === c) {
              this.resultList.push({
                name: item.name,
                value: resultRule.totalScoreMap[c]
              })
            }
          }
        })
      }
      // console.log(list, "sioj")
    },
    viewResults(item) {
      this.modelTitle = item.survey.name
      this.score = ""
      this.updateUser = ""
      this.updateDate = ""
      this.advice = ""
      this.resultList = []
      let projectId = item.id
      let surveyId = item.surveyId
      let type = item.type
      getQuestionnaireInfo(
        this.followUpId,
        projectId,
        this.servicePackageUserId,
        surveyId
      ).then(res => {
        if (res.code === 200) {
          this.viewResultsShow = true
          this.updateUser = res.data.updateUser
          this.updateDate = res.data.updateDate
          this.advice = res.data.advice
          this.type = res.data.newOld
          if (type === "survey") {
            this.score = res.data.score
          } else if (type === "new") {
            if (res.data.baseSurvey.resultRule && res.data.result) {
              this.getResult(res.data.baseSurvey.resultRule, res.data.result)
            }
          }
        }
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
}
.content {
  width: 100%;
  background: var(--bg-color-second);
  margin: 15px auto;
  border: 1px solid var(--bg-color-second);
}
.card {
  width: 90%;
  margin: auto;
  background: var(--bg-color-main);
  border-radius: 8px;
  margin-bottom: 15px;
}
.cardBox {
  width: 100%;
  padding: 20px;
  background: var(--bg-color-main);
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.nullBox {
  width: 100%;
  height: 150px;
  background: var(--bg-color-second);
}
.bothAdviceBox {
  position: fixed;
  bottom: 0;
  width: 100%;
  height: 150px;
  background: var(--bg-color-main);
  color: var(--text-color-main);
  padding: 15px 0;
  border-top: 1px solid var(--bd-color-main);
  .title {
    padding: 0 20px;
    margin-bottom: 10px;
  }
  .text {
    width: 90%;
    height: 80px;
    margin: auto;
    overflow: scroll;
  }
}
.title {
  width: 70%;
  font-weight: 600;
  font-size: 16px;
  color: var(--text-color-main);
}
.details {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  width: 30%;
  font-size: 12px;
  color: var(--text-color-grey);
  view:first-child {
    padding-right: 3px;
  }
}
.btnBox {
  width: 98%;
  margin: auto;
  padding-bottom: 10px;
  display: flex;
  justify-content: flex-end;
  .btn {
    width: 96px;
    line-height: 32px;
    border-radius: 24px;
    border: 1px solid var(--text-color-grey);
    color: var(--text-color-grey);
    text-align: center;
    margin-right: 10px;
  }
  .btn1 {
    width: 96px;
    line-height: 32px;
    line-height: 32px;
    border-radius: 24px;
    background: var(--bg-color-blue);
    color: var(--theme-color-dark-blue);
    text-align: center;
  }
}
.modalBox {
  width: 85%;
  margin: 20px auto 20px auto;
  color: var(--text-color-main);
  view {
    padding: 10px 0;
  }
}
.empty {
  margin-top: 150px;
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
/deep/.u-line-1 {
  overflow: none !important;
  white-space: normal !important;
  text-overflow: none !important;
}
</style>
