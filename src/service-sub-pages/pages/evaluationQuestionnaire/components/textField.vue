<template>
  <view class="singleChoiceBox">
    <view class="questionnaireTitle"> {{ title }}</view>
    <u-input
      border-color="var(--text-color-grey)"
      :custom-style="bdStyle"
      v-model="value"
      :type="type"
      :border="border"
      @blur="blur"
      :clearable="false"
    />
  </view>
</template>
<script>
export default {
  props: {
    questionList: {
      type: Object
    },
    allAnswerObj: {
      type: Object
    }
  },
  data() {
    return {
      value: "",
      type: "text",
      border: true,
      title: "",
      bdStyle: {
        color: "var(--text-color-grey)"
      }
    }
  },
  created() {},
  watch: {
    questionList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.value = ""
          this.title = val.title
          this.questionCode = val.code
          this.optionCode = val.option[0].optionCode
          //数据回显
          if (Object.keys(this.allAnswerObj).length > 0) {
            let answerCode = this.allAnswerObj[this.questionCode]
            if (answerCode) {
              this.value = answerCode[this.optionCode]
              this.blur()
            }
          }
          //存在本地填写过的答案
          else {
            let storageSubmitObj = uni.getStorageSync("formListSubmitObj")
            if (storageSubmitObj[this.questionCode]) {
              let answerCode = storageSubmitObj[this.questionCode]
              this.value = answerCode[this.optionCode]
              this.blur()
            }
          }
        }
      }
    }
  },
  methods: {
    blur() {
      let answerObj = {}
      let valueObj = {}
      valueObj[this.optionCode] = this.value
      answerObj[this.questionCode] = valueObj
      this.$emit("getAnswers", this.questionCode, valueObj, this.value)
    }
  }
}
</script>
<style lang="scss" scoped>
.singleChoiceBox {
  margin-top: 25px;
  .questionnaireTitle {
    font-size: 34rpx;
    font-weight: bold;
    color: var(--text-color-main);
    margin: auto auto 20px auto;
  }
  .headBox {
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    color: var(--text-color-main);
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 10px;
  }
  .progressBox {
    position: relative;
    display: flex;
    justify-content: space-between;
    border: 1px solid var(--bd-color-main);
    z-index: 10;
    background: linear-gradient(-90deg, #4381cf, #ffffff);
    .cell {
      text-align: center;
      line-height: 30px;
      border: 1px solid #000;
    }
    .cellSelect {
      text-align: center;
      line-height: 30px;
    }
    .progress {
      height: 30px;
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      background: linear-gradient(-90deg, #4381cf, #ffffff);
    }
  }
}
</style>
