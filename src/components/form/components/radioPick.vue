<template>
  <view>
    <u-input
      :custom-style="customStyle"
      v-model="radioValue"
      @click="chooseRadio"
      :disabled="true"
      :focus="false"
      :placeholder="placeholderValue"
    />
    <l-picker
      v-if="infoObj.type == 'radio' || infoObj.type == 'radio.ex'"
      mode="selector"
      v-model="radioShow"
      :range="radiolist"
      @confirm="radioConfirm"
    ></l-picker>
    <l-picker
      v-if="infoObj.type == 'select'"
      range-key="name"
      mode="selector"
      v-model="radioShow"
      :range="selectorObj"
      @confirm="selectConfirm"
    ></l-picker>
  </view>
</template>

<script>
import LPicker from "@/components/basic-components/l-picker/l-picker"
export default {
  props: ["infoObj", "enable", "infoValue", "formId", "keyValue"],
  components: {
    LPicker
  },
  data() {
    return {
      customStyle: {
        color: "var(--text-color-main)"
      },
      radioShow: false,
      radioValue: "",
      placeholderValue: "",
      radiolist: [],
      selectorObj: [],
      disabled: null,
      moving: false
    }
  },
  created() {
    this.getRadioInfo()
  },
  watch: {
    enable(newVal) {
      this.disabled = newVal
    },
    infoObj: {
      deep: true,
      immediate: true,
      handler(val) {
        this.getRadioInfo()
      }
    },
    infoValue: {
      deep: true,
      immediate: true,
      handler(val) {
        this.getRadioInfo()
      }
    }
  },
  options: { styleIsolation: "shared" },
  methods: {
    //获取单选框信息
    getRadioInfo() {
      let radiolist = this.infoObj.expand
      if (this.infoObj.type == "radio") {
        // this.radiolist = JSON.parse(radiolist)
        this.radiolist = Array.isArray(this.infoObj.expand)
          ? this.infoObj.expand
          : JSON.parse(this.infoObj.expand)
      }
      if (this.infoObj.type === "radio.ex") {
        let radioExlist = JSON.parse(this.infoObj.expand)
        let list = []
        radioExlist.forEach(item => {
          list.push(item.value)
        })
        this.radiolist = list
      }
      //类型是select的医生组
      if (this.infoObj.type == "select") {
        let envVersion = __wxConfig.envVersion
        if (envVersion === "trial" || envVersion === "develop") {
          this.selectorObj = JSON.parse(radiolist)
        } else {
          this.selectorObj = JSON.parse(radiolist).filter(
            item => !item.name.includes("模拟")
          )
        }
        this.selectorObj.forEach(item => {
          if (item.id == this.infoValue) {
            this.radioValue = item.name
          }
        })
      }
      if (this.infoObj.type == "radio" || this.infoObj.type == "radio.ex") {
        if (this.infoValue) {
          this.radioValue = this.infoValue.split("/")[0]
        }
      }
      this.placeholderValue = this.infoObj.placeholder
        ? this.infoObj.placeholder
        : ""
      this.disabled = this.enable
    },
    chooseRadio() {
      wx.hideKeyboard()
      if (!this.enable) {
        this.radioShow = true
      }
    },
    radioConfirm(e) {
      this.radioValue = this.radiolist[e]
      let moudleId = this.infoObj.key
      this.$emit(
        "getRadioData",
        this.radioValue,
        moudleId,
        this.formId,
        this.keyValue,
        this.infoObj.type
      )
    },
    selectConfirm(e) {
      this.radioValue = this.selectorObj[e].name
      let radioValueId = String(this.selectorObj[e].id)
      let moudleId = this.infoObj.key
      this.$emit("getRadioData", radioValueId, moudleId)
    }
  }
}
</script>

<style lang="scss" scoped></style>
