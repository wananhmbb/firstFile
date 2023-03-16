<template>
  <view>
    <x-waterfall column="2">
      <template v-slot:item>
        <view
          class="item-masonry"
          v-for="item in resourceList"
          :key="item.id"
          @click="
            clickDetail(
              item,
              item.id,
              item.resourceInfo ? item.resourceInfo.title : item.title,
              item.type
            )
          "
        >
          <view class="image-box">
            <image :src="item.cover" mode="widthFix"></image>
          </view>
          <view class="title-time-box">
            <view class="title">{{ item.title }}</view>
          </view>
          <view class="author-box">
            <view class="author-image-box">
              <image
                class="author-image"
                :src="
                  item.nameImage
                    ? item.nameImage
                    : 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/hjt/20230208/20230208142948_ef48df8569b54883a02b6bfb31a68d97_c074c62a3d9062e51397bce7f3633135.png'
                "
              ></image>
              <text class="text"> {{ item.author }}</text>
            </view>
            <view>
              <u-icon name="eye-fill" class="visit-icon"></u-icon>
              <text class="text"> {{ item.visit }}</text>
            </view>
          </view>
        </view>
      </template>
    </x-waterfall>
  </view>
</template>
<script>
export default {
  data() {
    return {}
  },
  props: ["resourceList"],
  methods: {
    clickDetail(item, id, title, type) {
      if (item.tenantId) {
        this.$store.commit("getenants", item.tenantId)
      }
      if (type === "1") {
        this.$Router.push({
          name: "healthEducationDetails",
          params: {
            id: id,
            title: title,
            clearTenantId: item.tenantId ? true : false
          }
        })
      }
      if (type === "2") {
        this.$Router.push({
          path: "/sleepVideo",
          query: {
            id: id,
            title: title,
            clearTenantId: item.tenantId ? true : false
          }
        })
      }
      if (type === "3") {
        this.$Router.push({
          path: "/audioPlay",
          query: {
            id: id,
            title: title,
            clearTenantId: item.tenantId ? true : false
          }
        })
      }
    }
  }
}
</script>
<style scoped lang="scss">
/**
瀑布流的样式
 */
.item-masonry {
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  background-color: #fff;
  break-inside: avoid;

  /*避免在元素内部插入分页符*/
  box-sizing: border-box;
  margin-bottom: 4%;
  //box-shadow: 0px 0px 28rpx 1rpx rgba(78, 101, 153, 0.14);

  .image-box {
    width: 100%;

    image {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }
  .title-time-box {
    width: 100%;
    position: relative;
    .title {
      font-size: 28rpx;
      font-weight: 600;
      color: var(--text-color-main);
      line-height: 36rpx;
      text-overflow: -o-ellipsis-lastline;
      overflow: hidden;
      text-overflow: ellipsis;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      line-clamp: 2;
      -webkit-box-orient: vertical;
    }
    //.time {
    //  font-size: 24rpx;
    //  font-weight: 400;
    //  color: var(--text-color-grey);
    //  line-height: 32rpx;
    //  position: absolute;
    //  bottom: 18rpx;
    //  left: 0;
    //}
  }
  .author-box {
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 25rpx 0;
    .text {
      color: #333333;
    }
    .author-image-box {
      display: flex;
      justify-content: flex-start;
      align-items: center;
      .author-image {
        width: 36rpx;
        height: 36rpx;
        margin-right: 6rpx;
      }
    }
    .visit-icon {
      margin-right:6rpx;
    }
  }
}
</style>
