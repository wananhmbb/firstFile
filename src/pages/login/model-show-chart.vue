<template>
  <view class="Box">
    <view class="image-box">
      <x-icon iconName="logo" class="icon-font"></x-icon>
    </view>
    <view class="content">
      <button
        class="btn"
        :open-type="checked ? 'getPhoneNumber' : ''"
        @getphonenumber="getPhoneNumber"
        :withCredentials="checked ? 'true' : ''"
        @click="checkUserAgreement"
        :loading="loading"
      >
        微信用户一键登录
      </button>
      <view class="checkbox">
        <u-checkbox
          @change="checkboxChange"
          v-model="checked"
          shape="circle"
          :name="name"
          active-color="var(--theme-color-dark-blue)"
          size="50"
        >
        </u-checkbox>
        <view @click="isAgree"
          >登录代表您已同意<text
            @click.stop="registrationHtmlWindow"
            class="text"
            >《用户使用协议》</text
          >和
          <text class="text" @click.stop="privacyHtmlWindow">《隐私政策》</text>
        </view>
      </view>
    </view>
    <view class="btn-phone-or-nologin">
      <view class="view-right" @click="register">手机号注册/登录</view>
    </view>
    <servicePackageUserAgreementWindow
      :open="openWindow"
      @close="close"
      :loading="false"
      :isOperation="false"
      :htmlData="htmlData"
      :height="scrollHeight"
    ></servicePackageUserAgreementWindow>
  </view>
</template>
<script>
import {wechatLogin, getAccessPrivacyPolicyApi} from "@/api/login.js"

import {
  loginByWX,
  getProvider,
  GetCodeForUseUniLogin
} from "@/pages/login/wx-login.js"

import servicePackageUserAgreementWindow from "@/components/components/user-agreement-window/service-package-user-agreement-window.vue"
import {registrationAgreementHtml} from "@/const/registration-agreement.js"
import {WeChat_INFO} from "@/const/storage-key"
import {basicUser} from "@/utils/user-class/basicUser"
export default {
  data() {
    return {
      openWindow: false,
      name: "同意",
      checked: false,

      avatarUrl: "",
      nickName: "",
      iv: "",
      openId: "",
      phoneNumber: "",
      code: "",
      loading: false,
      scrollHeight: "50vh",
      privacyrAgeementHtml:'',
      htmlData: ''
    }
  },
  components: {
    servicePackageUserAgreementWindow
  },
  mounted() {
    this.accessPrivacyPolicy()
  },
  onHide() {
    this.loading = false
  },
  methods: {
    accessPrivacyPolicy() {
      getAccessPrivacyPolicyApi()
        .then(res => {
          this.privacyrAgeementHtml = res
        })
        .catch(err => {
          console.error("下载隐私政策失败", err)
        })
    },
    checkboxChange() {
      this.checked = !this.checked
    },

    checkUserAgreement() {
      if (!this.checked) {
        uni.$u.toast("请勾选用户协议")
        return false
      } else {
        if (!this.code) {
          this.getCode()
        }
        return true
      }
    },
    async getCode() {
      await getProvider()
      this.code = await GetCodeForUseUniLogin()
    },

    // 获取微信的绑定的手机号
    async getPhoneNumber(e) {
      if (!this.checkUserAgreement()) {
        return
      }

      if (e.detail && e.detail.encryptedData) {
        try {
          this.loading = true
          await this.getWechatLogin(e.detail)
          await this.Wechatlogin()
        } catch (e) {
          // this.getCode()
          this.loading = false
          this.$util.Tips({
            title: e.msg
          })
        }
      } else {
        console.log(e)
        this.loading = false
        uni.$u.toast("您拒绝了授权")
        // 跳转到白名单
      }
    },
    // 微信的一键登录获取解密后的openId以及phonewNumber
    getWechatLogin(res) {
      return new Promise((resolve, reject) => {
        let obj = {
          encryptedData: res.encryptedData,
          iv: res.iv,
          code: this.code
        }
        wechatLogin(obj)
          .then(res => {
            this.code = ""
            if (res.code === 200) {
              this.openId = res.data.openId

              uni.setStorageSync(WeChat_INFO, res.data)
              this.phoneNumber = res.data.phoneNumber
              resolve(res)
            } else {
              uni.$u.toast(res.data.msg)
              reject(res)
            }
          })
          .catch(err => {
            this.code = ""
            reject(err)
            uni.$u.toast(err.msg)
          })
      })
      // this.code = store.state.user.code
    },

    // 微信登陆
    async Wechatlogin() {
      let that = this
      try {
        let res = await loginByWX(this.openId, this.phoneNumber, this)
        await basicUser.setUserToken(res, that)
        await basicUser.getLoginUserInfo()
        this.loading = false
      } catch (e) {
        this.loading = false
        this.$util.Tips({
          title: e.msg
        })
      }
    },

    register() {
      this.$Router.replace({
        path: "/wxRegisterPhone",
        query: this.$Route.query
      })
    },
    // 打开弹窗
    registrationHtmlWindow() {
      this.openWindow = true
      this.htmlData = registrationAgreementHtml
    },
    privacyHtmlWindow() {
      this.openWindow = true

      this.htmlData = this.privacyrAgeementHtml
    },
    close() {
      this.openWindow = !this.openWindow
    },
    isAgree() {
      this.checked = !this.checked
    }
  }
}
</script>
<style lang="scss" scoped>
.Box {
  height: 100%;
  position: relative;
}
.content {
  width: 100%;
  position: absolute;
  top: 45%;
  margin: 15px auto;
}
.image-box {
  position: absolute;
  top: 10%;
  width: 100%;
  text-align: center;
  .icon-font {
    width: 180rpx;
    height: 180rpx;
  }
}
.btn-phone-or-nologin {
  width: 100%;
  position: absolute;
  bottom: 0;
  margin: auto;
}

.view-right {
  text-align: center;
  font-size: 28rpx;
  color: #666973;
}
.btn {
  width: 85%;
  color: #fff;
  background: #4381cf;
  border-radius: 50rpx;
  margin-bottom: 50rpx;
  font-size: 32rpx;
  padding: 10rpx 0;
}
.btn::after {
  border: none;
}

.checkbox {
  width: 85%;
  margin: auto;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;
  view {
    color: var(--text-color-grey);
    font-size: 25rpx;
    margin-left: -20rpx;
  }
  .text {
    color: var(--theme-color-dark-blue);
  }
}
</style>
