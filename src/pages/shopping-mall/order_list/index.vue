<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="我的订单" id="orderList"></house-header>
      <view class="my-order">
        <u-tabs
          bg-color="var(--bg-color-main)"
          :list="list"
          :is-scroll="false"
          :current="current"
          @change="statusClick"
          active-color="var(--text-color-main)"
          inactive-color="#9699a6"
        ></u-tabs>
        <view>
          <mescroll-uni
            @down="downCallback"
            @up="upCallback"
            :down="downOption"
            :up="upOption"
            :top="MescrollTop"
            @init="initScroll"
            ref="mescrollRef"
            v-if="orderList && orderList.length > 0"
          >
            <view class="list">
              <view
                class="item"
                v-for="(item, index) in orderList"
                :key="item.orderId"
                @click="goOrderDetails(item.orderId, item.paid, item.addressId)"
              >
                <view class="item-large">
                  <view class="title acea-row row-between-wrapper flex-item">
                    <view class="acea-row row-middle">
                      <view class="orderId"
                        ><text class="order-id">订单:</text
                        >{{ item.orderId }}</view
                      >
                    </view>
                    <view
                      :class="[
                        'font-color',
                        item.orderStatus == '待支付' ? 'not-pay' : ''
                      ]"
                      >{{ item.orderStatus }}</view
                    >
                  </view>
                  <view
                    class="item-info acea-row row-between row-top flex-center"
                    v-for="(items, index) in item.orderInfoList"
                    :key="index"
                  >
                    <view class="pictrue">
                      <image :src="items.image" mode="widthFix"></image>
                    </view>
                    <view class="text acea-row row-between flex-col-item">
                      <view class="name line2 storeName">{{
                        items.storeName
                      }}</view>
                      <view class="package-description">{{
                        items.storeInfo &&
                        JSON.parse(items.storeInfo) &&
                        JSON.parse(items.storeInfo)[0] &&
                        JSON.parse(items.storeInfo)[0].useDirection
                          ? JSON.parse(items.storeInfo)[0].useDirection
                          : ""
                      }}</view>
                      <!-- <view class="package-description">{{
                        item.productOrderInfo.teamName || ""
                      }}</view> -->
                      <view class="money flex-row-item">
                        <view>x{{ items.cartNum }}</view>
                        <view class="item-price">￥{{ items.price }}</view>
                      </view>
                    </view>
                  </view>
                  <view class="totalPrice">
                    {{ item.paid ? "实付款:" : "应付款:" }}

                    <text class="money font-color-money"
                      >￥{{ item.payPrice }}</text
                    >
                  </view>
                </view>
                <view
                  class="bottom acea-row row-right row-middle flex-right"
                  v-if="
                    item.status === 3 &&
                    item.orderStatus !== '已开发票' &&
                    item.orderStatus === '已完成'
                  "
                >
                  <!-- <view v-if="item.orderStatus === '已开发票'">已开发票</view> -->
                  <view class="bnt pay" @click.stop="goInvoicing(item)"
                    >去开票</view
                  >
                </view>
                <view
                  class="bottom acea-row row-right row-middle flex-right"
                  v-if="!item.paid && !item.orderId.includes('New')"
                >
                  <view
                    class="bnt cancelBnt"
                    v-if="!item.paid"
                    @click.stop="opencancelModel(index, item.id)"
                    >撤销订单</view
                  >
                  <view
                    class="bnt pay"
                    v-if="!item.paid"
                    @click.stop="
                      goPay(index, item.id, item.payPrice, item.orderId)
                    "
                    >立即支付</view
                  >
                </view>
                <view class="bottom acea-row row-right row-middle flex-right">
                  <view
                    class="bnt cancelBnt"
                    v-if="
                      item.paid &&
                      (item.status === 0 || item.status === 1) &&
                      item.refundStatus === 0 &&
                      item.productOrderInfo.productCategory == OrderEnum.PRODUCT
                    "
                    @click.stop="refund(index, item.orderId)"
                    >申请退款</view
                  >
                  <view
                    class="bnt pay"
                    v-if="
                      item.status === 1 &&
                      item.refundStatus === 0 &&
                      item.productOrderInfo.productCategory == OrderEnum.PRODUCT
                    "
                    @click.stop="viewCurrentLogistics(item.orderId)"
                  >
                    查看物流
                  </view>
                  <view
                    class="bnt pay"
                    @click.stop="receiving(index, item.id)"
                    v-if="
                      item.status === 1 &&
                      item.refundStatus === 0 &&
                      item.productOrderInfo.productCategory == OrderEnum.PRODUCT
                    "
                    >确认收货</view
                  >
                </view>
              </view>
            </view>
          </mescroll-uni>
          <view class="loading-box" v-if="loading">
            <u-loading
              mode="circle"
              :show="loading"
              size="100"
              color="var(--theme-color-dark-blue)"
            ></u-loading>
          </view>
        </view>
      </view>
      <view class="noCart" v-if="orderList.length == 0 && !loading">
        <view class="pictrue">
          <x-icon iconName="no-order" class="order"></x-icon>
        </view>
      </view>
      <payment
        :payMode="payMode"
        :pay_close="pay_close"
        @onChangeFun="onChangeFun"
        :order_id="pay_order_id"
        :totalPrice="totalPrice"
      ></payment>
      <renewPayment
        ref="renewPayment"
        @onChangeFun="onChangeFun"
      ></renewPayment>
      <view class="loginMask" v-if="loginBoxShow">
        <view class="login-box">
          <modelShowChart />
        </view>
      </view>
      <u-modal
        v-model="show"
        :content="content"
        @confirm="confirmModel"
        @cancel="cancalModel"
        :show-cancel-button="showCancelButton"
      ></u-modal>
      <u-modal
        v-model="cancelOrderShow"
        :content="orderContent"
        @confirm="cancelConfirmModel"
      ></u-modal>
    </view>
  </theme>
</template>

<script>
import {
  getOrderList,
  orderData,
  orderCancel,
  orderDel,
  receivingApi,
  getOrderInfoApi
} from "@/api/order.js"
import payment from "@/components/payment"
import renewPayment from "@/components/renew-payment/index.vue"
import modelShowChart from "@/pages/login/model-show-chart.vue"
import { mapGetters } from "vuex"
// import { OrderEnum } from "@/pages/shopping-mall/order_list/enum/orderType"

export default {
  components: {
    payment,
    renewPayment,
    modelShowChart
  },
  data() {
    return {
      loginBoxShow: false,
      loading: false,
      MescrollTop: 600,
      loadend: false, //是否加载完毕
      loadTitle: "加载更多", //提示语
      orderList: [], //订单数组
      orderData: {}, //订单详细统计
      orderStatus: -1, //订单状态
      page: 1,
      limit: 10,
      modelType: 0, //0 撤销订单， 1 收货
      downOption: {
        offset: 40, // 下拉刷新时的偏移位置
        textSuccess: "加载成功",
        textOutOffset: "释放更新",
        textLoading: "加载中...",
        use: true,
        auto: false,
        fps: 10 // 节流设置
      },
      upOption: {
        use: true,
        auto: false,
        bgColor: "var(--bg-color-second)",
        textColor: "var(--text-color-grey",
        textLoading: "加载中",
        textNoMore: "已全部加载",
        offset: 40,
        noMoreSize: 10,
        empty: {
          warpId: null,
          icon: null,
          tip: "暂无相关数据~",
          btntext: "",
          btnClick: null,
          supportTap: false
        }
      },
      payMode: [
        {
          name: "微信支付",
          icon: "icon-weixinzhifu",
          value: "weixin",
          title: "微信快捷支付"
        }
      ],
      pay_close: false,
      pay_order_id: "",
      totalPrice: "0",
      isAuto: false, //没有授权的不会自动授权
      isShowAuth: false, //是否隐藏授权
      toLogin: true,
      mescroll: "",
      mescrollType: "up",
      show: false,
      content: "确认撤销订单吗？",
      cancelOrderShow: false,
      orderContent: "",
      showCancelButton: true,
      orderInfo: {},
      current: 0,
      list: [
        {
          name: "全部",
          orderStatus: -1
        },
        {
          name: "待付款",
          orderStatus: 0
        }
      ],
      payFileOrderInfo: {},
      OrderEnum: {
        PRODUCT: "product", //实物商品
        CONSULT: "consult", //咨询
        SERVICE_PACKAGE: "servicePackage"
      }
    }
  },
  watch: {
    "$store.state.user.isOrderLoginPage": {
      immediate: true,
      handler(val) {
        // console.log(val, "是否在订单页登录")
        if (val === true) {
          this.loginBoxShow = false
          this.loadend = false
          this.page = 1
          this.getOrderData()
          this.getOrderList()
          // this.payMode[1].number = this.userInfo.nowMoney
          this.$set(this, "payMode", this.payMode)
          setTimeout(() => {
            this.$store.commit("SET_IS_Order_LOGIN_PAGE", false)
          }, 1000)
        }
      }
    }
  },
  computed: mapGetters(["userInfo"]),
  onShow() {
    //判断是否登录
    let isLogin = this.$store.state.user.isLogin
    if (isLogin) {
      this.loginBoxShow = false
      this.loading = true
      this.loadend = false
      this.page = 1
      this.$set(this, "orderList", [])
      this.getOrderData()
      this.getOrderList()
      // this.payMode[1].number = this.userInfo.nowMoney
      this.$set(this, "payMode", this.payMode)
    } else {
      this.loginBoxShow = true
      console.log("没有登录")
    }
  },
  created() {
    var obj = uni.getMenuButtonBoundingClientRect()
    let top = obj.top
    let height = obj.height
    this.MescrollTop = top + height + 5 + 160
  },
  methods: {
    initScroll(mescroll) {
      this.mescroll = mescroll
    },
    downCallback() {
      this.page = 1
      this.mescrollType = "down"
      this.loadend = false
      this.loading = false

      this.getOrderList()
    },
    upCallback() {
      this.mescrollType = "up"
      // this.loading = true

      if (!this.loadend) {
        this.page = this.page + 1
        this.getOrderList()
      } else {
        this.mescroll.endUpScroll(true)
      }
      // this.getOrderList()
      // console.log("触发没有")
    },
    onLoadFun() {
      this.getOrderData()
      this.getOrderList()
    },
    // 授权关闭
    authColse: function (e) {
      this.isShowAuth = e
    },
    /**
     * 事件回调
     *
     */

    onChangeFun: function (e) {
      let opt = e
      let action = opt.action || null
      let value = opt.value != undefined ? opt.value : null
      let msg = opt.msg != undefined ? opt.msg : null
      action && this[action] && this[action](msg, value)
    },
    /**
     * 关闭支付组件
     *
     */

    payClose: function () {
      this.pay_close = false
    },
    /**
     * 生命周期函数--监听页面加载
     */
    onLoad: function (options) {
      if (options.status) {
        if (options.status >= 0) {
          this.orderStatus = options.status
        } else {
          this.orderStatus = -1
        }
      }
      // this.orderStatus = options.status
    },
    /**
     * 获取订单统计数据
     *
     */
    getOrderData: function () {
      let that = this
      orderData().then(res => {
        that.$set(that, "orderData", res.data)
      })
    },
    /**
     * 去查看物流
     */
    viewCurrentLogistics(orderId) {
      getOrderInfoApi(orderId).then(res => {
        if (res.code === 200) {
          wx.navigateTo({
            url: `plugin://kdPlugin/index?num=${res.data.deliveryId}&appName=新凯云杰开发3&title=物流信息&return=0&rss=0`
          })
        }
      })
    },
    /**
     * 确认收货
     */
    receiving(index, id) {
      this.show = true
      this.content = "确认收货"
      this.modelType = 1
      this.orderInfo = {
        index: index,
        order_id: id
      }

      // receivingApi(orderId)
      //   .then(res => {
      //     if (res.code === 200) {
      //       this.$util.Tips({
      //         title: "收货成功",
      //         icon: "success"
      //       })
      //     } else {
      //       this.$util.Tips({
      //         title: "收货失败",
      //         icon: "error"
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     this.$util.Tips({
      //       title: "收货失败",
      //       icon: "error"
      //     })
      //     console.error(err)
      //   })
    },
    /**
     * 申请退款
     */
    refund(index, orderId) {
      this.$Router.push({
        path: "/refund",
        query: {
          orderId: orderId
        }
      })
      // this.modelType = 1
      // this.show = true
      // this.content = "确定要申请退款？"
      // this.orderInfo = {
      //   index: index,
      //   order_id: orderId
      // }
    },
    finishOrder(id) {
      receivingApi(id)
        .then(res => {
          if (res.code === 200) {
            this.loadend = false
            this.page = 1
            this.$set(this, "orderList", [])
            this.getOrderList()
            this.$util.Tips({
              title: "收货成功",
              icon: "success"
            })
          } else {
            this.$util.Tips({
              title: "收货失败",
              icon: "error"
            })
          }
        })
        .catch(err => {
          this.$util.Tips({
            title: "收货失败",
            icon: "error"
          })
          console.error(err)
        })
    },

    // 取消订单的弹窗
    opencancelModel(index, order_id) {
      this.orderInfo = {}
      this.orderInfo = {
        index: index,
        order_id: order_id
      }
      this.modelType = 0
      this.show = true
      this.content = "确认撤销订单吗？"
    },

    confirmModel() {
      this.show = false
      if (this.modelType === 0) {
        this.cancelOrder(this.orderInfo.index, this.orderInfo.order_id)
      } else {
        this.finishOrder(this.orderInfo.order_id)
      }
    },
    cancalModel() {
      this.show = false
    },
    cancelConfirmModel() {
      this.cancelOrderShow = false
      this.cancelOrder(
        this.payFileOrderInfo.index,
        this.payFileOrderInfo.order_id
      )
    },

    //去开票
    goInvoicing(item) {
      console.log(item, "去开票")
      this.$Router.push({
        name: "goodsInvoicing",
        params: {
          price: item.payPrice,
          IsSumbitButtonShow: true,
          orderId: item.orderId
        }
      })
    },
    /**
     * 取消订单
     *
     */
    cancelOrder: function (index, order_id) {
      let that = this
      if (!order_id)
        return that.$util.Tips({
          title: "缺少订单号无法取消订单"
        })
      uni.showLoading({
        title: "正在撤销中"
      })
      orderCancel(order_id)
        .then(res => {
          return that.$util.Tips(
            {
              title: "撤销成功",
              icon: "success"
            },
            function () {
              that.orderList.splice(index, 1)
              that.$set(that, "orderList", that.orderList)
              that.$set(
                that.orderData,
                "unpaid_count",
                that.orderData.unpaid_count - 1
              )
              that.getOrderData()
            }
          )
        })
        .catch(err => {
          return that.$util.Tips({
            title: err.message
          })
        })
    },
    /**
     * 打开支付组件
     *
     */
    goPay(index, id, pay_price, order_id) {
      // console.log(index, id, pay_price, order_id, "立即支付")
      if (order_id.includes("orderNew")) {
        this.$refs["renewPayment"].goPay(this.servicePackageId)
      } else {
        this.payFileOrderInfo.index = index
        this.payFileOrderInfo.order_id = id
        this.$set(this, "pay_close", true)
        this.$set(this, "pay_order_id", order_id)
        this.$set(this, "totalPrice", pay_price)
      }
    },
    /**
     * 支付成功回调
     *
     */
    pay_complete: function () {
      this.loadend = false
      this.page = 1
      this.$set(this, "orderList", [])
      this.$set(this, "pay_close", false)
      this.getOrderData()
      this.getOrderList()
    },
    /**
     * 支付失败回调
     *
     */
    pay_fail: function (msg) {
      this.loadend = false
      this.pay_close = false
      // this.cancelOrderShow = true
      // this.orderContent = msg
    },
    /**
     * 去订单详情
     */
    goOrderDetails: function (order_id, paid, addressId) {
      let that = this
      if (!order_id)
        return that.$util.Tips({
          title: "缺少订单号无法查看订单详情"
        })
      // #ifdef MP
      uni.showLoading({
        title: "正在加载"
      })
      uni.navigateTo({
        url:
          "/pages/shopping-mall/order_details/index?order_id=" +
          order_id +
          "&paid=" +
          paid +
          "&addressId=" +
          addressId
      })
      // openOrderSubscribe()
      //   .then(() => {
      //     uni.hideLoading()
      //     uni.navigateTo({
      //       url: "/pages/shopping-mall/order_details/index?order_id=" + order_id
      //     })
      //   })
      //   .catch(() => {
      //     uni.hideLoading()
      //   })
      //#endif
      // #ifndef MP
      //   uni.navigateTo({
      //     url: "/pages/order_details/index?order_id=" + order_id
      //   })
      // #endif
    },
    /**
     * 切换类型
     */
    statusClick: function (status) {
      this.$set(this, "orderList", [])
      this.page = 1
      this.current = status

      // if (status == this.orderStatus) return
      if (status > 0) {
        this.orderStatus = status - 1
      } else {
        this.orderStatus = -1
      }

      this.loadend = false
      this.page = 1
      // this.orderList = []

      this.$nextTick(() => {
        this.getOrderList()
      })
    },
    /**
     * 获取订单列表
     */
    async getOrderList() {
      let that = this

      try {
        let res = await this.setNewData(that)

        this.setData(that, res)
      } catch (err) {
        console.error(err)
      }

      // let that = this
      // if (this.mescrollType === "down" || that.page > 1) {
      //   that.loading = false
      // } else {
      //   that.loading = true
      // }

      // that.loadTitle = "加载更多"
      // let params = {
      //   type: that.orderStatus >= 0 ? that.orderStatus : "",
      //   page: that.page,
      //   limit: that.limit
      // }
      // getOrderList(params)
      //   .then(res => {
      //     if (res.code == 200) {
      //       if (that.page == 1) {
      //         this.$set(this, "orderList", [])
      //       }
      //       that.setData(that, res)
      //     } else {
      //       that.loading = false
      //       return that.$util.Tips({
      //         title: "获取数据失败"
      //       })
      //     }
      //   })
      //   .catch(err => {
      //     that.loading = false
      //     if (that.mescroll) {
      //       this.mescroll.endErr()
      //     }
      //     console.error(err)
      //     // return that.$util.Tips({
      //     //   title: err.message
      //     // })
      //   })
    },
    /**
     *
     */
    setNewData(thats) {
      return new Promise((resolve, reject) => {
        let that = thats
        if (this.mescrollType === "down" || that.page > 1) {
          that.loading = false
        } else {
          that.loading = true
        }

        that.loadTitle = "加载更多"
        let params = {
          type: that.orderStatus >= 0 ? that.orderStatus : "",
          pageNum: that.page,
          pageSize: that.limit
        }
        getOrderList(params)
          .then(res => {
            if (res.code == 200) {
              if (that.page == 1) {
                this.$set(this, "orderList", [])
              }

              if (this.current == 1 && params.type === "") {
                resolve({
                  res: res.code,
                  data: {
                    list: []
                  }
                })
              } else if (this.current == 0 && that.orderStatus >= 0) {
                resolve({
                  res: res.code,
                  data: {
                    list: []
                  }
                })
              } else {
                resolve(res)
              }

              // that.setData(that, res)
            } else {
              that.loading = false
              reject(res)
              return that.$util.Tips({
                title: "获取数据失败"
              })
            }
          })
          .catch(err => {
            that.loading = false
            if (that.mescroll) {
              this.mescroll.endErr()
            }
            reject(err)
            console.error(err)
            // return that.$util.Tips({
            //   title: err.message
            // })
          })
      })
    },
    /**
     * 服务器获取数据
     */
    setData(that, res) {
      that.loading = false

      let list = res.data.list || []
      let loadend = list.length < that.limit
      // if (this.orderList = [])
      if (that.mescrollType == "down") {
        that.orderList = []
      }

      // if (list && list.length <= 0 && that.page == 1) {
      //   that.$set(that, "orderList", [])
      //   return
      // }

      that.orderList = that.$util.SplitArray(list, that.orderList)

      that.$set(that, "orderList", that.orderList)
      that.loadend = loadend
      that.loadTitle = loadend ? "已全部加载" : "加载更多"
      // if (!loadend) {
      //   that.page = that.page + 1
      // }
      if (that.mescroll) {
        if (that.mescrollType == "down") {
          that.mescroll.endDownScroll()
        } else if (that.mescrollType == "up") {
          if (loadend === true) {
            that.mescroll.showNoMore()
          } else {
            that.mescroll.endUpScroll(false)
          }
        }
      }
    },

    /**
     * 删除订单
     */
    delOrder: function (order_id, index) {
      let that = this
      orderDel(order_id)
        .then(res => {
          that.orderList.splice(index, 1)
          that.$set(that, "orderList", that.orderList)
          that.$set(
            that.orderData,
            "unpaid_count",
            that.orderData.unpaid_count - 1
          )
          that.getOrderData()
          return that.$util.Tips({
            title: "撤销成功",
            icon: "success"
          })
        })
        .catch(err => {
          return that.$util.Tips({
            title: err.message
          })
        })
    }
  },
  onReachBottom: function () {
    this.getOrderList()
  }
}
</script>

<style scoped lang="scss">
/deep/.u-tab-bar {
  background: var(--theme-color-dark-blue) !important;
}
.flex {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.flex-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.large {
  background: var(--bg-color-second);
  min-height: 100vh;
}
// .my-order {
//   position: relative;
//   top: 0;
//   left: 0;
//   z-index: 10;
// }
// .my-order .header {
//   height: 250rpx;
//   padding: 0 30rpx;
// }

// .my-order .header .picTxt {
//   height: 190rpx;
// }
.header-top {
  position: relative;
  top: 0;
  left: 0;
  z-index: 10;
}

// .my-order .header .picTxt .text {
//   color: rgba(255, 255, 255, 0.8);
//   font-size: 26rpx;
//   font-family: "Guildford Pro";
// }

// .my-order .header .picTxt .text .name {
//   font-size: 34rpx;
//   font-weight: bold;
//   color: #fff;
//   margin-bottom: 20rpx;
// }

// .my-order .header .picTxt .pictrue {
//   width: 240rpx;
//   height: 180rpx;
// }
.noCart .pictrue {
  width: 414rpx;
  height: 336rpx;
  .font-icon {
    width: 414rpx;
    height: 336rpx;
  }
}

// .my-order .header .picTxt .pictrue image {
//   width: 100%;
//   height: 100%;
// }

// .my-order .nav {
//   background-color: #fff;
//   width: 100%;
//   height: 90rpx;
//   border-radius: 14rpx;
//   // margin: 20rpx auto 0 auto;
//   border-bottom: 2rpx solid var(--bd-color-main);
//   border-top: 2rpx solid var(--bd-color-main);
// }

// .my-order .nav .item {
//   text-align: center;
//   font-size: 26rpx;
//   color: var(--text-color-grey);
//   padding: 26rpx 0;
// }

// .my-order .nav .item.on {
//   // font-weight: bold;
//   // border-bottom: 5rpx solid #e93323;
//   /* #ifdef H5 || MP */
//   font-weight: 600;
//   font-size: 30rpx;
//   color: var(--text-color-main);
//   /* #endif */
//   border-bottom: 7rpx solid var(--theme-color-dark-blue);
//   border-radius: 7rpx;
// }

// .my-order .nav .item .num {
//   margin-left: 10rpx;
// }

.my-order .list {
  width: 100%;
  margin: 0rpx auto 0;
}

.my-order .list .item {
  background-color: var(--bg-color-main);
  // border-radius: 14rpx;
  // margin-top: 8rpx;
  padding: 0 4%;
  margin-bottom: 30rpx;
}
.font-color-money {
  color: var(--text-color-yellow);
}
.order-id {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 36rpx;
}
.flex-row-item {
  display: flex;
  justify-content: space-between;
}
.flex-col-item {
  height: 180rpx;
  display: flex;
  justify-content: space-between;

  flex-direction: column;
}
.item-large {
  width: 100% !important;
}
.flex-center {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.my-order .list .item .title {
  height: 84rpx;

  border-bottom: 1rpx solid var(--bd-color-main);
  font-size: 28rpx;
}

.my-order .list .item .title .sign {
  font-size: 24rpx;
  padding: 0 13rpx;
  height: 36rpx;
  margin-right: 15rpx;
  border-radius: 18rpx;
}

.my-order .list .item .item-info {
  padding: 0;
  padding: 28rpx 0;
}

.my-order .list .item .item-info .pictrue {
  width: 240rpx;
  height: 180rpx;
}

.my-order .list .item .item-info .pictrue image {
  width: 80%;
  height: auto;
  border-radius: 14rpx;
}

.my-order .list .item .item-info .text {
  width: calc(100% - 30rpx - 240rpx);
  margin-left: 30rpx;
  font-size: 28rpx;
  color: var(--text-color-grey);
}

.my-order .list .item .item-info .text .name {
  width: 100%;
}

.my-order .list .item .item-info .text .money {
  text-align: right;
}

.my-order .list .item .totalPrice {
  font-size: 26rpx;
  text-align: right;
  color: var(--text-color-grey);
  border-top: 1rpx solid var(--bd-color-main);
  padding: 28rpx 0 20rpx;
}

.my-order .list .item .totalPrice .money {
  font-size: 28rpx;
  font-weight: bold;
}

.my-order .list .item .bottom .bnt {
  // width: 176rpx;
  // height: 60rpx;
  text-align: center;

  font-weight: 400;
  width: 196rpx;
  height: 64rpx;
  line-height: 64rpx;
  border-radius: 50rpx;
  font-size: 27rpx;
}

.my-order .list .item .bottom .bnt.cancelBnt {
  border: 1rpx solid var(--bd-color-main);
  color: var(--text-color-grey);
}
.my-order .list .item .bottom .pay {
  border: 1rpx solid var(--bd-color-main);
  background: var(--theme-color-dark-blue);
  color: var(--text-color-white);
}

.my-order .list .item .bottom .bnt ~ .bnt {
  margin-left: 17rpx;
}

.noCart {
  margin-top: 300rpx;
  padding-top: 0.1rpx;
}

.noCart .pictrue {
  width: 60vw;
  margin: auto;
  height: 336rpx;
  // margin: 78rpx auto 56rpx auto;
}

.noCart .pictrue image {
  width: 100%;
  height: auto;
}
.storeName {
  font-size: 32rpx;

  font-weight: 600;
  color: var(--text-color-main);
  line-height: 36rpx;
}
.flex-right {
  display: flex;
  justify-content: flex-end;
  padding-bottom: 10px;
}
.loading-title {
  text-align: center;
}
.item-price {
  font-size: 28rpx;
  font-weight: 600;
  color: var(--text-color-main);
  line-height: 32rpx;
}
.font-color {
  font-size: 28rpx;

  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 36px;
}
.not-pay {
  font-size: 28rpx;

  font-weight: 400;
  color: var(--theme-color-dark-blue);
  line-height: 36rpx;
}
.package-description {
  color: var(--text-color-grey);
  font-size: 24rpx;
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: auto auto;
  text-align: center;
  line-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  // background: var(--bg-color-main);
}
.orderId {
  color: var(--text-color-grey);
}
/deep/ .upwarp-nodata {
  color: var(--text-color-grey);
}
.loginMask {
  position: fixed;
  top: 0;
  width: 100%;
  height: 100vh;
  background: rgba($color: #333, $alpha: 0.1);
  .login-box {
    position: fixed;
    top: 28%;
    left: 10%;
    background: var(--bg-color-main);
    border: 1px solid var(--bd-color-main);
    width: 80%;
    height: 300px;
    border-radius: 10px;
    z-index: 1000;
  }
}
</style>
