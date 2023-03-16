<template>
  <theme>
    <view class="register-box" slot="theme">
      <house-header headRegisterHeader=" "></house-header>
      <view class="contant">
        <view class="phone-view">手机号注册/登录</view>
        <!-- 默认采用手机号码进行登录 -->
        <view class="login-form">
          <u-form
            :label-position="left"
            :model="model"
            ref="uForm"
            :label-align="right"
          >
            <u-form-item>
              <view class="phone-item">
                <view class="left-first">
                  <view>+86</view>
                  <image
                    src="https://s4.ax1x.com/2022/02/23/b9XvZj.png"
                    class="icon"
                  ></image>
                </view>
                <view class="border"></view>
                <view class="right-first">
                  <view class="right-item-first">
                    <u-input
                      v-model="model.identifier"
                      placeholder="输入手机号"
                      class="input-box"
                      :border="false"
                      type="number"
                      @input="changeNumber"
                      @blur="blurNumber"
                    ></u-input>
                  </view>
                </view>
              </view>
            </u-form-item>
            <u-form-item>
              <view class="right">
                <view class="right-item">
                  <u-input
                    v-model="model.credential"
                    :border="false"
                    class="input-box"
                    placeholder="请输入验证码"
                    type="number"
                    @input="numberAndvertionCodeLoginVerification"
                    @blur="blurNumberAndvertionCodeLoginVerification"
                  ></u-input>
                </view>
                <view class="right-item">
                  <u-verification-code
                    ref="uCode"
                    :seconds="seconds"
                    :start-text="startText"
                    :change-text="changeText"
                    :end-text="endText"
                    @start="autoStart = true"
                    @end="endCountdown"
                    @change="codeChange"
                    :keep-running="keepRunning"
                  ></u-verification-code>
                  <button
                    @click="getCode"
                    :disabled="verificationCodeDisabled"
                    class="verification-code-btn"
                  >
                    {{ tips }}
                  </button>
                </view>
              </view>
            </u-form-item>
          </u-form>
        </view>
        <view class="register">
          <button
            @click="register"
            :disabled="registerDisabled"
            class="btn"
            :loading="loading"
          >
            登录
          </button>
        </view>
        <view class="checkbox">
          <u-checkbox-group size="50">
            <u-checkbox
              @change="checkboxChange"
              v-model="checked"
              shape="circle"
              size="50"
              activeColor="#4381cf"
            >
            </u-checkbox>
          </u-checkbox-group>
          <view @click="isAgree"
            >登录代表您已同意<text
              @click.stop="registrationHtmlWindow"
              class="text"
              >《用户使用协议》</text
            >和
            <text class="text" @click.stop="privacyHtmlWindow"
              >《隐私政策》</text
            ></view
          >
        </view>

        <servicePackageUserAgreementWindow
          :open="openWindow"
          @close="close"
          :isOperation="false"
          :htmlData="htmlData"
          :height="scrollHeight"
          :loading="false"
        ></servicePackageUserAgreementWindow>

        <!-- 微信登录 -->
        <view class="weixin-login">
          <image
            src="https://s4.ax1x.com/2022/02/14/HymtpD.png"
            @click="tologinByWeiXin"
          ></image>
        </view>
        <u-toast ref="uToast"></u-toast>
      </view>
    </view>
  </theme>
</template>
<script>
// import store from "@/store"
import {
  SendVerificationCode,
  codeVerification,
  register
} from "@/api/register.js"
import {getAccessPrivacyPolicyApi, hadRegister} from "@/api/login.js"
// import { WXCopyInfoToService, hadRegister } from "@/api/login.js"
// import { USER_INFO } from "@/const/storage-key"
import {basicUser} from "@/utils/user-class/basicUser"
import servicePackageUserAgreementWindow from "@/components/components/user-agreement-window/service-package-user-agreement-window.vue"
// import Base64 from "base-64"
import {TEAM_ID, WeChat_INFO} from "@/const/storage-key"

import {registrationAgreementHtml} from "@/const/registration-agreement.js"
import {getProvider, GetCodeForUseUniLogin} from "@/pages/login/wx-login.js"
// import {
//   // loginByWX,
//   getProvider,
//   GetCodeForUseUniLogin
// } from "@/pages/login/wx-login.js"
export default {
  data() {
    return {
      privacyrAgeementHtml: "",
      htmlData: "",
      scrollHeight: "50vh",
      // labelStyle: {
      //   fontSize: "32rpx",
      //   color: "#2A2B2F"
      // },
      autoStart: false,
      model: {
        identifier: "",
        credential: ""
      },
      seconds: 60,
      startText: "获取验证码",
      changeText: "x秒重新获取",
      endText: "重新获取",
      registerDisabled: true,
      verificationCodeDisabled: true,
      tips: "",
      checked: false,
      keepRunning: true,
      rules: {
        identifier: [
          {
            type: "number",
            required: true,
            len: 11,
            message: "请输入正确的手机号",
            pattern: /^1[3456789]\d{9}$/,
            trigger: ["change", "blur"]
          }
        ],
        credential: {
          type: "string",
          required: true,
          message: "请填写验证码",
          trigger: ["blur", "change"]
        }
      },
      sendPhone: true,
      loading: false,
      openWindow: false,
      code: "",
      open_id: ""
    }
  },
  options: {styleIsolation: "shared"},
  onShow() {
    // this.init()
    // this.getWXCode()
    this.accessPrivacyPolicy()
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  components: {
    servicePackageUserAgreementWindow
  },
  methods: {
    //获取隐私政策
    accessPrivacyPolicy() {
      getAccessPrivacyPolicyApi()
        .then(res => {
          this.privacyrAgeementHtml = res
        })
        .catch(err => {
          console.error("下载隐私政策失败", err)
        })
    },
    // async init() {
    //   try {
    //   } catch (e) {
    //     console.error("获取openid以及code的相关信息失败")
    //   }
    // },
    // 获取openID
    getOpenid() {
      return new Promise((resolve, reject) => {
        hadRegister(this.code)
          .then(res => {
            uni.setStorageSync(WeChat_INFO, res.data)
            this.open_id = res.data.openId
            resolve(res)
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    isAgree() {
      this.checked = !this.checked
    },
    checkboxChange() {
      this.checked = !this.checked
    },
    openHtmlWindow() {
      this.openWindow = true
    },

    // 电话号码发生改变
    changeNumber() {
      var str = this.model.identifier
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!myreg.test(str)) {
        // this.$util.Tips({
        //   title: "请输入正确的电话号码"
        // })

        this.verificationCodeDisabled = true
      } else {
        this.verificationCodeDisabled = false
      }
    },
    blurNumber() {
      var str = this.model.identifier
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!myreg.test(str)) {
        this.$util.Tips({
          title: "请输入正确的电话号码"
        })
      }
    },
    //输入验证码和电话号码进行点击登录
    numberAndvertionCodeLoginVerification() {
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      var credentialReg = /^[0-9]{6}$/
      if (!myreg.test(this.model.identifier)) {
        this.registerDisabled = true
        return
        // return this.$util.Tips({
        //   title: "请输入正确的电话号码"
        // })
      }
      if (!credentialReg.test(this.model.credential)) {
        this.registerDisabled = true
        return
        // return this.$util.Tips({
        //   title: "请输入正确的验证码"
        // })
      }
      this.registerDisabled = false
    },
    //输入验证码和电话号码进行点击登录
    blurNumberAndvertionCodeLoginVerification() {
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      var credentialReg = /^[0-9]{6}$/
      if (!myreg.test(this.model.identifier)) {
        this.registerDisabled = true
        return this.$util.Tips({
          title: "请输入正确的电话号码"
        })
      }
      if (!credentialReg.test(this.model.credential)) {
        this.registerDisabled = true
        return this.$util.Tips({
          title: "请输入正确的验证码"
        })
      }
      this.registerDisabled = false
    },

    async register() {
      let that = this

      try {
        if (this.isCheckagreeCheckbox()) {
          this.loading = true
          await getProvider()
          this.code = await GetCodeForUseUniLogin()
          await this.getOpenid()
          await this.ByPhoneNumberRegistration()
          let Obj = await this.SendUserSensitiveData()
          let res = await basicUser.UserPasswordOrPhoneLogin(Obj, "sms")
          await basicUser.setUserToken(res, that)
          await basicUser.getLoginUserInfo()
          this.loading = false
        }
      } catch (e) {
        this.loading = false
        uni.$u.toast(e.msg)
      }
    },
    isCheckagreeCheckbox() {
      if (!this.checked) {
        uni.$u.toast("请勾选用户协议")
        return false
      } else {
        return true
      }
    },
    // 采用手机号号码方式进行登录, 验证是否通过手机号的验证
    ByPhoneNumberRegistration() {
      return new Promise((resolve, reject) => {
        codeVerification(this.model)
          .then(res => {
            if (res.code === 200) {
              resolve(res)
            } else {
              reject(res)
              // uni.$u.toast(res.msg)
            }
          })
          .catch(err => {
            reject(err)
            // uni.$u.toast(err.msg)
          })
      })
    },

    // 回到微信登录
    tologinByWeiXin() {
      this.$Router.replace({
        path: "/login"
      })
    },
    close() {
      this.openWindow = !this.openWindow
    },
    codeChange(text) {
      this.tips = text
    },
    // 登录的方法
    getCode() {
      var str = this.model.identifier
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!myreg.test(str)) {
        this.$refs.uToast.show({
          type: "error",
          title: "请输入正确的电话号码"
        })
        return
      } else {
        this.verificationCodeDisabled = false
      }

      if (this.$refs.uCode.canGetCode) {
        uni.showLoading({
          title: "正在获取验证码"
        })
        SendVerificationCode(this.model)
          .then(res => {
            uni.hideLoading()
            if (res.code === 200) {
              uni.$u.toast(res.msg)
              this.model.credential = ""
              this.$refs.uCode.start()
            }
          })
          .catch(err => {
            uni.hideLoading()
            uni.$u.toast(err.msg)
          })
      } else {
        uni.$u.toast("操作太频繁")
      }
    },
    // 倒计时结束
    endCountdown() {
      this.autoStart = false
    },
    //获取用户信息

    SendUserSensitiveData() {
      return new Promise((resolve, reject) => {
        let Obj = {
          identifier: this.model.identifier,
          credential: this.model.credential,
          open_id: this.open_id,
          identityType: 1,
          teamId: uni.getStorageSync(TEAM_ID)
        }
        register(Obj)
          .then(res => {
            if (res.code === 200) {
              let Obj = {
                username: this.model.identifier,
                password: this.model.credential.toString(),
                open_id: this.open_id,
                teamId: uni.getStorageSync(TEAM_ID)
              }
              resolve(Obj)
            } else {
              reject(Obj)
            }
          })
          .catch(err => {
            reject(err)
          })
      })
    },
    registrationHtmlWindow() {
      this.openWindow = true
      this.htmlData = registrationAgreementHtml
    },
    privacyHtmlWindow() {
      this.openWindow = true
      this.htmlData = this.privacyrAgeementHtml
    }
  }
}
</script>
<style scoped lang="scss">
.register-box {
  // background: var(--bg-color-main);
  min-height: 100vh;
}
.phone-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
}
.left-first {
  display: flex;
  justify-content: flex-start;
  align-items: center;
}
.icon {
  width: 20rpx;
  height: 24rpx;
}
/deep/ .input-box {
  .u-input__input {
    color: #2a2b2f !important;
  }
}

.btn {
  color: #fff;
  background: #4381cf;
  margin-bottom: 30rpx;
  border-radius: 50rpx;
  font-size: 32rpx;
  padding: 10rpx 0;
}

.border {
  width: 2rpx;
  height: 40rpx;
  border: 2rpx solid #f0f1f3;
}
button::after {
  border: none;
}
.register {
  button[disabled]:not([type]) {
    background: #4381cf;
    color: #fff !important;
    opacity: 0.25;
  }
}

.right-item {
  button[disabled]:not([type]) {
    background: rgba(0, 0, 0, 0);
    color: #4381cf !important;
    opacity: 0.7;
  }
}

.contant {
  padding: 0 50rpx;
}
.login-form {
  padding-bottom: 60rpx;
}

/deep/ .verification-code-btn {
  position: absolute;
  right: 0;
  line-height: 45px;
  margin: 0;
  color: #4381cf;
  font-size: 32rpx;
  background: #ffffff;
  // button[disabled]:not([type]) {
  //   background: reba(00, 00, 00, 0);
  //   color: var(--theme-color-dark-blue) !important;
  // }
  /deep/ .u-size-default {
    background-color: transparent;
    padding: 0;
    margin: 0;
    position: static;
    border: 0;
    border-radius: 0;
  }
  /deep/ .u-size-default::after {
    border: none;
    color: #4381cf;
  }
  /deep/ .u-default-hover {
    color: #4381cf;
  }
}
/deep/ .u-input {
  width: 100%;
  display: inline-block;
  font-size: 32rpx;
}
.phone-view {
  width: 100%;
  // text-align: center;
  margin: 40rpx 0 20rpx 0;
  font-size: 52rpx;
  color: #2a2b2f;
}
.view-right {
  width: 60%;
  text-align: right;
  margin-top: 10rpx;
  font-size: 24rpx;
}
.right {
  display: flex;
  justify-content: flex-start;
  // align-items: center;
}
.right-first {
  width: 80%;
}
.right-item {
  display: inline-block;
  /deep/ .u-input__input {
    width: 100%;
    font-size: 32rpx;
  }
  button {
    width: 200rpx;
  }
}
.right-item-first {
  width: 100%;
  display: inline-block;
  vertical-align: bottom;
  /deep/ .u-input__input {
    width: 100%;
    font-size: 32rpx;
  }
}
button {
  padding: 0 !important;
  margin: 0;
  height: 90rpx;
  line-height: 90rpx;
}

.checkbox {
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: 20rpx;

  view {
    color: #9699a6;
    font-size: 24rpx;
    text-align: center;
    margin-left: -20rpx;
  }
  .text {
    color: #4381cf;
  }
}
.weixin-login {
  position: fixed;
  bottom: 120rpx;
  left: 50%;
  transform: translateX(-50%);
  width: 100rpx;
  height: 100rpx;
  border-radius: 100rpx;
  overflow: hidden;
  image {
    width: 100%;
    height: 100%;
  }
}
</style>
