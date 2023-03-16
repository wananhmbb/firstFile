<template>
  <view class="large">
    <view v-if="productList && productList.length > 0">
      <u-cell-group :border="border">
        <u-cell-item
          v-if="leftTitle === '特色服务'"
          :bg-color="bgColor ? bgColor : 'var(--bg-color-second)'"
          :border="border"
          :border-bottom="border"
          :title="leftTitle"
          :arrow="false"
          :title-style="titleStyle"
        ></u-cell-item>
        <u-cell-item
          v-else
          :bg-color="bgColor ? bgColor : 'var(--bg-color-second)'"
          :border="border"
          :border-bottom="border"
          :title="leftTitle"
          :arrow="true"
          arrow-direction="right"
          :value="value"
          :title-style="titleStyle"
          @click="goShoppingMallList"
        ></u-cell-item>
      </u-cell-group>
    </view>
    <!-- 健康包列表的item -->
    <view
      v-if="productList && productList.length > 0"
      class="service-package-list-item"
    >
      <servicePackageListItem
        :serveBackgroundItem="serveBackgroundItem"
        v-for="(item, index) in productList"
        :key="index"
        :itemData="item"
      ></servicePackageListItem>
    </view>

    <view class="loading-box" v-if="show">
      <u-loading
        mode="circle"
        :show="show"
        size="100"
        color="var(--theme-color-dark-blue)"
      ></u-loading>
    </view>
  </view>
</template>
<script>
import {
  getCategoryList, // 获取分类列表
  getProductsHotlist,
  getProductsRecommendlist
} from "@/api/store.js"
import servicePackageListItem from "@/components/components/service-package-list/service_package_list_item.vue"
export default {
  data() {
    return {
      value: "更多",
      border: false,
      titleStyle: {
        fontSize: "34rpx",
        fontWeight: 600,
        color: "var(--text-color-main)",
        lineLeight: " 25px"
      },
      where: {
        keyword: "",
        priceOrder: "",
        salesOrder: "",
        news: 0,
        page: 1,
        limit: 20,
        cid: 0,
        type: "servicePackage"
      },
      title: "",
      productList: [],
      show: false
    }
  },
  props: {
    bgColor: {
      type: String,
      default: ""
    },
    serveBackgroundItem: {
      type: String,
      default: "var(--bg-color-secondhome)"
    },
    leftTitle: {
      type: String,
      default: ""
    }
  },
  components: {
    servicePackageListItem
  },
  created() {
    this.getProductsCategoryList()
  },
  methods: {
    goShoppingMallList() {
      this.$Router.push({ path: "/goodsList" })
    },
    // 根据传过来分类列表中cid以及标题去搜索相关的商品
    findProductsByCategory(options) {
      this.$set(this.where, "cid", options.cid || 0)
      this.title = options.title || ""
      this.$set(this.where, "keyword", options.searchValue || "")
      if (this.leftTitle === "特色服务") {
        this.getRecommendlist(true)
      } else {
        this.get_product_list(true)
      }
    },
    // 获取分类列表
    getProductsCategoryList() {
      if (this.leftTitle === "特色服务") {
        this.isNeedTenantId = false
      } else {
        this.isNeedTenantId = true
      }
      this.show = true
      getCategoryList(this.isNeedTenantId)
        .then(res => {
          if (res.code == 200) {
            if (res.data.length > 0) {
              let categoryList = res.data[1].child ? res.data[1].child : ""
              let obj = {
                cid: res.data[1].id,
                title: categoryList ? categoryList[0].name : ""
              }
              this.findProductsByCategory(obj)
            } else {
              this.productList = []
            }
            this.show = false
          } else {
            this.show = false
            this.productList = []
          }
        })
        .catch(err => {
          this.show = false
          console.error(err)
          // this.$util.Tips({
          //   title: err.message
          // })
        })
    },
    //获取当前租户推荐商品列表
    get_product_list: function () {
      let that = this
      that.$set(that, "productList", [])

      getProductsHotlist(that.where)
        .then(res => {
          that.show = false
          that.$emit("show", that.show)

          if (res.code == 200) {
            let list = res.data.list
            let productList = that.$util.SplitArray(list, that.productList)
            productList.forEach(item => {
              item.storeInfo = item.storeInfo
                ? JSON.parse(item.storeInfo)
                : null
            })

            that.$set(that, "productList", productList)
          } else {
            that.$util.Tips({
              title: res.message
            })
          }
        })
        .catch(err => {
          that.show = false
          console.error(err)
        })
    },
    //获取平台推荐商品列表
    getRecommendlist() {
      let that = this
      that.$set(that, "productList", [])
      getProductsRecommendlist(that.where)
        .then(res => {
          that.show = false
          that.$emit("show", that.show)
          if (res.code == 200) {
            let list = res.data.list
            let productList = that.$util.SplitArray(list, that.productList)
            productList.forEach(item => {
              item.storeInfo = item.storeInfo
                ? JSON.parse(item.storeInfo)
                : null
            })
            that.$set(that, "productList", productList)
          } else {
            that.$util.Tips({
              title: res.message
            })
          }
        })
        .catch(err => {
          that.show = false
          console.error(err)
        })
    }
  }
}
</script>
<style scoped lang="scss">
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
.service-package-list-item {
  padding-bottom: 20rpx;
}
.large {
  margin-top: 20rpx;
}
.noCommodity {
  background-color: var(--bg-color-main);
  padding-bottom: 30rpx;
  margin-top: 172rpx;
}
.noCommodity .pictrue {
  position: relative;
  width: 414rpx;
  margin: 0 auto;
  height: 335rpx;
}
</style>
