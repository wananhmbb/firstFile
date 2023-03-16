<template>
  <view>
    <u-input
      :custom-style="customStyle"
      v-model="pickTime"
      @click="chooseTime"
      :disabled="true"
      :focus="false"
      :placeholder="placeholderValue"
    />
    <l-picker
      mode="time"
      v-model="timeShow"
      :params="params"
      @confirm="timeConfirm"
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
      pickTime: "",
      placeholderValue: "",
      timeShow: false,
      disabled: null,
      params: {
        year: true,
        month: true,
        day: true
      }
    }
  },
  watch: {
    enable(newVal) {
      this.disabled = newVal
    }
  },
  created() {
    this.getTimeInfo()
  },
  methods: {
    //获取时间选择信息
    getTimeInfo() {
      this.pickTime = this.infoValue
      this.placeholderValue = this.infoObj.placeholder
      this.disabled = this.enable
    },
    chooseTime() {
      wx.hideKeyboard()
      if (!this.disabled) {
        this.timeShow = true
      }
    },
    timeConfirm(e) {
      let moudleId = this.infoObj.key
      this.pickTime = e.year + "-" + e.month + "-" + e.day
      this.$emit(
        "getRadioData",
        this.pickTime,
        moudleId,
        this.formId,
        this.keyValue
      )
    }
  }
}
</script>

<style></style>
