<template>
  <view class="large" @click="close">
    <!-- <view class="payment" :class="pay_close ? 'on' : ''">
      <view class="title acea-row row-center-wrapper">
        选择付款方式
        <u-icon name="close" size="40" @click="close" class="close"></u-icon>
      </view>
      <view
        class="item acea-row row-between-wrapper flex-center"
        @click="goPay(item.number || 0, item.value)"
        v-for="(item, index) in payMode"
        :key="index"
      >
        <view class="left acea-row row-between-wrapper">
          <view class="text flex-start">
            <view class="name">{{ item.name }}</view>
            <view class="info" v-if="item.number">
              {{ item.title }} <span class="money">￥{{ item.number }}</span>
            </view>
            <view class="info" v-else>{{ item.title }}</view>
          </view>
        </view>
        <u-icon name="arrow-right" size="40"></u-icon>
      </view>
    </view> -->
    <!-- <view class="mask" @click="close" v-if="pay_close"></view> -->
  </view>
</template>

<script>
import { orderPay, wechatOrderPay, wechatQueryPayResult } from "@/api/order.js"
import { mapGetters } from "vuex"
export default {
  props: {
    payMode: {
      type: Array,
      default: function () {
        return []
      }
    },
    pay_close: {
      type: Boolean,
      default: false
    },
    order_id: {
      type: String,
      default: ""
    },
    totalPrice: {
      type: String,
      default: "0"
    }
  },
  data() {
    return {}
  },
  watch: {
    // payMode: {
    //   immediate: true,
    //   deep: true,
    //   handler(val) {
    //     if (val) {
    //       console.log("开始支付")
    //       this.goPay(0, val[0].value)
    //     }
    //   }
    // },
    pay_close: {
      immediate: true,
      deep: true,
      handler(val) {
        if (val) {
          this.goPay(0, this.payMode[0].value)
        }
      }
    }
  },
  computed: mapGetters(["systemPlatform"]),
  methods: {
    close: function () {
      this.$emit("onChangeFun", {
        action: "payClose"
      })
    },
    goPay: function (number, paytype) {
      let that = this
      let goPages = "/pages/order_pay_status/index?order_id=" + that.order_id
      if (!that.order_id)
        return that.$util.Tips({
          title: "请选择要支付的订单"
        })
      if (paytype == "yue" && parseFloat(number) < parseFloat(that.totalPrice))
        return that.$util.Tips({
          title: "余额不足！"
        })
      uni.showLoading({
        title: "支付中"
      })
      wechatOrderPay({
        orderNo: that.order_id,
        // #ifdef MP
        payChannel: "routine",
        // #endif
        // #ifdef H5
        // payChannel: that.$wechat.isWeixin() ? "public" : "weixinh5",
        // #endif
        payType: paytype
      })
        .then(res => {
          if (res.code == "200") {
            let jsConfig = res.data.jsConfig
            that.order_id = res.data.orderNo
            switch (res.data.payType) {
              case "weixin":
                // #ifdef MP
                uni.requestPayment({
                  timeStamp: jsConfig.timeStamp,
                  nonceStr: jsConfig.nonceStr,
                  package: jsConfig.packages,
                  signType: jsConfig.signType,
                  paySign: jsConfig.paySign,
                  success: function (res) {
                    uni.hideLoading()
                    wechatQueryPayResult(that.order_id)
                      .then(res => {
                        uni.hideLoading()
                        return that.$util.Tips(
                          {
                            title: "支付成功",
                            icon: "success"
                          },
                          () => {
                            that.$emit("onChangeFun", {
                              action: "pay_complete"
                            })
                          }
                        )
                      })
                      .catch(err => {
                        uni.hideLoading()
                        return that.$util.Tips({
                          title: err.msg
                        })
                      })
                  },
                  fail: function (e) {
                    uni.hideLoading()
                    return that.$util.Tips(
                      {
                        title: "取消支付"
                      },
                      () => {
                        that.$emit("onChangeFun", {
                          action: "pay_fail"
                        })
                      }
                    )
                  },
                  complete: function (e) {
                    uni.hideLoading()
                    if (e.errMsg == "requestPayment:cancel")
                      return that.$util.Tips(
                        {
                          title: "取消支付"
                        },
                        () => {
                          that.$emit("onChangeFun", {
                            action: "pay_fail"
                          })
                        }
                      )
                  }
                })
                // #endif
                // #ifdef H5
                // let datas = {
                //   timestamp: jsConfig.timeStamp,
                //   nonceStr: jsConfig.nonceStr,
                //   package: jsConfig.packages,
                //   signType: jsConfig.signType,
                //   paySign: jsConfig.paySign
                // }
                // that.$wechat
                //   .pay(datas)
                //   .then(res => {
                //     if (res.errMsg == "chooseWXPay:cancel") {
                //       uni.hideLoading()
                //       return that.$util.Tips({
                //         title: "支付失败"
                //       })
                //     } else {
                //       wechatQueryPayResult(that.order_id)
                //         .then(res => {
                //           uni.hideLoading()
                //           return that.$util.Tips(
                //             {
                //               title: "支付成功",
                //               icon: "success"
                //             },
                //             () => {
                //               that.$emit("onChangeFun", {
                //                 action: "pay_complete"
                //               })
                //             }
                //           )
                //         })
                //         .cache(err => {
                //           uni.hideLoading()
                //           return that.$util.Tips({
                //             title: err
                //           })
                //         })
                //     }
                //   })
                //   .cache(errW => {
                //     uni.hideLoading()
                //     return that.$util.Tips({
                //       title: errW
                //     })
                //   })
                // #endif
                break
              case "yue":
                uni.hideLoading()
                return that.$util.Tips(
                  {
                    title: "余额支付成功",
                    icon: "success"
                  },
                  () => {
                    that.$emit("onChangeFun", {
                      action: "pay_complete"
                    })
                  }
                )
                break
              case "weixinh5":
                uni.hideLoading()
                location.replace(
                  jsConfig.mwebUrl +
                    "&redirect_url=" +
                    window.location.protocol +
                    "//" +
                    window.location.host +
                    goPages +
                    "&status=1"
                )
                return that.$util.Tips(
                  {
                    title: "支付中",
                    icon: "success"
                  },
                  () => {
                    that.$emit("onChangeFun", {
                      action: "pay_complete"
                    })
                  }
                )
                break
            }
          } else {
            uni.hideLoading()
            that.$emit("onChangeFun", {
              action: "pay_fail",
              msg: res.msg
            })
            return that.$util.Tips({
              title: res.msg
            })
          }
        })
        .catch(err => {
          uni.hideLoading()
          console.error("支付失败", err)
          that.$emit("onChangeFun", {
            action: "pay_fail",
            msg: err.msg
          })

          return
          // return that.$util.Tips(
          //   {
          //     title: err.message
          //   },
          //   () => {
          //     that.$emit("onChangeFun", {
          //       action: "pay_fail"
          //     })
          //   }
          // )
        })
    }
  }
}
</script>

<style scoped lang="scss">
.large {
  // min-height: 100vh;
  // background: var(--bg-color-c0c3ce);
  // z-index: 10;
}
.close {
  position: absolute;
  right: 30rpx;
  top: 40rpx;
}
.flex-center {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.flex-start {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.payment {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  border-radius: 16rpx 16rpx 0 0;
  background-color: var(--bg-color-main);
  padding-bottom: 60rpx;
  padding-top: 30rpx;
  z-index: 99;
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
  transform: translate3d(0, 100%, 0);
}

.payment.on {
  transform: translate3d(0, 0, 0);
}

.payment .title {
  width: 100%;
  text-align: center;
  height: 123rpx;
  font-size: 32rpx;
  color: #282828;
  font-weight: bold;
  // padding-right: 30rpx;
  // margin-left: 30rpx;
  position: relative;
  line-height: 123rpx;
  border-bottom: 1rpx solid var(--bd-color-main);
}

.payment .title .iconfont {
  position: absolute;
  right: 30rpx;
  top: 50%;
  transform: translateY(-50%);
  font-size: 43rpx;
  color: var(--text-color-grey);
  font-weight: normal;
}

// .payment .item {
//   border-bottom: 1rpx solid var(--bd-color-main);
//   height: 130rpx;
//   margin-left: 30rpx;
//   padding-right: 30rpx;
// }

// .payment .item .left {
//   width: 610rpx;
// }

// .payment .item .left .text {
//   width: 100%;
// }

// .payment .item .left .text .name {
//   font-size: 32rpx;
//   color: #282828;
// }

// .payment .item .left .text .info {
//   font-size: 24rpx;
//   color: var(--text-color-grey);
//   margin-left: 30rpx;
// }

// .payment .item .left .text .info .money {
//   color: #ff9900;
// }

// .payment .item .left .iconfont {
//   font-size: 45rpx;
//   color: #09bb07;
// }

// .payment .item .left .iconfont.icon-zhifubao {
//   color: #00aaea;
// }

// .payment .item .left .iconfont.icon-yuezhifu {
//   color: #ff9900;
// }

// .payment .item .left .iconfont.icon-yuezhifu1 {
//   color: #eb6623;
// }

// .payment .item .iconfont {
//   font-size: 0.3rpx;
//   color: #999;
// }
</style>
