<template>
  <view class="product-bg">
    <swiper
      :indicator-dots="indicatorDots"
      :autoplay="autoplay"
      :circular="circular"
      :interval="interval"
      :duration="duration"
      @change="change"
    >
      <swiper-item v-if="videoline">
        <view class="item">
          <view v-show="!controls" style="width: 100%; height: 100%">
            <video
              id="myVideo"
              :src="videoline"
              objectFit="cover"
              controls
              style="width: 100%; height: 100%"
              show-center-play-btn
              show-mute-btn="true"
              auto-pause-if-navigate
              :custom-cache="false"
              :enable-progress-gesture="false"
              :poster="imgUrls[0]"
              @pause="videoPause"
            ></video>
          </view>
          <view class="poster" v-show="controls">
            <image class="image" :src="imgUrls[0]"></image>
          </view>
          <view class="stop" v-show="controls" @tap="bindPause">
            <x-icon iconName="stop"></x-icon>
            <!-- <image class="image" src="../../static/images/stop.png"></image> -->
          </view>
        </view>
      </swiper-item>

      <block v-for="(item, index) in imgUrls" :key="index">
        <swiper-item>
          <image :src="item" class="slide-image" />
        </swiper-item>
      </block>
    </swiper>
    <view class="bannerNum">
      <text>{{ nowImgPage }}</text>
      /
      <text> {{ length }}</text>
    </view>
  </view>
</template>

<script>
export default {
  props: {
    imgUrls: {
      type: Array,
      default: function () {
        return []
      }
    },
    videoline: {
      type: String
    }
  },
  data() {
    return {
      nowImgPage: "1",
      length: "",
      indicatorDots: false,
      circular: true,
      autoplay: true,
      interval: 3000,
      duration: 500,
      currents: "1",
      controls: true,
      isPlay: true,
      videoContext: ""
    }
  },
  created() {
    this.length = this.imgUrls.length
  },
  mounted() {
    if (this.videoline) {
      this.imgUrls.shift()
    }
  },
  methods: {
    videoPause(e) {},
    bindPause: function () {
      this.videoContext.play()
      this.$set(this, "controls", false)
      this.autoplay = false
    },
    change: function (e) {
      // this.$set(this, "currents", e.detail.current )
      this.nowImgPage = e.detail.current + 1
    }
  }
}
</script>

<style scoped lang="scss">
.bannerNum {
  width: 44px;
  line-height: 20px;
  color: var(--text-color-white);
  z-index: 99;
  background: #333333;
  position: absolute;
  right: 10px;
  bottom: 10px;
  opacity: 0.6;
  border-radius: 13px;
  text-align: center;
  font-size: 28rpx;
  text:first-child {
    font-size: 32rpx;
  }
}
.product-bg {
  width: 100%;
  height: 560rpx;
  position: relative;
}

.product-bg swiper {
  width: 100%;
  height: 100%;
  position: relative;
}

.product-bg .slide-image {
  width: 100%;
  height: 100%;
}

.product-bg .pages {
  position: absolute;
  background-color: var(--bg-color-main);
  height: 34rpx;
  padding: 0 10rpx;
  border-radius: 3rpx;
  right: 30rpx;
  bottom: 30rpx;
  line-height: 34rpx;
  font-size: 24rpx;
  color: var(--text-color-main);
}

#myVideo {
  width: 100%;
  height: 100%;
}

.product-bg .item {
  position: relative;
  width: 100%;
  height: 100%;
}

.product-bg .item .poster {
  position: absolute;
  top: 0;
  left: 0;
  height: 750rpx;
  width: 100%;
  z-index: 9;
}

.product-bg .item .poster .image {
  width: 100%;
  height: 100%;
}

.product-bg .item .stop {
  position: absolute;
  top: 50%;
  left: 50%;
  width: 136rpx;
  height: 136rpx;
  margin-top: -68rpx;
  margin-left: -68rpx;
  z-index: 9;
}

.product-bg .item .stop .image {
  width: 100%;
  height: 100%;
}
</style>
