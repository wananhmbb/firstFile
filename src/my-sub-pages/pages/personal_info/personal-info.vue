<template>
  <theme>
    <view class="all" slot="theme">
      <house-header class="head-two" headTypeTwo="个人资料"></house-header>
      <view class="info-list">
        <view class="info-item">
          <view class="info-title">头像</view>
          <view class="info-content" @click="chooseImg">
            <img :src="userInfo.avatar" @error="imgError($event)" />
            <u-icon
              class="icon"
              name="arrow-right"
              color="#C0C3CE"
              size="28"
            ></u-icon>
          </view>
        </view>
        <view class="info-item">
          <view class="info-title">手机号</view>
          <view class="info-content" @click="showPhone = false">
            <view class="info-personal">{{ userInfo.phone }}</view>
            <span class="no-arrow-right"></span>
          </view>
        </view>
        <view class="info-item">
          <view class="info-title">姓名</view>
          <view class="info-content" @click="showName = true">
            <view class="info-personal">{{ userInfo.nickname }}</view>
            <u-icon
              class="icon"
              name="arrow-right"
              color="#C0C3CE"
              size="28"
            ></u-icon>
          </view>
        </view>
        <view class="info-item">
          <view class="info-title">性别</view>
          <view class="info-content" @click="sexShow = true">
            <view class="info-personal">{{
              userInfo.sex == 0 ? "男" : "女"
            }}</view>
            <u-icon
              class="icon"
              name="arrow-right"
              color="#C0C3CE"
              size="28"
            ></u-icon>
          </view>
        </view>
        <view class="info-item">
          <view class="info-title">出生日期</view>
          <view class="info-content" @click="pickTime">
            <view class="info-personal">{{ userInfo.birthday }}</view>
            <u-icon
              class="icon"
              name="arrow-right"
              color="#C0C3CE"
              size="28"
            ></u-icon>
            <l-picker
              mode="time"
              v-model="pickTimeshow"
              :params="params"
              @confirm="confirmTime"
              :end-year="endyear"
            ></l-picker>
          </view>
        </view>
      </view>
      <!-- 手机号 -->
      <u-popup
        v-model="showPhone"
        :mode="modePhone"
        :closeable="closeablePhone"
        :border-radius="roundPhone"
      >
        <view class="phone-content">
          <text class="title">手机号</text>
          <u-form :model="form" ref="uForm">
            <u-form-item :border-bottom="false" prop="phoneValue">
              <u-input
                v-model="form.phoneValue"
                placeholder="请输入手机号"
                :maxlength="11"
            /></u-form-item>
            <u-form-item :border-bottom="false" prop="code">
              <view class="code-css">
                <u-input
                  v-model="form.code"
                  placeholder="请输入验证码"
                  :maxlength="6"
                /><view class="wrap">
                  <u-toast ref="uToast"></u-toast>
                  <u-verification-code
                    :seconds="seconds"
                    :start-text="startText"
                    :change-text="changeText"
                    :end-text="endText"
                    @end="end"
                    @start="start"
                    ref="uCode"
                    @change="codeChange"
                  ></u-verification-code>
                  <u-button @click="getCode" class="code-btn">{{
                    tips
                  }}</u-button>
                </view>
              </view>
            </u-form-item>
          </u-form>
          <view class="btn">
            <u-button type="primary" @click="submit">提交</u-button>
          </view>
        </view>
      </u-popup>
      <!-- 姓名 -->
      <u-popup
        v-model="showName"
        :mode="modeName"
        :closeable="closeableName"
        :border-radius="roundName"
      >
        <view class="name-content">
          <text class="title">姓名</text>
          <u-input
            class="input-value"
            v-model="nameValue"
            :placeholder="'请输入姓名'"
            :type="typeName"
            :maxlength="11"
          />
          <view class="btn">
            <u-button type="primary" @click="submitName">提交</u-button>
          </view>
        </view>
      </u-popup>

      <!-- 性别 -->
      <l-picker
        mode="selector"
        v-model="sexShow"
        :default-selector="[userInfo.sex]"
        :range="selector"
        @confirm="confirmSex"
        @cancel="cancelSex"
      ></l-picker>

      <u-toast ref="uToast"></u-toast>
    </view>
  </theme>
</template>
<script>
import LPicker from "@/components/basic-components/l-picker/l-picker"
import { SendVerificationCode } from "@/api/register.js"
import {
  USER_INFO,
  ACCESS_TOKEN,
  WeChat_INFO,
  REFRESH_TOKEN,
  EXPIRES_IN
} from "@/const/storage-key"
import { userInfoEdit, logout } from "@/api/user"
export default {
  components: {
    LPicker
  },
  data() {
    return {
      fileList: [],
      params: {
        year: true,
        month: true,
        day: true
      },
      endyear: "",
      pickTimeshow: false,
      //手机号
      showPhone: false,
      modePhone: "center",
      closeablePhone: true,
      roundPhone: "30",
      typePhone: "number",
      form: {
        phoneValue: "",
        code: ""
      },
      tips: "",
      seconds: 60,
      startText: "获取验证码",
      changeText: "x秒",
      endText: "重新获取",
      rules: {
        phoneValue: [
          {
            type: "number",
            required: true,
            len: 11,
            message: "请输入正确的手机号",
            pattern: /^1[3456789]\d{9}$/,
            trigger: ["blur", "change"]
          }
        ],
        code: {
          type: "string",
          required: true,
          message: "请填写验证码",
          trigger: ["blur", "change"]
        }
      },
      //姓名
      showName: false,
      modeName: "center",
      closeableName: true,
      roundName: "30",
      typeName: "text",
      nameValue: "",
      //时间
      startTime: "",
      endTime: "",
      //性别
      sexShow: false,
      selector: ["男", "女"],
      defaultSelector: [0],
      userInfo: {}
    }
  },
  onLoad() {
    this.userInfo = uni.getStorageSync(USER_INFO)
    let startTime = new Date()
    let nowYear = startTime.getFullYear()
    this.endyear = nowYear
  },
  options: { styleIsolation: "shared" },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  },
  methods: {
    //图片加载失败 显示默认图片
    imgError(e) {
      console.log("图片加载失败", e)
      this.userInfo.avatar =
        "https://dailydev.oss-cn-chengdu.aliyuncs.com/416/image-icon/my_img_user.png"
    },
    //修改头像
    chooseImg() {
      uni.chooseImage({
        count: 1, //默认9
        sizeType: ["original", "compressed"], //可以指定是原图还是压缩图，默认二者都有
        sourceType: ["album"], //从相册选择
        success: res => {
          uni.showLoading({
            mask: true,
            title: "上传中..."
          })
          let obj = {
            Authorization: "Bearer " + uni.getStorageSync(ACCESS_TOKEN)
          }
          const tempFilePaths = res.tempFilePaths
          uni.uploadFile({
            url: process.env.VUE_APP_BASE_API_IP + "file/upload",
            header: obj,
            filePath: tempFilePaths[0],
            name: "file",
            success: uploadFileRes => {
              let uploadRes = JSON.parse(uploadFileRes.data)
              console.log(uploadRes.data.url)
              if (uploadRes.code === 200) {
                let params = {
                  userId: this.userInfo.user_id,
                  avatar: uploadRes.data.url
                }
                userInfoEdit(params)
                  .then(res => {
                    if (res.code === 200) {
                      uni.hideLoading()
                      this.userInfo.avatar = uploadRes.data.url
                      uni.setStorageSync(USER_INFO, this.userInfo)
                      setTimeout(() => {
                        this.$refs.uToast.show({
                          title: res.msg,
                          type: "success"
                        })
                      }, 500)
                    } else {
                      uni.hideLoading()
                      this.$refs.uToast.show({
                        title: "修改失败",
                        type: "error"
                      })
                    }
                  })
                  .catch(err => {
                    uni.hideLoading()
                    this.$refs.uToast.show({
                      title: "修改失败",
                      type: "error"
                    })
                  })
              }
            },
            fail: err => {
              uni.hideLoading()
              this.$refs.uToast.show({
                title: "修改失败",
                type: "error"
              })
            }
          })
        }
      })
    },
    // 验证码
    getCode() {
      var str = this.form.phoneValue
      var myreg = /^[1][3,4,5,7,8,9][0-9]{9}$/
      if (!myreg.test(str)) {
        this.$refs.uToast.show({
          type: "error",
          title: "请输入正确的电话号码"
        })
        return
      }
      if (this.$refs.uCode.canGetCode) {
        uni.showLoading({
          title: "正在获取验证码"
        })
        SendVerificationCode(this.form)
          .then(res => {
            uni.hideLoading()
            if (res.code === 200) {
              uni.$u.toast("验证码已发送")
              this.form.code = ""
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
      //   } else {
      //     uni.$u.toast(errorsRes[0].message)
      //   }
      // })
    },
    end() {
      this.$u.toast("倒计时结束")
    },
    start() {
      this.$u.toast("倒计时开始")
    },
    codeChange(text) {
      this.tips = text
    },
    //修改手机号
    submit() {
      this.$refs.uForm.validate(valid => {
        if (valid) {
          let params = {
            userId: this.userInfo.user_id,
            phone: this.form.phoneValue,
            code: this.form.code
          }
          userInfoEdit(params)
            .then(res => {
              this.showPhone = false
              if (res.code === 200) {
                this.userInfo.phone = this.form.phoneValue
                uni.setStorageSync(USER_INFO, this.userInfo)
                this.form.phoneValue = ""
                this.form.code = ""
                this.$refs.uToast.show({
                  title: "修改成功，退出登录",
                  type: "success",
                  duration: 500
                })
                logout().then(res => {
                  if (res.code == 200) {
                    uni.setStorageSync(ACCESS_TOKEN, "")
                    uni.setStorageSync(REFRESH_TOKEN, "")
                    uni.setStorageSync(EXPIRES_IN, "")
                    uni.setStorageSync(USER_INFO, "")
                    uni.setStorageSync(WeChat_INFO, "")
                    setTimeout(() => {
                      uni.switchTab({ url: "/pages/tabbar/index/index" })
                    }, 1000)
                  }
                })
              }
            })
            .catch(err => {
              this.showPhone = false
              this.form.phoneValue = ""
              this.form.code = ""
              this.$refs.uToast.show({
                title: "修改失败",
                type: "error"
              })
            })
        }
      })
    },
    //修改姓名
    submitName() {
      let params = {
        userId: this.userInfo.user_id,
        nickname: this.nameValue
      }
      userInfoEdit(params)
        .then(res => {
          this.showName = false
          if (res.code === 200) {
            this.userInfo.nickname = this.nameValue
            uni.setStorageSync(USER_INFO, this.userInfo)
            this.nameValue = ""
            setTimeout(() => {
              this.$refs.uToast.show({
                title: res.msg,
                type: "success"
              })
            }, 500)
          }
        })
        .catch(err => {
          this.showName = false
          this.nameValue = ""
          this.$refs.uToast.show({
            title: "修改失败",
            type: "error"
          })
        })
    },
    //时间
    confirmTime(e) {
      this.userInfo.birthday = e.year + "-" + e.month + "-" + e.day
      let params = {
        userId: this.userInfo.user_id,
        birthday: this.userInfo.birthday
      }
      userInfoEdit(params)
        .then(res => {
          if (res.code === 200) {
            uni.setStorageSync(USER_INFO, this.userInfo)
            setTimeout(() => {
              this.$refs.uToast.show({
                title: res.msg,
                type: "success"
              })
            }, 500)
          }
        })
        .catch(err => {
          this.$refs.uToast.show({
            title: "修改失败",
            type: "error"
          })
        })
    },
    cancelTime() {},
    //性别
    confirmSex(data) {
      this.defaultSelector = [data[0]]
      let params = {
        userId: this.userInfo.user_id,
        sex: data[0]
      }
      userInfoEdit(params)
        .then(res => {
          if (res.code === 200) {
            this.userInfo.sex = data[0]
            uni.setStorageSync(USER_INFO, this.userInfo)
            setTimeout(() => {
              this.$refs.uToast.show({
                title: res.msg,
                type: "success"
              })
            }, 500)
          }
        })
        .catch(err => {
          this.$refs.uToast.show({
            title: "修改失败",
            type: "error"
          })
        })
    },
    cancelSex() {},
    //时间
    pickTime() {
      this.pickTimeshow = true
    }
  }
}
</script>
<style scoped lang="scss">
.no-arrow-right {
  display: inline-block;
  width: 28rpx;
  height: 28rpx;
}
.all {
  height: 100vh;
  background: var(--bg-color-second);
}
.info-list {
  background: var(--bg-color-main);
  border-top: 1px solid var(--bg-color-second);
  color: var(--text-color-main);
  .info-item {
    display: flex;
    align-items: center;
    margin: 0 30rpx;
    padding: 20rpx 0;
    border-bottom: 1px solid var(--bd-color-main);
    height: 100rpx;
    .info-title {
      font-size: 32rpx;
      flex: 1;
    }
    .info-content {
      flex: 2;
      text-align: right;
      /deep/ .u-list-item {
        width: 96rpx !important;
        height: 96rpx !important;
        border-radius: 50% !important;
        vertical-align: middle !important;
        margin-right: 20rpx !important;
      }
      image {
        width: 96rpx !important;
        height: 96rpx !important;
        border-radius: 50% !important;
        vertical-align: middle !important;
        margin-right: 20rpx !important;
      }
      .info-personal {
        display: inline;
        vertical-align: middle;
        margin-right: 10rpx;
        font-size: 30rpx;
        color: #9699a6;
      }
      .icon {
        vertical-align: middle;
      }
    }
  }
}
.phone-content {
  height: 600rpx !important;
  background: var(--bg-color-second);
}
.phone-content,
.name-content {
  width: 500rpx;
  height: 400rpx;
  background: var(--bg-color-second);
  border: 1px solid var(--bd-color-main);
  .title {
    display: block;
    text-align: center;
    font-size: 32rpx;
    font-weight: 600;
    height: 80rpx;
    line-height: 80rpx;
    margin-bottom: 50rpx;
    color: var(--text-color-main);
  }
  .btn {
    width: 80%;
    margin: 50rpx auto;
  }
  /deep/ .u-input__input {
    margin: 0 40rpx;
    border-bottom: 1px solid #f1f1f1;
    color: var(--text-color-main);
  }
  /deep/ .u-btn {
    border-radius: 50rpx;
  }
}
.code-css {
  display: flex;
  align-items: center;
  /deep/ .u-input__input {
    width: 260rpx;
    margin-right: 10rpx;
  }
}
.code-btn {
  /deep/ .u-size-default {
    background-color: transparent;
    padding: 0;
    margin: 0;
    position: static;
    border: 0;
    border-radius: 0;
    color: var(--theme-color-dark-blue);
  }
  /deep/ .u-size-default::after {
    border: none;
  }
}
</style>
