<template>
  <view class="large" @click="close">
    <!-- <view @click="fatherMethod()">buhai</view> -->
  </view>
</template>

<script>
import { paymentByStage, queryPayResult } from "@/api/service"
import { wechatOrderPay, wechatQueryPayResult } from "@/api/order.js"
import { mapGetters } from "vuex"
export default {
  // servicePackageId: {
  //   type: String,
  //   default: ""
  // },
  data() {
    return {}
  },
  computed: mapGetters(["systemPlatform"]),
  methods: {
    goPay: function (id) {
      let that = this
      uni.showLoading({
        title: "支付中"
      })
      let obj = {
        stopServicePackageUserId: id
      }
      wechatOrderPay(obj).then(res => {
        if (res.code === 200) {
          let jsConfig = res.data.jsConfig
          that.order_id = res.data.orderNo
          switch (res.data.payType) {
            case "weixin":
              uni.requestPayment({
                timeStamp: jsConfig.timeStamp,
                nonceStr: jsConfig.nonceStr,
                package: jsConfig.packages,
                signType: jsConfig.signType,
                paySign: jsConfig.paySign,
                success: function (res) {
                  console.log("success:" + JSON.stringify(res))
                  queryPayResult(that.order_id)
                    .then(res => {
                      if (res.code === 200) {
                        uni.hideLoading()
                        return that.$util.Tips(
                          {
                            title: "支付成功",
                            icon: "success"
                          },
                          () => {
                            that.$emit("onChangeFun", {
                              action: "pay_complete",
                              complete: true
                            })
                          }
                        )
                      }
                    })
                    .catch(err => {
                      uni.hideLoading()
                      return that.$util.Tips({
                        title: err.message
                      })
                    })
                },
                fail: function (err) {
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
                }
              })
          }
        } else {
          uni.hideLoading()
          that.$util.Tips({
            title: res.msg
          })
        }
      })
    }
    // fatherMethod() {
    //   this.$emit("onChangeFun", {
    //     action: "pay_complete",
    //     complete: true
    //   })
    // }
  }
}
</script>

<style scoped lang="scss"></style>
