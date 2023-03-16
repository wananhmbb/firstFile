<template>
  <view class="radioBox">
    <u-form-item
      :prop="id"
      :label="
        currentTopic
          ? indexBig + '.' + (indexLitle > 0 ? indexLitle + '.' : '') + tltle
          : tltle
      "
      :border-bottom="false"
    >
      <view v-if="infoObj.option">
        <u-radio-group v-model="radio" :wrap="true">
          <u-radio
            v-for="(item, index) in infoObj.option"
            :key="index"
            :name="item.id"
            @change="radioChange(item)"
          >
            {{ item.label }}
          </u-radio>
        </u-radio-group>
      </view>
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
    indexLitle: {
      type: Number,
      default: null
    },
    currentTopic: {
      type: Boolean
    }
  },
  data() {
    return {
      tltle: "",
      radio: "",
      id: "",
      radioList: [
        {
          name: "鲜甜",
          disabled: false
        },
        {
          name: "麻辣",
          disabled: false
        }
      ]
    }
  },
  options: { styleIsolation: "shared" },
  created() {
    this.getRadioInfo()
  },
  methods: {
    //获取单选框信息
    getRadioInfo() {
      // console.log(this.infoObj, "全部单选")
      this.tltle = this.infoObj.title
      if (this.infoObj.type == "radio" || this.infoObj.type == "rate") {
        if (this.infoObj.option) {
          this.radioList = this.infoObj.option.label
        }
        this.id = this.infoObj.id
      }
      if (this.infoObj.answer) {
        this.infoObj.option.forEach(element => {
          if (element.id == this.infoObj.answer[0].id) {
            this.radio = element.id
          }
        })
      }
    },
    radioChange(item) {
      let id = this.id
      this.$emit("getAnswerData", item.id, id, item.score)
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-radio {
  padding: 10px 0 !important;
  display: flex !important;
  align-items: flex-start !important;
}
/deep/.u-radio__icon-wrap {
  margin-top: 5px !important;
}
/deep/.u-form-item--left__content__label {
  color: var(--text-color-main);
}
</style>
