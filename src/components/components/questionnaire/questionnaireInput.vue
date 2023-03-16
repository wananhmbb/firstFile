<template>
  <view class="radioBox">
    <u-form-item
      :prop="id"
      :label="currentTopic ? indexBig + '.' + tltle : tltle"
      :border-bottom="false"
      v-if="infoObj.type == 'fillBlank'"
    >
      <u-input v-model="inputValue" @blur="blur" />
    </u-form-item>
  </view>
</template>
<script>
export default {
  props: {
    infoObj: {
      type: Object
    },
    indexBig: {
      type: Number,
      default: null
    },
    answerList: {
      type: Array
    },
    currentTopic: {
      type: Boolean
    }
  },
  data() {
    return {
      tltle: "",
      id: "",
      inputValue: ""
    }
  },
  options: { styleIsolation: "shared" },
  created() {
    this.getRadioInfo()
  },
  methods: {
    //获取填空信息
    getRadioInfo() {
      // console.log(this.infoObj, "全部填空")
      this.tltle = this.infoObj.title
      this.id = this.infoObj.id
      if (this.infoObj.answer) {
        this.inputValue = this.infoObj.answer
      }
    },
    blur(n) {
      let id = this.id
      this.$emit("getAnswerData", n, id)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-form-item--left__content__label {
  color: var(--text-color-main) !important;
}
</style>
