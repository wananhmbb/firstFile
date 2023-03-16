<template>
  <theme>
    <view slot="theme" class="all">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view v-if="loading" class="loading-style">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <richTextComponent
        :htmlData="htmlData"
        v-else-if="htmlData && !loading"
      ></richTextComponent>
      <view class="no-data" v-else>
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
    </view>
  </theme>
</template>
<script>
import {getJinGangDetail} from "@/api/vajra-district"
import {detailFreeById} from "@/api/service.js"
import {VajraDistrictEnum} from '@/utils/enums/VajraDistrictEnum'
export default {
  data() {
    return {
      htmlData: "",
      id: "",
      detailsId: "",
      loading: true,
      headTitle: "",
      selectType: "" //selectType作用就是区分去查详情的时候应该采用那个接口去查询, 目前有freeHealth,默认是查询金刚区的详情接口
    }
  },
  onShareAppMessage(res) {
    let tenantId = uni.getStorageSync("tenantId")
    console.log(res, "分享")
    return {
      title: "核联医",
      path:
        "/home-sub-pages/pages/vajra-district/vajra-district-details?tenantId=" +
        tenantId +
        "&detailsId=" +
        this.detailsId, //若无path 默认跳转分享页
      imageUrl: "", //若无imageUrl 截图当前页面
      // 成功的回调
      success: res => {},
      // 失败的回调
      fail: res => {},
      // 无论成功与否的回调
      complete: res => {}
    }
  },
  onLoad(option) {
    if (option.tenantId) {
      this.tenantId = option.tenantId
      this.$store.commit("getenants", this.tenantId)
    }
    if (option.selectType) {  //selectType作用就是区分去查详情的时候应该采用那个接口去查询, 目前有freeHealth,默认是查询金刚区的详情接口
      this.selectType = option.selectType
    }
    if (option.id) {
      wx.showShareMenu({
        withShareTicket: true,
        menus: ["shareAppMessage"]
      })
      this.id = option.id
      if (this.$store.state.server.vajraDistrictDictionaries) {
        this.loading = false
        let vajraDistrictDictionaries =
          this.$store.state.server.vajraDistrictDictionaries
        vajraDistrictDictionaries.map(item => {
          if (item.dictValue === this.id) {
            this.htmlData = item.remark
            this.headTitle = decodeURIComponent(item.dictLabel)
          }
        })
      }
    }
    if (option.detailsId) {
      this.detailsId = option.detailsId
      this.getJinGangDetailList()
    }
  },
  methods: {
    getJinGangDetailList() {
      if (this.selectType === VajraDistrictEnum.FREE_HEALTH) {
        this.detailFreeByIdMethods()
      } else {
        this.getJinGangDetailMethods()
      }
    },
    //通过详情id查询金刚区配置
    getJinGangDetailMethods() {
      getJinGangDetail(this.detailsId).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.htmlData = res.data.extra.content
          this.headTitle = res.data.name
        }
      })
    },
    //通过详情id查询免费健康教育
    detailFreeByIdMethods() {
      detailFreeById(this.detailsId)
        .then(res => {
          this.loading = false
          if (res.code == 200 && res.data) {
            this.htmlData = res.data.content
            this.headTitle = res.data.title
          }
        })
        .catch(e => {
          console.log(e)
          this.loading = false
        })
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
.loading-style {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0);
  width: 50vw;
  height: 200rpx;
  z-index: 100;
  border-radius: 20rpx;
  line-height: 150rpx;
  text-align: center;
}
.no-data {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 150rpx;
  width: 70vm;
  .no-data-text {
    width: 100%;
    text-align: center;
    margin-top: 30rpx;
    color: var(--text-color-grey);
  }
}
</style>
