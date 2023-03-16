<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="预约"></house-header>
      <view class="form" v-if="!empty">
        <u-form
          :model="form"
          ref="uForm"
          label-width="150"
          :error-type="errorType"
        >
          <u-form-item label="预约项目">
            <u-input
              v-model="title"
              :disabled="true"
              :custom-style="customStyle"
            />
          </u-form-item>
          <u-form-item label="预约门店" prop="reservedStore">
            <u-input
              v-model="form.reservedStore"
              placeholder="请选择 >"
              :disabled="true"
              @click="chooseStore"
              :custom-style="customStyle"
            />
          </u-form-item>
          <view class="reservedTimeBox"> </view>
          <u-form-item label="预计时间">
            <u-input
              v-model="estimateTime"
              :disabled="true"
              :custom-style="customStyle"
            />
          </u-form-item>
        </u-form>
        <scorllTime
          @getDisabled="getDisabled"
          :scorllTimeList="scorllTimeList"
          :estimateTime="estimateTime"
          @getparams="getparams"
        ></scorllTime>
        <view class="mask"></view>
        <view class="btnBox">
          <view class="reservedTimeBox"></view>
          <view class="btn">
            <u-button
              v-if="!appointmentdisabled"
              type="primary"
              shape="circle"
              throttle-time="3000"
              @click="goAppointment()"
              >确认预约</u-button
            >
            <u-button
              v-if="appointmentdisabled"
              type="primary"
              :plain="true"
              shape="circle"
              throttle-time="3000"
              @click="goNoAppointment()"
              >确认预约</u-button
            >
          </view>
        </view>
        <!-- <u-select
          v-model="storeShow"
          :list="storeList"
          @confirm="storeConfirm"
          value-name="id"
          label-name="label"
          :default-value="defaultValue"
        ></u-select> -->
      </view>
      <u-popup v-model="storeShow" mode="bottom" height="45%">
        <view class="popupBox">
          <view class="popupBtnBox">
            <view @click="cancel">取消</view>
            <view @click="confirm" class="confirmText">确定</view>
          </view>
          <view class="tabBox">
            <!-- <u-tabs
              :list="TabList"
              :is-scroll="isScroll"
              :current="tabBoxcurrent"
              @change="tabOnChanged"
              active-color="var(--text-color-main)"
              inactive-color="#9699a6"
              bg-color="var(--bg-color-main)"
            ></u-tabs> -->
            <view
              class="listItem"
              v-for="(item, index) in TabList"
              :key="index"
              @click="tabOnChanged(index)"
            >
              <view
                :class="
                  tabBoxcurrent == index ? `item-name active` : 'item-name'
                "
                >{{ item.name }}</view
              >
              <view v-show="tabBoxcurrent == index" class="line"></view>
            </view>
          </view>
          <view class="storeBox" v-if="storeList.length > 0">
            <view
              class="storeBoxView"
              v-for="(item, index) in storeList"
              :key="index"
              @click="check(index)"
            >
              <view class="storeBoxView-one">
                <view
                  :class="
                    indexIn === index
                      ? 'storeBoxView-first '
                      : 'storeBoxView-first1'
                  "
                >
                  <u-icon
                    name="checkbox-mark"
                    color="#ffffff"
                    size="28"
                  ></u-icon>
                </view>
              </view>
              <view class="storeBoxView-two">
                <view>{{ item.deptName }}</view>
                <view>地址：{{ item.address }}</view>
                <view v-if="item.phone"
                  >电话：<text
                    class="phone"
                    v-for="(phoneItem, phoneIndex) in item.phoneNumber"
                    @click="phoneCall(phoneItem)"
                    :key="phoneIndex"
                    >{{ phoneItem }}</text
                  >
                </view>
              </view>
            </view>
          </view>
        </view>
      </u-popup>
      <u-toast ref="uToast" :icon="false" />
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view v-if="empty" class="empty">
        <x-icon iconName="service-no-data"></x-icon>
      </view>
    </view>
  </theme>
</template>

<script>
import {
  getReservationStore,
  getDoctorStore,
  getReservationTime,
  makeAppointment
} from "@/api/service"
import scorllTime from "@/service-sub-pages/pages/followUpAppointment/components/scorllTime"
export default {
  components: {
    scorllTime
  },
  data() {
    return {
      empty: false,
      tabBoxcurrent: 0,
      currentindex: "",
      TabList: [],
      checked: false,
      customStyle: {
        color: "var(--text-color-grey)"
      },
      isScroll: true,
      indexIn: 0,
      appointmentdisabled: false,
      reservedTime: "",
      loading: true,
      actionId: "",
      location: "",
      deptName: "",
      medicalCardId: "",
      servicePackageUserId: "",
      implementDate: "",
      implementShift: "",
      scheduleDetailsId: "",
      defaultValue: [0, 0],
      list: [],
      title: "",
      estimateTime: "",
      errorType: ["toast"],
      storeId: null,
      scorllTimeList: [],
      storeList: [
        // {
        //   id: "1",
        //   label: "1",
        //   children: [
        //     {
        //       id: 2,
        //       label: "2"
        //     },
        //     {
        //       id: 3,
        //       label: "3"
        //     }
        //   ]
        // }
      ],
      storeListAll: {},
      storeShow: false,
      chooseTime: false,
      form: {
        reservedStore: ""
      },
      rules: {
        reservedStore: [
          {
            required: true,
            message: "预约门店不能为空",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ]
      }
    }
  },
  watch: {},
  onLoad() {
    this.title = this.$Route.query.title
    this.medicalCardId = this.$Route.query.medicalCardId
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
    this.estimateTime = this.$Route.query.estimateTime
    this.actionId = this.$Route.query.actionId
    this.getReservationStoreList()
    // this.isScroll = false
  },
  methods: {
    getPhone(number) {
      return number.split(",")
    },
    chooseStore() {
      this.storeShow = true
      this.isScroll = false
      this.storeList.forEach((item, index) => {
        if (item.deptName == this.form.reservedStore) {
          this.indexIn = index
        }
      })
    },
    confirm() {
      this.storeId = this.storeList[this.indexIn].deptId
      this.form.reservedStore = this.storeList[this.indexIn].deptName
      this.location = this.storeList[this.indexIn].address
      this.deptName = this.storeList[this.indexIn].deptName
      if (this.storeId) {
        this.getReservationTimeList()
      } else {
        console.log("门店id为空")
      }
      this.storeShow = false
    },
    cancel() {
      this.storeShow = false
    },
    check(index) {
      this.indexIn = index
    },
    open() {
      this.$refs.calendar.open()
    },
    /**
     * 计算与今日指定相差n天的日期
     * @param offsetDays 相差n天
     * @returns {string} YYYY-MM-DD
     */
    computeOffsetDaysDateString(offsetDays) {
      const now = new Date(this.estimateTime)
      const offsetDate = new Date(now)
      offsetDate.setDate(now.getDate() + offsetDays)

      return this.$u.timeFormat(offsetDate, "yyyy-mm-dd")
    },
    getNear14Days() {
      const list = []
      for (let i = -7; i <= 7; i++) {
        list.push(this.computeOffsetDaysDateString(i))
      }
      return list
    },
    transformScheduleList(data) {
      const daysList = this.getNear14Days()
      const workDateMap = {}
      const result = []
      if (data) {
        data.forEach(item => {
          if (workDateMap[item.workDate]) {
            workDateMap[item.workDate].push(item)
          } else {
            workDateMap[item.workDate] = [item]
          }
        })
      }

      daysList.forEach(day => {
        const dayArray = day.split("-")
        const displayDate = dayArray[1] + "." + dayArray[2]

        const item = {
          dataYm: displayDate,
          date: day,
          canMake: false,
          rows: []
        }
        if (workDateMap[day]) {
          item.rows = workDateMap[day]
        }

        let total = 0
        item.rows.forEach(shift => {
          total += shift.remainAmount
        })
        if (total > 0) {
          item.canMake = true
        }
        result.push(item)
      })

      return result
    },
    getReservationStoreList() {
      getDoctorStore(this.servicePackageUserId, this.medicalCardId)
        .then(res => {
          if (res.code === 200) {
            this.loading = false
            this.storeListAll = res.data
            for (let key in res.data) {
              if (key === "organization") {
                this.TabList.push({ name: "机构", key: "organization" })
              }
              if (key === "team") {
                this.TabList.push({ name: "医生组", key: "team" })
              }
              res.data[key].forEach(item => {
                if (item.phone) {
                  item.phoneNumber = item.phone.split(",")
                }
              })
            }
            if (this.TabList.length > 0) {
              this.currentindex = this.TabList[this.tabBoxcurrent].key
              let storeList = res.data[this.currentindex]
              let envVersion = __wxConfig.envVersion
              if (envVersion === "trial" || envVersion === "develop") {
                this.storeList = storeList
              } else {
                this.storeList = storeList.filter(
                  item => !item.deptName.includes("模拟")
                )
              }
              this.storeId = this.storeList[0].deptId
              this.form.reservedStore = this.storeList[0].deptName
              this.deptName = this.storeList[0].deptName
              this.location = this.storeList[0].address
            }
            if (this.storeId) {
              this.getReservationTimeList()
            } else {
              console.log("门店id为空")
            }
            if (!res.data) {
              this.empty = true
            }
          } else {
            this.loading = false
            this.empty = true
          }
        })
        .catch(err => {
          console.log(err, "获取门店信息失败")
        })
    },
    getReservationTimeList() {
      getReservationTime(this.storeId, this.estimateTime)
        .then(res => {
          if (res.code === 200) {
            this.scorllTimeList = this.transformScheduleList(res.data)
            this.loading = false
          }
        })
        .catch(err => {
          console.error(err)
          this.loading = false
          console.log("获取预约时间失败")
        })
    },
    goAppointment() {
      if (this.implementShift && this.implementDate && this.scheduleDetailsId) {
        this.$refs.uForm.validate(valid => {
          if (valid) {
            console.log("验证通过")
            let params = {
              teamId: this.storeId,
              actionId: this.actionId,
              implementDate: this.implementDate,
              implementShift: this.implementShift,
              implementLocation: this.location,
              scheduleDetailsId: this.scheduleDetailsId,
              deptName: this.deptName,
              medicalCardId: this.medicalCardId
            }
            // console.log(params, "params")
            makeAppointment(params)
              .then(res => {
                if (res.code == "200") {
                  this.implementShift = ""
                  this.scheduleDetailsId = ""
                  this.$refs.uToast.show({
                    title: "预约成功",
                    type: "success"
                  })
                  setTimeout(() => {
                    // TODO: 返回服务预约页面有问题，暂时返回服务页面
                    uni.switchTab({ url: "/pages/tabbar/service/index" })
                  }, 2000)
                } else {
                  this.$refs.uToast.show({
                    title: res.message,
                    type: "error"
                  })
                }
              })
              .catch(err => {
                console.log("提交预约失败")
              })
          } else {
            console.log("验证失败")
          }
        })
      } else {
        this.$refs.uToast.show({
          title: "请选择时间",
          type: "error"
        })
      }
    },
    goNoAppointment() {
      this.$refs.uToast.show({
        title: "今日无号",
        type: "primary"
      })
    },
    getparams(a, b, c) {
      this.implementShift = a
      this.scheduleDetailsId = b
      this.implementDate = c
    },
    getDisabled(item) {
      this.appointmentdisabled = item
    },
    tabOnChanged(index) {
      let envVersion = __wxConfig.envVersion
      this.storeList = []
      this.tabBoxcurrent = index
      this.indexIn = 0
      this.check(0)
      this.currentindex = this.TabList[index].key
      let storeList = this.storeListAll[this.currentindex]
      if (envVersion === "trial" || envVersion === "develop") {
        this.storeList = storeList
      } else {
        this.storeList = storeList.filter(
          item => !item.deptName.includes("模拟")
        )
      }
    },
    phoneCall(number) {
      uni.makePhoneCall({
        phoneNumber: number
      })
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>

<style lang="scss" scoped>
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
/deep/u-form-item {
  .u-input {
    text-align: right !important;
  }
}
/deep/.u-drawer-bottom {
  background-color: var(--bg-color-main) !important;
}
/deep/.u-form-item {
  background: var(--bg-color-main) !important;
  padding: 22rpx 5% !important;
}
/deep/.u-form-item--left__content__label {
  color: var(--text-color-main) !important;
}
/deep/.u-form-item--right__content {
  color: var(--text-color-main) !important;
}
.reservedTimeBox {
  width: 100%;
  height: 10px;
  background: var(--bg-color-second);
}
.all {
  background: var(--bg-color-second);
  height: 100vh;
  .form {
    .btnBox {
      background: var(--bg-color-main) !important;
      width: 100%;
      position: absolute;
      bottom: 0;
      .btn {
        padding: 12px 5% 15px 5%;
      }
    }
  }
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
.confirmText {
  color: var(--theme-color-dark-blue);
}
.popupBox {
  padding-bottom: 20px;
  background: var(--bg-color-main);
  border: 1px solid var(--bg-color-main);
}
.popupBtnBox {
  border-bottom: 1px solid var(--bd-color-main);
  background: var(--bg-color-second);
  z-index: 10;
  display: flex;
  justify-content: space-between;
  align-items: center;
  height: 50px;
  padding: 0 3%;
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  view:first-child {
    color: var(--text-color-main);
  }
}
.tabBox {
  width: 100%;
  background: var(--bg-color-main);
  position: fixed;
  top: 50px;
  z-index: 100;
  height: 41px;
  display: flex;
  .listItem {
    width: 50%;
  }
  .item-name {
    text-align: center;
    height: 32px;
    line-height: 32px;
    color: #9699a6;
  }
  .active {
    color: var(--text-color-main);
    font-weight: bold;
  }
  .line {
    height: 3px;
    width: 20px;
    background: var(--theme-color-dark-blue);
    margin: auto;
  }
}
.storeBox {
  width: 100%;
  margin: 95px auto auto auto;
  .storeBoxView {
    width: 90%;
    margin: auto;
    display: flex;
    align-items: center;
    padding: 15px 0 10px 0;
    color: var(--text-color-main);
    border-bottom: 1px solid var(--bd-color-main);
    .storeBoxView-first {
      width: 25px;
      line-height: 25px;
      border-radius: 50%;
      background: var(--theme-color-dark-blue);
      text-align: center;
      border: none;
    }
    .storeBoxView-first1 {
      width: 25px;
      line-height: 25px;
      border-radius: 50%;
      background: var(--bg-color-main);
      text-align: center;
      border: 1px solid var(--text-color-grey);
    }
    .storeBoxView-one {
      width: 15%;
    }
    .storeBoxView-two {
      width: 85%;
      view:nth-child(2) {
        margin: 5px 0;
      }
      .phone {
        padding-right: 6px;
        text-decoration: underline;
        color: var(--theme-color-dark-blue);
      }
    }
  }
}
.empty {
  margin-top: 150px;
  text-align: center;
}
</style>
