<template>
  <theme>
    <view slot="theme" class="large" @click="closeLdropdownitem">
      <house-header :headTypeTwo="headTypeTwo"></house-header>
      <view>
        <!--        <view class="list-header">-->

        <!--          <view class="dropdownBox">-->
        <!--            <Ldropdown-->
        <!--              class="u-dropdown"-->
        <!--              :active-color="activeColor"-->
        <!--              :inactive-color="inactiveColor"-->
        <!--            >-->
        <!--              <Ldropdownitem-->
        <!--                ref="LdropdownitemRef"-->
        <!--                class="dropdown-item"-->
        <!--                height="75vh"-->
        <!--                v-model="id"-->
        <!--                :title="currentCategroy.label"-->
        <!--                :options="categoryList"-->
        <!--                @change="changeCategroy"-->
        <!--              ></Ldropdownitem>-->
        <!--            </Ldropdown>-->
        <!--          </view>-->
        <!--        </view>-->
        <!--        <view class="list-header-box"></view>-->
<!--        <view-->
<!--          class="main-content center loading">-->


<!--          <u-loading-->
<!--            mode="circle"-->
<!--            size="100"-->
<!--            color="var(&#45;&#45;theme-color-dark-blue)"-->
<!--          ></u-loading>-->
<!--        </view>-->

        <scroll-view
          v-if="!currentCategroy.extra"
          class="main-content"
          :style="{
            height:
              'calc( 100vh - ' +
              $store.state.theme.mescrollUniHeight +
              ' - 140rpx - env(safe-area-inset-bottom)' +
              ')'
          }"
          scroll-y="true"
        >
          <goodListItem   v-for="(item,index) in categoryList" :key="index" :category="item"/>
          <!--          <view class="list-header-title">-->
          <!--            <view class="list-name">胸部CT</view>-->
          <!--          </view>-->
          <!--          <view >-->
          <!--            <x-waterfall column="2">-->
          <!--              <template v-slot:item>-->
          <!--                <servicePackageListItem-->
          <!--                  v-for="(item, index) in productList"-->
          <!--                  :key="index"-->
          <!--                  :itemData="item"-->
          <!--                  :referrerId="referrerId"-->
          <!--                ></servicePackageListItem>-->
          <!--              </template>-->
          <!--            </x-waterfall>-->
          <!--          </view>-->

          <view class="loadingicon flex">
            {{ loadTitle }}
          </view>
        </scroll-view>
        <view class="main-content rich-text" v-else-if="currentCategroy.extra">
          <rich-text-component
            height="100%"
            :html-data="currentCategroy.extra"
          ></rich-text-component>
        </view>
<!--        <view class="main-content center no-data" v-else>-->
<!--          <x-icon iconName="noShopper"></x-icon>-->
<!--        </view>-->
      </view>
    </view>
  </theme>
</template>

<script>
import {
  getCategoryList, // 获取分类列表
  //getProductslist,
  bindReferrerId
} from "@/api/store.js"
import store from "@/store"
import goodListItem from "@/pages/shopping-mall/goods_list/components/good-list-item"
//import servicePackageListItem from "@/components/components/service-package-list/service_package_list_item.vue"
import {mapGetters} from "vuex"
// import { Ldropdown } from "@/pages/shopping-mall/goods_list/components/u-dropdown/u-dropdown.vue"
// import { Ldropdownitem } from "@/pages/shopping-mall/goods_list/components/u-dropdown-item/u-dropdown-item.vue"
import richTextComponent from "@/components/components/rich-text-component.vue"
import {basicUser} from "@/utils/user-class/basicUser"

export default {
  computed: mapGetters(["uid"]),
  components: {
    //servicePackageListItem,
    goodListItem,
    richTextComponent
    // Ldropdown,
    // Ldropdownitem
  },

  data() {
    return {
      headTypeTwo: "",
      showOpen: false,
      productList: [],
      is_switch: true,
      // where: {
      //   keyword: "",
      //   priceOrder: "",
      //   salesOrder: "",
      //   news: 0,
      //   pageSize: 10,
      //   pageNum: 1,
      //   cid: 0,
      //   type: "servicePackage"
      // },
      price: 0,
      stock: 0,
      nows: false,
      loadend: false,
      loading: false,
      loadTitle: "加载更多",
      title: "",
      hostProduct: [],
      // hotPage: 1,
      // hotLimit: 10,
      hotScroll: false,
      categoryList: [], //产品分类列表的数据
      isExpandList: false, // 是否展开分类列表， 默认是不展开
      id: 0,
      currentCategroy: {
        id: 0,
        label: "全部",
        value: 0
      }, //当前的分类
      categoryValue: 0,
      activeColor: "var(--theme-color-dark-blue)",
      inactiveColor: "var(--text-color-main)",
      referrerId: "", //推荐人id
      defaultCategoryList: []
    }
  },
  onLoad: function (options) {
    uni.hideLoading()
    options = this.$Route.query
    if (options.categoryList) {
      this.defaultCategoryList =options.categoryList
    }
    if (options.categoryId) {
      this.id = options.categoryId
      let Obj = {
        cid: options.categoryId
      }
      // this.findProductsByCategory(Obj)
    }
    if (options.scene) {
      this.referrerId = options.scene
      if (!store.state.user.isLogin) {
        this.toLoginPage()
      }
    }
    if (options.headTypeTwo) {
      this.headTypeTwo = options.headTypeTwo
    } else {
      this.headTypeTwo = "CT"
    }
    this.getProductsCategoryList(options) //获取分类列表 //项目中新增
    // this.findProductsByCategory(options)
  },

  methods: {
    closeLdropdownitem() {
      // this.$refs.LdropdownitemRef.close()

      // this.$children.close()
    },
    // 根据传过来分类列表中cid以及标题去搜索相关的商品
    // findProductsByCategory(options) {
    //   // console.log(options, "传过来的值")
    //   this.$set(this.where, "cid", options.cid === 0 ? "" : options.cid)
    //   this.title = options.title || ""
    //   this.$set(this.where, "keyword", options.searchValue || "")
    //   this.loadend = false
    //   // this.get_product_list()
    // },
    // 获取分类列表
    getProductsCategoryList(options) {
      getCategoryList()
        .then(res => {
          let arr = []
          res.data.forEach(item => {
            if (item.id === "741") {
              arr = item.child
            }
          })
          // let arr = res.data[2].child
          let categoryArr = []
          arr.forEach(item => {
            console.log(this.defaultCategoryList)
            if (this.defaultCategoryList.includes(item.id)) {
              let obj = {
                id: item.id,
                label: item.name,
                value: item.id
              }
              categoryArr.push(Object.assign(item, obj))
            }
          })
          this.categoryList = categoryArr
          // this.categoryList.unshift({
          //   id: 741,
          //   label: "全部",
          //   value: 741
          // })

          // let obj = {
          //   cid: this.categoryList[0].id,
          //   label: this.categoryList[0].name,
          //   value: this.categoryList[0].id
          // }
          //
          // if (
          //   options.categoryId &&
          //   this.categoryList &&
          //   this.categoryList.length > 0
          // ) {
          //   this.categoryList.forEach(item => {
          //     if (item.id == options.categoryId) {
          //       this.currentCategroy = item
          //       this.id = this.currentCategroy.id
          //     }
          //   })
          //   return
          // } else {
          //   this.currentCategroy = this.categoryList[0]
          //   this.id = this.currentCategroy.id
          //   this.productList = []
          // }
          // this.findProductsByCategory(obj)
        })
        .catch(err => {
          console.error("获取产品的分类失败", err)
        })
    },
    // 展开分类列表
    expandCategoryList() {
      this.isExpandList = !this.isExpandList
    },
    // 改变分类
    changeCategroy(value) {
      let arr = this.categoryList
      arr.forEach(item => {
        if (item.value == value) {
          this.currentCategroy = item
          this.id = this.currentCategroy.id
          return
        }
      })

      let Obj = {
        cid: this.currentCategroy.id,
        label: this.currentCategroy.name,
        value: this.currentCategroy.id
      }
      // this.findProductsByCategory(Obj)
      this.isExpandList = !this.isExpandList
      this.where.pageNum = 1
      this.productList = []
    },
    // 去详情页
    godDetail(item) {
      uni.navigateTo({
        url: `/pages/shopping-mall/goods_details/index?id=${item.id}`
      })
    },

    // //设置where条件
    // setWhere: function () {
    //   if (this.price == 0) this.where.priceOrder = ""
    //   else if (this.price == 1) this.where.priceOrder = "asc"
    //   else if (this.price == 2) this.where.priceOrder = "desc"
    //   if (this.stock == 0) this.where.salesOrder = ""
    //   else if (this.stock == 1) this.where.salesOrder = "asc"
    //   else if (this.stock == 2) this.where.salesOrder = "desc"
    //   this.where.news = this.nows ? 1 : 0
    // },
    //查找产品
    // get_product_list: function (isPage) {
    //   let that = this
    //
    //   that.setWhere()
    //   if (that.loadend) return
    //   that.loading = true
    //   // if (that.loading) return
    //   if (isPage === true) that.$set(that, "productList", [])
    //   that.loading = true
    //   that.loadTitle = ""
    //   // that.productList = []
    //   getProductslist(that.where)
    //     .then(res => {
    //       that.loading = false
    //       let list = res.data.list
    //       list.forEach(item => {
    //         item.storeInfo = item.storeInfo ? JSON.parse(item.storeInfo) : null
    //       })
    //
    //       let productList = that.$util.SplitArray(list, that.productList)
    //       let loadend = list.length < that.where.pageSize
    //       that.loadend = loadend
    //       that.loadTitle = loadend ? "已全部加载" : "加载更多"
    //       that.$set(that, "productList", productList)
    //       if (!loadend) {
    //         that.$set(that.where, "pageNum", that.where.pageNum + 1)
    //       }
    //       // if (that.productList.length === 0) {
    //       // }
    //       // that.productList = []
    //     })
    //     .catch(err => {
    //       that.loading = false
    //       that.loadTitle = "加载更多"
    //       this.$util.Tips({
    //         title: err.message
    //       })
    //     })
    // },
    //去登录
    toLoginPage() {
      basicUser.logoutRemoveStorageSync()
      store.commit("SET_IS_LOGIN_PAGE", true)
      uni.navigateTo({
        url: "/page/login/index"
      })
    },
    bindId() {
      let data = {
        bindId: this.referrerId
      }
      bindReferrerId(data)
        .then(res => {
          console.log(res, "绑定推荐人")
        })
        .catch(err => {
          console.error(err)
        })
    }
  },
  watch: {
    "$store.state.user.isLogin": {
      immediate: true,
      handler(val) {
        if (val) {
          this.bindId()
        }
      }
    }
  },

  onPullDownRefresh() {},
  onReachBottom() {
    if (this.productList.length > 0) {
      // this.get_product_list()
    }
  }
}
</script>

<style scoped lang="scss">
.large {
  background: var(--bg-color-second);
  min-height: 100vh;
  // background: var(--bg-color-second);
}
//.list-header-title {
//  width: 100%;
//  height: 70px;
//  display: flex;
//  margin: 0 auto;
//  justify-content: space-between;
//  align-items: center;
//  padding: 0 3%;

//  background: var(--bg-color-second);
//}
//.list-header-box {
//  width: 100%;
//  height: 70px;
//}
//.dropdown-item {
//  width: 300rpx;
//}
///deep/ .u-dropdown__menu {
//  .u-flex {
//    justify-content: flex-end;
//    width: 100%;
//    background: rgba($color: #000000, $alpha: 0);
//  }
//}
///deep/ .u-dropdown-item {
//  scroll-view {
//    width: 100%;
//    display: flex;
//    justify-content: flex-end;
//  }
//}
///deep/ .u-cell {
//  padding: 15rpx 20rpx !important;
//}
///deep/ .u-dropdown__content__mask {
//  width: 0 !important;
//  height: 0 !important;
//}
// /deep/ .u-dropdown-item__options {
//   border-left: 1px solid !important;
//   border-right: 1px solid !important;
// }
///deep/ .u-dropdown-item__options {
//  width: 200rpx;
//  float: right;
//}

.u-down-icon {
  display: inline-block;
  margin-left: 10rpx;
}

//.dropdownBox {
//  width: 30%;
//}
//.popup-position {
//  vertical-align: middle;
//  .image {
//    width: 16rpx;
//    height: 16rpx;
//    vertical-align: middle;
//    margin-left: 10rpx;
//  }
//}
//
//.popup-position {
//  position: relative;
//  text {
//    color: var(--text-color-grey);
//  }
//}
//.classification-position {
//  width: 200rpx;
//  position: absolute;
//  top: 40rpx;
//  right: 4%;
//  z-index: 9;
//  max-height: 800rpx;
//  overflow: auto;
//  transition: height 0.5s;
//  border-radius: 15rpx;
//  border: 1px solid var(--bd-color-main);
//}
//.classification-position-close {
//  height: 0;
//}

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

//.categoryList-item {
//  width: 100%;
//  // background: var(--bg-color-main);
//  padding: 10rpx;
//  text-align: center;
//  color: var(--text-color-grey);
//  border-bottom: 2rpx solid var(--bd-color-main);
//}
.flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}

//.listBox {
//  padding: 20px 15px;
//  margin-top: 300rpx;
//}

.loadingicon {
  color: var(--text-color-grey);
}
</style>
