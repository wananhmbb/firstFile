<template>
  <theme>
    <view slot="theme" class="large">
      <house-header
        :headTypeTwo="paid ? '订单详情' : '待付款'"
        headBackPath="/pages/shopping-mall/order_list/index"
      ></house-header>
      <view v-if="!loading">
        <view class="orderStatusMsg" v-if="!paid"
          ><text>请在</text><text class="color">{{ orderStatusMsg }}</text
          ><text>支付,逾期订单会自动取消</text></view
        >
        <view class="order-submission" v-if="!addMarkWindow">
          <view
            class="allAddress"
            :style="store_self_mention ? '' : 'padding-top:10rpx;'"
          >
            <view
              class="address acea-row row-between-wrapper"
              @tap="onAddress"
              v-if="shippingType == 0"
              :style="
                store_self_mention
                  ? ''
                  : 'border-top-left-radius: 14rpx;border-top-right-radius: 14rpx;'
              "
            >
              <view class="addressCon" v-if="addressInfo.realName && !paid">
                <view class="address-box">
                  <view class="icon">
                    <u-icon name="map" size="44"></u-icon>
                  </view>
                  <view class="addressInfo-box">
                    <view class="province-city-district"
                      >{{ addressInfo.province }}{{ addressInfo.city
                      }}{{ addressInfo.district }}</view
                    >
                    <view class="details">{{ addressInfo.detail }}</view>
                    <view class="personal-information"
                      ><text>收货人:</text>{{ addressInfo.realName }}
                      <text class="phone text-phone">{{
                        addressInfo.phone
                      }}</text>
                    </view>
                  </view>

                  <view>
                    <u-icon
                      name="arrow-right"
                      color="var(--text-color-main)"
                      size="32"
                      v-if="!paid"
                    ></u-icon>
                  </view>
                </view>
              </view>
              <view class="addressCon" v-else-if="paid">
                <view class="address-box">
                  <view class="icon">
                    <u-icon name="map" size="44"></u-icon>
                  </view>
                  <view class="addressInfo-box">
                    <view class="province-city-district">{{
                      paidAddreddInfo.userAddress
                    }}</view>
                    <view class="details">{{
                      paidAddreddInfo.addressDetails
                    }}</view>
                    <view class="personal-information"
                      ><text>收货人:</text>{{ paidAddreddInfo.realName }}
                      <text class="phone text-phone">{{
                        paidAddreddInfo.userPhone
                      }}</text>
                    </view>
                  </view>

                  <view>
                    <u-icon name="arrow-right" size="32" v-if="!paid"></u-icon>
                  </view>
                </view>
              </view>
              <view class="addressCon" v-else>
                <view class="setaddress">请设置收货地址</view>
              </view>
            </view>
          </view>
          <view class="pad30">
            <view class="orderGoods">
              <orderGoods
                :cartInfo="cartInfo"
                :orderProNum="orderProNum"
                :productOrderInfo="productOrderInfo"
                :orderInfoList="orderInfoList"
              ></orderGoods>
            </view>

            <view class="wrapper borRadius14">
              <view class="item acea-row row-between-wrapper flex">
                <view class="left-text">商品金额</view>
                <view class="money">￥{{ cartInfo[0].price }}</view>
              </view>
              <view
                class="item acea-row row-between-wrapper flex"
                @tap="couponTap"
                v-if="orderInfoVo.couponPrice !== 0"
              >
                <view class="left-text">优惠券</view>
                <view class="discount"
                  ><text class="cou-money"
                    >-￥{{ orderInfoVo.couponPrice }}</text
                  >
                  <!-- <text class='iconfont icon-jiantou'></text> -->
                </view>
              </view>
              <view v-if="shippingType !== 0">
                <view class="item acea-row row-between-wrapper">
                  <view class="left-text">联系人</view>
                  <view class="discount textR">
                    <input
                      type="text"
                      placeholder="请填写您的联系姓名"
                      placeholder-style="color:#ccc;"
                      placeholder-class="placeholder"
                      @blur="realName"
                    />
                  </view>
                </view>
                <view class="item acea-row row-between-wrapper">
                  <view class="left-text">联系电话</view>
                  <view class="discount textR">
                    <input
                      type="text"
                      placeholder="请填写您的联系电话"
                      placeholder-style="color:#ccc;"
                      placeholder-class="placeholder"
                      @blur="phone"
                    />
                  </view>
                </view>
              </view>
              <!-- 订单未支付 -->
              <!-- <view class="item acea-row row-between-wrapper flex" v-if="!paid">
                <view class="left-text">推荐人</view>
                <view class="money saoyisaoBox">
                  <u-icon
                    @click="editReferrerName('', '')"
                    class="delIcon"
                    name="minus-circle"
                    size="45"
                    v-if="referrerName"
                  ></u-icon>
                  {{ referrerName ? referrerName : "" }}
                  <u-icon
                    @click="scanCode"
                    class="saoyisaoIcon"
                    size="55"
                    name="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/saoyisao.png"
                  ></u-icon>
                </view>
              </view> -->
              <!-- 订单已支付 -->
              <!-- <view class="item acea-row row-between-wrapper flex" v-if="paid">
                <view class="left-text">推荐人</view>
                {{ referrerName ? referrerName : "" }}
              </view> -->
              <view class="item flex" v-if="textareaStatus">
                <view class="left-text">备注信息</view>
                <view @click="addMarkMode" class="mark-box">{{
                  mark ? mark : paid ? "查看备注" : "添加备注"
                }}</view>
                <!-- <textarea :disabled='paid' v-if="coupon.coupon===false" placeholder-class='placeholder' @input='bindHideKeyboard'
							:value="mark" name="mark" placeholder='请添加备注（150字以内）'></textarea> -->
              </view>
            </view>
            <view class="moneyList borRadius14">
              <view
                class="acea-row row-between-wrapper flex-rigth actual-pay-money"
              >
                <view class="right-text">{{
                  paid ? "实际支付：" : "应支付："
                }}</view>
                <view class="last-money"
                  >￥{{ orderInfoVo.proTotalFee || 0 }}</view
                >
              </view>
              <view
                class="item acea-row row-between-wrapper flex"
                v-if="orderInfoVo.couponFee > 0"
              >
                <view>优惠券抵扣：</view>
                <view class="money">-￥{{ orderInfoVo.couponFee }}</view>
              </view>
              <view
                class="item acea-row row-between-wrapper flex"
                v-if="orderInfoVo.deductionPrice > 0"
              >
                <view>积分抵扣：</view>
                <view class="money">-￥{{ orderInfoVo.deductionPrice }}</view>
              </view>
              <view
                class="item acea-row row-between-wrapper flex"
                v-if="orderInfoVo.freightFee > 0"
              >
                <view>运费：</view>
                <view class="money">+￥{{ orderInfoVo.freightFee }}</view>
              </view>
              <!-- <view style='height:10rpx;'></view> -->
            </view>
            <view class="bottom-background" v-if="!paid">
              <view class="flex-right">
                <view class="clickAddress" style="z-index: 100" @tap="onAddress"
                  >修改地址</view
                >
                <view class="settlement" style="z-index: 100" @tap="SubOrder"
                  >立即支付</view
                >
              </view>
            </view>
          </view>
          <couponListWindow
            v-if="!paid"
            :coupon="coupon"
            @ChangCouponsClone="ChangCouponsClone"
            :openType="openType"
            @ChangCoupons="ChangCoupons"
            :orderShow="orderShow"
          ></couponListWindow>
          <addressWindow
            :orderId="orderId"
            :preOrderNo="preOrderNo"
            ref="addressWindow"
            @changeTextareaStatus="changeTextareaStatus"
            :address="address"
            :pagesUrl="pagesUrl"
            @OnDefaultAddress="OnDefaultAddress"
            @OnChangeAddress="OnChangeAddress"
            @changeClose="changeClose"
          ></addressWindow>
        </view>
      </view>

      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <u-modal
        v-model="modelShow"
        :content="content"
        @confirm="confirm"
      ></u-modal>
    </view>
  </theme>
</template>
<script>
import {
  // getCouponsOrderPrice,

  postOrderComputed,
  wechatOrderPay,
  wechatQueryPayResult,
  getOrderDetail,
  editOrderRemark,
  editEferrerId,
  orderCancel
} from "@/api/order.js"
// import {  getAddressDetail } from "@/api/user.js"

// import { storeListApi } from "@/api/store.js"

import couponListWindow from "@/components/couponListWindow"
import addressWindow from "@/components/addressWindow"
import orderGoods from "@/components/orderGoods"

import { mapGetters } from "vuex"

export default {
  components: {
    couponListWindow,
    addressWindow,
    orderGoods
  },
  data() {
    return {
      referrerName: "", //扫一扫的名字
      orderShow: "orderShow", //下单页面使用优惠券组件不展示tab切换页
      textareaStatus: true,
      //支付方式
      cartArr: [
        {
          name: "微信支付",
          icon: "icon-weixin2",
          value: "weixin",
          title: "微信快捷支付",
          payStatus: 1
        }
        // {
        //   name: "余额支付",
        //   icon: "icon-icon-test",
        //   value: "yue",
        //   title: "可用余额:",
        //   payStatus: 1
        // }
        // {
        // 	"name": "线下支付", //offlinePayStatu：1开启线下支付；2关闭；offlinePostage：true有邮费
        // 	"icon": "icon-yinhangqia",
        // 	value: 'offline',
        // 	title: '线下支付',
        // 	payStatus: 1,
        // },
      ],
      payType: "weixin", //支付方式
      openType: 1, //优惠券打开方式 1=使用
      active: 0, //支付方式切换
      coupon: {
        coupon: false,
        list: [],
        statusTile: "立即使用"
      }, //优惠券组件
      address: {
        address: false,
        addressId: 0
      }, //地址组件
      addressInfo: {
        // realName: "张三",
        // phone: "151515151515",
        // isDefault: "默认地址",
        // province: "四川省",
        // city: "成都市",
        // district: "双流区",
        // detail: "双桥街道333号"
      }, //地址信息

      addressId: 0, //地址id
      couponId: 0, //优惠券id
      cartId: "", //购物车id
      userInfo: {}, //用户信息
      mark: "", //备注信息
      couponTitle: "0", //优惠券
      coupon_price: 0, //优惠券抵扣金额
      useIntegral: false, //是否使用积分
      integral_price: 0, //积分抵扣金额
      integral: 0,
      ChangePrice: 0, //使用积分抵扣变动后的金额
      formIds: [], //收集formid
      status: 0,
      is_address: false,
      toPay: false, //修复进入支付时页面隐藏从新刷新页面
      shippingType: 0,
      system_store: {},
      storePostage: 0,
      contacts: "",
      contactsTel: "",
      mydata: {},
      storeList: [],
      store_self_mention: true,
      cartInfo: [
        {
          // totalNmu: 2,
          // productId: 1,
          // image:
          //   "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqnimg.meijiedaka.com%2Fupload%2Fimages%2F20210226%2Ffdbd5f3ce6a70f962bb66bbfd27c628e.png&refer=http%3A%2F%2Fqnimg.meijiedaka.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645582452&t=e10d6f25d90d09fc8058dc1156e7dea4",
          // productName: "",
          // payNum: 10,
          // price: 50,
          // isReply: 2,
          // sku: "黑色"
        }
      ],
      priceGroup: {},
      animated: false,
      totalPrice: 0,
      integralRatio: "0",
      pagesUrl: "",
      orderKey: "",
      // usableCoupon: {},
      offlinePostage: "",
      isAuto: false, //没有授权的不会自动授权
      isShowAuth: false, //是否隐藏授权
      payChannel: "",
      news: true,
      again: false,
      addAgain: false,
      bargain: false, //是否是砍价
      combination: false, //是否是拼团
      secKill: false, //是否是秒杀
      orderInfoVo: {},
      addressList: [], //地址列表数据
      orderProNum: 10,
      preOrderNo: "", //预下单订单号\
      // productType: "normal",
      isLogin: true,
      orderId: "",
      orderStatusMsg: "",
      createTime: "",
      paid: false,
      title: "待付款",
      productOrderInfo: {},
      headTitle: "确认订单",
      markType: "添加备注",
      paidAddreddInfo: {},
      loading: true,
      orderInfoList: [],
      modelShow: false,
      content: "",
      id: ""
    }
  },

  computed: mapGetters(["systemPlatform", "productType"]),
  // watch: {
  // 	isLogin: {
  // 		handler: function(newV, oldV) {
  // 			if (newV) {
  // 				this.getloadPreOrder();
  // 				//this.getaddressInfo();
  // 			}
  // 		},
  // 		deep: true
  // 	}
  // },
  onLoad(options) {
    this.paid = JSON.parse(options.paid) || false
    if (this.paid) {
      this.markType = "查看备注"
    } else {
      this.markType = "添加备注"
    }
    uni.hideLoading()

    this.orderId = options.order_id || 0
    // console.log(this.productType, 'productType是好多')
    // #ifdef H5
    this.payChannel = this.$wechat.isWeixin() ? "public" : "weixinh5"
    // #endif
    // #ifdef MP
    this.payChannel = "routine"
    // #endif
    // if (!options.cartId) return this.$util.Tips({
    // 	title: '请选择要购买的商品'
    // }, {
    // 	tab: 3,
    // 	url: 1
    // });
    //   console.log(options, '测试')
    this.preOrderNo = options.preOrderNo || 0
    if (options.referrerName) {
      this.referrerName = decodeURIComponent(options.referrerName)
    }
    this.address.addressId = options.addressId || null
    this.is_address = options.is_address ? true : false
    if (this.isLogin) {
      //this.getaddressInfo();
      // if(this.preOrderNo) {
      // 	this.getloadPreOrder();
      // }

      this.getOrderDetail()
    } else {
      // toLogin()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    let _this = this
    var pages = getCurrentPages()
    var currPage = pages[pages.length - 1] //当前页面
    let res = currPage.data.userdata
    if (res) {
      let newMark = decodeURIComponent(res.item)
      if (newMark) {
        this.mark = newMark
      } else {
        this.mark = ""
      }
      this.markValue()
    }
    if (this.$refs.addressWindow) {
      this.$nextTick(() => {
        this.$refs.addressWindow.getAddressList()
      })
    }
    // if (this.address.addressId > 0) {
    //   this.$nextTick(() => {
    //     this.$refs.addressWindow.getAddressList()
    //   })
    // }

    // wx.getLaunchOptionsSync
    this.textareaStatus = true
    if (this.isLogin && this.toPay == false) {
      //this.getaddressInfo();
    }

    uni.$on("handClick", res => {
      if (res) {
        _this.system_store = res.address
      }
      // 清除监听
      uni.$off("handClick")
    })

    // let pages = getCurrentPages();
    // let currPage = pages[pages.length - 1]; //当前页面
    // if (currPage.data.storeItem) {
    // 	let json = currPage.data.storeItem;
    // 	this.$set(this, 'system_store', json);
    // }
  },
  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {
    this.isClose = true
  },
  methods: {
    addMarkMode() {
      console.log(this.paid)
      this.$Router.push({
        path: "/remark",
        query: {
          remark: this.mark,
          paid: this.paid //根据传过来的支付情况
        }
      })
    },

    //更改备注
    markValue() {
      editOrderRemark(this.orderId, this.mark)
        .then(res => {
          this.$util.Tips({
            title: res.message
          })
        })
        .catch(err => {
          this.$util.Tips({
            title: err.message
          })
        })
    },
    //获取未支付的情况下的订单详情
    getOrderDetail() {
      this.loading = true
      getOrderDetail(this.orderId)
        .then(res => {
          uni.hideLoading()
          this.loading = false
          this.cartInfo = res.data.orderInfoList
          this.orderStatusMsg = res.data.orderStatusMsg
          this.createTime = this.formatDate(new Date(res.data.createTime))
          this.orderInfoList = res.data.orderInfoList
          this.productOrderInfo = res.data.productOrderInfo
          this.mark = res.data.mark
          this.referrerName = res.data.referrerName
          this.paid = res.data.paid
          this.id = res.data.id
          this.paidAddreddInfo = {
            userAddress: res.data.userAddress,
            userPhone: res.data.userPhone,
            realName: res.data.realName,
            addressDetails: res.data.addressDetails
          }
          this.orderInfoVo.couponPrice = res.data.couponPrice
          this.orderInfoVo.proTotalFee = (
            Number(res.data.proTotalPrice) - Number(res.data.couponPrice)
          ).toFixed(2)
          //   this.orderId = res.data.orderId
          if (!this.paid) {
            this.address.addressId = res.data.addressId
            this.$nextTick(() => {
              this.$refs.addressWindow.getAddressList()
            })
          }
        })
        .catch(err => {
          uni.hideLoading()
          this.loading = false
          this.$util.Tips({
            title: err.message
          })
        })
    },
    // 订单详情
    // getloadPreOrder: function () {
    //   loadPreOrderApi(this.preOrderNo)
    //     .then(res => {
    //       let orderInfoVo = res.data.orderInfoVo
    //       this.orderInfoVo = orderInfoVo
    //       this.cartInfo = orderInfoVo.orderDetailList
    //       this.orderProNum = orderInfoVo.orderProNum
    //       this.address.addressId = this.addressId
    //         ? this.addressId
    //         : orderInfoVo.addressId
    //       // this.cartArr[1].title = '可用余额:' + orderInfoVo.userBalance;
    //       // this.cartArr[1].payStatus = parseInt(res.data.yuePayStatus) === 1 ? 1 : 2;
    //       this.cartArr[0].payStatus =
    //         parseInt(res.data.payWeixinOpen) === 1 ? 1 : 0
    //       this.store_self_mention =
    //         res.data.storeSelfMention == "true" && this.productType === "normal"
    //           ? true
    //           : false
    //       //调用子页面方法授权后执行获取地址列表
    //       // this.$nextTick(function() {
    //       // 	this.$refs.addressWindow.getAddressList();
    //       // })
    //     })
    //     .catch(err => {
    //       // console.log(err, '订单详情出错')
    //       return this.$util.Tips({
    //         title: err.message
    //       })
    //     })
    // },
    /**
     * 授权回调事件
     *
     */
    // onLoadFun: function () {
    //   // this.getaddressInfo();
    //   // 调用子页面方法授权后执行获取地址列表
    //   // this.$scope.selectComponent('#address-window').getAddressList();
    // },
    /**
     * 获取门店列表数据
     */
    // getList: function () {
    //   let longitude = uni.getStorageSync("user_longitude") //经度
    //   let latitude = uni.getStorageSync("user_latitude") //纬度
    //   let data = {
    //     latitude: latitude, //纬度
    //     longitude: longitude, //经度
    //     page: 1,
    //     limit: 10
    //   }
    //   storeListApi(data)
    //     .then(res => {
    //       let list = res.data.list || []
    //       this.$set(this, "storeList", list)
    //       this.$set(this, "system_store", list[0])
    //     })
    //     .catch(err => {
    //       console.log("获取门店列表数据出错")
    //       // return this.$util.Tips({
    //       // 	title: err
    //       // });
    //     })
    // },
    // 关闭地址弹窗；
    changeClose: function () {
      this.$set(this.address, "address", false)
    },
    /*
     * 跳转门店列表
     */
    // showStoreList: function () {
    //   let _this = this
    //   if (this.storeList.length > 0) {
    //     uni.navigateTo({
    //       url: "/pages/users/goods_details_store/index"
    //     })
    //   }
    // },
    // 计算订单价格
    computedPrice: function () {
      let shippingType = this.shippingType
      postOrderComputed({
        addressId: this.address.addressId,
        useIntegral: this.useIntegral ? true : false,
        couponId: this.couponId,
        shippingType: parseInt(shippingType) + 1,
        preOrderNo: this.preOrderNo
      })
        .then(res => {
          let data = res.data
          this.orderInfoVo.couponFee = data.couponFee
          //赋值操作，userIntegral 当前积分，surplusIntegral 剩余积分
          this.orderInfoVo.userIntegral = data.surplusIntegral
          this.orderInfoVo.deductionPrice = data.deductionPrice
          this.orderInfoVo.freightFee = data.freightFee
          this.orderInfoVo.payFee = data.payFee
          this.orderInfoVo.proTotalFee = data.proTotalFee
          this.orderInfoVo.useIntegral = data.useIntegral
          this.orderInfoVo.usedIntegral = data.usedIntegral
          this.orderInfoVo.surplusIntegral = data.surplusIntegral
          //this.orderInfoVo.userIntegral = data.userIntegral;
        })
        .catch(err => {
          console.log("计算订单价格出错", err)
          // return this.$util.Tips({
          // 	title: err
          // });
        })
    },
    //   转换日期格式
    formatTen(num) {
      return num > 9 ? String(num) : "0" + num
    },
    formatDate(date) {
      var year = date.getFullYear()
      var month = date.getMonth() + 1
      var day = date.getDate()
      var hour = date.getHours()
      var minute = date.getMinutes()
      var second = date.getSeconds()
      return (
        year +
        "-" +
        this.formatTen(month) +
        "-" +
        this.formatTen(day) +
        " " +
        this.formatTen(hour) +
        ":" +
        this.formatTen(minute) +
        ":" +
        this.formatTen(second)
      )
    },
    /**
     * 取消订单
     *
     */
    cancelOrder: function () {
      let that = this
      orderCancel(this.id)
        .then(res => {
          if (res.code === 200) {
            let timer = setTimeout(() => {
              uni.reLaunch({
                url: "pages/shopping-mall/index-shopping-mall/goods_list/index"
              })
              clearTimeout(timer)
            }, 1000)

            return that.$util.Tips({
              title: "已取消该订单",
              icon: "success"
            })
          } else {
            return that.$util.Tips({
              title: res.msg,
              icon: "error"
            })
          }
        })
        .catch(err => {
          return that.$util.Tips({
            title: err.message
          })
        })
    },
    confirm() {
      this.modelShow = false
      this.cancelOrder()
    },
    // addressType: function (e) {
    //   let index = e
    //   this.shippingType = parseInt(index)
    //   this.computedPrice()
    //   if (index == 1) this.getList()
    // },
    // bindPickerChange: function (e) {
    //   let value = e.detail.value
    //   this.shippingType = value
    //   this.computedPrice()
    // },
    ChangCouponsClone: function () {
      this.$set(this.coupon, "coupon", false)
    },
    changeTextareaStatus: function () {
      for (let i = 0, len = this.coupon.list.length; i < len; i++) {
        this.coupon.list[i].use_title = ""
        this.coupon.list[i].is_use = 0
      }
      this.textareaStatus = true
      this.status = 0
      this.$set(this.coupon, "list", this.coupon.list)
    },
    /**
     * 处理点击优惠券后的事件
     *
     */
    ChangCoupons: function (e) {
      // this.usableCoupon = e
      // this.coupon.coupon = false
      let index = e,
        list = this.coupon.list,
        couponTitle = "0",
        couponId = 0
      for (let i = 0, len = list.length; i < len; i++) {
        if (i != index) {
          list[i].use_title = ""
          list[i].isUse = 0
        }
      }
      if (list[index].isUse) {
        //不使用优惠券
        list[index].use_title = ""
        list[index].isUse = 0
      } else {
        //使用优惠券
        list[index].use_title = "不使用"
        list[index].isUse = 1
        couponTitle = list[index].name
        couponId = list[index].id
      }
      this.couponTitle = couponTitle
      this.couponId = couponId
      this.$set(this.coupon, "coupon", false)
      this.$set(this.coupon, "list", list)
      this.computedPrice()
    },
    /**
     * 使用积分抵扣
     */
    // ChangeIntegral: function () {
    //   this.useIntegral = !this.useIntegral
    //   this.computedPrice()
    // },
    /**
     * 首次进页面展示默认地址
     */
    OnDefaultAddress: function (e) {
      this.addressInfo = e
      this.address.addressId = e.id
    },
    /**
     * 选择地址后改变事件
     * @param object e
     */
    OnChangeAddress: function (e) {
      this.addressInfo = e
      this.address.addressId = e.id
      this.textareaStatus = true
      //this.orderInfoVo.addressId = e;
      this.address.address = false
      //this.getaddressInfo();
      this.computedPrice()
    },
    // bindHideKeyboard: function (e) {
    //   this.mark = e.detail.value
    // },
    /**
     * 获取当前金额可用优惠券
     *
     */
    // getCouponList: function () {
    //   //测试
    //   this.$set(this.coupon, "list", [])
    //   this.openType = 1
    //   //主体
    //   getCouponsOrderPrice(this.preOrderNo).then(res => {
    //     this.$set(this.coupon, "list", res.data)
    //     this.openType = 1
    //   })
    // },
    /*
     * 获取默认收货地址或者获取某条地址信息
     */
    // getaddressInfo: function () {
    //   let that = this
    //   if (that.addressId) {
    //     getAddressDetail(that.addressId).then(res => {
    //       if (res.data) {
    //         res.data.isDefault = parseInt(res.data.isDefault)
    //         that.addressInfo = res.data || {}
    //         that.addressId = res.data.id || 0
    //         that.address.addressId = res.data.id || 0
    //       }
    //     })
    //   } else {
    //     getAddressDefault().then(res => {
    //       if (res.data) {
    //         res.data.isDefault = parseInt(res.data.isDefault)
    //         that.addressInfo = res.data || {}
    //         that.addressId = res.data.id || 0
    //         that.address.addressId = res.data.id || 0
    //       }
    //     })
    //   }
    // },
    // payItem: function (e) {
    //   let that = this
    //   let active = e
    //   that.active = active
    //   that.animated = true
    //   that.payType = that.cartArr[active].value
    //   that.computedPrice()
    //   setTimeout(function () {
    //     that.car()
    //   }, 500)
    // },
    couponTap: function () {
      // this.coupon.coupon = true;
      // if(!this.coupon.list.length)this.getCouponList();
    },
    // car: function () {
    //   let that = this
    //   that.animated = false
    // },
    onAddress: function () {
      let that = this

      // this.order_id =
      // that.pagesUrl = '/pages/shopping-mall/user_address_list/index?preOrderNo='+ this.preOrderNo;
      if (!that.paid) {
        that.textareaStatus = false
        that.address.address = true
      }
    },
    realName: function (e) {
      this.contacts = e.detail.value
    },
    phone: function (e) {
      this.contactsTel = e.detail.value
    },
    // creatOrder: function(data) {
    // 	let that = this;
    // 	orderCreate(data).then(res => {
    // 		that.getOrderPay(res.data.orderNo, '支付成功');

    // 	}).catch(err => {
    // 		uni.hideLoading();

    // 		return that.$util.Tips({
    // 			title: err
    // 		});
    // 	});
    // },
    getOrderPay: function (orderNo, message) {
      let that = this
      let goPages = "/pages/shopping-mall/order_list/index?"
      wechatOrderPay({
        orderNo: orderNo,
        payChannel: that.payChannel,
        payType: that.payType,
        scene: that.productType === "normal" ? 0 : 1177 //下单时小程序的场景值
      })
        .then(res => {
          if (res.code == "200") {
            let jsConfig = res.data.jsConfig
            switch (res.data.payType) {
              case "weixin":
                // #ifdef MP
                uni.requestPayment({
                  timeStamp: jsConfig.timeStamp,
                  nonceStr: jsConfig.nonceStr,
                  package: jsConfig.packages,
                  signType: jsConfig.signType,
                  paySign: jsConfig.paySign,
                  ticket:
                    that.productType === "normal" ? null : jsConfig.ticket,
                  success: function (ress) {
                    uni.hideLoading()
                    wechatQueryPayResult(orderNo)
                      .then(res => {
                        uni.hideLoading()
                        if (
                          that.orderInfoVo.bargainId ||
                          that.orderInfoVo.combinationId ||
                          that.pinkId ||
                          that.orderInfoVo.seckillId
                        )
                          return that.$util.Tips(
                            {
                              title: "支付成功",
                              icon: "success"
                            },
                            {
                              tab: 4,
                              url: goPages
                            }
                          )
                        return that.$util.Tips(
                          {
                            title: "支付成功",
                            icon: "success"
                          },
                          {
                            tab: 5,
                            url: goPages
                          }
                        )
                      })
                      .catch(err => {
                        uni.hideLoading()
                        console.error(err)
                        return that.$util.Tips({
                          title: "支付失败"
                        })
                        // return that.$util.Tips({
                        //   title: err.message
                        // })
                      })
                  },
                  fail: function (e) {
                    uni.hideLoading()
                    // return that.$util.Tips({
                    // 	title: '取消支付'
                    // }, {
                    // 	tab: 5,
                    // 	url: goPages + '&status=2'
                    // });
                    uni.reLaunch({
                      url: "pages/shopping-mall/order_list/index"
                    })
                    return that.$util.Tips({
                      title: "取消支付"
                    })
                  },
                  complete: function (e) {
                    uni.hideLoading()
                    //关闭当前页面跳转至订单状态
                    // if (e.errMsg == 'requestPayment:cancel') return that.$util
                    // 	.Tips({
                    // 		title: '取消支付'
                    // 	}, {
                    // 		tab: 5,
                    // 		url: goPages + '&status=2'
                    // 	});
                    if (e.errMsg == "requestPayment:cancel")
                      return that.$util.Tips({
                        title: "取消支付"
                      })
                  }
                })
                // #endif

                break
              case "yue":
                uni.hideLoading()
                return that.$util.Tips(
                  {
                    title: "支付成功",
                    icon: "success"
                  },
                  {
                    tab: 4,
                    url: goPages
                  }
                )
                break
              case "weixinh5":
                uni.hideLoading()
                that.$util.Tips(
                  {
                    title: "订单创建成功"
                  },
                  {
                    tab: 5,
                    url: goPages + "&status=0"
                  }
                )
                setTimeout(() => {
                  location.href =
                    jsConfig.mwebUrl +
                    "&redirect_url=" +
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    goPages +
                    "&status=1"
                }, 100)
                break
            }
          } else {
            uni.hideLoading()
            this.modelShow = true
            this.content = res.msg
            return
            // return that.$util.Tips({
            //   title: res.msg
            // })
          }
        })
        .catch(err => {
          uni.hideLoading()
          this.modelShow = true
          this.content = err.msg
          return
          // return that.$util.Tips({
          //   title: err.msg
          // })
        })
    },
    getPayType: function (status, orderId, message, jsConfig) {
      let that = this
      let goPages =
        "/pages/order_pay_status/index?order_id=" + orderId + "&msg=" + message
      switch (status) {
        case "ORDER_EXIST":
        case "EXTEND_ORDER":
        case "PAY_ERROR":
          uni.hideLoading()
          return that.$util.Tips(
            {
              title: message
            },
            {
              tab: 5,
              url: goPages
            }
          )
          break
        case "SUCCESS":
          uni.hideLoading()
          if (
            that.orderInfoVo.bargainId ||
            that.orderInfoVo.combinationId ||
            that.pinkId ||
            that.orderInfoVo.seckillId
          )
            return that.$util.Tips(
              {
                title: message,
                icon: "success"
              },
              {
                tab: 4,
                url: goPages
              }
            )
          return that.$util.Tips(
            {
              title: message,
              icon: "success"
            },
            {
              tab: 5,
              url: goPages
            }
          )
          break
        case "WECHAT_PAY":
          // #ifdef MP
          that.toPay = true
          let packagess = "prepay_id=" + jsConfig.prepayId
          uni.requestPayment({
            timeStamp: jsConfig.timeStamp.toString(),
            nonceStr: jsConfig.nonceStr,
            package: packagess,
            signType: jsConfig.signType,
            paySign: jsConfig.paySign,
            success: function (res) {
              uni.hideLoading()
              if (
                that.orderInfoVo.bargainId ||
                that.orderInfoVo.combinationId ||
                that.pinkId ||
                that.orderInfoVo.seckillId
              )
                return that.$util.Tips(
                  {
                    title: "支付成功",
                    icon: "success"
                  },
                  {
                    tab: 4,
                    url: goPages
                  }
                )
              return that.$util.Tips(
                {
                  title: "支付成功",
                  icon: "success"
                },
                {
                  tab: 5,
                  url: goPages
                }
              )
            },
            fail: function (e) {
              uni.hideLoading()
              return that.$util.Tips(
                {
                  title: "取消支付"
                },
                {
                  tab: 5,
                  url: goPages + "&status=0"
                }
              )
            },
            complete: function (e) {
              uni.hideLoading()
              //关闭当前页面跳转至订单状态
              if (res.errMsg == "requestPayment:cancel")
                return that.$util.Tips(
                  {
                    title: "取消支付"
                  },
                  {
                    tab: 5,
                    url: goPages + "&status=0"
                  }
                )
            }
          })
          // #endif

          break
        case "PAY_DEFICIENCY":
          uni.hideLoading()
          return that.$util.Tips(
            {
              title: message
            },
            {
              tab: 5,
              url: goPages + "&status=1"
            }
          )
          break
        case "WECHAT_H5_PAY": //网页版公众号支付
          setTimeout(() => {
            let domain = encodeURIComponent(location.href)
            let urls = jsConfigAgain.h5PayUrl + "&redirect_url=" + domain
            location.href = urls
            return that.$util.Tips(
              {
                title: "支付成功",
                icon: "success"
              },
              {
                tab: 5,
                url: goPages
              }
            )
          }, 100)
          break
      }
    },
    SubOrder: function (e) {
      let that = this,
        data = {}

      if (!that.payType)
        return that.$util.Tips({
          title: "请选择支付方式"
        })
      // if (!that.address.addressId && !that.shippingType)
      //   return that.$util.Tips({
      //     title: "请选择收货地址"
      //   })
      if (that.shippingType == 1) {
        if (that.contacts == "" || that.contactsTel == "") {
          return that.$util.Tips({
            title: "请填写联系人或联系人电话"
          })
        }
        if (!/^1(3|4|5|7|8|9|6)\d{9}$/.test(that.contactsTel)) {
          return that.$util.Tips({
            title: "请填写正确的手机号"
          })
        }
        if (!/^[\u4e00-\u9fa5\w]{2,16}$/.test(that.contacts)) {
          return that.$util.Tips({
            title: "请填写您的真实姓名"
          })
        }
        if (that.storeList.length == 0)
          return that.$util.Tips({
            title: "暂无门店,请选择其他方式"
          })
      }
      data = {
        realName: that.contacts,
        phone: that.contactsTel,
        addressId: that.address.addressId,
        couponId: that.couponId,
        payType: that.payType,
        useIntegral: that.useIntegral,
        preOrderNo: that.preOrderNo,
        mark: that.mark,
        storeId: that.system_store.id || 0,
        shippingType: that.$util.$h.Add(that.shippingType, 1),
        payChannel: that.payChannel
      }
      if (
        data.payType == "yue" &&
        parseFloat(that.userInfo.nowMoney) < parseFloat(that.totalPrice)
      )
        return that.$util.Tips({
          title: "余额不足！"
        })
      uni.showLoading({
        title: "订单支付中"
      })
      that.getOrderPay(that.orderId, "支付成功")
    },
    //扫一扫
    scanCode() {
      let that = this
      wx.scanCode({
        success(res) {
          console.log(res.result, "扫码出来的结果")
          if (res.result) {
            let result = JSON.parse(res.result)
            let referrerId = result.id
            let referrerName = result.nickName
            that.editReferrerName(referrerId, referrerName)
          }
        }
      })
    },
    //修改推荐人
    editReferrerName(referrerId, referrerName) {
      let that = this
      editEferrerId(that.orderId, referrerId)
        .then(res => {
          if (res.code === 200) {
            that.referrerName = referrerName
          } else {
            that.$util.Tips({
              title: res.msg
            })
          }
        })
        .catch(err => {
          that.$util.Tips({
            title: err.msg
          })
        })
    }
  }
}
</script>

<style lang="scss" scoped>
.address-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.addressInfo-box {
  width: 90%;
}
.icon {
  width: 12%;
}
.default-box {
  width: 20%;
}
.province-city-district {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--text-color-main);
  line-height: 36rpx;
}
.cou-money {
  font-weight: 400;
  color: var(--text-color-yellow);
  // line-height: 48rpx;
  font-size: 28rpx;
  line-height: 40rpx;
}
.number {
  font-size: 28rpx;
  line-height: 40rpx;
  // line-height: 48rpx;
}
.details {
  font-size: 36rpx;
  font-weight: 600;
  color: var(--text-color-main);
  line-height: 44rpx;
  margin: 10rpx 0 24rpx;
}
.personal-information {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 36rpx;
}

.line2 {
  width: 504rpx;
}

.textR {
  text-align: right;
}
.large {
  background: var(--bg-color-main);
  min-height: 100vh;
}
.order-submission {
  padding-bottom: 110rpx;
  // padding-top: 160rpx;
  //   min-height: 100vh - env();

  //   background: #F5F5F5;
  overflow: auto;
}

.order-submission .line {
  width: 100%;
  height: 3rpx;
}

.order-submission .line image {
  width: 100%;
  height: 100%;
  display: block;
}

.order-submission .address {
  padding: 28rpx 0;
  background-color: var(--bg-color-main);
  box-sizing: border-box;
}
.loading-box {
  width: 100vw;
  height: 90vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
}
.pad30 {
  width: 100%;
  //   margin: 0 auto;
  // background: ;
}
.mark-box {
  width: 60%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  color: var(--text-color-main);
}
.order-submission .address .addressCon {
  width: 100%;
  padding: 0 20rpx;
  font-size: 26rpx;
}

.order-submission .address .addressCon .setaddress {
  font-size: 28rpx;
  margin-left: 40rpx;
  color: var(--text-color-main);
}

.order-submission .allAddress {
  width: 100%;
  //   background: linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
  // background-image: linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
  // background-image: -webkit-linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
  // background-image: -moz-linear-gradient(to bottom, #e93323 0%, #f5f5f5 100%);
  padding: 0 0 0 0;
}
.actual-pay-money {
  width: 98%;
  padding: 0 1%;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.flex-right {
  width: 92%;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  // margin-top: 100rpx;
}
.icon {
  display: inline-block;
  text-align: left;
  vertical-align: middle;
}
.title {
  vertical-align: middle;
}

.order-submission .allAddress .address {
  width: 100%;
  //   max-height: 180rpx;
  margin: 0 auto;
}

.order-submission .allAddress .line {
  width: 100%;
  margin: 0 auto;
}

.order-submission .wrapper .item .discount .placeholder {
  // color: #ccc;
}

.order-submission .wrapper {
  background-color: var(--bg-color-main);
  margin-top: 15rpx;
  // padding: 0 4%;
}

.order-submission .wrapper .item {
  padding: 27rpx 24rpx;
  font-size: 30rpx;

  border-bottom: 1px solid var(--bd-color-main);
}

.order-submission .wrapper .item .discount {
  font-size: 30rpx;

  display: flex;
}

.order-submission .wrapper .item .discount .num {
  font-size: 32rpx;
  margin-right: 20rpx;
}

.order-submission .wrapper .item .shipping {
  font-size: 30rpx;

  position: relative;
  padding-right: 58rpx;
}

.order-submission .wrapper .item .placeholder {
  color: var(--text-color-grey);
}

.order-submission .wrapper .item .list {
  margin-top: 35rpx;
}
.order-submission .wrapper .item .money {
  color: var(--text-color-main);
}

.order-submission .moneyList {
  //   margin-top: 15rpx;
  background-color: var(--bg-color-main);
  padding: 30rpx;
}

.order-submission .moneyList .item {
  font-size: 28rpx;
}

.order-submission .moneyList .item ~ .item {
  margin-top: 20rpx;
}

.order-submission .moneyList .item .money {
  color: var(--text-color-grey);
}

.order-submission .footer {
  width: 100%;
  height: 100rpx;
  background-color: var(--bg-color-main);
  padding: 0 30rpx;
  font-size: 28rpx;

  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;
  height: calc(100rpx + env(safe-area-inset-bottom));
}

// .order-submission .footer .settlement {
//   font-size: 30rpx;
//   color: #fff;
//   width: 40%;
//   height: 70rpx;
//   background-color: var(--theme-color-dark-blue);
//   border-radius: 50rpx;
//   text-align: center;
//   line-height: 70rpx;
// }
.settlement {
  font-size: 30rpx;
  color: var(--text-color-white);
  width: 30%;
  height: 70rpx;
  background-color: var(--theme-color-dark-blue);
  border-radius: 50rpx;
  text-align: center;
  line-height: 70rpx;
  margin-left: 22rpx;
}
.footer .transparent {
  opacity: 0;
}
.last-money {
  font-size: 40rpx;
  font-weight: 600;
  color: var(--text-color-yellow);
  line-height: 48px;
}
.flex-rigth {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.left-text {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 50rpx;
  padding: 5px;
}
.right-text {
  font-size: 24rpx;
  font-weight: 400;
  color: var(--text-color-main);
  line-height: 32px;
}
.text-phone {
  display: inline-block;
  margin-left: 25rpx;
}
.orderGoods {
  background: var(--bg-color-second);
  padding: 20rpx 0 20rpx;
}
.orderStatusMsg {
  padding: 24rpx 0;
  text-align: center;
  color: var(--text-color-main);
  background: var(--bg-color-grey);
  .color {
    color: var(--text-color-red);
  }
}
.clickAddress {
  font-size: 30rpx;
  background: var(--bg-color-main);
  color: var(--text-color-grey);
  width: 30%;
  height: 70rpx;
  //   background-color: var(--theme-color-dark-blue);
  border-radius: 50rpx;
  text-align: center;
  line-height: 70rpx;
  border: 2rpx solid var(--bd-color-main);
}
.bottom-background {
  position: fixed;
  bottom: 0;
  width: 100vw;
  left: 0;

  height: calc(120rpx + env(safe-area-inset-bottom));
  padding: 20rpx 0 20rpx;
  box-sizing: border-box;
  // background: red;
}
.saoyisaoBox {
  display: flex;
  align-items: center;
  .delIcon {
    padding: 5px;
  }
  .saoyisaoIcon {
    margin-left: 8px;
    padding: 5px;
  }
}
</style>
