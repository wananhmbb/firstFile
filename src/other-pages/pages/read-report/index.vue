<template>
  <theme>
    <view slot="theme" class="main">
      <house-header :headTypeTwo="headTypeTwo"></house-header>
      <view v-if="flag && !loading">
        <view class="list">
          <view class="date">2023.02.27</view>
          <view class="image-box">
            <u-image :src="dataValue.url" mode="widthFix">
              <template v-slot:error>
                <text class="image-error">图片加载失败</text>
              </template>
            </u-image>
          </view>
          <view v-if="dataValue.reportTheResult" class="result-title">
            报告结果
          </view>
          <view>
            <richTextComponent :htmlData="dataValue.reportTheResult" />
          </view>
        </view>
        <view class="bottom-btn" v-if="setShowKnowBtn(dataValue)">
          <u-button type="primary" shape="circle" @click="IAlreadyKnow"
            >本人已知晓报告结果, 返回上一页</u-button
          >
        </view>
      </view>
      <view class="no-data-box" v-else-if="!flag && !loading">
        <view class="pictrue">
          <x-icon iconName="service-no-data" class="no-data"></x-icon>
        </view>
      </view>
      <view class="loading-box" v-if="loading"
        ><u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading
      ></view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import {RequestList} from "@/utils/requestCode"
import {ReportTypeEnum} from "@/other-pages/pages/report-interpretation/enums/ReportTypeEnum.js"
import {getReportDetailsApi, IAlreadyKnowApi} from "@/api/report-interpretation"
import richTextComponent from "@/components/components/rich-text-component.vue"
export default {
  name: "index",
  components: {
    richTextComponent
  },
  data() {
    return {
      headTypeTwo: "报告解读",
      htmlData: "",
      id: "",
      flag: false,
      imageUrl: "",
      loading: false,
      dataValue: {}
    }
  },
  onLoad(option) {
    this.id = option.id
    this.getReportDetails()
  },
  methods: {
    setShowKnowBtn(dataValue) {
      if (
        dataValue.status &&
        dataValue.status === ReportTypeEnum.REPORT_THE_RESULT
      ) {
        return true
      } else {
        return false
      }
    },
    getReportDetails() {
      this.loading = true
      const obj = {
        id: this.id
      }
      getReportDetailsApi(obj)
        .then(res => {
          this.loading = false
          if (res.code === RequestList.SUCCESS_CODE) {
            this.flag = true
            this.dataValue = res.data
          } else {
            this.dataValue = {}
            console.error(res)
            this.flag = false
          }
        })
        .catch(err => {
          this.loading = false
          this.flag = false
          this.dataValue = {}
          console.error(err)
        })
    },
    IAlreadyKnow() {
      const obj = {
        id: this.id
      }
      IAlreadyKnowApi(obj)
        .then(res => {
          if (res.code === RequestList.SUCCESS_CODE) {
            this.$refs.uToast.show({
              title: "已确认",
              type: "success"
            })
            const time = setTimeout(() => {
              clearTimeout(time)
              uni.navigateBack({
                delta: 1
              })
            }, 2000)
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: "error"
            })
            console.error(res)
          }
        })
        .catch(err => {
          this.$refs.uToast.show({
            title: "操作失败",
            type: "error"
          })
          console.error(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.main {
  height: 100vh;
  //height: 100%;
  padding: 20rpx 0 0;
  background: var(--bg-color-second);
  .list {
    padding: 0% 4% 4%;
    height: calc(85vh - 4vh - 20rpx);
    overflow: auto;
    .date {
      color: var(--text-color-main);
      font-size: 30rpx;
      margin-bottom: 20rpx;
    }
    .image-box {
      width: 260rpx;
      .u-image {
        width: 100%;
      }
      .image-error {
        margin-top: 40rpx;
        font-size: 30rpx;
      }
    }
    .result-title {
      margin-top: 1.2vw;
      color: var(--text-color-grey);
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
  .no-data-box {
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    .pictrue {
      width: 60vw;
      margin: auto;
      height: 300rpx;
      .no-data {
        width: 100%;
        height: 100%;
      }
    }
  }

  .bottom-btn {
    height: 4vh;
    width: 92%;
    margin: 0 auto;
  }
}
</style>
