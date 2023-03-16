<template>
  <view v-if="open">
    <view class="population" @click.stop="closeWindow"></view>
    <view v-if="loading" class="loading-style">
      <u-loading
        mode="circle"
        :show="loading"
        size="100"
        color="var(--theme-color-dark-blue)"
      ></u-loading>
    </view>
    <view v-else class="contact">
      <richTextComponent
        class="rich-text-box"
        :htmlData="htmlData"
        @iswatch="iswatch"
        :height="height"
        :tagStyle="tagStyle"
      ></richTextComponent>

      <view v-if="isOperation">
        <view class="bottomBox">
          <view class="bottomMask" @click="read" v-if="disabled"></view>
          <view class="bottom">
            <u-checkbox-group size="50">
              <u-checkbox
                :disabled="disabled"
                @change="checkboxChange"
                v-model="checked"
                :name="name"
                shape="circle"
                size="50"
                active-color="var(--theme-color-dark-blue)"
              ></u-checkbox>
            </u-checkbox-group>
            <view class="checkbox-title">{{ name }}</view>
          </view>
        </view>
        <view class="button-box">
          <button size="default" class="refuse" @click="refuseBuy">
            考虑一下
          </button>
          <button
            size="default"
            class="next"
            @click="goBuy"
            :disabled="disabledBtn"
          >
            {{ disabledBtn ? "倒计时" : "继续购买" }}
            <u-count-down
              v-if="disabledBtn"
              :show-hours="false"
              :show-minutes="false"
              @end="end"
              color="#ACACAC"
              bg-color="rgba(00, 00, 00, 0)"
              :timestamp="countDown"
              :autoplay="true"
            ></u-count-down>
          </button>
        </view>
      </view>
    </view>
    <u-toast ref="uToast" />
  </view>
</template>
<script>
import { bindReferrerId } from "@/api/store.js"
export default {
  data() {
    return {
      name: "我已仔细阅读本同意书，项目内容经慎重考虑，由我承担相关费用，从项目开始之日不再退费",
      checked: false,
      disabled: true,
      countDown: 10,
      disabledBtn: true,
      time: ""
    }
  },
  props: {
    loading: {
      type: Boolean,
      default: true
    },
    htmlData: {
      type: String,
      default: ""
    },
    open: {
      type: Boolean,
      default: false
    },
    isOperation: {
      type: Boolean,
      default: false
    },
    height: {
      type: String,
      default: "100%"
    },
    tagStyle: {
      type: Object,
      default: () => {
        return {}
      }
    },
    referrerId: {
      type: String,
      default: ""
    }
  },

  options: { styleIsolation: "shared" },
  methods: {
    checkboxChange() {
      this.checked = !this.checked
    },
    // 关闭弹窗
    closeWindow() {
      this.$emit("close", false)
      if (this.time) {
        clearInterval(this.time)
      }
      this.countDown = 10
      this.checked = false
      this.disabled = true
      this.disabledBtn = true
    },

    //页面已经滚动到底部
    iswatch(value) {
      this.disabled = !value
    },
    // 拒绝购买
    refuseBuy() {
      this.$emit("close", false)
      this.countDown = 10
      this.checked = false
      this.disabledBtn = true
      this.disabled = true
    },
    end() {
      this.disabledBtn = false
    },
    //继续购买
    goBuy() {
      if (!this.checked) {
        if (this.isOperation) {
          this.$refs.uToast.show({
            title: "请全部阅读,并勾选用户协议",
            type: "primary"
          })
        } else {
          this.$refs.uToast.show({
            title: "请勾选用户协议",
            type: "primary"
          })
        }
        return
      }
      this.$emit("close", true)
      if (this.time) {
        clearInterval(this.time)
      }
      if (this.referrerId) {
        this.bindId()
      }
      this.disabledBtn = true
      this.countDown = 10
      this.checked = false
      this.disabled = true
    },
    read() {
      this.$refs.uToast.show({
        title: "请全部阅读,才能勾选",
        type: "primary"
      })
    },
    bindId() {
      let data = {
        bindId: this.referrerId
      }
      bindReferrerId(data).then(res => {
        console.log(res, "绑定推荐人")
      })
    }
  }
}
</script>
<style scoped lang="scss">
/deep/.u-checkbox__icon-wrap--disabled {
  background: var(--bg-color-main) !important;
}
.population {
  background: rgba(00, 00, 00, 0.2);
  position: fixed;
  top: 0;
  left: 0;
  z-index: 99;
  width: 100vw;
  height: 100vh;
  pointer-events: auto;
  touch-action: none;
}
.contact {
  touch-action: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: var(--bg-color-main);
  width: 85vw;
  padding: 3% 4%;
  max-height: 80vh;
  z-index: 100;
  border-radius: 20rpx;
}
.loading-style {
  touch-action: none;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  background: rgba(0, 0, 0, 0);
  width: 45vw;
  padding: 3% 4%;
  height: 200rpx;
  z-index: 100;
  border-radius: 20rpx;
  text-align-last: center;
  line-height: 150rpx;
  vertical-align: middle;
}

.checkbox-title {
  font-size: 24rpx;
  color: var(--text-color-grey);
}
.button-box {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.bottom {
  margin: 20rpx 0;
  display: flex;
  justify-content: flex-start;
  align-items: center;
  /deep/ .u-checkbox {
    line-height: 1.1;
    font-size: 20rpx;
  }
}
.bottomBox {
  position: relative;
}
.bottomMask {
  z-index: 10;
  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  width: 100%;
  height: 55px;
}
/deep/.refuse::after {
  border: none;
}
/deep/.refuse {
  background: var(--bg-color-main);
  border-radius: 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  text-align: center;
  border: 1px solid var(--text-color-grey);
  color: var(--text-color-grey);
  // padding: 0 50rpx;
  width: 40%;
  padding: 0;
  margin: 0;
}
/deep/.next::after {
  border: none;
}
/deep/.next {
  padding: 0;
  margin: 0;
  width: 40%;
  background: var(--theme-color-dark-blue);
  color: var(--text-color-white);
  border-radius: 40rpx;
  height: 80rpx;
  line-height: 80rpx;
  font-size: 30rpx;
  text-align: center;
  // padding: 0 50rpx;
  border: 1px solid var(--bd-color-main);
}
.rich-text-box {
  width: 79vw;

  // height: 50vh;
}
</style>
