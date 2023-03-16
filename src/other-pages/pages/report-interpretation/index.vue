<template>
  <theme>
    <view slot="theme" class="main">
      <house-header :headTypeTwo="headTypeTwo"></house-header>
	  <view class="loading-box" v-if="loading"
	    ><u-loading
	      mode="circle"
	      :show="loading"
	      size="100"
	      color="var(--theme-color-dark-blue)"
	    ></u-loading
	  ></view>
	  
      <view class="list" v-else-if="!loading && reportList.length">
        <reportListItem
          v-for="(item, index) in reportList"
          :key="index"
          :data="item"
        />
      </view>
	  <view class="empty" v-else>
	        <x-icon iconName="service-no-data"></x-icon>
	  </view>
      <view class="bottom-btn">
        <u-button type="primary" shape="circle" @click="uploadReport"
          >点击上传</u-button
        >
      </view>
      
    </view>
  </theme>
</template>

<script>
import {RequestList} from "@/utils/requestCode"
import {getReportInterpretationListApi} from "@/api/report-interpretation"
import reportListItem from "@/other-pages/pages/report-interpretation/components/report-list-item"
export default {
  name: "index",
  components: {
    reportListItem
  },
  data() {
    return {
      headTypeTwo: "报告解读",
      reportList: [],
      loading: false
    }
  },
  onShow() {
    this.getReportInterpretationList()
  },
  methods: {
    uploadReport() {
      uni.navigateTo({
        url: "other-pages/pages/upload-report/index"
      })
    },
    getReportInterpretationList() {
      const obj = {
        medicalCardId: uni.getStorageSync("userInfo").medicalCardList[0].id
      }
      this.loading = true
      getReportInterpretationListApi(obj)
        .then(res => {
          this.loading = false
          if (res.code === RequestList.SUCCESS_CODE) {
            if (res.data?.length) {
              this.reportList = res.data
            } else {
              this.reportList = []
            }
          } else {
            console.error(res)
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    }
  }
}
</script>

<style scoped lang="scss">
.empty {
	display: flex;
	width: 230px;
	height: calc(85vh - 4vh);
	margin: auto;
	// text-align: center;
	padding-top: 50%;
}
.main {
  height: 100%;
  background: var(--bg-color-second);
  .list {
    padding: 0% 4% 4%;
    height: calc(85vh - 4vh);
    overflow: auto;
  }
  .bottom-btn {
    height: 4vh;
    width: 92%;
    margin: 0 auto;
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
}
</style>
