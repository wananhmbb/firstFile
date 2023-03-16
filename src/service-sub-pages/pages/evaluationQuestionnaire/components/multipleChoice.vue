<template>
  <view class="multipleChoiceBox">
    <view class="questionnaireTitle">{{ title }}</view>
    <view class="optionBox">
      <view
        v-for="(item, index) in multipleChoiceList"
        :key="index"
        @click="check(index, item)"
        :class="item.selected ? 'option' : 'optionSelect'"
      >
        <view class="optionNumber">
          <view>{{ item.serialNumber }}</view>
          <view>{{ item.title }}</view>
        </view>
        <u-icon
          v-if="item.selected"
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
      multipleChoiceList: [],
      questionCode: "",
      title: ""
    }
  },

  watch: {
    questionList: {
      deep: true,
      immediate: true,
      handler(val) {
        if (val) {
          this.title = val.title
          this.multipleChoiceList = val.option
          let indexObj = {}
          this.multipleChoiceList.forEach(
            (item, index) => (indexObj[item.optionCode] = index)
          )
          this.questionCode = val.code
          //数据回显
          if (Object.keys(this.allAnswerObj).length > 0) {
            let answerCode = Object.keys(this.allAnswerObj[this.questionCode])
            if (answerCode) {
              answerCode.forEach(item => {
                let checkItem = this.multipleChoiceList.filter(
                  val => val.optionCode === item
                )
                if (checkItem.length > 0) {
                  let index = indexObj[checkItem[0].optionCode]
                  this.check(index, checkItem[0])
                }
              })
            }
          }
          //存在本地填写过的答案
          else {
            let storageSubmitObj = uni.getStorageSync("formListSubmitObj")
            if (storageSubmitObj[this.questionCode]) {
              let answerCode = Object.keys(storageSubmitObj[this.questionCode])
              answerCode.forEach(item => {
                let checkItem = this.multipleChoiceList.filter(
                  val => val.optionCode === item
                )
                if (checkItem.length > 0) {
                  let index = indexObj[checkItem[0].optionCode]
                  this.check(index, checkItem[0])
                }
              })
            }
            let jLength = this.multipleChoiceList.length
            for (var j = 0; j < jLength; j++) {
              var str = "A"
              this.multipleChoiceList[j].serialNumber = String.fromCharCode(
                str.charCodeAt() + j
              )
            }
          }
        }
      }
    }
  },
  methods: {
    check(index, item) {
      this.multipleChoiceList[index].selected = !item.selected
      //答案互斥
      if (item.attribute && item.attribute.rejectOtherType === "rejectAll") {
        this.multipleChoiceList.forEach(i => {
          if (i.optionCode === item.optionCode) {
            i.selected = true
          } else {
            i.selected = false
          }
        })
      } else {
        this.multipleChoiceList.forEach(i => {
          if (i.attribute && i.attribute.rejectOtherType === "rejectAll") {
            i.selected = false
          }
        })
      }
      this.$forceUpdate()
      let selectedList = this.multipleChoiceList.filter(item => item.selected)
      let answerObj = {}
      let valueObj = {}
      let value = ""
      selectedList.forEach(item => {
        valueObj[item.optionCode] = true
      })
      //判断是否填写的有值,是否必填
      if (selectedList.length > 0) {
        value = "yes"
      } else {
        value = ""
      }
      answerObj[this.questionCode] = valueObj
      this.$emit("getAnswers", this.questionCode, valueObj, value)
    }
  }
}
</script>
<style lang="scss" scoped>
.multipleChoiceBox {
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
