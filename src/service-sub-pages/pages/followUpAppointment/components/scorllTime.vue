<template>
  <view class="all">
    <view class="one">
      <view class="oneView">
        <scroll-view
          class="timeBox"
          scroll-x="true"
          :scroll-left="timeBoxScrollLeft"
        >
          <view
            v-for="(item, index) in scorllTimeList"
            @click="selectColor(index)"
            :key="index"
            :class="indexIn === index ? 'timeBoxViewIn' : 'timeBoxView'"
          >
            <view>{{ item.dataYm }}</view>
            <view :class="{ canMake: item.canMake }">{{
              item.canMake ? "有号" : "无号"
            }}</view>
          </view>
        </scroll-view>

        <view class="unfold" @click="unfoldCalendar">
          <view>选择</view>
          <view>日期</view>
          <u-icon name="arrow-down"></u-icon>
        </view>
      </view>
      <view class="ticketBox" v-if="timeQuantum">
        <view
          v-for="(item, index) in timeQuantum"
          :key="index"
          :class="ticketIndex === index ? 'bdticketbox' : 'ticketbox'"
        >
          <view
            @click="chooseTimeQuantum(item, index)"
            class="ticket"
            v-if="item.remainAmount > 0"
          >
            <view>{{ item.shiftStartTime }}-{{ item.shiftEndTime }}</view>
            <view>剩{{ item.remainAmount }}</view>
          </view>
          <view
            @click="chooseNoTiket"
            class="noticket"
            v-if="item.remainAmount <= 0"
          >
            <view>{{ item.shiftStartTime }}-{{ item.shiftEndTime }}</view>
            <view>剩0</view>
          </view>
        </view>
      </view>
      <view v-else style="text-align: center; margin-top: 10px">暂无排班</view>
    </view>
    <uni-calendar
      ref="calendar"
      :insert="false"
      @confirm="calendarConfirm"
      :selected="selected"
      :startDate="startDate"
      :endDate="endDate"
      :showMonth="false"
      :date="times"
    />
    <u-toast ref="uToast" />
  </view>
</template>
<script>
export default {
  props: {
    scorllTimeList: {
      type: Array
    },
    estimateTime: {
      type: String
    }
  },
  data() {
    return {
      times: "",
      timeBoxScrollLeft: 0,
      startDate: "",
      endDate: "",
      ScorllTime: [],
      indexIn: 0,
      ticketIndex: null,
      selected: [],
      timeQuantum: []
    }
  },
  watch: {
    scorllTimeList: {
      immediate: true,
      handler(val) {
        this.selected = []
        if (val.length > 0) {
          this.startDate = val[0].date
          this.endDate = val[val.length - 1].date
          val.forEach((item, index) => {
            if (item.date === this.times) {
              this.timeQuantum = item.rows
              this.selectColor(index)
            }
            this.selected.push({
              date: item.date,
              info: item.canMake ? "有号" : "无号",
              theme: item.canMake ? "primary" : "info"
            })
          })
        }
      }
    },
    indexIn: {
      immediate: true,
      handler(val) {
        if (this.scorllTimeList.length > 0) {
          this.timeQuantum = this.scorllTimeList[val].rows
        }

        if (val > 2) {
          this.timeBoxScrollLeft = (val - 2) * 60
        } else {
          this.timeBoxScrollLeft = 0
        }
      }
    },
    timeQuantum: {
      immediate: true,
      handler(val) {
        let disabled = true
        if (!val) {
          this.$emit("getDisabled", disabled)
        } else {
          this.$emit("getDisabled", !disabled)
        }
      }
    },
    estimateTime: {
      handler(val) {
        this.times = val
      }
    }
  },
  methods: {
    selectColor(index) {
      this.indexIn = index
      let type = ""
      let id = ""
      let date = ""
      this.$emit("getparams", type, id, date)
      this.ticketIndex = null
    },
    unfoldCalendar() {
      this.$refs.calendar.open()
    },
    calendarConfirm(e) {
      this.scorllTimeList.forEach((item, index) => {
        if (item.date == e.fulldate) {
          this.selectColor(index)
        }
      })
    },
    chooseTimeQuantum(item, index) {
      this.ticketIndex = index
      this.$emit(
        "getparams",
        `${item.shiftStartTime}-${item.shiftEndTime}`,
        item.id,
        item.workDate
      )
    },
    chooseNoTiket() {
      this.$refs.uToast.show({
        title: "暂无余票",
        type: "primary"
      })
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  background: var(--bg-color-main) !important;
}
.one {
  .oneView {
    width: 100%;
    margin: auto;
    display: flex;
    .timeBox {
      margin-left: 5%;
      display: flex;
      overflow-x: scroll;
      white-space: nowrap;
      padding: 10px 0;
      .timeBoxView {
        width: 55px;
        border-radius: 3px;
        margin-right: 5px;
        padding: 8px 9px;
        display: inline-block;
        view {
          font-size: 12px;
          text-align: center;
        }
        view:first-child {
          color: var(--text-color-main);
        }
        view:nth-child(2) {
          font-size: 12px;
          padding: 3px 0;
          color: var(--text-color-grey);

          &.canMake {
            color: var(--theme-color-dark-blue);
          }
        }
        view:nth-child(3) {
          font-size: 12px;
          color: var(--text-color-grey);
        }
      }
      .timeBoxViewIn {
        width: 50px;
        background: var(--theme-color-linear);
        color: var(--text-color-white);
        border-radius: 3px;
        margin-right: 5px;
        padding: 8px 9px;
        display: inline-block;
        view {
          font-size: 12px;
          text-align: center;
        }
        view:nth-child(2) {
          padding: 3px 0;
        }
      }
    }
    .unfold {
      width: 100px;
      font-size: 16px;
      color: var(--text-color-grey);
      box-shadow: -2px 0px 2px -1px rgba(0, 0, 0, 0.09);
      text-align: center;
      margin: auto;
    }
  }
}
.ticketBox {
  width: 90%;
  margin: auto;
  margin-top: 20px;
  display: flex;
  justify-content: space-between;
  flex-wrap: wrap;
  .ticketbox {
    width: 48%;
    border-radius: 3px;
    margin-bottom: 10px;
    .ticket {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 2%;
      background: rgba(227, 236, 248, 0.45);
    }
    .noticket {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 2%;
      background: darkgray;
      color: #fff;
    }
  }
  .bdticketbox {
    width: 48%;
    border-radius: 3px;
    margin-bottom: 10px;
    border: 1px solid #4484d3;
    .ticket {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 2%;
      background: rgba(227, 236, 248, 0.45);
    }
    .noticket {
      width: 100%;
      display: flex;
      justify-content: space-between;
      align-items: center;
      height: 52px;
      padding: 0 2%;
      background: darkgray;
      color: #fff;
    }
  }
}
.example-body {
  /* #ifndef APP-NVUE */
  display: flex;
  /* #endif */
  flex-direction: row;
}
.calendar-button {
  flex: 1;
  font-weight: bold;
  font-size: 32rpx;
}
</style>
