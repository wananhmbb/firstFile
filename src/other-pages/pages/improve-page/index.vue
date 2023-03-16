<template>
  <theme>
    <view slot="theme" class="main">
      <house-header :headTypeTwo="headTypeTwo"></house-header>
      <view class="list">
        <u-form
          :model="form"
          ref="uForm"
          label-width="200"
          :error-type="errorType"
          :border-bottom="true"
        >
          <u-form-item
            label="患者名称"
            :border-bottom="true"
            prop="patientName"
            label-width="200"
          >
            <u-input v-model="form.patientName" placeholder="请输入患者姓名" />
          </u-form-item>
          <u-form-item
            label="身份证"
            :border-bottom="true"
            prop="idNumber"
            label-width="200"
          >
            <u-input v-model="form.idNumber" placeholder="请输入身份证号" />
          </u-form-item>
          <u-form-item
            label="性别"
            :border-bottom="true"
            prop="sex"
            label-width="200"
          >
            <u-radio-group v-model="form.sex">
              <u-radio
                v-for="(item, index) in sexList"
                :key="index"
                :name="item.value"
                :disabled="item.disabled"
				active-color="var(--theme-color-dark-blue)"
              >
                {{ item.label }}
              </u-radio>
            </u-radio-group>
          </u-form-item>
          <u-form-item
            label="出生日期"
            :border-bottom="true"
            prop="birthday"
            label-width="200"
          >
            <view v-if="form.birthday" @click="openTime">{{
              form.birthday 
            }}</view>
			<view v-else @click="openTime" class="birthday-text">
			   请选择出生日期
			</view>
          </u-form-item>
        </u-form>
      </view>
      <view class="bottom-btn">
        <u-button type="primary" shape="circle" @click="perfectMedicalCardInfo"
          >保存</u-button
        >
      </view>

      <l-picker
        mode="time"
        v-model="timeShow"
        :params="params"
        :defaultTime="form.birthday"
        @confirm="timeConfirm"
		confirm-color="var(--theme-color-dark-blue)"
      ></l-picker>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import LPicker from "@/components/basic-components/l-picker/l-picker"
import {perfectMedicalCardInfoApi} from "@/api/medicalCard"
import {setSexList} from "@/utils/enums/sex"
import store from "store"
import {RequestList} from "@/utils/requestCode"
export default {
  name: "index",
  components: {
    LPicker
  },
  data() {
    return {
      headTypeTwo: "完善就诊卡",
      form: {
        patientName: "",
        idNumber: "",
        sex: "",
        birthday: ""
      },
      errorType: ["toast"],
      rules: {
        patientName: [
          {
            type: "string",
            required: true,
            message: "请输入患者姓名"
          }
        ],
        idNumber: [
          {
            type: "string",
            required: true,
            message: "请输入身份证",
            pattern:
              /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/,
            trigger: ["blur"]
          }
        ],
        sex: [
          {
            type: "number",
            required: true,
            message: "请选择性别",
            trigger: ["blur"]
          }
        ],
        birthday: [
          {
            type: "string",
            required: true,
            message: "请选择出生日期",
            trigger: ["blur"]
          }
        ]
      },
      value: {},
      currentImproveObj: {},
      sexList: setSexList,
      timeShow: false,
      params: {
        year: true,
        month: true,
        day: true
      }
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  onLoad(option) {
    this.value = option
    this.currentImproveObj = this.$store.state.improve.currentImproveInfo
    this.form.patientName = this.currentImproveObj.patientName ? this.currentImproveObj.patientName : ""
    this.form.idNumber = this.currentImproveObj.idNumber ? this.currentImproveObj.idNumber : ""
    this.form.sex = this.currentImproveObj.sex ? this.currentImproveObj.sex : ""
    this.form.birthday = this.currentImproveObj.birthday ? this.currentImproveObj.birthday : ""
  },
  methods: {
    timeConfirm(val) {
      this.form.birthday = val.year + "-" + val.month + "-" + val.day
    },
    openTime() {
      this.timeShow = true
    },
    perfectMedicalCardInfo() {
      let that = this
      this.$refs.uForm.validate(valid => {
        if (valid) {
          let obj = this.currentImproveObj
          obj = Object.assign(obj, this.form)
          perfectMedicalCardInfoApi(obj)
            .then(res => {
              if (res.code === RequestList.SUCCESS_CODE) {
                store.dispatch("GET_IMPROVE_LIST")
                that.$refs.uToast.show({
                  title: "完善成功",
                  type: "success"
                })
                uni.navigateBack({
                  delta: 1
                })
              } else {
                console.error(res)
              }
            })
            .catch(err => {
              console.error(err)
            })
        }
      })
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  box-sizing: border-box;
  width: 100%;
  .content-box {
    width: 100%;
    padding: 0 4%;
    box-sizing: border-box;
  }
  .list {
    padding: 0% 4% 4%;
    height: calc(85vh - 4vh);
    overflow: auto;
  }
  .bottom-btn {
    position: fixed;
    bottom: 3vh;
    left: 50%;
    transform: translateX(-50%);
    width: 92%;
    margin: 0 auto;
  }
}
.flex-box {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  .text {
    width: 100%;
  }
}
.birthday-text {
    width: 100%;
	color:#c0c4cc;
  }
</style>
