<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="睡眠"></house-header>
      <view>
        <view class="list-name">睡眠专区服务包</view>
        <servicePackageListItem :itemData="item" :isBuy="false" />
      </view>
      <view>
        <view class="list-name">{{ infoData.cateName }}</view>
        <healthEducationitem
          :resourceList="infoData.resourceList"
        ></healthEducationitem>
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
import { getCateList } from "@/api/service"
import healthEducationitem from "@/components/components/health-education/health-education-item.vue"
import servicePackageListItem from "@/components/components/service-package-list/service_package_list_item.vue"
export default {
  components: {
    healthEducationitem,
    servicePackageListItem
  },
  data() {
    return {
      infoData: {},
      isLarge: true,
      item: {
        storeName: "失眠综合治疗服务包",
        id: "1785",
        image:
          "https://hjt20220307.oss-cn-chengdu.aliyuncs.com/richTextSource/%E5%8D%8E%E5%81%A5%E9%80%9A%E5%A4%B1%E7%9C%A0%E7%BB%BC%E5%90%88%E6%B2%BB%E7%96%97%E6%9C%8D%E5%8A%A1%E5%8C%85/insomniaComprehensiveTreatmentServicePackageCover.jpg",
        productOrderInfo: {
          useDirection: "",
          healthTips: "",
          servicePackageId: ""
        }
      }
    }
  },
  onLoad() {
    this.cateList()
  },
  methods: {
    cateList() {
      let params = {
        cateId: "900"
      }
      getCateList(params).then(res => {
        if (res.code === 200) {
          if (res.data) {
            this.infoData = res.data
            if (res.data.cateId === "900") {
              this.infoData.cateName = "睡眠专区文章"
            }
          }
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-main);
}
.list-name {
  font-size: 36rpx;
  font-weight: 600;
  line-height: 25px;
  margin: 20px 32rpx 10px 32rpx;
  color: var(--text-color-main);
}
</style>
