<template>
  <view class="main-box" @click="toDetails">
    <view class="time-box">
      <view class="date">{{ data.title }}</view>
      <view class="time">{{ setDate(data.date) }}</view>
    </view>
    <view :class="['report-status', data.status ?data.status: '']">{{ setStatus(data.status) }}</view>
  </view>
</template>

<script>
import { ReportTypeEnum, ReportTypeEnumDictType } from "@/other-pages/pages/report-interpretation/enums/ReportTypeEnum";
import moment from "moment"
export default {
  name: "report-list-item",
  props: {
    data: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  methods: {
    toDetails() {
      uni.navigateTo({
        url: `other-pages/pages/read-report/index?id=${this.data.id}`
      })
    },
    setDate(date) {
      if (date) {
        return moment(new Date(date).getTime()).format("HH:mm")
      } else {
        return ""
      }
    },
    setStatus(status) {
      if (ReportTypeEnum.NO_REPORT_THE_RESULT === status) {
        return ReportTypeEnumDictType[ReportTypeEnum.NO_REPORT_THE_RESULT]
      } else if (ReportTypeEnum.CONFIRMED === status) {
        return ReportTypeEnumDictType[ReportTypeEnum.CONFIRMED]
      } else if (ReportTypeEnum.REPORT_THE_RESULT === status) {
        return ReportTypeEnumDictType[ReportTypeEnum.REPORT_THE_RESULT]
      } else {
        return ''
      }

    }
  }
}
</script>

<style scoped lang="scss">
.main-box {
  width: 100%;
  margin-top: 4%;
  border-radius: 10rpx;
  background: var(--bg-color-main);
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 6% 3%;
  .time-box {
    width: 50%;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .date {
      color: var(--text-color-main);
      font-size: 30rpx;
    }
    .time {
      margin-left: 6%;
      color: var(--text-color-grey);
      font-size: 30rpx;
    }
  }

  .report-status {
    padding: 2% 3%;
    border-radius: 30rpx;
    font-weight: 600;
    vertical-align: middle;
  }
  .nrtr {
    color: #FFCA4A;
    background: #fff7e4;
  }
  .rtr {
    color: #FE6B95;
    background: #FFE9EF;
  }
  .confirmed {
    color: #0E3092;
    background: #DBE0EF;
  }
}
</style>
