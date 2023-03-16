<template>
  <theme>
    <view slot="theme" class="all">
      <house-header :headTypeTwo="title"></house-header>
      <view class="line">
        <!-- <image src="@/static/images/line.jpg" v-if="addressList.length"></image> -->
      </view>
      <view
        class="address-management"
        :class="addressList.length < 1 && page > 1 ? 'fff' : ''"
      >

      <radio-group
        class="radio-group"
        @change="radioChange"
        v-if="addressList.length"
      >
        <view
          class="item borRadius14"
          v-for="(item, index) in addressList"
          :key="index"
        >
          <view class="address" @click="goOrder(item.id)">
            <view class="address-left">
              <view class="address-province-district">{{ item.province }}{{item.city}}{{ item.district }}</view>
              <view class="address-detail">{{item.detail}}</view>
              <view class="consignee"
                >收货人：{{ item.realName
                }}<text class="phone">{{ item.phone }}</text></view
              >
            </view>
            <view class="address-right">
                <img src="https://s4.ax1x.com/2022/02/18/HTOii6.png" @click="editAddress(item.id)">
            </view>
          </view>
          <view class="operation acea-row row-between-wrapper flex">
            <view>
              <radio class="radio" :value="index" :checked="item.isDefault" color="var(--theme-color-dark-blue)" style="transform:scale(0.7)">
              </radio><text>设为默认</text>
            </view>
            
            <view class="acea-row row-middle">
              <view @click="delBtn(index)"
                ></text>删除</view
              >
            </view>
          </view>
        </view>
      </radio-group>
        
        <view
          class="loadingicon acea-row row-center-wrapper loadTitle"
          v-if="addressList.length"
        >
        {{ loadTitle }}
        </view>
        <view class="noCommodity" v-if="addressList.length < 1 && !loading">
          <view class="pictrue">
            <x-icon iconName='service-no-data'></x-icon>
           
          </view>
        </view>
        <!-- <view style="height: 120rpx"></view> -->
      </view>
      <view class="footer acea-row row-between-wrapper ">
        <!-- #ifdef MP-->
         <view class="bottom-button-box">
              <u-button type="primary" shape="circle" @click="addAddress"
                >添加新地址</u-button
              >
         </view>
        <!-- #endif -->
      </view>
         <u-modal
         class="model-box"
        v-model="show"
        :title-style='titleStyle'
        :content="content"
        @confirm="confirmModel"
        @cancel="cancalModel"
        :content-style='contentStyle'
        :show-cancel-button="showCancelButton"
       
        :cancel-style='cancelStyle'
        :confirm-style='confirmStyle'
      ></u-modal>
        <view class="loading-box" v-if="loading">
        <u-loading
          mode="circle"
          :show="loading"
          size="100"
          color="var(--theme-color-dark-blue)"
        ></u-loading>
      </view>
     
    </view>
    
  </theme>
</template>

<script>
import {
  getAddressList,
  setAddressDefault,
  delAddress,
  editAddress
} from "@/api/user.js"

export default {
  components: {
  },
  data() {
    return {
      title: "地址列表",
      addressList: [],
      cartId: "",
      pinkId: 0,
      couponId: 0,
      loading: true,
      loadend: false,
      loadTitle: "加载更多",
      page: 1,
      limit: 20,
      isAuto: false, //没有授权的不会自动授权
      isShowAuth: false, //是否隐藏授权
      bargain: false, //是否是砍价
      combination: false, //是否是拼团
      secKill: false, //是否是秒杀
      isLogin: true,
      show: false,
      content: "确定要删除地址吗？",
      showCancelButton: true,
      index: "",
      titleStyle: {
        background: 'var(--bg-color-main)',
        color: 'var(--text-color-main)'
      },
      contentStyle: {
        background: 'var(--bg-color-main)',
         color: 'var(--text-color-main)'
      },
   
      cancelStyle: {
        color: 'var(--text-color-main)',
        background: 'var(--bg-color-main)'
      },
      confirmStyle: {
          color: 'var(--theme-color-dark-blue)',
        background: 'var(--bg-color-main)'
      }
    }
  },

  onLoad(options) {
    this.title = this.$Route.query.title
     if (this.isLogin) {
      this.preOrderNo = options.preOrderNo || 0
    }
  },
  onShow(){
    uni.hideLoading()
    if (this.isLogin) {
      this.getAddressList(true)
    }
  },
  // onShow: function () {
  //   uni.hideLoading()
  //   let that = this
  //   that.getAddressList(true)
  // },
  methods: {
    //取消删除
    cancalModel() {
      this.show = false
    },
    //点击删除按钮
    delBtn(index) {
      this.show = true
      this.index = index
    },

    // 删除时， 点击确定按钮
    confirmModel() {
      this.show = false
      this.delAddress(this.index)
    },
    onLoadFun: function () {
      this.getAddressList()
    },
    // 授权关闭
    authColse: function (e) {
      this.isShowAuth = e
    },
    /*
     * 导入微信地址（小程序）
     */
    getWxAddress: function () {
      let that = this
      uni.authorize({
        scope: "scope.address",
        success: function (res) {
          uni.chooseAddress({
            success: function (res) {
              let addressP = {}
              addressP.province = res.provinceName
              addressP.city = res.cityName
              addressP.district = res.countyName
              addressP.cityId = 0
              editAddress({
                address: addressP,
                isDefault: true,
                realName: res.userName,
                postCode: res.postalCode,
                phone: res.telNumber,
                detail: res.detailInfo,
                id: 0
                //type: 1//区别城市id（导入微信地址无城市id需要后台自己查找）;
              })
                .then(res => {
                  that.$util.Tips(
                    {
                      title: "添加成功",
                      icon: "success"
                    },
                    function () {
                      that.getAddressList(true)
                    }
                  )
                })
                .catch(err => {
                  return that.$util.Tips({
                    title: err
                  })
                })
            },
            fail: function (res) {
              if (res.errMsg == "chooseAddress:cancel")
                return that.$util.Tips({
                  title: "取消选择"
                })
            }
          })
        },
        fail: function (res) {
          uni.showModal({
            title: "您已拒绝导入微信地址权限",
            content: "是否进入权限管理，调整授权？",
            success(res) {
              if (res.confirm) {
                uni.openSetting({
                  success: function (res) {
                    console.log(res.authSetting)
                  }
                })
              } else if (res.cancel) {
                return that.$util.Tips({
                  title: "已取消！"
                })
              }
            }
          })
        }
      })
    },
    /*
     * 导入微信地址（公众号）
     */
    getAddress() {
      let that = this
      that.$wechat.openAddress().then(userInfo => {
        // open();
        editAddress({
          realName: userInfo.userName,
          phone: userInfo.telNumber,
          address: {
            province: userInfo.provinceName,
            city: userInfo.cityName,
            district: userInfo.countryName,
            cityId: 0
          },
          detail: userInfo.detailInfo,
          postCode: userInfo.postalCode,
          isDefault: true
        })
          .then(() => {
            that.$util.Tips(
              {
                title: "添加成功",
                icon: "success"
              },
              function () {
                // close();
                that.getAddressList(true)
              }
            )
          })
          .catch(err => {
            // close();
            return that.$util.Tips({
              title: err || "添加失败"
            })
          })
      })
    },
    /**
     * 获取地址列表
     *
     */
    getAddressList: function (isPage) {
      let that = this
      if (isPage) {
        that.loadend = false
        that.page = 1
        that.$set(that, "addressList", [])
      }
      // if (that.loading) return
      if (that.loadend) return
      that.loading = true
      that.loadTitle = ""
      getAddressList({
        page: that.page,
        limit: that.limit
      })
        .then(res => {
          that.loading = false
          let list = res.data.list
          let loadend = list.length < that.limit
          that.addressList = that.$util.SplitArray(list, that.addressList)
          that.$set(that, "addressList", that.addressList)
          that.loadend = loadend
          that.loadTitle = loadend ? "已全部加载" : "加载更多"
          if(!loadend) {
             that.page = that.page + 1
          }
         
         
        })
        .catch(err => {
          that.loading = false
          console.error('获取地址列表出错', err)
          that.loadTitle = "加载更多"
        })
    },
    /**
     * 设置默认地址
     */
    radioChange: function (e) {
      let index = parseInt(e.detail.value),
        that = this
      let address = this.addressList[index]
      if (address == undefined)
        return that.$util.Tips({
          title: "您设置的默认地址不存在!"
        })
      setAddressDefault(address.id)
        .then(res => {
          for (let i = 0, len = that.addressList.length; i < len; i++) {
            if (i == index) that.addressList[i].isDefault = true
            else that.addressList[i].isDefault = false
          }
          that.$util.Tips(
            {
              title: "设置成功",
              icon: "success"
            },
            function () {
              that.$set(that, "addressList", that.addressList)
              that.goOrder(address.id)
            }
          )
        })
        .catch(err => {
          return that.$util.Tips({
            title: err
          })
        })
    },
    /**
     * 编辑地址
     */
    editAddress: function (id) {
      let cartId = this.cartId,
        pinkId = this.pinkId,
        couponId = this.couponId
      this.cartId = ""
      this.pinkId = ""
      this.couponId = ""
      uni.navigateTo({
        url:
          "/pages/shopping-mall/user_address/index?id=" +
          id +
          "&cartId=" +
          cartId +
          "&pinkId=" +
          pinkId +
          "&couponId=" +
          couponId +
          "&secKill" +
          this.secKill +
          "&combination=" +
          this.combination +
          "&bargain=" +
          this.bargain
      })
    },
    /**
     * 删除地址
     */
    delAddress: function (index) {
      let that = this,
        address = this.addressList[index]
      if (address == undefined)
        return that.$util.Tips({
          title: "您删除的地址不存在!"
        })
      delAddress(address.id)
        .then(res => {
          that.$util.Tips(
            {
              title: "删除成功",
              icon: "success"
            },
            function () {
              that.addressList.splice(index, 1)
              that.$set(that, "addressList", that.addressList)
            }
          )
        })
        .catch(err => {
          return that.$util.Tips({
            title: err
          })
        })
    },
    /**
     * 新增地址
     */
    addAddress: function () {
      let cartId = this.cartId,
        pinkId = this.pinkId,
        couponId = this.couponId
      this.cartId = ""
      this.pinkId = ""
      this.couponId = ""
      uni.navigateTo({
        url:
          "/pages/shopping-mall/user_address/index?preOrderNo=" +
          this.preOrderNo
      })
    },
    goOrder: function (id) {
      if (this.preOrderNo) {
        uni.redirectTo({
          url:
            "/pages/shopping-mall/order_confirm/order_confirm?is_address=1&preOrderNo=" +
            this.preOrderNo +
            "&addressId=" +
            id
        })
      }
    }
  },
  onReachBottom: function () {
    this.getAddressList()
  }
}
</script>

<style lang="scss" scoped>
.model-box {
  overflow: hidden;
  border:2rpx solid var(--bd-color-main);
  background: var(--bg-color-main);
  color: var(--text-color-main);
  /deep/ .u-model {
    background-color:var(--bg-color-main);
    border: 1px solid var(--bd-color-main);
  }
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
  background: var(--bg-color-main);
}
.all{
  width: 100vw;
  height: 100vh;
  background-color: var(--bg-color-second) !important;
}
.flex {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.row-middle {
  display: flex;
  width: 20%;
  justify-content: space-around;
  align-items: flex-end;
  margin-left: 30rpx;
}
.loadingicon {
  text-align: center;
  padding: 10rpx 0;
}
.address-management {
  background: var(--bg-color-second);
  // padding: 20rpx 30rpx;
  margin-bottom: calc(120rpx + env(safe-area-inset-bottom));
}

.address-management.fff {
  background-color: var(--bg-color-main);
  height: 82vh;
}

.line {
  width: 100%;
  height: 3rpx;
  image {
    width: 100%;
    height: 100%;
    display: block;
  }
}
.address-management .item {
  background-color: var(--bg-color-main);
  padding: 0 30rpx;
  margin-bottom: 20rpx;
}

.address-management .item .address {
  padding: 35rpx 0;

  font-size: 28rpx;
}

.address-management .item .address .consignee {
  font-size: 28rpx;
  margin-bottom: 8rpx;
}

.address-management .item .address .consignee .phone {
  margin-left: 25rpx;
}

.address-management .item .operation {
  height: 83rpx;
  font-size: 28rpx;
  color: var(--text-color-grey);
  // border-bottom: 2rpx solid var(--bd-color-main);
}

.address-management .item .operation .radio text {
  margin-left: 13rpx;
}

.address-management .item .operation .iconfont {
  font-size: 35rpx;
  vertical-align: -2rpx;
  margin-right: 10rpx;
}

.address-management .item .operation .iconfont.icon-shanchu {
  margin-left: 35rpx;
  font-size: 38rpx;
}
.loadTitle {
  color:var(--text-color-grey)
}

.footer {
  position: fixed;
  width: 100%;
  background-color: var(--bg-color-main);
  bottom: 0;
  height: calc(120rpx + env(safe-area-inset-bottom));
  padding: 20rpx 0 20rpx;
  box-sizing: border-box;
  // box-sizing: border-box;
  // padding-bottom: env(safe-area-inset-bottom);
}

.footer .addressBnt {
  width: 95%;
  height: 76rpx;
  border-radius: 50rpx;
  text-align: center;
  line-height: 76rpx;
  font-size: 30rpx;
  color: var(--bg-color-main);

  margin: 0 auto;
}

.footer .addressBnt.on {
  width: 690rpx;
  margin: 0 auto;
}

.footer .addressBnt .iconfont {
  font-size: 35rpx;
  margin-right: 8rpx;
  vertical-align: -1rpx;
}
.noCommodity {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.noCommodity .pictrue {
  // width: 414rpx;
  // height: 360rpx;
  margin: 0 auto;
 
}
.bg-color {
  background-color: var(--theme-color-dark-blue);
}
//样式修改
.all {
  
  width: 100vw;
  // height: calc(100vh - 120rpx - env(safe-area-inset-bottom));
  // overflow: auto;
}
.address {
  display: flex;
  align-items: center;
  border-bottom: 1px solid var(--bd-color-main);
  padding: 30rpx 0;
  .address-left {
    width: 80%;
    .address-province-district {
      font-size: 28rpx;
      color: var(--text-color-main);
    }
    .address-detail {
      margin-top: 10rpx;
      font-size: 36rpx;
      font-weight: 600;
      color: var(--text-color-main);
    }
    .consignee {
      margin-top: 24rpx;
      color: var(--text-color-grey);
    }
  }
  .address-right {
    width: 20%;
    text-align: center;
    image {
      width: 36rpx;
      height: 36rpx;
    }
  }
  input[type="radio"] {
    display: none;
  }
}
.bottom-button-box {
  width: 92%;
  margin: 0 auto;
}
</style>
