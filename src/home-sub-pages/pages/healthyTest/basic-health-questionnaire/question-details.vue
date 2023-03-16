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
        >
          {{ i.label }}</view
        >
        <view class="ipt" v-if="!noAnswer">
          <view class="text">性别</view>
          <view class="sex">
            <u-input
              v-model="formIpt.sex"
              type="select"
              placeholder="请选择"
              :custom-style="ipnCustomStyle"
              border
              @click="sexShow = true"
            />
            <l-picker
              mode="selector"
              v-model="sexShow"
              :range="selector"
              @confirm="confirmSex"
              @cancel="sexShow = false"
            ></l-picker>
          </view>
          <view class="text mar">年龄</view>
          <u-input
            v-model="formIpt.age"
            type="number"
            placeholder="请输入"
            :custom-style="ipnCustomStyle"
            border
          />
          <l-picker
            mode="time"
            v-model="pickTimeshow"
            :params="params"
            @confirm="confirmTime"
            :end-year="endyear"
            @cancel="pickTimeshow = false"
          >
          </l-picker>
        </view>
        <u-form
          label-position="top"
          :model="form"
          ref="uForm"
          label-width="200"
          :error-type="errorType"
          :border-bottom="false"
        >
          <view v-for="(item, index) in surveyList" :key="index">
            <!-- 单选 -->
            <view>
              <questionnaireRadio
                @getAnswerData="getAnswerData"
                :surveyList="surveyList"
                :infoObj="item"
                :indexBig="index + 1"
                v-if="
                  item.type == 'radio' || item.children || item.type == 'rate'
                "
              ></questionnaireRadio>
              <view v-if="item.children">
                <questionnaireRadio
                  v-for="(i, aindex) in item.children"
                  :infoObj="i"
                  :indexBig="index + 1"
                  :indexLitle="aindex + 1"
                  :key="aindex"
                  @getAnswerData="getAnswerData"
                ></questionnaireRadio>
              </view>
            </view>
            <!-- 输入框 -->
            <questionnaireInput
              @getAnswerData="getAnswerData"
              :infoObj="item"
              :indexBig="index + 1"
              v-if="item.type == 'fillBlank' || item.children"
            ></questionnaireInput>
          </view>
        </u-form>
      </view>
      <view class="btn">
        <u-button type="primary" shape="circle" @click="toUpateOrSubmit">
          {{ noAnswer ? "提交" : "下一步" }}
        </u-button>
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
      <view class="mask" v-if="showMask" @click="clickShowmask"></view>
      <u-toast ref="uToast" />
      <view class="model-box">
        <u-modal
          v-model="popShow"
          :show-confirm-button="false"
          :show-title="false"
        >
          <view class="upmain">
            <view class="picBox">
              <img
                src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/img_result_bg%402x.png"
              />
            </view>
            <view class="box">
              <view class="title">本次测评结果</view>
              <view class="result">
                {{ result }}
              </view>
              <view class="ikonwBox">
                <u-button
                  type="primary"
                  shape="circle"
                  :custom-style="customStyle"
                  @click="Iknow()"
                >
                  我知道了</u-button
                >
              </view>
            </view>
          </view>
        </u-modal>
      </view>
    </view>
  </theme>
</template>
<script>
import { getFreeListApi } from "@/api/service"
import questionnaireRadio from "@/components/components/questionnaire/questionnaireRadio.vue"
import questionnaireInput from "@/components/components/questionnaire/questionnaireInput.vue"
export default {
  components: {
    questionnaireRadio,
    questionnaireInput
  },
  options: {
    styleIsolation: "shared"
  },
  data() {
    return {
      hasAnswer: false,
      showMask: null,
      loading: true,
      surveyId: "",
      formId: null,
      title: "",
      form: {},
      rules: {},
      errorType: ["message", "border-bottom", "toast"],
      surveyList: [],
      assessmentIntroduction: "",
      fillInTheIntroduction: [],
      noAnswer: null,
      score: null,
      result: "",
      popShow: false,
      //输入框
      endyear: "",
      ipnCustomStyle: {
        color: "var(--text-color-main)"
      },
      formIpt: {
        sex: "",
        age: ""
      },
      //性别
      sexShow: false,
      selector: ["男", "女"],
      //年龄
      pickTimeshow: false,
      params: {
        year: true,
        month: true,
        day: true
      },
      multipleData: {
        sex: "",
        age: "",
        evaluationContent: []
      }
    }
  },
  onLoad() {
    let startTime = new Date()
    let nowYear = startTime.getFullYear()
    this.endyear = nowYear
    this.formId = this.$Route.query.id
    this.title = this.$Route.query.title
    this.noAnswer = this.$Route.query.noAnswer
    this.getFreeList(this.formId)
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
            message: "请填写题目" + indexOne,
            trigger: ["blur", "change"]
          }
        ]
        if (item.children) {
          item.children.forEach(i => {
            rules2[i.id] = [
              {
                required: i.rules[0].require,
                message: i.rules[0].message,
                trigger: ["blur", "change"]
              }
            ]
          })
        }
      })
      this.rules = Object.assign({
        ...rules1,
        ...rules2
      })
      console.log(this.rules, "  this.rules")
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
      })
      this.form = Object.assign({
        ...form1,
        ...form2
      })
      if (answerList) {
        console.log(answerList)
        answerList.forEach(item => {
          if (item.type === "radio" || item.type === "rate") {
            this.form[item.id] = item.selectOption[0].id
          } else {
            this.form[item.id] = item.selectOption
          }
        })
      }
    },
    getFreeList(id) {
      getFreeListApi({
        idList: id
      })
        .then(res => {
          if (res.code === 200) {
            this.formId = res.data[0].id
            this.loading = false
            let itemData = res.data[0]
            //处理答案数据
            let surveyList = JSON.parse(itemData.detail).question
            this.assessmentIntroduction = JSON.parse(
              itemData.detail
            ).assessmentIntroduction
            this.fillInTheIntroduction = JSON.parse(
              itemData.detail
            ).fillInTheIntroduction
            if (!this.noAnswer) {
              var answerList = uni.getStorageSync("healthyQuestionAnswer")
                ? JSON.parse(uni.getStorageSync("healthyQuestionAnswer"))
                : null
            }
            if (!answerList) {
              this.showMask = false
            } else {
              this.showMask = true
            }

            if (answerList) {
              //单选答案和类型rate
              let radioAnswerList = answerList.filter(item => {
                return item.type === "radio" || item.type === "rate"
              })
              radioAnswerList.forEach(elm => {
                surveyList.forEach(item => {
                  if (elm.id === item.id) {
                    item.answer = elm.selectOption
                  }
                  if (item.children) {
                    item.children.forEach(i => {
                      if (elm.id === i.id) {
                        i.answer = elm.selectOption
                      }
                    })
                  }
                })
              })

              //输入框答案
              let inputAnswerList = answerList.filter(item => {
                return item.type === "fillBlank"
              })
              inputAnswerList.forEach(item => {
                surveyList.forEach(i => {
                  if (item.id === i.id) {
                    i.answer = item.selectOption
                  }
                })
              })
            }
            this.surveyList = surveyList
            this.getForm(answerList)
            this.getRule()
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "问卷异常")
        })
    },

    goQuestionnaire() {
      let submitArr = []
      this.surveyList.forEach(item => {
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
      let answer = JSON.stringify(submitArr)
      this.$refs.uForm.validate(valid => {
        if (valid) {
          if (!this.noAnswer) {
            this.multipleData.sex = this.formIpt.sex == "男" ? 1 : 0
            this.multipleData.age = this.formIpt.age
            // this.multipleData.evaluationContent.push({
            //   value: submitArr,
            //   type: "答题数据格式暂不确定"
            // })
            this.$Router.push({
              path: "/quietHeartRate",
              query: {
                data: this.multipleData
              }
            })
            // console.log(submitArr, 111)
            // this.$refs.uToast.show({
            // 	title: "提交成功",
            // 	type: "success"
            // })
            // uni.setStorageSync("healthyQuestionAnswer", answer)
            // this.showMask = true
            // let timer = setTimeout(() => {
            // 	uni.navigateBack({
            // 		delta: 1
            // 	})
            // 	clearTimeout(timer)
            // }, 1000)
          } else {
            submitArr.forEach(item => {
              this.score += parseInt(item.selectOption[0].score)
            })
            if (this.formId === "1536590404802330625") {
              let score = parseInt(this.score * 1.25)
              this.getResult1(score)
              this.popShow = true
            }
            if (this.formId === "1536590678686187522") {
              this.getResult2(submitArr)
              this.popShow = true
            }
            if (this.formId === "1536590987940610049") {
              this.getResult3(this.score)
              this.popShow = true
            }
            if (this.formId === "1536591133495541761") {
              this.getResult4(this.score)
              this.popShow = true
            }
          }
        } else {
          console.error("验证未通过")
        }
      })
    },
    //获取子组件传来的值
    getAnswerData(n, id, score) {
      // console.log(n, id, "n, id")
      this.surveyList.forEach(item => {
        if (id === item.id && item.type === "radio") {
          item.answer = []
          item.answer.push({
            id: n,
            value: n,
            score: score
          })
        }
        if (id === item.id && item.type === "rate") {
          item.answer = []
          item.answer.push({
            id: n,
            value: n,
            score: score
          })
        }
        if (id === item.id && item.type === "fillBlank") {
          item.answer = []
          item.answer = n
        }
        //如果下面有children
        if (item.children) {
          item.children.forEach(i => {
            if (id === i.id && i.type === "radio") {
              i.answer = []
              i.answer.push({
                id: n,
                value: n,
                score: score
              })
            }
            if (id === i.id && i.type === "rate") {
              i.answer = []
              i.answer.push({
                id: n,
                value: n,
                score: score
              })
            }
            if (id === i.id && i.type === "fillBlank") {
              i.answer = []
              i.answer = n
            }
          })
        }
      })
      this.form[id] = n
    },
    toUpateOrSubmit() {
      if (!this.noAnswer) {
        if (!this.formIpt.sex) {
          this.$refs.uToast.show({
            title: "请选择性别!",
            type: "error",
            icon: true
          })
          return
        }
        if (!this.formIpt.age) {
          this.$refs.uToast.show({
            title: "请填写年龄!",
            type: "error",
            icon: true
          })
          return
        }
      }
      this.goQuestionnaire()
      // if (this.showMask) {
      //   this.toChangeUpdate()
      // } else {
      //   this.goQuestionnaire()
      // }
    },
    toChangeUpdate() {
      this.showMask = false
    },
    clickShowmask() {
      this.$refs.uToast.show({
        title: "请点击编辑",
        type: "error"
      })
    },
    Iknow() {
      uni.navigateBack({
        delta: 1
      })
    },
    getResult1(score) {
      if (score < 53) {
        this.result = "无抑郁"
      }
      if (53 <= score && score <= 62) {
        this.result = "轻度抑郁"
      }
      if (63 <= score && score <= 72) {
        this.result = "中度抑郁"
      }
      if (score >= 73) {
        this.result = "重度抑郁"
      }
    },
    getResult2(arr) {
      let obj = {}
      arr.forEach(element => {
        if (obj[element.selectOption[0].score]) {
          obj[element.selectOption[0].score]++
        } else {
          obj[element.selectOption[0].score] = 1
        }
      })
      let lable4 = obj[4] ? obj[4] : 0
      let lable5 = obj[5] ? obj[5] : 0
      if (lable4 + lable5 >= 10) {
        this.result = "高效型"
      }
      if (lable4 + lable5 === 9) {
        this.result = "激发型"
      }
      if (lable4 + lable5 === 8) {
        this.result = "中立型"
      }
      if (lable4 + lable5 <= 7) {
        this.result = "消极型"
      }
    },
    getResult3(i) {
      if (i <= 4) {
        this.result = "无焦虑"
      }
      if (5 <= i && i <= 9) {
        this.result = "轻度焦虑"
      }
      if (10 <= i && i <= 14) {
        this.result = "中度焦虑"
      }
      if (15 <= i && i <= 21) {
        this.result = "重度焦虑"
      }
    },
    getResult4(i) {
      if (i <= 4) {
        this.result = "无抑郁症状"
      }
      if (5 <= i && i <= 9) {
        this.result = "无抑郁症状"
      }
      if (10 <= i && i <= 14) {
        this.result = "中度抑郁症状"
      }
      if (15 <= i && i <= 19) {
        this.result = "中重度抑郁症状"
      }
      if (20 <= i && i <= 27) {
        this.result = "重度抑郁症状"
      }
    },
    //改版
    confirmSex(e) {
      // console.log(e);
      if (e[0] == 0) {
        this.formIpt.sex = "男"
      } else {
        this.formIpt.sex = "女"
      }
    },
    confirmTime(e) {
      let str = e.year + "-" + e.month + "-" + e.day
      let a = this.ages(str)
      this.formIpt.age = String(a)
    },
    ages(str) {
      var r = str.match(/^(\d{1,4})(-|\/)(\d{1,2})\2(\d{1,2})$/)
      if (r == null) return false
      var d = new Date(r[1], r[3] - 1, r[4])
      if (
        d.getFullYear() == r[1] &&
        d.getMonth() + 1 == r[3] &&
        d.getDate() == r[4]
      ) {
        var Y = new Date().getFullYear()
        return Y - r[1]
      }
      return "输入的日期错误！"
    }
  },

  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-mode-center-box {
  background-color: transparent !important;
}

.model-box {
  /deep/ .u-model {
    background-color: transparent !important;
  }
}

.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-main);
}

.ikonwBox {
  width: 80%;
  margin: 15px auto;
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
  z-index: 12;
}

.form-css {
  width: 100%;
  height: 80px;
  background: var(--bg-color-main);
}

.upmain {
  height: 100%;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-around;
  position: relative;

  .picBox {
    width: 150px;
    height: 150px;
    position: absolute;
    top: 0;
  }

  img {
    width: 100%;
    height: 100%;
  }

  .box {
    width: 100%;
    height: 80%;
    background: var(--bg-color-main);
    margin-top: 60px;
    border-radius: 10px;

    .title {
      margin-top: 105px;
      text-align: center;
      font-size: 32rpx;
      color: var(--text-color-main);
      padding: 10px 0;
    }

    .result {
      color: var(--text-color-main);
      padding: 30px 0;
      font-size: 34rpx;
      font-weight: 600;
      text-align: center;
    }
  }
}
.ipt {
  /deep/.u-icon__icon {
    color: var(--bg-color-main) !important;
  }
  .text {
    color: var(--text-color-grey);
    margin-bottom: 5px;
  }
  .mar {
    margin-top: 15px;
  }

  .title {
    color: var(--text-color-grey);
    font-size: 16px;
  }
}
</style>
