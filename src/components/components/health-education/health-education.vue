<template>
  <view class="large" v-if="resourceList.length >= 1">
    <view>
      <u-cell-group :border="border">
        <u-cell-item
          v-if="title === '最新科普'"
          :bg-color="bgColor"
          :border="border"
          :border-bottom="border"
          :title="title"
          :arrow="false"
          :title-style="titleStyle"
        ></u-cell-item>
        <u-cell-item
          v-else
          :bg-color="bgColor"
          :border="border"
          :border-bottom="border"
          :title="title"
          :arrow="true"
          arrow-direction="right"
          :value="value"
          :title-style="titleStyle"
          @click="goHealthEducationPage"
        ></u-cell-item>
      </u-cell-group>
    </view>
    <!-- 健康包列表的item -->
    <view class="health-box">
      <freeHealthEducationScrollView :selectResourceList="resourceList" />
      <!--      <healthEducationitem :resourceList="resourceList"></healthEducationitem>-->
    </view>
  </view>
</template>
<script>
import freeHealthEducationScrollView from "@/pages/freeHealthEducation/freeHealthEducationScrollView";
//import healthEducationScrollView from "@/pages/freeHealthEducation/healthEducationScrollView"
// import healthEducationitem from "@/components/components/health-education/health-education-item.vue"
import {hjtHeFreeList, hjtHeRecommendList} from "@/api/service"

export default {
  data() {
    return {
      value: "更多",
      border: false,
      bgColor: "var(--bg-color-main)",
      titleStyle: {
        fontSize: "18px",
        fontWeight: 600,
        color: "var(--text-color-main)",
        lineLeight: " 25px"
      },
      resourceList: []
    }
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    isNeedTenantId: {
      type: Boolean,
      default: null
    }
  },
  components: {
    freeHealthEducationScrollView
    // healthEducationitem
  },
  created() {
    if (this.title === "最新科普") {
      this.hjtHeFree()
    } else {
      this.hjtHeRecommend()
    }
  },
  methods: {
    goHealthEducationPage() {
      this.servicePackageId = this.$store.state.server.servicePackageInfo.id
      if (this.servicePackageId) {
        this.$Router.push(
          "/freeHealthEducation?headTitle=" +
            this.title +
            "&servicePackageId=" +
            this.servicePackageId
        )
      } else {
        this.$Router.push("/freeHealthEducation?headTitle=" + this.title)
      }
    },
    //最外层首页宣教
    hjtHeFree() {
      hjtHeFreeList(this.isNeedTenantId).then(res => {
        if (res.code === 200) {
          if (res.data?.length) {
            res.data.forEach(item => {
              item.hits = item.visit
            })
          }
          res.data.map(item => {
            this.resourceList = this.resourceList.concat(item.resourceList)
          })
          // this.resourceList = res.data
        }
      })
    },
    //首页推荐宣教
    hjtHeRecommend() {
      hjtHeRecommendList().then(res => {
        if (res.code === 200) {
          if (res.data?.length) {
            res.data.forEach(item => {
              item.hits = item.visit
            })
          }
          this.resourceList = res.data
        }
      })
    }
  }
}
</script>
<style scoped lang="scss">
.large {
  //   height: 100%;
}
.health-box {
  background: var(--bg-color-main);
}
</style>
