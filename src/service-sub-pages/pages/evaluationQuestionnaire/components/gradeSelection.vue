<template>
  <view class="singleChoiceBox">
    <view class="questionnaireTitle">{{ title }}</view>
    <view class="headBox">
      <view class="leftText">{{ leftWord }}</view>
      <view class="rightText">{{ rightWord }}</view>
    </view>
    <!-- <view class="progressOutBox">
      <view class="progressBox bgf">
        <view
          v-for="(item, index) in singleChoiceList"
          @click="check(item)"
          :key="index"
          :style="{ width: width + '%' }"
          class="text_center"
          >{{ item.number }}</view
        >
      </view>
      <view class="bgGradBox" :style="{ width: indexIn + 'vw' }">
        <view class="progressBox bgGrad">
          <view
            v-for="(item, index) in singleChoiceList"
            @click="check(item)"
            :key="index"
            :style="{ width: width + '%' }"
            class="text_center"
            >{{ item.number }}</view
          >
        </view>
      </view>
    </view> -->
    <slider
      :value="nowNum"
      show-value="true"
      :min="minNum"
      :max="maxNum"
      activeColor="var(--theme-color-dark-blue)"
      @change="sliderChange"
    >
    </slider>
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
      indexIn: 0,
      singleChoiceList: [],
      answerObj: {},
      leftNum: "",
      leftWord: "",
      rightNum: "",
      nowNum: "",
      minNum: "",
      maxNum: "",
      rightWord: "",
      questionCode: "",
      optionCode: "",
      width: null,
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
          this.questionCode = val.option[0].questionCode
          this.optionCode = val.option[0].optionCode
          this.leftNum = val.attribute.leftNum
          this.rightNum = val.attribute.rightNum
          this.leftWord = val.attribute.leftWord
          this.rightWord = val.attribute.rightWord
          if (this.leftNum < this.rightNum) {
            this.minNum = this.leftNum
            this.maxNum = this.rightNum
            this.nowNum = this.leftNum
            for (var a = this.leftNum; a <= this.rightNum; a++) {
              this.singleChoiceList.push({ number: a })
            }
          } else {
            for (var b = this.leftNum; b >= this.rightNum; b--) {
              this.singleChoiceList.push({ number: b })
            }
            this.minNum = this.rightNum
            this.maxNum = this.leftNum
            this.nowNum = this.rightNum
          }
          this.width = 100 / this.singleChoiceList.length
          //数据回显
          if (Object.keys(this.allAnswerObj).length > 0) {
            let questionCode = val.code
            let answerCode = this.allAnswerObj[questionCode]
            if (answerCode) {
              let checkItem = this.singleChoiceList.filter(
                item => item.number === answerCode[this.optionCode]
              )
              this.nowNum = checkItem[0].number
              checkItem.length > 0 ? this.check(checkItem[0]) : ""
            }
          }
          //存在本地填写过的答案
          else {
            let storageSubmitObj = uni.getStorageSync("formListSubmitObj")
            if (storageSubmitObj[this.questionCode]) {
              let questionCode = val.code
              let answerCode = storageSubmitObj[questionCode]
              let checkItem = this.singleChoiceList.filter(
                item => item.number === answerCode[this.optionCode]
              )
              this.nowNum = checkItem[0].number
              checkItem.length > 0 ? this.check(checkItem[0]) : ""
            }
          }
        }
      }
    }
  },
  methods: {
    sliderChange(e) {
      let obj = { number: e.detail.value }
      this.check(obj)
    },
    check(item) {
      // this.indexIn = item.number * 9
      let answerObj = {}
      let valueObj = {}
      let value = item.number ? item.number : ""
      valueObj[this.optionCode] = item.number
      answerObj[this.questionCode] = valueObj
      this.$emit("getAnswers", this.questionCode, valueObj, value)
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
    color: #080809;
  }
  .headBox {
    width: 100%;
    margin: auto;
    display: flex;
    justify-content: space-between;
    color: var(--text-color-main);
    font-weight: bold;
    font-size: 15px;
    margin-bottom: 20px;
  }
  .bgGrad {
    background: linear-gradient(-90deg, #4381cf, #ffffff);
  }
  .bgf {
    background: #fff;
  }
  .progressOutBox {
    width: 100%;
    position: relative;
    .bgGradBox {
      position: absolute;
      top: 0;
      left: 0;
      overflow: hidden;
    }
  }
  .progressBox {
    width: 90vw;
    position: relative;
    display: flex;
    justify-content: space-between;
    border: 1px solid var(--bd-color-main);
    z-index: 10;
    .text_center {
      line-height: 60rpx;
      text-align: center;
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
