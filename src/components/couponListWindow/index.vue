<template>
  <view>
    <view class="coupon-list-window" :class="coupon.coupon == true ? 'on' : ''">
      <view class="coupon-list-window-title">可用优惠券</view>
      <u-icon
        @tap="close"
        name="close"
        class="close"
        size="25"
        color="var(--text-color-main)"
      ></u-icon>
      <view v-if="!orderShow" class="nav acea-row row-around flex">
        <view
          :class="['acea-row', 'row-middle', type === 1 ? 'on' : '']"
          @click="setType(1)"
          >通用券</view
        >
        <view
          :class="['acea-row', 'row-middle', type === 2 ? 'on' : '']"
          @click="setType(2)"
          >商品券</view
        >
        <view
          :class="['acea-row', 'row-middle', type === 3 ? 'on' : '']"
          @click="setType(3)"
          >品类券</view
        >
      </view>
      <!-- <view class="occupy" v-if="!orderShow"></view> -->
      <!-- <view class='title'>优惠券<text class='iconfont icon-guanbi' @click='close'></text></view> -->
      <view
        class="coupon-list"
        :style="{ 'margin-top': !orderShow ? '0' : '40rpx' }"
      >
        <block v-if="coupon.list.length">
          <!-- <view class='item acea-row row-center-wrapper' v-for="(item,index) in coupon.list" :key='index'> -->
          <!-- <u-checkbox-group max="1"> -->
          <u-radio-group v-model="radioValue">
            <view
              class="item acea-row row-center-wrapper flex"
              v-for="(item, index) in coupon.list"
              @click="getCouponUser(index, item.id)"
              :class="item.isUse == 1 ? '' : ''"
              :key="index"
            >
              <image
                class="image"
                :src="
                  item.isUse == 1
                    ? 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E7%BC%96%E7%BB%84%203%402x.png'
                    : 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E7%BC%96%E7%BB%84%203%402x.png'
                "
              ></image>
              <view
                class="money acea-row row-column row-center-wrapper"
                :class="item.isUse == 1 ? 'moneyGray' : ''"
              >
                <view
                  >￥<text class="num">{{
                    item.money ? Number(item.money) : ""
                  }}</text></view
                >
                <!-- <view class="pic-num">满{{ item.minPrice }}元可用</view> -->
              </view>
              <view class="text">
                <view class="condition line2">
                  <!-- <span
                  class="line-title"
                  :class="item.isUse ? 'gray' : ''"
                  v-if="item.useType === 1"
                  >通用</span
                >
                <span
                  class="line-title"
                  :class="item.isUse ? 'gray' : ''"
                  v-else-if="item.useType === 3"
                  >品类</span
                >
                <span
                  class="line-title"
                  :class="item.isUse ? 'gray' : ''"
                  v-else
                  >商品</span
                > -->
                  <span>{{ item.name }}</span>

                  <span>使用门槛：无限制</span>
                  <span>使用期限：永久</span>
                </view>
                <!-- <view class="data acea-row row-between-wrapper">
                <view v-if="item.day > 0">领取后{{ item.day }}天内可用</view>
                <view v-else>
                  {{
                    item.useStartTimeStr && item.useEndTimeStr
                      ? item.useStartTimeStr + " - " + item.useEndTimeStr
                      : ""
                  }}
                </view>
                <view class="bnt gray" v-if="item.isUse">{{
                  item.use_title || "已领取"
                }}</view>
                <view class="bnt bg-color" v-else>{{
                  coupon.statusTile || "立即领取"
                }}</view>
              </view> -->
              </view>
              <u-radio :name="item.id" class="u-radio-box"></u-radio>
              <!-- <view @click="currentSelect(item.id)"> </view> -->

              <!-- <u-checkbox
                v-model="item.checked"
                shape="circle"
                :name="item.id"
              ></u-checkbox> -->
            </view>
          </u-radio-group>
        </block>
        <!-- 无优惠券 -->
        <view class="pictrue" v-else>
          <x-icon iconName="noCoupon"></x-icon>
          <!-- <image src="../../static/noCoupon.png"></image> -->
        </view>
        <!-- 确定按钮 -->
        <view class="bottom-button-box">
          <view class="finish">
            <u-button shape="circle" @click="getCoupon" class="coupon-btn"
              >兑换优惠劵</u-button
            >
            <!-- <u-button
              class="btn"
              type="primary"
              shape="circle"
              @click="finish"
              v-if="id"
              >确定</u-button
            > -->
            <u-button
              type="primary"
              shape="circle"
              @click="finish"
              :class="['btn', !id ? 'disabled-btn' : '']"
              >确定</u-button
            ></view
          >
        </view>
      </view>
    </view>
    <view
      class="mask"
      catchtouchmove="true"
      :hidden="coupon.coupon == false"
      @click="close"
    ></view>
    <u-popup
      v-model="popupCouponShow"
      mode="center"
      border-radius="14"
      width="70%"
      :closeable="true"
      @close="closePopupCoupon"
    >
      <view class="formitem">
        <view class="titleStyle">兑换优惠券</view>
        <u-form :model="form" ref="uForm" :error-type="errorType">
          <u-form-item prop="code">
            <u-input v-model="form.code" placeholder="请输入兑换码" />
          </u-form-item>
        </u-form>
      </view>
      <view class="button">
        <u-button type="primary" shape="circle" @click="exchange">
          兑换
        </u-button>
      </view>
    </u-popup>
    <u-toast ref="uToast" />
  </view>
</template>

<script>
import { setCouponReceive } from "@/api/api.js"
import { exchangeCoupon } from "@/api/myCard.js"
export default {
  props: {
    //打开状态 0=领取优惠券,1=使用优惠券
    openType: {
      type: Number,
      default: 0
    },
    coupon: {
      type: Object,
      default: function () {
        return {}
      }
    },
    //下单页面使用优惠券组件不展示tab切换页
    orderShow: {
      type: String,
      default: function () {
        return ""
      }
    }
  },
  data() {
    return {
      // customStyle: {
      //   background: "var(--theme-color-dark-blue)",
      //   opacity: "75%"
      // },
      type: 1,
      index: "",
      id: "",
      radioValue: "",
      isChange: false,
      popupCouponShow: false,
      errorType: ["toast"],
      isDisabled: false,
      form: {
        code: ""
      },
      rules: {
        code: [
          {
            required: true,
            message: "请输入兑换码",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ]
      }
    }
  },
  watch: {
    coupon: {
      // immediate: true,
      // deep: true,
      handler(val) {
        this.isDisabled = true
        if (val.list && val.list.length > 0) {
          val.list.forEach(item => {
            if (item.isUse === 1) {
              this.radioValue = JSON.parse(JSON.stringify(item.id))
              this.isChange = false
              this.id = item.id
              this.isDisabled = false
            }
          })
        }
      }
    }
  },
  methods: {
    close: function () {
      this.type = 1
      this.$emit("ChangCouponsClone")
      this.radioValue = ""
      this.id = ""
      this.index = ""
    },
    /**
     * 关闭优惠券兑换
     */
    closePopupCoupon() {
      this.popupCouponShow = false
    },
    /**
     * 兑换优惠券
     */
    getCoupon() {
      // console.log("555555", this.$parent.$parent.getCouponList())
      this.popupCouponShow = true
    },
    exchange() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          exchangeCoupon(this.form.code)
            .then(res => {
              if (res.code === 200) {
                this.$refs.uToast.show({
                  title: "兑换成功",
                  type: "success"
                })
                this.popupCouponShow = false
                this.form.code = ""
                this.$emit("redeemCoupons", res.data.couponUserId)
                // this.$parent.$parent.getCouponList()
              } else {
                this.$refs.uToast.show({
                  title: res.msg,
                  type: "error"
                })
              }
            })
            .catch(err => {
              console.error(err)
            })
        } else {
          console.log("验证失败")
        }
      })
    },
    getCouponUser: function (index, id) {
      let that = this
      this.isChange = true
      that.index = index
      that.id = id

      if (that.radioValue.toString() === id.toString()) {
        that.radioValue = ""
        if (this.isDisabled) {
          that.id = ""
        }
      } else {
        that.radioValue = id.toString()
      }
      // console.log(that.coupon.list[this.index])

      if (that.coupon.list[that.index].isUse == 1) {
        that.coupon.list[that.index].isUse = 0
        // that.coupon.list[this.index].checked = false
      } else {
        that.coupon.list[that.index].isUse = 1
        // that.coupon.list[this.index].checked = true
      }

      // let that = this
      // let list = that.coupon.list

      // if (list[index].isUse == true && this.openType == 0) return true
      // switch (this.openType) {
      //   case 0:
      //     //领取优惠券
      //     let ids = []
      //     ids.push(id)
      //     setCouponReceive(id).then(res => {
      //       that.$emit("ChangCouponsUseState", index)
      //       that.$util.Tips({
      //         title: "领取成功"
      //       })
      //       that.$emit("ChangCoupons", list[index])
      //     })
      //     break
      //   case 1:
      //     that.$emit("ChangCoupons", index)
      //     break
      // }
    },
    setType: function (type) {
      this.type = type
      this.$emit("tabCouponType", type)
    },
    finish() {
      let that = this
      if (this.isDisabled && !this.id) {
        return
      }

      if (!this.isChange) {
        this.close()
        return
      }

      let list = that.coupon.list

      if (list[this.index].isUse == true && this.openType == 0) return true
      switch (this.openType) {
        case 0:
          //领取优惠券
          let ids = []
          ids.push(this.id)
          setCouponReceive(this.id).then(res => {
            that.$emit("ChangCouponsUseState", this.index)
            that.$util.Tips({
              title: "领取成功"
            })
            that.$emit("ChangCoupons", list[this.index])
          })
          break
        case 1:
          that.$emit("ChangCoupons", this.index)
          break
      }
    }
  }
}
</script>

<style scoped lang="scss">
.formitem {
  width: 80%;
  margin: auto;
  padding: 30px 0;
  .delete {
    position: absolute;
    top: 10px;
    right: 10px;
    padding: 5px;
  }
  .titleStyle {
    text-align: center;
    font-size: 32rpx;
    color: var(--text-color-main);
    font-weight: bolder;
    padding: 0 0 30px 0;
  }

  /deep/ .u-form-item__message {
    padding: 0 !important;
  }
  /deep/ .u-input__input {
    color: var(--text-color-main);
  }
}
.button {
  width: 90%;
  padding: 20px;
  margin: auto;
}
.disabled-btn {
  opacity: 0.7;
}
.coupon-btn {
  border: 1rpx solid var(--bd-color-main);
  color: var(--text-color-grey);
}
.coupon-list-window-title {
  width: 100%;
  text-align: center;
  font-size: 36rpx;
  font-weight: 600;
  margin-top: 45rpx;
  color: var(--text-color-main);
}
.u-radio-box {
  position: relative;
  z-index: 2;
  pointer-events: none;
}
.close {
  position: absolute;
  right: 40rpx;
  top: 57rpx;
}
.flex {
  box-sizing: border-box;
  display: flex;
  justify-content: space-around;
  align-items: center;
  padding: 0 0;
  position: relative;
  width: 90%;
  margin: 0 auto 15px;
  height: 104px;
  z-index: 3; // margin-bottom: 15px;
  .image {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: -1;
  }

  .money {
    width: 40%;
    text-align: center;
    color: var(--text-color-red);

    .num {
      font-size: 36px;
      font-weight: 600;
    }
  }
  .text {
    width: 60%;
    text-align: left;
    padding-left: 35rpx;

    span {
      display: block;
      padding-bottom: 5px;
    }
    span:nth-child(1) {
      font-size: 16px;
      font-weight: 600;
      padding-bottom: 5px;
    }
  }
  .moneyGray {
    width: 40%;
    text-align: center;
    color: var(--text-color-red);
    opacity: 0.8;
  }
}
// .disable-box {
//   .money {
//     width: 40%;
//     text-align: center;
//     color: #aeaeae;

//     .num {
//       font-size: 36px;
//       font-weight: 600;
//     }
//   }
//   .text {
//     width: 60%;
//     text-align: left;

//     span {
//       display: block;
//       padding-bottom: 5px;
//       opacity: 0.5;
//     }
//     span:nth-child(1) {
//       font-size: 16px;
//       font-weight: 600;
//       padding-bottom: 5px;
//     }
//   }
//   .moneyGray {
//     width: 40%;
//     text-align: center;
//     color: #aeaeae;
//     opacity: 0.8;
//   }
// }
.mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  z-index: 20;
  background: rgba($color: #000000, $alpha: 0.3);
}
.coupon-list-window {
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  background-color: var(--bg-color-second);
  border-radius: 16rpx 16rpx 0 0;
  z-index: 555;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
}

.coupon-list-window.on {
  transform: translate3d(0, 0, 0);
}

.coupon-list-window .title {
  height: 124rpx;
  width: 100%;
  text-align: center;
  line-height: 124rpx;
  font-size: 32rpx;
  font-weight: bold;
  position: relative;
}
.bottom-button-box {
  position: fixed;
  background: var(--bg-color-second);
  bottom: 0;
  padding-bottom: calc(env(safe-area-inset-bottom) + 20rpx);
  padding-top: 10rpx;
  height: calc(env(safe-area-inset-bottom) + 110rpx);
  left: 0;
  width: 100%;
  z-index: 4;
  .finish {
    font-size: 30rpx;
    font-weight: bold;
    color: var(--text-color-main);
    // background: var(--bg-color-second);
    // width: 300rpx;
    height: 72rpx;
    border-radius: 10rpx;
    text-align: center;
    line-height: 72rpx;
    width: 87%;
    margin: 10rpx auto 0;
    display: flex;
    justify-content: space-around;
    align-items: center;
    // margin-bottom: calc(env(safe-area-inset-bottom));
    // padding-bottom: env(safe-area-inset-bottom);
    font-size: 28rpx;
    .btn {
      width: 45%;
    }
  }
}

// .coupon-list-window .title .iconfont {
//   position: absolute;
//   right: 30rpx;
//   top: 50%;
//   transform: translateY(-50%);
//   font-size: 35rpx;
//   color: #8a8a8a;
//   font-weight: normal;
// }

.coupon-list-window .coupon-list {
  margin: 0 0 30rpx 0;
  height: 60vh;
  overflow: auto;
  padding-top: 30rpx;
  padding-bottom: calc(env(safe-area-inset-bottom) + 80rpx);
}

.coupon-list-window .pictrue {
  width: 414rpx;
  height: 336rpx;
  margin: 208rpx auto;
}

.coupon-list-window .pictrue image {
  width: 100%;
  height: 100%;
}

.pic-num {
  color: var(--bg-color-second);
  font-size: 24rpx;
}

.line-title {
  width: 90rpx;
  padding: 0 10rpx;
  box-sizing: border-box;
  background: var(--bg-color-second);
  border: 1px solid var(--bd-color-main);
  opacity: 1;
  border-radius: 20rpx;
  font-size: 20rpx;
  color: var(--theme-color-dark-blue);
  margin-right: 12rpx;
}

.line-title.gray {
  border-color: var(--bd-color-main);
  color: var (--text-color-grey);
  background-color: var(--bg-color-main);
}

.nav {
  // position: absolute;
  // top: 0;
  // left: 0;
  width: 100%;
  height: 96rpx;
  border-bottom: 2rpx solid var(--bd-color-main);
  border-top-left-radius: 16rpx;
  border-top-right-radius: 16rpx;
  background-color: var(--bg-color-main);
  font-size: 30rpx;
  color: var(--text-color-grey);
}

.nav .acea-row {
  border-top: 5rpx solid transparent;
  border-bottom: 5rpx solid transparent;
}

.nav .acea-row.on {
  border-bottom-color: var(--bd-color-main);
  color: var(--text-color-main);
}

.nav .acea-row:only-child {
  border-bottom-color: transparent;
}

.occupy {
  height: 106rpx;
}

.coupon-list .item {
  margin-bottom: 20rpx;
  //box-shadow: 0 2rpx 10rpx rgba(0, 0, 0, 0.06);
}

.coupon-list .item .money {
  font-weight: normal;
}
/deep/.u-mode-center-box {
  background: var(--bg-color-second) !important;
}
</style>
