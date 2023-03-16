<template>
  <theme>
    <view slot="theme" class="large">
      <house-header headTypeTwo="确认订单"></house-header>
      <view class="order-submission" v-if="!loading">
        <view
          class="allAddress"
          :style="store_self_mention ? '' : 'padding-top:10rpx;'"
        >
          <!-- <view class="nav acea-row">
					<view class="item font-color" :class="shippingType == 0 ? 'on' : 'on2'" @tap="addressType(0)"
						v-if='store_self_mention'></view>
					<view class="item font-color" :class="shippingType == 1 ? 'on' : 'on2'" @tap="addressType(1)"
						v-if='store_self_mention'></view>
				</view> -->
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
            <view class="addressCon" v-if="addressInfo.realName">
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
                <!-- <view class="default-box">
									<text class='default font-color'
										v-if="addressInfo.isDefault">[默认]</text>
									
								</view> -->
                <view>
                  <u-icon name="arrow-right" size="32"></u-icon>
                </view>
              </view>
            </view>
            <view class="addressCon" v-else>
              <view class="setaddress">请设置收货地址</view>
            </view>
            <!-- <view class='iconfont icon-jiantou'></view> -->
          </view>
          <!-- <view
            class="address acea-row row-between-wrapper"
            v-else
            @tap="showStoreList"
          >
            <block v-if="storeList.length > 0">
              <view class="addressCon">
                <view class="name"
                  >{{ system_store.name }}
                  <text class="phone text-phone">{{ system_store.phone }}</text>
                </view>
                <view class="line1">
                  {{ system_store.address
                  }}{{ ", " + system_store.detailedAddress }}
                </view>
              </view>
            </block>
            <block v-else>
              <view>暂无门店信息</view>
            </block>
          </view> -->
          <!-- <view class='line'>
					<image src='@/static/images/line.jpg'></image>
				</view> -->
        </view>
        <view class="pad30">
          <orderGoods
            :cartInfo="cartInfo"
            :orderProNum="orderProNum"
            :productOrderInfo="productOrderInfo"
          ></orderGoods>

          <view class="wrapper borRadius14">
            <view class="item acea-row row-between-wrapper flex">
              <view class="left-text">商品金额</view>
              <view class="money text-color fw">￥{{ cartInfo[0].price }}</view>
            </view>
            <!-- <view class="item flex">
              <view class="left-text">推荐人</view>
              <view class="text-color saoyisaoBox">
                <u-icon
                  @click="delReferrerName"
                  class="delIcon"
                  name="minus-circle"
                  size="45"
                  v-if="referrerName"
                ></u-icon>
                {{ referrerName }}
                <u-icon
                  @click="scanCode"
                  class="saoyisaoIcon"
                  size="55"
                  name="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/saoyisao.png"
                ></u-icon
              ></view>
            </view> -->
          </view>
          <view class="wrapper borRadius14">
            <view
              class="item acea-row row-between-wrapper flex"
              @tap="couponTap"
              v-if="
                orderInfoVo.bargainId == 0 &&
                orderInfoVo.combinationId == 0 &&
                orderInfoVo.seckillId == 0 &&
                productType === 'normal'
              "
            >
              <view class="left-text">
                <view>优惠券</view>
                <view class="CouponIcon">
                  <image
                    src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/icons/%E5%9B%BE%E5%B1%82%202%20%E6%8B%B7%E8%B4%9D%402x.png"
                  ></image></view
              ></view>
              <view class="coupon-right-text">
                <view class="discount" v-if="orderInfoVo.couponFee > 0"
                  ><text class="cou-money">-￥{{ orderInfoVo.couponFee }}</text>
                  <!-- <text class='iconfont icon-jiantou'></text> -->
                </view>

                <view class="discount" v-else>
                  <view class="couponTitleBig0" v-if="couponTitle > 0"
                    >{{ couponTitle }}张可用</view
                  >
                  <view class="couponTitleSmall0" v-if="couponTitle === 0">
                    <view>暂无可用</view>
                    <view>兑换优惠券</view>
                  </view>
                  <!-- <text class='iconfont icon-jiantou'></text> -->
                  <view class="Dot"></view>
                </view>
                <view class="arrow-right">
                  <u-icon name="arrow-right" size="32"></u-icon>
                </view>
              </view>
            </view>
            <view class="item flex" v-if="textareaStatus">
              <view class="left-text">备注信息</view>
              <view @click="addMarkMode" class="remark-box text-color">{{
                mark ? mark : "添加备注"
              }}</view>
            </view>
          </view>
          <view class="moneyList borRadius14">
            <view class="item acea-row row-between-wrapper flex-rigth">
              <view class="right-text">应支付：</view>
              <view class="last-money"
                >￥{{ orderInfoVo.proTotalFee || 0 }}</view
              >
            </view>
            <!-- <view
              class="item acea-row row-between-wrapper flex"
              v-if="orderInfoVo.couponFee > 0"
            >
              <view>优惠券抵扣：</view>
              <view class="money">-￥{{ orderInfoVo.couponFee }}</view>
            </view> -->
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
          <view class="footer acea-row row-between-wrapper">
            <!-- <view>合计:
					<text class='font-color'>￥{{orderInfoVo.payFee || 0}}</text>
				</view> -->
            <view class="bottom-button-box">
              <u-button type="primary" shape="circle" @click="SubOrder"
                >提交订单</u-button
              >
            </view>

            <!-- <view class="settlement" style="z-index: 100" @tap="SubOrder"
              >提交订单</view
            > -->
          </view>
        </view>
        <couponListWindow
          ref="couponListWindow"
          :coupon="coupon"
          @ChangCouponsClone="ChangCouponsClone"
          :openType="openType"
          @ChangCoupons="ChangCoupons"
          :orderShow="orderShow"
          @redeemCoupons="redeemCoupons"
        ></couponListWindow>
        <addressWindow
          :preOrderNo="preOrderNo"
          ref="addressWindow"
          @changeTextareaStatus="changeTextareaStatus"
          :address="address"
          :pagesUrl="pagesUrl"
          @OnDefaultAddress="OnDefaultAddress"
          @OnChangeAddress="OnChangeAddress"
          @changeClose="changeClose"
        ></addressWindow>

        <!-- #ifdef MP -->
        <!-- <authorize @onLoadFun="onLoadFun" :isAuto="isAuto" :isShowAuth="isShowAuth" @authColse="authColse"></authorize> -->
        <!-- #endif -->
        <!-- <home></home> -->
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          show="true"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <!-- <addMark :addMarkWindow='addMarkWindow' @markValue='markValue' @close='close' :mark='mark' :isChangeText='isChangeText'></addMark> -->
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import {
  //orderConfirm,
  getCouponsOrderPrice,
  orderCreate,
  postOrderComputed,
  wechatOrderPay,
  wechatQueryPayResult,
  loadPreOrderApi
} from "@/api/order.js"
import { getAddressDetail } from "@/api/user.js"
// import {
// 	openPaySubscribe
// } from '@/utils/SubscribeMessage.js';
import { storeListApi } from "@/api/store.js"
import { WeChat_INFO } from "@/const/storage-key.js"
// import {
// 	CACHE_LONGITUDE,
// 	CACHE_LATITUDE
// } from '@/config/cache.js';
// import addMark from '@/components/components/add-mark'
import couponListWindow from "@/components/couponListWindow"
import addressWindow from "@/components/addressWindow"
import orderGoods from "@/components/orderGoods"
// import home from '@/components/home';
// import {
// 	toLogin
// } from '@/libs/login.js';
import { mapGetters } from "vuex"
// // #ifdef MP
// import authorize from '@/components/Authorize';
import { fillInOrder } from "@/api/order.js"
import { RequestList } from "@/utils/requestCode.js"
// #endif
export default {
  components: {
    couponListWindow,
    addressWindow,
    orderGoods
    // addMark
    // addMask
    // home,
    // #ifdef MP
    // authorize
    // #endif
  },
  data() {
    return {
      referrerId: "", //扫一扫的id
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
        addressId: null
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

      addressId: null, //地址id
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
          //   totalNmu: 2,
          //   productId: 1,
          image:
            "https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fqnimg.meijiedaka.com%2Fupload%2Fimages%2F20210226%2Ffdbd5f3ce6a70f962bb66bbfd27c628e.png&refer=http%3A%2F%2Fqnimg.meijiedaka.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1645582452&t=e10d6f25d90d09fc8058dc1156e7dea4"
          //   productName: "",
          //   payNum: 10,
          //   price: 50,
          //   isReply: 2,
          //   sku: '黑色'
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
      order_id: "",
      useDirection: "",
      healthTips: "",
      productOrderInfo: {},
      paid: false,
      headTitle: "确认订单",
      loading: true,
      getServicePackQuestionnaireInfo: ""
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
    //   console.log(options, '151515')
    // console.log(this.productType, 'productType是好多')
    // #ifdef H5
    this.payChannel = this.$wechat.isWeixin() ? "public" : "weixinh5"

    // #endif
    // #ifdef MP
    this.payChannel = "routine"
    // this.useDirection = decodeURIComponent(options.useDirection)
    // this.healthTips = decodeURIComponent(options.healthTips)
    // console.log(options, '确认订单')
    // #endif
    // if (!options.cartId) return this.$util.Tips({
    // 	title: '请选择要购买的商品'
    // }, {
    // 	tab: 3,
    // 	url: 1
    // });
    //   console.log(options, '测试')
    this.preOrderNo = options.preOrderNo || 0
    this.getServicePackQuestionnaireInfo =
      options.getServicePackQuestionnaireInfo
    this.addressId = options.addressId || null
    this.is_address = options.is_address ? true : false
    if (this.isLogin) {
      //this.getaddressInfo();
      this.getloadPreOrder()
      this.getdefaultCouponListNumber()
    } else {
      //   toLogin()
    }
  },
  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    uni.hideLoading()
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
    }

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
    // console.log(999);
    this.isClose = true
  },
  methods: {
    // 订单详情
    getloadPreOrder: function () {
      this.loading = true
      loadPreOrderApi(this.preOrderNo)
        .then(res => {
          this.loading = false
          let orderInfoVo = res.data.orderInfoVo
          this.orderInfoVo = res.data.orderInfoVo
          this.productOrderInfo = res.data.productOrderInfo
          this.orderInfoVo = orderInfoVo
          this.cartInfo = orderInfoVo.orderDetailList
          this.orderProNum = orderInfoVo.orderProNum
          this.address.addressId = this.addressId
            ? this.addressId
            : orderInfoVo.addressId
            ? orderInfoVo.addressId
            : null
          // if (!this.address.addressId) {
          //   this.$util.Tips({
          //     title: "请设置地址"
          //   })
          // }
          // this.cartArr[1].title = '可用余额:' + orderInfoVo.userBalance;
          // this.cartArr[1].payStatus = parseInt(res.data.yuePayStatus) === 1 ? 1 : 2;
          this.cartArr[0].payStatus =
            parseInt(res.data.payWeixinOpen) === 1 ? 1 : 0
          this.store_self_mention =
            res.data.storeSelfMention == "true" && this.productType === "normal"
              ? true
              : false
          //调用子页面方法授权后执行获取地址列表
          this.$nextTick(function () {
            this.$refs.addressWindow.getAddressList()
          })
        })
        .catch(err => {
          this.loading = false
          // this.$util.Tips({
          //   title: err.message
          // })
          this.$refs.uToast.show({
            title: err.message,
            type: "primary"
          })
          // console.log(err, '订单详情出错')
          // return this.$util.Tips({
          // 	title: err
          // });
        })
    },
    //   //备注弹窗关闭
    // close() {
    // 	  this.addMarkWindow = false
    // 	  this.headTitle = '订单详情'
    // 	  this.markType = '查看备注'
    //   },
    //   markValue(value) {
    // 	  console.log(value)
    // 	  if (value) {
    // 		   this.mark = value
    // 	  }

    //   },
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
    getList: function () {
      let longitude = uni.getStorageSync("user_longitude") //经度
      let latitude = uni.getStorageSync("user_latitude") //纬度
      let data = {
        latitude: latitude, //纬度
        longitude: longitude, //经度
        page: 1,
        limit: 10
      }
      storeListApi(data)
        .then(res => {
          let list = res.data.list || []
          this.$set(this, "storeList", list)
          this.$set(this, "system_store", list[0])
        })
        .catch(err => {
          console.log("获取门店列表数据出错")
          // return this.$util.Tips({
          // 	title: err
          // });
        })
    },
    // 关闭地址弹窗；
    changeClose: function () {
      this.$set(this.address, "address", false)
    },
    /*
     * 跳转门店列表
     */
    showStoreList: function () {
      if (this.storeList.length > 0) {
        uni.navigateTo({
          url: "/pages/users/goods_details_store/index"
        })
      }
    },
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
          this.orderInfoVo.proTotalFee = (
            Number(data.proTotalFee) - Number(data.couponFee)
          ).toFixed(2)
          this.orderInfoVo.useIntegral = data.useIntegral
          this.orderInfoVo.usedIntegral = data.usedIntegral
          this.orderInfoVo.surplusIntegral = data.surplusIntegral
          //this.orderInfoVo.userIntegral = data.userIntegral;
        })
        .catch(err => {
          console.error("计算订单价格出错")
          // return this.$util.Tips({
          // 	title: err
          // });
        })
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
    //跳转添加备注页面
    addMarkMode() {
      this.$Router.push({
        path: "/remark",
        query: {
          remark: this.mark,
          paid: false //代表未支付
        }
      })
      //   this.headTitle = '添加备注'
      //   this.addMarkWindow = true
      //   console.log(this.addMarkWindow)
      //   this.$Router.push({
      // 	  path: '/addMask'
      //   })
    },
    /**
     * 处理兑换优惠卷的的事件
     */
    async redeemCoupons(val) {
      if (val) {
        // Promise.resolve()
        //   .then(() => {
        //     this.getCouponList()
        //   })
        //   .then(() => {
        //     this.ChangCoupons(this.coupon.list.length - 1)
        //   })

        await this.getCouponList()
        await this.selectConponLIstItem(val)

        // console.log("执行1")
        // console.log("执行4")
      }
    },
    /**
     * 选择兑换的优惠券
     */

    selectConponLIstItem(val) {
      this.coupon.list.forEach((item, index) => {
        if (item.id == val) {
          this.ChangCoupons(index)
        }
      })
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

        this.couponTitle = list.length
      } else {
        //使用优惠券
        list[index].use_title = "不使用"
        list[index].isUse = 1
        couponTitle = list[index].name
        couponId = list[index].id
      }
      // this.couponTitle = couponTitle
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
      // this.computedPrice()
    },
    // bindHideKeyboard: function (e) {
    //   this.mark = e.detail.value
    // },
    /**
     * 获取当前金额可用优惠券
     *
     */
    async getCouponList() {
      //测试
      this.$set(this.coupon, "list", [])
      this.openType = 1
      //主体
      // getCouponsOrderPrice(this.preOrderNo).then(res => {
      //   this.$set(this.coupon, "list", res.data)
      //   this.openType = 1
      // })
      try {
        await this.getAllCouponList()
      } catch (err) {
        console.error(err)
      }
    },
    getAllCouponList() {
      return new Promise((resolve, reject) => {
        getCouponsOrderPrice(this.preOrderNo)
          .then(res => {
            this.$set(this.coupon, "list", res.data)
            this.openType = 1
            resolve(true)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    /**
     * 获取默认的当前卡劵的数量
     */
    getdefaultCouponListNumber: function () {
      //主体
      getCouponsOrderPrice(this.preOrderNo).then(res => {
        if (res.code == 200) {
          if (res.data) {
            this.couponTitle = res.data.length
          }
        }
      })
    },
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
      console.log(
        this.couponTitle,
        this.coupon,
        "this.couponthis.couponthis.coupon"
      )
      if (!this.coupon.list.length) this.getCouponList()
      if (this.couponTitle > 0) {
        this.coupon.coupon = true
      } else {
        this.$refs["couponListWindow"].getCoupon()
      }
    },
    car: function () {
      let that = this
      that.animated = false
    },
    onAddress: function () {
      let that = this
      that.textareaStatus = false
      that.address.address = true
      that.pagesUrl =
        "/pages/shopping-mall/user_address_list/index?preOrderNo=" +
        this.preOrderNo
    },
    // realName: function (e) {
    //   this.contacts = e.detail.value
    // },
    // phone: function (e) {
    //   this.contactsTel = e.detail.value
    // },
	//关联咨询id和订单（暂用）
	setFillInOrder(consultId,orderId){
		fillInOrder(consultId,orderId).then(res => {
		        if (res.code === RequestList.SUCCESS_CODE) {
				  let data = res.data
				  console.log(data)
				  this.$store.commit('CLEAN_SERVICE_CONSULT_DATA')//清除咨询id 药类型
		        }
		      })
			  .catch(error => {
			       console.error(error)         
			   })
	},
    creatOrder: function (data) {
      let that = this
      orderCreate(data)
        .then(res => {
		  
          that.order_id = res.data.orderNo
          that.getOrderPay(res.data.orderNo, "支付成功")
        })
        .catch(err => {
          uni.hideLoading()

          return that.$util.Tips({
            title: err.message
          })
        })
    },
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
          uni.hideLoading()

          if (res.code === 200) {
			  
			
			  
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
						// console.log(res,"支付成功在哪里")
						//咨询id跟订单id关联接口（暂用）
						let drugType = that.$store.state.server.drugType
						let consultId = that.$store.state.server.consultId
						console.log(drugType,"药类型")
						if(drugType == 1){
							that.setFillInOrder(consultId,orderNo)
						}else{
							that.$store.commit('CLEAN_SERVICE_CONSULT_DATA')
						}
						
                        if (
                          that.orderInfoVo.bargainId ||
                          that.orderInfoVo.combinationId ||
                          that.pinkId ||
                          that.orderInfoVo.seckillId
                        )
                          // return that.$util.Tips(
                          //   {
                          //     title: "支付成功",
                          //     icon: "success"
                          //   },
                          //   {
                          //     tab: 4,
                          //     url: goPages
                          //   }
                          // )
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
                      })
                      .catch(() => {
                        uni.hideLoading()
                        uni.reLaunch({
                          // 						    "/pages/shopping-mall/order_details/index?order_id=" +
                          //   order_id +
                          //   "&paid=" +
                          //   paid +
                          //   "&addressId=" +
                          //   addressId
                          url: goPages
                        })
                        return that.$util.Tips({
                          title: "支付失败"
                        })
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
                    uni.redirectTo({
                      // 						    "/pages/shopping-mall/order_details/index?order_id=" +
                      //   order_id +
                      //   "&paid=" +
                      //   paid +
                      //   "&addressId=" +
                      //   addressId
                      url:
                        "/pages/shopping-mall/order_details/index?order_id=" +
                        that.order_id +
                        "&paid=" +
                        that.paid +
                        "&addressId=" +
                        that.address.addressId +
                        "&referrerName=" +
                        encodeURIComponent(that.referrerName)
                    })
                    // this.$Router.replace({
                    // 	path:
                    // })
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
                // #ifdef H5
                //   let data = {
                //     timestamp: jsConfig.timeStamp,
                //     nonceStr: jsConfig.nonceStr,
                //     package: jsConfig.packages,
                //     signType: jsConfig.signType,
                //     paySign: jsConfig.paySign
                //   }
                //   that.$wechat
                //     .pay(data)
                //     .then(res => {
                //       if (res.errMsg == "chooseWXPay:cancel") {
                //         uni.hideLoading()
                //         return that.$util.Tips(
                //           {
                //             title: "取消支付"
                //           },
                //           {
                //             tab: 5,
                //             url: goPages + "&status=2"
                //           }
                //         )
                //       } else {
                //         wechatQueryPayResult(orderNo)
                //           .then(res => {
                //             uni.hideLoading()
                //             return that.$util.Tips(
                //               {
                //                 title: "支付成功",
                //                 icon: "success"
                //               },
                //               {
                //                 tab: 5,
                //                 url: goPages
                //               }
                //             )
                //           })
                //           .cache(err => {
                //             uni.hideLoading()
                //             return that.$util.Tips({
                //               title: err
                //             })
                //           })
                //       }
                //     })
                //     .cache(res => {
                //       uni.hideLoading()
                //       return that.$util.Tips(
                //         {
                //           title: "取消支付"
                //         },
                //         {
                //           tab: 5,
                //           url: goPages + "&status=0"
                //         }
                //       )
                //     })
                // #endif
                break
              case "yue":
                uni.hideLoading()
				//咨询id跟订单id关联接口（暂用）
				let drugType = that.$store.state.server.drugType
				let consultId = that.$store.state.server.consultId
				// console.log(drugType,"药类型")
				if(drugType == 1){
					that.setFillInOrder(consultId,orderNo)
				}else{
					that.$store.commit('CLEAN_SERVICE_CONSULT_DATA')
				}
				
				
				
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
                break
              // case "weixinh5":
              //   uni.hideLoading()
              //   that.$util.Tips(
              //     {
              //       title: "订单创建成功"
              //     },
              //     {
              //       tab: 5,
              //       url: goPages + "&status=0"
              //     }
              //   )
              //   setTimeout(() => {
              //     location.href =
              //       jsConfig.mwebUrl +
              //       "&redirect_url=" +
              //       window.location.protocol +
              //       "//" +
              //       window.location.host +
              //       goPages +
              //       "&status=1"
              //   }, 100)
              //   break
            }
          } else {
            return that.$util.Tips({
              title: res.msg
            })
          }
        })
        .catch(err => {
          uni.hideLoading()

          return that.$util.Tips({
            title: err.message
          })
        })
    },
    // getPayType: function (status, orderId, message, jsConfig) {
    //   let that = this
    //   let goPages =
    //     "/pages/order_pay_status/index?order_id=" + orderId + "&msg=" + message
    //   switch (status) {
    //     case "ORDER_EXIST":
    //     case "EXTEND_ORDER":
    //     case "PAY_ERROR":
    //       uni.hideLoading()
    //       return that.$util.Tips(
    //         {
    //           title: message
    //         },
    //         {
    //           tab: 5,
    //           url: goPages
    //         }
    //       )
    //       break
    //     case "SUCCESS":
    //       uni.hideLoading()
    //       if (
    //         that.orderInfoVo.bargainId ||
    //         that.orderInfoVo.combinationId ||
    //         that.pinkId ||
    //         that.orderInfoVo.seckillId
    //       )
    //         return that.$util.Tips(
    //           {
    //             title: message,
    //             icon: "success"
    //           },
    //           {
    //             tab: 4,
    //             url: goPages
    //           }
    //         )
    //       return that.$util.Tips(
    //         {
    //           title: message,
    //           icon: "success"
    //         },
    //         {
    //           tab: 5,
    //           url: goPages
    //         }
    //       )
    //       break
    //     case "WECHAT_PAY":
    //       // #ifdef MP
    //       that.toPay = true
    //       let packagess = "prepay_id=" + jsConfig.prepayId
    //       uni.requestPayment({
    //         timeStamp: jsConfig.timeStamp.toString(),
    //         nonceStr: jsConfig.nonceStr,
    //         package: packagess,
    //         signType: jsConfig.signType,
    //         paySign: jsConfig.paySign,
    //         success: function (res) {
    //           uni.hideLoading()
    //           if (
    //             that.orderInfoVo.bargainId ||
    //             that.orderInfoVo.combinationId ||
    //             that.pinkId ||
    //             that.orderInfoVo.seckillId
    //           )
    //             return that.$util.Tips(
    //               {
    //                 title: "支付成功",
    //                 icon: "success"
    //               },
    //               {
    //                 tab: 4,
    //                 url: goPages
    //               }
    //             )
    //           return that.$util.Tips(
    //             {
    //               title: "支付成功",
    //               icon: "success"
    //             },
    //             {
    //               tab: 5,
    //               url: goPages
    //             }
    //           )
    //         },
    //         fail: function (e) {
    //           uni.hideLoading()
    //           return that.$util.Tips(
    //             {
    //               title: "取消支付"
    //             },
    //             {
    //               tab: 5,
    //               url: goPages + "&status=0"
    //             }
    //           )
    //         },
    //         complete: function (e) {
    //           uni.hideLoading()
    //           //关闭当前页面跳转至订单状态
    //           if (res.errMsg == "requestPayment:cancel")
    //             return that.$util.Tips(
    //               {
    //                 title: "取消支付"
    //               },
    //               {
    //                 tab: 5,
    //                 url: goPages + "&status=0"
    //               }
    //             )
    //         }
    //       })
    //       // #endif
    //       // #ifdef H5
    //       // let jsConfigAgain = jsConfig
    //       // let packages = "prepay_id=" + jsConfigAgain.prepayId
    //       // let data = {
    //       //   timestamp: jsConfigAgain.timeStamp,
    //       //   nonceStr: jsConfigAgain.nonceStr,
    //       //   package: packages,
    //       //   signType: jsConfigAgain.signType,
    //       //   paySign: jsConfigAgain.paySign,
    //       //   h5PayUrl: jsConfigAgain.h5PayUrl
    //       // }
    //       // this.$wechat
    //       //   .pay(data)
    //       //   .then(res => {
    //       //     return that.$util.Tips(
    //       //       {
    //       //         title: "支付成功",
    //       //         icon: "success"
    //       //       },
    //       //       {
    //       //         tab: 5,
    //       //         url: goPages
    //       //       }
    //       //     )
    //       //   })
    //       //   .cache(res => {
    //       //     if (res.errMsg == "requestPayment:cancel")
    //       //       return that.$util.Tips(
    //       //         {
    //       //           title: "取消支付"
    //       //         },
    //       //         {
    //       //           tab: 5,
    //       //           url: goPages + "&status=0"
    //       //         }
    //       //       )
    //       //   })
    //       // #endif
    //       break
    //     case "PAY_DEFICIENCY":
    //       uni.hideLoading()
    //       return that.$util.Tips(
    //         {
    //           title: message
    //         },
    //         {
    //           tab: 5,
    //           url: goPages + "&status=1"
    //         }
    //       )
    //       break
    //     case "WECHAT_H5_PAY": //网页版公众号支付
    //       setTimeout(() => {
    //         let domain = encodeURIComponent(location.href)
    //         let urls = jsConfigAgain.h5PayUrl + "&redirect_url=" + domain
    //         location.href = urls
    //         return that.$util.Tips(
    //           {
    //             title: "支付成功",
    //             icon: "success"
    //           },
    //           {
    //             tab: 5,
    //             url: goPages
    //           }
    //         )
    //       }, 100)
    //       break
    //   }
    // },
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
        referrerId: that.referrerId || '',
        storeId: that.system_store.id || 0,
        shippingType: that.$util.$h.Add(that.shippingType, 1),
        payChannel: that.payChannel,
        unionId: uni.getStorageSync(WeChat_INFO).unionId,

      }
      if (this.getServicePackQuestionnaireInfo && this.getServicePackQuestionnaireInfo === "have") {
        data.orderPreSurveyAnswer={
          answer:
            this.getServicePackQuestionnaireInfo === "have"
              ? this.$store.state.server.ServicePackQuestionnaireInfo.answer
              : {},
          surveyId:
            this.getServicePackQuestionnaireInfo === "have"
              ? this.$store.state.server.ServicePackQuestionnaireInfo.surveyId
              : "",
          servicePackageId:
            this.getServicePackQuestionnaireInfo === "have"
              ? this.$store.state.server.ServicePackQuestionnaireInfo
                .servicePackageId
              : "",
          version:
            this.getServicePackQuestionnaireInfo === "have"
              ? this.$store.state.server.ServicePackQuestionnaireInfo.version
              : ""
        }
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
	  //判断收货地址是否必填
	  if(that.productOrderInfo.productCategory === "product"){
		  if(that.address.addressId){
			  that.creatOrder(data)
		  }else{
			    return that.$util.Tips({
			      title: "请选择收货地址"
			    })
		  }
		  
	  }else{
		  that.creatOrder(data)
	  }
      
      // #ifdef MP
      // openPaySubscribe().then(() => {
      // 	that.payment(data);
      // });
      // #endif
      // #ifndef MP
      // that.creatOrder(data);
      // #endif
    },
    //扫一扫
    scanCode() {
      let that = this
      wx.scanCode({
        success(res) {
          console.log(res.result, "扫码出来的结果")
          if (res.result) {
            let result = JSON.parse(res.result)
            that.referrerId = result.id
            that.referrerName = result.nickName
          }
        }
      })
    },
    //删除推荐人
    delReferrerName() {
      this.referrerId = ""
      this.referrerName = ""
    }
  }
}
</script>

<style lang="scss" scoped>
.fw {
  font-weight: bold;
}
.couponTitleBig0 {
  width: 80px;
  line-height: 30px;
  background: linear-gradient(90deg, #f8e884, #fbd254);
  border-radius: 4px;
  font-size: 28rpx;
  text-align: center;
  font-weight: 500;
}
.couponTitleSmall0 {
  display: flex;
  align-items: center;
  view:first-child {
    padding-right: 5px;
    font-size: 28rpx;
    color: var(--text-color-grey);
  }
  view:last-child {
    line-height: 30px;
    background: linear-gradient(90deg, #f8e884, #fbd254);
    border-radius: 4px;
    font-size: 28rpx;
    text-align: center;
    font-weight: 500;
    padding: 0 6px;
    font-weight: bold;
  }
}
.Dot {
  margin-left: 5px;
  width: 6px;
  height: 6px;
  background: #fbd052;
  border-radius: 50%;
}
.address-box {
  width: 100%;
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.addressInfo-box {
  width: 100%;
}
.icon {
  width: 12%;
}
.remark-box {
  width: 60%;
  text-align: right;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
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
  // background: #f5f5f5;
  min-height: 100vh;
  background: var(--bg-color-main);
}
.ddMarkWindow {
  background: var(--bg-color-main);
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
.pad30 {
  width: 100%;
  margin: 0 auto;
  // padding: 20rpx 0 20rpx;
  background: var(--bg-color-second);
  // background: ;
}

.order-submission .address .addressCon {
  width: 100%;
  padding: 0 20rpx;
  font-size: 26rpx;
  // color: #666;
}

// .order-submission .address .addressCon .name {
//   font-size: 30rpx;
//   color: #282828;
//   font-weight: bold;
//   margin-bottom: 10rpx;
// }

// .order-submission .address .addressCon .name .phone {
//   display: inline-block;
//   // margin-left: 50rpx;
// }

// .order-submission .address .addressCon .default {
//   margin-right: 12rpx;
//   color: red;
// }

.order-submission .address .addressCon .setaddress {
  font-size: 28rpx;
  margin-left: 40rpx;
  color: var(--text-color-main);
}

// .order-submission .address .iconfont {
//   font-size: 35rpx;
//   color: #707070;
// }

.order-submission .allAddress {
  width: 100%;
  padding: 20rpx 0;
  background: var(--bg-color-second);
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.icon {
  display: inline-block;
  text-align: left;
  vertical-align: middle;
}
.title {
  vertical-align: middle;
}
// .order-submission .allAddress .nav {
//   width: 690rpx;
//   margin: 0 auto;
//   display: flex;
//   align-items: center;
// }

// .order-submission .allAddress .nav .item {
//   width: 334rpx;
// }

// .order-submission .allAddress .nav .item.on {
//   position: relative;
//   width: 230rpx;
// }

// .order-submission .allAddress .nav .item.on::before {
//   position: absolute;
//   bottom: 0;
//   content: "快递配送";
//   font-size: 28rpx;
//   display: block;
//   height: 0;
//   width: 336rpx;
//   border-width: 0 20rpx 80rpx 0;
//   border-style: none solid solid;
//   border-color: transparent transparent #fff;
//   z-index: 2;
//   border-radius: 14rpx 36rpx 0 0;
//   text-align: center;
//   line-height: 80rpx;
// }

// .order-submission .allAddress .nav .item:nth-of-type(2).on::before {
//   content: "到店自提";
//   border-width: 0 0 80rpx 20rpx;
//   border-radius: 36rpx 14rpx 0 0;
// }

// .order-submission .allAddress .nav .item.on2 {
//   position: relative;
// }

// .order-submission .allAddress .nav .item.on2::before {
//   position: absolute;
//   bottom: 0;
//   content: "到店自提";
//   font-size: 28rpx;
//   display: block;
//   height: 0;
//   width: 401rpx;
//   border-width: 0 0 60rpx 60rpx;
//   border-style: none solid solid;
//   border-color: transparent transparent #f7c1bd;
//   border-radius: 36rpx 14rpx 0 0;
//   text-align: center;
//   line-height: 60rpx;
// }

// .order-submission .allAddress .nav .item:nth-of-type(1).on2::before {
//   content: "快递配送";
//   border-width: 0 60rpx 60rpx 0;
//   border-radius: 14rpx 36rpx 0 0;
// }

.order-submission .allAddress .address {
  width: 100%;
  //   max-height: 180rpx;
  margin: 0 auto;
}

.order-submission .allAddress .line {
  width: 100%;
  margin: 0 auto;
}

// .order-submission .wrapper .item .discount .placeholder {
//   color: #ccc;
// }

.order-submission .wrapper {
  background-color: var(--bg-color-main);
  margin-top: 15rpx;
}

.order-submission .wrapper .item {
  padding: 27rpx 24rpx;
  font-size: 30rpx;

  border-bottom: 1px solid var(--bd-color-main);
}

.order-submission .wrapper .item .discount {
  font-size: 30rpx;
  // color: #333;
  display: flex;
}

// .order-submission .wrapper .item .discount .iconfont {
//   color: #515151;
//   font-size: 30rpx;
//   margin-left: 15rpx;
// }

.order-submission .wrapper .item .discount .num {
  font-size: 32rpx;
  margin-right: 20rpx;
}

// .order-submission .wrapper .item .shipping {
//   font-size: 30rpx;
//   color: #999;
//   position: relative;
//   padding-right: 58rpx;
// }

// .order-submission .wrapper .item .shipping .iconfont {
//   font-size: 35rpx;
//   color: #707070;
//   position: absolute;
//   right: 0;
//   top: 50%;
//   transform: translateY(-50%);
//   margin-left: 30rpx;
// }

// .order-submission .wrapper .item textarea {
//   background-color: #f9f9f9;
//   width: auto !important;
//   height: 140rpx;
//   border-radius: 14rpx;
//   margin-top: 30rpx;
//   padding: 15rpx;
//   box-sizing: border-box;
//   font-weight: 400;
// }

// .order-submission .wrapper .item .placeholder {
//   color: #ccc;
// }

.order-submission .wrapper .item .list {
  margin-top: 35rpx;
}

// .order-submission .wrapper .item .list .payItem {
//   border: 1px solid #eee;
//   border-radius: 14rpx;
//   height: 86rpx;
//   width: 100%;
//   box-sizing: border-box;
//   margin-top: 20rpx;
//   font-size: 28rpx;
//   color: #282828;
// }

// .order-submission .wrapper .item .list .payItem.on {
//   border-color: #fc5445;
//   color: red;
// }

// .order-submission .wrapper .item .list .payItem .name {
//   width: 50%;
//   text-align: center;
//   border-right: 1px solid #eee;
// }

// .order-submission .wrapper .item .list .payItem .name .iconfont {
//   width: 44rpx;
//   height: 44rpx;
//   border-radius: 50%;
//   text-align: center;
//   line-height: 44rpx;
//   background-color: #fe960f;
//   color: #fff;
//   font-size: 30rpx;
//   margin-right: 15rpx;
// }

// .order-submission .wrapper .item .list .payItem .name .iconfont.icon-weixin2 {
//   background-color: #41b035;
// }

// .order-submission .wrapper .item .list .payItem .tip {
//   width: 49%;
//   text-align: center;
//   font-size: 26rpx;
//   color: #aaa;
// }

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

// .order-submission .moneyList .item .money {
//   // color: #666666;
// }

.order-submission .footer {
  width: 100%;

  background-color: var(--bg-color-main);

  font-size: 28rpx;

  box-sizing: border-box;
  position: fixed;
  bottom: 0;
  left: 0;

  height: calc(120rpx + env(safe-area-inset-bottom));
  padding: 20rpx 0 20rpx;
}

.order-submission .footer .settlement {
  font-size: 30rpx;
  color: var(--text-color-main);
  width: 100%;
  height: 70rpx;
  background-color: var(--theme-color-dark-blue);
  border-radius: 50rpx;
  text-align: center;
  line-height: 70rpx;
}

.footer .transparent {
  opacity: 0;
}
.last-money {
  font-size: 40rpx;
  font-weight: 600;
  color: var(--text-color-yellow);
  line-height: 48rpx;
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
.flex-rigth {
  display: flex;
  justify-content: flex-end;
  align-items: center;
}
.coupon-right-text {
  display: flex;
  align-items: center;
  .arrow-right {
    padding-left: 5px;
  }
}
.left-text {
  font-size: 28rpx;
  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 50rpx;
  padding: 5px;
  display: flex;
  align-items: center;
  .CouponIcon {
    margin-left: 5px;
    width: 23px;
    height: 21px;
    image {
      width: 100%;
      height: 100%;
    }
  }
}
.right-text {
  font-size: 24rpx;
  font-weight: 400;
  color: var(--text-color-main);
  line-height: 32px;
}
.text-color {
  color: var(--text-color-main);
}
.text-phone {
  display: inline-block;
  margin-left: 25rpx;
}
.loading-box {
  width: 100vw;
  height: 90vh;
  margin: auto auto;
  text-align: center;
  line-height: 90vh;
}
.bottom-button-box {
  width: 92%;
  margin: 0 auto;
}
.saoyisaoBox {
  display: flex;
  align-items: center;
  .delIcon {
    padding: 5px;
  }
  .saoyisaoIcon {
    padding: 5px;
    margin-left: 8px;
  }
}
</style>
