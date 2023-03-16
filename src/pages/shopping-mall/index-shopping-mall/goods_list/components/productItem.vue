<template>
  <view class="large" @click="godDetail(itemData, false)">
    <view class="image-box">
      <image
        mode='aspectFit'
        :src="
          itemData.image
            ? itemData.image
            : 'https://gimg2.baidu.com/image_search/src=http%3A%2F%2Fup.enterdesk.com%2Fedpic%2F26%2Fc8%2F69%2F26c869bc8428113a454b0207e42f339f.jpg&refer=http%3A%2F%2Fup.enterdesk.com&app=2002&size=f9999,10000&q=a80&n=0&g=0n&fmt=jpeg?sec=1647237544&t=7a2a8c8effd13e9d1492574bd58d6f70'
        "
      ></image>
    </view>
    <view class="title-box">
      <view class="package-title">
        <text
          v-if="setStoreType(itemData)"
          :class="['tag-box', productTypeClass ? productTypeClass : '']"
          >{{ setStoreType(itemData) }}</text
        >
        <text>{{ itemData.storeName ? itemData.storeName : "" }}</text></view
      >
      <!--      <view class="package-description">{{-->
      <!--        itemData.storeInfo[0].useDirection-->
      <!--      }}</view>-->
      <view class="price">
        <text>￥</text>
        <text class="price-number">{{
          itemData.price ? itemData.price : "0"
        }}</text>
      </view>
    </view>
  </view>
</template>
<script>
import {ProductTypeEnum, ProductTypeDictType} from "@/const/enums/ProductType"
export default {
  data() {
    return {
      productTypeClass: "",
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
    }
  },

  methods: {
    //设置当前商品类型
    setStoreType(val) {
      if (val?.storeInfo?.length) {
        const storeInfo = val.storeInfo[0]
        if (storeInfo?.productType) {
          if (ProductTypeEnum.OTC_DRUG === storeInfo?.productType) {
            this.productTypeClass = storeInfo.productType
            return ProductTypeDictType[ProductTypeEnum.OTC_DRUG]
          } else if (ProductTypeEnum.R_DRUG === storeInfo?.productType) {
            this.productTypeClass = storeInfo.productType
            return ProductTypeDictType[ProductTypeEnum.R_DRUG]
          } else {
            return ""
          }
        } else {
          return ""
        }
      }
      return ""
      // if (this.categoryList?.length) {
      //   const arr = this.categoryList.filter(item => {
      //     item.value === val.type
      //   })
      //   if (arr?.length) {
      //     return arr[0].label
      //   } else {
      //     return ""
      //   }
      // } else {
      //   return ""
      // }
    },
    // 去详情页
    godDetail(item) {
      if (item.id) {
        // uni.navigateTo({
        //   url: `pages/shopping-mall/goods_details/index?id=${item.id}`
        // })
        uni.navigateTo({
          url: `pages/shopping-mall/goods_details/index?id=${item.id}&productType=product`
        })
        // uni.navigateTo({
        //   url: `pages/index-shopping-mall/shopping-mall/goods_details/index?id=${item.id}&productType=product`
        // })
        // console.log(item, "跳转传的参")
      }
    }
  }
}
</script>
<style scoped lang="scss">
.large {
  width: 100%;
  //box-sizing: border-box;
  border-radius: 16rpx;
  background: var(--bg-color-main);
  margin-bottom: 20rpx;
}
.image-box {
  width: 100%;
  border-radius: 16rpx;
  height: 300rpx;
  overflow: hidden;
  image {
    width: 100%;
    height: 100%;
  }
}
.title-box {
  padding: 20rpx 20rpx;
  .package-title {
    color: var(--text-color-main);
    font-size: 28rpx;
    font-weight: 600;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    .tag-box {
      display: inline-block;
      margin-right: 2vw;
      border-radius: 7rpx;
      font-size: 20rpx;
      padding: 0.5vw;
      vertical-align: middle;
    }
    .R_DRUG {
      color: var(--text-color-grey);
      border: 2rpx solid var(--text-color-grey);
    }
    .OTC_DRUG {
      color: #d43934;
      border: 2rpx solid #d43934;
    }
  }
}
.price {
  color: #e44d22;
  margin-top: 25rpx;
  vertical-align: bottom;
  .price-number {
    font-size: 45rpx;
    display: inline-block;
    margin-left: 0.7vw;
  }
}
</style>
