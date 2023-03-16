<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="我的设备"></house-header>
      <view
        class="content"
        v-if="Object.keys(equipmentDetailsInfo).length !== 0"
      >
        <view class="headBox">
          <view class="title">连接设备</view>
          <!-- <view class="explain">长按3秒侧面按键即可连接</view> -->
        </view>
        <scroll-view
          :scroll-y="true"
          scroll-with-animation="true"
          :scroll-top="0"
          class="wrap"
          :style="{ height: equipmentBoxHeight + 'px' }"
        >
          <view class="equipmentBox">
            <richTextComponent
              :htmlData="equipmentDetailsInfo.tips"
            ></richTextComponent>
          </view>
        </scroll-view>
        <view class="btnBox">
          <view class="btnBox-text" @click="equipmentDetails">设备详情>></view>
          <view class="button" @click="bindDevices">连接设备</view>
        </view>
        <u-modal
          :mask-close-able="false"
          v-model="inputShow"
          :show-title="false"
          :show-confirm-button="false"
          :border-radius="30"
          class="model-box"
        >
          <view class="head">
            <view class="title">设备编码</view>
            <u-icon
              name="close"
              class="close-css"
              @click="closeModal()"
              color="var(--text-color-main)"
            ></u-icon>
          </view>
          <view class="formitem">
            <u-input
              :border="true"
              :clearable="false"
              v-model="equipmentCode"
              placeholder="请输入设备编码"
            />
          </view>
          <view class="sureBox">
            <u-button
              type="primary"
              shape="circle"
              @click="confirm"
              throttle-time="1000"
            >
              确认
            </u-button>
          </view>
        </u-modal>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
import { getEquipmentDetails, connectingEquipment } from "@/api/myEquipment.js"
export default {
  data() {
    return {
      equipmentDetailsId: "",
      equipmentDetailsInfo: {},
      deviceModel: "",
      deviceIdentifier: "",
      inputShow: false,
      equipmentCode: "",
      equipmentBoxHeight: null
    }
  },
  onShow() {
    this.equipmentBoxHeight =
      wx.getSystemInfoSync().windowHeight -
      this.$store.state.theme.mescrollUniHeight -
      90 -
      80 -
      15 -
      25
  },
  onLoad(options) {
    this.equipmentDetailsId = options.equipmentDetailsId
    if (this.equipmentDetailsId) {
      this.getEquipmentDetailsInfo(this.equipmentDetailsId)
    }
  },
  methods: {
    getEquipmentDetailsInfo(equipmentDetailsId) {
      getEquipmentDetails(equipmentDetailsId).then(res => {
        if (res.code === 200) {
          this.deviceModel = res.data.model
          this.equipmentDetailsInfo = res.data
        }
      })
    },
    equipmentDetails() {
      this.$Router.push({
        name: "equipmentDetailsPage",
        params: {
          equipmentDetailsId: this.equipmentDetailsId
        }
      })
    },
    //绑定设备
    bindDevices() {
      this.inputShow = true
    },
    confirm() {
      let data = {
        deviceModel: this.deviceModel,
        deviceIdentifier: this.equipmentCode,
        medicalCardId: uni.getStorageSync("userInfo").medicalCardList[0].id
      }
      connectingEquipment(data).then(res => {
        this.closeModal()
        if (res.code === 200) {
          this.$refs.uToast.show({
            title: "绑定成功",
            type: "success",
            icon: false
          })
        } else {
          this.$refs.uToast.show({
            title: res.msg,
            type: "error",
            icon: false
          })
        }
      })
    },
    //关闭弹窗
    closeModal() {
      this.inputShow = false
      this.equipmentCode = ""
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  width: 100%;
  min-height: 100vh;
  background: var(--bg-color-second);
  .content {
    width: 95%;
    margin: auto;
    .headBox {
      max-height: 80px;
      border-bottom: 1px solid #eeeff0;
      .title {
        font-size: 36rpx;
        color: var(--text-color-main);
        font-weight: 600;
        margin: 10px 0;
      }
      .explain {
        margin-bottom: 10px;
        color: var(--text-color-grey);
      }
    }
    .wrap {
      padding-bottom: 10px;
      margin-top: 15px;
    }
    .form-css {
      margin-top: 10px;
      width: 100%;
      height: 160rpx;
      background: var(--bg-color-second);
    }
    .btnBox {
      background: var(--bg-color-second);
      width: 95%;
      margin: auto;
      position: fixed;
      bottom: 20px;
      .btnBox-text {
        line-height: 30px;
        text-align: center;
        color: var(--theme-color-dark-blue);
        margin-bottom: 5px;
      }
      .button {
        width: 100%;
        line-height: 40px;
        text-align: center;
        border-radius: 30px;
        background: var(--theme-color-dark-blue);
        color: #fff;
      }
    }
  }
}
.model-box {
  /deep/.u-model {
    border-radius: 30rpx;
    overflow: hidden;
    background: var(--bg-color-second) !important;
  }
  .sureBox {
    width: 80%;
    margin: 30px auto 20px auto;
  }

  .formitem {
    width: 90%;
    margin: auto;
    padding: 20px 30px 30px 30px;
    /deep/ .u-form-item__message {
      padding: 0 !important;
    }
    /deep/ .u-input__input {
      color: var(--text-color-main);
    }
  }
  .head {
    width: 100%;
    display: flex;
    .title {
      padding: 15px 0;
      margin: auto;
      font-size: 32rpx;
      font-weight: bolder;
      color: var(--text-color-main);
    }
    .close-css {
      padding: 5px;
      position: absolute;
      top: 8px;
      right: 8px;
    }
  }
}
</style>
