<template>
  <theme>
    <view class="all" slot="theme">
      <house-header class="title-header" :headTypeTwo="title"></house-header>
      <view class="tabs-css">
        <u-tabs
          :list="TabList"
          :is-scroll="false"
          :current="current"
          @change="tabOnChanged"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
          bg-color="var(--bg-color-main)"
        ></u-tabs>
      </view>
      <view
        class="content"
        :style="{
          paddingTop: paddingTop,
          height: 'calc(100vh - ' + marginHeight + ')',
          background:
            current === 0 ? 'var(--bg-color-main)' : 'var(--bg-color-second)'
        }"
      >
        <addFeedback
          @getTabData="getTabData"
          v-if="current === 0"
        ></addFeedback>
        <view v-if="current === 1" style="background: var(--bg-color-second)">
          <historyDatil
            v-if="cardList.length > 0"
            :cardList="cardList"
          ></historyDatil>
          <view class="empty" v-if="!cardList || cardList.length === 0">
            <x-icon iconName="service-no-data"></x-icon>
          </view>
        </view>
      </view>

      <view
        :style="{
          marginTop: marginTop
        }"
        class="loading-box"
        v-if="loading"
      >
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
    </view>
  </theme>
</template>
<script>
import { historyDatil } from "./components/historyDatil"
import { addFeedback } from "./components/addFeedback"
import { getComplaintList } from "@/api/personal"

export default {
  components: {
    addFeedback,
    historyDatil
  },
  data() {
    return {
      TabList: [
        {
          name: "新建反馈"
        },
        {
          name: "历史记录"
        }
      ],
      current: 0,
      title: "",
      cardList: [],
      loading: false,
      marginTop: "",
      paddingTop: "40px",
      marginHeight: ""
    }
  },
  created() {
    let obj = uni.getMenuButtonBoundingClientRect()
    this.marginTop = obj.top + obj.height + 45 + "px"
    this.marginHeight = obj.top + obj.height + 5 + "px"
  },
  onLoad() {
    this.title = decodeURI(this.$Route.query.title)
  },
  methods: {
    tabOnChanged(index) {
      this.current = index
      if (this.current == 1) {
        this.getCardList()
      }
    },
    getCardList() {
      this.loading = true
      getComplaintList()
        .then(res => {
          if (res.code == 200) {
            this.loading = false
            this.cardList = res.data.rows
          }
        })
        .catch(err => {
          this.loading = false
          console.error(err, "历史记录异常")
        })
    },
    getTabData(val) {
      if (val) {
        this.current = 1
        this.getCardList()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
}
.content {
  background: var(--bg-color-main);
}
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.tabs-css {
  position: fixed;
  overflow-x: scroll;
  width: 100%;
  height: 40px;
  z-index: 20;
  background: var(--bg-color-main);
}
.form-css {
  width: 100%;
  height: 120px;
  // background: var(--bg-color-main);
  background: red;
}
.loading-box {
  width: 100vw;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
.empty {
  margin-top: 150px;
  text-align: center;
}
</style>
