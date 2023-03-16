<template>
  <view
    class="large"
    @click="godDetail(itemData, true)"
    :style="{ background: serveBackgroundItem }"
  >
    <view class="image-box">
      <image
        mode="widthFix"
        :src="
          itemData.image
            ? itemData.image
            : 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F26%2Fc8%2F69%2F26c869bc8428113a454b0207e42f339f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647237544&t=7a2a8c8effd13e9d1492574bd58d6f70'
        "
      />
    </view>
    <view class="title-box">
      <view class="package-title">{{
        itemData.storeName ? itemData.storeName : "ACL服务包"
      }}</view>
      <view class="sales-money-box">
        <view class="money">
          <text class="money-box">￥</text>
          <text>{{itemData.price}}</text>
        </view>
        <view class="sales">{{itemData.sales}}人付款</view>
      </view>
<!--      <view class="package-description">{{-->
<!--        itemData.storeInfo[0].useDirection-->
<!--      }}</view>-->
      <!-- <view class="package-description">{{
        itemData.productOrderInfo.teamName
      }}</view> -->
      <!-- <view class="price">￥{{ itemData.price ? itemData.price : "0" }}</view> -->
<!--      <u-button-->
<!--        size="default"-->
<!--        type="primary"-->
<!--        shape="circle"-->
<!--        class="button-position"-->
<!--        :custom-style="customStyle"-->
<!--        @click.stop="godDetail(itemData, true)"-->
<!--        >查看详情</u-button-->
<!--      >-->
      <!-- <view></view> -->
    </view>
  </view>
</template>
<script>
export default {
  data() {
    return {
      customStyle: {
        width: "156rpx",
        fontSize: "28rpx",
        lineHeight: "40rpx",
        height: "64rpx"
      }
    }
  },
  props: {
    itemData: {
      type: Object,
      default: function () {
        return {
          storeName: "",
          price: "",
          productOrderInfo: {}
        }
      }
    },
    serveBackgroundItem: {
      type: String,
      default: "var(--bg-color-secondhome)"
    },
    isBuy: {
      type: Boolean,
      default: true
    },
    referrerId: {
      type: String,
      default: ""
    }
  },
  methods: {
    // 去详情页
    godDetail(item, isBuyNow) {
      if (item.id) {
        if (item.tenantId) {
          this.$store.commit("getenants", item.tenantId)
          uni.navigateTo({
            url: `pages/shopping-mall/goods_details/index?id=${
              item.id
            }&useDirection=${JSON.stringify(
              item.productOrderInfo.useDirection
            )}&healthTips=${JSON.stringify(
              item.productOrderInfo.healthTips
            )}&servicePackageId=${
              item.productOrderInfo.servicePackageId
            }&isBuy=${this.isBuy.toString()}&clearTenantId=${true}&referrerId=${
              this.referrerId
            }`
          })
        } else {
          uni.navigateTo({
            url: `pages/shopping-mall/goods_details/index?id=${
              item.id
            }&useDirection=${JSON.stringify(
              item.productOrderInfo.useDirection
            )}&healthTips=${JSON.stringify(
              item.productOrderInfo.healthTips
            )}&servicePackageId=${
              item.productOrderInfo.servicePackageId
            }&isBuy=${this.isBuy.toString()}&clearTenantId=${false}&referrerId=${
              this.referrerId
            }`
          })
        }
        // console.log(item, "跳转传的参")
      }

      // goShopDetail(item, this.uid).then(res => {
      // 	uni.navigateTo({
      // 		url: `/pages/fromHome/characteristicMedicinalDiet/goods_details/index?id=${item.id}`
      // 	})
      // })
    }
  }
}
</script>
<style scoped lang="scss">
.large {
  width:100%;
  box-sizing: border-box;
  // margin: 0 auto;
  //display: flex;
  //padding: 20rpx;
  //justify-content: space-between;
  //align-items: flex-start;
  position: relative;
  border-radius: 16rpx;
  margin: 0 auto 2.5vw;
  break-inside: avoid;
  // background: var(--bg-color-secondhome);
}
//.button-position {
//  //position: absolute;
//  //bottom: 30rpx;
//  //right: 4%;
//  font-weight: 400;
//  color: var(--text-color-main);
//}
.image-box {
  width: 100%;
 height: 200rpx;
 display: flex;
 flex-direction: column;
 align-items: center;
 // justify-content: center;
  margin-bottom: 2vw;
  overflow: hidden;
  image {
    width: 100%;
    // height: 100%;
	height: auto;
    border-radius: 10rpx;
  }
}
.title-box {
  width: 90%;
  margin: 2vw auto ;
  //margin-top: 2vw;
  //margin-bottom: 2vw;
  box-sizing: border-box;
  //padding: 0 2%;
  .sales-money-box {
    display: flex;
    justify-content: flex-start;
    align-items: center;
    .money {
      color: #FF795F;
      font-size: 33rpx;
      font-weight: 600;
      margin-right: 4vw;
      .money-box {
        font-size: 33rpx;
      }
    }
    .sales {
      font-size: 28rpx;
      color: var(--text-color-grey);
    }
  }

}
.package-title {
	font-size: 32rpx;
  color: var(--text-color-main);
  font-weight: 600;
  display: -webkit-box;
  -webkit-box-orient: vertical;
  -webkit-line-clamp: 1;
  overflow: hidden;
  margin-bottom: 1vw;
}
//.package-description {
//  color: var(--text-color-grey);
//  font-size: 24rpx;
//  margin-top: 8rpx;
//  display: -webkit-box;
//  -webkit-box-orient: vertical;
//  -webkit-line-clamp: 2;
//  overflow: hidden;
//}
// .price {
//   color: var(--text-color-yellow);
//   font-size: 28rpx;
//   margin-top: 24rpx;
// }
</style>
