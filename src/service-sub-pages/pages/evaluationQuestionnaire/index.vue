<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="测评问卷"></house-header>
      <view class="tabs-css">
        <u-tabs
          bg-color="var(--bg-color-main)"
          :is-scroll="false"
          :list="groupTabList"
          :current="currentTabIndex"
          @change="onTabChanged"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
        ></u-tabs>
      </view>
      <view
        v-if="evaluationQuestionnaireList.length > 0 && currentTabIndex == 0"
        class="content"
      >
        <view v-for="(item, index) in evaluationQuestionnaireList" :key="index">
          <view class="cardTitle" v-if="!item.allHasAnswer">
            {{ item.subject }}
          </view>
          <view v-for="(i, cindex) in item.projects" :key="cindex">
            <view v-if="!i.survey.hasAnswer" class="cardBox">
              <view class="title">{{ i.survey.name }}</view>
              <view
                class="details"
                v-if="item.actionWay.code == 1"
                @click="goQuestionnaireDetails(item, i)"
              >
                <view>去填写</view>
                <view><u-icon name="arrow-right"></u-icon></view>
              </view>
            </view>
          </view>
        </view>
      </view>
      <view
        v-if="evaluationQuestionnaireList.length > 0 && currentTabIndex == 1"
        class="completeBox"
      >
        <view
          class="completView"
          v-for="(item, index) in evaluationQuestionnaireList"
          :key="index"
          @click="goHistoricalReport(item)"
        >
          <view class="completTitle padding5">
            <view class="name">
              <view class="name-text">{{ item.subject }}</view>
              <view
                :class="
                  item.actionWay.code === 2
                    ? 'doctoridentification'
                    : 'patientidentification'
                "
              >
                {{ item.actionWay.code === 2 ? "医生填写" : "患者填写" }}</view
              >
            </view>
            <view class="fc9699A6">{{ item.state.desc }}</view>
          </view>
          <view v-show="item.doctorName" class="fc9699A6 padding5"
            >医生：{{ item.doctorName }}</view
          >
          <view class="fc9699A6 padding5"
            >评估方式：{{ item.actionWay.desc }}</view
          >
          <view class="fc9699A6 padding5">评估时间：{{ item.updateDate }}</view>
        </view>
      </view>
      <view
        class="empty"
        v-if="
          !evaluationQuestionnaireList ||
          evaluationQuestionnaireList.length == 0
        "
      >
        <x-icon iconName="service-no-data"></x-icon>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import {
  hjtViewHealthTestPlan,
  completeFollowUpList,
  submitAll
} from "@/api/service"
export default {
  data() {
    return {
      submitFinishedButtonStyle: {
        width: "120px",
        fontSize: "28rpx"
      },
      state: {
        DONE: "已完成"
      },
      evaluationQuestionnaireList: [],
      currentTabIndex: 0,
      groupTabList: [{ name: "待填问卷" }, { name: "全部测评" }],
      loading: true,
      medicalCardId: ""
    }
  },
  onLoad() {
    this.servicePackageUserId = this.$Route.query.servicePackageId
    this.medicalCardId = this.$Route.query.medicalCardId
    this.currentTabIndex = 0
    this.getDetail()
  },
  // onShow() {
  //   this.currentTabIndex = 0
  //   this.getDetail()
  // },
  methods: {
    //获取评估问卷
    getDetail() {
      this.loading = true
      hjtViewHealthTestPlan(this.servicePackageUserId)
        .then(response => {
          this.loading = false
          if (response.code == 200) {
            // console.log(response, "response")
            this.evaluationQuestionnaireList = response.data
            if (this.evaluationQuestionnaireList) {
              this.evaluationQuestionnaireList.forEach(item => {
                let allHasAnswer = item.projects.every(
                  i => i.survey.hasAnswer == true
                )
                item.allHasAnswer = allHasAnswer
              })
            }
          } else {
            console.error(response, "测评问卷异常")
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "测评问卷异常")
        })
    },
    //获取历史评估问卷
    getCompleteFollowUpList() {
      this.loading = true
      completeFollowUpList(this.servicePackageUserId, this.medicalCardId)
        .then(response => {
          if (response.code == 200) {
            this.loading = false
            this.evaluationQuestionnaireList = response.data.rows
          } else {
            console.error(err, "测评完成问卷异常")
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "测评完成问卷异常")
        })
    },
    //切换tabs
    onTabChanged(index) {
      this.evaluationQuestionnaireList = []
      this.currentTabIndex = index
      if (index == 0) {
        this.getDetail()
      }
      if (index == 1) {
        this.getCompleteFollowUpList()
      }
    },
    //去填写
    goQuestionnaireDetails(item, i) {
      if (i.type === "new") {
        this.$Router.push({
          name: "gaugePage",
          params: {
            projectId: i.id,
            surveyId: i.surveyId,
            medicalCardId: this.medicalCardId,
            servicePackageUserId: this.servicePackageUserId,
            followUpId: item.actionId,
            showMask: false
          }
        })
      } else {
        this.$Router.push({
          name: "questionnaireDetails",
          params: {
            followUpId: item.actionId,
            hasAnswer: i.survey.hasAnswer,
            projectId: i.id,
            surveyId: i.surveyId,
            servicePackageUserId: this.servicePackageUserId,
            title: i.survey.name,
            medicalCardId: this.medicalCardId,
            showMask: false
          }
        })
      }
    },
    //去查看详情
    goQuestionnaireDetailsOnlyRead(item, i) {
      if (i.type === "new") {
        this.$Router.push({
          name: "gaugePage",
          params: {
            followUpId: item.actionId,
            projectId: i.id,
            surveyId: i.surveyId,
            medicalCardId: this.medicalCardId,
            servicePackageUserId: this.servicePackageUserId,
            showMask: true
          }
        })
      } else {
        this.$Router.push({
          name: "questionnaireDetails",
          params: {
            followUpId: item.actionId,
            hasAnswer: i.survey.hasAnswer,
            projectId: i.id,
            surveyId: i.surveyId,
            servicePackageUserId: this.servicePackageUserId,
            title: i.survey.name,
            medicalCardId: this.medicalCardId,
            showMask: true
          }
        })
      }
    },
    //去历史报告详情页
    goHistoricalReport(item) {
      // console.log(item, "去历史报告")
      this.$Router.push({
        name: "historicalReport",
        params: {
          servicePackageUserId: this.servicePackageUserId,
          followUpId: item.actionId,
          medicalCardId: this.medicalCardId,
          title: item.subject
        }
      })
    },
    // 提交完成的按钮是否可见
    isSubmitFinishedButtonVisible(item) {
      // 已开始的状态码
      const startCode = "started"
      // 线上服务的状态码
      const onlineWayCode = 1
      const statesArray = item.states
      if (statesArray) {
        const isStarted = statesArray.filter(item => item.code === startCode)
        // 是线上服务，且状态是已开始的，才进入判断是否需要展示
        if (item.actionWay.code === onlineWayCode && isStarted.length === 1) {
          const allProjects = item.projects.length
          let hasAnswerProjects = item.projects.filter(
            p => p.survey.hasAnswer === true
          ).length
          return allProjects === hasAnswerProjects
        }
      }
      return false
    },
    //提交全部问卷
    submitAllQuestionnaires(item) {
      let actionId = item.actionId
      submitAll(actionId, this.servicePackageUserId, this.medicalCardId)
        .then(res => {
          if (res.code === 200) {
            this.$refs.uToast.show({
              title: "提交全部问卷成功",
              type: "success"
            })
            this.getDetail()
          }
        })
        .catch(err => {
          console.error(err, "提交所有问卷异常")
        })
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
  padding-bottom: calc(env(safe-area-inset-bottom) + 24rpx);
}
.content {
  width: 90%;
  margin: auto;
  margin-top: 120rpx;
}
.cardViewBox {
  margin-bottom: 20px;
}
.cardTitle {
  color: var(--text-color-grey);
  margin-bottom: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 30rpx;
}
.cardBox {
  background: var(--bg-color-main);
  width: 100%;
  border-radius: 8px;
  margin-bottom: 15px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
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
.padding5 {
  padding: 5px 0;
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: 40px auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--bg-color-main);
}
.tabs-css {
  position: fixed;
  overflow-x: scroll;
  width: 100%;
  z-index: 20;
  background: var(--bg-color-main);
}
.empty {
  margin-top: 150px;
  text-align: center;
}
.completeBox {
  width: 90%;
  margin: auto;
  margin-top: 120rpx;
  .completView {
    background: var(--bg-color-main);
    width: 100%;
    border-radius: 8px;
    margin-top: 15px;
    padding: 15px;
    .completTitle {
      display: flex;
      justify-content: space-between;
      align-items: center;
      .name {
        display: flex;
        align-items: center;
        width: 80%;
        font-weight: 600;
        font-size: 17px;
        color: var(--text-color-main);
        .name-text {
          max-width: 70%;
          min-width: 20px;
        }
        .patientidentification {
          padding: 5px 8px;
          background: #edf6ff;
          color: #1b55af;
          border-radius: 4px;
          margin-left: 5px;
          font-size: 12px;
        }
        .doctoridentification {
          padding: 5px 8px;
          background: #ffece7;
          color: #fa5f1b;
          border-radius: 4px;
          margin-left: 5px;
          font-size: 12px;
        }
      }
    }
  }
}
.fc9699A6 {
  font-size: 13px;
  color: var(--text-color-grey);
}
.padding5 {
  padding: 5px 0;
}
</style>
