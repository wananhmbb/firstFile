<template>
  <!-- <view class="u-skeleton"> -->
  <theme>
    <view class="product-con" slot="theme">
      <house-header
        :headTypeTwo="headTypeTwo"
        :clearTenantId="clearTenantId"
      ></house-header>

      <view v-if="productInfo && !detailLoading">
        <view
          id="home"
          class="home acea-row row-center-wrapper iconfont icon-xiangzuo"
          :class="opacity > 0.5 ? 'on' : ''"
          :style="{ top: homeTop + 'rpx' }"
          v-if="returnShow"
          @tap="returns"
        >
        </view>

        <view>
          <scroll-view
            :scroll-top="scrollTop"
            scroll-y="true"
            scroll-with-animation="true"
            :style="'height:' + height + 'px;'"
            @scroll="scroll"
          >
            <view id="past0">
              <view class="swiper-box">
                <productConSwiper
                  v-if="imageLength"
                  :imgUrls="sliderImage"
                  :videoline="productInfo.videoLink"
                >
                </productConSwiper>
              </view>

              <view class="pad30">
                <view class="wrapper mb30 borRadius14 row-background">
                  <view class="share acea-row row-between row-bottom flex">
                    <view class="price-sale">
                      <view class="price-unit"> ￥{{ totalPrice }}</view>
                      <view class="sale-num">
                        已售：{{
                          Math.floor(productInfo.sales) +
                            Math.floor(productInfo.ficti) || 0
                        }}
                      </view>
                    </view>
                  </view>
                  <view class="introduce">{{ productInfo.storeName }}</view>
                  <view class="product-introduction">
                    {{ productInfo.storeInfo[0].desc || "" }}
                  </view>

                  <view
                    v-if="coupon.list.length > 0 && type == 'normal'"
                    class="coupon acea-row row-between-wrapper flex"
                    @click="couponTap"
                  >
                    <view class="hide line1 acea-row">
                      优惠券：
                      <view class="activity">
                        满{{ coupon.list[0].minPrice }}减{{
                          coupon.list[0].money
                        }}</view
                      >
                    </view>
                    <view class="iconfont icon-jiantou"></view>
                  </view>
                  <view
                    class="coupon acea-row row-between-wrapper"
                    v-if="activityH5.length"
                  >
                    <view class="line1 acea-row">
                      <text class="activityName">活&nbsp;&nbsp;&nbsp;动：</text>
                      <view
                        v-for="(item, index) in activityH5"
                        :key="index"
                        @click="goActivity(item)"
                        class="activityBox"
                      >
                        <view
                          v-if="item.type === '1'"
                          :class="
                            index == 0
                              ? 'activity_pin'
                              : '' || index == 1
                              ? 'activity_miao'
                              : '' || index == 2
                              ? 'activity_kan'
                              : ''
                          "
                        >
                          <text class="iconfonts iconfont icon-pintuan"></text>
                          <text class="activity_title"> 参与秒杀</text>
                        </view>
                        <view
                          :class="
                            index == 0
                              ? 'activity_pin'
                              : '' || index == 1
                              ? 'activity_miao'
                              : '' || index == 2
                              ? 'activity_kan'
                              : ''
                          "
                          v-if="item.type === '2'"
                        >
                          <text
                            class="iconfonts iconfont icon-shenhezhong"
                          ></text>
                          <text class="activity_title"> 参与砍价</text>
                        </view>
                        <view
                          :class="
                            index == 0
                              ? 'activity_pin'
                              : '' || index == 1
                              ? 'activity_miao'
                              : '' || index == 2
                              ? 'activity_kan'
                              : ''
                          "
                          v-if="item.type === '3'"
                        >
                          <text class="iconfonts iconfont icon-kanjia"></text>
                          <text class="activity_title"> 参与拼团</text>
                        </view>
                      </view>
                    </view>
                  </view>
                </view>
                <!-- 使用提示 -->
                <view class="attribute introduction">
                  <view
                    v-if="productInfo.storeInfo[0].useDirection"
                    class="line1 flex background u-skeleton-rect"
                    @click="
                      openIntroduceUseDirectionTips(
                        '使用',
                        productInfo.storeInfo[0].useDirection
                          ? productInfo.storeInfo[0].useDirection
                          : ''
                      )
                    "
                  >
                    <view class="tip"
                      ><image
                        src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/servicepackageuse.png"
                      ></image
                    ></view>
                    <view class="moreBox">
                      <view class="use-method"
                        ><text
                          :class="
                            IntroduceUseDirectionTips ? 'atterTxt' : 'atterTxt1'
                          "
                          >{{
                            productInfo.storeInfo[0].useDirection
                              ? productInfo.storeInfo[0].useDirection
                              : ""
                          }}</text
                        ></view
                      >
                      <view class="iconBox"
                        ><u-icon
                          color="var(--text-color-grey)"
                          :name="
                            IntroduceUseDirectionTips
                              ? 'arrow-down'
                              : 'arrow-up'
                          "
                        ></u-icon
                      ></view>
                    </view>
                  </view>
                  <view
                    v-if="productInfo.storeInfo[0].hint"
                    class="line1 flex background u-skeleton-rect"
                    @click="
                      openIntroduceHealthTips(
                        '提示',
                        productInfo.storeInfo[0].hint
                          ? productInfo.storeInfo[0].hint
                          : ''
                      )
                    "
                  >
                    <view class="tip"
                      ><image
                        src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/servicepackagetips.png"
                      ></image
                    ></view>
                    <view class="moreBox">
                      <view class="use-method"
                        ><text
                          :class="
                            IntroduceHealthTips ? 'atterTxt' : 'atterTxt1'
                          "
                          >{{ productInfo.storeInfo[0].hint || "" }}</text
                        ></view
                      >
                      <view class="iconBox"
                        ><u-icon
                          color="var(--text-color-grey)"
                          :name="
                            IntroduceHealthTips ? 'arrow-down' : 'arrow-up'
                          "
                        ></u-icon
                      ></view>
                    </view>
                  </view>
                </view>

                <!-- 富文本组件的使用 -->
                <!-- <view class="richTextDetails">详情介绍</view> -->
                <view class="richTextDetails-box">
                  <view class="richTextDetails">详情介绍</view>
                  <richTextComponent
                    :htmlData="description"
                  ></richTextComponent>
                </view>
              </view>
            </view>

            <view
              style="height: calc(110rpx + env(safe-area-inset-bottom))"
            ></view>
          </scroll-view>
        </view>
        <!-- <u-popup
          v-model="introducePopupShow"
          mode="center"
          border-radius="14"
          width="75%"
          height="500rpx"
          :closeable="true"
        >
          <view class="introducePopup">
            <text class="title">{{ introducePopupTitle }}</text>
            <view class="text" v-html="introducePopupText"></view>
            <u-button
              class="u-button"
              type="primary"
              @click="introducePopupShow = false"
              >我知道了</u-button
            >
          </view>
        </u-popup> -->
        <view
          class="footer acea-row row-between-wrapper footer-service"
          v-if="productInfo.storeName"
        >
          <!-- #ifdef MP -->
          <button
            open-type="contact"
            :session-from="sessionFrom"
            hover-class="none"
            class="item footer-btn-css"
          >
            <!-- <view class="iconfont icon-kefu"></view> -->
            <view>
              <u-icon name="account-fill" size="45"></u-icon>
              <view>咨询客服</view>
            </view>
          </button>
          <!-- #endif -->

          <block v-if="type === 'normal'">
            <view
              class="bnt acea-row"
              style="
                display: flex;
                align-items: center;
                justify-content: space-around;
              "
            >
              <button
                v-if="this.hasExperienceAttr()"
                :class="['bnts', 'buy', 'able-buy']"
                @click="goBuy(false)"
                :loading="loadingExperienceBtn"
                style="
                  width: 45%;
                  background: var(--bg-color-main);
                  border: 1px solid var(--text-color-grey);
                  color: var(--text-color-main);
                "
              >
                立即体验
              </button>
              <button
                :class="['bnts', 'buy', 'able-buy']"
                @click="goBuy(true)"
                :loading="loadingBtn"
                :style="!this.hasExperienceAttr() ? 'width:100%' : 'width:45%'"
              >
                {{ isBuy ? "立即购买" : "敬请期待" }}
              </button>
            </view>
          </block>
        </view>

        <!-- 组件 -->
        <productWindow
          :attr="attr"
          :isShow="1"
          :iSplus="1"
          @myevent="onMyEvent"
          @ChangeAttr="ChangeAttr"
          @ChangeCartNum="ChangeCartNum"
          @attrVal="attrVal"
          @iptCartNum="iptCartNum"
          id="product-window"
        >
        </productWindow>
        <!-- <home></home> -->
        <couponListWindow
          :coupon="coupon"
          @ChangCouponsClone="ChangCouponsClone"
          @ChangCoupons="ChangCoupons"
          @ChangCouponsUseState="ChangCouponsUseState"
          @tabCouponType="tabCouponType"
        ></couponListWindow>
        <!-- 同意书 -->
        <userAgreementWindow
          :open="open"
          :isOperation="isOperation"
          :height="windowHeight"
          @close="close"
          :loading="!initAboutDetailedFinished"
          :htmlData="argeementHtmlData"
          :tagStyle="tagStyle"
          :referrerId="referrerId"
        >
        </userAgreementWindow>
        <u-popup
          border-radius="30"
          :closeable="true"
          v-model="statementShow"
          mode="center"
          height="50%"
          width="85%"
        >
          <text class="popuptitle">免责声明</text>
          <scroll-view scroll-y="true" style="height: 70%">
            <view class="name-content">
              <view>
                如您存在以下情况，请在运动测试开始之前与您的医生联系:</view
              >
              <view>1、不明原因的头晕、胸痛、气促、心悸等不适。</view>
              <view>
                2、短暂的视觉和语言能力丧失,一过性单侧肢体麻木或虚弱。</view
              >
              <view>3、未控制的高血压和/或糖尿病</view>
              <view> 4、自觉身体不(流感、感冒等)。</view>
              <view> 5、合并控制不良的心、脑、血管、肺部疾5病。</view>
              <view> 6、运动可能恶化加重的医学情况。</view>
              <view
                >7、未纠正的生理异常状态,如发热、贫血、电解质紊乱、甲亢等。</view
              >
              <view>8、医生告诉您暂时不要运动。</view>
            </view>
          </scroll-view>
          <view class="btn">
            <view @click="goServicePackQuestionnaire" class="iKnowBtn"
              >知道了</view
            >
          </view>
        </u-popup>
      </view>
      <view class="loading-box" v-if="detailLoading">
        <u-loading
          mode="circle"
          :show="detailLoading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <view class="emply" v-else-if="!productInfo && !detailLoading">
        <image
          src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/ipImage/404.png"
        ></image>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import {
  getProductDetail,
  collectAdd,
  collectDel,
  postCartAdd,
  getDetailedConsent,
  getServicePackQuestionnaire
} from "@/api/store.js"
import { spread } from "@/api/user"

import { mapGetters } from "vuex"

import productConSwiper from "@/components/productConSwiper"
import couponListWindow from "@/components/couponListWindow"
import productWindow from "@/components/productWindow"
import userAgreementWindow from "@/components/components/user-agreement-window/service-package-user-agreement-window.vue"

let app = getApp()
export default {
  components: {
    productConSwiper,
    couponListWindow,
    productWindow,
    userAgreementWindow
  },
  data() {
    return {
      getServicePackQuestionnaireInfo: "",
      clearTenantId: false,
      totalPrice: 0,
      sessionFrom: "msgfrom:order",
      megTitle: "服务包详情",
      megImg:
        "https://hjt-dev-011.oss-cn-chengdu.aliyuncs.com/hjt/20220314/20220314182521_0bb6be88ac954941bab6ec5a48e9a77e_KP8WXjriLzE8e65312f34e0655615957c0e9342617c6.jpg",
      megpath: "/pages/tabbar/index/index",
      IntroduceUseDirectionTips: true,
      IntroduceHealthTips: true,
      imageLength: false,
      initAboutDetailedFinished: false,
      argeementHtmlData: "",
      //属性是否打开
      coupon: {
        coupon: false,
        type: 1,
        list: [],
        count: []
      },
      introducePopupShow: false,
      introducePopupTitle: "",
      introducePopupText: "",
      attrTxt: "请选择", //属性页面提示
      attrValue: "", //已选属性
      animated: false, //购物车动画
      id: 0, //商品id
      replyCount: 0, //总评论数量
      reply: [], //评论列表
      productInfo: {}, //商品详情
      productValue: [], //系统属性
      couponList: [], //优惠券
      cart_num: 1, //购买数量
      isAuto: false, //没有授权的不会自动授权
      isShowAuth: false, //是否隐藏授权
      isOpen: false, //是否打开属性组件
      actionSheetHidden: true,
      storeImage: "", //海报产品图
      // PromotionCode: "", //二维码图片
      posterbackgd: "",
      sharePacket: {
        isState: true //默认不显示
      }, //分销商详细
      // uid: 0, //用户uid
      circular: false,
      autoplay: false,
      interval: 3000,
      duration: 500,
      clientHeight: "",
      windowHeight: "50vh",
      systemStore: {}, //门店信息
      good_list: [],
      replyChance: 0,
      CartCount: 0,
      isDown: true,

      attr: {
        cartAttr: false,
        productAttr: [{}],
        productSelect: {}
      },
      description: "",
      navActive: 0,
      // H5ShareBox: false, //公众号分享图片
      activityH5: [],
      retunTop: true, //顶部返回
      navH: "",
      navList: [],
      opacity: 0,
      scrollY: 0,
      topArr: [],
      toView: "",
      height: 0,
      heightArr: [],
      lock: false,
      scrollTop: 0,
      tagStyle: {
        img: "width:100%;display:block;",
        table: "width:100%",
        video: "width:100%"
      },
      sliderImage: [],
      qrcodeSize: 600,
      // canvasStatus: false, //是否显示海报
      imagePath: "", //海报路径
      imgTop: "",
      errT: "",
      homeTop: 20,
      navbarRight: 0,
      userCollect: false,
      returnShow: true, //判断顶部返回是否出现
      type: "", //视频号普通商品类型
      isLogin: true,
      htmlData: "",
      open: false, //打开详情同意书
      isOperation: true,
      loadingBtn: false,
      loadingExperienceBtn: false,
      // disabledBtn: false,
      useDirection: "",
      healthTips: "",
      isBuyNow: "",
      servicePackageId: "",
      detailLoading: true,
      isBuy: true, //是否可以购买,
      nonExperience: null,
      //有无问卷
      haveServicePackQuestionnaire: null,
      //问卷声明弹窗
      statementShow: false,
      productType: '',
      headTypeTwo: '服务包详情',
      referrerId: "" //推荐人id
    }
  },
  computed: mapGetters(["uid", "chatUrl"]),

  onLoad(options) {
    this.clearTenantId = this.$Route.query.clearTenantId
    this.referrerId = this.$Route.query.referrerId
    this.getServicePackQuestionnaireInfo =
      this.$Route.query.getServicePackQuestionnaireInfo
    if (options.tenantId) {
      this.tenantId = options.tenantId
      this.servicePackageId = options.servicePackageId
      this.id = options.id
      this.type = options.type
    } else {
      this.tenantId = uni.getStorageSync("tenantId")
    }
    wx.showShareMenu({
      withShareTicket: true,
      menus: ["shareAppMessage"]
    })
    let that = this
    uni.hideLoading()
    if (options.useDirection) {
      this.useDirection = JSON.parse(decodeURIComponent(options.useDirection))
    }
    if (options.haveServicePackQuestionnaire) {
      this.haveServicePackQuestionnaire = options.haveServicePackQuestionnaire
    }
    if (options.healthTips) {
      this.healthTips = JSON.parse(decodeURIComponent(options.healthTips))
    }
    this.productType=options.productType? options.productType:'servicePackage'
    this.isBuy = options.isBuy === "false" ? false : true || true
    if (!options.productType || options.productType !== 'product') {
      this.headTypeTwo ='服务包详情'
      this.saveTenantId().then(() => {
        if (this.isBuy) {
          this.getGoodsDetails()
          this.getAboutDetailedConsent()
        } else {
          this.detailLoading = false
          let vajraDistrictDictionariesList =
            this.$store.state.server.vajraDistrictDictionaries
          if (vajraDistrictDictionariesList) {
            vajraDistrictDictionariesList.forEach(item => {
              if (item.dictValue === "1785") {
                let vajraValue = JSON.parse(item.remark)
                // if (uni.getStorageSync("theme") == "dark") {
                //   let str = this.replaceImg(vajraValue.htmlData)
                //   that.$set(that, "description", str)
                // } else {
                //   that.$set(that, "description", vajraValue.htmlData)
                // }
                that.$set(that, "description", vajraValue.htmlData)
                this.imageLength = true
                that.$set(that, "sliderImage", vajraValue.sliderImage)
                that.productInfo = vajraValue.productInfo
                this.totalPrice = that.productInfo.price
              }
            })
          } else {
            console.log("未获取金刚区字典数据")
          }
        }
        this.isBuyNow = options.isBuyNow ? options.isBuyNow : false
        if (that.isBuyNow === "true") {
          this.initAboutDetailedFinished = false
          this.goBuy()
        }
      })
    }else{
      this.headTypeTwo = '商品详情'
    }
    this.servicePackageId = options.servicePackageId || 0
    var pages = getCurrentPages()
    that.returnShow = pages.length === 1 ? false : true
    if (pages.length <= 1) {
      that.retunTop = false
    }
    that.navH = app.globalData.navHeight
    // #ifdef MP || APP-PLUS
    // 小程序链接进入获取绑定关系id
    setTimeout(() => {
      if (options.spread) {
        app.globalData.spread = options.spread
        spread(options.spread).then(res => {})
      }
    }, 2000)
    // #endif
    uni.getSystemInfo({
      success: function (res) {
        that.height = res.windowHeight
      }
    })
    if (!options.scene && !options.id) {
      this.showSkeleton = false
      return
    }
    if (options.hasOwnProperty("id") || options.scene) {
      if (options.scene) {
        // 仅仅小程序扫码进入
        let qrCodeValue = that.$util.getUrlParams(
          decodeURIComponent(options.scene)
        )
        let mapeMpQrCodeValue = that.$util.formatMpQrCodeData(qrCodeValue)
        app.globalData.spread = mapeMpQrCodeValue.spread
        this.id = mapeMpQrCodeValue.id
        setTimeout(() => {
          spread(mapeMpQrCodeValue.spread)
            .then(res => {})
            .catch(res => {})
        }, 2000)
      } else {
        this.id = options.id
      }
      options.type == undefined || options.type == null
        ? (that.type = "normal")
        : (that.type = options.type)
      that.$store.commit("PRODUCT_TYPE", that.type)
      if(options.productType && options.productType ==='product') {
        this.getGoodsDetails()
      }
    }
  },

  methods: {
    //租户id存本地
    saveTenantId() {
      return new Promise(resolve => {
        this.$store.commit("getenants", this.tenantId)
        resolve("success")
      })
    },
    onShareAppMessage(res) {
      let tenantId = uni.getStorageSync("tenantId")
      console.log(res, "分享")
      return {
        title: "核联医",
        path:
          "/pages/shopping-mall/goods_details/index?tenantId=" +
          tenantId +
          "&id=" +
          this.id +
          "&type=" +
          this.type +
          "&servicePackageId=" +
          this.servicePackageId, //若无path 默认跳转分享页
        imageUrl: "", //若无imageUrl 截图当前页面
        // 成功的回调
        success: res => {},
        // 失败的回调
        fail: res => {},
        // 无论成功与否的回调
        complete: res => {}
      }
    },
    // 获取详情同意书
    getAboutDetailedConsent() {
      let that = this
      getDetailedConsent(this.servicePackageId)
        .then(res => {
          this.initAboutDetailedFinished = true
          if (res.code == "200") {
            that.argeementHtmlData = res.data.content || ""
          }
        })
        .catch(err => {
          this.initAboutDetailedFinished = true
          that.argeementHtmlData = ""
          that.$util.Tips({
            title: err.message
          })
        })
    },
    //获取服务包问卷
    getServicePackQuestionnaireDetails() {
      let that = this
      getServicePackQuestionnaire(this.servicePackageId).then(res => {
        if (res.code === 200) {
          if (res.data.data[0].questionList.length > 0) {
            console.log(
              that.haveServicePackQuestionnaire,
              "that.haveServicePackQuestionnaire"
            )
            if (that.haveServicePackQuestionnaire === "close") {
              that.haveServicePackQuestionnaire = false
              that.goBuy()
            } else {
              that.haveServicePackQuestionnaire = true
            }
          }
        }
      })
    },
    kefuClick() {
      location.href = this.chatUrl
    },
    //图片根据主题颜色变化
    replaceImg(description) {
      function insertStr(soure, start, newStr) {
        return soure.slice(0, start) + newStr + soure.slice(start)
      }
      var b = /<img [^>]*src=['"]([^'"]+)[^>]*>/g // img 标签取src里面内容的正则
      var s = description.match(b) // 取到所有img标签 放到数组 s里面
      for (var i = 0; i < s.length; i++) {
        var srcImg = s[i].replace(b, "$1") //取src面的内容
        var index = srcImg.lastIndexOf(".")
        let str = insertStr(srcImg, index, "_dark")
        //修改富文本字符串内容 img标签src 相对路径改为绝对路径
        description = description.replace(new RegExp(srcImg, "g"), str)
      }
      return description
    },

    /**
     * 获取产品详情
     *
     */
    getGoodsDetails: function () {
      let that = this
      that.detailLoading = true
      getProductDetail(that.id, that.type)
        .then(res => {
          if (res.code == 200) {
            that.detailLoading = false
            // this.getServicePackQuestionnaireDetails() //这个方法的目的就是为了获取购买前服务包配置测聘， 按道理讲， 这个服务包有前置测聘才发这个请求， 缺少判断
            let productInfo = res.data.productInfo
            // 字符串数组转数组；
            let arrayImg = productInfo.sliderImage
            let sliderImage = JSON.parse(arrayImg)
            // 根据主题色变换详情
            // if (uni.getStorageSync("theme") == "dark") {
            //   // let str = this.replaceImg(res.data.productInfo.content)
            //   that.$set(that, "description", str)
            // } else {
            //   that.$set(that, "description", productInfo.content)
            // }
            that.$set(that, "description", productInfo.content)
            that.$set(that, "sliderImage", sliderImage)
            that.$set(that, "productInfo", productInfo)
            // that.$set(that, "description", productInfo.content)
            that.productInfo.useDirection = that.useDirection
            that.productInfo.healthTips = that.healthTips
            that.productInfo.storeInfo = that.productInfo.storeInfo
              ? JSON.parse(that.productInfo.storeInfo)
              : ""
            that.$set(that, "userCollect", res.data.userCollect)
            that.$set(that.attr, "productAttr", res.data.productAttr)
            that.$set(that, "productValue", res.data.productValue)
            //算总价
            for (let k in res.data.productValue) {
              // let price = res.data.productValue[k].price * 100
              // this.totalPrice += price
              if (res.data.productValue[k].expand) {
                const productExpand = JSON.parse(
                  res.data.productValue[k].expand
                )
                if (productExpand.isExperience) {
                  // console.log("有体验包")
                } else {
                  this.totalPrice = res.data.productValue[k].price
                }
              } else {
                this.totalPrice = res.data.productValue[k].price
              }
            }

            that.$set(that.sharePacket, "priceName", res.data.priceName)
            that.$set(
              that.sharePacket,
              "isState",
              Math.floor(res.data.priceName) === 0
            )
            that.$set(
              that,
              "activityH5",
              res.data.activityAllH5 ? res.data.activityAllH5 : []
            )
            uni.setNavigationBarTitle({
              title: productInfo.storeName.substring(0, 7) + "..."
            })
            let productAttr = this.attr.productAttr.map(item => {
              return {
                attrName: item.attrName,
                attrValues: item.attrValues.split(","),
                id: item.id,
                isDel: item.isDel,
                productId: item.productId,
                type: item.type
              }
            })

            this.$set(this.attr, "productAttr", productAttr)
            // console.log(this.attr)
            if (that.isLogin) {
              // that.getCartCount()
              //#ifdef H5
              that.make(that.uid)
              // that.ShareInfo()
              // this.getImageBase64(this.productInfo.image)
              // #endif
              // #ifdef MP
              // that.getQrcode()
              // #endif
            }
            setTimeout(function () {
              that.infoScroll()
            }, 500)
            // #ifdef MP
            that.imgTop = res.data.productInfo.image
            // #endif
            // #ifndef H5
            that.downloadFilestoreImage()
            // #endif
            // that.DefaultSelect()
            this.imageLength = true
          } else {
            that.detailLoading = false
            that.$set(that, "productInfo", "")
          }
        })
        .catch(err => {
          that.detailLoading = false
          that.$set(that, "productInfo", "")

          if (!err.code) {
            console.error("错误信息")
          }
        })
    },
    /**
     * 拨打电话
     */
    makePhone: function () {
      uni.makePhoneCall({
        phoneNumber: this.systemStore.phone
      })
    },
    /**
     * 判断，是否有体验的规格
     */
    hasExperienceAttr() {
      for (const key in this.productValue) {
        const isExperienceAttr = this.isExperience(this.productValue[key])
        if (isExperienceAttr) {
          return true
        }
      }

      return false
    },
    /**
     * 判断是否是体验规格
     * @param product 是this.productValue这个Object中，某个键的值
     */
    isExperience(product) {
      if (!product.expand) {
        return false
      }
      try {
        const productExpand = JSON.parse(product.expand)
        return productExpand.isExperience === true
      } catch (e) {
        console.error("判断是否是体验规格时异常")
        console.error(e)
        return false
      }
    },
    /**
     * 默认选中服务包的体验规格
     */
    defaultSelectExperience: function () {
      let value = []
      for (let key in this.productValue) {
        const product = this.productValue[key]
        if (!this.nonExperience) {
          if (product.stock > 0 && this.isExperience(product)) {
            value.push(key)
          }
        } else {
          if (product.stock > 0 && !this.isExperience(product)) {
            value.push(key)
          }
        }
      }
      // 默认选中的规格序号
      const selectAttrIndex = 0
      // 默认选中的规格键
      const selectAttrKey = value[selectAttrIndex]
      this.$set(this.attr.productAttr[0], "index", selectAttrKey)

      let productSelect = this.productValue[selectAttrKey]
      console.log("默认选中服务包体验规格： " + selectAttrKey)
      this.setProductSelect(productSelect, selectAttrKey)
    },
    /**
     * 默认选中规格
     *
     */
    DefaultSelect: function (nonExperience) {
      if (this.hasExperienceAttr()) {
        this.defaultSelectExperience()
        return
      }
      let productAttr = this.attr.productAttr
      let value = []
      for (let key in this.productValue) {
        if (this.productValue[key].stock > 0) {
          value = this.attr.productAttr.length ? key.split(",") : []
          break
        }
      }
      for (let i = 0; i < productAttr.length; i++) {
        this.$set(productAttr[i], "index", value[i])
      }
      //sort();排序函数:数字-英文-汉字；
      let productSelect = this.productValue[value.join(",")]
      console.log("默认选中规格： " + value.join(","))
      this.setProductSelect(productSelect, value.join(","))
    },
    /**
     * 设置选中的商品规格
     * 备注： 此部分代码，原本写在方法： DefaultSelect中。
     * 后来因引入了新的设置默认规格的逻辑，为了保证其他选中默认规格的差异性不会互相影响，且需要保障后流程的一致性，将设置规格部分代码独立出来。
     */
    setProductSelect(productSelect, newAttrValue) {
      const productAttr = this.attr.productAttr
      if (productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "storeName",
          this.productInfo.storeName
        )
        this.$set(this.attr.productSelect, "image", productSelect.image)
        this.$set(this.attr.productSelect, "price", productSelect.price)
        this.$set(this.attr.productSelect, "stock", productSelect.stock)
        this.$set(this.attr.productSelect, "unique", productSelect.id)
        this.$set(this.attr.productSelect, "cart_num", 1)
        this.$set(this, "attrValue", newAttrValue)
        this.$set(this, "attrTxt", "已选择")
      } else if (!productSelect && productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "storeName",
          this.productInfo.storeName
        )
        this.$set(this.attr.productSelect, "image", this.productInfo.image)
        this.$set(this.attr.productSelect, "price", this.productInfo.price)
        this.$set(this.attr.productSelect, "stock", 0)
        this.$set(this.attr.productSelect, "unique", this.productInfo.id)
        this.$set(this.attr.productSelect, "cart_num", 1)
        this.$set(this, "attrValue", "")
        this.$set(this, "attrTxt", "请选择")
      } else if (!productSelect && !productAttr.length) {
        this.$set(
          this.attr.productSelect,
          "storeName",
          this.productInfo.storeName
        )
        this.$set(this.attr.productSelect, "image", this.productInfo.image)
        this.$set(this.attr.productSelect, "price", this.productInfo.price)
        this.$set(this.attr.productSelect, "stock", this.productInfo.stock)
        this.$set(this.attr.productSelect, "unique", this.productInfo.id || "")
        this.$set(this.attr.productSelect, "cart_num", 1)
        this.$set(this, "attrValue", "")
        this.$set(this, "attrTxt", "请选择")
      }
    },
    // 判断是实物商城还是服务包
    judgeGoBuyIsProductOrServerPackage(nonExperience) {
      if (this.productType === 'product') {
        this.goCat(0)
      }else {
        if (this.haveServicePackQuestionnaire) {
          this.statementShow = true
        } else {
          this.nonExperience = nonExperience
          if (!this.isBuy) {
            return
          }
          this.$store.commit("IS_LOGIN")
          this.open = true
        }
      }
    },
    /**
     * 立即购买
     */
    goBuy: function (nonExperience) {
      if (!this.$store.state.user.isLogin) {
        this.$Router.push({
          path: "/login"
        })
      } else {
        // this.disabledBtn = true
        this.judgeGoBuyIsProductOrServerPackage(nonExperience)

      }
    },
    // 关闭详情同意书
    close(value) {
      this.open = false
      if (value) {
        // this.signatureAboutDetailsConsent()
        this.goCat(0)
      } else {
        // this.disabledBtn = false
      }
    },
    ChangCouponsClone: function () {
      this.$set(this.coupon, "coupon", false)
    },
    /**
     * 预下单
     */
    getPreOrder: function () {
      // let Obj = {
      //   useDirection: this.useDirection,
      //   healthTips: this.healthTips
      // } //传输提示和使用说明
      //判断是不是体验包的支付按钮的loading
      if (this.nonExperience) {
        this.loadingBtn = true
      } else {
        this.loadingExperienceBtn = true
      }
      this.$Order
        .getPreOrder(
          this.type === "normal" ? "buyNow" : "video",
          [
            {
              attrValueId: this.attr.productSelect.unique.toString(),
              productId: this.id.toString(),
              productNum: parseFloat(this.attr.productSelect.cart_num)
            }
          ],
          this.getServicePackQuestionnaireInfo
        )
        .then(res => {
          if (res.data) {
            if (this.nonExperience) {
              this.loadingBtn = false
            } else {
              this.loadingExperienceBtn = false
            }
            // this.disabledBtn = false
          }
        })
        .catch(err => {
          if (this.nonExperience) {
            this.loadingBtn = false
          } else {
            this.loadingExperienceBtn = false
          }
          // this.disabledBtn = false
          if (err.code && err.code == 401) {
            uni.navigateTo({
              url: "/pages/login/index"
            })
            return
          }
          // if (err.code && err.code !== 200) {
          //   return
          // }
          // this.$util.Tips({
          //   title: err.message
          // })
          this.$refs.uToast.show({
            title: err.msg,
            type: "primary"
          })
        })
    },
    // 授权关闭
    // authColse: function (e) {
    //   this.isShowAuth = e
    // },
    openIntroduceUseDirectionTips: function (title, text) {
      this.IntroduceUseDirectionTips = !this.IntroduceUseDirectionTips
      this.introducePopupTitle = title
      this.introducePopupText = text.replace(/。/g, "。<br>")
    },
    openIntroduceHealthTips: function (title, text) {
      this.IntroduceHealthTips = !this.IntroduceHealthTips
      this.introducePopupTitle = title
      this.introducePopupText = text.replace(/。/g, "。<br>")
    },
    /**
     * 加入购物车
     */
    goCat: function (num) {
      let that = this,
        productSelect = that.productValue[this.attrValue]
      //打开属性
      if (that.attrValue) {
        //默认选中了属性，但是没有打开过属性弹窗还是自动打开让用户查看默认选中的属性
        // that.attr.cartAttr = !that.isOpen ? true : false
      } else {
        // if (that.isOpen) that.attr.cartAttr = true
        // else that.attr.cartAttr = !that.attr.cartAttr
      }
      that.DefaultSelect(this.nonExperience)
      //只有关闭属性弹窗时进行加入购物车
      if (that.attr.cartAttr === true && that.isOpen === false)
        return (that.isOpen = true)
      //如果有属性,没有选择,提示用户选择
      // if (
      //   that.attr.productAttr.length &&
      //   productSelect.stock === 0 &&
      //   that.isOpen === true
      // )
      //   return that.$util.Tips({
      //     title: "产品库存不足，请选择其它"
      //   })
      // 添加购物车的操作 1 代表加入购物车, 0 则是购买操作
      if (num === 1) {
        let q = {
          productId: parseFloat(that.id),
          cartNum: parseFloat(that.attr.productSelect.cart_num),
          isNew: false,
          productAttrUnique:
            that.attr.productSelect !== undefined
              ? that.attr.productSelect.unique
              : that.productInfo.id
        }
        postCartAdd(q)
          .then(function (res) {
            that.isOpen = false
            that.attr.cartAttr = false
            that.$util.Tips({
              title: "添加购物车成功",
              success: () => {
                // that.getCartCount(true)
              }
            })
          })
          .catch(res => {
            that.isOpen = false
            return that.$util.Tips({
              title: res
            })
          })
      } else {
        this.getPreOrder()
      }
    },
    /*** 以下为废弃源码  ***/
    // 商城源码-已废弃
    infoScroll: function () {
      var that = this,
        topArr = [],
        heightArr = []
      for (var i = 0; i < that.navList.length; i++) {
        //productList
        //获取元素所在位置
        var query = uni.createSelectorQuery().in(this)
        var idView = "#past" + i
        // if (!that.data.good_list.length && i == 2) {
        //   var idView = "#past" + 3;
        // }
        query.select(idView).boundingClientRect()
        // query.exec(function (res) {
        //   var top = res[0].top
        //   var height = res[0].height
        //   topArr.push(top)
        //   heightArr.push(height)
        //   that.$set(that, "topArr", topArr)
        //   that.$set(that, "heightArr", heightArr)
        // })
      }
    },

    /**
     * 商城源码-已废弃
     * 购物车数量加和数量减
     *
     */
    ChangeCartNum: function (changeValue) {
      //changeValue:是否 加|减
      //获取当前变动属性
      let productSelect = this.productValue[this.attrValue]
      //如果没有属性,赋值给商品默认库存
      if (productSelect === undefined && !this.attr.productAttr.length)
        productSelect = this.attr.productSelect
      //无属性值即库存为0；不存在加减；
      if (productSelect === undefined) return
      let stock = productSelect.stock || 0
      let num = this.attr.productSelect
      if (changeValue) {
        num.cart_num++
        if (num.cart_num > stock) {
          this.$set(this.attr.productSelect, "cart_num", stock)
          this.$set(this, "cart_num", stock)
        }
      } else {
        num.cart_num--
        if (num.cart_num < 1) {
          this.$set(this.attr.productSelect, "cart_num", 1)
          this.$set(this, "cart_num", 1)
        }
      }
    },
    // 商城源码-已废弃
    attrVal(val) {
      this.$set(
        this.attr.productAttr[val.indexw],
        "index",
        this.attr.productAttr[val.indexw].attrValues[val.indexn]
      )
    },
    /**
     * 商城源码-已废弃
     * 属性变动赋值
     *
     */
    ChangeAttr: function (res) {
      let productSelect = this.productValue[res]
      if (productSelect) {
        this.$set(this.attr.productSelect, "image", productSelect.image)
        this.$set(this.attr.productSelect, "price", productSelect.price)
        this.$set(this.attr.productSelect, "stock", productSelect.stock)
        this.$set(this.attr.productSelect, "unique", productSelect.id)
        this.$set(this.attr.productSelect, "cart_num", 1)
        this.$set(this, "attrValue", res)
        this.$set(this, "attrTxt", "已选择")
      } else {
        this.$set(this.attr.productSelect, "image", this.productInfo.image)
        this.$set(this.attr.productSelect, "price", this.productInfo.price)
        this.$set(this.attr.productSelect, "stock", 0)
        this.$set(this.attr.productSelect, "unique", this.productInfo.id)
        this.$set(this.attr.productSelect, "cart_num", 1)
        this.$set(this, "attrValue", "")
        this.$set(this, "attrTxt", "请选择")
      }
    },
    /**
     * 商城源码-已废弃
     * 领取完毕移除当前页面领取过的优惠券展示
     */
    ChangCoupons: function (e) {
      let coupon = e
      let couponList = this.$util.ArrayRemove(this.couponList, "id", coupon.id)
      this.$set(this, "couponList", couponList)
      // this.getCouponList() // 项目已经废弃 （获取优惠券列表）
    },

    //替换安全域名
    setDomain: function (url) {
      url = url ? url.toString() : ""
      //本地调试打开,生产请注销
      if (url.indexOf("https://") > -1) return url
      else return url.replace("http://", "https://")
    },
    //获取海报产品图（解决跨域问题，只适用于小程序）
    downloadFilestoreImage: function () {
      let that = this
      uni.downloadFile({
        url: that.setDomain(that.productInfo.image),
        success: function (res) {
          that.storeImage = res.tempFilePath
        },
        fail: function () {
          return that.$util.Tips({
            title: ""
          })
          that.storeImage = ""
        }
      })
    },

    /**
     * 商城源码-已废弃
     * @param e
     */
    goActivity: function (e) {
      let item = e
      if (item.type === "1") {
        uni.navigateTo({
          url: `/pages/activity/goods_seckill_details/index?id=${item.id}`
        })
      } else if (item.type === "2") {
        uni.navigateTo({
          url: `/pages/activity/goods_bargain_details/index?id=${item.id}&startBargainUid=${this.uid}`
        })
      } else {
        uni.navigateTo({
          url: `/pages/activity/goods_combination_details/index?id=${item.id}`
        })
      }
    },
    /**
     * 商城源码-已废弃
     * 购物车手动填写
     *
     */
    iptCartNum: function (e) {
      this.$set(this.attr.productSelect, "cart_num", e ? e : 1)
    },
    // 商城源码-已废弃 后退
    returns: function () {
      uni.navigateBack()
    },

    // 商城源码-已废弃
    scroll: function (e) {
      var that = this,
        scrollY = e.detail.scrollTop
      var opacity = scrollY / 200
      opacity = opacity > 1 ? 1 : opacity
      that.$set(that, "opacity", opacity)
      that.$set(that, "scrollY", scrollY)
      if (that.lock) {
        that.$set(that, "lock", false)
        return
      }
      for (var i = 0; i < that.topArr.length; i++) {
        if (
          scrollY <
          that.topArr[i] - app.globalData.navHeight / 2 + that.heightArr[i]
        ) {
          that.$set(that, "navActive", i)
          break
        }
      }
    },

    // 商城源码-已废弃
    tabCouponType(type) {
      this.$set(this.coupon, "type", type)
      // this.getCouponList(type) //项目已经废弃 获取优惠劵
    },

    // 商城源码-已废弃
    ChangCouponsUseState(index) {
      let that = this
      that.coupon.list[index].isUse = true
      that.$set(that.coupon, "list", that.coupon.list)
      that.$set(that.coupon, "coupon", false)
    },
    /**
     * 商城源码-已废弃
     * 收藏商品
     */
    setCollect: function () {
      let that = this

      if (this.userCollect) {
        collectDel(this.productInfo.id).then(res => {
          that.$set(that, "userCollect", !that.userCollect)
        })
      } else {
        collectAdd(this.productInfo.id).then(res => {
          that.$set(that, "userCollect", !that.userCollect)
        })
      }
    },
    /**
     * 商城源码-已废弃
     * 打开属性插件
     */
    selecAttr: function () {
      this.$set(this.attr, "cartAttr", true)
      this.$set(this, "isOpen", true)
    },
    /**
     * 商城源码-已废弃
     * 打开优惠券插件
     */
    couponTap: function () {
      let that = this

      // that.getCouponList(1) // 项目中已经废弃 （获取优惠券）
      that.$set(that.coupon, "coupon", true)
    },
    // 商城源码-已废弃
    onMyEvent: function () {
      this.$set(this.attr, "cartAttr", false)
      this.$set(this, "isOpen", false)
    },
    /**
     * 商城源码-已废弃
     * 打开属性加入购物车
     */
    joinCart: function (e) {
      this.goCat(1)
    },
    //去问卷详情页面
    goServicePackQuestionnaire() {
      this.$Router.push({
        name: "servicePackQuestionnaire",
        params: {
          servicePackageId: this.servicePackageId,
          id: this.id,
          clearTenantId: this.clearTenantId,
          referrerId: this.referrerId
        }
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
  line-height: 100vh;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 20;
  background: var(--bg-color-main);
}
.swiper-box {
  min-height: 500rpx;
}
.introduction {
  width: 100%;
  margin: 20rpx 0;
  padding: 0 4%;
  background-color: var(--bg-color-main);
}
.flex {
  display: flex;
  justify-content: space-between;
  width: 100%;
  padding: 20rpx 0;
  margin: 0 auto;
  background: var(--bg-color-main);
}
.swiper-item {
  display: flex;
  justify-content: flex-start;
  align-items: center;
  width: 94%;
  flex-wrap: wrap;
  margin: 0 auto;
  .item {
    width: 30%;
  }
}
.richTextDetails-box {
  min-height: 400rpx;
  background: var(--bg-color-main);
  .richTextDetails {
    width: 100%;
    padding: 30rpx 30rpx 20rpx;
    font-weight: 600;
    font-size: 18px;
    color: var(--text-color-main);
  }
}
.pad30 {
  background: var(--bg-color-second);
}

.row-background {
  background: var(--bg-color-main);
  padding: 0 30rpx 20rpx;
}

.flex-center {
  display: flex;
  justify-content: center;
  align-items: center;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.image {
  width: 60rpx;
  height: 40rpx;
  image {
    width: 100%;
    height: 100%;
  }
}
.product-con {
  min-height: 100vh;
}

.activityName {
  line-height: 44rpx;
}

.userEvaluation {
  i {
    display: inline-block;
  }
}

.bntVideo {
  width: auto !important;

  .buy {
    border-radius: 50rpx !important;
  }
}

.activity_pin {
  width: auto;
  height: 44rpx;
  line-height: 44rpx;
  opacity: 1;
  border-radius: 22rpx;
  padding: 0 15rpx;
}

.activity_miao {
  width: auto;
  height: 44rpx;
  line-height: 44rpx;
  padding: 0 15rpx;
  opacity: 1;
  border-radius: 22rpx;
  margin-left: 19rpx;
}

.iconfonts {
  color: var(--bg-color-main) !important;
  font-size: 28rpx;
}

.activity_title {
  font-size: 24rpx;
  color: var(--bg-color-main);
}

.activity_kan {
  width: auto;
  height: 44rpx;
  line-height: 44rpx;
  padding: 0 15rpx;
  opacity: 1;
  border-radius: 22rpx;
  margin-left: 19rpx;
}

.mask {
  z-index: 300 !important;
}

.head-bar {
  background: var(--bg-color-main);
}

.product-con .footer {
  position: fixed;
  bottom: 0;
  padding-bottom: env(safe-area-inset-bottom);
  width: 100%;
  box-sizing: border-box;
  height: calc(110rpx + env(safe-area-inset-bottom));
  background-color: var(--bg-color-main);
  z-index: 10;
  border-top: 1rpx solid var(--bd-color-main);
  text-align: center;
}
.footer-btn-css {
  height: 100rpx;
  border-radius: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.product-con .footer .item {
  font-size: 18rpx;
  color: #666;
}

.product-con .footer .item .iconfont {
  text-align: center;
  font-size: 40rpx;
}

.product-con .footer .bnt {
  width: 444rpx;
  height: 76rpx;
}

.product-con .footer .bnt .bnts {
  width: 222rpx;
  text-align: center;
  line-height: 60rpx;
  color: var(--text-color-white);
  font-size: 28rpx;
}

.product-con .footer .bnt .able-buy {
  width: 100%;
  background: var(--theme-color-dark-blue);
  border-radius: 24px;
  margin-right: 10px;
}
.product-con .footer .bnt .disabled-buy {
  width: 100%;
  background: var(--text-color-grey);
  color: var(--text-color-main);
}

button {
  padding: 0;
  margin: 0;
  line-height: normal;
  background-color: var(--bg-color-main);
}

button::after {
  border: 0;
}

action-sheet-item {
  padding: 0;
  height: 240rpx;
  align-items: center;
  display: flex;
}

.contact {
  font-size: 16px;
  width: 50%;
  background-color: var(--bg-color-main);
  padding: 8rpx 0;
  border-radius: 0;
  margin: 0;
  line-height: 2;
}

.contact::after {
  border: none;
}

.action-sheet {
  font-size: 17px;
  line-height: 1.8;
  width: 50%;
  position: absolute;
  top: 0;
  right: 0;
  padding: 25rpx 0;
}

.canvas {
  position: fixed;
  z-index: -5;
  opacity: 0;
}

.poster-pop {
  position: fixed;
  width: 450rpx;
  height: 714rpx;
  top: 50%;
  left: 50%;
  transform: translateX(-50%);
  margin-top: -432rpx;
  z-index: 399;
}

.poster-pop image {
  width: 100%;
  height: 100%;
  display: block;
}

.poster-pop .close {
  width: 46rpx;
  height: 75rpx;
  position: fixed;
  right: 0;
  top: -73rpx;
  display: block;
}

.poster-pop .keep {
  color: var(--bg-color-main);
  text-align: center;
  font-size: 25rpx;
  margin-top: 10rpx;
}

.mask {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 9;
}

.emply {
  width: 160px;
  height: 151px;
  margin: 150px auto auto auto;
  image {
    width: 100%;
    height: 100%;
  }
}

.icon-xiangzuo {
  color: #000;
  position: fixed;
  font-size: 36rpx;
  width: 100rpx;
  height: 56rpx;
  line-height: 54rpx;
  z-index: 1000;
  left: -5rpx;
}
/* 修改样式css */
.pad30 {
  .price-sale {
    display: flex;
    align-items: flex-end;
    width: 100%;
    .price-unit {
      flex: 1;
      font-size: 48rpx;
      color: var(--text-color-yellow);
      .unit {
        font-size: 28rpx;
        margin-left: 6rpx;
      }
    }
    .sale-num {
      flex: 1;
      text-align: right;
      font-size: 24rpx;
      color: var(--text-color-grey);
    }
  }
  .introduce {
    font-size: 40rpx;
    color: var(--text-color-main);
    font-weight: 600;
  }
  .product-introduction {
    margin: 24rpx 0 10rpx 0;
    font-size: 24rpx;
    color: var(--text-color-grey);
  }
  .attribute {
    .flexq {
      display: flex;
      justify-content: space-between;
      width: 100%;
      padding: 20rpx 0;
      margin: 0 auto;
      background: var(--bg-color-main);
    }
    .line1 {
      border-bottom: 2rpx solid var(--bd-color-main);
      padding: 30rpx 0;
      font-size: 26rpx;
      .tip {
        color: var(--text-color-main);
        width: 18%;
        padding: 5px;
        image {
          width: 40px;
          height: 20px;
        }
      }
      .iconBox {
        width: 10%;
        text-align: right;
      }
      .use-method {
        width: 90%;
      }
      /deep/ .u-collapse-head {
        color: var(--text-color-main);
      }
      .atterTxt {
        line-height: 20px;
        text-align: left;
        width: 100%;
        color: var(--text-color-grey);
        text-overflow: -o-ellipsis-lastline;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 2;
        line-clamp: 2;
        -webkit-box-orient: vertical;
      }
      .atterTxt1 {
        text-align: left;
        width: 100%;
        color: var(--text-color-grey);
      }
    }
  }
  .moreBox {
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 80%;
  }
}
.footer-service {
  display: flex;
  justify-content: center;
  align-items: center;
  background: var(--bg-color-main);
  .item {
    width: 30%;
  }
  .bnt {
    width: 70% !important;
    height: 100rpx !important;
    .buy {
      height: 74rpx !important;
      line-height: 74rpx !important;
      border-radius: 0;
    }
  }
}

.introducePopup {
  padding: 24rpx;
  display: grid;
  grid-template-rows: 60rpx 290rpx 80rpx;
  justify-items: center;
  background: var(--bg-color-second);
  color: var(--text-color-grey);
  .title {
    font-size: 36rpx;
    font-weight: 600;
    color: var(--text-color-main);
  }

  .u-button {
    width: 80%;

    /deep/ .u-btn {
      border-radius: 50rpx;
    }
  }
}
/deep/.u-drawer__scroll-view {
  background: var(--bg-color-second) !important;
}
.name-content {
  width: 90%;
  margin: auto;
  background: var(--bg-color-second);
  color: var(--text-color-main);
  font-size: 30rpx;
}
.popuptitle {
  display: block;
  text-align: center;
  font-size: 35rpx;
  font-weight: 600;
  line-height: 65rpx;
  margin-bottom: 20rpx;
  color: var(--text-color-main);
}
.btn {
  position: absolute;
  bottom: 10px;
  width: 100%;
  height: 12%;
  padding: 0 5%;
  .iKnowBtn {
    width: 90%;
    height: 80%;
    margin: auto;
    background: var(--theme-color-dark-blue);
    border-radius: 30px;
    text-align: center;
    color: #fff;
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    bottom: 0;
  }
}
/deep/ .u-btn {
  border-radius: 50rpx;
}
</style>
