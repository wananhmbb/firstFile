<template>
  <theme>
    <view class="all" slot="theme">
      <house-header :headTypeTwo="title"></house-header>
      <view class="content">
        <view class="charts-box">
          <view class="fontBox">趋势</view>
          <uni-ec-canvas
            class="chart"
            ref="canvas"
            id="line-chart"
            canvas-id="lazy-load-chart"
            :ec="testEchartsOption"
          ></uni-ec-canvas>
        </view>
        <view class="detailsBox">
          <view class="detailsTitle">详情</view>
          <view class="details">
            <view class="detail-scroll-box" @touchend="scrolltolower">
              <view
                class="detailsData"
                v-for="item in recordList"
                :key="item.id"
              >
                <view>{{ item.recordTime }}</view>
                <view>{{ item.value }}{{ item.unit }}</view>
              </view>
            </view>
          </view>

          <view class="empty" v-if="dataShow">
            <x-icon iconName="service-no-data"></x-icon>
          </view>
        </view>
      </view>
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
import { getHealthMonitorInfo } from "@/api/service"
import UniEcCanvas from "@/service-sub-pages/pages/healthMonitoring/components/uni-ec-canvas/uni-ec-canvas"
export default {
  components: { UniEcCanvas },
  data() {
    return {
      dataShow: false,
      testEchartsOption: {
        lazyLoad: true,
        option: {
          legend: {
            left: 10
          },
          color: ["#DE4A42", "#4381CF"],
          dataZoom: [],
          xAxis: {
            type: "category",
            data: [],
            axisLine: {
              lineStyle: {
                type: "dashed",
                color: "#957E93"
              }
            },
            axisTick: {
              show: false
            }
          },
          yAxis: {
            type: "value",
            show: false
          },
          grid: {
            show: true,
            borderWidth: 0
          },
          series: []
        }
      },
      title: "",
      servicePackageUserId: "",
      medicalCardId: "",
      indicatorId: "",
      indicatorIds: [],
      disabled: true,
      recordList: [],
      text: "暂无数据",
      loading: true,
      startTimeOffset: -6,
      endTime: 0,
      pageIndex: 1,
      isLoadAllData: false
    }
  },
  onReady() {
    this.$refs["canvas"].init()
  },
  onLoad() {
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
    this.medicalCardId = this.$Route.query.medicalCardId
    // this.indicatorId = this.$Route.query.indicatorId
    this.indicatorIds = this.$Route.query.indicatorIds.split(",")
    this.title = this.$Route.query.title
    this.getMonitorIndicatorListData()
    // this.getHealthMonitor(this.servicePackageUserId, this.indicatorId)
  },

  methods: {
    scrolltolower() {
      // this.getHealthMonitor(this.servicePackageUserId, this.indicatorId)
      this.getMonitorIndicatorListData()
    },
    getMonitorIndicatorListData() {
      const promiseArray = []
      const startTime = this.computeSearchStartTime()
      const endTime = this.getDay(this.endTime)
      this.indicatorIds.forEach(id => {
        const params = {
          startTime: startTime,
          endTime: endTime,
          medicalCardId: this.medicalCardId
        }

        promiseArray.push(
          getHealthMonitorInfo(this.servicePackageUserId, id, params)
        )
      })

      Promise.all(promiseArray).then(responseList => {
        this.loading = false
        const records = []
        responseList.forEach(res => {
          if (res.code === 200 && res.data && res.data.length > 0) {
            records.push(res.data)
          }
        })

        if (records.length === 0) {
          if (this.recordList && this.recordList.length === 0) {
            this.dataShow = true
          }
          this.isLoadAllData = true
          return
        } else {
          this.endTime = this.startTimeOffset * this.pageIndex - 1
          for (let i = 0; i < records[0].length; i++) {
            const valueArr = []
            records.forEach(oneS => {
              valueArr.push(oneS[i].value)
            })
            this.recordList.push({
              recordTime: records[0][i].recordTime,
              unit: records[0][i].hjtHealthMonitorIndicatorLibResponse.unit,
              value: valueArr.join("/")
            })
          }
        }

        if (this.pageIndex === 1) {
          this.setChartsData2(records)
        }
      })
    },
    getDay(day) {
      const nowTimestamp = new Date().getTime()
      const targetTimestamp = nowTimestamp + 86400000 * day
      return this.$u.timeFormat(targetTimestamp, "yyyy-mm-dd")
    },
    computeSearchStartTime() {
      let startDays
      if (this.pageIndex >= 2) {
        startDays = this.startTimeOffset * this.pageIndex - 1
      } else {
        startDays = this.startTimeOffset * this.pageIndex
      }
      return this.getDay(startDays)
    },
    getHealthMonitor(servicePackageUserId, indicatorId) {
      if (this.isLoadAllData) {
        return
      }
      const params = {
        startTime: this.computeSearchStartTime(),
        endTime: this.getDay(this.endTime),
        medicalCardId: this.medicalCardId
      }
      getHealthMonitorInfo(servicePackageUserId, indicatorId, params)
        .then(res => {
          if (res.code == "200") {
            this.loading = false

            if (!res.data) {
              if (this.recordList && this.recordList.length === 0) {
                this.dataShow = true
              }
              this.isLoadAllData = true
              return
            } else {
              this.endTime = this.startTimeOffset * this.pageIndex - 1
            }
            let arr = res.data
            arr.forEach(item => {
              this.recordList.push(item)
            })
            if (this.pageIndex === 1) {
              this.setChartsData(res.data)
            }

            this.pageIndex = this.pageIndex + 1
          } else {
            this.loading = false
          }
        })
        .catch(err => {
          console.log(err)
          this.loading = false
        })
    },
    setChartsData2(records) {
      const x = []
      const y = []
      records.forEach((oneIndicatorDataList, index) => {
        const oneSY = []
        oneIndicatorDataList.forEach(item => {
          if (index === 0) {
            const recordTime = item.recordTime.split(" ")
            const dateArray = recordTime[0].split("-")
            const timeArray = recordTime[1].split(":")
            const timeBreakString = `${dateArray[1]}/${dateArray[2]}\n${timeArray[0]}:${timeArray[1]}`
            x.unshift(timeBreakString)
          }
          oneSY.unshift(item.value)
        })
        y.push(oneSY)
      })

      const s = []
      y.forEach(item => {
        s.push({
          data: item,
          symbol: "circle",
          symbolSize: 6,
          label: {
            show: true,
            position: "top"
          },
          type: "line",

          markLine: {
            symbol: ["none", "none"],
            label: {
              position: "start",
              color: "#666666"
            },
            lineStyle: {
              color: "#DE4A42"
            },
            data: [{ type: "max", name: "最大值" }]
          }
        })
      })
      if (x.length > 7) {
        this.testEchartsOption.option.dataZoom = [
          {
            type: "inside",
            start: 0,
            end: 50
          }
        ]
      }
      this.testEchartsOption.option.xAxis.data = x
      this.testEchartsOption.option.series = s
    },
    setChartsData(records) {
      records.map(item => {
        const recordTime = item.recordTime.split(" ")
        const dateArray = recordTime[0].split("-")
        const timeArray = recordTime[1].split(":")
        const timeBreakString = `${dateArray[1]}/${dateArray[2]}\n${timeArray[0]}:${timeArray[1]}`
        this.testEchartsOption.option.xAxis.data.unshift(timeBreakString)
        this.testEchartsOption.option.series[0].data.unshift(item.value)
      })
    }
  }
}
</script>
<style lang="scss" scoped>
#line-chart {
  margin-top: 20px;
}
.all {
  width: 100%;
  height: 100vh;
  background: var(--bg-color-second);
}
.chart {
  height: 200px;
}
.charts-box {
  height: 250px;
  white-space: pre-line !important;
  background: var(--bg-chart);
}
.fontBox {
  padding: 5px 0 5px 10px;
  color: var(--text-color-grey);
  font-weight: bold;
}
.detailsBox {
  width: 100%;
  // margin: 15px auto auto;
  .detailsTitle {
    width: 90%;
    margin: 15px auto 0;
    font-size: 16px;
    font-weight: bold;
    height: 70rpx;
    color: var(--text-color-main);
  }
}
.detailsData {
  width: 90%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  padding: 16px 0;
  font-weight: 600;
  color: var(--text-color-main);
  border-bottom: 1px solid var(--bd-color-main);
}
.empty {
  width: 230px;
  height: 170px;
  margin: 30px auto auto auto;
  text-align: center;
}
.detail-scroll-box {
  max-height: calc(100vh - 270rpx - 250px - env(safe-area-inset-bottom));
  overflow: auto;
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
</style>
