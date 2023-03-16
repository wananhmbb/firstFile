<template>
  <view v-if="resourceList && resourceList.length > 0" class="item-box">
    <u-waterfall v-model="resourceList" ref="uWaterfall" class="box">
      <template v-slot:left="{leftList}">
        <view
          class="flex-box left-box"
          v-for="(item, index) in leftList"
          :key="index"
          @click="
            item.resourceInfo
              ? clickDetail(
                  item,
                  item.heResourceId,
                  item.id,
                  item.resourceInfo.title,
                  item.resourceInfo.type
                )
              : clickFreeDetail(item.id, item.title, item.type)
          "
        >
          <view class="image-box">
            <view
              v-if="item.resourceInfo"
              :class="item.study == 0 ? 'image-box-type0' : 'image-box-type1'"
            >{{ item.study == 0 ? "未学习" : "已学习" }}</view
            >
            <!-- <view class="image-box-type1">已学习</view> -->
            <image
              :src="item.resourceInfo ? item.resourceInfo.cover : item.cover"
              mode="widthFix"
            ></image>
          </view>
          <view class="title-time-box">
            <view class="title">{{
                item.resourceInfo ? item.resourceInfo.title : item.title
              }}</view>
            <!--          <view class="timeBox">-->
            <!--            <view class="time">{{-->
            <!--              item.resourceInfo ? item.resourceInfo.createDate : item.createDate-->
            <!--            }}</view>-->
            <!--            <view class="time" v-if="item.resourceInfo || item.hits"-->
            <!--              ><u-icon name="eye-fill" class="icon-css"></u-icon-->
            <!--              ><text>{{-->
            <!--                item.resourceInfo ? item.resourceInfo.hits : item.hits-->
            <!--              }}</text></view-->
            <!--            >-->
            <!--          </view>-->
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
              <text class="text">
                {{
                  item.resourceInfo ? item.resourceInfo.author : item.author
                }}</text
              >
            </view>
            <view>
              <image
                class="like-image"
                :src="
                  item.likeFlag ? defaultLikePath.LIKE : defaultLikePath.NO_LIKE
                "
                @click.stop="toChangeLike(item)"
              ></image>

              <!--            <u-icon name="eye-fill" class="visit-icon"></u-icon>-->
              <text class="text">
                {{
                  item.resourceInfo ? item.resourceInfo.hits : item.hits
                }}</text
              >
            </view>
          </view>
        </view>
      </template>
      <template v-slot:right="{rightList}">
        <view
          class="flex-box right-box"
          v-for="(item, index) in rightList"
          :key="index"
          @click="
            item.resourceInfo
              ? clickDetail(
                  item,
                  item.heResourceId,
                  item.id,
                  item.resourceInfo.title,
                  item.resourceInfo.type
                )
              : clickFreeDetail(item.id, item.title, item.type)
          "
        >
          <view class="image-box">
            <view
              v-if="item.resourceInfo"
              :class="item.study == 0 ? 'image-box-type0' : 'image-box-type1'"
            >{{ item.study == 0 ? "未学习" : "已学习" }}</view
            >

            <image
              :src="item.resourceInfo ? item.resourceInfo.cover : item.cover"
              mode="widthFix"
            ></image>
          </view>
          <view class="title-time-box">
            <view class="title">{{
                item.resourceInfo ? item.resourceInfo.title : item.title
              }}</view>
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
              <text class="text">
                {{
                  item.resourceInfo ? item.resourceInfo.author : item.author
                }}</text
              >
            </view>
            <view>
              <image
                class="like-image"
                :src="
                  item.likeFlag ? defaultLikePath.LIKE : defaultLikePath.NO_LIKE
                "
                @click.stop="toChangeLike(item)"
              ></image>
              <text class="text">
                {{
                  item.resourceInfo ? item.resourceInfo.hits : item.hits
                }}</text
              >
            </view>
          </view>
        </view>
      </template>
    </u-waterfall>
  </view>
  <view class="empty" v-else>
    <x-icon iconName="service-no-data"></x-icon>
  </view>
</template>
<script>
export default {
  props: {
    receiveResourceList: {
      type: Array,
      default: () => {
        return []
      }
    },
    receiveIndex: {
      type: Number,
      default: 0
    }
  },
  data() {
    return {
      resourceList: [],
      leftList: [],
      rightList: [],
      getIndex: 0,
      text: "暂无数据",
      defaultLikePath: {
        NO_LIKE:
          "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/icon/noLikes.png",
        LIKE: "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/wxapp/icon/like.png"
      }
    }
  },
  methods: {
    toChangeLike(item) {
      this.resourceList.forEach(e => {
        if (e.id === item.id) {
          if (item.likeFlag) {
            e.likeFlag = false
          } else {
            e.likeFlag = true
          }
        }
      })
    },
    clickDetail(item, heResourceId, id, title, type) {
      if (item.tenantId) {
        this.$store.commit("getenants", item.tenantId)
      }
      if (type === "1") {
        this.$Router.push({
          name: "healthEducationDetails",
          params: {
            heResourceId: heResourceId,
            id: id,
            title: title,
            getIndex: this.getIndex
          }
        })
      }
      if (type === "2") {
        this.$Router.push({
          path: "/sleepVideo",
          query: {
            heResourceId: id,
            id: heResourceId
          }
        })
      }
      if (type === "3") {
        this.$Router.push({
          path: "/audioPlay",
          query: {
            heResourceId: id,
            id: heResourceId
          }
        })
      }
    },
    clickFreeDetail(id, title, type) {
      if (type === "2") {
        this.$Router.push({
          path: "/sleepVideo",
          query: {
            id: id
          }
        })
      }
      if (type === "1") {
        this.$Router.push({
          name: "healthEducationDetails",
          params: {
            id: id,
            title: title,
            getIndex: this.getIndex
          }
        })
      }
      if (type === "3") {
        this.$Router.push({
          path: "/audioPlay",
          query: {
            id: id
          }
        })
      }
    }
  },
  watch: {
    receiveIndex() {
      this.getIndex = this.receiveIndex
    },

    receiveResourceList: {
      immediate: true,
      deep: true,
      handler(val) {
        this.resourceList = []
        console.log(val)
        this.resourceList = JSON.parse(JSON.stringify(val))
        // this.$forceUpdate()
      }
    }
  }
}
</script>
<style scoped lang="scss">
.item-box {
  padding: 0 3% env(safe-area-inset-bottom);
}
.left-box {
  width: 98%;
  box-sizing: border-box;
  padding: 0 2% 0 0%;
}
.right-box {
  width: 98%;
  box-sizing: border-box;
  padding: 0 0% 0 2%;
}
.flex-box {
  //width: 100%;
  margin: 0 auto 4%;
  box-sizing: border-box;
  border-radius: 15rpx;
  overflow: hidden;
  //background-color: var(--bg-color-main);
  break-inside: avoid;
  .image-box {
    width: 100%;
    //height: 180rpx;
    //border-radius: 20rpx;
    //overflow: hidden;
    //position: relative;
    image {
      width: 100%;
      height: 100%;
      border-radius: 20rpx;
    }
  }

  .like-image {
    width: 24rpx;
    height: 24rpx;
    margin-right: 4rpx;
  }
  //display: flex;
  //justify-content: space-between;
  //border-bottom: 1px solid var(--bd-color-main);
  //padding: 40rpx 0;
}
.title-time-box {
  width: 100%;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  .title {
    font-size: 32rpx;
    font-weight: 600;
    color: var(--text-color-main);
    line-height: 48rpx;
    text-overflow: -o-ellipsis-lastline;
    overflow: hidden;
    text-overflow: ellipsis;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    line-clamp: 2;
    -webkit-box-orient: vertical;
  }
  .time {
    font-size: 24rpx;
    font-weight: 400;
    color: var(--text-color-grey);
    line-height: 32rpx;
  }
}

.image-box-type0 {
  position: absolute;
  width: 52px;
  line-height: 16px;
  background: var(--theme-color-dark-blue);
  border-radius: 8px 0;
  font-size: 12px;
  color: var(--text-color-white);
  text-align: center;
  padding: 2px;
}
.image-box-type1 {
  position: absolute;
  width: 52px;
  line-height: 16px;
  background: rgba(0, 0, 0, 0.5);
  border-radius: 8px 0;
  font-size: 12px;
  color: white;
  text-align: center;
  padding: 2px 0;
}
.timeBox {
  display: flex;
  view:nth-child(2) {
    padding-left: 30px;
  }
}
.icon-css {
  margin-right: 10rpx;
}
.empty {
  margin-top: 150px;
  text-align: center;
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
    margin-right: 6rpx;
  }
}
</style>
