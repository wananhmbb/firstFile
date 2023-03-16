<template>
  <view class="formBox">
    <u-form
      :model="form"
      ref="uForm"
      label-width="200"
      :error-type="errorType"
      :border-bottom="false"
    >
      <view
        class="content marginTop10"
        v-for="(item, index) in moudleFormList"
        :key="index"
      >
        <view class="titleBox">
          <view class="title">{{ index }}</view>
          <view
            v-if="groupList[index].addBtnShow && enable == false"
            @click="addGroupList(index, true)"
            >添加
          </view>
        </view>
        <view class="originalBox">
          <view
            @click="deletNo()"
            class="addIcon"
            v-if="groupList[index].addBtnShow && enable == false"
            ><u-icon
              name="minus-circle"
              size="36"
              color="var(--text-color-grey)"
            ></u-icon
          ></view>
          <view class="originalForm">
            <view class="basicInfo" v-for="(i, cindex) in item" :key="cindex">
              <!-- 基本输入框 -->
              <u-form-item
                :border-bottom="false"
                :label="i.viewTitle"
                class="u-form-item"
                v-if="i.type == 'input' || i.type == 'input.number'"
                label-width="300"
                :prop="i.key"
                :required="i.required"
                ><u-input
                  :custom-style="customStyle"
                  v-model="form[i.key]"
                  v-if="
                    i.title == 'BMI' ||
                    i.title == '体脂率' ||
                    i.title == '每日热量消耗'
                      ? bimShow
                      : true
                  "
                  :focus="focus"
                  :type="i.type == 'input.number' ? 'digit' : 'text'"
                  :disabled="enable"
                  :placeholder="i.placeholder ? i.placeholder : ''"
                  :clearable="false"
                  @blur="calculation()"
              /></u-form-item>
              <!-- 文本框 -->
              <u-form-item
                :border-bottom="false"
                :label="i.title"
                class="u-form-item"
                v-if="i.type == 'textarea'"
                label-width="300"
                height="70"
                :prop="i.key"
                :required="i.required"
                :autoHeight="true"
                ><u-input
                  type="textarea"
                  :custom-style="customStyle"
                  v-model="form[i.key]"
                  :focus="focus"
                  :disabled="enable"
                  :placeholder="i.placeholder ? i.placeholder : ''"
                  :clearable="false"
              /></u-form-item>
              <!--单选择器 -->
              <u-form-item
                :border-bottom="false"
                label-width="300"
                :label="i.title"
                class="u-form-item"
                v-if="
                  i.type == 'radio' ||
                  i.type == 'select' ||
                  i.type == 'radio.ex'
                "
                :prop="i.key"
                :required="i.required"
              >
                <radioPick
                  :keyValue="index"
                  :infoObj="i"
                  :infoValue="form[i.key]"
                  :enable="enable"
                  @getRadioData="getRadioData"
                ></radioPick>
              </u-form-item>
              <!--多选择器 -->
              <u-form-item
                :border-bottom="false"
                label-width="300"
                :label="i.title"
                class="u-form-item"
                v-if="i.type == 'checkbox' || i.type == 'checkbox.ex'"
                :prop="i.key"
                :required="i.required"
              >
                <multipleChoices
                  :infoObj="i"
                  :infoValue="form[i.key]"
                  :enable="enable"
                  @getRadioData="getRadioData"
                ></multipleChoices>
              </u-form-item>

              <!-- 其他类型输入框 -->
              <view
                v-for="(otherItem, otherIndex) in checkboxForm[i.key]"
                :key="otherIndex"
              >
                <u-input
                  v-if="otherItem.show && !enable"
                  :custom-style="customStyle"
                  v-model="otherItem.value"
                  :disabled="enable"
                  :clearable="false"
                  :placeholder="'请输入' + i.title + '-' + otherItem.mark"
                />
              </view>
              <!-- 时间选择器 -->
              <u-form-item
                :border-bottom="false"
                label-width="300"
                :label="i.title"
                class="u-form-item"
                v-if="i.type == 'timePicker'"
                :prop="i.key"
                :required="i.required"
              >
                <timePick
                  :infoObj="i"
                  :enable="enable"
                  :infoValue="form[i.key]"
                  @getRadioData="getRadioData"
                ></timePick>
              </u-form-item>
              <!-- 上传图片 -->
              <u-form-item
                :border-bottom="false"
                :prop="i.key"
                v-if="i.type == 'imageUploader'"
                :required="i.required"
              >
                <uploadImg
                  :infoObj="i"
                  :enable="enable"
                  @getRadioData="getRadioData"
                  :infoValue="form[i.key]"
                ></uploadImg>
              </u-form-item>
              <view class="formModuleEndBorder"></view>
            </view>
          </view>
        </view>
        <view v-if="groupList[index]">
          <view
            class="basicInfo padding"
            v-for="(aitem, aindex) in groupList[index].list"
            :key="aindex"
          >
            <view v-if="aitem.show" class="addBox">
              <view
                @click="delet(index, aindex)"
                class="addIcon"
                v-if="enable == false"
                ><u-icon name="minus-circle" size="36" color="#FF9C00"></u-icon
              ></view>
              <view class="addForm">
                <view
                  class="formBd"
                  v-for="(demo, demoIndex) in aitem.demo"
                  :key="demoIndex"
                  ><u-form-item
                    :border-bottom="false"
                    :prop="demo.newId"
                    :label="demo.title"
                    label-width="300"
                    v-if="demo.type == 'input' || demo.type == 'input.number'"
                    ><u-input
                      :custom-style="customStyle"
                      v-model="demo.value"
                      :focus="focus"
                      :type="'text'"
                      :disabled="enable"
                      :clearable="false"
                  /></u-form-item>
                  <u-form-item
                    :border-bottom="false"
                    :prop="demo.newId"
                    label-width="300"
                    v-if="demo.type == 'checkbox' || demo.type == 'checkbox.ex'"
                    :label="demo.title"
                  >
                    <multipleChoices
                      :infoObj="demo"
                      :infoValue="demo.value"
                      :enable="enable"
                      :formId="aindex"
                      :keyValue="index"
                      @getRadioData="getRadioData"
                    ></multipleChoices>
                  </u-form-item>
                  <u-form-item
                    :border-bottom="false"
                    label-width="300"
                    :label="demo.title"
                    :prop="demo.newId"
                    v-if="demo.type == 'timePicker'"
                  >
                    <timePick
                      :infoObj="demo"
                      :enable="enable"
                      :infoValue="demo.value"
                      :formId="aindex"
                      :keyValue="index"
                      @getRadioData="getRadioData"
                    ></timePick>
                  </u-form-item>
                </view>
              </view>
            </view>
          </view>
        </view>
      </view>
    </u-form>
    <view class="form-css"></view>
    <view class="basicInfo padding1">
      <u-button
        type="primary"
        shape="circle"
        @click="goCreatFile"
        throttle-time="5000"
        v-if="enable == false"
        >保存</u-button
      >
    </view>
    <view class="edit" @click="edit" v-if="enable == true">
      <view><u-icon name="edit-pen" color="#ffffff"></u-icon></view>
      <view>编辑</view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import uploadImg from "@/components/form/components/uploadImg.vue"
import radioPick from "@/components/form/components/radioPick.vue"
import multipleChoices from "@/components/form/components/multipleChoices.vue"
import timePick from "@/components/form/components/timePick.vue"
import { writeFile } from "@/api/service"
import {
  BMI,
  RFM,
  EER,
  SexEnum,
  SexDict
} from "./js/health-record-calculation.js"
export default {
  props: {
    notice: {
      type: Object,
      default: null
    },
    enableValue: {
      type: Boolean,
      default: null
    },
    medicalId: {
      type: String,
      default: null
    }
  },
  components: {
    uploadImg,
    radioPick,
    timePick,
    multipleChoices
  },
  data() {
    return {
      bimShow: true,
      customStyle: {
        color: "var(--text-color-main)"
      },
      errorType: ["toast"],
      enable: null,
      moudleFormList: [],
      focus: false,
      rules: {},
      form: {},
      isRadioList: {}, //单选过滤显隐数据
      checkboxForm: {},
      groupList: {}
    }
  },
  options: { styleIsolation: "shared" },
  watch: {
    notice: {
      immediate: true,
      handler(val) {
        this.moudleFormList = val.formModuleInfoList.question
        this.servicePackageId = val.servicePackageId
        if (this.moudleFormList) {
          const radioList = {}
          const groupList = {}
          for (let key in this.moudleFormList) {
            radioList[key] = {}
            this.moudleFormList[key].forEach(item => {
              if (item.expand) {
                let expand = JSON.parse(item.expand)
                if (expand instanceof Array) {
                  expand.forEach(i => {
                    if (i.isGroupAdd) {
                      groupList[key] = {
                        demo: [],
                        list: [],
                        key: item.key,
                        mark: i.value,
                        addBtnShow: item.value === i.value,
                        groupShow: false
                      }
                      if (i.group) {
                        let demo = this.getResList(
                          this.moudleFormList[key],
                          i.group
                        )
                        groupList[key].demo = demo
                      }
                    }
                  })
                }
              }
              this.form[item.key] = item.value ? item.value : ""
              this.checkboxForm[item.key] = []
              if (item.type === "checkbox.ex") {
                const expand = JSON.parse(item.expand)
                expand.forEach(el => {
                  if (el.otherInputShow) {
                    const show = item.value
                      ? item.value.includes(el.value)
                      : false
                    this.checkboxForm[item.key].push({
                      mark: el.value,
                      value: "",
                      show: show
                    })
                  }
                })
              }
              if (item.type === "radio.ex") {
                radioList[key][item.key] = {}
                let expand = JSON.parse(item.expand)
                expand.forEach(i => {
                  radioList[key][item.key][i.value] = []
                  let linkId = i.linkId || []
                  linkId = [...new Set([...linkId, ...[Number(item.key)]])]
                  if (linkId) {
                    radioList[key][item.key][i.value] = this.getResList(
                      this.moudleFormList[key],
                      linkId
                    )
                  }
                })
                if (radioList[key].origin) {
                  const origin = radioList[key].origin
                  if (origin.value) {
                    if (item.value) {
                      radioList[key].origin = {
                        value: item.value,
                        key: item.key,
                        qs: radioList[key][item.key][item.value]
                      }
                    } else {
                      radioList[key].origin.qs =
                        radioList[key][origin.key][origin.value]
                    }
                  }
                } else {
                  const MarkArr = radioList[key][item.key]
                  const qs = item.value ? MarkArr[item.value] : [item]
                  radioList[key].origin = {
                    value: item.value,
                    key: item.key,
                    qs: qs
                  }
                }
              }
            })
          }
          this.isRadioList = radioList
          this.groupList = groupList
          this.getfromData()
          console.log(this.isRadioList, "组装好的数据！！！！！！", groupList)
        }
      }
    },
    enableValue: {
      deep: true,
      handler(val) {
        this.enable = val
      }
    }
  },
  methods: {
    getResList(arr, idList) {
      const resList = []
      arr.forEach(el => {
        let mark = idList.indexOf(Number(el.key)) > -1
        if (mark) {
          const item = JSON.parse(JSON.stringify(el))
          item.show = true
          resList.push(item)
        }
      })
      return resList
    },
    // 组装特殊表单数据
    getfromData() {
      // 回填单选框数据
      for (let key in this.isRadioList) {
        if (!this.isRadioList[key].origin) {
          delete this.isRadioList[key]
        } else {
          const origin = this.isRadioList[key].origin
          this.moudleFormList[key] = origin.qs
        }
      }
      // 回填增加组数据
      for (let key in this.groupList) {
        this.groupList[key].list = []

        this.groupList[key].demo.forEach((de, deindex) => {
          let value = de.value
          if (value) {
            let valArr = JSON.parse(value)
            this.form[de.key] = valArr[0] ? valArr[0] : ""
            valArr.forEach((val, index) => {
              if (index !== 0) {
                if (deindex === 0) {
                  const demo = JSON.parse(
                    JSON.stringify(this.groupList[key].demo)
                  )
                  this.groupList[key].list.push({
                    demo,
                    show: true
                  })
                }
                this.groupList[key].list[index - 1].demo.forEach(listDe => {
                  if (listDe.key == de.key) {
                    listDe.value = val
                  }
                })
              }
            })
          }
        })
      }
    },
    delet(key, index) {
      this.groupList[key].list.splice(index, 1)
    },
    deletNo() {
      this.$refs.uToast.show({
        title: "不可删除",
        type: "primary"
      })
    },
    // 重构增加数组
    addGroupList(key, need) {
      const demo = JSON.parse(JSON.stringify(this.groupList[key].demo))
      demo.forEach(item => (item.value = ""))
      const json = JSON.stringify(this.groupList[key].list)
      if (json.includes(`"value":""`)) {
        this.$refs.uToast.show({
          title: "请不要重复添加",
          type: "default"
        })
      } else {
        this.groupList[key].list.push({
          show: true,
          demo
        })
      }
    },
    edit() {
      this.enable = false
      // 多选增减输入框
      for (let key in this.checkboxForm) {
        if (this.checkboxForm[key].length > 0) {
          let checkArr = this.form[key].split(",")
          this.checkboxForm[key].forEach(check => {
            checkArr.forEach(arrItem => {
              const mark = arrItem.includes(check.mark)
              if (mark) {
                let markArr = arrItem.split("-")
                check.value = markArr[1]
                this.form[key] = this.form[key].replace(arrItem, check.mark)
              }
            })
          })
        }
      }
      this.$forceUpdate()
    },
    // 获取校验规则数组
    getRule() {
      for (let key in this.moudleFormList) {
        this.moudleFormList[key].forEach(item => {
          this.rules[item.key] = [
            {
              required: item.required,
              message: item.title + "不能为空",
              trigger: ["blur", "change"]
            }
          ]
        })
      }
      this.$refs.uForm.setRules(this.rules)
    },
    //填写个人档案
    goCreatFile() {
      let arr = []
      let mark = true
      // 校验新增组数据
      for (let key in this.groupList) {
        for (let i = 0; i < this.groupList[key].list.length; i++) {
          if (!mark) break
          const item = this.groupList[key].list[i]
          for (let j = 0; j < item.demo.length; j++) {
            const demo = item.demo[j]
            if (!demo.value) {
              this.$refs.uToast.show({
                title: "请填写" + demo.title,
                type: "default"
              })
              mark = false
              break
            }
          }
        }
      }
      if (!mark) return
      this.getRule()
      for (let key in this.form) {
        this.$refs.uForm.model[key] = this.form[key]
      }

      this.$refs.uForm.validate(valid => {
        if (valid) {
          for (let key in this.checkboxForm) {
            if (this.checkboxForm[key].length > 0) {
              this.checkboxForm[key].forEach(i => {
                i.value = `${i.mark}-${i.value}`
                this.form[key] = this.form[key].replace(i.mark, i.value)
              })
            }
          }
          for (let key in this.groupList) {
            this.groupList[key].demo.forEach(item => {
              this.form[item.key] = JSON.stringify(
                this.form[item.key] ? [this.form[item.key]] : [""]
              )
            })
            this.groupList[key].list.forEach(item => {
              const json = JSON.stringify(item)
              if (!json.includes(`"value":""`)) {
                item.demo.forEach(demo => {
                  this.form[demo.key] = JSON.parse(this.form[demo.key])
                  this.form[demo.key].push(demo.value)
                  this.form[demo.key] = JSON.stringify(this.form[demo.key])
                })
              }
            })
          }
          for (let key in this.moudleFormList) {
            this.moudleFormList[key].forEach(item => {
              arr.push({
                questionName: item.title,
                questionValue: this.form[item.key],
                moduleKey: item.moduleKey,
                sort: item.sort,
                questionKey: item.key
              })
            })
          }
          writeFile(this.servicePackageId, this.medicalId, arr)
            .then(res => {
              if (res.code == 200) {
                this.$refs.uToast.show({
                  title: res.msg,
                  type: "success"
                })
                setTimeout(() => {
                  uni.switchTab({ url: "/pages/tabbar/service/index" })
                }, 2000)
              } else {
                this.$refs.uToast.show({
                  title: res.msg,
                  type: "error"
                })
              }
            })
            .catch(err => {})
          console.log("验证通过")
        } else {
          console.log("验证失败")
        }
      })
    },
    //获取子组件传来的值
    getRadioData(radioValue, moudleId, formId, keyValue, type) {
      console.log(
        radioValue,
        moudleId,
        formId,
        keyValue,
        "radioValue, moudleId, formId, keyValue"
      )
      if (formId !== null && formId !== undefined) {
        this.groupList[keyValue].list[formId].demo.forEach(item => {
          if (item.key == moudleId) {
            item.value = radioValue
          }
        })
      } else {
        this.checkboxForm[moudleId].forEach(item => {
          if (item?.mark) {
            item.show = radioValue.includes(item.mark)
          }
        })
        moudleId ? (this.form[moudleId] = radioValue) : ""
        if (type === "radio.ex") {
          let orginList = this.isRadioList[keyValue][moudleId][radioValue]
          let qsIdLen = this.isRadioList[keyValue][moudleId][radioValue].length
          this.isRadioList[keyValue][moudleId][radioValue].forEach(item => {
            if (item.key == moudleId) {
              const expand = JSON.parse(item.expand)
              expand.forEach(expandItem => {
                if (expandItem.value == radioValue) {
                  const linkIdList = expandItem.linkId ?? []
                  linkIdList.forEach(linkId => {
                    const chaildList = this.isRadioList[keyValue][linkId]
                    if (chaildList) {
                      const nowList = chaildList[this.form[linkId]] ?? []
                      const nowLen = nowList.length
                      orginList = qsIdLen < nowLen ? nowList : orginList
                    }
                  })
                }
              })
            }
          })
          this.moudleFormList[keyValue] = orginList
          if (this.groupList[keyValue]?.key === moudleId) {
            this.groupList[keyValue].list = []
          }
        }
        if (this.groupList[keyValue]?.key === moudleId) {
          const mark = this.groupList[keyValue].mark
          this.groupList[keyValue].addBtnShow = mark === radioValue
        }
      }
      this.calculation()
      this.$forceUpdate()
    },
    calculation() {
      let wt = ""
      let ht = ""
      let sex = ""
      let waist = ""
      let age = ""
      let physicalActivityLevel = ""
      for (let key in this.moudleFormList) {
        this.moudleFormList[key].forEach(item => {
          if (item.title === "性别" && this.form[item.key]) {
            if (this.form[item.key] === SexDict[SexEnum.MAN]) {
              sex = SexEnum.MAN
            } else {
              sex = SexEnum.WOMAN
            }
          }
          if (item.title === "年龄" && this.form[item.key]) {
            age = this.form[item.key]
          }
          if (item.title === "身高" && this.form[item.key]) {
            ht = this.form[item.key]
          }
          if (item.title === "体重" && this.form[item.key]) {
            wt = this.form[item.key]
          }
          if (item.title === "腰围" && this.form[item.key]) {
            waist = this.form[item.key]
          }
          if (item.title === "每日运动强度" && this.form[item.key]) {
            physicalActivityLevel = this.form[item.key]
          }
          if (item.title === "BMI" && !this.form[item.key]) {
            if (ht && wt) {
              this.form[item.key] = BMI(ht, wt)
              new Promise(resolve => {
                this.bimShow = false
                let res = BMI(ht, wt)
                if (res) resolve(res)
              }).then(res => {
                this.form[item.key] = res
                this.bimShow = true
              })
            } else {
              this.form[item.key] = ""
            }
          }

          if (item.title === "体脂率" && !this.form[item.key]) {
            if (ht && waist && sex) {
              this.form[item.key] = RFM(ht, waist, sex)
              new Promise(resolve => {
                this.bimShow = false
                let res = RFM(ht, waist, sex)
                if (res) resolve(res)
              }).then(res => {
                this.form[item.key] = res
                this.bimShow = true
              })
            } else {
              this.form[item.key] = ""
            }
          }

          if (item.title === "每日热量消耗" && !this.form[item.key]) {
            // ht = this.form[61]
            // wt = this.form[62]
            if (age && wt && ht && physicalActivityLevel && sex) {
              this.form[item.key] = EER(age, wt, ht, physicalActivityLevel, sex)
              new Promise(resolve => {
                this.bimShow = false
                let res = EER(age, wt, ht, physicalActivityLevel, sex)
                if (res) resolve(res)
              }).then(res => {
                this.form[item.key] = res
                this.bimShow = true
              })
            } else {
              this.form[item.key] = ""
            }
          }
        })
      }
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="scss" scoped>
// .formBd {
//   border-bottom: 1px solid var(--bd-color-main);
// }
.originalBox {
  width: 90%;
  margin: auto;
  display: flex;
}
.originalForm {
  width: 100%;
}
.addBox {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--bd-color-main);
}
.addIcon {
  padding-top: 18px;
  padding-right: 10px;
}
.addForm {
  width: 100%;
}
.basicInfo,
.content {
  background: var(--bg-color-main);
}
.titleBox {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  color: var(--theme-color-dark-blue);
  font-size: 32rpx;
}
.title {
  line-height: 50px;
  font-size: 18px;
  font-weight: 600;
  color: var(--text-color-main);
}
.marginTop10 {
  margin-top: 10px;
}
.padding {
  padding: 0 5%;
}
.padding1 {
  padding: 10px 5%;
  position: fixed;
  bottom: 0;
  width: 100%;
  z-index: 10;
}
.edit {
  position: fixed;
  right: 10px;
  bottom: 30px;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  background: var(--theme-color-linear);
  box-shadow: 0px 4px 6px 0px rgba(70, 137, 218, 0.24);
  color: var(--text-color-white);
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  z-index: 100;
}
/deep/.u-form-item--left__content__label {
  color: var(--text-color-main) !important;
}
/deep/.u-form-item--right__content {
  color: var(--text-color-main) !important;
}
.form-css {
  width: 100%;
  height: 60px;
  background: var(--bg-color-main);
}
/deep/ .u-input__textarea {
  min-height: 20px !important;
}
.formBox {
  background: var(--bd-color-main);
}
.formModuleEndBorder {
  width: 100%;
  margin: auto;
  height: 1px;
  background: var(--bd-color-main);
}
</style>
