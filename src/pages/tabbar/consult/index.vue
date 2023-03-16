<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="在线问诊"></house-header>
      <view class="tabs-css">
        <u-tabs
          :list="groupTabList"
          :is-scroll="false"
          :current="currentTabIndex"
          @change="onTabChanged"
          bg-color="var(--bg-color-main)"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
        >
        </u-tabs>
      </view>
      <view class="content">
        <askDoctor v-if="currentTabIndex === 0 && !loading" :myConsultList="myConsultList" :recommendationConsultList="recommendationConsultList"></askDoctor>
        <medicalRecords v-if="currentTabIndex === 1 && !loading" :recordList="recordList"></medicalRecords>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading mode="circle" :show="loading" size="100" color="var(--theme-color-dark-blue)"></u-loading>
      </view>
      <!-- <u-tabbar :border-top="false" bg-color="var(--bg-color-main)" active-color="var(--text-color-main)" :list="tabbarList"></u-tabbar> -->
    </view>
  </theme>
</template>

<script>
import { tabbarList } from "@/utils/tabbar/tabbarList"
import { askDoctor } from "./components/askDoctor"
import { medicalRecords } from "./components/medicalRecords"
import { getMyConsultList, getUsingList } from "@/api/consult"
export default {
  components: {
    askDoctor,
    medicalRecords
  },
  data() {
    return {
      tabbarList,
      groupTabList: [
        { name: "问医生" },
        {
          name: "问医记录"
        }
      ],
      currentTabIndex: 0,
      myConsultList: [],
      recommendationConsultList: [],
      loading: true,
      recordList: []
    }
  },
  watch: {
    message: {
      immediate: true,
      deep: true,
      handler(val) {
        this.tabbarList[2].isDot = val
      }
    }
  },
  computed: {
    message() {
      return this.$store.state.theme.message
    }
  },
  onShow() {
    this.loading = true
    this.getMyConsult()
  },
  methods: {
    //切换tabs
    onTabChanged(index) {
      if (index === 0) {
        this.getMyConsult()
      }
      if (index === 1) {
        this.getRecordList()
      }
      this.currentTabIndex = index
    },
    //获取我的咨询服务
    getMyConsult() {
      getMyConsultList()
        .then(res => {
          if (res.code === 200) {
            this.loading = false
            let askDoctorList = res.data
            this.myConsultList = askDoctorList.filter(item => item.count !== "0")
            this.recommendationConsultList = askDoctorList.filter(item => item.count === "0")
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err)
        })
    },
    //获取问医记录
    getRecordList() {
      this.loading = true
      getUsingList().then(res => {
        if (res.code === 200) {
          this.loading = false
          this.recordList = res.data.rows
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}

.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
}

.tabs-css {
  position: fixed;
  overflow-x: scroll;
  width: 100%;
  z-index: 20;
  background: var(--bg-color-main);
}

.content {
  width: 90%;
  margin: auto;
  margin-top: 120rpx;
}

.loading-box {
  width: 100vw;
  height: 100vh;
  margin: 40px auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--bg-color-main);
  z-index: 10;
}
</style>
