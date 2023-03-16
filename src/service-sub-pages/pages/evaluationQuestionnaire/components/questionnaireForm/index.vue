<template>
  <view v-if="surveyList">
    <view v-for="(item, index) in surveyList" :key="index">
      <!-- 单选 -->
      <view>
        <questionnaireRadio
          @getAnswerData="getAnswerData"
          :infoObj="item"
          :indexBig="index + 1"
          :currentTopic="titleNumber"
          v-if="item.type == 'radio' || item.children || item.type == 'rate'"
        ></questionnaireRadio>
        <view v-if="item.children">
          <view v-for="(i, aindex) in item.children" :key="aindex">
            <questionnaireRadio
              :infoObj="i"
              :indexBig="index + 1"
              :indexLitle="aindex + 1"
              @getAnswerData="getAnswerData"
              :currentTopic="titleNumber"
              v-if="i.type == 'radio' || i.type == 'rate'"
            ></questionnaireRadio>
            <questionnaireInput
              @getAnswerData="getAnswerData"
              :infoObj="i"
              :currentTopic="titleNumber"
              :indexBig="aindex + 1"
              v-if="i.type == 'fillBlank'"
            ></questionnaireInput>
          </view>
        </view>
      </view>
      <!-- 输入框 -->
      <questionnaireInput
        @getAnswerData="getAnswerData"
        :infoObj="item"
        :currentTopic="titleNumber"
        :indexBig="index + 1"
        v-if="item.type == 'fillBlank' || item.children"
      ></questionnaireInput>

      <!-- 同级子级 -->
      <view v-if="item.config.BindAnswer" class="questionnaireForm">
        <questionnaireForm
          :titleNumber="false"
          :surveyList="item.config.BindAnswer[0].option"
          @getquestionnaireForm="getquestionnaireForm"
        ></questionnaireForm>
      </view>
    </view>
  </view>
</template>
<script>
import questionnaireRadio from "@/components/components/questionnaire/questionnaireRadio.vue"
import questionnaireInput from "@/components/components/questionnaire/questionnaireInput.vue"
import questionnaireForm from "@/service-sub-pages/pages/evaluationQuestionnaire/components/questionnaireForm/index.vue"
export default {
  props: {
    surveyList: {
      type: Array
    },
    titleNumber: {
      type: Boolean
    }
  },
  components: {
    questionnaireForm,
    questionnaireRadio,
    questionnaireInput
  },
  data() {
    return {
      formObj: {}
    }
  },
  watch: {
    form: {
      deep: true,
      immediate: true,
      handler(val) {
        this.formObj = val
      }
    }
  },
  methods: {
    //获取子组件传来的值
    getAnswerData(n, id, score) {
      let formObj = uni.getStorageSync("form")
      let surveyList = uni.getStorageSync("surveyList")
      surveyList.forEach(item => {
        if (id == item.id && item.type == "radio") {
          item.answer = []
          item.answer.push({
            id: n,
            value: n,
            score: score
          })
        }
        if (id == item.id && item.type == "rate") {
          item.answer = []
          item.answer.push({
            id: n,
            value: n,
            score: score
          })
        }
        if (id == item.id && item.type == "fillBlank") {
          item.answer = []
          item.answer = n
        }
        //如果下面有children
        if (item.children) {
          item.children.forEach(i => {
            if (id == i.id && i.type == "radio") {
              i.answer = []
              i.answer.push({
                id: n,
                value: n,
                score: score
              })
            }
            if (id == i.id && i.type == "rate") {
              i.answer = []
              i.answer.push({
                id: n,
                value: n,
                score: score
              })
            }
            if (id == i.id && i.type == "fillBlank") {
              i.answer = []
              i.answer = n
            }
          })
        }
        if (item.config.BindAnswer) {
          item.config.BindAnswer[0].option.forEach(item => {
            if (id == item.id && item.type == "radio") {
              item.answer = []
              item.answer.push({
                id: n,
                value: n,
                score: score
              })
            }
            if (id == item.id && item.type == "rate") {
              item.answer = []
              item.answer.push({
                id: n,
                value: n,
                score: score
              })
            }
            if (id == item.id && item.type == "fillBlank") {
              item.answer = []
              item.answer = n
            }
            //如果下面有children
            if (item.children) {
              item.children.forEach(i => {
                if (id == i.id && i.type == "radio") {
                  i.answer = []
                  i.answer.push({
                    id: n,
                    value: n,
                    score: score
                  })
                }
                if (id == i.id && i.type == "rate") {
                  i.answer = []
                  i.answer.push({
                    id: n,
                    value: n,
                    score: score
                  })
                }
                if (id == i.id && i.type == "fillBlank") {
                  i.answer = []
                  i.answer = n
                }
              })
            }
          })
        }
      })
      formObj[id] = n
      uni.setStorageSync("form", formObj)
      uni.setStorageSync("surveyList", surveyList)
      this.$emit("getquestionnaireForm", formObj)
    },
    getquestionnaireForm(formObj) {
      this.$emit("getquestionnaireForm", formObj)
    }
  }
}
</script>
<style lang="scss" scoped>
.questionnaireForm {
  margin-left: 10px;
}
</style>
