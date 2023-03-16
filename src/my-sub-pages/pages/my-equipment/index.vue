<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="我的设备"></house-header>
      <view class="content">
        <view class="headBox">
          <view class="title">已绑定</view>
        </view>
        <view class="equipmentBox">
          <view
            class="itemBox"
            v-for="(item, index) in myEquipmentList"
            :key="index"
          >
            <view class="close-box" @click="clickunbinding(item)">
              <u-icon name="close-circle" size="40"></u-icon>
            </view>
            <view class="image-box">
              <image :src="item.images"></image>
            </view>
            <view class="itemBoxTitle">{{ item.name }}</view>
            <view class="model">{{ item.deviceIdentifier }}</view>
          </view>
        </view>
        <view
          class="empty"
          v-if="(!myEquipmentList || myEquipmentList.length == 0) && !loading"
        >
          <x-icon iconName="service-no-data"></x-icon>
        </view>
        <view class="loading-box" v-if="loading">
          <u-loading
            mode="circle"
            :show="loading"
            size="100"
            color="var(--theme-color-dark-blue)"
          ></u-loading>
        </view>
        <view class="form-css"></view>
        <view class="btnBox">
          <u-button type="primary" shape="circle" @click="goAddDevice"
            >添加设备</u-button
          >
        </view>
        <u-modal
          :mask-close-able="false"
          v-model="unbindingShow"
          :show-title="false"
          :show-confirm-button="false"
          :border-radius="30"
          class="model-box"
        >
          <view class="head">
            <view class="title">解绑设备</view>
            <u-icon
              name="close"
              class="close-css"
              @click="closeUnbinding()"
              color="var(--text-color-main)"
            ></u-icon>
          </view>
          <view class="formitem"> 您确定要解除绑定该设备吗 </view>
          <view class="sureBox">
            <u-button
              type="default"
              shape="circle"
              @click="closeUnbinding"
              throttle-time="1000"
            >
              取消
            </u-button>
            <u-button
              type="primary"
              shape="circle"
              @click="confirmUnbinding"
              throttle-time="1000"
            >
              确认
            </u-button>
          </view>
        </u-modal>
      </view>
    </view>
  </theme>
</template>
<script>
import { getBoundFacilityList } from "@/api/myEquipment.js"
import { unBindingEquipmentApi } from "@/api/myEquipment.js"
export default {
  data() {
    return {
      myEquipmentList: [],
      loading: true,
      unbindingShow: false,
      unbindingData: {}
    }
  },
  onShow() {
    this.onRoad()
  },
  methods: {
    onRoad() {
      let medicalCardId = uni.getStorageSync("userInfo").medicalCardList[0].id
      if (medicalCardId) {
        this.getBoundList(medicalCardId)
      }
    },
    getBoundList(medicalCardId) {
      getBoundFacilityList(medicalCardId).then(res => {
        if (res.code === 200) {
          this.loading = false
          this.myEquipmentList = res.data
        } else {
          this.loading = false
        }
      })
    },
    goAddDevice() {
      this.$Router.push({
        name: "myequipmentAddDevice"
      })
    },
    //点击解绑设备的事件
    clickunbinding(item) {
      this.unbindingData = item
      this.unbindingPromptVerification()
    },
    // 解绑设备的提示
    unbindingPromptVerification() {
      this.unbindingShow = true
    },
    confirmUnbinding() {
      this.closeUnbinding()
      this.unbinding()
    },
    closeUnbinding() {
      this.unbindingShow = false
    },
    //解绑设备
    unbinding() {
      let data = {
        deviceModel: this.unbindingData.deviceModel,
        deviceIdentifier: this.unbindingData.deviceIdentifier,
        medicalCardId: this.unbindingData.medicalCardId
      }
      unBindingEquipmentApi(data)
        .then(res => {
          if (res.code === 200) {
            this.onRoad()
            this.$refs.uToast.show({
              title: "已解绑改设备",
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
        .catch(err => {
          console.error(err)
        })
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
    background: var(--bg-color-second);
    margin: auto;
    .headBox {
      padding: 15px 0 10px 0;
      .title {
        font-size: 36rpx;
        color: var(--text-color-main);
        font-weight: 600;
        margin-bottom: 5px;
      }
      .explain {
        color: var(--text-color-grey);
      }
    }
    .equipmentBox {
      display: flex;
      justify-content: space-between;
      flex-direction: row;
      flex-wrap: wrap;
      margin-bottom: 10px;
      .itemBox {
        display: flex;
        flex-direction: column;
        width: 48.5%;
        background: var(--bg-color-main);
        padding: 10px;
        border-radius: 5px;
        margin-bottom: 11px;
        position: relative;
        .close-box {
          position: absolute;
          right: -15rpx;
          top: -15rpx;
        }
        .image-box {
          width: 120rpx;
          height: 120rpx;
          image {
            width: 100%;
            height: 100%;
          }
        }
        .itemBoxTitle {
          font-size: 30rpx;
          color: var(--text-color-main);
          padding: 8px 0 3px 0;
        }
        .model {
          font-size: 26rpx;
          color: var(--text-color-grey);
        }
      }
    }
    .empty {
      width: 95%;
      text-align: center;
      z-index: 200;
      position: fixed;
      background: var(--bg-color-second);
      padding-top: 40px;
    }
    .loading-box {
      width: 95%;
      margin: 50px auto auto;
      text-align: center;
      position: fixed;
      background: var(--bg-color-second);
      z-index: 201;
    }
    .form-css {
      width: 100%;
      height: 120rpx;
      background: var(--bg-color-second);
    }
    .btnBox {
      background: var(--bg-color-second);
      width: 100%;
      padding: 0 2.5% 20px 2.5%;
      margin: auto;
      position: fixed;
      bottom: 0;
      left: 0;
      right: 0;
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
    display: flex;
    justify-content: space-between;
    align-items: center;
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
