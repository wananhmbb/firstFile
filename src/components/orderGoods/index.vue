<template>
  <view class="orderGoods borRadius14">
    <!-- <view class="total"
      >共{{ orderProNum ? orderProNum : totalNmu }}件商品</view
    > -->
    <view class="goodWrapper pad30">
      <view
        class="item acea-row row-between-wrapper flex"
        v-for="(item, index) in cartInfo"
        :key="index"
        @click="jumpCon(item.productId)"
      >
        <view class="pictrue">
          <image :src="item.image" mode="widthFix"></image>
        </view>
        <view class="text">
          <view class="acea-row row-between-wrapper">
            <view class="name line1 package-title">{{
              item.productName ? item.productName : item.storeName
            }}</view>
            <view class="name line1 package-description">{{
              currentPropsData()
            }}</view>
            <!-- <view class="name line1 package-description">{{
              productOrderInfo.teamName ||
              orderInfoVo.orderDetailList[0].storeName
            }}</view> -->
          </view>
          <!-- <view class="attr line1" v-if="item.sku">{{ item.sku }}</view> -->
          <view class="flex">
            <view class="num"
              >x{{ item.payNum ? item.payNum : item.cartNum }}</view
            >
            <view class="money font-color">￥{{ item.price }}</view>
          </view>

          <!-- <view class="evaluate" v-if="item.isReply == 1">已评价</view> -->
        </view>
        <!-- <view
          class="evaluate"
          v-if="item.isReply == 0"
          @click.stop="evaluateTap(item)"
          >评价
        </view> -->
      </view>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    evaluate: {
      type: Number,
      default: 0
    },
    cartInfo: {
      type: Array,
      default: function () {
        return []
      }
    },
    orderId: {
      type: String,
      default: ""
    },
    ids: {
      type: Number,
      default: 0
    },
    jump: {
      type: Boolean,
      default: false
    },
    orderProNum: {
      type: Number,
      default: function () {
        return 0
      }
    },
    productType: {
      type: Number,
      default: function () {
        return 0
      }
    },
    productOrderInfo: {
      type: Object,
      default: function () {
        return {
          teamName: "",
          useDirection: ""
        }
      }
    },

    orderInfoList: {
      type: Array,
      default: () => {
        return []
      }
    }
  },

  data() {
    return {
      totalNmu: ""
    }
  },
  watch: {
    cartInfo: function (nVal) {
      let num = 0
      nVal.forEach(item => {
        num += item.cartNum
      })
      this.totalNmu = num
    }
  },
  methods: {
    evaluateTap(item) {
      uni.navigateTo({
        url:
          "/pages/users/goods_comment_con/index?unique=" +
          item.attrId +
          "&orderId=" +
          this.orderId +
          "&id=" +
          this.ids
      })
    },
    jumpCon: function (id) {
      let type = this.productType == 0 ? "normal" : "video"
      if (this.jump) {
        uni.navigateTo({
          url: `/pages/goods_details/index?id=${id}&type=${type}`
        })
      }
    },
    /**
     * 判断当前在哪个字段里面有介绍
     *
     */
    currentPropsData() {
      if (this.orderInfoList && this.orderInfoList.length > 0) {
        if (
          this.orderInfoList[0] &&
          this.orderInfoList[0].storeInfo &&
          JSON.parse(this.orderInfoList[0].storeInfo) &&
          JSON.parse(this.orderInfoList[0].storeInfo)[0]
        )
          return (
            JSON.parse(this.orderInfoList[0].storeInfo)[0].useDirection || ""
          )
      } else if (this.cartInfo && this.cartInfo.length > 0) {
        if (
          this.cartInfo[0].storeInfo &&
          JSON.parse(this.cartInfo[0].storeInfo) &&
          JSON.parse(this.cartInfo[0].storeInfo)[0]
        ) {
          return JSON.parse(this.cartInfo[0].storeInfo)[0].useDirection || ""
        }
      }
    }
  }
}
</script>

<style scoped lang="scss">
.flex {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 96%;
  margin: 0 auto;
  padding: 20rpx 0;
  image {
    width: 130rpx;
    height: 130rpx;
  }
}
.flex-left {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.num {
  font-size: 24rpx;
  font-weight: 400;
  color: var(--text-color-grey);
  line-height: 28rpx;
  margin-left: 6rpx;
}
.orderGoods {
  background-color: var(--bg-color-main);
  // margin-top: 15rpx;
  // margin-bottom: 20rpx;
}

.orderGoods .total {
  width: 100%;
  height: 86rpx;
  padding: 0 24rpx;
  border-bottom: 2rpx solid var(--bd-color-main);
  font-size: 30rpx;
  color: var(--text-color-main);
  line-height: 86rpx;
  box-sizing: border-box;
}
.pictrue {
  width: 40%;
}
.text {
  width: 60%;
}
.pictrue image {
  background: var(--bg-color-main);
  width: 192rpx;
  // height: 160rpx;
  border-radius: 20rpx;
}
.font-color {
  color: var(--text-color-main);
  font-weight: 600;
}
.attr {
  font-size: 24rpx;
  color: var(--text-color-grey);
  margin-top: 7rpx;
}
//修改样式
.name {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.goodWrapper {
}
.package-description {
  color: var(--text-color-grey);
  font-size: 24rpx;
  margin-top: 8rpx;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.package-title {
  color: var(--text-color-main);
  font-weight: 600;
}
</style>
