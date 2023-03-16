<template>
  <view class="singleChoiceBox">
    <view class="questionnaireTitle">{{ title }}</view>
    <view class="optionBox">
      <view
        v-for="(item, index) in singleChoiceList"
        :key="index"
        @click="check(index, item)"
        :class="indexIn === item.optionCode ? 'option' : 'optionSelect'"
      >
        <view class="optionNumber">
          <view>{{ item.serialNumber }}</view>
          <view>{{ item.title }}</view>
        </view>
        <u-icon
          v-if="indexIn === item.optionCode"
          name="checkmark-circle-fill"
          color="var(--theme-color-dark-blue)"
          size="36"
        ></u-icon>
      </view>
    </view>
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
      indexIn: null,
      singleChoiceList: [],
      answerObj: {},
      questionCode: "",
      title: ""
    }
  },
  created() {},
  watch: {
    questionList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.title = val.title
          this.questionCode = val.code
          this.singleChoiceList = val.option
          let jLength = this.singleChoiceList.length
          for (var j = 0; j < jLength; j++) {
            var str = "A"
            this.singleChoiceList[j].serialNumber = String.fromCharCode(
              str.charCodeAt() + j
            )
          }
          //数据回显
          if (Object.keys(this.allAnswerObj).length > 0) {
            let answerCode = this.allAnswerObj[this.questionCode]
            if (answerCode) {
              let checkItem = this.singleChoiceList.filter(
                item => item.optionCode === Object.keys(answerCode)[0]
              )
              checkItem.length > 0 ? this.check(null, checkItem[0]) : ""
            }
          } else {
            //存在本地填写过的答案
            let storageSubmitObj = uni.getStorageSync("formListSubmitObj")
            if (storageSubmitObj[this.questionCode]) {
              let answerCode = storageSubmitObj[this.questionCode]
              let checkItem = this.singleChoiceList.filter(
                item => item.optionCode === Object.keys(answerCode)[0]
              )
              checkItem.length > 0 ? this.check(null, checkItem[0]) : ""
            }
          }
          this.$forceUpdate()
        }
      }
    }
  },
  methods: {
    check(index, item) {
      this.indexIn = item.optionCode
      let answerObj = {}
      let valueObj = {}
      let value = "yes"
      valueObj[item.optionCode] = true
      answerObj[this.questionCode] = valueObj
      this.$emit(
        "getAnswers",
        this.questionCode,
        valueObj,
        value,
        this.title,
        item.title
      )
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
  }
  .optionBox {
    margin: 20px auto auto auto;
    .optionSelect {
      background: var(--bg-color-second);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      font-weight: bold;
      padding: 20px;
      margin-bottom: 18px;
      border-radius: 12px;
      color: var(--text-color-main);
    }
    .option {
      background: var(--bg-color-second);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      font-weight: bold;
      padding: 20px;
      margin-bottom: 18px;
      border-radius: 12px;
      color: var(--theme-color-dark-blue);
      box-shadow: 0px 0px 8px 0px rgba(67, 129, 207, 0.4);
    }
    .optionNumber {
      display: flex;
      align-items: center;

      view:first-child {
        padding-right: 15px;
      }
    }
  }
}
</style>
