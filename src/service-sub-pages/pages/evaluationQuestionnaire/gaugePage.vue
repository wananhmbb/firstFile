<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="subjectObject.name"></house-header>
      <view class="content" v-if="subjectObject">
        <view class="headBox">
          <view class="headTitle">
            <text class="title">问题</text>
            <tetx class="currentQuestionNumber">{{
              currentQuestionNumber
            }}</tetx>
          </view>
        </view>
        <view class="questionnaireTitleBox">
          <!-- 仅标题 -->
          <view
            class="questionnaireTitle"
            v-if="subjectObject.questionList[0].type === 'title'"
          >
            {{ title }}</view
          >
          <!-- 填空 -->
          <textField
            v-if="subjectObject.questionList[0].type === 'blank'"
            :questionList="subjectObject.questionList[0]"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="Subcomponents"
          ></textField>
          <!-- 单选 -->
          <singleChoice
            v-if="subjectObject.questionList[0].type === 'single'"
            :questionList="subjectObject.questionList[0]"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="Subcomponents"
          ></singleChoice>
          <!-- 多选 -->
          <multipleChoice
            v-if="subjectObject.questionList[0].type === 'multiple'"
            :questionList="subjectObject.questionList[0]"
            @getAnswers="getAnswers"
            ref="Subcomponents"
            :allAnswerObj="allAnswerObj"
          ></multipleChoice>
          <!-- 等级选择 -->
          <gradeSelection
            v-if="subjectObject.questionList[0].type === 'nps'"
            :questionList="subjectObject.questionList[0]"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="Subcomponents"
          ></gradeSelection>
          <!-- 图片 -->
          <uploadQuestionImg
            v-if="subjectObject.questionList[0].type === 'upload'"
            :questionList="subjectObject.questionList[0]"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="clearStatus"
          ></uploadQuestionImg>
          <view class="mask" v-if="showMask"> </view>
        </view>
        <view class="form-css"></view>
        <!-- 下一题 -->
        <view class="buttonBox" v-if="firstBtn">
          <u-button
            type="primary"
            shape="circle"
            class="firstNext"
            @click="checkNotNull"
            :loading="btnLoading"
          >
            下一题
          </u-button>
        </view>
        <!-- 上一题下一题 -->
        <view class="buttonBox" v-if="!firstBtn">
          <u-button
            type="primary"
            shape="circle"
            class="previous"
            @click="lastQuestion"
            :loading="lastQuestionBtnLoading"
          >
            上一题
          </u-button>
          <u-button
            type="primary"
            shape="circle"
            class="next"
            @click="checkNotNull"
            :loading="btnLoading"
          >
            下一题
          </u-button>
        </view>
      </view>
      <view class="viewResults" v-if="result" @click="checkResult">
        <view>查看</view>
        <view>结果</view>
      </view>
      <u-modal
        v-model="submitPopup"
        confirm-text="好的"
        :title="modelTitle"
        :title-style="titleStyle"
        @confirm="sumbit"
      >
        <view class="modalText">
          <view>{{ tips }}</view>
        </view>
      </u-modal>
      <u-modal
        v-model="viewResultsShow"
        confirm-text="好的"
        :title="resultObj.modelTitle"
        :title-style="titleStyle"
      >
        <view class="modalBox">
          <view v-for="(item, index) in resultList" :key="index"
            >{{ item.name }}:{{ item.value }}</view
          >
          <view
            >填写人：{{
              !resultObj.updateUser ? "无" : resultObj.updateUser
            }}</view
          >

          <view
            >填写时间：{{
              !resultObj.updateDate ? "无" : resultObj.updateDate
            }}</view
          >
          <view>医嘱：{{ !resultObj.advice ? "无" : resultObj.advice }}</view>
        </view>
      </u-modal>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import {
  getNextQuestion,
  getNewSurvey,
  submitNewQuestionnaire,
  getQuestionnaireInfo
} from "@/api/service"
import textField from "./components/textField.vue"
import singleChoice from "./components/singleChoice.vue"
import multipleChoice from "./components/multipleChoice.vue"
import gradeSelection from "./components/gradeSelection.vue"
import uploadQuestionImg from "./components/uploadQuestionImg.vue"
export default {
  components: {
    singleChoice,
    multipleChoice,
    gradeSelection,
    textField,
    uploadQuestionImg
  },
  data() {
    return {
      questionIndex: 1,
      btnLoading: false,
      lastQuestionBtnLoading: false,
      firstBtn: true,
      currentQuestionNumber: 1,
      servicePackageUserId: "",
      medicalCardId: "",
      projectId: "",
      surveyId: "",
      followUpId: "",
      subjectObject: {},
      allAnswerObj: {},
      submitObj: {},
      title: "",
      code: "",
      submitPopup: false,
      showMask: null,
      result: false,
      viewResultsShow: false,
      resultObj: {
        modelTitle: "",
        score: "",
        updateUser: "",
        updateDate: "",
        resultObj: "",
        advice: ""
      },
      tips: "",
      firstCode: "",
      arr: [0, 0, 0],
      titleSerialNumberList: [],
      currentTopic: "",
      resultList: [],
      titleStyle: {
        width: "90%",
        margin: "auto",
        color: "var(--text-color-main)"
      }
    }
  },
  onUnload() {
    uni.removeStorageSync("formList")
    uni.removeStorageSync("formListSubmitObj")
  },
  onLoad() {
    this.medicalCardId = uni.getStorageSync("userInfo").medicalCardList[0].id
    this.projectId = this.$Route.query.projectId
    this.surveyId = this.$Route.query.surveyId
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
    this.followUpId = this.$Route.query.followUpId
    this.getFormList()
    if (this.$Route.query.showMask === "true") {
      this.showMask = true
    } else {
      this.showMask = false
    }
  },
  methods: {
    //查看结果
    getFormList() {
      getQuestionnaireInfo(
        this.followUpId,
        this.projectId,
        this.servicePackageUserId,
        this.surveyId
      )
        .then(res => {
          this.getDetailsList()
          if (res.code === 200 && res.data) {
            this.allAnswerObj = JSON.parse(res.data.answer)
            this.result = true
            let result = res.data
            this.resultObj.modelTitle = result.baseSurvey.name
            this.resultObj.updateUser = result.updateUser
            this.resultObj.updateDate = result.updateDate
            this.resultObj.advice = result.advice
            if (res.data.baseSurvey.resultRule && result.result) {
              this.getResult(res.data.baseSurvey.resultRule, result.result)
            }
          }
        })
        .catch(err => {
          console.error(err, "问卷异常")
        })
    },
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
    getDoubleDigit(item) {
      let number = Number(item)
      if (number < 10) {
        return "0" + number
      } else {
        return number
      }
    },
    //获取第一题详情
    getDetailsList() {
      getNewSurvey(this.surveyId).then(res => {
        if (res.code === 200) {
          this.subjectObject = res.data
          this.title = this.subjectObject.questionList[0].title
          this.code = this.subjectObject.questionList[0].code
          this.firstCode = this.subjectObject.questionList[0].code
          let currentQuestionNumber =
            this.subjectObject.questionList[0].attribute.level
          this.setSerialNumber(currentQuestionNumber)
          this.setQuestionList(this.subjectObject.questionList[0])
        }
      })
    },
    //校验必填
    checkNotNull() {
      if (this.subjectObject.questionList[0].type !== "title") {
        if (this.currentTopic !== "") {
          this.nextQuestion()
        } else {
          this.$refs.uToast.show({
            title: this.subjectObject.questionList[0].title + "为空",
            type: "error",
            icon: false
          })
        }
      } else {
        this.nextQuestion()
      }
    },
    //下一题
    nextQuestion() {
      this.btnLoading = true
      let obj = {
        currentQuestionCode: this.subjectObject.questionList[0].code,
        advice: "",
        answer: this.submitObj,
        medicalCardId: this.medicalCardId,
        projectId: this.projectId,
        surveyId: this.surveyId,
        id: this.subjectObject.id
      }
      getNextQuestion(obj).then(res => {
        if (res.code === 200 && res.data.length > 0) {
          this.currentTopic = ""
          this.btnLoading = false
          if (this.$refs.Subcomponents) {
            this.$refs.Subcomponents.indexIn = null
          }
          if (this.$refs.clearStatus) {
            this.$refs.clearStatus.clear()
          }
          this.firstBtn = false
          this.subjectObject.questionList[0] = res.data[0]
          this.title = this.subjectObject.questionList[0].title
          this.code = this.subjectObject.questionList[0].code
          let currentQuestionNumber =
            this.subjectObject.questionList[0].attribute.level
          this.setSerialNumber(currentQuestionNumber)
          this.$forceUpdate()
          this.questionIndex++
          this.setQuestionList(res.data[0])
        } else {
          this.btnLoading = false
          if (Object.keys(this.allAnswerObj).length > 0) {
            this.tips = "这是最后一题了"
          } else {
            this.tips = "没有下一题了,马上为您提交问卷"
          }
          this.submitPopup = true
        }
      })
    },
    // 题目存本地
    setQuestionList(data) {
      let storageList = uni.getStorageSync("formList") || {}
      storageList[this.questionIndex] = data
      uni.setStorageSync("formList", storageList)
    },
    //上一题
    lastQuestion() {
      if (this.$refs.clearStatus) {
        this.$refs.clearStatus.clear()
      }
      this.questionIndex--
      let storageList = uni.getStorageSync("formList")
      this.subjectObject.questionList[0] = storageList[this.questionIndex]
      if (this.subjectObject.questionList[0].code === this.firstCode) {
        this.firstBtn = true
      }
      this.title = this.subjectObject.questionList[0].title
      this.code = this.subjectObject.questionList[0].code
      let currentQuestionNumber =
        this.subjectObject.questionList[0].attribute.level
      this.setPrevSerialNumber(currentQuestionNumber)
    },
    //返回上一页
    toBack() {
      this.$Router.replaceAll({
        path:
          "/evaluationQuestionnaire?servicePackageId=" +
          this.servicePackageUserId +
          "&medicalCardId=" +
          this.medicalCardId
      })
    },
    // 提交答案
    sumbit() {
      if (Object.keys(this.allAnswerObj).length > 0) return this.toBack()
      let obj = {
        currentQuestionCode: this.subjectObject.questionList[0].code,
        advice: "adipisicing",
        answer: this.submitObj,
        id: this.subjectObject.id,
        projectId: this.projectId,
        surveyId: this.surveyId,
        medicalCardId: this.medicalCardId
      }
      uni.showLoading({
        mask: true,
        title: "正在提交..."
      })
      submitNewQuestionnaire(
        this.followUpId,
        this.servicePackageUserId,
        obj
      ).then(res => {
        if (res.code === 200) {
          uni.hideLoading()
          this.toBack()
        } else {
          uni.hideLoading()
          this.$refs.uToast.show({
            title: res.msg,
            type: "error",
            icon: false
          })
        }
      })
    },
    //获取答案
    getAnswers(questionCode, valueObj, value) {
      this.currentTopic = value
      this.submitObj[questionCode] = valueObj
      //答案存在本地
      uni.setStorageSync("formListSubmitObj", this.submitObj)
    },
    //查看结果
    checkResult() {
      this.viewResultsShow = true
    },

    // 设置题目的序号
    setSerialNumber(level) {
      if (Number(level) === 1) {
        this.arr[0] = Number(this.arr[0]) + 1
        this.arr[1] = 0
        this.arr[2] = 0
        this.titleSerialNumberList.push(this.arr[0].toString())
      } else if (Number(level) === 2) {
        this.arr[1] = Number(this.arr[1]) + 1
        this.arr[2] = 0
        const newArr = [this.arr[0], this.arr[1]]
        this.titleSerialNumberList.push(newArr.join("."))
      } else if (Number(level) === 3) {
        this.arr[2] = this.arr[2] + 1
        const newArr = [this.arr[0], this.arr[1], this.arr[2]]
        this.titleSerialNumberList.push(newArr.join("."))
      } else {
        this.arr = [0, 0, 0]
        this.titleSerialNumberList.push(null)
      }
      this.currentQuestionNumber = this.titleSerialNumberList.slice(-1)[0]
    },

    // 上一步时对序号的设置
    setPrevSerialNumber(level) {
      if (
        !level ||
        !this.titleSerialNumberList[this.titleSerialNumberList.length - 1]
      ) {
        return
      }
      this.titleSerialNumberList.pop()
      const str =
        this.titleSerialNumberList[this.titleSerialNumberList.length - 1]
      const lastArr = str.split(".") ? str.split(".") : str
      if (Number(level) === 1) {
        this.arr[0] = lastArr[0]
        this.arr[1] = 0
        this.arr[2] = 0
      } else if (Number(level) === 2) {
        this.arr[0] = lastArr[0]
        this.arr[1] = lastArr[1]
        this.arr[2] = 0
      } else if (Number(level) === 3) {
        this.arr[0] = lastArr[0]
        this.arr[1] = lastArr[1]
        this.arr[2] = lastArr[2]
      }
      this.currentQuestionNumber = this.titleSerialNumberList.slice(-1)[0]
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-line-1 {
  overflow: none !important;
  white-space: normal !important;
  text-overflow: none !important;
}
/deep/.u-progress {
  height: 6px !important;
}
/deep/.u-size-default {
  height: 95rpx !important;
}
.viewResults {
  position: fixed;
  right: 10px;
  bottom: 120px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--theme-color-linear);
  box-shadow: 0px 4px 6px 0px rgba(70, 137, 218, 0.24);
  color: var(--text-color-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
.all {
  height: 100vh;
  background: var(--bg-color-main);
}
.content {
  background: var(--bg-color-main);
  border-top: 1px solid var(--bd-color-main);
  .headBox {
    width: 90%;
    margin: 35px auto 40px auto;
    .headTitle {
      .title {
        font-size: 42rpx;
        font-weight: 800;
        padding-right: 10px;
        color: var(--text-color-main);
      }
      .currentQuestionNumber {
        font-size: 38rpx;
        color: var(--theme-color-dark-blue);
      }
      .Slash {
        font-size: 38rpx;
        color: var(--text-color-grey);
      }
      .totalQuestionNumber {
        font-size: 30rpx;
        color: var(--text-color-grey);
      }
    }
  }
  .questionnaireTitleBox {
    position: relative;
    width: 90%;
    margin: auto;
    .questionnaireTitle {
      display: flex;
      text-align: center;
      font-size: 34rpx;
      font-weight: bold;
      color: #080809;
      margin-top: 24vh;
    }
    .inputBox {
      margin-top: 25px;
    }
    .mask {
      position: absolute;
      left: 0;
      right: 0;
      top: 0;
      bottom: 0;
      z-index: 100;
    }
  }
  .buttonBox {
    width: 100%;
    position: fixed;
    z-index: 100;
    left: 0;
    right: 0;
    bottom: 0;
    padding: 40rpx 5%;
    background: var(--bg-color-main);
    display: flex;
    justify-content: space-between;
    .previous {
      width: 48%;
    }
    .next {
      width: 48%;
    }
    .firstNext {
      width: 100%;
    }
  }
  .form-css {
    width: 100%;
    height: 85px;
    background: var(--bg-color-main);
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
.modalText {
  text-align: center;
  margin: 20px auto 20px auto;
  color: var(--text-color-main);
}
</style>
