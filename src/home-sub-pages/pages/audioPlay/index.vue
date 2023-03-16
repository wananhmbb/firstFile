<template>
  <theme>
    <view slot="theme" class="all">
      <house-header
        :headTypeTwo="headTitle"
        :clearTenantId="clearTenantId"
      ></house-header>
      <view v-if="src">
        <view class="content">
          <view class="imgBox">
            <image :src="image"></image>
          </view>
          <view class="palyBox">
            <view class="title"> {{ headTitle }} </view>
            <view class="author">
              <text>作者</text>
              <text>{{ author }}</text>
            </view>
          </view>
          <audioPlay
            :src="src"
            ref="audioPlay"
            :autoplay="autoplay"
            :playbackRate="playbackRate"
            @onEnded="onEnded"
          ></audioPlay>
        </view>
        <view class="bottomBtnBox">
          <view class="audioBtn" @click="play">
            <image
              :src="
                state
                  ? 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220831144246.png'
                  : 'https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220831144240.png'
              "
            ></image>
          </view>
          <view class="multiple">
            <view class="multipleItem">
              <text class="multipleText">倍数</text>
              <text
                @click="changeSpeed(0.5)"
                :class="playbackRate == 0.5 ? 'multipleTextColor' : 'pd'"
              >
                0.5</text
              >
            </view>
            <view class="multipleItem">
              <text
                class="multipleText"
                @click="changeSpeed(1.0)"
                :class="playbackRate == 1 ? 'multipleTextColor' : 'pd'"
              >
                1.0</text
              >
              <text
                @click="changeSpeed(1.5)"
                :class="playbackRate == 1.5 ? 'multipleTextColor' : 'pd'"
              >
                1.5</text
              >
            </view>
          </view>
        </view>
      </view>
      <view class="no-data" v-else>
        <x-icon iconName="service-no-data icon-font"></x-icon>
      </view>
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
import { hjtHeClick, detailById, isStudy } from "@/api/service"
import audioPlay from "./components/imt-audio/imt-audio.vue"
export default {
  components: {
    audioPlay
  },
  data() {
    return {
      autoplay: true,
      headTitle: "",
      author: "",
      loading: true,
      src: "",
      image: "",
      clearTenantId: false,
      state: true, //播放状态是否开启
      playbackRate: 1 //播放速度
    }
  },
  onLoad(option) {
    this.clearTenantId = this.$Route.query.clearTenantId
    if (option) {
      this.id = option.id
      this.heResourceId = option.heResourceId
      this.detail(this.id)
      this.increase(this.id)
    }
  },
  methods: {
    /* 进入页面十秒便已学习 */
    toStudy(id) {
      setTimeout(() => {
        isStudy(id)
      }, 10000)
    },
    /* 添加点击数 */
    increase(id) {
      hjtHeClick(id)
    },
    detail(id) {
      detailById(id)
        .then(res => {
          if (res.code === 200 && res.data) {
            this.loading = false
            this.image = res.data.cover
            this.src = res.data.content
            // this.src =
            //   "https://bjetxgzv.cdn.bspapp.com/VKCEYUGU-hello-uniapp/2cc220e0-c27a-11ea-9dfb-6da8e309e0d8.mp3"
            this.headTitle = res.data.title
            this.author = res.data.author
            this.autoplay = true
            if (this.heResourceId) {
              this.toStudy(this.heResourceId)
            }
          } else {
            this.loading = false
          }
        })
        .catch(e => {
          this.loading = false
        })
    },
    play() {
      this.state = !this.state
      this.$nextTick(() => {
        if (!this.state) {
          this.$refs["audioPlay"].pause()
        } else {
          this.$refs["audioPlay"].play()
        }
      })
    },
    changeSpeed(item) {
      this.playbackRate = item
    },
    onEnded(val) {
      console.log(val, "子组件")
      this.state = val
    }
  }
}
</script>

<style scoped lang="scss">
.loading-box {
  width: 100vw;
  height: 100vh;
  margin: 40px auto auto;
  text-align: center;
  line-height: 90vh;
  position: fixed;
  top: 0;
  left: 0;
  background: var(--bg-color-main);
  // background: red;
  z-index: 50;
}
.no-data {
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
  height: 150rpx;
  width: 70vm;
  .no-data-text {
    width: 100%;
    text-align: center;
    margin-top: 30rpx;
    color: var(--text-color-grey);
  }
}
.all {
  background: var(--bg-color-main);
  .content {
    width: 90%;
    margin: auto;
    .imgBox {
      margin-top: 20px;
      width: 100%;
      height: 394rpx;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .palyBox {
      margin-top: 25px;
      .title {
        font-size: 36rpx;
        font-weight: bold;
      }
      .author {
        padding-top: 5px;
        font-size: 30rpx;
        font-weight: bold;
        color: var(--text-color-grey);
        text:first-child {
          padding-right: 10px;
        }
      }
    }
  }
  .bottomBtnBox {
    height: 124rpx;
    position: fixed;
    bottom: 10px;
    width: 100%;
    background-size: 100% 100%;
    background-image: url("https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20220831144215.png");
    .audioBtn {
      width: 134rpx;
      height: 134rpx;
      margin: auto;
      position: absolute;
      bottom: 40rpx;
      left: 0;
      right: 0;
      image {
        width: 100%;
        height: 100%;
      }
    }
    .multiple {
      padding-top: 14px;
      width: 100%;
      height: 100%;
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 30rpx;
      color: var(--text-color-grey);
      .multipleItem {
        padding: 20px;
      }
      .multipleText {
        padding-right: 25px;
      }
      .multipleTextColor {
        color: var(--theme-color-dark-blue);
        padding: 10px 15px;
      }
      .pd {
        padding: 10px 15px;
      }
    }
  }
}
</style>
