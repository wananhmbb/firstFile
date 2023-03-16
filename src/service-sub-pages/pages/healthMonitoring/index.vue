<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <view v-if="empty" class="no-data">
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
      <view class="content">
        <view
          class="healthMonitoringDataBox"
          v-for="(item, indicatorName) in groupIndicatorMap"
          :key="indicatorName"
        >
          <view class="card">
            <view class="data">
              <image :src="item.icon"></image>
              <text>{{ indicatorName }}</text>
            </view>
            <view
              :class="[item.indicatorDisplayValue ? 'new-record' : 'record']"
              v-if="item.indicatorDisplayValue"
            >
              <text>{{ item.indicatorDisplayValue }}</text>
              <text>{{ item.unit }}</text>
            </view>
            <view class="record" v-else>
              <text class="nodata">今日无记录</text>
            </view>
          </view>
          <view class="btnBox">
            <view class="btn" @click="groupIndicatorDetails(indicatorName)"
              >查看详情</view
            >
            <view class="btn1" @click="recordGroup(indicatorName)">记录</view>
          </view>
        </view>
      </view>
      <!-- 记录填写 -->
      <u-modal
        v-model="recordShow"
        :show-title="false"
        :show-confirm-button="false"
        :border-radius="30"
        class="model-box"
      >
        <view class="head">
          <view class="title">{{ recordModalTitle }}</view>
          <u-icon
            name="close"
            class="close-css"
            @click="closeModal()"
            color="var(--text-color-main)"
          ></u-icon>
        </view>
        <view class="formitem">
          <u-form
            v-for="(form, index) in indicatorRecordList"
            :model="form"
            ref="uForm"
            :key="index"
          >
            <u-form-item prop="recordData" :border-bottom="false">
              <view class="line">
                <u-input
                  :clearable="false"
                  v-model="form.recordData"
                  :placeholder="'请输入你的' + form.title + '数据'"
                  type="digit"
                  @input="blur(form)"
                />
                <view class="recordUnit">{{ recordUnit }}</view>
              </view>
              <view v-if="form.indicatorId === '4'" class="rulesText">
                <text>{{ textContent1 }}</text>
              </view>
              <view v-if="form.indicatorId !== '4'" class="rulesText">
                <text>
                  {{ textContent }}
                </text>
              </view>
            </u-form-item>
          </u-form>
        </view>
        <view class="button">
          <u-button
            type="primary"
            shape="circle"
            @click="confirmSubmitIndicatorListRecord"
            throttle-time="1000"
          >
            确认
          </u-button>
        </view>
      </u-modal>
      <u-toast ref="uToast"></u-toast>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import { todayMonitorInfoId, fillHealthMonitorInfo } from "@/api/service"
export default {
  data() {
    return {
      indicatorRecordList: [{ recordData: "" }],
      form: {
        recordData: ""
      },
      rules: {
        recordData: [
          // {
          //   required: true,
          //   message: "请输入数据",
          //   // 可以单个或者同时写两个触发验证方式
          //   trigger: ["change", "blur"]
          // },
          // {
          //   type: "number",
          //   message: "请输入数字",
          //   // 可以单个或者同时写两个触发验证方式
          //   trigger: ["change", "blur"]
          // }
        ]
      },
      type: "number",
      recordShow: false,
      border: false,
      //弹窗
      recordModalTitle: "",
      indicatorId: null,
      recordUnit: "",
      healthMonitoringList: [],
      servicePackageUserId: null, //服务包id
      medicalCardId: null,
      title: "",
      loading: true,
      empty: false,
      errorType: ["toast"],
      // 分组了的
      groupIndicatorMap: {},
      textContent: "",
      textContent1: ""
    }
  },
  onLoad() {
    this.title = this.$Route.query.headTitle
    this.servicePackageUserId = this.$Route.query.servicePackageId
    this.medicalCardId = this.$Route.query.medicalCardId
    this.todayMonitorInfo(this.servicePackageUserId, this.medicalCardId)
  },
  methods: {
    //关闭弹窗
    closeModal() {
      this.textContent = ""
      this.textContent1 = ""
      this.recordShow = false
    },
    //查询需要填写的检测信息
    todayMonitorInfo(servicePackageUserId, medicalCardId) {
      todayMonitorInfoId(servicePackageUserId, medicalCardId)
        .then(res => {
          this.loading = false
          if (res.code === 200) {
            this.healthMonitoringList = res.data
            this.groupIndicatorsByName(res.data)
          }
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          this.empty = true
        })
    },
    /**
     * 查看指标详情
     * @param groupName
     */
    groupIndicatorDetails(groupName) {
      const indicatorList = []
      this.groupIndicatorMap[groupName].list.forEach(item => {
        indicatorList.push(item.indicatorId)
      })
      this.$Router.push({
        name: "healthMonitoringDetails",
        params: {
          servicePackageUserId: this.servicePackageUserId,
          indicatorIds: indicatorList.join(","),
          title: groupName,
          medicalCardId: this.medicalCardId
        }
      })
    },
    /**
     * 开始记录一组指标
     * @param groupName 指标分组名
     */
    recordGroup(groupName) {
      const tmp = []
      this.recordModalTitle = groupName
      this.groupIndicatorMap[groupName].list.forEach(item => {
        tmp.push({
          recordData: "",
          title: item.indicatorName,
          indicatorId: item.indicatorId,
          thresholdValueExpression: item.thresholdValueExpression
        })
        this.indicatorRecordList = tmp
      })
      this.recordUnit = this.groupIndicatorMap[groupName].unit
      this.recordShow = true
      this.$nextTick(() => {
        this.$refs.uForm.forEach(item => {
          item.setRules(this.rules)
          item.resetFields(this.rules)
        })
      })
    },

    confirmSubmitIndicatorListRecord() {
      const all = []
      this.$refs.uForm.forEach(item => {
        all.push(
          new Promise(resolve => {
            item.validate(valid => {
              resolve(valid)
            })
          })
        )
      })

      Promise.all(all).then(resultList => {
        let isOk = true
        resultList.forEach(b => {
          isOk = isOk && b
        })
        console.log(this.textContent, this.textContent1)
        if (isOk && this.textContent === "" && this.textContent1 === "") {
          this.submitIndicatorListRecord()
        }
      })
    },
    /**
     * 确认提交记录的指标值
     */
    submitIndicatorListRecord() {
      const data = []
      this.indicatorRecordList.forEach(item => {
        data.push({
          indicatorId: item.indicatorId,
          medicalCardId: this.medicalCardId,
          servicePackageUserId: this.servicePackageUserId,
          value: item.recordData
        })
      })
      fillHealthMonitorInfo(data).then(res => {
        if (res.code === 200) {
          this.form = []
          setTimeout(() => {
            this.$refs.uToast.show({
              title: "记录成功",
              type: "success"
            })
          }, 500)

          this.todayMonitorInfo(this.servicePackageUserId, this.medicalCardId)
          this.recordShow = false
        } else if (res.code === 201) {
          this.form = []
          setTimeout(() => {
            this.$refs.uToast.show({
              title: res.data.join(";"),
              type: "warning"
            })
          }, 500)

          this.todayMonitorInfo(this.servicePackageUserId, this.medicalCardId)
          this.recordShow = false
        } else {
          this.$refs.uToast.show({
            title: "填写数据不正确",
            icon: false,
            type: "error"
          })
        }
      })
    },
    record(indicatorId, name, unit) {
      this.recordModalTitle = name
      this.recordUnit = unit
      this.indicatorId = indicatorId
      this.recordShow = true
    },
    /**
     * 按照指标的名称，分组指标
     * @param allIndicatorList
     */
    groupIndicatorsByName(allIndicatorList) {
      const rawAllList = []
      allIndicatorList.forEach(item => {
        const groupKey = item.indicator.name.split("-")
        if (groupKey.length > 1) {
          item.name = groupKey[1]
        } else {
          item.name = groupKey[0]
        }
        item.groupName = groupKey[0]
        rawAllList.push(item)
      })
      const indicatorMap = {}
      rawAllList.forEach(item => {
        const newItem = {
          indicatorId: item.indicator.id,
          indicatorName: item.name,
          record: item.record,
          thresholdValueExpression: JSON.parse(
            item.indicator.thresholdValueExpression
          )
        }
        if (indicatorMap[item.groupName]) {
          indicatorMap[item.groupName].list.push(newItem)
        } else {
          indicatorMap[item.groupName] = {
            icon: item.indicator.icon,
            unit: item.indicator.unit,
            list: [newItem]
          }
        }
      })

      for (const indicatorMapKey in indicatorMap) {
        const valueList = []
        indicatorMap[indicatorMapKey].list.forEach(item => {
          if (item.record && item.record.value) {
            valueList.push(item.record.value)
          }
        })
        if (valueList.length > 0) {
          indicatorMap[indicatorMapKey].indicatorDisplayValue =
            valueList.join("/")
        } else {
          indicatorMap[indicatorMapKey].indicatorDisplayValue = null
        }
      }
      this.groupIndicatorMap = indicatorMap
    },
    blur(item) {
      let valueRange = item.thresholdValueExpression.filter(
        i => i.type === "legitimate"
      )
      let minVaule = valueRange[0].expression.compareNodes.filter(
        i => i.term === ">"
      )[0].value
      let maxVaule = valueRange[0].expression.compareNodes.filter(
        i => i.term === "<"
      )[0].value
      let recordData = Number(item.recordData)
      if (item.indicatorId === "4") {
        if (recordData < minVaule) {
          // this.textContent1 = "小于最小合法值:" + minVaule
          this.textContent1 = "请输入正确的" + item.title
        } else if (recordData > maxVaule) {
          // this.textContent1 = "大于最大合法值:" + maxVaule
          this.textContent1 = "请输入正确的" + item.title
        } else if (recordData === 0) {
          this.textContent1 = item.title + "不能为空"
        } else {
          this.textContent1 = ""
        }
      } else {
        if (recordData < minVaule) {
          // this.textContent = "小于最小合法值:" + minVaule
          this.textContent = "请输入正确的" + item.title
        } else if (recordData > maxVaule) {
          // this.textContent = "大于最大合法值:" + maxVaule
          this.textContent = "请输入正确的" + item.title
        } else if (recordData === "") {
          this.textContent = item.title + "不能为空"
        } else {
          this.textContent = ""
        }
      }
    }
  }
}
</script>
<style lang="scss" scoped>
/deep/.u-cell {
  margin-bottom: 10px !important;
  border-radius: 10px;
}
/deep/ .u-mode-center-box {
  background-color: var(--bg-color-second) !important;
}
.model-box {
  /deep/.u-model {
    border-radius: 30rpx;
    overflow: hidden;
    background: var(--bg-color-second) !important;
  }
  .head {
    width: 100%;
    display: flex;
    .title {
      padding: 15px 0;
      margin: auto;
      font-size: 32rpx;
      font-weight: bolder;
      color: var(--text-color-main);
    }
    .close-css {
      padding: 5px;
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
}

.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
}
.no-data {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70vh;
}
.recordUnit {
  color: var(--text-color-main);
  margin-left: 10rpx;
}
.content {
  width: 90%;
  margin: auto;
}
.healthMonitoringDataBox {
  width: 100%;
  height: 96px;
  background: var(--bg-color-main);
  border-radius: 5px;
  margin-top: 15px;
}
.card {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: space-between;
  padding: 10px 0;
  image {
    width: 23px;
    height: 22px;
    vertical-align: middle;
    margin-right: 8px;
  }
  text {
    font-weight: 600;
  }
  .data {
    text {
      color: var(--text-color-main);
    }
  }
}
.new-record {
  color: var(--text-color-main);
}
.record {
  text:first-child {
    font-weight: 600;
  }
  text:nth-child(2) {
    font-size: 12px;
    // vertical-align: sub;
  }
  .nodata {
    font-size: 12px;
    color: var(--text-color-grey);
  }
}
.btnBox {
  width: 90%;
  margin: auto;
  display: flex;
  justify-content: flex-end;
}
.btn {
  width: 96px;
  line-height: 32px;
  border-radius: 24px;
  border: 1px solid var(--text-color-grey);
  color: var(--text-color-grey);
  text-align: center;
  margin-right: 10px;
}
.btn1 {
  width: 71px;
  line-height: 32px;
  border-radius: 24px;
  background: var(--bg-color-blue);
  color: var(--theme-color-dark-blue);
  text-align: center;
}
.formitem {
  width: 80%;
  min-height: 150px;
  margin: auto;
  padding: 30px 0;
  /deep/ .u-form-item__message {
    padding: 0 !important;
  }
  /deep/ .u-input__input {
    color: var(--text-color-main);
  }

  .line {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid var(--bd-color-main);
  }
}
.rulesText {
  color: red;
  text {
    margin: 15px 0 0 0;
  }
}
.button {
  width: 80%;
  padding: 20px;
  margin: auto;
}
.loading-box {
  width: 100vw;
  height: 90vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
}
</style>
