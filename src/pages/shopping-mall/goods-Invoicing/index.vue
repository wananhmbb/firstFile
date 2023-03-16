<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="开具发票"></house-header>
      <view class="content">
        <u-form
          :model="form"
          ref="uForm"
          label-width="200"
          :error-type="errorType"
          :border-bottom="false"
        >
          <view class="feedback">
            <view class="typeBox">
              <view class="title">抬头类型</view>
              <view class="radio-css">
                <u-radio-group v-model="radio">
                  <u-radio
                    v-for="(item, index) in radioList"
                    :key="index"
                    :name="item.name"
                    :disabled="item.disabled"
                    @change="radioChange"
                  >
                    {{ item.name }}
                  </u-radio>
                </u-radio-group>
              </view>
            </view>
          </view>
          <u-form-item
            label="发票抬头"
            :border-bottom="false"
            label-width="300"
            prop="invoiceHeader"
            ><u-input v-model="form.invoiceHeader"
          /></u-form-item>
          <u-form-item
            v-if="radio === '公司抬头'"
            label="发票税号"
            :border-bottom="false"
            label-width="300"
            prop="invoiceTaxNo"
            ><u-input v-model="form.invoiceTaxNo"
          /></u-form-item>
          <u-form-item
            label="开票金额"
            :border-bottom="false"
            label-width="300"
            prop="invoicedAmount"
            ><u-input v-model="form.invoicedAmount" :disabled="true"
          /></u-form-item>
          <view class="receiveMessagesBox"> 接收消息 </view>
          <u-form-item
            label="收件人"
            :border-bottom="false"
            label-width="300"
            prop="addressee"
            ><u-input v-model="form.addressee"
          /></u-form-item>
          <u-form-item
            label="联系电话"
            :border-bottom="false"
            label-width="300"
            prop="telphone"
            ><u-input v-model="form.telphone"
          /></u-form-item>
          <u-form-item
            label="电子邮箱"
            :border-bottom="false"
            label-width="300"
            prop="email"
            ><u-input v-model="form.email"
          /></u-form-item>
          <u-form-item
            label-position="top"
            prop="mailingAddress"
            label-width="300"
            label="邮寄地址"
            :border-bottom="false"
            :auto-height="true"
            height="70"
          >
            <view class="textareaBox"
              ><u-input v-model="form.mailingAddress" type="textarea" /> </view
          ></u-form-item>
        </u-form>
        <view class="form-css"></view>
        <view class="basicInfo padding1" v-if="IsSumbitButtonShow">
          <u-button
            type="primary"
            shape="circle"
            @click="Submit()"
            throttle-time="1000"
            >提交</u-button
          >
        </view>
      </view>
      <u-popup v-model="successShow" mode="bottom" border-radius="14">
        <view class="popupBox">
          <!-- <view class="closeBtn" @click="successShow = false"
            ><u-icon
              name="close-circle"
              size="50"
              color="var(--text-color-grey)"
            ></u-icon
          ></view> -->
          <view class="center">
            <u-icon
              name="checkmark-circle-fill"
              size="100"
              color="var(--theme-color-dark-blue)"
            ></u-icon>
            <view class="font1">提交成功</view>
            <view class="font2"
              >发票将以邮箱或邮寄形式发送给您，请注意查收</view
            >
          </view>
          <view class="basicInfo padding1" v-if="IsSumbitButtonShow">
            <u-button type="primary" shape="circle" @click="goback"
              >返回首页</u-button
            >
          </view>
        </view>
      </u-popup>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>

<script>
import { getAddressList } from "@/api/user.js"
import { goInvoice } from "@/api/order.js"
export default {
  data() {
    return {
      orderId: "",
      successShow: false,
      IsSumbitButtonShow: true,
      form: {
        invoiceHeader: "",
        invoiceTaxNo: "",
        invoicedAmount: "",
        addressee: "",
        telphone: "",
        email: "",
        mailingAddress: ""
      },
      rules: {
        invoiceHeader: [
          {
            required: true,
            message: "请输入发票抬头",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ],
        invoiceTaxNo: [
          {
            required: false,
            message: "请输入发票税号",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ],
        invoicedAmount: [
          {
            required: true,
            message: "请输入开票金额",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ],
        addressee: [
          {
            required: true,
            message: "请输入收件人",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ],
        telphone: [
          {
            required: true,
            message: "请输入联系电话",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          },
          {
            // 自定义验证函数，见上说明
            validator: (rule, value, callback) => {
              // 上面有说，返回true表示校验通过，返回false表示不通过
              // this.$u.test.mobile()就是返回true或者false的
              return this.$u.test.mobile(value)
            },
            message: "手机号码不正确",
            // 触发器可以同时用blur和change
            trigger: ["change", "blur"]
          }
        ],
        email: [
          {
            required: true,
            message: "请输入电子邮件",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          },
          {
            type: "email",
            message: "请输入正确的电子邮件",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ],
        mailingAddress: [
          {
            required: true,
            message: "请输入邮寄地址",
            // 可以单个或者同时写两个触发验证方式
            trigger: ["change", "blur"]
          }
        ]
      },
      errorType: ["toast"],
      radioList: [
        {
          name: "公司抬头",
          disabled: false
        },
        {
          name: "个人/非企业抬头",
          disabled: false
        }
      ],
      radio: "公司抬头"
    }
  },
  onLoad(option) {
    if (option) {
      if (option.IsSumbitButtonShow === "true") {
        this.IsSumbitButtonShow = true
      } else {
        this.IsSumbitButtonShow = false
      }
      this.form.invoicedAmount = option.price
      this.orderId = option.orderId
    }
    this.getEchoInfo()
    // console.log(this.form, option, "form")
  },
  methods: {
    // 选中某个单选框时，由radio时触发
    radioChange(e) {
      this.radio = e
      this.form.invoiceTaxNo = ""
    },
    //获取回显信息
    getEchoInfo() {
      getAddressList({
        page: 1,
        limit: 20
      }).then(res => {
        // console.log(res, "地址")
        if (res.code === 200) {
          let inEchoReceiveMessageInfo = res.data.list.filter(
            item => item.isDefault === true
          )
          if (inEchoReceiveMessageInfo.length > 0) {
            this.form.addressee = inEchoReceiveMessageInfo[0].realName
            this.form.mailingAddress =
              inEchoReceiveMessageInfo[0].province +
              inEchoReceiveMessageInfo[0].city +
              inEchoReceiveMessageInfo[0].district +
              inEchoReceiveMessageInfo[0].detail
            this.form.telphone = inEchoReceiveMessageInfo[0].phone
          }
        }
      })
      let invoiceInfo = uni.getStorageSync("invoiceInfo")
      if (invoiceInfo) {
        this.form.invoiceHeader = invoiceInfo.riseName
        this.form.invoiceTaxNo = invoiceInfo.dutyParagraph
        if (invoiceInfo.type === "1") {
          this.radio = "公司抬头"
        } else {
          this.radio = "个人/非企业抬头"
        }
        // console.log(invoiceInfo, "invoiceInfo")
      }
    },
    //返回
    goback() {
      uni.switchTab({ url: "/pages/tabbar/index/index" })
    },
    //提交
    Submit() {
      let dataobj = {
        orderId: this.orderId,
        price: this.form.invoicedAmount,
        type: this.radio === "公司抬头" ? "1" : "2",
        riseName: this.form.invoiceHeader,
        dutyParagraph: this.form.invoiceTaxNo,
        userName: this.form.addressee,
        phone: this.form.telphone,
        email: this.form.email,
        address: this.form.mailingAddress
      }
      this.$refs.uForm.validate(valid => {
        if (valid) {
          goInvoice(dataobj).then(res => {
            if (res.code === 200) {
              this.successShow = true
              uni.setStorageSync("invoiceInfo", dataobj)
            } else {
              this.$refs.uToast.show({
                title: res.msg,
                type: "primary"
              })
            }
          })
          console.log("验证通过")
        } else {
          console.log("验证失败")
        }
      })
    }
  },
  onReady() {
    this.$refs.uForm.setRules(this.rules)
  }
}
</script>

<style lang="scss" scoped>
.textareaBox {
  /deep/.u-input {
    text-align: left !important;
  }
}
/deep/.u-input {
  text-align: right !important;
}
/deep/.u-form-item {
  background: var(--bg-color-main) !important;
  padding: 10px 5% !important;
  border-bottom: 1px solid var(--bd-color-main) !important;
}
/deep/.u-form-item--left__content__label {
  color: var(--text-color-main) !important;
  font-size: 30rpx !important;
}
/deep/.u-form-item--right__content {
  color: var(--text-color-main) !important;
}
/deep/.u-radio {
  margin-left: 24rpx;
}
/deep/.u-radio__label {
  margin-right: 0 !important;
}
.radio-css {
  float: right;
}
.all {
  background: var(--bg-color-second);
  height: 100vh;
  .content {
    border-top: 1px solid var(--bd-color-main);
    .feedback {
      background-color: var(--bg-color-main);
      .typeBox {
        width: 90%;
        margin: auto;
        display: flex;
        height: 50px;
        align-items: center;
        background-color: var(--bg-color-main);
        justify-content: space-between;
        border-bottom: 1px solid var(--bd-color-main) !important;
        .title {
          font-size: 30rpx;

          color: var(--text-color-main);
        }
      }
    }
    .receiveMessagesBox {
      width: 90%;
      margin: auto;
      line-height: 50px;
      color: var(--text-color-grey);
    }
    .form-css {
      width: 100%;
      height: 70px;
      background: var(--bg-color-second);
    }
    .padding1 {
      padding: 15px 5%;
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 10;
    }
  }
  .popupBox {
    height: 800rpx;
    .closeBtn {
      position: absolute;
      top: 10px;
      right: 10px;
    }
    .center {
      padding-top: 250rpx;
      margin: auto;
      text-align: center;
      .font1 {
        font-size: 30rpx;
        font-weight: 600;
        padding: 15px 0;
      }
      .font1 {
        color: var(--text-color-main);
      }
    }
    .padding1 {
      padding: 15px 5%;
      position: fixed;
      bottom: 0;
      width: 100%;
      z-index: 10;
    }
  }
}
</style>
