<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="allSubjectList.name"></house-header>
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
            v-if="subjectObject.type === 'title'"
          >
            {{ title }}</view
          >
          <!-- 填空 -->
          <textField
            v-if="subjectObject.type === 'blank'"
            :questionList="subjectObject"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="Subcomponents"
          ></textField>
          <!-- 单选 -->
          <singleChoice
            v-if="subjectObject.type === 'single'"
            :questionList="subjectObject"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="Subcomponents"
          ></singleChoice>
          <!-- 多选 -->
          <multipleChoice
            v-if="subjectObject.type === 'multiple'"
            :questionList="subjectObject"
            @getAnswers="getAnswers"
            ref="Subcomponents"
            :allAnswerObj="allAnswerObj"
          ></multipleChoice>
          <!-- 等级选择 -->
          <gradeSelection
            v-if="subjectObject.type === 'nps'"
            :questionList="subjectObject"
            :allAnswerObj="allAnswerObj"
            @getAnswers="getAnswers"
            ref="Subcomponents"
          ></gradeSelection>
          <!-- 图片 -->
          <uploadQuestionImg
            v-if="subjectObject.type === 'upload'"
            :questionList="subjectObject"
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
        v-model="resultsPopupShow"
        confirm-text="好的"
        :title="modelTitle"
        :title-style="titleStyle"
        @confirm="resultsPopup"
      >
        <view class="modalText">
          <view>很遗憾，您的测评结果未达到购买要求</view>
        </view>
      </u-modal>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import {
  getServicePackQuestionnaire,
  checkCanCreateOrder
} from "@/api/store.js"
import textField from "@/service-sub-pages/pages/evaluationQuestionnaire/components/textField.vue"
import singleChoice from "@/service-sub-pages/pages/evaluationQuestionnaire/components/singleChoice.vue"
import multipleChoice from "@/service-sub-pages/pages/evaluationQuestionnaire/components/multipleChoice.vue"
import gradeSelection from "@/service-sub-pages/pages/evaluationQuestionnaire/components/gradeSelection.vue"
import uploadQuestionImg from "@/service-sub-pages/pages/evaluationQuestionnaire/components/uploadQuestionImg.vue"
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
      getyesTitle: "",
      resultsPopupShow: false,
      btnLoading: false,
      lastQuestionBtnLoading: false,
      firstBtn: true,
      currentQuestionNumber: 1,
      servicePackageId: "",
      subjectObject: {},
      allAnswerObj: {},
      submitObj: {},
      title: "",
      code: "",
      submitPopup: false,
      showMask: null,
      result: false,
      tips: "",
      firstCode: "",
      arr: [0, 0, 0],
      titleSerialNumberList: [],
      currentTopic: "",
      titleStyle: {
        width: "90%",
        margin: "auto",
        color: "var(--text-color-main)"
      },
      //当前问题索引
      indexOfCurrentProblems: 0,
      allSubjectList: [],
      surveyId: "",
      version: "",
      questionIndex: 1
    }
  },
  onUnload() {
    uni.removeStorageSync("formListSubmitObj")
    uni.removeStorageSync("formList")
  },
  onHide() {
    uni.removeStorageSync("formListSubmitObj")
    uni.removeStorageSync("formList")
  },
  onLoad() {
    this.id = this.$Route.query.id
    this.servicePackageId = this.$Route.query.servicePackageId
    this.clearTenantId = this.$Route.query.clearTenantId
    this.referrerId = this.$Route.query.referrerId
    this.getServicePackQuestionnaireDetails()
  },
  methods: {
    //判断核联医简易运动评估问卷跳转逻辑
    judgementLogic() {
      if (this.allSubjectList.name === "核联医简易运动评估问卷") {
        if (
          this.getAnswersNowTitle === "您是否有高血压？" &&
          this.getyesTitle === "否"
        ) {
          this.indexOfCurrentProblems += 2
        } else if (
          this.getAnswersNowTitle === "您是否有糖尿病？" &&
          this.getyesTitle === "否"
        ) {
          this.indexOfCurrentProblems += 2
        } else if (
          this.getAnswersNowTitle === "您是否有心脏病？" &&
          this.getyesTitle === "否"
        ) {
          this.indexOfCurrentProblems += 2
        } else if (
          this.getAnswersNowTitle === "您是否肌肉、骨骼、关节疼痛" &&
          this.getyesTitle === "否"
        ) {
          this.indexOfCurrentProblems += 2
        } else {
          this.indexOfCurrentProblems++
        }
      }
    },
    //获取所有题目详情
    getServicePackQuestionnaireDetails() {
      getServicePackQuestionnaire(this.servicePackageId).then(res => {
        if (res.code === 200) {
          this.allSubjectList = res.data.data[0]
          this.surveyId = this.allSubjectList.id
          this.version = String(this.allSubjectList.version)
          this.subjectObject =
            this.allSubjectList.questionList[this.indexOfCurrentProblems]
          this.title = this.subjectObject.title
          this.code = this.subjectObject.code
          this.firstCode = this.subjectObject.code
          let currentQuestionNumber = this.subjectObject.attribute.level
          this.subjectObject.indexOfCurrentProblems =
            this.indexOfCurrentProblems
          this.setQuestionList(this.subjectObject)
          this.setSerialNumber(currentQuestionNumber)
        }
      })
    },
    //校验必填
    checkNotNull() {
      if (this.subjectObject.type !== "title") {
        if (this.currentTopic !== "") {
          this.nextQuestion()
        } else {
          this.$refs.uToast.show({
            title: this.subjectObject.title + "为空",
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
      this.judgementLogic()
      this.btnLoading = true
      if (
        this.indexOfCurrentProblems <
          this.allSubjectList.questionList.length - 1 ||
        this.indexOfCurrentProblems ===
          this.allSubjectList.questionList.length - 1
      ) {
        this.currentTopic = ""
        this.btnLoading = false
        if (this.$refs.Subcomponents) {
          this.$refs.Subcomponents.indexIn = null
        }
        if (this.$refs.clearStatus) {
          this.$refs.clearStatus.clear()
        }
        this.firstBtn = false
        this.subjectObject =
          this.allSubjectList.questionList[this.indexOfCurrentProblems]
        this.title = this.subjectObject.title
        this.code = this.subjectObject.code
        let currentQuestionNumber = this.subjectObject.attribute.level
        this.questionIndex++
        this.subjectObject.indexOfCurrentProblems = this.indexOfCurrentProblems
        this.setQuestionList(this.subjectObject)
        this.setSerialNumber(currentQuestionNumber)
        this.$forceUpdate()
      } else {
        this.btnLoading = false
        this.tips = "没有下一题了,马上为您提交问卷"
        this.submitPopup = true
      }
    },
    //上一题
    lastQuestion() {
      if (this.$refs.clearStatus) {
        this.$refs.clearStatus.clear()
      }
      this.questionIndex--
      let storageList = uni.getStorageSync("formList")
      this.subjectObject = storageList[this.questionIndex]
      if (this.subjectObject.code === this.firstCode) {
        this.firstBtn = true
      }
      this.indexOfCurrentProblems = this.subjectObject.indexOfCurrentProblems
      this.title = this.subjectObject.title
      this.code = this.subjectObject.code
      let currentQuestionNumber = this.subjectObject.attribute.level
      this.setPrevSerialNumber(currentQuestionNumber)
    },
    // 题目存本地
    setQuestionList(data) {
      let storageList = uni.getStorageSync("formList") || {}
      storageList[this.questionIndex] = data
      uni.setStorageSync("formList", storageList)
    },
    // 提交答案
    sumbit() {
      let obj = {
        answer: this.submitObj,
        surveyId: this.surveyId,
        servicePackageId: this.servicePackageId,
        version: this.version
      }
      uni.showLoading({
        mask: true,
        title: "正在提交..."
      })
      checkCanCreateOrder(obj).then(res => {
        if (res.code === 200) {
          uni.hideLoading()
          if (res.data.flag === true) {
            this.$store.commit("getServicePackQuestionnaireInfo", obj)
            this.$refs.uToast.show({
              title: "测评通过,请继续购买服务包",
              type: "success",
              icon: false
            })
            setTimeout(() => {
              // uni.navigateTo({
              //   url: `pages/shopping-mall/goods_details/index?id=${
              //     this.id
              //   }&servicePackageId=${
              //     this.servicePackageId
              //   }&isBuy=${true}&clearTenantId=${
              //     this.clearTenantId
              //   }&haveServicePackQuestionnaire=${"close"}&getServicePackQuestionnaireInfo=${"have"}`
              // })
              this.$Router.replaceAll({
                name: "goodsDetails",
                params: {
                  id: this.id,
                  servicePackageId: this.servicePackageId,
                  isBuy: true,
                  clearTenantId: this.clearTenantId,
                  haveServicePackQuestionnaire: "close",
                  getServicePackQuestionnaireInfo: "have",
                  referrerId: this.referrerId
                }
              })
            }, 1000)
          } else {
            this.resultsPopupShow = true
            // this.$refs.uToast.show({
            //   title: "很遗憾，您的测评结果未达到购买要求",
            //   type: "error",
            //   icon: false
            // })
          }
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
    //未达到购买要求弹窗点击事件
    resultsPopup() {
      // uni.navigateTo({
      //   url: `pages/shopping-mall/goods_details/index?id=${
      //     this.id
      //   }&servicePackageId=${
      //     this.servicePackageId
      //   }&isBuy=${true}&clearTenantId=${this.clearTenantId}`
      // })
      this.$Router.replaceAll({
        name: "goodsDetails",
        params: {
          id: this.id,
          servicePackageId: this.servicePackageId,
          isBuy: true,
          clearTenantId: this.clearTenantId
        }
      })
    },
    //获取答案
    getAnswers(questionCode, valueObj, value, title, yesTitle) {
      this.getAnswersNowTitle = title
      this.getyesTitle = yesTitle
      this.currentTopic = value
      this.submitObj[questionCode] = valueObj
      //答案存在本地
      uni.setStorageSync("formListSubmitObj", this.submitObj)
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
      line-height: 45vh;
      text-align: center;
      font-size: 34rpx;
      font-weight: bold;
      color: #080809;
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
