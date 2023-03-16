<template>
  <theme>
    <view class="all" slot="theme">
      <house-header class="title-header" :headTypeTwo="title"></house-header>
      <view class="content">
        <view class="tabs-css">
          <u-tabs
            :list="tabList"
            :is-scroll="true"
            :current="current"
            @change="tabOnChanged"
            active-color="var(--text-color-main)"
            inactive-color="#9699a6"
            bg-color="var(--bg-color-main)"
          ></u-tabs>
        </view>

        <view
          v-if="current === currentIndex"
          :style="{
            paddingTop: paddingTop,
            height: 'calc(100vh - ' + marginHeight + '-' + marginTop + ')',
            background:
              current === 0 ? 'var(--bg-color-main)' : 'var(--bg-color-second)'
          }"
          ><cellGroup :cellGroupList="cellGroupList"></cellGroup>
        </view>
      </view>
      <view class="empty" v-if="!cellGroupList || cellGroupList.length == 0">
        <x-icon iconName="service-no-data"></x-icon>
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
import { getFrequentlyTypeList, getFrequentlyAskedList } from "@/api/personal"
import { cellGroup } from "./components/cell-group"
export default {
  components: {
    cellGroup
  },
  data() {
    return {
      tabList: [],
      current: 0,
      currentIndex: 0,
      cellGroupList: [],
      title: "",
      loading: true,
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
    this.frequentlyTypeList()
  },
  methods: {
    tabOnChanged(index) {
      this.current = index
      this.currentIndex = index
      this.frequentlyAskedList(this.tabList[this.current].id)
    },
    check(index) {
      console.log(index, "index")
      this.$Router.push({
        name: "frequentlyAskedDetail"
      })
    },
    frequentlyTypeList() {
      let params = {
        dictType: "hjt_common_problem_type"
      }
      getFrequentlyTypeList(params).then(res => {
        if (res.code === 200) {
          res.rows.map(item => {
            this.tabList.push({
              name: item.dictLabel,
              id: item.dictCode
            })
          })

          this.frequentlyAskedList(this.tabList[this.current].id)
        }
      })
    },
    frequentlyAskedList(id) {
      let params = {
        type: id
      }
      this.loading = true
      getFrequentlyAskedList(params).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.cellGroupList = res.data.rows[0].commonProblemVo
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.all {
  min-height: 100vh;
  background: var(--bg-color-second);
}
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.loading-box {
  width: 100vw;
  margin: auto auto;
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
.tabs-css {
  position: fixed;
  overflow-x: scroll;
  width: 100%;
  z-index: 20;
  background: var(--bg-color-main);
}
</style>
