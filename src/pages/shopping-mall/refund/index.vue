<template>
  <theme>
    <view class="large" slot="theme">
      <house-header :headTypeTwo="headTitle"></house-header>
      <view class="top">
        <orderGoods
          :cartInfo="cartInfo"
          :orderProNum="orderProNum"
          :productOrderInfo="productOrderInfo"
          :orderInfoList="orderInfoList"
        ></orderGoods>
      </view>
      <view class="margin"></view>
      <!-- <u-cell-group>
        <u-cell-item
          title="退款原因"
          :arrow="true"
          title-style="titleStyle"
        ></u-cell-item>
        <u-cell-item
          title="退款金额"
          value="新版本"
          :arrow="false"
          title-style="titleStyle"
        ></u-cell-item>
      </u-cell-group> -->
      <view class="flex-box border-bottom">
        <view class="title">退款原因</view>
        <view class="title-value">
          <view
            @click="reson"
            :class="[text ? 'text-css' : 'default-text-css']"
            >{{ text ? text : defaultText }}</view
          >
          <u-icon name="arrow-right" color="var( --text-color-grey)"></u-icon>
        </view>
      </view>
      <view class="flex-box">
        <view class="title">退款金额</view>
        <view class="money">{{ orderInfoVo.proTotalFee }}</view>
      </view>
      <view class="margin"></view>
      <view class="textarea">
        <view class="textarea-title">退款说明(选填)</view>
        <textarea
          class="textarea-value"
          @input="bindHideKeyboard"
          :value="refund_reason_wap_explain"
          :name="refund_reason_wap_explain"
          maxlength="50"
          placeholder="请添加备注(50字以内)"
        ></textarea>
      </view>
      <view class="bottom-box">
        <button @click="confirmRefund" class="btn">提交</button>
      </view>
      <u-popup
        v-model="show"
        mode="bottom"
        height="1000rpx"
        borderRadius="40rpx"
        close-icon-size="35rpx"
        closeable="true"
        class="popup"
      >
        <view class="popup-title">退款原因</view>
        <!-- <view class="popup-body"> -->
        <scroll-view
          height="50px"
          scroll-y="true"
          :style="{
            height: 'calc(100% - 150rpx - 96rpx - env(safe-area-inset-bottom))'
          }"
        >
          <u-radio-group
            v-model="value"
            class="popup-body-radio-group"
            size="80"
            active-color="var(--theme-color-dark-blue)"
          >
            <view
              v-for="(item, index) in reasonList"
              :key="index"
              class="item-radio"
              @click="select(item)"
            >
              <u-radio :name="item.value" label-size="50"></u-radio>
              <view class="radio-title"> {{ item.value }}</view>
            </view>
          </u-radio-group>
        </scroll-view>
        <!-- </view> -->

        <view class="bottom-box">
          <button @click="confirm" class="popup-btn">确定</button>
        </view>
      </u-popup>
    </view>
  </theme>
</template>
<script>
import orderGoods from "@/components/orderGoods"
import { refundApi } from "@/api/order.js"
import {
  // getCouponsOrderPrice,
  getOrderDetail
} from "@/api/order.js"
export default {
  name: "index",
  data() {
    return {
      // titleStyle: {},
      headTitle: "申请退款",

      loading: false,
      cartInfo: [],
      orderProNum: "",
      productOrderInfo: {},
      orderInfoVo: {
        proTotalFee: 0
      },
      orderInfoList: [],
      text: "",
      defaultText: "请选择",
      value: "",
      refund_reason_wap_explain: "",
      show: false,
      reasonList: [
        {
          id: "1",
          value: "与商家协商一致退款"
        },
        {
          id: "2",
          value: "质量问题"
        },
        {
          id: "3",
          value: "买多了/买错了"
        },
        {
          id: "4",
          value: "商品与描述不符"
        },
        {
          id: "5",
          value: "未发货"
        },
        {
          id: "6",
          value: "拍错了"
        },
        {
          id: "7",
          value: "其他原因"
        }
      ]
    }
  },
  components: {
    orderGoods
  },
  onLoad() {
    this.getOrderDetail()
  },

  methods: {
    //获取的订单详情
    getOrderDetail() {
      this.loading = true
      getOrderDetail(this.$Route.query.orderId)
        .then(res => {
          uni.hideLoading()
          this.loading = false
          this.cartInfo = res.data.orderInfoList

          this.createTime = this.formatDate(new Date(res.data.createTime))
          this.orderInfoList = res.data.orderInfoList
          this.productOrderInfo = res.data.productOrderInfo
          this.orderInfoVo.couponPrice = res.data.couponPrice
          this.orderInfoVo.proTotalFee = (
            Number(res.data.proTotalPrice) - Number(res.data.couponPrice)
          ).toFixed(2)

          // this.orderInfoVo.couponPrice = 1
          // this.orderInfoVo.proTotalFee = 1
          //   this.orderId = res.data.orderId
        })
        .catch(err => {
          uni.hideLoading()
          this.loading = false

          this.$util.Tips({
            title: err.message
          })
        })
    },
    /*
     *选择退款原因
     */

    select(item) {
      this.value = item.value
    },
    bindHideKeyboard: function (e) {
      this.refund_reason_wap_explain = e.detail.value
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
     * 打开选择原因的弹窗
     */
    reson() {
      this.show = true
    },

    /**
     * 选择退款原因
     *
     */
    confirm() {
      this.text = this.value
      this.show = false
    },

    /**
     * 确定申请退款
     */

    confirmRefund() {
      let data = {
        uni: this.$Route.query.orderId,
        text: this.text,
        refund_reason_wap_explain: this.refund_reason_wap_explain
      }
      if (!this.text) {
        return this.$util.Tips({
          title: "请选择退款原因"
        })
      }
      refundApi(data)
        .then(res => {
          if (res.code === 200) {
            uni.navigateBack({
              delta: 1
            })
            return this.$util.Tips({
              title: "已申请退款",
              type: "success"
            })
          } else {
            console.error(res)
          }
        })
        .catch(err => {
          console.error(err)
        })
    }
  }
}
</script>
<style scoped lang="scss">
.large {
  background: var(--bg-color-home);
  min-height: 100vh;
  .top {
    border-top: 1px solid var(--bd-color-main);
    padding: 0;
  }
  .margin {
    height: 30rpx;
    width: 100%;
    background: var(--bg-color-second);
  }
  .flex-box {
    display: flex;
    align-items: center;
    justify-content: space-between;
    background: var(--bg-color-main);
    box-sizing: border-box;
    padding: 4%;
    .title {
      font-size: 35rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .title-value {
      display: flex;
      align-items: center;
      justify-content: flex-end;
      .text-css {
        color: var(--text-color-main);
      }
      .default-text-css {
        color: var(--text-color-grey);
      }
    }
    .money {
      color: var(--text-color-yellow);
    }
  }

  .border-bottom {
    border-bottom: 2rpx solid var(--bd-color-main);
  }
  .textarea {
    // margin-top: 30rpx;

    padding: 5% 4%;
    width: 100vw;
    box-sizing: border-box;
    background: var(--bg-color-main);
    .textarea-title {
      color: var(--text-color-main);
    }

    .textarea-value {
      margin-top: 15rpx;

      color: var(--text-color-main);
      background: var(--bg-color-second);
      padding: 2%;
      width: 96%;
    }
  }
  .btn {
    width: 92%;
    margin: 0 auto;
    text-align: center;
    line-height: 96rpx;
    border-radius: 50rpx;
    height: 96rpx;
    color: #ffffff;
    background: var(--theme-color-dark-blue);
    border-radius: 24px;
  }
  .bottom-box {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
    background: var(--bg-color-main);
  }
}
.popup-title {
  text-align: center;
  font-size: 40rpx;
  font-weight: 600;
  padding: 20rpx 0;
  height: 110rpx;
  color: var(--text-color-main);
  background: var(--bg-color-main);
}
.popup-body {
  height: calc(100% - 150rpx - 96rpx - env(safe-area-inset-bottom));
  overflow: auto;
  .popup-body-radio-group {
    height: 100%;
  }
}
.item-radio {
  display: flex;
  align-items: center;
  font-size: 30rpx;
  width: 90%;
  margin: auto;
  .radio-title {
    font-size: 30rpx;
    width: 60%;
    padding: 35rpx 0;
    font-weight: 500;
    color: var(--text-color-main);
  }
  /deep/ .u-radio {
    float: right !important;
    width: 50rpx;
    height: 50rpx;
    .u-radio__icon-wrap {
      width: 50rpx !important;
      height: 50rpx !important;
    }
  }
}
.popup-btn {
  width: 92%;
  margin: 0 auto;
  text-align: center;
  line-height: 96rpx;
  border-radius: 50rpx;
  height: 96rpx;
  color: #ffffff;
  background: var(--theme-color-dark-blue);
  border-radius: 24px;
}
/deep/.u-drawer-bottom {
  background: var(--bg-color-main) !important;
}
</style>
