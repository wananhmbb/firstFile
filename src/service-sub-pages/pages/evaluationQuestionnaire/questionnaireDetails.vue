<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <view class="content" v-if="surveyList">
        <view class="assessmentIntroduction">{{ assessmentIntroduction }}</view>
        <view
          class="fillInTheIntroduction"
          v-for="(i, index) in fillInTheIntroduction"
          :key="index"
          >{{ i.label }}</view
        >
        <u-form
          label-position="top"
          :model="form"
          ref="uForm"
          label-width="200"
          :error-type="errorType"
          :border-bottom="false"
        >
          <questionnaireForm
            :titleNumber="true"
            :surveyList="surveyList"
            @getquestionnaireForm="getquestionnaireForm"
          ></questionnaireForm>
        </u-form>
      </view>
      <view class="btn" v-if="!showMask">
        <u-button
          type="primary"
          shape="circle"
          @click="goQuestionnaire"
          throttle-time="5000"
          >保存</u-button
        >
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view class="form-css"></view>
      <view class="empty" v-if="!surveyList">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
      <view class="mask" v-if="showMask"></view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import { getQuestionnaireInfo, submitQuestionnaire } from "@/api/service"
import questionnaireForm from "./components/questionnaireForm/index.vue"
export default {
  components: {
    questionnaireForm
  },
  data() {
    return {
      hasAnswer: false,
      showMask: null,
      loading: true,
      medicalCardId: "",
      servicePackageUserId: "",
      followUpId: "",
      projectId: "",
      surveyId: "",
      id: "",
      title: "",
      form: {},
      rules: {},
      errorType: ["message", "border-bottom", "toast"],
      surveyList: [],
      assessmentIntroduction: "",
      fillInTheIntroduction: [],
      updateUser: "",
      updateDate: "",
      score: null,
      advice: ""
    }
  },
  onLoad() {
    this.medicalCardId = this.$Route.query.medicalCardId
    this.followUpId = this.$Route.query.followUpId
    this.projectId = this.$Route.query.projectId
    this.surveyId = this.$Route.query.surveyId
    this.hasAnswer = this.$Route.query.hasAnswer === "true"
    this.title = this.$Route.query.title
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
    if (this.$Route.query.showMask == "true") {
      this.showMask = true
    } else {
      this.showMask = false
    }
    this.getFormList()
  },
  methods: {
    // 获取校验规则数组
    getRule() {
      let rules1 = {}
      let rules2 = {}
      this.surveyList.forEach((item, index) => {
        let indexOne = index + 1
        rules1[item.id] = [
          {
            required: item.rules[0].require,
            message:
              item.type === "radio"
                ? "请选择题目" + indexOne
                : "请填写题目" + indexOne,
            trigger: ["blur", "change"]
          }
        ]
        if (item.children) {
          item.children.forEach((i, Iindex) => {
            let indexTwo = Iindex + 1
            rules2[i.id] = [
              {
                required: i.rules[0].require,
                message:
                  item.type === "radio"
                    ? "请选择题目" + indexOne + "." + indexTwo
                    : "请填写题目" + indexOne + "." + indexTwo,
                trigger: ["blur", "change"]
              }
            ]
          })
        }
        if (item.config.BindAnswer) {
          item.config.BindAnswer[0].option.forEach((item, index) => {
            rules1[item.id] = [
              {
                required: item.rules[0].require,
                message:
                  item.type === "radio"
                    ? "请选择题目" + item.title
                    : "请填写题目" + item.title,
                trigger: ["blur", "change"]
              }
            ]
            if (item.children) {
              item.children.forEach((i, Iindex) => {
                // let indexTwo = Iindex + 1
                rules2[i.id] = [
                  {
                    required: i.rules[0].require,
                    message:
                      item.type === "radio"
                        ? "请选择题目" + indexOne + "-" + i.title
                        : "请填写题目" + indexOne + "-" + i.title,
                    trigger: ["blur", "change"]
                  }
                ]
              })
            }
          })
        }
      })
      this.rules = Object.assign({ ...rules1, ...rules2 })
      this.$refs.uForm.setRules(this.rules)
    },
    // 获取form
    getForm(answerList) {
      let form1 = {}
      let form2 = {}
      this.surveyList.forEach(item => {
        form1[item.id] = ""
        if (item.children) {
          item.children.forEach(i => {
            form2[i.id] = ""
          })
        }
        if (item.config.BindAnswer) {
          item.config.BindAnswer[0].option.forEach(item => {
            form1[item.id] = ""
            if (item.children) {
              item.children.forEach(i => {
                form2[i.id] = ""
              })
            }
          })
        }
      })
      this.form = Object.assign({ ...form1, ...form2 })
      uni.setStorageSync("form", this.form)
      if (answerList) {
        answerList.forEach(item => {
          if (item.type == "radio" || item.type == "rate") {
            if (item.selectOption) {
              this.form[item.id] = item.selectOption[0].id
            }
          } else {
            this.form[item.id] = item.selectOption
          }
        })
      }
    },
    getFormList() {
      this.loading = true
      getQuestionnaireInfo(
        this.followUpId,
        this.projectId,
        this.servicePackageUserId,
        this.surveyId
      )
        .then(res => {
          if (res.code == 200) {
            this.id = res.data.id
            this.loading = false
            //处理答案数据
            let surveyList = JSON.parse(
              res.data.hjtSurveyLibResponse.detail
            ).question
            this.assessmentIntroduction = JSON.parse(
              res.data.hjtSurveyLibResponse.detail
            ).assessmentIntroduction
            this.fillInTheIntroduction = JSON.parse(
              res.data.hjtSurveyLibResponse.detail
            ).fillInTheIntroduction
            let answerList = JSON.parse(res.data.answer)
            if (answerList) {
              //单选答案和类型rate
              let radioAnswerList = answerList.filter(item => {
                return item.type == "radio" || item.type == "rate"
              })
              radioAnswerList.forEach(elm => {
                surveyList.forEach(item => {
                  if (elm.id == item.id) {
                    item.answer = elm.selectOption
                  }
                  if (item.children) {
                    item.children.forEach(i => {
                      if (elm.id == i.id) {
                        i.answer = elm.selectOption
                      }
                    })
                  }
                  if (item.config.BindAnswer) {
                    item.config.BindAnswer[0].option.forEach(i => {
                      if (elm.id == i.id) {
                        i.answer = elm.selectOption
                      }
                      if (i.children) {
                        i.children.forEach(i => {
                          if (elm.id == i.id) {
                            i.answer = elm.selectOption
                          }
                        })
                      }
                    })
                  }
                })
              })

              //输入框答案
              let inputAnswerList = answerList.filter(item => {
                return item.type == "fillBlank"
              })
              inputAnswerList.forEach(item => {
                surveyList.forEach(i => {
                  if (item.id == i.id) {
                    i.answer = item.selectOption
                  }
                  if (i.config.BindAnswer) {
                    i.config.BindAnswer[0].option.forEach(i => {
                      if (item.id == i.id) {
                        i.answer = item.selectOption
                      }
                      if (i.children) {
                        i.children.forEach(i => {
                          if (item.id == i.id) {
                            i.answer = item.selectOption
                          }
                        })
                      }
                    })
                  }
                })
              })
            }
            this.surveyList = surveyList
            this.getForm(answerList)
            this.getRule()
            uni.setStorageSync("surveyList", this.surveyList)
            this.updateUser = res.data.updateUser
            this.updateDate = res.data.updateDate
            this.score = res.data.score
            this.advice = res.data.advice
            if (res.data.score !== null) {
              this.score = this.score + "分"
            }
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "问卷异常")
        })
    },
    goQuestionnaire() {
      let submitArr = []
      let surveyList = uni.getStorageSync("surveyList")
      surveyList.forEach(item => {
        submitArr.push({
          id: item.id,
          selectOption: item.answer,
          type: item.type
        })
        if (item.children) {
          console.log(item.children, "有子级")
          item.children.forEach(i => {
            submitArr.push({
              id: i.id,
              selectOption: i.answer,
              type: i.type
            })
          })
        }
        if (item.config.BindAnswer) {
          item.config.BindAnswer[0].option.forEach(item => {
            submitArr.push({
              id: item.id,
              selectOption: item.answer,
              type: item.type
            })
            if (item.children) {
              item.children.forEach(i => {
                submitArr.push({
                  id: i.id,
                  selectOption: i.answer,
                  type: i.type
                })
              })
            }
          })
        }
      })
      let obj = {
        answer: JSON.stringify(submitArr),
        id: this.id,
        projectId: this.projectId,
        surveyId: this.surveyId,
        medicalCardId: this.medicalCardId
      }
      console.log(submitArr, "提交的答案")
      this.$refs.uForm.validate(valid => {
        if (valid) {
          // console.log("验证通过")
          // console.log(this.rules, "rules")
          submitQuestionnaire(this.followUpId, this.servicePackageUserId, obj)
            .then(res => {
              if (res.code == 200) {
                this.$refs.uToast.show({
                  title: "提交成功",
                  type: "success"
                })
                setTimeout(() => {
                  this.$Router.replaceAll({
                    path:
                      "/evaluationQuestionnaire?servicePackageId=" +
                      this.servicePackageUserId +
                      "&medicalCardId=" +
                      this.medicalCardId
                  })
                }, 2000)
              } else {
                this.$refs.uToast.show({
                  title: res.msg,
                  type: "error"
                })
              }
            })
            .catch(err => {
              console.error(err, "提交问卷异常")
            })
        } else {
          console.log("验证失败")
        }
      })
    },
    //获取子组件传来的值
    getquestionnaireForm(formObj) {
      this.form = formObj
    }
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>
<style lang="scss" scoped>
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-main);
}
.content {
  width: 100%;
  margin: auto;
  padding: 0 5%;
  background: var(--bg-color-main);
}
.assessmentIntroduction {
  margin: 10px 0;
  color: var(--text-color-main);
}
.fillInTheIntroduction {
  margin: 5px 0;
  color: var(--text-color-main);
}
.mask {
  width: 100%;
  margin: auto;
  background: transparent;
  position: fixed;
  bottom: 0;
  top: 0;
  z-index: 10;
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
  margin-top: 150px;
  text-align: center;
}
.btn {
  background: var(--bg-color-main);
  padding: 10px 5% 20px 5%;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
.form-css {
  width: 100%;
  height: 80px;
  background: var(--bg-color-main);
}
</style>
