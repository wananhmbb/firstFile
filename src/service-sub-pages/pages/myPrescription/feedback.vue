<template>
  <theme>
    <view class="all" slot="theme">
      <house-header
        headTypeTwo="打卡"
        :backStep="twoInputShow == 'true' ? 2 : 1"
      ></house-header>
      <view class="content">
        <view class="box">
          <uni-calendar
            ref="calendar"
            class="uni-calendar--hook"
            :endDate="today"
            :selected="info.selected"
            :showMonth="false"
            :date="originDay"
            @change="change"
            @monthSwitch="monthSwitch"
          />
        </view>
        <view class="tabs">
          <u-tabs
            v-if="tabListOnlyOne === 'true'"
            :list="TabList"
            :is-scroll="false"
            :current="tabListOnlyCurrent"
            active-color="var(--text-color-main)"
            inactive-color="#9699a6"
            bg-color="var(--bg-color-main)"
          >
          </u-tabs>
          <u-tabs
            v-if="tabListOnlyOne === 'false'"
            :list="TabList"
            :is-scroll="false"
            :current="current"
            @change="tabOnChanged"
            active-color="var(--text-color-main)"
            inactive-color="#9699a6"
            bg-color="var(--bg-color-main)"
          >
          </u-tabs>
        </view>
        <view class="box" v-if="current === 0">
          <u-form
            :model="form"
            ref="uForm"
            :error-type="errorType"
            label-width="200"
          >
            <u-form-item
              label="运动时长(分钟)"
              label-width="300"
              :border-bottom="false"
              class="formBox"
              v-if="twoInputShow == 'true'"
              label-position="top"
              :required="true"
              prop="sportTime"
              ref="invoice_title"
            >
              <u-input
                v-model="form.sportTime"
                :border="border"
                placeholder=" "
                :disabled="!btnShow"
                type="number"
                :clearable="false"
              />
            </u-form-item>
            <u-form-item
              label="是否有不适感"
              label-width="300"
              :border-bottom="false"
              class="formBox"
              v-if="twoInputShow == 'true'"
              label-position="top"
            >
              <u-input
                v-model="form.comfortableValue"
                :border="border"
                placeholder=" "
                :disabled="true"
                @click="choose"
                :clearable="false"
              />
            </u-form-item>
            <u-form-item
              label="反馈"
              label-width="300"
              :border-bottom="false"
              label-position="top"
            >
              <u-input
                v-model="form.inputValue"
                :type="type"
                :border="border"
                placeholder="请输入反馈"
                :disabled="!btnShow"
                :clearable="false"
              />
            </u-form-item>
          </u-form>
          <l-picker
            mode="selector"
            v-model="pickerShow"
            @confirm="confirm"
            :range="radiolist"
          ></l-picker>
        </view>
        <view v-if="current === 1 || tabListOnlyCurrent === 0">
          <view
            class="recordBox"
            v-for="(item, index) in feedInfoList"
            :key="index"
          >
            <view class="time">{{ item.createTime }}</view>
            <view class="fontBox">
              <view class="font3" v-if="item.recordType === 3">跳过了</view>
              <view class="font1" v-if="item.recordType === 1">完成了</view>
              <view class="font4" v-if="item.recordType === 4">未完成</view>
              <view class="font2" v-if="item.recordType === 2">反馈了</view>
              <view class="contentbox">{{
                item.content.feedbackContent.feel
              }}</view>
            </view>
            <view
              class="fontBox"
              v-if="
                item.recordType === 1 && item.content.feedbackContent.badSymptom
              "
              ><view class="font2"> 反馈了</view>
              <view class="contentbox">{{
                item.content.feedbackContent.badSymptom
              }}</view></view
            >
          </view>
          <view
            class="no-data"
            v-if="
              (current === 1 || tabListOnlyCurrent === 0) &&
              feedInfoList.length === 0
            "
          >
            <x-icon iconName="service-no-data icon-font"></x-icon>
          </view>
        </view>
      </view>
      <view class="form-css"></view>
      <view class="btnBox" v-if="btnShow && current === 0">
        <u-button
          type="primary"
          shape="circle"
          throttle-time="3000"
          @click="submit"
          >打卡并提交</u-button
        >
      </view>
      <u-toast ref="uToast" />
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
import LPicker from "@/components/basic-components/l-picker/l-picker"
import { feedback, getFeedbackInfo } from "@/api/service"
export default {
  components: {
    LPicker
  },
  data() {
    return {
      tabListOnlyOne: "false",
      TabList: [],
      current: null,
      tabListOnlyCurrent: null,
      twoInputShow: null,
      radiolist: ["有不适感", "无不适感"],
      pickerShow: false,
      errorType: ["toast"],
      originDay: "",
      loading: true,
      nowMonth: "",
      form: {
        inputValue: "",
        comfortableValue: "",
        sportTime: ""
      },
      type: "textarea",
      border: false,
      prescribeId: "",
      prescribeName: "",
      servicePackageId: "",
      askDate: "",
      btnShow: false,
      info: {
        selected: []
      },
      today: "",
      nowDate: "",
      arr: [
        // {
        //   content: {
        //     feedbackContent: { feel: "sdiohd ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-05-17"
        // },
        // {
        //   content: {
        //     feedbackContent: { feel: "nihap ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-05-16"
        // },
        // {
        //   content: {
        //     feedbackContent: { feel: "说怒吼都 ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-09-17"
        // },
        // {
        //   content: {
        //     feedbackContent: { feel: "哦你好大 ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-09-20"
        // },
        // {
        //   content: {
        //     feedbackContent: { feel: "哦你好大123 ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-09-20"
        // },
        // {
        //   content: {
        //     feedbackContent: { feel: "哦你好大123 ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-08-20"
        // },
        // {
        //   content: {
        //     feedbackContent: { feel: "哦你好大123 ", badSymptom: "莫得啥" }
        //   },
        //   recordDate: "2022-08-01"
        // }
      ],
      viewingDuration: "", //运动视频播放时长
      stagesName: "", //阶段名称
      recordType: null, //打卡状态类型
      feedInfoList: [] //当月所有反馈的数据
    }
  },
  onLoad() {
    var today = new Date()
    let nowDate = today.getDate()
    if (nowDate < 10) {
      this.nowDate = "0" + nowDate
    } else {
      this.nowDate = nowDate
    }
    let nowM = today.getMonth() + 1
    if (nowM < 10) {
      nowM = "0" + nowM
    }
    this.nowMonth = today.getFullYear() + "-" + nowM
    //今天的时间
    this.today = today.toISOString().slice(0, 10)
    this.askDate = this.today.slice(0, 7)
    this.prescribeId = this.$Route.query.prescribeId
    this.prescribeName = this.$Route.query.prescribeName
    this.viewingDuration = this.$Route.query.viewingDuration
    this.recordType = this.$Route.query.recordType
    this.stagesName = this.$Route.query.stagesName
    this.servicePackageId = this.$Route.query.servicePackageUserId
    this.twoInputShow = this.$Route.query.twoInputShow
    this.tabListOnlyOne = this.$Route.query.tabListOnlyOne
    //当前选中的时间
    this.originDay = this.askDate + "-" + this.nowDate
    this.getInfo(this.today)
    //如果有运动时长,运动时长回显
    if (this.viewingDuration) {
      this.$set(
        this.form,
        "sportTime",
        Math.ceil(Number(this.viewingDuration) / 60)
      )
    }
    if (this.tabListOnlyOne === "true") {
      this.tabListOnlyCurrent = 0
      this.TabList = [
        {
          name: "记录"
        }
      ]
    } else {
      this.current = 0
      this.TabList = [
        {
          name: "打卡"
        },
        {
          name: "记录"
        }
      ]
    }
  },
  methods: {
    //切换tabs
    tabOnChanged(index) {
      this.current = index
    },
    //获取当月所有打卡数据
    getInfo(data) {
      getFeedbackInfo(this.prescribeId, this.askDate)
        .then(res => {
          this.loading = true
          if (res.code == 200) {
            this.loading = false
            this.arr = res.data
            let feedbackList = []
            if (this.today == this.originDay) {
              // this.btnShow = !this.arr.some(i => i.recordDate == this.today)
              this.btnShow = true
            } else this.btnShow = false
            this.arr.forEach(item => {
              feedbackList.push({
                date: item.recordDate,
                info: "已打卡"
              })
            })
            this.info.selected = feedbackList
            this.feedInfoList = this.arr.filter(i => i.recordDate === data)
          }
        })
        .catch(err => {
          this.loading = false
          console.log("反馈信息回显错误")
        })
    },
    //打卡验证
    submit() {
      console.log(this.twoInputShow, "this.twoInputShow")
      if (this.twoInputShow === "true") {
        if (this.form.sportTime) {
          this.clockIn()
        } else {
          this.$refs.uToast.show({
            title: "运动时长不能为空",
            type: "error",
            icon: false
          })
        }
      } else {
        this.clockIn()
      }
    },
    //打卡接口方法
    clockIn() {
      this.feel = ""
      if (this.recordType == 1) {
        this.feel =
          '"' +
          this.stagesName +
          '"' +
          "的训练,共计" +
          this.form.sportTime +
          "分钟," +
          this.form.comfortableValue
        this.badSymptom = this.form.inputValue
      }
      if (this.recordType == 2) {
        this.feel =
          '"' + this.stagesName + '"' + "反馈了" + this.form.inputValue
      }
      let obj = {
        prescribeId: this.prescribeId,
        recordType: Number(this.recordType),
        content: {
          value: this.form.sportTime,
          feedbackContent: {
            feel: this.feel,
            badSymptom: this.badSymptom
          }
        }
      }
      feedback(obj).then(res => {
        if (res.code === 200) {
          this.$refs.uToast.show({
            title: res.msg,
            type: "success"
          })
          if (this.twoInputShow == "true") {
            setTimeout(() => {
              uni.navigateBack({
                delta: 2
              })
            }, 1000)
          } else {
            setTimeout(() => {
              uni.navigateBack({
                delta: 1
              })
            }, 1000)
          }
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: "error"
          })
        }
      })
    },
    change(e) {
      // console.log("change 返回:", e, this.arr)
      if (this.today === e.fulldate) {
        this.btnShow = true
      } else this.btnShow = false
      this.feedInfoList = this.arr.filter(i => i.recordDate === e.fulldate)
    },
    monthSwitch(e) {
      let month = e.month < 10 ? "0" + e.month : e.month
      this.askDate = e.year + "-" + month
      this.originDay = this.askDate + "-" + "01"
      this.getInfo(this.originDay)
    },
    choose() {
      wx.hideKeyboard()
      if (this.btnShow) {
        this.pickerShow = true
      }
    },
    confirm(e) {
      this.form.comfortableValue = this.radiolist[e]
    }
  }
}
</script>
<style lang="scss">
.uni-calendar--hook {
  /deep/.uni-calendar-item__weeks-box-circle {
    background-color: #00c297 !important;
  }
  /deep/.uni-calendar-item--isDay {
    color: #fff !important;
  }
  /deep/.uni-calendar-item__weeks-box {
    border-radius: 6px !important;
  }
  /deep/.uni-calendar-item--extra {
    color: #00c297 !important;
  }
  /deep/.uni-calendar__header-text {
    color: var(--text-color-main) !important;
  }
  /deep/.uni-calendar__content {
    background: var(--bg-color-main) !important;
    color: var(--text-color-main) !important;
  }
  /deep/.uni-calendar-item__weeks-box-text {
    color: var(--text-color-main) !important;
  }
  /deep/.uni-calendar-item--disable {
    background-color: var(--bg-color-calendar) !important;
    color: var(--text-color-grey) !important;
  }
  /deep/.uni-calendar__backtoday {
    background: var(--bg-color-main) !important;
  }
}
</style>
<style lang="scss" scoped>
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
/deep/.u-form-item--left {
  color: var(--text-color-main);
}
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
}
.content {
  width: 100%;
  background: var(--bg-color-second);
}
.btnBox {
  width: 100%;
  background: var(--bg-color-main);
  padding: 10px 5%;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  z-index: 100;
}
.form-css {
  width: 100%;
  height: 80px;
  background: var(--bg-color-second);
}
.box {
  width: 95%;
  margin: 15px auto auto;
  background: var(--bg-color-main);
  padding: 0 10px;
}
.recordBox {
  width: 95%;
  margin: 10px auto auto;
  background: var(--bg-color-main);
  padding: 10px;
  .time {
    font-weight: 600;
    margin-bottom: 5px;
  }
  view {
    padding: 3px 0;
    color: var(--text-color-main);
  }
  .fontBox {
    display: flex;
    justify-content: start;
    align-items: flex-start;
    margin-bottom: 10px;
    .font1 {
      margin-top: 3px;
      min-width: 60px;
      text-align: center;
      border-radius: 2px;
      background: #edf6ff;
      color: #1b55af;
    }
    .font2 {
      margin-top: 3px;
      min-width: 60px;
      text-align: center;
      border-radius: 2px;
      background: #ffece7;
      color: #fa5f1b;
    }
    .font3 {
      margin-top: 3px;
      min-width: 60px;
      text-align: center;
      border-radius: 2px;
      background: #f6f4ff;
      color: #5943be;
    }
    .font4 {
      margin-top: 3px;
      min-width: 60px;
      text-align: center;
      border-radius: 2px;
      background: #feeaea;
      color: #f55052;
    }
    .contentbox {
      margin-left: 15px;
    }
  }
}
.tabs {
  margin-top: 20px;
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
/deep/.u-form-item {
  padding: 20rpx 10px;
}
/deep/.u-form-item--left__content__label {
  font-weight: 600;
}
/deep/.u-input__input {
  background: var(--bg-color-second);
}
.no-data {
  padding-top: 10px;
  text-align: center;
}
</style>
