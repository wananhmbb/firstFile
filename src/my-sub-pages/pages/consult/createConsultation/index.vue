<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="问医生"></house-header>
      <view class="boderBox">
        <view class="content">
          <view class="Tips">
            为了更好的获得医生的帮助，请尽量详细的描述你的病情（具体症状、患病时长、用药情况等）
          </view>
          <view class="inputBox">
            <u-form
              :model="form"
              ref="uForm"
              :border-bottom="false"
              :errory-type="erroryType"
            >
              <u-form-item :border-bottom="false" prop="feedbackContent">
                <u-input
                  v-model="form.feedbackContent"
                  :type="type"
                  :border="border"
                  :height="height"
                  :auto-height="autoHeight"
                  placeholder="请描述疾病或症状"
                  placeholder-style="placeholderStyle"
                  maxlength="-1"
                />
              </u-form-item>
            </u-form>
          </view>
          <view class="uploadBox">
            <view class="title">上传图片/视频</view>
            <view class="tag-item">
              <u-upload
                ref="uUpload"
                :action="action"
                :header="header"
                :auto-upload="true"
                :file-list="fileList"
                upload-text=" "
                max-count="6"
                :show-progress="false"
                @on-remove="remove"
                @on-success="success"
                @on-progress="progress"
                @on-error="error"
              ></u-upload>
            </view>
          </view>
          <view class="prompt">为保障您的隐私，以上内容仅医生可见</view>
          <view class="form-css"></view>
          <view class="basicInfo">
            <u-button
              type="primary"
              shape="circle"
              @click="submit(0)"
              throttle-time="3000"
              v-if="payBtnshow === 'false'"
              >提交</u-button
            >
            <view class="payBtn" v-if="payBtnshow === 'true'">
              <view class="item">
                <text class="total">合计:</text>
                <text class="money">¥{{ shopInfo.price }}</text>
              </view>
              <u-button
                type="primary"
                shape="circle"
                class="btn"
                @click="submit(1)"
                throttle-time="3000"
                :loading="payloading"
                >立即支付</u-button
              >
            </view>
          </view>
        </view>
        <payment
          :payMode="payMode"
          :pay_close="pay_close"
          @onChangeFun="onChangeFun"
          :order_id="pay_order_id"
          :totalPrice="totalPrice"
        ></payment>
      </view>
      <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import { ACCESS_TOKEN } from "@/const/storage-key"
import payment from "@/components/payment"
import { preOrderApi, orderCreate } from "@/api/order"
import { getProductDetail } from "@/api/store.js"
import { submitConsultation } from "@/api/consult"
import { USER_INFO } from "@/const/storage-key"
export default {
  components: {
    payment
  },
  data() {
    return {
      loading: true,
      payloading: false,
      ShopDetailId: "",
      consultPackageId: "",
      medicalId: "",
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
      payFileOrderInfo: {},
      totalPrice: "0",
      value: "",
      type: "textarea",
      erroryType: ["toast"],
      border: false,
      height: 300,
      autoHeight: true,
      placeholderStyle: {
        color: "var(--text-color-grey)"
      },
      action: process.env.VUE_APP_BASE_API_IP + "file/upload",
      header: {},
      images: [],
      fileList: [],
      form: {
        feedbackContent: ""
      },
      rules: {
        feedbackContent: [
          {
            required: true,
            message: "请描述疾病或症状",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ]
      },
      payBtnshow: "",
      shopInfo: {
        price: 0,
        attrValueId: "",
        productId: "",
        preOrderNo: "",
        orderNo: ""
      }
    }
  },
  onLoad() {
    this.header = {
      Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
    }
    this.ShopDetailId = this.$Route.query.ShopDetailId
    this.consultPackageId = this.$Route.query.consultPackageId
    this.payBtnshow = this.$Route.query.payBtnshow
    this.getShopDetail()
  },
  onShow() {
    this.$set(this, "payMode", this.payMode)
    this.medicalId = uni.getStorageSync(USER_INFO).medicalCardList[0].id
  },
  methods: {
    submit(i) {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          console.log(i, "验证通过")
          if (i === 0) {
            this.submitConsultationInfo()
          }
          if (i === 1) {
            this.payloading = true
            this.getAdvanceOrderID()
          }
        } else {
          console.log("验证失败")
        }
      })
    },
    //提交咨询表单数据
    submitConsultationInfo() {
      let str = JSON.stringify({
        data: this.form.feedbackContent,
        images: this.images
      })
      let data = {
        expand: str,
        consultPackageId: this.consultPackageId,
        medicalCardId: this.medicalId
      }

      submitConsultation(data)
        .then(res => {
          if (res.code === 200) {
            if (res.data.consultId) {
              let id = res.data.consultId
              // console.log(id, "id===========")
              this.$Router.replace({
                path: "/chat",
                query: {
                  id: id,
                  redPointShow: true,
                  type: "pay"
                }
              })
            }
          } else {
            this.$refs.uToast.show({
              title: "提交咨询表单失败",
              type: "error"
            })
          }
        })
        .catch(err => {
          console.log(err, "提交问卷失败500")
        })
    },
    //获取商品详情
    getShopDetail() {
      getProductDetail(this.ShopDetailId, "normal")
        .then(res => {
          if (res.code === 200) {
            this.loading = false
            // console.log(res, "查询商品详情")
            this.shopInfo.price = res.data.productInfo.price
            this.shopInfo.attrValueId = res.data.productValue.默认.id
            this.shopInfo.productId = res.data.productValue.默认.productId
          } else {
            this.$refs.uToast.show({
              title: "获取商品详情失败",
              type: "error"
            })
          }
        })
        .catch(err => {
          console.log(err, "获取商品详情失败500")
        })
    },
    //获取预订单id
    getAdvanceOrderID() {
      let obj = {
        preOrderType: "buyNow",
        orderDetails: [
          {
            attrValueId: this.shopInfo.attrValueId,
            productId: this.shopInfo.productId,
            productNum: 1
          }
        ]
      }
      preOrderApi(obj)
        .then(res => {
          if (res.code === 200) {
            this.shopInfo.preOrderNo = res.data.preOrderNo
            this.createOrder(this.shopInfo.preOrderNo)
          } else {
            this.$refs.uToast.show({
              title: res.msg,
              type: "error"
            })
          }
        })
        .catch(err => {
          console.log(err, "获取预订单失败500")
        })
    },
    //创建订单
    createOrder(id) {
      let data = {
        realName: "",
        phone: "",
        addressId: null,
        couponId: 0,
        payType: "weixin",
        useIntegral: false,
        preOrderNo: id,
        mark: "",
        storeId: 0,
        shippingType: 1,
        payChannel: "routine"
      }
      orderCreate(data)
        .then(res => {
          if (res.code === 200) {
            this.shopInfo.orderNo = res.data.orderNo
            this.payloading = false
            this.goPay(this.shopInfo.orderNo, 0.01, this.shopInfo.orderNo)
          } else {
            this.$refs.uToast.show({
              title: "创建订单失败",
              type: "error"
            })
          }
        })
        .catch(err => {
          console.log(err, "获取订单失败500")
        })
    },
    remove(index, lists) {
      let allUrlArry = []
      lists.forEach(item => {
        allUrlArry.push(item.response.data.url)
      })
      this.images = allUrlArry
    },
    success(data, index, lists) {
      let allUrlArry = []
      var uploadImgSuccessArry = lists.filter(item => !item.response)
      uploadImgSuccessArry.forEach(item => {
        allUrlArry.push(item.url)
      })
      var uploadImgSuccessIng = lists.filter(item => item.response)
      uploadImgSuccessIng.forEach(item => {
        allUrlArry.push(item.response.data.url)
      })
      //图片去重
      let deleteSame = []
      for (var i = 0; i < allUrlArry.length; i++) {
        if (deleteSame.indexOf(allUrlArry[i]) === -1) {
          deleteSame.push(allUrlArry[i])
        } else {
          this.$refs.uUpload.remove(i)
          this.$refs.uToast.show({
            title: "图片已存在，请勿重复上传",
            type: "default"
          })
        }
      }
      this.images = deleteSame
      console.log(this.images, "this.images")
    },
    progress() {
      uni.showLoading({
        mask: true,
        title: "上传中..."
      })
    },
    error(res, index, lists, name) {
      console.log(res, index, lists, name, "erro")
    },
    //打开支付组件
    goPay(id, pay_price, order_id) {
      this.payFileOrderInfo.order_id = id
      this.$set(this, "pay_close", true)
      this.$set(this, "pay_order_id", order_id)
      this.$set(this, "totalPrice", pay_price)
    },
    // 关闭支付组件
    payClose: function () {
      this.pay_close = false
    },
    // 支付成功回调
    pay_complete: function () {
      this.loadend = false
      this.page = 1
      this.$set(this, "orderList", [])
      this.$set(this, "pay_close", false)
      this.submitConsultationInfo()
    },
    // 支付失败回调
    pay_fail: function (msg) {
      this.loadend = false
      this.pay_close = false
      this.cancelOrderShow = true
      this.orderContent = msg
    },
    // 事件回调
    onChangeFun: function (e) {
      let opt = e
      let action = opt.action || null
      let value = opt.value !== undefined ? opt.value : null
      let msg = opt.msg !== undefined ? opt.msg : null
      action && this[action] && this[action](msg, value)
    }
  },
  // 必须要在onReady生命周期，因为onLoad生命周期组件可能尚未创建完毕
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>

<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-main);
}
.boderBox {
  border-top: 1px solid var(--bd-color-main);
  .content {
    width: 90%;
    margin: auto;
    .Tips {
      margin-top: 15px;
      width: 90%;
      padding: 15px;
      background: var(--bg-color-second);
      border-radius: 25px 25px 25px 0px;
      color: var(--text-color-main);
    }
    .inputBox {
      margin-top: 20px;
    }
    .uploadBox {
      margin-top: 20px;
      .title {
        color: var(--text-color-grey);
      }
    }
    .prompt {
      margin: 25px 0;
      font-size: 24rpx;
      color: var(--text-color-grey);
    }
    .basicInfo {
      position: fixed;
      z-index: 999;
      left: 0;
      right: 0;
      bottom: 0;
      padding: 40rpx 5%;
      background: var(--bg-color-main);
      .payBtn {
        display: flex;
        justify-content: space-between;
        align-items: center;
        .item {
          width: 40%;
          .total {
            color: var(--text-color-main);
            font-size: 30rpx;
            padding-right: 10px;
          }
          .money {
            color: var(--theme-color-dark-blue);
            font-size: 40rpx;
          }
        }
        .btn {
          width: 60%;
        }
      }
    }
    .form-css {
      width: 100%;
      height: 85px;
      background: var(--bg-color-main);
    }
  }
}
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: 40px auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--bg-color-main);
  // background: red;
  z-index: 50;
}
/deep/.u-add-wrap {
  color: var(--text-color-main) !important;
  background: var(--bg-color-second);
}
/deep/.u-delete-icon {
  background: #090909 !important;
  color: var(--text-color-white) !important;
  opacity: 0.6 !important;
}
/deep/.u-error-btn {
  background-color: var(--text-color-main) !important;
  color: var(--text-color-white) !important;
}
/deep/.u-list-item {
  background: var(--bg-color-second) !important;
}
</style>
