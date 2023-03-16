<template>
  <theme>
    <view class="all" slot="theme">
      <house-header headTypeTwo="连接设备"></house-header>
      <view class="content">
        <view>
          <video
            class="video"
            :show-fullscreen-btn="true"
            :autoplay="true"
            src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/2f6f1817a6cd4dd530d6b3c12920fa1e.mp4"
          ></video>
        </view>
        <view class="textBox">
          <view class="usageMethod">使用方法:</view>
          <view class="record">● 在胸带背部电极区域涂抹少量的水</view>
          <view class="record">● 保持心率感应器正向佩戴</view>
          <view class="record">● 佩戴心率带,确保潮湿的电极区域紧贴皮肤</view>
          <view class="record">● 连接前请正确佩戴心率带，否则无法搜索到信号</view>
        </view>
        <view class="imageTitle">男女士正确佩戴图:</view>
        <view class="imageBox">
          <image src="https://hjt20220307.oss-cn-chengdu.aliyuncs.com/image/21b6b6b8fe8c246fe95aed6d60ba09c.png"></image>
        </view>
        <view class="form-css"></view>
        <view class="BtnBox">
          <view class="startSportBtn" @click="withEquipment">连接蓝牙<u-loading mode="circle" :show="showLoading"></u-loading></view>
          <view class="startSportBtn" @click="noEquipment">无设备</view>
        </view>
      </view>
      <u-toast ref="uToast" />
    </view>
  </theme>
</template>
<script>
export default {
  data() {
    return {
      showLoading: false,
      reconnectState: true,
      current: null,
      prescribeId: "",
      prescribeName: "",
      servicePackageUserId: "",
      routered: true
    }
  },
  onShow() {
    const prePage = uni.getStorageSync("pageVideo")
    if (prePage === "video") {
      this.routered = true
      uni.closeBluetoothAdapter()
    }
  },
  onLoad() {
    this.current = this.$Route.query.current
    this.prescribeId = this.$Route.query.prescribeId
    this.prescribeName = this.$Route.query.prescribeName
    this.servicePackageUserId = this.$Route.query.servicePackageUserId
  },
  methods: {
    withEquipment() {
      this.showLoading = true
      this.opentDeviceInfo()
    },
    noEquipment() {
      this.$Router.push({
        name: "videoPage",
        params: {
          prescribeId: this.prescribeId,
          twoInputShow: true,
          servicePackageUserId: this.servicePackageUserId,
          prescribeName: this.headTitle,
          current: this.current,
          haveEquipment: false
        }
      })
    },
    opentDeviceInfo() {
      const _this = this
      // 初始化蓝牙设备
      uni.openBluetoothAdapter({
        success: function () {
          _this.getAllDevice()
        },
        fail: function () {
          // uni.showToast({ title: "蓝牙打开失败，请手动打开", icon: "none" })
          console.log("蓝牙打开失败，请手动打开")
          _this.$refs.uToast.show({
            title: "蓝牙打开失败，请手动打开",
            type: "error",
            icon: false
          })
          _this.showLoading = false
          // 如果蓝牙没有打开，那就监听蓝牙状态,直到蓝牙打开
          uni.onBluetoothAdapterStateChange(res => {
            if (res.available) {
              _this.getAllDevice()
            }
          })
        }
      })
    },
    // 检测所有可设备
    getAllDevice() {
      const _this = this
      uni.startBluetoothDevicesDiscovery({
        success() {
          uni.onBluetoothDeviceFound(function (devices) {
            if (devices.devices instanceof Array) {
              devices.devices.forEach(res => {
                if (res.name) {
                  let flag = false
                  if (res.advertisServiceUUIDs instanceof Array) {
                    res.advertisServiceUUIDs.forEach(resp => {
                      if (resp.indexOf("0000180") > -1) {
                        flag = true
                      }
                    })
                  }
                  if (flag) {
                    _this.getConnectDevice(res.deviceId)
                    return
                  } else {
                    setTimeout(function () {
                      const prePage = uni.getStorageSync("pageVideo")
                      if (prePage !== "video") {
                        _this.$refs.uToast.show({
                          title: "没有检测到心率带",
                          type: "error",
                          icon: false
                        })
                      }
                      uni.stopBluetoothDevicesDiscovery()
                      _this.showLoading = false
                    }, 15000)
                  }
                }
              })
            }
          })
        },
        fail() {
          _this.$refs.uToast.show({
            title: "搜寻附近的蓝牙外围设备失败,请把设备靠近蓝牙",
            type: "error",
            icon: false
          })
          _this.showLoading = false
          console.log("搜寻附近的蓝牙外围设备失败,请把设备靠近蓝牙")
        }
      })
    },
    //  创建连接
    getConnectDevice(deviceId) {
      const _this = this
      uni.createBLEConnection({
        deviceId: deviceId,
        success: function () {
          _this.reconnectState = true
          setTimeout(function () {
            _this.getDeviceService(deviceId)
            _this.onStateChange(deviceId)
          }, 2000)
        },
        fail: function () {
          if (_this.reconnectState) {
            console.log("连接设备失败,请检查蓝牙和设备状态")
            _this.$refs.uToast.show({
              title: "连接设备失败,请检查蓝牙和设备状态",
              type: "error",
              icon: false
            })
            _this.showLoading = false
          }
        }
      })
    },
    //   监听蓝牙设备状态
    onStateChange(deviceId) {
      const _this = this
      let time
      uni.onBLEConnectionStateChange(function (res) {
        // 该方法回调中可以用于处理连接意外断开等异常情况
        const prePage = uni.getStorageSync("pageVideo")
        if (!res.connected && prePage !== "video") {
          uni.clearStorageSync("pageVideo")
          _this.$refs.uToast.show({
            title: "连接断开，请重新连接",
            type: "error",
            icon: false
          })
          _this.showLoading = false
          console.log("连接断开，请重新连接")
          let Str = "连接断开"
          _this.$store.commit("getHeartRateValue", Str)
          _this.reconnectState = false
          time = setInterval(function () {
            if (!_this.reconnectState) {
              _this.getConnectDevice(deviceId)
            } else {
              clearInterval(time)
            }
          }, 3000)
        }
      })
    },
    //   获取设备的所有服务
    getDeviceService(deviceId) {
      const _this = this
      uni.getBLEDeviceServices({
        deviceId: deviceId,
        success: function (res) {
          uni.stopBluetoothDevicesDiscovery()
          _this.getDeviceServiceCharacter(deviceId, res.services[0].uuid)
        },
        fail: function () {
          // uni.showToast({ title: "获取设备的所有服务值失败", icon: "error" })
          console.log("获取设备的所有服务值失败")
          _this.$refs.uToast.show({
            title: "获取设备的所有服务值失败",
            type: "error",
            icon: false
          })
          _this.showLoading = false
        }
      })
    },
    // 获取所有服务的特征值
    getDeviceServiceCharacter(deviceId, serviceId) {
      const _this = this
      uni.getBLEDeviceCharacteristics({
        deviceId: deviceId,
        serviceId: serviceId,
        success: res => {
          if (deviceId && serviceId && res.characteristics[0].uuid) {
            _this.showLoading = false
            if (this.routered) {
              this.routered = false
              _this.$Router.push({
                name: "videoPage",
                params: {
                  prescribeId: _this.prescribeId,
                  twoInputShow: true,
                  servicePackageUserId: _this.servicePackageUserId,
                  prescribeName: _this.headTitle,
                  current: _this.current,
                  haveEquipment: true
                }
              })
            }
            _this.getDeviceServiceVal(deviceId, serviceId, res.characteristics[0].uuid)
          }
        },
        fail() {
          // uni.showToast({ title: "获取设备的所有特征值失败", icon: "error" })
          console.log("获取设备的所有特征值失败")
          _this.$refs.uToast.show({
            title: "获取设备的所有特征值失败",
            type: "error",
            icon: false
          })
          _this.showLoading = false
        }
      })
    },
    //  根据特征值来监听数据
    getDeviceServiceVal(deviceId, serviceId, characteristicId) {
      const _this = this
      uni.notifyBLECharacteristicValueChange({
        state: true,
        deviceId,
        serviceId,
        characteristicId,
        success(res) {
          uni.onBLECharacteristicValueChange(res => {
            let dataView = new DataView(res.value)
            let result
            let flags = dataView.getUint8(0)
            if (flags & 0x1) {
              result = dataView.getUint16(1, true)
            }
            result = dataView.getUint8(1)
            _this.$store.commit("getHeartRateValue", result)
            console.log("心率值", result)
            // _this.$store.commit("getHeartRateValue", _this.getheartRateValue(_this.ab2hex(res.value)))
            // console.log("心率值", _this.ab2hex(res.value))
          })
          _this.showLoading = false
        },
        fail(err) {
          _this.$refs.uToast.show({
            title: "根据特征值来监听心率数据错误",
            type: "error",
            icon: false
          })
          _this.showLoading = false
          console.log("根据特征值来监听数据值错误", err)
        }
      })
    },
    //ArrayBuffer转16进度字符串示例
    ab2hex(buffer) {
      return Array.prototype.map.call(new Uint8Array(buffer), function (bit) {
        return ("00" + bit.toString(10)).slice(-2)
      })
    },
    //获取心率第二位值
    getheartRateValue(item) {
      return item[1]
    }
  }
}
</script>
<style lang="scss" scoped>
.all {
  width: 100%;
  height: 100%;
  background: var(--bg-color-main);
}
.video {
  width: 100%;
}
.BtnBox {
  width: 100%;
  padding: 10px 2.5% 20px 2.5%;
  margin: auto;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
  display: flex;
  justify-content: space-between;
  background: var(--bg-color-second);
  .startSportBtn {
    width: 48%;
    line-height: 90rpx;
    border-radius: 30px;
    background: cornflowerblue;
    color: #ffff;
    font-size: 34rpx;
    text-align: center;
  }
}
.imageBox {
  width: 90%;
  height: 360rpx;
  margin: auto;
  background: var(--bg-color-main);
  image {
    width: 100%;
    height: 100%;
  }
}
.form-css {
  width: 100%;
  height: 85px;
  background: var(--bg-color-main);
}
.textBox {
  background: var(--bg-color-main);
  width: 90%;
  margin: 25px auto auto;
  color: var(--text-color-main);
  .usageMethod {
    font-size: 40rpx;
    font-weight: bold;
    margin-bottom: 12px;
  }
  .record {
    font-size: 30rpx;
    margin-bottom: 5px;
  }
}
.imageTitle {
  background: var(--bg-color-main);
  color: var(--text-color-main);
  font-size: 30rpx;
  width: 90%;
  font-weight: bold;
  margin: 25px auto 5px auto;
}
</style>
