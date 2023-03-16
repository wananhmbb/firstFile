<template>
  <view>
    <view class="list-header-title">
      <view class="list-name">{{category.label}}</view>
    </view>
    <view class="service-package-box">
<!--      <x-waterfall column="2">-->
<!--        <template v-slot:item>-->
          <servicePackageListItem
            v-for="(item, index) in productList"
            :key="index"
            :itemData="item"
            referrerId=""
            class="item-box"
          ></servicePackageListItem>
<!--        </template>-->
<!--      </x-waterfall>-->
    </view>
  </view>
</template>

<script>
import servicePackageListItem from "@/components/components/service-package-list/service_package_list_item.vue"
import { getProductslist } from "@/api/store";
export default {
  name: "good-list-item",
  components: {
    servicePackageListItem
  },
  props: {
    category: {
      type: Object,
      default: () => {
        return {}
      }
    }
  },
  data() {
    return {
      where: {
        keyword: "",
        priceOrder: "",
        salesOrder: "",
        news: 0,
        pageSize:20,
        pageNum: 1,
        cid: 0,
        type: "servicePackage"
      },
      productList: []
    }
  },
  watch: {
    category: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val && val.value) {
          this.get_product_list()
        }
     }
    }
  },
  methods: {
    //设置where条件
    setWhere: function () {
      if (this.price == 0) this.where.priceOrder = ""
      else if (this.price == 1) this.where.priceOrder = "asc"
      else if (this.price == 2) this.where.priceOrder = "desc"
      if (this.stock == 0) this.where.salesOrder = ""
      else if (this.stock == 1) this.where.salesOrder = "asc"
      else if (this.stock == 2) this.where.salesOrder = "desc"
      this.where.news = this.nows ? 1 : 0
      this.where.cid =this.category.value? this.category.value : 0;
    },
    get_product_list: function () {
      let that = this

      that.setWhere()
      // if (that.loadend) return
      // that.loading = true
      // if (that.loading) return
      // if (isPage === true) that.$set(that, "productList", [])
      // that.loading = true
      // that.loadTitle = ""
      // that.productList = []
      getProductslist(that.where)
        .then(res => {
          // that.loading = false
          let list = res.data.list
          list.forEach(item => {
            item.storeInfo = item.storeInfo ? JSON.parse(item.storeInfo) : null
          })

          let productList = that.$util.SplitArray(list, that.productList)
          // let loadend = list.length < that.where.pageSize
          // that.loadend = loadend
          // that.loadTitle = loadend ? "已全部加载" : "加载更多"
          that.$set(that, "productList", productList)
          // if (!loadend) {
          //   that.$set(that.where, "pageNum", that.where.pageNum + 1)
          // }
          // if (that.productList.length === 0) {
          // }
          // that.productList = []
        })
        .catch(err => {
          // that.loading = false
          // that.loadTitle = "加载更多"
          this.$util.Tips({
            title: err.message
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.list-header-title {
  width: 100%;
  height: 40px;
  display: flex;
  margin: 0 auto;
  justify-content: space-between;
  align-items: center;
  padding: 0 3%;
  //position: fixed;
  //left: 0;
  //right: 0;
  z-index: 15;
  background: var(--bg-color-second);
  .list-name {
    width: 50%;
    font-size: 35rpx;
    font-weight: 600;
    line-height: 40px;
    color: var(--text-color-main);
  }

}
.service-package-box  {
  display: flex;
  justify-content: space-between;
  align-items: center;
  flex-wrap: wrap;

  width: 100%;
  //grid-column-gap: 4%;
  //grid-template-columns: 40%;
  //grid-template-rows: auto;
  padding: 0 2%;
  box-sizing: border-box;
  .item-box {
    width: 48%;
    box-sizing: border-box;
  }

}
.main-content {
  // background: var(--bg-color-main);
  // height: 80vh;

  &.center {
    margin: auto;
    padding-top: 10vh;
  }

  &.loading {
    text-align: center;
    padding-top: 30vh;
  }
  &.rich-text {
    padding: 40rpx;
    z-index: 12;
  }
  &.no-data {
    width: 60vw;
  }
}
</style>
