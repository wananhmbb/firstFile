<template>
  <!-- 运动，商城。。。 -->
  <view class="flex-item-box">
    <view
      class="flex-item"
      v-for="(item, index) in vajraDistrictList"
      :key="index"
      @click="motioServicePackageList(item)"
    >
      <view class="icon-font">
        <image :src="item.iconPath" mode="heightFix"  ></image>
      </view>
      <view>
        <text class="name-box">
          {{ item.name }}
        </text>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>
<script>
export default {
  props: {
    vajraDistrictList: {
      type: Array
    }
  },
  data() {
    return {}
  },
  methods: {
    motioServicePackageList(item) {
		console.log(item)
      if (item.status === 1 ) {
        if (item.contentType === "spGoods") {
          this.$Router.push({
            path: "/goodsList",
            query: {
              categoryId: item.extra.cateId,
              text: item.extra
            }
          })
        }
        if (item.contentType === "publicityMaterial") {
          this.$Router.push({
            path: "/vajraDistrictDetails",
            query: {
              detailsId: item.id
            }
          })
        }
        if (item.contentType === "mall") {
          this.$Router.push({
            path: "/shoppingGoodsList",
            query: {
              categoryId: "515"
            }
          })
        }
        if (item.contentType === "customized") {
          this.$Router.push({
            path: item.extra.path,
            query: {
              detailsId: item.id,
              text: item.extra,
			        navname:item.name
            }
          })
        }
      } else {
        this.$refs.uToast.show({
          title: "暂未开放，敬请期待",
          type: "primary"
        })
      }
    }
  }
}
</script>
<style lang="scss" scoped>
.icon-font {
  //width: 100%;
  height: 60rpx;
  margin-bottom: 25rpx;
  image {
    width: 100%;
    height: 100%;
    image-rendering:-webkit-optimize-contrast
  }
}
.flex-item-box {
  display: flex;
  flex-direction: row;
  flex-wrap: wrap;
  margin-top: 10px;
}
.flex-item {
  width: 25%;
  padding: 20px 0 5px 0;
  display: flex;
  flex-direction: column;
  align-items: center;
  background: var(--bg-color-main);
  color: var(--text-color-main);
  .name-box {
    font-size: 30rpx;
    font-weight: 600;
    color:var(--text-color-main);
  }
}
</style>
