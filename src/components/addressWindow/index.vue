<template>
  <view>
    <view class="address-window" :class="address.address == true ? 'on' : ''">
      <view class="title"
        >选择地址
        <u-icon @tap="close" name="close" class="close" size="30"></u-icon>
      </view>
      <view class="contact-box">
        <view class="list">
          <u-radio-group
            v-model="radioCheck"
            size="52"
            active-color="var(--theme-color-dark-blue)"
          >
            <view
              class="item acea-row row-between-wrapper flex-center flex-width"
              :class="active == index ? 'font-color' : ''"
              v-for="(item, index) in addressList"
              @click="tapAddress(index, item.id)"
              :key="index"
            >
              <!-- <text
            class="iconfont icon-ditu"
            :class="active == index ? 'font-color' : ''"
          ></text> -->
              <view>
                <u-radio :name="item.id" @change="tapAddress(index, item.id)">
                </u-radio>
              </view>
              <view class="address">
                <!-- <view class="name" :class="active == index ? 'font-color' : ''"
              >{{ item.realName
              }}<text class="phone">{{ item.phone }}</text></view
            >
            <view class="line1">
              <text v-if="item.isDefault" class="default-color">[默认]</text>
              {{ item.province }}{{ item.city }}{{ item.district
              }}{{ item.detail }}</view
            > -->
                <view class="provincial">
                  {{ item.province }}{{ item.city }}{{ item.district }}
                </view>
                <view class="details">
                  {{ item.detail }}
                </view>
                <view class="name-phone"
                  ><text>收货人：</text><text>{{ item.realName }}</text
                  ><text class="name-phone-text">{{ item.phone }}</text></view
                >
              </view>
              <view @click.stop="editAdress(item.id)">
                <x-icon iconName="xiugai-icon"></x-icon>
                <!-- <u-icon
                  name="order"
                  size="50"
                  @click="editAdress(item.id)"
                ></u-icon> -->
              </view>
            </view>
          </u-radio-group>
        </view>
        <!-- 无地址 -->
        <!-- <view class="pictrue">
        <image src="@/static/images/noAddress.png"></image>
      </view> -->
        <view class="addressBnt" @tap="goAddressPages">新增收货地址</view>
        <!-- <view class="pictrue" v-if="!is_loading && !addressList.length">
        <image src="@/static/images/noAddress.png"></image>
      </view>
      <view class="addressBnt " @tap="goAddressPages">选择其地址</view> -->
      </view>
    </view>
    <view
      class="mask"
      catchtouchmove="true"
      :hidden="address.address == false"
      @tap="close"
    ></view>
  </view>
</template>

<script>
import {
  getAddressList,
  setAddressDefault,
  editOrderAddress
} from "@/api/user.js"
export default {
  props: {
    pagesUrl: {
      type: String,
      default: ""
    },
    address: {
      type: Object,
      default: function () {
        return {
          address: true,
          addressId: 0
        }
      }
    },
    isLog: {
      type: Boolean,
      default: false
    },
    preOrderNo: {
      type: String,
      default: "0"
    },
    orderId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      active: 0,
      is_loading: true,
      addressList: [],
      radioCheck: ""
    }
  },
  // onShow() {
  //   this.getAddressList()
  // },

  methods: {
    tapAddress: function (e, addressid) {
      this.active = e
      let a = {}
      for (let i = 0, leng = this.addressList.length; i < leng; i++) {
        if (this.addressList[i].id == addressid) {
          a = this.addressList[i]
        }
      }
      if (this.orderId) {
        let obj = {
          orderId: this.orderId,
          addressId: addressid
        }
        // this.$emit("OnChangeAddress", a)
        this.radioCheck = addressid
        editOrderAddress(obj)
          .then(res => {
            if (res.code === 200) {
              this.$emit("OnChangeAddress", a)
              this.$util.Tips({
                title: "修改成功"
              })
            }
          })
          .catch(err => {
            return this.$util.Tips({
              title: err.message
            })
            // console.log("修改地址失败")
          })
      } else {
        // this.active = e
        // let a = {}
        // for (let i = 0, leng = this.addressList.length; i < leng; i++) {
        //   if (this.addressList[i].id == addressid) {
        //     a = this.addressList[i]
        //   }
        // }
        this.$emit("OnChangeAddress", a)
        this.radioCheck = addressid
      }
    },
    close: function () {
      this.$emit("changeClose")
      this.$emit("changeTextareaStatus")
    },
    // 编辑地址
    editAdress(id) {
      if (this.orderId) {
        uni.navigateTo({
          url:
            "/pages/shopping-mall/user_address/index?id=" +
            id +
            "&orderId=" +
            this.orderId
        })
      } else {
        uni.navigateTo({
          url:
            "/pages/shopping-mall/user_address/index?id=" +
            id +
            "&preOrderNo=" +
            this.preOrderNo
        })
      }
    },
    goAddressPages: function () {
      let that = this
      if (this.orderId) {
        uni.navigateTo({
          url: "/pages/shopping-mall/user_address/index?orderId=" + that.orderId
        })
      } else {
        uni.navigateTo({
          url:
            "/pages/shopping-mall/user_address/index?preOrderNo=" +
            that.preOrderNo
        })
      }

      this.$emit("changeClose")
      this.$emit("changeTextareaStatus")
      // uni.navigateTo({
      //   url: this.pagesUrl
      // })
    },
    getAddressList: function () {
      let that = this
      getAddressList({
        page: 1,
        limit: 20
      }).then(res => {
        let addressList = res.data.list

        that.is_loading = false
        let defaultAddress = {}
        //处理默认选中项
        this.radioCheck = that.address.addressId
        // if (addressList && addressList.length > 0 && addressList.length < 2) {
        //   this.radioCheck = addressList[0].id
        //   this.$emit("OnDefaultAddress", addressList[0])
        //   return
        // }
        if (!that.address.addressId) {
          if (addressList && addressList.length > 0) {
            // that.$emit("OnDefaultAddress", addressList[0])
            that.$set(that, "addressList", addressList)
          }
          return
        }

        for (let i = 0, leng = addressList.length; i < leng; i++) {
          if (addressList[i].id == that.address.addressId) {
            that.active = i
            defaultAddress = addressList[i]
          }
        }
        that.$set(that, "addressList", addressList)
        // console.log("执行到传值没有", defaultAddress)
        this.$emit("OnDefaultAddress", defaultAddress)
      })
    },

    // 设置默认地址
    setdefaulltAddress(index, id) {
      let that = this
      setAddressDefault(id)
        .then(res => {
          for (let i = 0, len = that.addressList.length; i < len; i++) {
            if (i == index) that.addressList[i].isDefault = true
            else that.addressList[i].isDefault = false
          }
          that.$util.Tips(
            {
              title: "设置成功",
              icon: "success"
            }
            // function () {
            //   that.$set(that, "addressList", that.addressList)
            //   that.goOrder(address.id)
            // }
          )
        })
        .catch(err => {
          return that.$util.Tips({
            title: err.message
          })
        })
    }
  }
}
</script>

<style scoped lang="scss">
.mask {
  width: 100vw;
  height: 100vh;
  position: absolute;
  background: rgba(0, 0, 0, 0.5);
  top: 0;
  left: 0;
  z-index: 100;
  transition: all 0.15s;
}
.address-window {
  background-color: var(--bg-color-main);
  position: fixed;
  bottom: 0;
  left: 0;
  width: 100%;
  z-index: 101;
  max-height: 55vh;
  transform: translate3d(0, 100%, 0);
  transition: all 0.3s cubic-bezier(0.25, 0.5, 0.5, 0.9);
}

.address-window.on {
  transform: translate3d(0, 0, 0);
}

.address-window .title {
  font-size: 32rpx;
  font-weight: bold;
  text-align: center;
  height: 110rpx;
  line-height: 110rpx;
  position: relative;
  color: var(--text-color-main);
}

// .address-window .title .iconfont {
//   position: absolute;
//   right: 30rpx;

//   color: #8a8a8a;
//   font-size: 35rpx;
// }

.address-window .list .item {
  margin-left: 30rpx;
  padding: 30rpx;
  // border-bottom: 1px solid #eee;
  // height: 129rpx;
  font-size: 25rpx;
  color: var(--text-color-main);
}

// .address-window .list .item .iconfont {
//   font-size: 37rpx;
//   color: #2c2c2c;
// }

// .address-window .list .item .iconfont.icon-complete {
//   font-size: 30rpx;
//   color: #fff;
// }

.address-window .list .item .address {
  width: 560rpx;
}

.address-window .list .item .address .name {
  font-size: 28rpx;
  font-weight: bold;
  color: var(--text-color-main);
  margin-bottom: 4rpx;
}

.address-window .list .item .address .name .phone {
  margin-left: 18rpx;
}

.address-window .addressBnt {
  font-size: 30rpx;
  font-weight: bold;
  color: var(--text-color-main);
  background: var(--bg-color-second);
  width: 300rpx;
  height: 72rpx;
  border-radius: 10rpx;
  text-align: center;
  line-height: 72rpx;
  width: 87%;
  margin: 10rpx auto 0;
  margin-bottom: calc(env(safe-area-inset-bottom) + 40rpx);
  // padding-bottom: env(safe-area-inset-bottom);
  font-size: 28rpx;
  // margin: 86rpx auto 40rpx;
}
.close {
  // display: inline-block;
  // width: 80rpx;
  // text-align: right;
  position: absolute;
  right: 30rpx;
  top: 40rpx;
}

.address-window .pictrue {
  width: 414rpx;
  height: 336rpx;
  margin: 0 auto;
}

.address-window .pictrue image {
  width: 100%;
  height: 100%;
}
.default-color {
  color: var(--theme-color-dark-blue);
  display: inline-block;
  margin-right: 10rpx;
}
.contact-box {
  max-height: calc(55vh - 100rpx - 2vh);
  overflow: auto;
}
.flex-center {
  display: flex;
  justify-content: space-around;
  align-items: center;
}
.flex-width {
  width: 90%;
  margin: 0 auto;
}
.provincial {
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
  margin-top: 7rpx;
}
.name-phone {
  font-size: 28rpx;
  margin-top: 24rpx;

  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 36rpx;
  .name-phone-text {
    display: inline-block;
    margin-left: 30rpx;
  }
}
</style>
